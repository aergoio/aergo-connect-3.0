<template>
  <ScrollView class="page">
    <Appear>
      <Header
        :button="$store.state.accounts.address ? 'back' : false"
        :skip="!$store.state.accounts.address ? true : false"
        title="Register Account"
        @backClick="handleBack"
        @skipClick="handleBack"
      />
      <div class="register-contents">
        <Heading class="big-title">Register an Account</Heading>
        <span class="pre-header">Import on existing accounts or create a new one.</span>
        <img src="@/assets/img/logo-circle.svg" alt="logo" width="120px" />
      </div>
      <div class="button_wrapper">
        <Appear :delay="0.6">
          <ButtonGroup vertical class="button_group_wrapper">
            <Button
              class="button_outline"
              type="next"
              size="large"
              hover
              :to="{ name: 'account-import' }"
            >
              <span>Import</span>
              <Icon :style="{ display: 'flex' }" name="arrow_right_blue" />
            </Button>
            <Button type="next" size="large" hover @click="handleCreate">
              <span> Create </span>
              <Icon :style="{ display: 'flex' }" name="arrow_right_blue" />
            </Button>
            <Button type="next" size="large" @click="openConnectHardwareWalletTab" hover>
              <span> Connect Ledger </span>
              <Icon :style="{ display: 'flex' }" name="arrow_right_blue" />
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
import { Icon } from '@aergo-connect/lib-ui/src/icons';
@Component({
  components: {
    ScrollView,
    Button,
    ButtonGroup,
    Heading,
    Appear,
    Header,
    Icon,
  },
})
export default class Register extends mixins(PersistInputsMixin) {
  get isHardwareWalletEnabled(): boolean {
    return this.$store.getters['ui/getSetting']('features.enableHardwareWallet');
  }

  async handleCreate() {
    const { account, mnemonic } = await this.$background.createAccountWithMnemonic({
      chainId: 'aergo.io',
    });

    await this.$store.dispatch('accounts/addAccount', account.address);
    await this.$store.commit('accounts/setSeedPhrase', mnemonic);
    await this.$store.commit('accounts/setBackup', false);

    this.$router.push({
      name: 'regist-confirm',
    });
  }
  handleBack() {
    this.$router.push({ name: 'accounts-list' });
  }
  openConnectHardwareWalletTab() {
    const name = (this.$root as any).name;
    if (name === 'popup') {
      chrome.tabs.create({ url: 'index.html#/connect-hw/accounts' });
    } else {
      this.$router.push({ name: 'account-connect-hw-accounts' });
    }
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
  margin-bottom: 50px;
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

<!-- .button_outline {
}
.button_outline:hover {
  /* border: 2px solid #512da8; */
  border: 2px solid transparent;
  border-radius: 4px;
  border-image: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
  border-image-slice: 1;
  /* background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text; */
  /* box-shadow: none; */
  /* border: 2px solid transparent; */
  /* border-radius: 4px; */
  /* background-image: -webkit-gradient(linear, left top, left bottom, from(white), to(white)),
    -webkit-gradient(linear, left top, right top, from(#9a449c), to(#e30a7d)); */
  /* background-image: linear-gradient(white, white), linear-gradient(to right, #9a449c, #e30a7d); */
  /* background-clip: content-box, border-box; */
  /* background-origin: border-box; */
  span {
    background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
} -->
