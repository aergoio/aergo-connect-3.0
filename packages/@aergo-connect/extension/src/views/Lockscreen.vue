<template>
  <ScrollView class="page">
    <div class="lockscreen-contents">
      <Icon :name="`aergoMainLogo`" :size="150" />
      <div class="password-input-wrapper">
        <label class="input-label">Password</label>
        <div class="password-size">
          <PasswordStrengthField
            class=""
            v-model="password"
            :error="errors.password"
            :state="errors.password ? `invalid` : `default`"
            @submit="unlock"
          />
        </div>
      </div>
      <Button
        class="locked_button_size"
        @click="unlock"
        type="primary"
        size="medium"
        @keyup.enter="unlock"
        hover
        >Unlock</Button
      >
      <!-- <div class="password-text-wrapper">
        <span> Wallet won't unlock? You can DELETE your current wallet and setup a new one. </span>
        <a href="#">Reset Wallet</a>
      </div> -->
    </div>
  </ScrollView>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup, ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';
import { TextField } from '@aergo-connect/lib-ui/src/forms';
import PasswordStrengthField from '@aergo-connect/lib-ui/src/forms/PasswordStrengthField.vue';

@Component({
  components: {
    ScrollView,
    Button,
    ContinueButton,
    PasswordStrengthField,
    ButtonGroup,
    Heading,
    Appear,
    TextField,
    Icon,
  },
})
export default class Lockscreen extends mixins() {
  password = '';
  errors = {
    password: '',
  };

  get canContinue(): boolean {
    return Boolean(this.password);
  }
  async beforeMount(): Promise<void> {
    const isSetup = await this.$background.isSetup();
    if (!isSetup && !this.$store.state.ui.initSetupKey) {
      this.$router.push({ name: 'welcome' });
    }
  }
  // async mounted() {
  //   await this.$background.lock();
  // }
  async unlock(): Promise<void> {
    try {
      await this.$background.unlock({ password: this.password });
      chrome.idle.setDetectionInterval(this.$store.state.ui.idleTimeout);
      let nextPath = this.$store.state.ui.route.currentPath;

      if (!nextPath || nextPath === '/' || nextPath === '/locked') {
        nextPath = { name: 'accounts-list' };
      }
      this.$router.push(nextPath);
      // if (nextPage) {
      //   if (this.$store.state.accounts.address) {
      //     await this.$store.dispatch('accounts/initState');
      //   }
      //   this.$router.push({ path: nextPage }).catch(() => {});
      // } else {
      //   nextPage = 'accounts-list';
      //   this.$router.push({ name: nextPage }).catch(() => {});
      // }
    } catch (e) {
      this.errors.password = `${e}`;
    }
  }
}
</script>

<style lang="scss">
.lockscreen-contents {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 65px;

  .password-input-wrapper {
    margin-top: 32px;
    height: 130px;
    .password-size {
      width: 327px;
      height: 48px;
    }
    .input-label {
      margin-left: 11px;
      margin-bottom: 10px;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.333333px;
      color: #454344;
    }
    .input-field {
      width: 303px;
    }
    .button_size {
      width: 303px;
    }
  }

  .password-text-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      margin-top: 24px;
      width: 288px;
      // text style
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      display: flex;
      align-items: center;
      text-align: center;
      letter-spacing: -0.333333px;
      color: #9c9a9a;
    }

    a {
      margin-top: 14px;

      // text style
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      display: flex;
      align-items: center;
      text-align: center;
      letter-spacing: -0.333333px;
      text-decoration-line: underline;
      background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  .locked_button_size {
    width: 303px;
  }
}
#app.page-lockscreen {
  background: linear-gradient(0deg, #ffffff -10.1%, #ecf8fd 58.85%, #fff1f9 139.14%);
}
</style>
