<template>
  <div
    class="button-group"
    :class="[horizontal ? 'button-group-horizontal' : vertical ? 'button-group-vertical' : '']"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ButtonGroup',
  props: {
    horizontal: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.button-group {
  display: flex;
  justify-content: flex-start;

  &.button-group-vertical {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > * + * {
      margin-top: 15px;
    }
  }

  &.button-group-horizontal {
    align-items: center;
    > * {
      flex: 1;
    }
    > * + * {
      margin-left: 0px;
    }
  }
}
</style>
