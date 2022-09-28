<template>
  <ScrollView class="page">
    <Header button="back" to="welcome" title="Set Password" />
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
        </div>
        <div class="check-text">
          I understand that this wallet cannot recover this password for me.
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
  }
}
</script>

<style lang="scss">
.check {
  position: absolute;
  left: 24px;
  top: 440px;
}
.check-text {
  position: absolute;
  left: 60px;
  top: 430px;
  width: 292px;
  height: 40px;
  font-family: 'Outfit';
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.333333px;
  color: #686767;
}
</style>
