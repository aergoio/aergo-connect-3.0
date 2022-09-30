<template>
  <div class="network_content">
    <div class="network_circle" />
    <span class="network_name" @click="networkModalClick">
      {{ network }}
    </span>
  </div>
</template>

<script>
import Vue from 'vue';
export default Vue.extend({
  methods: {
    networkModalClick() {
      this.$emit('networkModalClick');
    },
  },
  computed: {
    network() {
      const network = localStorage.getItem("Network") ;
      if (!network) {
        return "AERGO MAINNET" ;
      } else {
        return network ;
      }
    }
  }
});
</script>

<style lang="scss">
.network_content {
  display: flex;
  justify-content: center;
  align-items: center;
  .network_circle {
    background: #e4097d;
    width: 6px;
    height: 6px;
    margin-right: 2px;
    border-radius: 50%;
  }
  .network_name {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 19px;
    text-align: center;
    letter-spacing: -0.333333px;
    color: #686767;
    cursor: pointer;
  }
  .network_name:hover {
    text-decoration: underline;
  }
}
</style>
