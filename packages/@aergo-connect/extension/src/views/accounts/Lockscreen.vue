<template>
  <ScrollView class="page">
    <div class="lockscreen-contents">
      <Icon name="aergoMainLogo" :size="150" />
      <!-- <TextField
      variant="main"
      type="password"
      v-model="password"
      :error="errors.password"
      @submit="unlock"
    /> -->
      <div class="password-input-wrapper">
        <label class="input-label">Password</label>
        <PasswordStrengthField
          v-model="password"
          :error="errors.password"
          :state="errors.password ? `invalid` : `default`"
        />
      </div>

      <Button @click="unlock" type="primary" size="large">Unlock</Button>
      <!-- <div class="content">
        <ContinueButton @click="unlock" :disabled="!canContinue" />
      </div> -->
      <div class="password-text-wrapper">
        <span>
          Wallet won't unlock? You can DELETE your current wallet and setup a
          new one.
        </span>
        <a href="#">Reset Wallet</a>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import Component, { mixins } from "vue-class-component";
import { ScrollView } from "@aergo-connect/lib-ui/src/layouts";
import {
  Button,
  ButtonGroup,
  ContinueButton,
} from "@aergo-connect/lib-ui/src/buttons";
import { Icon } from "@aergo-connect/lib-ui/src/icons";
import Heading from "@aergo-connect/lib-ui/src/content/Heading.vue";
import Appear from "@aergo-connect/lib-ui/src/animations/Appear.vue";
import { TextField } from "@aergo-connect/lib-ui/src/forms";
import PasswordStrengthField from "@aergo-connect/lib-ui/src/forms/PasswordStrengthField.vue";

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
  password = "";
  errors = {
    password: "",
  };

  async beforeMount(): Promise<void> {
    const isSetup = await this.$background.isSetup();
    // if (!isSetup) {
    //   this.$router.push({ name: "welcome" });
    // }
  }

  get canContinue(): boolean {
    return Boolean(this.password);
  }

  async unlock(): Promise<void> {
    try {
      await this.$background.unlock({ password: this.password });
      let nextPath = this.$store.state.ui.route.currentPath;
      if (!nextPath || nextPath === "/" || nextPath === "/locked") {
        nextPath = { name: "accounts-list" };
      }
      this.$router.push(nextPath);
    } catch (e) {
      // this.errors.password = `${e}`;
      this.errors.password = `Please check the seed phrase again.`;
      console.log(e);
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
    .input-label {
      margin-bottom: 10px;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.333333px;
      color: #454344;
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
}
#app.page-lockscreen {
  background: linear-gradient(
    0deg,
    #ffffff -10.1%,
    #ecf8fd 58.85%,
    #fff1f9 139.14%
  );
}
</style>
