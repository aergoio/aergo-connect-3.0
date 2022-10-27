<template>
  <div class="alert-wrapper" :style="{ width: `${size}px` }">
    <div class="alert-text">{{ title }}</div>
    <Icon :name="`${icon}`" />
  </div>
</template>

<script setup>
import Vue from 'vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
export default Vue.extend({
  components: { Icon },
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 100,
    },
  },
});
</script>

<style lang="scss" scoped>
.alert-wrapper {
  bottom: 0;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 3;
  padding: 8px;
  background: #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 30px;
  .alert-text {
    color: #279ecc;
    margin-right: 5px;
    width: 100%;
  }
  animation: fadeIn 0.5s;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
