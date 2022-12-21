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
        <div class="title">{{ title || 'Send transaction' }}</div>
      </div>
      <div class="description">
        The website at {{ request.origin }} wants to {{ actionVerb || 'send' }} a transaction using
        your account.
      </div>
    </div>

    <div class="content" style="padding-top: 0">
      <TxConfirm :txBody="txDataDisplay" />
    </div>

    <template #footer>
      <Appear :delay="0.6">
        <ButtonGroup>
          <Button class="button" type="font-gradation" size="small" @click="cancel">
            <Icon class="button-icon" /><span>Cancel</span>
          </Button>
          <Button class="button" type="font-gradation" size="small" @click="confirm">
            <Icon class="button-icon" /><span>Confirm</span>
          </Button>
        </ButtonGroup>
      </Appear>
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
import { Identicon } from '@aergo-connect/lib-ui/src/content';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { RequestMixin } from './mixin';
import TxConfirm from '../../components/account/TxConfirm.vue';
import { timedAsync } from 'timed-async/index.js';
import { Account } from '@herajs/wallet';
import Transport from '@ledgerhq/hw-transport-webusb';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';

@Component({
  components: {
    ScrollView,
    LoadingDialog,
    Identicon,
    Button,
    ContinueButton,
    ButtonGroup,
    Heading,
    Icon,
    TxConfirm,
    account: {},
    Appear,
  },
})
export default class TxBase extends mixins(RequestMixin) {
  actionVerb = 'send';

  async beforeMount() {
    this.account = await this.$background.getActiveAccount();
  }
  get accountSpec() {
    return {
      address: this.$store.state.accounts.address,
      chainId: this.$store.state.accounts.network,
    };
  }

  get txDataDisplay() {
    if (!this.request) return {};
    return {
      ...this.request.data,
      payload: this.payloadDisplay,
    };
  }
  get payloadParsed() {
    if (!this.request) return Buffer.from([]);
    const txData = this.request.data;
    if (txData.payload_json) {
      return Buffer.from(JSON.stringify(txData.payload_json));
    }
    return Buffer.from(txData.payload, 'base64');
  }
  get payloadDisplay() {
    if (!this.request) return '';
    const txData = this.request.data;
    if (txData.payload_json) {
      return JSON.stringify(txData.payload_json, null, 2);
    }
    return txData.payload;
  }
  created() {
    this.$store.dispatch('accounts/updateAccount', this.accountSpec);
  }
  async signWithLedger(txBody: any) {
    const { tx } = await this.$background.prepareTransaction(
      txBody,
      this.$store.state.accounts.network,
    );
    tx.payload = txBody.payload;
    this.setStatus('loading', 'Connecting to Ledger device...');
    const transport = await timedAsync(Transport.create(5000), { fastTime: 1000 });
    const app = new LedgerAppAergo(transport);
    this.setStatus('loading', 'Please confirm transaction on device!');
    try {
      await app.getWalletAddress(this.account.data.derivationPath);
      const { signature } = await app.signTransaction(tx);
      tx.sign = signature;
      return tx;
    } catch (e) {
      if (`${e}`.match(/0x6982/)) {
        throw new Error('Transaction was rejected.');
      } else if (`${e}`.match(/No device selected/)) {
        throw new Error("You didn't select a compatible USB device.");
      } else if (`${e}`.match(/CLA_NOT_SUPPORTED/)) {
        throw new Error('Make sure to activate the Aergo app on your device and try again.');
      } else {
        throw e;
      }
    }
  }
  handleGoBack() {
    this.$router.push({ name: 'request-accounts-list' }).catch(() => {});
  }
  async confirmHandler(): Promise<any> {
    console.log('RequestSend confirmHandler');
    if (!this.request) return;
    let txBody = {
      ...this.request.data,
      payload: Array.from(this.payloadParsed),
      from: this.$store.state.accounts.address,
    };

    console.log('txBody', txBody);

    if (!this.account) {
      // This shouldn't happen normally
      throw new Error('Could not load account, please reload page and try again.');
    }

    if (this.account.data.type === 'ledger') {
      txBody = await this.signWithLedger(txBody);
      if (this.actionVerb === 'sign') {
        return {
          account: this.accountSpec,
          signature: txBody.sign,
        };
      }
    }

    if (this.actionVerb === 'sign') {
      this.setStatus('loading', 'Calculating signature...');
      const result = await this.$background.signTransaction(
        txBody,
        this.$store.state.accounts.network,
      );

      console.log('sign', result);

      if ('tx' in result) {
        return {
          account: this.accountSpec,
          signature: result.tx.signature,
        };
      }
    } else {
      this.setStatus('loading', 'Sending to network...');
      const result = await timedAsync(
        this.$background.sendTransaction(txBody, this.$store.state.accounts.network),
      );

      console.log('noSign', result);

      if ('tx' in result) {
        return {
          hash: result.tx.hash,
        };
      }
    }

    // This shouldn't happen normally
    throw new Error('Result is missing transaction information.');
  }
}
</script>
