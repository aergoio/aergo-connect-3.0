<template>
  <div class="receive_backdrop">
    <div class="receive_wrapper">
      <VueQRCodeComponent class="qr" :text="inputText" :size="123"></VueQRCodeComponent>
      <div class="amount_wrapper">
        <span>{{ `${amount} ${symbol}` }}</span>
      </div>
      <div class="description">
        Show the above QR code to the sender. The sender can scan this QR code in the AERGO Connect
        APP to send a transaction.
      </div>
      <Button type="gradation" @click="handleOK">OK</Button>
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

  props: {
    amount: Number,
    symbol: String,
    asset: String,
  },

  data() {
    return {
      inputText: '',
    };
  },

  async beforeMount() {
    this.inputText =
      this.asset + ' ' + this.$store.state.session.address + ' ' + Number(this.amount);
  },

  methods: {
    handleOK() {
      console.log('ok');
      this.$emit('confirm', 'receiveModal');
    },
  },
});
</script>

<style lang="scss">
.receive_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;

  .receive_wrapper {
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
    .qr {
      margin-top: 46px;
      margin-bottom: 24px;
    }
    .description {
      margin-top: 15px;
      margin-bottom: 41px;
      /* Headline/H3 */
      width: 277px;
      word-break: break-all;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      text-align: center;
      letter-spacing: -0.333333px;

      /* Grey/06 */

      color: #686767;
    }
    .amount_wrapper {
      /* Headline/H3 */

      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      text-align: center;
      letter-spacing: -0.333333px;

      color: #363636;
    }
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
      margin-top: 20px;
      margin-bottom: 20px;
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
