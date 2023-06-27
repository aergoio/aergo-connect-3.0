<template>
  <div>
    <span class="field-title" v-if="label">{{ label }}</span>
    <TextField
      class="simple-center"
      :type="revealPassword ? 'text' : 'password'"
      :variant="variant"
      :value="value"
      :placeholder="placeholder"
      :state="state"
      :error="error"
      errorType="warning"
      autoComplete="no"
      :autofocus="autofocus"
      @input="handleInput"
      @blur="handleBlur"
      @submit="handleEnter"
    >
      <div v-if="value">
        <Icon
          v-if="value === initPassword"
          :name="`check`"
          class="match-password"
          :size="20"
          style="margin-right: 10px"
        />
        <Icon v-else :name="`x`" :size="20" class="match-password" />
      </div>
    </TextField>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Icon from '../icons/Icon.vue';
import TextField from './TextField.vue';
import { InputVariant, InputVariants, InputStates, InputState } from './types';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';

export default Vue.extend({
  components: {
    TextField,
    Icon,
  },
  props: {
    value: String,
    label: String,
    initPassword: String,
    variant: {
      type: String as PropType<InputVariant>,
      default: InputVariants[0],
    },
    autofocus: Boolean,
    placeholder: String,
    setting: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String as PropType<InputState>,
      default: InputStates[0],
    },
    error: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      revealPassword: false,
    };
  },
  computed: {
    passwordError(): string {
      if (this.value && this.passwordStrength.score < 3) return 'Weak passphrase';
      return '';
    },
    passwordStrength(): ZXCVBNResult {
      return zxcvbn(this.value);
    },
  },
  methods: {
    handleInput(value: string): void {
      this.$emit('input', value);
    },
    handleBlur(value: string): void {
      this.$emit('blur', value);
    },
    handleEnter(value: string): void {
      this.$emit('submit', value);
    },
    toggleReveal(): void {
      this.revealPassword = !this.revealPassword;
    },
  },
});
</script>

<style scss>
.match-password {
  margin-right: 10px;
  user-select: none;
}

.icon__wrapper {
  &.invalid {
    filter: invert(17%) sepia(86%) saturate(6083%) hue-rotate(319deg) brightness(90%) contrast(99%);
  }
}
</style>
