<template>
  <ScrollView>
    <LoadingBar v-if="isLoading" />
    <SendOptionsModal
      v-if="optionsModal"
      :txType="txType"
      :payload="txBody.payload"
      @updateTx="updateTx"
    />
    <ConfirmationModal
      v-if="confirmationModal"
      :to="inputTo"
      :amount="inputAmount"
      :symbol="symbol"
      :txType="txType"
      :tokenType="tokenType"
      :payload="txBody.payload"
      @cancel="handleCancel"
      @confirm="handlePassword"
    />
    <SendFinishModal
      v-if="sendFinishModal"
      :asset="asset"
      :txHash="txHash"
      :receipt="inputTo"
      :amount="inputAmount"
      :symbol="symbol"
      :tokenType="tokenType"
      :fee="fee"
      @close="handleSent"
    />
    <PasswordModal v-if="passwordModal" @cancel="handleCancel" @confirm="handleConfirm" />
    <Header button="back" title="Send" @backClick="handleBack" />
    <div class="send_content_wrapper">
      <div class="account_detail_wrapper">
        <div class="direction-row">
          <div class="circle" />
          <div class="network">
            {{ this.$store.state.accounts.network || `AERGO Mainnet` }}
          </div>
        </div>
        <div class="account_wrapper">
          <Identicon :text="$store.state.accounts.address" class="account_icon" />
          <div class="account_title">
            {{
              $store.state.accounts.nick.length > 17
                ? `${$store.state.accounts.nick.slice(0, 17)}...`
                : $store.state.accounts.nick
            }}
          </div>
          <div class="account_title_wrapper">
            <div class="account" @click="copyToClipboard($store.state.accounts.address)">
              {{
                `${$store.state.accounts.address.slice(
                  0,
                  6,
                )}...${$store.state.accounts.address.slice(-6)}`
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="token_content_wrapper">
        <Icon v-if="asset === 'AERGO'" class="token_icon" :name="`aergo`" />
        <!-- <Identicon v-else-if="!icon" :text="asset" class="token_icon" /> -->
        <Icon v-else-if="!icon" :name="`defaultToken`" class="token_icon" />
        <img v-else class="token_icon" :src="icon" />

        <div v-if="tokenType !== 'ARC2'" class="amount_wrapper">
          <span class="token_amount">{{ Number(balance).toFixed(3) }}</span>
          <span class="token_symbol"> {{ symbol }}</span>
        </div>
        <div v-else class="amount_wrapper">
          <span class="token_amount">{{ balance }}</span>
          <span class="token_symbol"> EA </span>
        </div>
      </div>
      <div v-if="!isLoading" class="send_form_wrapper">
        <div class="flex-row">
          <div class="title">Asset</div>
          <select class="select_box" v-model="asset">
            <option v-for="token in $store.state.session.tokens" :value="token.hash">
              <img :src="token.meta.image" alt="404" />
              <span>{{ token.meta.name }}</span>
            </option>
          </select>
        </div>
        <div class="flex-row" v-if="tokenType == 'ARC2'">
          <div class="title">NFT ID</div>
          <div class="flex-column-searchbox">
            <TextField
              placeholder="Type ID"
              v-model="inputAmount"
              @input="searchNFT"
              ref="target"
            />
            <!--
            <ul
              class="search_list_wrapper"
              v-if="searchResult.length && searchFocus"
              :style="{ height: searchStyle() }"
            >
-->
            <ul
              class="search_list_wrapper"
              v-if="searchResult.length"
              :style="{ height: searchStyle() }"
            >
              <li
                class="search_list"
                v-for="item in searchResult"
                @click="selectNFT(item)"
                :key="item.meta.token_id"
              >
                <span class="text"> {{ `${item.meta.token_id}` }} </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex-row" v-else>
          <div class="title">Amount</div>
          <input v-model="inputAmount" type="text" class="text_box" />
        </div>
        <div class="flex-column">
          <div class="title">Send to</div>
          <input v-model="inputTo" type="text" class="text_box" />
        </div>
      </div>
    </div>
    <LoadingDialog
      :visible="statusDialogVisible"
      @close="statusDialogVisible = false"
      :title="statusDialogTitle"
      :state="dialogState"
    >
      <p v-if="dialogState !== 'error'">{{ statusText }}</p>
      <p v-else class="error">{{ statusText }}</p>
    </LoadingDialog>
    <Notification v-if="clipboardNotification" :title="`Copied!`" :icon="`check`" />
    <Notification v-if="notification" :title="notificationText" :icon="`warning2`" :size="250" />
    <template v-if="!isLoading" #footer>
      <div v-if="asset === `AERGO`" class="show_option" @click="handleOptionsModal">
        Show optional fields
      </div>
      <Button
        v-if="!sendFinishModal || !isLoading"
        type="primary"
        size="large"
        @click="handleSendClick"
        >Send</Button
      >
    </template>
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import SendOptionsModal from '@aergo-connect/lib-ui/src/modal/SendOptionsModal.vue';
import ConfirmationModal from '@aergo-connect/lib-ui/src/modal/ConfirmationModal.vue';
import Notification from '@aergo-connect/lib-ui/src/modal/Notification.vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import Identicon from '@aergo-connect/lib-ui/src/content/Identicon.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import LoadingDialog from '@aergo-connect/lib-ui/src/layouts/LoadingDialog.vue';
import SendFinishModal from '@aergo-connect/lib-ui/src/modal/SendFinishModal.vue';
import TextField from '@aergo-connect/lib-ui/src/forms/TextField.vue';
import LoadingBar from '@aergo-connect/lib-ui/src/forms/LoadingBar.vue';
// for TX
import { timedAsync } from 'timed-async/index.js';
import Transport from '@ledgerhq/hw-transport-webusb';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';
import { Tx } from '@herajs/client';
import PasswordModal from '@aergo-connect/lib-ui/src/modal/PasswordModal.vue';
import { bigIntToString } from '@aergo-connect/extension/src/utils/checkDecimals';

export default Vue.extend({
  components: {
    ScrollView,
    SendOptionsModal,
    ConfirmationModal,
    PasswordModal,
    Header,
    Identicon,
    Icon,
    Button,
    LoadingDialog,
    Tx,
    SendFinishModal,
    TextField,
    Notification,
    LoadingBar,
  },
  data() {
    return {
      asset: '',
      icon: '',
      balance: 0,
      tokenType: '',
      symbol: '',
      inputAmount: '',
      inputTo: '',
      fee: '',
      txType: 'TRANSFER',
      nftInventory: [],
      optionsModal: false,
      confirmationModal: false,
      sendFinishModal: false,
      passwordModal: false,
      clipboardNotification: false,
      notification: false,
      notificationText: '',
      searchResult: [],
      //      searchFocus: false,
      isLoading: false,
      txBody: {
        from: this.$store.state.accounts.address,
        to: '',
        amount: '0',
        unit: 'aergo',
        payload: '',
        limit: 0,
        type: 0,
      },
      // for tx
      account: {},
      statusDialogVisible: false,
      dialogState: 'loading',
      statusDialogTitle: 'Sending',
      statusText: '',
    };
  },
  async beforeMount() {
    this.account = await this.$background.getActiveAccount();
    if (this.$store.state.session.token) this.asset = await this.$store.state.session.token;
    else this.asset = 'AERGO';

    if (
      this.$route.params.nft &&
      this.$store.state.session.tokens[this.asset].meta.type == 'ARC2'
    ) {
      this.inputAmount = this.$route.params.nft;
      this.searchResult = '';
    }
  },
  watch: {
    asset: function () {
      this.setParams();
      if (this.tokenType === 'ARC2') this.getNftInventory();
    },
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
    notification(state) {
      if (state) {
        setTimeout(() => {
          const time = (this.notification = !state);
          return () => {
            clearTimeout(time);
          };
        }, 2000);
      }
    },
  },
  methods: {
    async setParams() {
      this.balance = this.$store.state.session.tokens[this.asset]['balance'];
      this.tokenType = this.$store.state.session.tokens[this.asset]['meta']['type'];
      this.icon = this.$store.state.session.tokens[this.asset]['meta']['image'];
      this.symbol = this.$store.state.session.tokens[this.asset]['meta']['symbol'];
      this.tokenHash = this.$store.state.session.tokens[this.asset].hash;
      console.log('symbol', this.symbol);
    },
    async selectNFT(item) {
      this.inputAmount = item.meta.token_id;
      this.searchResult = '';
    },
    async searchNFT(query) {
      const result = [];

      this.nftInventory.forEach((item) => {
        if (item.meta.token_id.indexOf(query) != -1) result.push(item);
      });
      this.searchResult = result;
    },

    async getNftInventory() {
      const resp = await fetch(
        `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/nftInventory?q=address:${this.asset} AND account:${this.$store.state.accounts.address}&sort=blockno:desc&from=0&size=100`,
      );
      const response = await resp.json();
      if (response.error) this.nftInventory = [];
      else this.nftInventory = response.hits.reverse();
    },

    updateTx(txType, payload) {
      this.txType = txType;
      this.txBody.payload = payload;
      this.optionsModal = false;
    },
    handleBack() {
      this.$router.push({
        name: this.$store.state.session.previousPage,
      });
    },
    handleOptionsModal() {
      this.optionsModal = true;
    },
    handleSendClick() {
      if (+this.inputAmount > +this.balance) {
        this.notification = true;
        this.notificationText = 'Not Enough Balance.';
        return;
      }
      const amountRegex = /^\d*.?\d{0,3}$/;
      if (!amountRegex.test(this.inputAmount) && this.tokenType !== 'ARC2') {
        this.notification = true;
        this.notificationText = 'Please Check Amount.';
        return;
      }
      if (this.tokenType == 'AERGO') {
        this.txBody.to = this.inputTo;
        this.txBody.amount = `${this.inputAmount} ${this.txBody.unit}`;
      } else if (this.tokenType == 'ARC1') {
        this.txBody.to = this.$store.state.session.tokens[this.asset].hash;
        this.txBody.amount = `0 ${this.txBody.unit}`;
        const amount =
          Number(this.inputAmount) *
          Math.pow(10, this.$store.state.session.tokens[this.asset].meta.decimals);
        this.txBody.payload =
          '{"Name": "transfer", "Args": ["' + this.inputTo + '", "' + amount.toString() + '", ""]}';
        this.txType = 'CALL';
      } else {
        // ARC2
        this.txBody.to = this.$store.state.session.tokens[this.asset].hash;
        this.txBody.amount = `0 ${this.txBody.unit}`;
        this.txBody.payload =
          '{"Name": "transfer", "Args": ["' + this.inputTo + '", "' + this.inputAmount + '"]}';
        this.txType = 'CALL';
      }
      console.log('Init txBody', this.txBody);
      // TODO: try catch
      if (this.txBody.payload) {
        const payload = JSON.parse(this.txBody.payload);
        this.txBody.payload = JSON.stringify(payload, null, 2);
      }
      this.txBody.type = Tx.Type[this.txType];
      console.log('txBody', this.txBody);
      this.confirmationModal = true;
    },
    handleCancel() {
      this.confirmationModal = false;
      this.passwordModal = false;
    },
    handlePassword() {
      this.confirmationModal = false;
      this.passwordModal = true;
    },
    setStatus(state, text) {
      this.dialogState = state;
      this.statusText = text;
      this.statusDialogVisible = true;
    },
    async handleConfirm() {
      console.log('Sending ..', this.txBody);
      this.passwordModal = false;
      if (!this.txBody.from) {
        //  This shouldn't happen normally
        throw new Error('Could not load account, please reload page and try again.');
      }
      /*
      // HW Ledger 사용 시에 ...
      if (this.account.data.type === 'ledger') {
            this.txBody = await this.signWithLedger(this.txBody);
      }
*/
      // send
      try {
        const hash = await timedAsync(this.sendTransaction(this.txBody), { fastTime: 1000 });
        this.txHash = hash;
        this.setStatus('success', 'Done');
        this.isLoading = true;
      } catch (e) {
        const errorMsg = `${e}`.replace('UNDEFINED_ERROR:', '');
        this.setStatus('error', errorMsg);
      }
      this.statusDialogVisible = false;
      if (!this.isLoading) return;
      await this.$store.dispatch('accounts/updateAccount', {
        chainId: this.$store.state.accounts.network,
        address: this.$store.state.accounts.address,
      });
      await this.$store.commit('ui/clearInput', { key: 'send' });
      await this.$background
        .getTransactionReceipt(this.$store.state.accounts.network, this.txHash)
        .then((result) => {
          this.fee = bigIntToString(BigInt(result.fee.split(' ')[0]), 18) || 0;
        });
      console.log('receipt', this.txReceipt);
      await this.$store.dispatch('session/updateBalances');
      this.isLoading = false;
      this.sendFinishModal = true;
    },
    async handleSent() {
      this.balance = await this.$store.state.session.tokens[this.asset].balance;
      this.inputAmount = 0;
      this.sendFinishModal = false;
    },
    async signWithLedger(txBody) {
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
    },
    async sendTransaction(txBody) {
      this.setStatus('loading', 'Sending to network...');
      try {
        const result = await this.$background.sendTransaction(
          txBody,
          this.$store.state.accounts.network,
        );
        console.log(result, 'result!!!');
        if ('tx' in result) {
          return result.tx.hash;
        } else {
          // This shouldn't happen normally
          throw new Error('Result is missing transaction information.');
        }
      } catch (e) {
        this.notification = true;
        this.notificationText = `${(e.message || e).split('.')[0]}`;
        throw new Error(`Node response: ${e.message || e}`);
      }
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      this.clipboardNotification = true;
    },
    searchStyle() {
      switch (this.searchResult.length) {
        case 1:
          return '43px';
        case 2:
          return '86px';
        case 3:
          return '129px';
        default:
          return '172px';
      }
    },
    // get formattedPayload(): string {
    //   const payload = `${this.txBody.payload}`;
    //   try {
    //     // If it is parsable as json, use json highlighter
    //     JSON.parse(payload);
    //     return jsonHighlight(payload);
    //   } catch {
    //     return `<span class="string">${payload}</span>`;
    //   }
    // },
  },
});
</script>

<style lang="scss">
.send_content_wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .account_detail_wrapper {
    display: flex;
    flex-direction: column;
    .direction-row {
      margin-top: 18px;
      margin-left: 36px;
      display: flex;
      align-items: center;
      .circle {
        border-radius: 50%;
        background: #e4097d;
        width: 4px;
        height: 4px;
        margin-right: 4px;
      }
      .network {
        width: 84px;
        height: 15px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 300;
        font-size: 12px;
        line-height: 15px;
        letter-spacing: -0.333333px;
        /* Grey/06 */
        color: #686767;
      }
    }
    .account_wrapper {
      display: flex;
      align-items: center;
      margin-top: 8px;
      .account_icon {
        margin-left: 38px;
        width: 20px;
        height: 20px;
      }
      .account_title {
        margin-left: 12px;
        height: 20px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: -0.333333px;
        /* Grey/07 */
        color: #454344;
      }
      .account_title_wrapper {
        display: flex;
        align-items: center;
        margin-left: 10px;
        width: 120px;
        height: 22px;
        background: #eff5f7;
        border-radius: 25px;
        .account {
          cursor: pointer;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 300;
          font-size: 12px;
          line-height: 15px;
          text-align: right;
          letter-spacing: -0.333333px;
          /* Primary/Blue01 */
          color: #279ecc;
        }
      }
      .account_button {
        cursor: pointer;
        margin-left: 48px;
      }
    }
  }
  .token_content_wrapper {
    display: flex;
    align-items: center;
    width: 327px;
    height: 60px;
    margin-left: 28px;
    margin-top: 19px;
    background: #ffffff;
    /* Grey/00 */
    border: 1px solid #f6f6f6;
    /* 05 */
    box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .token_icon {
      /* Grey/02 */
      border: 1px solid #d8d8d8;
      width: 46px;
      height: 46px;
      margin-left: 14px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .amount_wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .token_amount {
      width: 141px;
      margin-left: 20px;
      /* Headline/H3 */
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      letter-spacing: -0.333333px;
      /* Grey/08 */
      color: #231f20;
    }
    .token_symbol {
      margin-right: 10px;
      /* Subtitle/S3 */
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      text-align: right;
      letter-spacing: -0.333333px;
      /* Grey/08 */
      color: #231f20;
    }
  }
  .send_form_wrapper {
    /* Primary/lightsky */
    background: #eff5f7;
    box-shadow: inset 0px 6px 17px -8px rgba(0, 0, 0, 0.05);
    position: absolute;
    width: 375px;
    height: 380px;
    bottom: 0px;
    .flex-row {
      display: flex;
      align-items: center;
      margin-top: 20px;
      margin-right: 24px;
      .title {
        margin-left: 20px;
        /* Primary/Blue01 */
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 17px;
        line-height: 21px;
        color: #279ecc;
      }
      .select_box {
        padding: 8px;
        margin-left: 38px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
        width: 243px;
        height: 40px;
        /* White */
        background: #ffffff;
        /* Primary/Blue01 */
        border: 1px solid #279ecc;
        border-radius: 4px;
      }
      .text_box {
        padding-left: 10px;
        margin-left: 19px;
        /* White */
        background: #ffffff;
        /* Primary/Blue01 */
        border: 1px solid #279ecc;
        border-radius: 4px;
        width: 240px;
        height: 33px;
      }
      .text-field {
        margin-left: 26px;
        /* White */
        background: #ffffff;
        /* Primary/Blue01 */
        border: 1px solid #279ecc;
        border-radius: 4px;
        width: 246px;
        height: 36px;
      }
      .flex-column-searchbox {
        display: flex;
        flex-direction: column;
        .input-field {
          margin-top: 0;
        }
        .search_list_wrapper {
          height: 172px;
          position: absolute;
          left: 105px;
          top: 115px;
          border-radius: 3px;
          border: 1px solid #279ecc;
          overflow-y: scroll;
          overflow-x: hidden;
          .search_list {
            padding-left: 5px;
            display: flex;
            align-items: center;
            cursor: pointer;
            width: 223px;
            height: 43px;
            /* Grey/White */
            background: #ffffff;
            border-radius: 3px;
            .img {
              width: 24px;
              height: 24px;
            }
            .text {
              /* Button/Btn3 */
              font-family: 'Outfit';
              font-style: normal;
              font-weight: 500;
              font-size: 16px;
              line-height: 20px;
              display: flex;
              align-items: center;
              /* Grey/07 */
              color: #454344;
            }
          }
          .search_list:hover {
            background: #f6f6f6;
          }
        }
      }
    }
    .flex-column {
      margin-left: 26px;
      display: flex;
      flex-direction: column;
      .title {
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 17px;
        line-height: 21px;
        margin-top: 20px;
        /* Primary/Blue01 */
        color: #279ecc;
      }
      .text_box {
        /* Caption/C3 */
        word-break: break-all;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: -0.333333px;
        /* Grey/07 */
        color: #454344;
        padding-left: 10px;
        padding-right: 10px;
        margin-top: 9px;
        width: 303px;
        height: 33px;
        background: #ffffff;
        /* Primary/Blue01 */
        border: 1px solid #279ecc;
        border-radius: 4px;
      }
    }
  }
}
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  .show_option {
    margin-bottom: 20px;
    /* Subtitle/S3_line */
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: -0.333333px;
    text-decoration-line: underline;
    /* Gradation/04 */
    background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    cursor: pointer;
  }
}
</style>
