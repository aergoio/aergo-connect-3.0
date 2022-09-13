<template>
  <div class="confirmModal-backdrop">
    <div class="confirmModal-wrapper">
      <Icon :name="`checkmark-circle`" :size="100" />
      <!-- <Icon :name="`${name}`" :size="100" /> -->
      <h1>{{ title }}</h1>
      <Button :type="`${buttonType}`" size="medium" :to="{ name: `${to}` }">OK</Button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../icons/Icon.vue';
import Button from '../buttons/Button.vue';

export default Vue.extend({
  components: { Icon, Button },
  props: {
    title: {
      type: String,
      default: '',
    },
    buttonType: {
      type: String,
      default: 'gradation',
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  .confirmModal-wrapper {
    background: white;
    max-width: 317px;
    height: 335px;
    box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    @include flex__column__center;
    padding: 30px 14px 20px 14px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-between;

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
}
</style>
