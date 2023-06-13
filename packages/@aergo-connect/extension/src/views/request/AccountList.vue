<template>
  <div class="account-list-view">
    <ScrollView>
      <template #header>
        <Header>
          <HeaderLogo />
        </Header>
        <div class="account-list-header">
          <Heading tag="h2"> Select account to use </Heading>
        </div>
      </template>
      <div class="network_header" @click="handleNetworkModalClick">
        <NetworkHeader />
      </div>
      <div class="account-list-wrap">
        <AccountList :accounts="$store.state.accounts.accounts" @select="selectAccount" />
      </div>
      <NetworkModal v-if="networkModal" @networkModalClick="handleNetworkModalClick" />
      <span class="unsupported-error" v-if="registerNewAccount"
        >Wallet account information is required to make an external connection. Please register or
        create wallet accounts first!</span
      >
    </ScrollView>
  </div>
</template>

<script lang="ts">
import { ScrollView, Header } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import AccountList from '../../components/accounts/AccountList.vue';
import { Button } from '@aergo-connect/lib-ui/src/buttons';
import HeaderLogo from '@aergo-connect/lib-ui/src/icons/HeaderLogo.vue';
import NetworkHeader from '@aergo-connect/lib-ui/src/layouts/NetworkHeader.vue';
import NetworkModal from '@aergo-connect/lib-ui/src/modal/NetworkModal.vue';
import Vue from 'vue';

export default Vue.extend({
  props: {
    isAccountsListOpened: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ScrollView,
    Heading,
    Button,
    AccountList,
    Header,
    HeaderLogo,
    NetworkHeader,
    NetworkModal,
  },
  data() {
    return {
      registerNewAccount: false,
      addAccountDialogVisible: false,
      networkModal: false,
    };
  },
  mounted() {
    if (!this.$store.state.accounts.accounts[this.$store.state.accounts.address]) {
      this.registerNewAccount = true;
    }
  },
  methods: {
    async selectAccount(account: any) {
      await this.$store.commit('accounts/setActiveAccount', account.address);
      const aergoChainIds = ['aergo.io', 'testnet.aergo.io', 'alpha.aergo.io'];
      const chainId = aergoChainIds.includes(this.$store.state.accounts.chainId)
        ? this.$store.state.accounts.chainId
        : this.$store.state.accounts.chainLabel;
      await this.$background.setActiveAccount({
        chainId,
        address: account.address,
      });
      if (this.$store.state.request.currentRequest.action === 'SIGN') {
        this.$router.push({ name: 'request-sign' }).catch(() => {});
      } else if (this.$store.state.request.currentRequest.action === 'SEND_TX') {
        this.$router.push({ name: 'request-send' }).catch(() => {});
      } else if (this.$store.state.request.currentRequest.action === 'SIGN_TX') {
        this.$router.push({ name: 'request-sign-tx' }).catch(() => {});
      } else {
        this.$router.push({ name: 'request-address' }).catch(() => {});
      }
    },
    handleNetworkModalClick() {
      this.networkModal = !this.networkModal;
    },
  },
});
</script>

<style lang="scss">
.account-list-view {
  .network_header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #f6f6f6;
    cursor: pointer;
    .network_content {
      .network_circle {
        width: 6px;
        height: 6px;
      }
      .network_name {
        line-height: 0;
        letter-spacing: 0;
        font-weight: 400;
        font-size: 16px;
      }
    }
  }
  .network_header:hover {
    background: #f6f6f6;
  }
  .account-list-wrap {
    border: 1px solid #f6f6f6;
    .nav-account-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      max-height: 540px;
      .nav-account-item {
        .account__item {
          width: 375px;
          padding: 10px 10px 10px 10px;
          .name__wrapper {
            font-size: 14px;
          }
        }
      }
    }
  }
  .network_modal_wrapper {
    width: 360px;
  }
}
</style>
