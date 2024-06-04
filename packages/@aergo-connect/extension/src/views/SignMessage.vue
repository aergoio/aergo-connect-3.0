<template>
  <ScrollView>
    <Header button="back" title="Sign Message" @backClick="handleBack" />
    <div class="sign_content">
      <div class="sign_title">Enter Your message</div>
      <div>
        <div class="sign_message_text">Sign Message</div>
        <TextArea class="textarea_size" v-model="message" />
        <div class="sign_message_confirm">
          <CheckboxButton :checked="isHashed" @check="checkFunc(isHashed)" />
          <div class="sign_message_hash_text" @click="checkFunc(isHashed)">
            This is a message hash
          </div>
          <Button type="primary-outline" class="button_size" @click="confirm">OK</Button>
        </div>
      </div>
      <div class="hash_result" v-if="signature">
        <TextArea
          :class="[signature ? 'textarea_size active' : 'textarea_size']"
          :placeholder="signature"
          :readonly="true"
        />
        <Button
          :class="[clipboardNotification ? 'copy_button active' : 'copy_button']"
          type="primary-outline"
          @click="copyText(signature)"
          ><Icon
            :name="[clipboardNotification ? `checkmarkwhite` : `copybutton`]"
            class="copy_icon"
          />
          {{ clipboardNotification ? `Copied` : `Copy` }}</Button
        >
      </div>
    </div>
    <template #footer>
      <Button type="primary" size="large" @click="handleBack" hover>OK</Button>
    </template>
    <LoadingDialog
      :visible="statusDialogVisible"
      @close="statusDialogVisible = false"
      :state="dialogState"
    >
      <p v-if="dialogState !== 'error'">{{ statusText }}</p>
      <p v-else class="error">{{ statusText }}</p>
    </LoadingDialog>
    <!-- <Notification v-if="clipboardNotification" :title="`Copied!`" :icon="`check`" /> -->
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import TextArea from '@aergo-connect/lib-ui/src/forms/TextArea.vue';
import CheckboxButton from '@aergo-connect/lib-ui/src/buttons/CheckboxButton.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import Notification from '@aergo-connect/lib-ui/src/modal/Notification.vue';
import Component, { mixins } from 'vue-class-component';
import { timedAsync } from 'timed-async/index.js';
import { Account } from '@herajs/wallet';
import { encodeBuffer } from '@herajs/common';
import Transport from '@ledgerhq/hw-transport-webusb';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';
import { ScrollView, LoadingDialog } from '@aergo-connect/lib-ui/src/layouts';
import { Watch } from 'vue-property-decorator';
import { signMessage } from '@herajs/crypto';
@Component({
  components: {
    Header,
    ScrollView,
    LoadingDialog,
    Icon,
    Button,
    CheckboxButton,
    TextArea,
    Notification,
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
  clipboardNotification = false;

  setStatus(state: 'loading' | 'success' | 'error', text: string) {
    this.dialogState = state;
    this.statusText = text;
    this.statusDialogVisible = true;
  }

  get accountSpec() {
    return {
      address: this.$store.state.accounts.address,
      chainId: this.$store.state.accounts.chainId,
    };
  }

  get account(): Account {
    return this.$background.getActiveAccount();
  }

  @Watch('clipboardNotification')
  clipboardNotificationMethod(state) {
    if (state) {
      setTimeout(() => {
        const time = (this.clipboardNotification = !state);
        return () => {
          clearTimeout(time);
        };
      }, 2000);
    }
  }

  async signWithLedger(message: Buffer, displayAsHex = false) {
    this.setStatus('loading', 'Connecting to Ledger device...');
    const transport = await timedAsync(Transport.create(5000), { fastTime: 1000 });
    const app = new LedgerAppAergo(transport);
    this.setStatus('loading', 'Please confirm message on device!');
    try {
      await app.getWalletAddress(this.account.data.derivationPath);
      const result = await app.signMessage(message, displayAsHex);
      return encodeBuffer(Buffer.from(result.signature, 'base64'), 'hex');
    } catch (e) {
      if (`${e}`.match(/0x6982/)) {
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

  checkFunc(checked: boolean) {
    this.isHashed = !checked;
  }

  async handleBack() {
    this.$router.push({ name: 'accounts-list' });
  }

  async copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.copyToClipboard(text);
    } catch ($e) {
      alert('error', $e);
    }
  }

  async confirmHandler() {
    this.setStatus('loading', 'Calculating signature...');
    const message = this.message;

    let buf = Buffer.from(message);
    let displayAsHex = false;

    if (message.substr(0, 2) === '0x') {
      try {
        buf = Buffer.from(message.substr(2), 'hex');
        displayAsHex = true;
      } catch (e) {
        throw new Error(`Failed to parse message: ${e}`);
      }
    }
    const account = await this.account;

    if (account.data.type === 'ledger') {
      if (this.isHashed) {
        throw new Error(
          'The Ledger app does not support pre-hashed messages for security reasons. Please enter the original message instead.',
        );
      }
      this.signature = await timedAsync(this.signWithLedger(buf, displayAsHex));
      console.log(this.signature, 'signature in SignMessage');
      return;
    }

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
  copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    this.clipboardNotification = true;
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
    margin-left: 7px;
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
    .textarea {
      /* Caption/C2 */

      font-family: 'Outfit';
      font-style: normal;
      font-weight: 300;
      font-size: 14px;
      line-height: 18px;
      letter-spacing: -0.333333px;

      /* Grey/06 */

      color: #686767;
    }
    .textarea_size {
      height: 102px;
      &.active {
        /* Primary/Blue03 */

        background: #ecf8fd;
        /* Primary/Blue01 */

        border: 2px solid #279ecc;
        border-radius: 4px;
      }
    }
    .copy_button {
      float: right;
      width: 89px;
      height: 19px;
      margin-top: 6px;
      margin-right: 9px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 19px;
      /* identical to box height */

      text-align: center;
      letter-spacing: -0.333333px;

      /* Primary/Blue01 */

      color: #279ecc;
      &.active {
        background: #279ecc;
        border-radius: 4px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 19px;
        /* identical to box height */

        text-align: center;
        letter-spacing: -0.333333px;

        /* Grey/White */

        color: #ffffff;
      }
      .copy_icon {
        margin-right: 5px;
      }
    }
    .copy_button:hover {
      background: #279ecc;
      color: #ffffff;
      .icon--copybutton {
        path {
          fill: #ffffff;
        }
      }
    }
  }
  .textarea_size {
    width: 327px;
    height: 80px;
  }
  .sign_message_confirm {
    display: flex;
    align-items: center;
    margin-left: 7px;
    .sign_message_hash_text {
      cursor: pointer;
      margin-left: 5px;
      margin-right: 66px;
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
      margin-top: 6px;
      width: 89px;
      height: 28px;
    }
    .button_size:hover {
      background: #279ecc;
      color: #ffffff;
    }
  }
  .button-type-primary-outline {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 19px;
    /* identical to box height */

    text-align: center;
    letter-spacing: -0.333333px;

    /* Primary/Blue01 */

    color: #279ecc;
  }
}
</style>
import LoadingIndicatorVue from '@aergo-connect/lib-ui/src/icons/LoadingIndicator.vue';
