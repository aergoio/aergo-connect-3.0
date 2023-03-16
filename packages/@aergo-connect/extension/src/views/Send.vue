<template>
  <ScrollView>
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
    <PasswordModal v-if="passwordModal" @cancel="handleCancel" @confirm="handleConfirm" />
    <SendFinishModal
      v-if="sendFinishModal"
      :asset="asset"
      :txHash="txHash"
      :receipt="inputTo"
      :amount="inputAmount"
      :symbol="symbol"
      :tokenType="tokenType"
      :fee="fee"
      :userNftData="userNftData"
      :balance="balance"
    />
    <Header button="back" title="Send" @backClick="handleBack" />
    <div class="send_content_wrapper">
      <div class="account_detail_wrapper">
        <div class="direction-row">
          <div :class="`circle ${$store.state.accounts.network}`" />
          <div class="network">
            {{ `AERGO ${$store.state.accounts.network.toUpperCase()}` }}
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
      <div :class="[tokenType === 'ARC2' ? `token_content_wrapper nft` : `token_content_wrapper`]">
        <!-- <Icon v-if="asset === 'AERGO'" class="token_icon" :name="`aergo`" /> -->
        <!-- <Icon v-else-if="!icon" :name="`defaultToken`" class="token_icon" /> -->
        <!-- <img v-else class="token_icon" :src="icon" /> -->

        <div v-if="tokenType !== 'ARC2'" class="amount_wrapper">
          <div class="icon_wrapper">
            <Icon v-if="asset === 'AERGO'" class="token_icon" :name="`aergo`" />
            <Icon v-else-if="!icon" :name="`defaultToken`" class="token_icon" />
            <img v-else class="token_icon" :src="icon" />
            <div class="token_amount">{{ tokenName }}</div>
          </div>
          <div :style="{ display: 'flex', alignItems: 'center' }">
            <span :style="{ marginRight: '5px', fontWeight: '500' }">{{
              balance ? formatBalance(balance) : 0
            }}</span>
            <span class="token_symbol"> {{ symbol }}</span>
          </div>
        </div>
        <div v-if="tokenType === 'ARC2' && nftUiData?.meta?.img_url" class="frame">
          <div class="nft_img_wrapper">
            <img class="img" :src="nftUiData?.meta?.img_url" />
            <span :style="{}">{{ `#${nftUiData?.meta?.token_id}` }}</span>
          </div>
        </div>
        <div v-else-if="tokenType === 'ARC2'" class="frame">
          <div
            :style="{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }"
          >
            <span :style="{ fontSize: '0.75rem', wordBreak: 'break-all' }">{{
              nftUiData?.token?.meta?.name
            }}</span>
            <span :style="{ fontSize: '0.875rem', wordBreak: 'break-all', margin: '4px' }">{{
              nftUiData?.meta?.token_id ? `#${nftUiData?.meta?.token_id}` : `Type the NFT ID`
            }}</span>
          </div>
        </div>
      </div>
      <div
        :class="[
          tokenType === 'ARC2' ? `send_form_wrapper nft` : `send_form_wrapper`,
          optionsDropbox ? `send_form_wrapper scroll` : `send_form_wrapper`,
        ]"
      >
        <div class="flex-row">
          <div class="title">Asset</div>

          <div v-click-outside="hideAssetList">
            <div class="select_box" @click="handleSelectAsset">
              <div
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                }"
              >
                <Icon v-if="asset === 'AERGO'" :name="`aergo`" :style="{ marginLeft: '4px' }" />
                <Icon v-else-if="!icon" :name="`defaultToken`" />
                <img class="img" v-else :src="icon" />
                <div
                  :style="
                    icon || asset === 'AERGO'
                      ? {
                          marginLeft: '8px',
                          cursor: 'default',
                          fontSize: '16px',
                          fontWeight: '500',
                        }
                      : {
                          cursor: 'default',
                          fontSize: '16px',
                          fontWeight: '500',
                          position: 'relative',
                          right: '5px',
                        }
                  "
                >
                  {{ tokenName }}
                </div>
              </div>
              <Icon :name="selectAsset ? `dropupblue` : `dropdownblue`" />
            </div>
            <ul
              v-if="selectAsset"
              :class="optionsDropbox ? `selectbox_asset options` : `selectbox_asset`"
            >
              <li
                class="list"
                v-for="token in getTokens"
                v-show="token.meta.type === tokenType"
                :key="token.meta.hash"
                @click="selectAssetFunc(token.hash)"
              >
                <img class="img" v-if="token.meta.image" :src="token.meta.image" />
                <Icon class="aergo" v-else-if="token.hash === 'AERGO'" :name="`aergo`" />
                <Icon v-else :name="`defaultToken`" />
                <span>{{ token.meta.name }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex-row" v-if="tokenType == 'ARC2'">
          <div class="title">NFT ID</div>
          <div class="flex-column-searchbox" v-click-outside="hideNftList">
            <TextField
              placeholder="Type ID"
              v-model="inputAmount"
              @input="searchNFT"
              @focus="focusNFT"
            />

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
          <input v-model="inputAmount" class="text_box" placeholder="0" defaultValue="0" min="0" />
        </div>
        <div class="flex-column" :style="{ marginTop: '20px' }">
          <div class="title">Send to</div>
          <div class="text_box identicon">
            <Identicon :text="inputTo" class="identicon" />
            <input v-model="inputTo" type="text" class="identicon_input" />
          </div>
        </div>

        <div class="footer">
          <div
            v-if="asset === `AERGO`"
            :class="optionsDropbox ? `show_option options` : `show_option`"
            @click="handleOptionsDropbox"
          >
            {{ optionsDropbox ? `Hide optional fields` : `Show optional fields` }}
          </div>

          <div v-if="optionsDropbox && tokenType === `AERGO`" class="options_modal_wrapper">
            <div class="flex-column">
              <div class="title">Type</div>
              <div class="select_box" @click="handleSelectTxType" v-click-outside="hide">
                <div class="text">{{ txType }}</div>
                <Icon :name="select ? `dropupblue` : `dropdownblue`" />
              </div>
            </div>
            <ul v-if="select" class="list_wrapper">
              <li
                class="list"
                v-for="txType in $store.state.ui.txTypes"
                :key="txType"
                @click="selectTxType(txType)"
              >
                {{ txType }}
              </li>
            </ul>
            <div class="flex-column" :style="{ marginTop: '10px' }">
              <div class="title data">Data (payload)</div>
              <input v-model="inputPayload" type="text" class="text_box" />
            </div>
          </div>

          <Button
            :class="optionsDropbox ? `options` : ``"
            type="primary"
            size="large"
            @click="handleSendClick"
            :disabled="!inputTo || !inputAmount"
            :hover="inputTo && inputAmount ? true : false"
            >Send</Button
          >
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
    <Notification v-if="notification" :title="notificationText" :icon="`warning2`" :size="300" />
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import ConfirmationModal from '@aergo-connect/lib-ui/src/modal/ConfirmationModal.vue';
import Notification from '@aergo-connect/lib-ui/src/modal/Notification.vue';
import SendFinishModal from '@aergo-connect/lib-ui/src/modal/SendFinishModal.vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import Identicon from '@aergo-connect/lib-ui/src/content/Identicon.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import LoadingDialog from '@aergo-connect/lib-ui/src/layouts/LoadingDialog.vue';
import TextField from '@aergo-connect/lib-ui/src/forms/TextField.vue';
import LoadingIndicator from '@aergo-connect/lib-ui/src/icons/LoadingIndicator.vue';
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
    ConfirmationModal,
    PasswordModal,
    SendFinishModal,
    Header,
    Identicon,
    Icon,
    Button,
    LoadingDialog,
    Tx,
    TextField,
    Notification,
    LoadingIndicator,
  },
  data() {
    return {
      selectAsset: false,
      asset: '',
      icon: '',
      balance: 0,
      tokenType: '',
      symbol: '',
      tokenName: '',
      inputAmount: '0',
      inputTo: '',
      fee: '',
      nftInventory: [],
      optionsDropbox: false,
      confirmationModal: false,
      sendFinishModal: false,
      passwordModal: false,
      clipboardNotification: false,
      notification: false,
      notificationText: '',
      searchResult: [],
      searchFocus: false,
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
      userNftData: {},
      txHash: '',
      nftUiData: {},
      result: {},
      inputPayload: '',
      txType: 'TRANSFER',
      select: false,
    };
  },
  computed: {
    getTokens() {
      return this.$store.getters[`accounts/getTokens`];
    },
  },
  async beforeMount() {
    this.account = await this.$background.getActiveAccount();
    if (this.$store.state.accounts.selectedToken) {
      this.asset = await this.$store.state.accounts.selectedToken;
    } else {
      this.asset = 'AERGO';
    }

    if (this.$route.params.id && this.getTokens[this.asset].meta.type == 'ARC2') {
      this.inputAmount = this.$route.params.id;
      this.nftUiData = this.getTokens[this.asset].nftWallet.filter(
        (nft) => nft.meta.token_id === this.$route.params.id,
      )[0];
      this.searchResult = '';
    }

    this.inputTo = this.$store.state.ui.input['send']['inputTo'];
    if (this.$store.state.ui.input['send']['inputAmount']) {
      this.inputAmount = this.$store.state.ui.input['send']['inputAmount'];
    }
    if (this.$store.state.ui.input['send']['optionsDropbox']) {
      this.optionsDropbox = this.$store.state.ui.input['send']['optionsDropbox'];
    }
    if (this.$store.state.ui.input['send']['inputPayload']) {
      this.inputPayload = this.$store.state.ui.input['send']['inputPayload'];
    }
    if (this.$store.state.ui.input['send']['txType']) {
      this.txType = this.$store.state.ui.input['send']['txType'];
    }
  },
  updated() {
    this.$store.commit('ui/setInputs', {
      key: 'send',
      data: {
        inputTo: this.inputTo,
        inputAmount: this.inputAmount,
        optionsDropbox: this.optionsDropbox,
        txType: this.txType,
        inputPayload: this.inputPayload,
      },
    });
  },
  watch: {
    asset: function () {
      this.$store.commit('ui/clearInput', { key: 'send' });
      this.setParams();
      if (this.tokenType === 'ARC2') {
        this.getNftInventory();
        if (this.$route.params.id && this.asset === this.$store.state.accounts.selectedToken) {
          this.inputAmount = this.$route.params.id;
        }
      }
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

    inputAmount() {
      if (this.tokenType === 'ARC2') {
        const filteredNft = this.nftInventory.filter(
          (nft) => nft.meta.token_id === this.inputAmount,
        )[0];
        this.nftUiData = filteredNft;
      }
    },
    inputPayload() {
      this.txBody.payload = this.inputPayload;
    },
  },
  methods: {
    async setParams() {
      this.balance = this.getTokens[this.asset]['balance'];
      this.tokenType = this.getTokens[this.asset]['meta']['type'];
      this.icon = this.getTokens[this.asset]['meta']['image'];
      this.symbol = this.getTokens[this.asset]['meta']['symbol'];
      this.tokenHash = this.getTokens[this.asset].hash;
      this.tokenName = this.getTokens[this.asset]['meta']['name'];
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
    async focusNFT() {
      this.searchResult = [...this.nftInventory];
    },
    async getNftInventory() {
      const nftWallet = this.getTokens[this.asset].nftWallet;
      this.nftInventory = nftWallet.length > 0 ? nftWallet : [];
    },

    handleBack() {
      this.$store.commit('ui/clearInput', { key: 'send' });
      this.$router
        .push({
          name: this.$store.state.ui.route.previousPage ?? 'accounts-list',
        })
        .catch(() => {});
    },
    handleOptionsDropbox() {
      this.optionsDropbox = !this.optionsDropbox;
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
        this.notificationText = 'Please Input a Number in Amount.';
        return;
      }
      if (this.tokenType == 'AERGO') {
        this.txBody.to = this.inputTo;
        this.txBody.amount = `${this.inputAmount} ${this.txBody.unit}`;
        // this.txBody.type = this.$store.state.ui.txType.indexOf(this.txBody.type);
        console.log(this.txBody, 'txBody');
      } else if (this.tokenType == 'ARC1') {
        this.txBody.to = this.getTokens[this.asset].hash;
        this.txBody.amount = `0 ${this.txBody.unit}`;
        const amount =
          Number(this.inputAmount) * Math.pow(10, this.getTokens[this.asset].meta.decimals);
        // eslint-disable-next-line no-undef
        this.txBody.payload =
          '{"Name": "transfer", "Args": ["' +
          this.inputTo +
          '", "' +
          // eslint-disable-next-line no-undef
          BigInt(amount).toString() +
          '", ""]}';
        this.txType = 'CALL';
      } else {
        // ARC2
        this.txBody.to = this.getTokens[this.asset].hash;
        this.txBody.amount = `0 ${this.txBody.unit}`;
        this.txBody.payload =
          '{"Name": "transfer", "Args": ["' + this.inputTo + '", "' + this.inputAmount + '"]}';
        this.txType = 'CALL';
        this.userNftData = this.getTokens[this.asset].nftWallet.filter(
          (nft) => nft.meta.token_id === this.inputAmount,
        )[0];
      }
      // TODO: try catch
      try {
        if (this.txBody.payload) {
          const payload = JSON.parse(this.txBody.payload);
          this.txBody.payload = JSON.stringify(payload, null, 2);
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
      this.txBody.type = Tx.Type[this.txType];
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
        const result = await this.$background.getTransactionReceipt(
          this.$store.state.accounts.network,
          this.txHash,
        );
        this.setStatus('success', 'Done');
        if (result.status === 'SUCCESS') {
          if (this.userNftData.hash) {
            this.$store.commit('accounts/deleteNftInLocalStorage', this.userNftData);
          }
          // eslint-disable-next-line no-undef
          this.fee = bigIntToString(BigInt(result.fee.split(' ')[0]), 18) || 0;
          this.$store.dispatch('accounts/updateAccount', {
            chainId: this.$store.state.accounts.network,
            address: this.$store.state.accounts.address,
          });
          await this.$store.dispatch('accounts/initState');
          this.balance = await this.getTokens[this.asset].balance;
          setTimeout(() => {
            this.statusDialogVisible = false;
            this.sendFinishModal = true;
          }, 1000);
        } else if (result.status === 'ERROR') {
          this.statusDialogVisible = false;
          const errorMsg = `${result.result.split(`${result.contractaddress}:0: `)[1]}`;
          this.setStatus('error', errorMsg);
        }
      } catch (e) {
        const errorMsg = `${e}`.replace('UNDEFINED_ERROR:', '');
        this.setStatus('error', errorMsg);
      }
    },
    // async handleSent() {
    //   this.balance = await this.getTokens[this.asset].balance;
    //   this.inputAmount = 0;
    //   this.sendFinishModal = false;
    // },
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
        console.log(this.txBody, 'txbody? payload ??');
        const result = await this.$background.sendTransaction(
          txBody,
          this.$store.state.accounts.network,
        );
        if ('tx' in result) {
          console.log(result, 'here4');
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
    formatBalance(balance) {
      if (Number.isInteger(balance)) {
        return balance;
      }
      return Number(balance).toFixed(3);
    },
    handleSelectAsset() {
      this.selectAsset = !this.selectAsset;
    },
    selectAssetFunc(asset) {
      this.asset = asset;
      this.selectAsset = false;
      this.inputAmount = '';
    },
    hideAssetList() {
      this.selectAsset = false;
    },
    hideNftList() {
      this.searchFocus = false;
      this.searchResult = '';
    },

    selectTxType(txType) {
      this.txType = txType;
      this.select = false;
    },
    handleSelectTxType() {
      this.select = !this.select;
    },
    hide() {
      this.select = false;
    },
  },
});
</script>

<style lang="scss">
.send_content_wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 90vh;
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
        &.mainnet {
          background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
        }
        &.testnet {
          background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
        }
        &.alpha {
          background: linear-gradient(133.72deg, #84ceeb 0%, #f894c8 100%);
        }
      }
      .network {
        width: 100px;
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
    margin-left: 24px;
    margin-top: 20px;
    background: #ffffff;
    /* Grey/00 */
    border: 1px solid #f6f6f6;
    /* 05 */
    box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .amount_wrapper {
      width: 300px;
      margin-left: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon_wrapper {
        display: flex;
        align-items: center;
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
        .token_amount {
          margin-left: 10px;
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 600;
          font-size: 20px;
          line-height: 25px;
          letter-spacing: -0.333333px;
          color: #231f20;
        }
      }
    }

    .token_symbol {
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
    &.nft {
      margin-top: 10px;
      height: 115px;
      justify-content: center;
      box-shadow: none;
      border: none;
    }
    .frame {
      width: 150px;
      height: 100%;
      border: solid 0.01em #d0d0d0;
      border-radius: 4px;
      background: #f6f6f6;
      box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.19);
      -webkit-box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.19);
      -moz-box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.19);
      .nft_img_wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .img {
          width: -webkit-fill-available;
          height: 100%;
        }
      }
    }
  }
  .send_form_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #eff5f7;
    box-shadow: inset 0px 6px 17px -8px rgba(0, 0, 0, 0.05);
    width: 375px;
    height: 100vh;
    margin-top: 20px;
    .selectbox_asset {
      &.options {
        position: sticky;
      }
      width: 243px;
      /* height: 172px; */
      position: absolute;
      left: 105px;
      border-radius: 3px;
      border: 1px solid #279ecc;
      text-overflow: ellipsis;
      /* overflow-y: scroll; */
      /* overflow-x: hidden; */
      .img {
        margin-left: 6px;
        margin-right: 8px;
        height: 32px;
        width: 32px;
        border-radius: 50%;
      }
      .aergo {
        margin-left: 10px;
        margin-right: 10px;
      }

      .list {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        cursor: pointer;
        /* width: 228px; */
        height: 43px;
        background: #ffffff;
        border-radius: 3px;
        font-size: 16px;
        font-weight: 500;
      }
      .list:hover {
        background: #f6f6f6;
      }
    }

    &.scroll {
      overflow-y: scroll;
      overflow-x: hidden;
    }
    &.nft {
      height: 345px;
    }
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
        width: 230px;
        height: 45px;
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
          top: 374px;
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
              padding-left: 5px;
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
      display: flex;
      flex-direction: column;

      .title {
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 17px;
        line-height: 21px;
        /* margin-top: 20px; */
        /* Primary/Blue01 */
        color: #279ecc;
      }
      .text_box {
        &.identicon {
          height: 45px;
          display: flex;
          align-items: center;
          .identicon {
            width: 40px;
            height: 40px;
          }
          .identicon_input {
            background-color: transparent;
            border: 0;
            flex: 1;
            padding: 0 12px;
            outline: none;
            width: 250px;
            line-height: 1.3;
            resize: none;
          }
        }
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
    .footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;

      .button {
        position: absolute;
        bottom: 30px;
        &.options {
          position: relative;
          top: 20px;
          margin-bottom: 40px;
        }
      }

      .show_option {
        margin-bottom: 20px;
        &.options {
          margin-bottom: none;
        }
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

      .options_modal_wrapper {
        border-radius: 8px;
        .flex-column {
          display: flex;
          flex-direction: column;
          .title {
            width: 37px;
            height: 21px;
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 400;
            font-size: 17px;
            line-height: 21px;

            /* Grey/06 */

            color: #686767;
            &.data {
              width: 114px;
            }
          }
          .select_box {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            padding: 8px;
            border-radius: 3px;
            /* White */
            background: #ffffff;
            /* Primary/Blue01 */
            border: 1px solid #279ecc;
            border-radius: 4px;

            margin-top: 9px;
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 400;
            font-size: 17px;
            line-height: 21px;

            color: #454344;
            .text {
              cursor: default;
              margin-left: 3px;
            }
          }

          .text_box {
            margin-top: 14px;
            height: 36px;

            /* White */

            background: #ffffff;
            /* Primary/Blue01 */

            border: 1px solid #279ecc;
            border-radius: 4px;
            white-space: pre;
          }
        }
      }
      .list_wrapper {
        z-index: 2;
        cursor: pointer;
        height: 172px;
        position: static;
        bottom: 7px;
        width: 320px;
        border-radius: 3px;
        border: 1px solid #279ecc;
        overflow-y: scroll;
        overflow-x: hidden;
        .list {
          z-index: 2;
          padding-left: 10px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          cursor: pointer;
          height: 43px;
          background: #ffffff;
          border-radius: 3px;
          font-size: 16px;
          font-weight: 500;
        }
        .list:hover {
          background: #f6f6f6;
        }
      }
    }
  }
}
</style>
