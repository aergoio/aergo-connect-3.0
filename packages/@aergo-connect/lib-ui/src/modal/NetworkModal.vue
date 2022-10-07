<template>
  <div class="network_modal_backdrop" @click="networkModalClick">
    <div class="network_modal_wrapper">
      <div class="network_modal_title">Select Network</div>
      <div class="network_modal_line" />
      <ul class="network_modal_ul">
        <li class="network_modal_li">
          <div class="network_modal_circle1" />
          <span class="network_modal_name" @click="setNetwork('mainnet')">AERGO Mainnet</span>
          <Icon class="network_modal_icon" />
        </li>
        <div class="list_line" />
        <li class="network_modal_li">
          <div class="network_modal_circle2" />
          <span class="network_modal_name" @click="setNetwork('testnet')">AERGO Testnet</span>
          <Icon class="network_modal_icon" />
        </li>
        <div class="list_line" />
        <li class="network_modal_li">
          <div class="network_modal_circle3" />
          <span class="network_modal_name" @click="setNetwork('alpha')">AERGO alpha</span>
          <Icon class="network_modal_icon" />
        </li>
        <div class="list_line" />
      </ul>
      <Button type="primary" size="x-large">Add a network</Button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Icon from '../icons/Icon.vue';
import Button from '../buttons/Button.vue';
export default Vue.extend({
  components: {
    Icon,
    Button,
  },
  methods: {
    networkModalClick() {
      this.$emit('networkModalClick');
    },

    setNetwork(network) {
      this.$store.commit('accounts/setNetwork', network);

      // reset account_data
      this.$router.push({
        name: 'accounts-list',
        params: {
          address: this.$store.state.accounts.address,
        },
      });
    },
  },
});
</script>

<style lang="scss">
.network_modal_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
  .network_modal_wrapper {
    position: absolute;
    width: 375px;
    height: 338px;
    left: 0px;
    top: 262px;
    background: #ffffff;
    box-shadow: 0px -6px 12px rgba(0, 0, 0, 0.1);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    .network_modal_title {
      margin-top: 16px;
      margin-bottom: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      /* identical to box height, or 125% */

      color: #0d0d0d;
    }
    .network_modal_line {
      width: 375px;
      height: 1px;
      background: #d8d8d8;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
    }
    .network_modal_ul {
      height: 294px;
      .list_line {
        margin-left: 24px;
        width: 327px;
        height: 1px;
        background: #f0f0f0;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
      }
      .network_modal_li {
        margin-top: 18px;
        margin-bottom: 18px;
        display: flex;
        align-items: center;

        .network_modal_circle1 {
          margin-left: 34px;
          margin-right: 10px;
          width: 8px;
          height: 8px;
          background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
          border-radius: 50%;
        }
        .network_modal_circle2 {
          margin-left: 34px;
          margin-right: 10px;
          width: 8px;
          height: 8px;
          background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
          border-radius: 50%;
        }
        .network_modal_circle3 {
          margin-left: 34px;
          margin-right: 10px;
          width: 8px;
          height: 8px;
          background: linear-gradient(133.72deg, #84ceeb 0%, #f894c8 100%);
          border-radius: 50%;
        }

        .network_modal_name {
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 20px;
          display: flex;
          align-items: center;
          letter-spacing: -0.333333px;
          color: #0d0d0d;
        }
        .network_modal_icon {
          margin-left: 158px;
        }
      }
    }
  }
}
</style>
