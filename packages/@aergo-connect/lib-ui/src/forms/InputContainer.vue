<template>
  <div
    class="input-field"
    :class="classes"
    @focusin="focused = true"
    @focusout="
      focused = false;
      $emit('blur');
    "
    @keydown.down.capture="$emit('pointerNext')"
    @keydown.up.capture="$emit('pointerPrevious')"
    @keydown.enter.stop.capture="$emit('accept')"
    @keydown.esc.capture="$emit('cancel')"
  >
    <slot></slot>
    <LoadingIndicator v-if="state === 'loading'" />
    <img src="" alt="" />
    <Icon :name="`checkmark`" :size="24" v-if="state === 'valid'" />
    <Icon :name="`x`" :size="24" v-if="state === 'invalid'" :style="{ marginRight: '10px' }" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { InputVariant, InputVariants, InputStates, InputState } from './types';
import LoadingIndicator from '../icons/LoadingIndicator.vue';
import Icon from '../icons/Icon.vue';

export default Vue.extend({
  components: {
    LoadingIndicator,
    Icon,
  },
  props: {
    variant: {
      type: String as PropType<InputVariant>,
      default: InputVariants[0],
    },
    disabled: {
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
      focused: false,
    };
  },
  computed: {
    classes(): string[] {
      return [
        `variant-${this.variant}`,
        `state-${this.state}`,
        this.disabled ? 'is-disabled' : '',
        this.error ? 'has-error' : '',
        this.focused ? 'is-focused' : '',
      ];
    },
  },
});
</script>

<style lang="scss">
@import '../styles/variables';

.input-field {
  display: flex;
  box-sizing: border-box;
  height: 48px;
  /* width: 327px; */
  align-items: center;
  transition: box-shadow 0.1s;
  margin-top: 10px;
  border-radius: 8px;

  &.variant-default {
    // box-shadow: inset 0 0 0 2px $Grey05;
    // border-radius: 3px;
    // background-image: linear-gradient(white, white);
    border: 2px solid transparent;
    border-radius: 8px;
    background-image: linear-gradient(white, white), linear-gradient(to right, $Grey04, $Grey04);
    background-origin: border-box;
    background-clip: content-box, border-box;

    &.is-focused {
      box-shadow: none;
      border: 2px solid transparent;
      border-radius: 8px;
      background-image: linear-gradient(white, white), linear-gradient(to right, #279ecc, #a13e99);
      background-origin: border-box;
      background-clip: content-box, border-box;
      /* outline: none;
      background-image: linear-gradient(white, white), linear-gradient(to right, $Grey07, $Grey07);
      // box-shadow: inset 0 0 0 2px $Grey07; */
    }

    &.is-disabled {
      border: 1px solid transparent;
      background: rgba(0, 0, 0, 0.05);
      box-shadow: inset 0 0 0 1px $Grey04;
    }
  }

  &.variant-primary {
    box-shadow: inset 0 0 0 2px $Blue01;
    border-radius: 8px;
  }

  &.variant-secondary {
    border: 2px solid transparent;
    border-radius: 8px;
    background-image: linear-gradient(white, white), linear-gradient(to right, #9a449c, #e30a7d);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }

  &.variant-default {
    &.is-focused:not(.options-visible) {
      background-color: rgba(0, 0, 0, 0.04);
    }
    &.state-invalid {
      box-shadow: none;
      border: 2px solid transparent;
      border-radius: 8px;
      background-image: linear-gradient(white, white), linear-gradient(to right, #9a449c, #e30a7d);
      background-origin: border-box;
      background-clip: content-box, border-box;
    }

    &.state-valid {
      box-shadow: none;
      border: 2px solid transparent;
      border-radius: 8px;
      background-image: linear-gradient(white, white), linear-gradient(to right, #279ecc, #a13e99);
      background-origin: border-box;
      background-clip: content-box, border-box;
    }
  }

  > .loading-indicator,
  > .icon--checkmark {
    margin-right: 15px;
  }
}
.input-label {
  font-size: (calc(13 / 16)) * 1rem;
  font-weight: 500;
  letter-spacing: -0.16px;
  color: rgba(34, 34, 34, 0.65);
  display: block;
  margin-bottom: 0.5em;
}
.input-error-text {
  max-width: 300px;
  height: 36px;
  font-size: 14px;
  color: $Pink01;
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  word-wrap: break-word;
  margin-top: 8px;
  .icon {
    margin-left: 2px;
    margin-right: 2px;
  }
  &.warning {
    color: $Pink01;
    .adjustable-stroke {
      color: $Pink01;
    }
  }
}
</style>
