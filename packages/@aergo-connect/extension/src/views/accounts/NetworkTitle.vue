<template>
  <div>
    <span>.</span>
    <span> {{ network }} </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  components: {},
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

<style lang="scss"></style>
