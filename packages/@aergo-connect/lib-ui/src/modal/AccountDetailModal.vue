<template>
  <div class="account_detail_backdrop">
    <div class="account_detail_wrapper">
      <div class="title">Account Address</div>
      <div class="flex-row">
        <Identicon text="AmNx7zKkcrzd2hA9TBKhrs446DM1zYYSNcAHfhfKXkKtE6FCvSYAW" />
        <div>ACCOUNT 1</div>
      </div>
      <VueQRCodeComponent
        :text="`AmNx7zKkcrzd2hA9TBKhrs446DM1zYYSNcAHfhfKXkKtE6FCvSYAW`"
        :size="100"
      ></VueQRCodeComponent>
      <div class="address_wrapper">
        <div class="address">AmNx7zKkcrzd2hA9TBKhrs446DM1zYYSNcAHfhfKXkKtE6FCvSYAW</div>
      </div>
      <Button type="primary" @click="handleOK">OK</Button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueQRCodeComponent from 'vue-qrcode-component';
import Identicon from '../content/Identicon.vue';
import Button from '../buttons/Button.vue';
export default Vue.extend({
  components: { Identicon, Button, VueQRCodeComponent },
  methods: {
    handleOK() {
      console.log('ok');
      this.$emit('click');
    },
  },
});
</script>

<style lang="scss">
.account_detail_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;

  .account_detail_wrapper {
    width: 317px;
    height: 400px;
    position: absolute;
    left: 28px;
    top: 110px;
    background: #ffffff;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      margin-top: 20px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 500;
      font-size: 17px;
      line-height: 21px;
      display: flex;
      align-items: center;
      text-align: center;

      color: #000000;
    }
    .flex-row {
      display: flex;
      margin-top: 25px;
      margin-bottom: 15px;
      align-items: center;
    }
    .address_wrapper {
      margin-top: 22px;
      margin-bottom: 32px;
      width: 251px;
      height: 60px;
      /* Primary/Blue02 */
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ecf8fd;
      border-radius: 8px;
      .address {
        word-break: break-all;
        /* Caption/C1_line */

        font-family: 'Outfit';
        font-style: normal;
        font-weight: 300;
        font-size: 15px;
        line-height: 19px;
        letter-spacing: -0.333333px;
        text-decoration-line: underline;

        /* Primary/Blue01 */

        color: #279ecc;
      }
    }
    .button {
      width: 289px;
    }
  }
}
</style>