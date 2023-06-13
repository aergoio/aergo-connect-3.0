<template>
  <ul class="nav-account-list" v-if="accounts" :style="{ overflow: accountsCheck }">
    <li
      v-for="account in accounts"
      :key="account.key"
      class="nav-account-item"
      @click.capture="$emit('select', account)"
    >
      <div :class="$store.state.accounts.address === account.address ? 'active' : ''">
        <AccountItem :address="account.address" :nickname="account.nick" />
      </div>
    </li>
  </ul>
  <div v-else class="nav-account-list">
    <div class="nav-account-item" @click.capture="$emit('select', account)">
      <div :class="$store.state.accounts.address === account.address ? 'active' : ''"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Account } from '@herajs/wallet';
import { Amount } from '@herajs/client';
import { groupBy } from '../../utils/group-by';
import { isPublicChainId } from '../../config';
import AccountItem from '@aergo-connect/lib-ui/src/items/AccountItem.vue';

export default Vue.extend({
  components: {
    AccountItem,
  },
  props: {
    accounts: {
      type: Object,
    },
    account: {
      type: Object,
    },
    groupByChain: {
      type: Boolean,
      default: true,
    },
    highlightNew: {
      type: Boolean,
      default: true,
    },
    accountRoute: {
      type: String,
      default: 'account-details',
    },
    balanceListRoute: {
      type: String,
      default: 'balance-list',
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
    isAccountsListOpened: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      activeAccount: {} as Account,
      accountsCheck: '',
    };
  },
  watch: {
    accountsCheck() {
      return this.accountListCheck();
    },
  },
  computed: {
    sortedAccounts(): any[] {
      const accounts = [...this.accounts].filter((account) => typeof account.data !== 'undefined');
      // Order by address A-Z

      accounts.sort((a, b) => a.data.spec?.address?.localeCompare(b.data.spec?.address));
      // Order by balance, reversed

      accounts.sort((a, b) =>
        !a.data ? 0 : -new Amount(a.data.balance).compare(new Amount(b.data.balance)),
      );

      // Order by chainID A-Z. This does not affect the groupBy, it just orders the groups alphabetically (e.g. aergo.io < testnet.aergo.io)
      accounts.sort((a, b) =>
        !a.data ? 0 : a.data.spec?.chainId?.localeCompare(b.data.spec.chainId),
      );
      // Order the most recent accounts first, but only if they are new
      if (this.highlightNew) {
        accounts.sort((a, b) => {
          // Use 0 for non-new accounts to not affect order, otherwise the added timestamp
          const addedA =
            this.isNew(a) && typeof a.data.added === 'string' ? +new Date(a.data.added) : 0;
          const addedB =
            this.isNew(b) && typeof b.data.added === 'string' ? +new Date(b.data.added) : 0;
          return -(addedA - addedB);
        });
      }
      return accounts;
    },

    accountsByChainId() {
      if (this.groupByChain === false) return [['ALL', this.sortedAccounts]];
      const result = groupBy(this.sortedAccounts, (item) => item?.data?.spec?.chainId || '');
      return Array.from(result);
    },
  },
  methods: {
    nick(address: string) {
      const key = address.substr(0, 5);
      let nick = '';
      try {
        nick = localStorage.getItem(key);
      } catch (error) {
        nick = key;
      }
      if (!nick) nick = key;

      return nick;
    },

    isPublicChainId(chainId: string) {
      return isPublicChainId(chainId);
    },

    isNew(account: Account) {
      if (!this.highlightNew) return false;
      const MaxAge = 1000 * 60 * 5; // 5 min
      const added = typeof account.data.added === 'string' ? +new Date(account.data.added) : 0;
      return +new Date() - added < MaxAge;
    },
    accountListCheck() {
      if (this.accounts.length > 4) {
        return 'scroll';
      } else {
        return 'hidden';
      }
    },
  },

  async mounted() {
    this.activeAccount = await this.$background.getActiveAccount();

    // Scroll the active account into view
    setTimeout(() => {
      const element = this.$el.querySelectorAll('.active')[0];
      if (!element) return;
      // @ts-ignore: non-standard function
      if (element.scrollIntoViewIfNeeded) {
        // @ts-ignore: non-standard function
        element.scrollIntoViewIfNeeded(true);
      } else {
        element.scrollIntoView({ block: 'center' });
      }
    }, 50);
  },
});
</script>

<style lang="scss">
.nav-account-list {
  max-height: 160px;
  overflow-x: hidden;
  .nav-account-item {
    .active {
      .account__item {
        background: #e3f2fd;
      }
    }
  }
}
</style>
