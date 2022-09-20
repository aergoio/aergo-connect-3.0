<template>
  <ScrollView class="page">
    <div class="setup-content">
      <AppearVue :delay="0.6">
         <ConfirmModal v-if="modal" title="Your password has been set!" to="register" />
      </AppearVue>
      <section class="dialog-header">
        <div>
          <Header button="back" to="welcome" title="Set Password" />
        </div>
      </section>
      <div class="content_layout" >
        <p>
          This passphrase will be used to secure all your accounts.
        </p>
        <div>
          <span class="password_title">New Password</span>
          <PasswordStrengthField
            variant="default"
            v-model="password"
            autofocus
            :setting="setting"
            @keyup.enter="$event.target.nextSibling.focus()"
          />
          <span class="password_title">Confirm Password</span>
          <PasswordRepeatField
            variant="default"
            v-model="passwordRepeat"
            :initPassword="password"
            :setting="setting"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div v-if="!modal" class="footer">
        <div class="content_checkbox">
          <CheckboxButton :checked="checked" @check="checkFunc" />
          <div class="text">I understand that this wallet cannot recover this password for me.</div>
        </div>
        <Button
          type="primary"
          size="large"
          hover=true
          :disabled="
            checked &&
            password === passwordRepeat &&
            password.length > 0 &&
            passwordRepeat.length > 0
              ? false
              : true
          "
          @click="handleModal"
          >Set Password</Button
        >
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
  }
}
</script>

<style lang="scss">
.setup-content {
  position: relative;
  height: 100%;
}
.password_title {
  font-family: 'Outfit';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.333333px;
  color: #454344;
  margin-bottom: 10px;
}
.content_checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 28px;
  .text {
    margin-left: 11px;
    width: 292px;
    height: 40px;
    font-family: 'Outfit';
    font-style: normal;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.333333px;
    color: #686767;
  }
}
</style>
