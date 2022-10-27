<template>
  <div class="alert-wrapper">
    <div class="alert-text">Copied</div>
    <Icon :name="`check`" />
  </div>
</template>

<script>
import Vue from 'vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
export default Vue.extend({
  components: { Icon },
});
</script>

<style lang="scss">
.alert-wrapper {
  z-index: 3;
  position: absolute;
  left: 140px;
  bottom: 50px;
  background: #fff;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100px;
  height: 30px;
  .alert-text {
    color: #279ecc;
    margin-right: 5px;
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
