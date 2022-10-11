<template>
  <button
    class="button"
    :class="classes"
    :disabled="disabled"
    :hover="hover"
    :size="size"
    @click="handleClick"
    @keyup.enter="handleClick"
  >
    <template v-if="loading">
      <LoadingIndicator class="button-loading-indicator" />
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ButtonType, ButtonTypes, ButtonSize, ButtonSizes } from './types';
import LoadingIndicator from '../icons/LoadingIndicator.vue';
import { RawLocation } from 'vue-router';

/**
 * Either handle click event by `@click` or pass a router location into the `to` prop.
 */
export default Vue.extend({
  name: 'Button',
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: ButtonTypes[0],
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: ButtonSizes[0],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    to: {
      type: [String, Object] as PropType<RawLocation>,
    },
    hover: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LoadingIndicator,
  },
  beforeUpdate() {
    if (this.loading) {
      // Animate into the loading state
      const $el = this.$el as HTMLElement;
      $el.style.minWidth = $el.clientWidth + 'px';
      $el.style.width = $el.clientWidth + 'px';
      setTimeout(() => {
        // $el.style.minWidth = '50px';
        // $el.style.width = 'auto';
      }, 300);
    }
  },
  computed: {
    classes(): string[] {
      return [
        `button-type-${this.type}`,
        `button-size-${this.size}`,
        this.loading ? `button-loading` : '',
        this.type.match(/^primary/) ? 'inverted-colors' : '',
        this.hover ? `hover` : '',
      ];
    },
  },
  methods: {
    handleClick() {
      if (typeof this.to !== 'undefined' && this.to && typeof this.$router !== 'undefined') {
        console.log(this.to, 'this.to');
        this.$router.push(this.to).catch(() => {});
      } else {
        this.$emit('click');
      }
    },
  },
});
</script>

<style lang="scss">
@import '../styles/variables';

.button {
  /* Typography */
  font-weight: 500;
  font-size: (17/16) * 1em;
  /* Sizing */
  box-sizing: border-box;
  min-height: 30px;
  line-height: 3em;
  padding: 0.5em 2.5em;
  height: 48px;
  /* Borders and background */
  outline: none;
  border: 0;
  border-radius: 3px;
  background-color: transparent;
  border-radius: 4px;
  /* Content alignment */
  display: flex;
  text-decoration: none;
  text-align: center;
  align-items: center;
  // justify-content: space-around;
  justify-content: center;
  /* Behavior */
  cursor: pointer;
  transition: min-width 0.35s ease-in;

  img {
    margin-right: 13px;
  }
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.75;
  }
  &.button-size-small {
    width: 157px;
  }
  &.button-size-medium {
    width: 289px;
    height: 44px;
  }
  &.button-size-medium-outline {
    width: 285px;
    height: 40px;
  }
  &.button-size-large {
    width: 327px;
    height: 48px;
  }
  &.button-size-large-outline {
    width: 323px;
    height: 44px;
  }
  &.button-type-primary {
    background-color: $Blue01;
    color: #fff;
    &[disabled] {
      background: $Grey04;
      opacity: 0.3;
    }
    &.hover:hover {
      background: $gradation04;
    }
  }
  &.button-type-primary-outline {
    color: $Blue01;
    outline: 2px solid $Blue01;
    &.hover:hover {
      color: $Grey01;
      background: $gradation04;
    }
  }
  &.button-type-secondary {
    background-color: $Pink01;
    color: #fff;
    box-shadow: none;
  }
  &.button-type-gradation {
    background: $gradation01;
    color: #fff;
    box-shadow: none;
  }
  &.button-type-font-gradation {
    background: $white;
    color: $gradation04;
    box-shadow: none;
    background-color: $Pink01;
  }
  &.button-type-secondary-outline {
    color: $Pink01;
    outline: 2px solid $Pink01;
  }
  &.button-type-gradation {
    background: $gradation04;
    color: #fff;
  }
  &.button-type-font-gradation {
    background: $gradation04;
    border: 1px solid #ecf8fd;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  &.button-type-icon,
  &.button-type-primary-icon {
    box-shadow: none;
    padding: 0;
    line-height: initial;
    min-height: 0;
  }
  &.button-type-primary-icon {
    background-color: #ff337f;
    border-radius: 100%;
    line-height: 56px;
    min-height: 56px;
    width: 56px !important;
    &[disabled] {
      opacity: 0.5;
    }
  }
  &[disabled] {
    // cursor: not-allowed;
    background: $Grey02;
    color: #fff;
    outline-color: #fff;
    opacity: 0.3;
  }
}
</style>
