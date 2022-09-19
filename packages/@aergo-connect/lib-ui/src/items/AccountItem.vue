<template>
  <div class="account__item">
    <div class="name__wrapper">
      <div class="identicon-wrapper">
        <Identicon :text="address" :list="true" />
      </div>
      <span class="name" for="account__name">ACCOUNT1</span>
    </div>
    <div class="address__wrapper">
      <span class="address">{{ address }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Identicon } from '@aergo-connect/lib-ui/src/content';

export default Vue.extend({
  components: {
    Identicon,
  },
  props: {
    address: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    formatAddress() {
      this.address = 'formatted';
    },
  },
  methods: {},
});
</script>

<style lang="scss">
@import '../styles/variables';
.account__item {
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  width: 233px;
  padding: 8px 10px 8px 10px;
  align-items: center;

  cursor: pointer;
  &.active {
    background: #eff5f7;
  }
  &:hover {
    background: #f6f6f6;
  }
  .name__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 42px;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: -0.333333px;
    color: #454344;
    .identicon-wrapper {
      margin-right: 8px;
      border: 1px solid #d8d8d8;
      border-radius: 4px;
      .identicon {
        width: 20px;
        height: 20px;
      }
    }
  }

  .address__wrapper {
    background: #dae8ee;
    border-radius: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px 8px;

    .address {
      font-weight: 300;
      font-size: 12px;
      line-height: 15px;
      text-align: center;
      letter-spacing: -0.333333px;
      color: #686767;
    }
  }
}
</style>
