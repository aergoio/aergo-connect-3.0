<template>
  <ScrollView class="page">
    <div class="account_info_wrapper">
      <Icon :name="`back`" @click="handleGoBack" />
      <Identicon :text="$store.state.accounts.address" class="account_info_img" />
      <div class="account_info_content_wrapper">
        <div class="account_info_nickname_wrapper">
          <div class="account_info_nickname_text">
            {{ $store.state.accounts.nick }}
          </div>
          <div class="account_info_network_wrapper">
            <div :class="`account_info_network_circle ${$store.state.accounts.network}`" />
            <div class="account_info_network">
              {{ `AERGO ${$store.state.accounts.network.toUpperCase()}` }}
            </div>
          </div>
        </div>
        <div class="account_info_address_wrapper">
          <span class="account_info_address_text">{{
            `${$store.state.accounts.address.slice(0, 15)}...${$store.state.accounts.address.slice(
              -5,
            )}`
          }}</span>
        </div>
      </div>
    </div>

    <div class="request_content" style="padding-bottom: 0">
      <div class="icon-header">
        <Icon :name="`title-request`" :size="36" />
        <div class="title">Sign message</div>
      </div>
      <div class="description">
        The website at {{ request.origin }} wants to sign a message using your account.
      </div>
      <p class="unsupported-error" v-if="ledgerSignHashUnsupported">
        For security reasons, signing hashes is not supported on the Ledger app. Use a
        browser-stored account or request support from the Dapp developer.<br />
        Advice for developer: change the API call to pass the original message as `message` instead
        of a precomputed `hash`.
      </p>
      <div class="sign-message">
        {{ msgToSign }}
      </div>
    </div>

    <template #footer>
      <ButtonGroup>
        <Button class="button" type="font-gradation" size="small" @click="cancel">
          <Icon class="button-icon" /><span>Cancel</span>
        </Button>
        <Button class="button" type="font-gradation" size="small" @click="confirm">
          <Icon class="button-icon" /><span>Confirm</span>
        </Button>
      </ButtonGroup>
      <LoadingDialog
        :visible="statusDialogVisible"
        @close="statusDialogVisible = false"
        :state="dialogState"
      >
        <p v-if="dialogState !== 'error'">{{ statusText }}</p>
        <p v-else class="error">{{ statusText }}</p>
      </LoadingDialog>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { ScrollView, LoadingDialog } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup, ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import { Identicon } from '@aergo-connect/lib-ui/src/content';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { RequestMixin } from './mixin';
import { timedAsync } from 'timed-async/index.js';
import { Account } from '@herajs/wallet';
import { encodeBuffer } from '@herajs/common';
import Transport from '@ledgerhq/hw-transport-webusb';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';

@Component({
  components: {
    ScrollView,
    LoadingDialog,
    Button,
    ContinueButton,
    ButtonGroup,
    Heading,
    Icon,
    Identicon,
    account: {},
    Appear,
  },
})
export default class RequestSign extends mixins(RequestMixin) {
  async beforeMount() {
    this.account = await this.$background.getActiveAccount();
  }

  get accountSpec() {
    return {
      address: this.$store.state.accounts.address,
      chainId: this.$store.state.accounts.network,
    };
  }
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
*/
  get msgToSign() {
    // if (!this.request) return '';
    return this.request.data.message || this.request.data.hash;
  }
  get signSource() {
    if (!this.request || this.request.data.message) {
      return 'message';
    }
    return 'hash';
  }
  get ledgerSignHashUnsupported() {
    if (!this.request || !this.account) return false;
    return this.signSource === 'hash' && this.account.data.type === 'ledger';
  }

  async confirmHandler() {
    if (!this.request) return;
    if (!this.account) {
      throw new Error('Could not load account, please reload page and try again.');
    }

    const account = this.accountSpec;

    this.setStatus('loading', 'Calculating signature...');
    const message = this.msgToSign;

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
    /*
    if (this.account.data.type === 'ledger') {
      const signature = await timedAsync(this.signWithLedger(buf, displayAsHex));
      return {
        account,
        signature,
      };
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

    if (this.signSource === 'message') {
      callData.message = Array.from(Uint8Array.from(buf));
    } else {
      callData.hash = Array.from(Uint8Array.from(buf));
    }
    const result = await timedAsync(this.$background.signMessage(callData));

    return {
      account,
      signature: result.signedMessage,
    };
  }
  handleGoBack() {
    this.$router.push({ name: 'request-accounts-list' }).catch(() => {});
  }
}
</script>

<style lang="scss">
.sign-message {
  border-radius: 4px;
  background-color: #f0f0f0;
  padding: 16px;
  margin: 0 20px;
  margin-top: 20px;
  font-size: (calc(14 / 16)) * 1rem;
  color: #279ecc;
  word-break: break-all;
  line-height: 1.3;
}
.unsupported-error {
  margin: 0 20px;
  color: red;
  font-size: 0.85em;
}
</style>
