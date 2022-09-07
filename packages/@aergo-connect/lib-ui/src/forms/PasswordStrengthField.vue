<template>
  <div>
    <TextField
      :type="revealPassword ? 'text' : 'password'"
      :variant="variant"
      :value="value"
      :placeholder="placeholder"
      errorType="warning"
      autoComplete="no"
      :autofocus="autofocus"
      @input="handleInput"
      @blur="handleBlur"
      @submit="handleEnter"
    >
      <Icon
        class="btn-reveal-password"
        :name="revealPassword ? 'view-enabled' : 'view-disabled'"
        :size="20"
        @click.native="toggleReveal"
      />
    </TextField>
    <div class="password-strength">
      <span
        class="input-error-text password-weak"
        v-if="value && passwordStrength.score < 3"
        >Strength : Weak
      </span>
      <span
        class="input-error-text password-good"
        v-if="value && passwordStrength.score >= 3"
        >Strength : Good
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Icon from "../icons/Icon.vue";
import TextField from "./TextField.vue";
import { InputVariant, InputVariants } from "./types";
import zxcvbn, { ZXCVBNResult } from "zxcvbn";

export default Vue.extend({
  components: {
    TextField,
    Icon,
  },
  props: {
    value: String,
    label: String,
    variant: {
      type: String as PropType<InputVariant>,
      default: InputVariants[0],
    },
    autofocus: Boolean,
    placeholder: String,
  },
  data() {
    return {
      revealPassword: false,
    };
  },
  computed: {
    passwordError(): string {
      if (this.value && this.passwordStrength.score < 3)
        return "Weak passphrase";
      return "";
    },
    passwordStrength(): ZXCVBNResult {
      return zxcvbn(this.value);
    },
  },
  methods: {
    handleInput(value: string): void {
      this.$emit("input", value);
    },
    handleBlur(value: string): void {
      this.$emit("blur", value);
    },
    handleEnter(value: string): void {
      this.$emit("submit", value);
    },
    toggleReveal(): void {
      this.revealPassword = !this.revealPassword;
    },
  },
});
</script>

<style lang="scss">
.password-strength {
  margin-top: 10px;
}
.password-advice {
  color: #666;
  font-size: (14/16) * 1rem;
  display: flex;
}
.password-good {
  color: #279ecc;
  font-size: (14/16) * 1rem;
  .adjustable-stroke {
    stroke: #00c789;
  }
}
.btn-reveal-password {
  margin-right: 10px;
  user-select: none;
}
</style>
