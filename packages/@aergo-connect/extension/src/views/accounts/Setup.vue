<template>
  <ScrollView class="page">
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
        <PasswordStrengthField
          variant="default"
          v-model="password"
          autofocus
          :setting="setting"
        />
        <h3>Confirm Password</h3>
        <PasswordStrengthField
          variant="default"
          v-model="passwordRepeat"
          :setting="setting"
        />
        <CheckboxButton />
        <h5>
          I understand that this wallet cannot recover this password for me.
        </h5>
        <Button
          type="primary"
          size="large"
          :disabled="
            password === passwordRepeat &&
            password.length > 0 &&
            passwordRepeat.length > 0
              ? false
              : true
          "
          @click="setPassword"
          >Set Password</Button
        >

        <div>{{ setting }}</div>
      </div>
      <!-- <div v-if="step === 'repeat'">
        <Heading>Repeat passphrase</Heading>
        <p>Please retype your passphrase for confirmation.</p>
        <TextField
          variant="primary"
          type="password"
          v-model="passwordRepeat"
          @submit="nextStep"
          :error="
            validateRepeat && passwordRepeat !== password
              ? 'Does not match'
              : ''
          "
          :state="passwordRepeat === password ? 'valid' : 'initial'"
          autofocus
        />
      </div> -->
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
} from "@aergo-connect/lib-ui/src/buttons";
import { ScrollView } from "@aergo-connect/lib-ui/src/layouts";
import Heading from "@aergo-connect/lib-ui/src/content/Heading.vue";
import {
  TextField,
  PasswordStrengthField,
} from "@aergo-connect/lib-ui/src/forms";
import { Icon } from "@aergo-connect/lib-ui/src/icons";
import ConfirmModal from "@aergo-connect/lib-ui/src/layouts/ConfirmModal.vue";
import Component, { mixins } from "vue-class-component";
import Header from "@aergo-connect/lib-ui/src/layouts/Header.vue";
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
  password = "";
  passwordRepeat = "";
  // step: "initial" | "repeat" = "initial";
  setting = true;

  next() {
    this.$router.push({ name: this.$route.params.next || "account-create" });
  }

  watch() {
    console.log(this.setting);
  }
  setPassword() {
    if (this.passwordRepeat === this.password) {
      this.setup();
    }
  }

  async mounted(): Promise<void> {
    const isSetup = await this.$background.isSetup();
    if (isSetup) {
      this.next();
    }
    // console.log(this.$store);
    // console.log(this.$route);
  }

  // get canContinue(): boolean {
  //   return Boolean(
  //     (this.step === "initial" && this.password) ||
  //       (this.step === "repeat" && this.passwordRepeat === this.password)
  //   );
  // }

  // nextStep() {
  //   if (this.step === "initial") {
  //     this.step = "repeat";
  //   } else if (this.step === "repeat") {
  //     if (this.passwordRepeat === this.password) {
  //       this.setup();
  //     } else {
  //       this.validateRepeat = true;
  //     }
  //   }
  // }

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
