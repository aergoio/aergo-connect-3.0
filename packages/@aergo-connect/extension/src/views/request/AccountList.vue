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
      <div class="account-list-wrap">
        <AccountList :accounts="$store.state.accounts.accounts" @select="selectAccount" />
      </div>
    </ScrollView>
  </div>
</template>

<script lang="ts">
import { ScrollView, Header } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import AccountList from '../../components/accounts/AccountList.vue';
import { Button } from '@aergo-connect/lib-ui/src/buttons';
import HeaderLogo from '@aergo-connect/lib-ui/src/icons/HeaderLogo.vue';

import Vue from 'vue';
import { Account } from '@herajs/wallet';

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
  },
  data() {
    return {
      addAccountDialogVisible: false,
    };
  },
  methods: {

  async  selectAccount(account: any) {
      console.log('clicked ', account);
      await this.$store.commit('accounts/setActiveAccount', account.address);
      await this.$background.setActiveAccount({ chainId: 'aergo.io', address: account.address });
      this.$router.push({ name: 'request-accounts-list'});
    },
  },
});
</script>
