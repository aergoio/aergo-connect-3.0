<template>
  <ScrollView class="page">
    <ConfirmModal v-if="modal" title="Your password has been set!" to="register" />
    <div class="content">
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
        <div class="content_checkbox">
          <CheckboxButton />
          <div class="text">I understand that this wallet cannot recover this password for me.</div>
        </div>
        <Button
          type="primary"
          size="large"
          :disabled="
            password === passwordRepeat && password.length > 0 && passwordRepeat.length > 0
              ? false
              : true
          "
          @click="handleModal"
          >Set Password</Button
        >
      </div>
    </div>
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
import { Icon } from '@aergo-connect/lib-ui/src/icons';
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
    Icon,
  },
})
export default class Setup extends mixins() {
  password = '';
  passwordRepeat = '';
  // step: "initial" | "repeat" = "initial";
  setting = true;
  modal = false;

  next() {
    // this.$router.push({ name: 'register' });
  }
  goBack() {
    this.$router.push({ name: 'welcome' });
  }
  handleModal() {
    if (this.passwordRepeat === this.password) {
      // this.setup();
      this.modal = true;
    }
  }

  async mounted(): Promise<void> {
    const isSetup = await this.$background.isSetup();
    console.log(isSetup, 'isSetup');
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
.content_checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  .text {
    font: 'Outfit';
    font-weight: 400;
    line-height: '20.16px';
  }
}
</style>
