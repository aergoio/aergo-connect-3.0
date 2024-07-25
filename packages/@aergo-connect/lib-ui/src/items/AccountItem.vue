<template>
  <div
    :class="[
      this.$route.name === 'request-accounts-list' ? 'account__item request' : 'account__item',
    ]"
  >
    <div
      :class="[
        this.$route.name === 'request-accounts-list' ? 'name__wrapper request' : 'name__wrapper',
      ]"
      @click="handleActiveAccount"
    >
      <div class="identicon-wrapper">
        <Identicon :text="address" :list="true" />
      </div>
      <span class="name" for="account__name">{{
        this.$route.name === 'request-accounts-list'
          ? `${address.slice(0, 10)}...${address.slice(-10)}`
          : nickname
      }}</span>
    </div>
    <div
      :class="[
        this.$route.name === 'request-accounts-list'
          ? 'address__wrapper request'
          : 'address__wrapper',
      ]"
    >
      <span class="address">{{
        this.$route.name === 'request-accounts-list'
          ? nickname
          : `${address.slice(0, 3)}...${address.slice(-3)}`
      }}</span>
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
    nickname: {
      type: String,
      default: 'ACCOUNT1',
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    async handleActiveAccount() {
      if (this.$route.name === 'request-accounts-list') {
        this.$router.push({ name: 'request-address' }).catch(() => {});
      }
    },
  },
});
</script>

<style lang="scss">
@import '../styles/variables';
.account__item {
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  width: 240px;
  padding: 8px 10px 8px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &.request {
    justify-content: space-around;
  }

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
    /* margin-right: 42px; */
    font-weight: 400;
    font-size: 0.875em;
    line-height: 18px;
    letter-spacing: -0.333333px;
    color: #454344;
    &.request {
      font-size: 1em;
    }
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
    width: 65px;
    &.request {
      font-size: 0.8125em;
    }
    .address {
      font-weight: 300;
      font-size: 0.75em;
      line-height: 15px;
      text-align: center;
      letter-spacing: -0.333333px;
      color: #686767;
    }
  }
}
</style>
