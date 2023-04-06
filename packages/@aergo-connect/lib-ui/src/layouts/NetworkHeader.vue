<template>
  <div class="network_content" @click="networkModalClick">
    <!-- <div :class="`network_circle ${network}`" /> -->
    <span class="network_name">
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
      const network = this.$store.state.accounts.network;
      if (network === 'mainnet') {
        return `AERGO ${network.toUpperCase()}`;
      } else if (network === 'testnet') {
        return `AERGO ${network.toUpperCase()}`;
      } else if (network === 'alpha') {
        return `AERGO ${network.toUpperCase()}`;
      } else {
        return `${network.toUpperCase()}`;
      }
    },
  },
});
</script>

<style lang="scss">
.network_content {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  /* .network_circle {
    background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
    width: 6px;
    height: 6px;
    margin-right: 5px;
    border-radius: 50%;
    &.mainnet {
      background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
    }
    &.testnet {
      background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
    }
    &.alpha {
      background: linear-gradient(133.72deg, #84ceeb 0%, #f894c8 100%);
    }
  } */
  .network_name {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 19px;
    text-align: center;
    letter-spacing: -0.333333px;
    color: #686767;
  }
  /* .network_name:hover {
    text-decoration: underline;
  } */
}
</style>
