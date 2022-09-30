<template>
  <ScrollView class="page">
    <Header button="back" title="Set Password" :to="{ name: 'welcome' }" />
    <AppearVue :delay="0.6">
      <ConfirmModal v-if="modal" title="Your password has been set!" to="register" />
    </AppearVue>
    <div class="simple-content">
      <p class="simple-phrase">
        This passphrase will be used to secure all your accounts.
      </p>
      <div class="field-title">New Password</div>
      <PasswordStrengthField variant="default" v-model="password" autofocus :setting="setting" />
      <div class="field-title">Confirm Password</div>
      <PasswordRepeatField
        variant="default"
        v-model="passwordRepeat"
        :initPassword="password"
        :setting="setting"
      />
    </div>
    <template #footer>
      <div v-if="!modal" class="footer">
        <div class="check">
          <CheckboxButton :checked="checked" @check="checkFunc" />
          <div class="check-text">
            I understand that this wallet cannot recover this password for me.
          </div>
        </div>
        <div class="simple-center">
          <Button
            type="primary"
            size="large"
            hover
            :disabled="
              checked &&
              password === passwordRepeat &&
              password.length > 0 &&
              passwordRepeat.length > 0
                ? false
                : true
            "
            @click="handleModal"
          >
            Set Password
          </Button>
        </div>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import {
  ContinueButton,
  BackButton,
  ButtonGroup,
  Button,
  CheckboxButton,
} from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import {
  TextField,
  PasswordStrengthField,
  PasswordRepeatField,
} from '@aergo-connect/lib-ui/src/forms';
import AppearVue from '@aergo-connect/lib-ui/src/animations/Appear.vue';
import ConfirmModal from '@aergo-connect/lib-ui/src/layouts/ConfirmModal.vue';
import Component, { mixins } from 'vue-class-component';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';

@Component({
  components: {
    ScrollView,
    Heading,
    PasswordStrengthField,
    PasswordRepeatField,
    TextField,
    ContinueButton,
    CheckboxButton,
    ConfirmModal,
    ButtonGroup,
    BackButton,
    Button,
    Header,
    AppearVue,
  },
})
export default class Setup extends mixins() {
  password = '';
  passwordRepeat = '';
  setting = true;
  modal = false;
  checked = false;

  next() {
    this.modal = true;
  }

  checkFunc(checked: boolean) {
    this.checked = checked;
  }
  async handleModal() {
    if (this.passwordRepeat === this.password) {
      this.setup();
    }
  }

  async mounted(): Promise<void> {
    const isSetup = await this.$background.isSetup();
    if (isSetup) {
      this.next();
    }
  }

  async setup() {
    const check = await this.$background.setup({
      password: this.password,
    });
    if (check) {
      this.next();
    }
    // Init Network
    localStorage.setItem("Network","testnet");
  }
}
</script>

<style lang="scss">
.setup-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  .input-field {
    width: 327px;
  }
  .phrases {
    margin-left: 24px;
    margin-top: 32px;
    margin-bottom: 30px;
  }
  .password_title {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    letter-spacing: -0.333333px;
    color: #454344;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .password_size {
    width: 327px;
    height: 48px;
    margin-bottom: 42px;
  }
  .password-strength {
    margin-left: 0;
  }
}

.check {
  display: flex;
  .check-text {
    margin-left: 11px;
    margin-bottom: 28px;
    width: 292px;
    height: 40px;
    font-family: 'Outfit';
    font-style: normal;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.333333px;
    color: #686767;
  }
}
</style>
