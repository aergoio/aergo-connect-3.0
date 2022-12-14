<template>
  <div class="account_detail_backdrop" @click="handleBack">
    <div class="account_detail_wrapper">
      <div class="title">Account Address</div>
      <div class="flex-row">
        <Identicon :text="$store.state.accounts.address" />
        <div class="nick">{{ $store.state.accounts.nick }}</div>
      </div>
      <VueQRCodeComponent
        :text="JSON.stringify({ type: 'AERGO_REQUEST', address: $store.state.accounts.address })"
        :size="123"
      ></VueQRCodeComponent>
      <div class="address_wrapper">
        <div class="address" @click="copyToClipboard($store.state.accounts.address)">
          {{ $store.state.accounts.address }}
        </div>
      </div>
      <ButtonGroup vertical>
        <Button type="primary" @click="handleReceive" hover>Receive</Button>
      </ButtonGroup>
    </div>
    <Notification v-if="clipboardNotification" :title="`Copied!`" :icon="`check`" />
  </div>
</template>

<script>
import Vue from 'vue';
import VueQRCodeComponent from 'vue-qrcode-component';
import Notification from './Notification.vue';
import Identicon from '../content/Identicon.vue';
import Button from '../buttons/Button.vue';
import ButtonGroup from '../buttons/ButtonGroup.vue';
export default Vue.extend({
  components: { Identicon, ButtonGroup, Button, VueQRCodeComponent, Notification },
  data() {
    return {
      clipboardNotification: false,
    };
  },
  watch: {
    clipboardNotification(state) {
      if (state) {
        setTimeout(() => {
          const time = (this.clipboardNotification = !state);
          return () => {
            clearTimeout(time);
          };
        }, 2000);
      }
    },
  },
  methods: {
    handleBack(event) {
      if (event.eventPhase === 2) {
        this.$emit('cancel', 'accountDetailModal');
      }
    },
    handleButtonOK() {
      this.$emit('cancel', 'accountDetailModal');
    },
    handleReceive() {
      this.$router.push({ name: 'receive' });
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      this.clipboardNotification = true;
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
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  .account_detail_wrapper {
    width: 317px;
    height: 410px;
    position: absolute;
    left: 28px;
    top: 85px;
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
      max-width: 270px;
      .nick {
        margin-left: 5px;
        word-break: break-all;
      }
    }
    .address_wrapper {
      margin-top: 15px;
      margin-bottom: 15px;
      width: 251px;
      /* Primary/Blue02 */
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ecf8fd;
      border-radius: 8px;
      .address {
        padding: 12px;
        cursor: pointer;
        word-break: break-all;
        /* Caption/C1_line */

        font-family: 'Outfit';
        font-style: normal;
        font-weight: 300;
        font-size: 14.5px;
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
    .button-group-vertical {
      margin-left: 8px;
    }
  }
}
</style>
