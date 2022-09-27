<template>
  <div class="side-nav-backdrop">
    <div class="side-nav-wrap">
      <section class="side-nav-accounts">
        <img class="side-nav-logo" src="@aergo-connect/lib-ui/src/icons/img/nav-logo.svg" />
        <div class="accounts-dropDown" @click="handleAccountsDropDown">
          <span>Accounts</span>
          <img
            v-if="isAccountsListOpened"
            src="@aergo-connect/lib-ui/src/icons/img/arrow-down.svg"
          />
          <img v-else src="@aergo-connect/lib-ui/src/icons/img/arrow-up.svg" />
        </div>
        <AccountList :accounts="accounts" :canDelete="true" @select="handleSelect" />
        <SideNavButton img="add" title="Add Account" to="register" />
        <SideNavButton img="delete" title="Remove Account" @click="handleRemoveModal" />
      </section>
      <section class="nav-footer">
        <div>
          <SideNavButton img="sign-message" title="Sign Message" />
          <SideNavButton img="security" title="Security" />
          <SideNavButton img="lock" title="Lock" />
        </div>
        <div class="side-nav-version">
          <span>Version</span>
          <span>2.0</span>
          <img src="@aergo-connect/lib-ui/src/icons/img/arrow-right.svg" />
        </div>
      </section>
    </div>
  </div>

  <!-- <AddAccountDialog :visible="addAccountDialogVisible" @close="addAccountDialogVisible = false" /> -->
</template>

<script lang="ts">
import AccountList from '../../components/accounts/AccountList.vue';
import { SideNavButton } from '@aergo-connect/lib-ui/src/buttons';
import Vue from 'vue';
import { Account } from '@herajs/wallet';

export default Vue.extend({
  components: { AccountList, SideNavButton },
  data() {
    return {
      isAccountsListOpened: true,
    };
  },
  props: {},
  computed: {
    accounts(): Account[] {
      if (this.$store.state.accounts.keys.length) {
        return Object.values(this.$store.state.accounts.accounts);
      }
      return [];
    },
    // accountSpec() {
    //   return {
    //     address: this.accounts[0]?.data.spec.address,
    //     chainId: this.accounts[0]?.data.spec.chainId,
    //   };
    // },
    // account(): Account {
    //   return this.$store.getters['accounts/getAccount'](this.accountSpec);
    // },
  },
  methods: {
    handleAccountsDropDown() {
      this.isAccountsListOpened = !this.isAccountsListOpened;
    },
    handleRemoveModal() {
      this.$emit('removeModalClick');
    },
    handleSelect(account: Account) {
      const accountSpec = {
        address: account.data.spec.address,
        chainId: account.data.spec.chainId,
      };
      this.$store.dispatch('accounts/updateAccount', accountSpec);
      this.$emit('select', account);
      this.$router.push({
        name: 'accounts-list-address',
        params: {
          ...accountSpec,
        },
      });
    },
  },
  mounted() {
    this.$store.dispatch('accounts/fetchAccounts');
  },
});
</script>

<style lang="scss">
.side-nav-backdrop {
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  .side-nav-wrap {
    position: absolute;
    left: 0;
    bottom: 0;

    height: 546px;
    box-sizing: border-box;
    width: 270px;
    background: #ffffff;
    box-shadow: 3px 0px 18px rgb(0 0 0 / 15%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;
    padding-left: 16px;

    .side-nav-logo {
      margin-left: 14px;
    }

    .accounts-dropDown {
      display: flex;
      justify-content: space-between;
      margin: 12px 20px 12px 6px;
      cursor: pointer;
    }

    .side-nav-accounts {
      margin-top: 26px;
    }

    .nav-footer {
      .side-nav-version {
        margin-left: 10px;
        font-weight: 300;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: -0.333333px;
        color: #9c9a9a;
        display: flex;
        padding: 18px 0 33px 0;
        cursor: pointer;
        span {
          &:nth-child(2) {
            margin: 0px 24px 0 110px;
            color: #279ecc;
          }
        }
      }
    }
  }
}
</style>
