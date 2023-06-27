<template>
  <div class="confirmModal-backdrop">
    <Appear :delay="0.1">
      <div class="confirmModal-wrapper">
        <Icon :name="`checkmark-circle`" :size="100" />
        <!-- <Icon :name="`${name}`" :size="100" /> -->
        <h1>{{ title }}</h1>
        <Button :type="`${buttonType}`" size="medium" :to="{ name: `${to}` }" hover>OK</Button>
      </div>
    </Appear>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../icons/Icon.vue';
import Button from '../buttons/Button.vue';
// import AppearVue from '@/animations/Appear.vue';
import Appear from '../animations/Appear.vue';
export default Vue.extend({
  components: { Icon, Button, Appear },
  props: {
    title: {
      type: String,
      default: '',
    },
    buttonType: {
      type: String,
      default: 'primary',
    },
    to: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss">
@import '../styles/mixin.scss';

.confirmModal-backdrop {
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirmModal-wrapper {
  background: white;
  max-width: 317px;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  @include flex__column__center;
  padding: 30px 14px 20px 14px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  right: 8%;
  transform: translateY(-50%);
  h1 {
    text-align: center;
    word-wrap: break-word;
    width: 200px;
    font-weight: 600;
    font-size: 24px;
    line-height: 30px;
    margin: 30px 0 43px 0;
  }
}
</style>
