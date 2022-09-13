<template>
  <div class="wrapper">
    <Icon :name="`checkmark-circle`" :size="100" />
    <!-- <Icon :name="`${name}`" :size="100" /> -->
    <h1>{{ title }}</h1>
    <Button :type="`${buttonType}`" size="medium">OK</Button>
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
  },
});
</script>

<style lang="scss">
@import '../styles/mixin.scss';

.wrapper {
  max-width: 317px;
  max-height: 300px;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  @include flex__column__center;
  padding: 30px 14px 20px 14px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

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
