<template>
  <label
    class="component switch-button"
    v-on:click="!disabled && $emit('input', !value)"
  >
    <slot>{{ label }}</slot>
    <span
      class="switch-button-toggle"
      :variant="variant"
      :class="classes"
    ></span>
  </label>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { InputVariant } from "./types";

export default Vue.extend({
  name: "SwitchButton",
  props: {
    variant: {
      type: String as PropType<InputVariant>,
      default: "default",
    },
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: String,
  },
  computed: {
    classes(): string[] {
      return [
        this.disabled ? "disabled" : "",
        this.value ? "checked" : "",
        `variant-${this.variant}`,
      ];
    },
  },
});
</script>

<style lang="scss">
@import "../styles/variables";

.component.switch-button {
  display: flex;
  align-items: center;
  font-size: (13/16) * 1rem;
  color: #222;

  .switch-button-toggle {
    flex-shrink: 0;
    margin-left: auto;
    font-size: 18px;
    background: #e8e8e8;
    border-radius: 1em;
    border: 1px solid #ccc;
    box-shadow: inset 1px 2px 2px rgba(0, 0, 0, 0.2);
    width: 1.85em;
    height: 1em;
    // display: inline-block;
    position: relative;
    transition: background-color 0.15s;
    user-select: none;
    cursor: pointer;

    &:hover {
      background: #c9c9c9;
    }

    &:after {
      font-size: 16px;
      content: "";
      position: absolute;
      top: 0.05em;
      left: 0.1em;
      width: 16px;
      height: 16px;
      border-radius: 1em;
      background-color: #fff;
      transition: all 0.15s;
    }

    &.disabled {
      cursor: not-allowed;

      &:after {
        opacity: 0.5; /* .5 * .5 = .25 */
      }
    }

    &.checked {
      &:after {
        left: 1em;
      }

      &.disabled {
        opacity: 0.5;

        &:after {
          opacity: 0.5;
        }
      }
    }

    &.variant-primary {
      background: $Blue01;
      border: 1px solid $Blue01;
    }

    &.variant-secondary {
      background: $Pink01;
      border: 1px solid $Pink01;
    }
  }
}
</style>
