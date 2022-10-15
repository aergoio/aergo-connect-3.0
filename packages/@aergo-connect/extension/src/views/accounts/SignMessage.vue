<template>
  <ScrollView>
    <Header button="back" title="Sign Message" @backClick="handleBack" />
    <div class="sign_content">
      <div class="sign_title">Enter Your message</div>
      <div>
        <div class="sign_message_text">Sign Message</div>
        <TextArea class="textarea_size" v-model="message" />
        <div class="sign_message_confirm">
          <CheckboxButton v-model="isHashed" />
          <div class="sign_message_hash_text">This is a message hash</div>
          <Button type="primary-outline" class="button_size" @click="confirm">OK</Button>
        </div>
      </div>
      <div class="hash_result" v-if="signature">
        <TextArea class="textarea_size" :placeholder="signature" :readonly=true />  
        <Button class="copy_button" type="primary-outline" @click="copyText(signature)" >Copy</Button>
      </div>
    </div>
    <template #footer>
      <Button type="primary" size="large"   @click="handleBack">OK</Button>
    </template>
      <LoadingDialog :visible="statusDialogVisible" @close="statusDialogVisible=false" :state="dialogState">
        <p v-if="dialogState !== 'error'">{{statusText}}</p>
        <p v-else class="error">{{statusText}}</p>
      </LoadingDialog>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import TextArea from '@aergo-connect/lib-ui/src/forms/TextArea.vue';
import CheckboxButton from '@aergo-connect/lib-ui/src/buttons/CheckboxButton.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import Component, { mixins } from 'vue-class-component';
import { timedAsync } from 'timed-async/index.js';
import { Account } from '@herajs/wallet';
import { encodeBuffer } from '@herajs/common';
import Transport from '@ledgerhq/hw-transport-webusb';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';
import { ScrollView, LoadingDialog } from '@aergo-connect/lib-ui/src/layouts';

@Component({
  components: {
    Header,
    ScrollView,
    LoadingDialog,
    Button,
    CheckboxButton,
    TextArea,
  },
})

export default class RequestSign extends mixins() {
  message = '';
  signature = '';
  statusText = '';
  signature = '';
  statusText = '';
  statusDialogVisible = false;
  dialogState: 'loading' | 'success' | 'error' = 'loading';
  isHashed = false;

  setStatus(state: 'loading' | 'success' | 'error', text: string) {
    this.dialogState = state;
    this.statusText = text;
    this.statusDialogVisible = true;
  }

  get accountSpec() {
    return { address: this.$store.state.accounts.address, chainId: this.$store.state.accounts.network };
  }

/*
  get account(): Account {
    return this.$store.getters['accounts/getAccount'](this.accountSpec);
  }
  created() {
    this.$store.dispatch('accounts/updateAccount', this.accountSpec);
  }
*/

/*
  async signWithLedger(message: Buffer, displayAsHex = false) {
    this.setStatus('loading', 'Connecting to Ledger device...');
    const transport = await timedAsync(Transport.create(5000), { fastTime: 1000 });
    const app = new LedgerAppAergo(transport);
    this.setStatus('loading', 'Please confirm message on device!');
    try {
      await app.getWalletAddress(this.account.data.derivationPath);
      const result = await app.signMessage(message, displayAsHex);
      return encodeBuffer(Buffer.from(result.signature, 'base64'), 'hex');
      const result = await app.signMessage(message, displayAsHex);
      return encodeBuffer(Buffer.from(result.signature, 'base64'), 'hex');
        throw new Error('Message was rejected.');
      } else if (`${e}`.match(/No device selected/)) {
        throw new Error("You didn't select a compatible USB device.");
      } else if (`${e}`.match(/CLA_NOT_SUPPORTED/)) {
        throw new Error('Make sure to activate the Aergo app on your device and try again.');
      } else {
        throw e;
      }
    }
  }
*/

  async handleBack() {
    this.$router.push({ name: 'accounts-list' });
  }

  async copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied');
/*
      chrome.notifications.create('copy', { type: 'basic', 
        iconUrl: '../img/icon-17.b1b4347e.png', 
        title: 'copied!', message: 'copied!', priority: 1 });
*/
    } catch($e) {
      alert('error', $e);
    }

  }

  async confirmHandler() {

/*
    if (!this.account) {
      throw new Error('Could not load account, please reload page and try again.');
    }
*/

    this.setStatus('loading', 'Calculating signature...');

    const message = this.message;

    let buf = Buffer.from(message);
    let displayAsHex = false;

    if (message.substr(0, 2) === '0x') {
      try {
        buf = Buffer.from(message.substr(2), "hex");
        displayAsHex = true;
      } catch (e) {
        throw new Error(`Failed to parse message: ${e}`);
      }
    }

/*
    if (this.account.data.type === 'ledger') {
      if (this.isHashed) {
      }
      this.signature = await timedAsync(this.signWithLedger(buf, displayAsHex));
      return
    }
*/

    const { address, chainId } = this.accountSpec;

    const callData: {
      address: string;
      chainId: string;
      hash?: number[];
      message?: number[];
    } = {
      address,
      chainId,
    };

    if (!this.isHashed) {
      callData.message = Array.from(Uint8Array.from(buf));
    } else {
      callData.hash = Array.from(Uint8Array.from(buf));
    }
    const result = await timedAsync(this.$background.signMessage(callData));
    this.signature = result.signedMessage;
  }

  async confirm() {
    try {
      await this.confirmHandler();
      this.setStatus('success', 'Done');
      window.setTimeout(() => {
        this.statusDialogVisible = false;
      }, 500);
    } catch (e) {
      this.setStatus('error', `${e}`);
    }
  }
}
</script>

<style lang="scss">
.sign_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .sign_title {
    margin-top: 46px;
    margin-bottom: 35px;
    width: 318px;
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: -0.333333px;

    color: #231f20;
  }
  .sign_message_text {
    width: 93px;
    margin-bottom: 10px;
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.333333px;

    /* Grey/07 */

    color: #454344;
  }
  .hash_result {
    margin-top: 30px;
    .textarea_size {
      height: 102px;
    }
    .copy_button {
      float: right;
      width: 34px;
      height: 19px;
      margin-top: 6px;
      margin-right: 9px;
    }
  }
  .textarea_size {
    width: 327px;
    height: 80px;
  }
  .sign_message_confirm {
    display: flex;
    align-items: center;
    .sign_message_hash_text {
      margin-left: 4px;
      margin-right: 71px;
      width: 143px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 19px;
      /* identical to box height */

      letter-spacing: -0.333333px;

      /* Grey/06 */

      color: #686767;
    }
    .button_size {
      margin-top: 10px;
      width: 89px;
      height: 30px;
    }
  }
}
</style>
