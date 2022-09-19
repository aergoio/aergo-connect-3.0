<template>
  <ScrollView class="page">
    <div class="setup-content">
      <AppearVue :delay="0.6">
        <ConfirmModal v-if="modal" title="Your password has been set!" to="register" />
      </AppearVue>
      <section class="dialog-header">
        <div>
          <Header button="back" title="Set Password" />
        </div>
      </section>
      <div class="content_layout">
        <p>
          This password will unlock your wallet only on this device.
        </p>
        <h3>New Password</h3>
        <PasswordStrengthField variant="default" v-model="password" autofocus :setting="setting" />
        <h3>Confirm Password</h3>
        <PasswordStrengthField variant="default" v-model="passwordRepeat" :setting="setting" />
      </div>
      <div class="content_checkbox">
        <CheckboxButton :checked="checked" @check="checkFunc" />
        <div class="text">I understand that this wallet cannot recover this password for me.</div>
      </div>
    </div>
    <template #footer>
      <div v-if="!modal" class="footer">
        <Button
          type="primary"
          size="large"
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
import { TextField, PasswordStrengthField } from '@aergo-connect/lib-ui/src/forms';
import AppearVue from '@aergo-connect/lib-ui/src/animations/Appear.vue';
import ConfirmModal from '@aergo-connect/lib-ui/src/layouts/ConfirmModal.vue';
import Component, { mixins } from 'vue-class-component';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';

@Component({
  components: {
    ScrollView,
    Heading,
    PasswordStrengthField,
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
  goBack() {
    this.$router.push({ name: 'welcome' });
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

.content_checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-top: 80px; */
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
