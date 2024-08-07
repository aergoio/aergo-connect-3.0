<template>
  <div>
    <label>
      <span class="input-label" v-if="label">{{ label }}</span>
      <InputContainer
        :disabled="disabled"
        :variant="variant"
        :state="state"
        :error="error"
        :class="classes"
      >
        <Identicon v-if="identicon" :text="value" :style="{ marginLeft: '8px' }" />
        <input
          :value="value"
          :type="type"
          :disabled="disabled"
          :placeholder="placeholder"
          :autoComplete="autoComplete"
          @input="handleInput"
          @change="handleFileInput"
          @blur="handleBlur"
          @keyup.enter="handleEnter"
          @focus="handleFocusOn"
          accept=".txt"
          ref="inputElement"
        />
        <slot></slot>
      </InputContainer>
      <div class="input-error-text" :class="errorType" v-if="error">
        <Icon :name="`danger`" :size="16" />
        <span :style="{ maxWidth: '300px' }">{{ error }}</span>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  InputVariant,
  InputVariants,
  InputType,
  InputTypes,
  InputStates,
  InputState,
} from './types';
import InputContainer from './InputContainer.vue';
import Icon from '../icons/Icon.vue';
import { Identicon } from '../content';

export default Vue.extend({
  components: {
    InputContainer,
    Icon,
    Identicon,
  },

  props: {
    value: [String, Number],
    placeholder: String,
    label: String,
    type: {
      type: String as PropType<InputType>,
      default: InputTypes[0],
    },
    variant: {
      type: String as PropType<InputVariant>,
      default: InputVariants[0],
    },
    disabled: Boolean,
    autofocus: Boolean,
    state: {
      type: String as PropType<InputState>,
      default: InputStates[0],
    },
    error: {
      type: String,
      default: '',
    },
    errorType: {
      type: String as PropType<'error' | 'warning'>,
      default: 'error',
    },
    autoComplete: String,
    identicon: Boolean,
  },

  computed: {
    classes(): string[] {
      return ['text-field', `type-${this.type}`];
    },
  },
  mounted() {
    if (this.autofocus) {
      (this.$refs.inputElement as HTMLFormElement).focus({ preventScroll: true });
    }
  },
  methods: {
    handleInput(event: InputEvent): void {
      this.$emit('input', (event.target as HTMLFormElement).value);
    },
    handleBlur(event: FocusEvent): void {
      this.$emit('blur', (event.target as HTMLFormElement).value);
    },
    handleEnter(event: KeyboardEvent): void {
      this.$emit('submit', (event.target as HTMLFormElement).value);
    },
    handleFileInput(): void {
      const $elem = this.$refs.inputElement as HTMLInputElement;
      if (!$elem || !$elem.files || $elem.files.length === 0) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          this.$emit('file', e.target.result);
        }
      };
      reader.readAsText($elem.files[0]);
    },
    handleFocusOn(event: any) {
      event.target.select();
      this.$emit('focus');
    },
  },
});
</script>

<style lang="scss">
.text-field {
  input {
    border: 0;
    flex: 1;
    padding: 12px;
    outline: none;
    background-color: transparent;
    width: 100px;
    line-height: 1;
  }

  &.variant-default {
    input {
      font-size: calc((14 / 16) * 1rem);
      border-radius: 3px;
    }
  }

  &.variant-main {
    input {
      font-size: calc((20 / 16) * 1rem);
      font-weight: 500;
      padding-left: 4px;
    }
    &.type-password input {
      font-size: calc((6 / 16) * 1rem);
      padding-top: 7px;
      padding-bottom: 7px;
      overflow: hidden;
    }
  }
}
</style>
