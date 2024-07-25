<template>
  <Appear :delay="0">
    <div class="alert-wrapper" :style="{ width: `${size}px` }">
      <div class="alert-text">{{ title }}</div>
      <Icon :name="`${icon}`" />
    </div>
  </Appear>
</template>

<script setup>
import Vue from 'vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import Appear from '../animations/Appear.vue';
export default Vue.extend({
  components: { Icon, Appear },
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'warning2',
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
  margin: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 50%;
  z-index: 3;
  padding: 8px;
  background: #fff;
  /* border: #f0f0f0; */
  /* border-style: solid; */
  /* border-width: 0.1px; */
  /* height: 100%; */
  height: 40px;
  border: solid 1px #f0f0f0;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  animation: fadeIn 0.5s;
  .icon--warning2 {
    padding-top: 10px;
  }
  .alert-text {
    color: #e4097d;
    margin-right: 5px;
    width: 100%;
    padding: 8px;
  }

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
