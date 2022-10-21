<template>
  <ScrollView class="page">
    <Appear>
      <Header button="back" title="Register Account" :to="{ name: 'accounts-list' }" />
      <div class="register-contents">
        <Heading class="big-title">Register an Account</Heading>
        <span class="pre-header">Import on existing accounts or create a new one.</span>
        <img src="@/assets/img/logo-circle.svg" alt="logo" width="120px" />
      </div>
      <div class="button_wrapper">
        <Appear :delay="0.6">
          <ButtonGroup vertical class="button_group_wrapper">
            <Button
              type="primary"
              size="large"
              hover
              :to="{ name: 'account-import', params: { next: 'account-import' } }"
            >
              Import
            </Button>
            <Button type="primary" size="large" hover @click="handleCreate"> Create </Button>
            <Button
              type="primary"
              disabled
              size="large"
              :to="{ name: 'account-connect-hw-accounts', params: { next: 'account-import' } }"
            >
              Connect Ledger
            </Button>
          </ButtonGroup>
        </Appear>
      </div>
    </Appear>
  </ScrollView>
</template>

<script lang="ts">
import { Header, ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';
import Component, { mixins } from 'vue-class-component';
import { PersistInputsMixin } from '../store/ui';
@Component({
  components: {
    ScrollView,
    Button,
    ButtonGroup,
    Heading,
    Appear,
    Header,
  },
})
export default class Create extends mixins(PersistInputsMixin) {
  async handleCreate() {
    const { account, mnemonic } = await this.$background.createAccountWithMnemonic({
      chainId: 'aergo.io',
    });
    console.log(mnemonic, 'mnemonic');

    await this.$store.dispatch('accounts/addAccount', account.address);
    await this.$store.commit('accounts/setSeedPhrase', mnemonic);
    await this.$store.commit('accounts/setBackup', false);
    console.log(this.$store.state.accounts[this.$store.state.accounts.address]);

    this.$router.push({
      name: 'account-create',
      params: {
        next: 'account-create',
      },
    });
  }
}
</script>

<style lang="scss">
.register-contents {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  margin-bottom: 70px;
  .pre-header {
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    letter-spacing: -0.333333px;
    color: #686767;
    inline-size: 230px;
    overflow-wrap: break-word;
    margin-bottom: 32px;
  }
}
.button_wrapper {
  display: flex;
  justify-content: center;
  .button_group_wrapper {
    .button {
      width: 327px;
    }
  }
}
</style>
