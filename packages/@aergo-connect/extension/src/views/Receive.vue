<template>
  <ScrollView>
    <ReceiveModal
      v-if="receiveModal"
      :amount="+inputAmount"
      :symbol="symbol"
      :asset="asset"
      :tokenName="tokenName"
      :decimals="decimals"
      @confirm="handleConfirm"
    />
    <Header button="back" title="Receive" @backClick="handleBack" />
    <div class="send_content_wrapper">
      <div class="account_detail_wrapper">
        <div class="direction-row">
          <div class="network">
            {{ networkName }}
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
          <span v-if="account?.data?.type === 'ledger'" class="account-label account-label-usb"
            ><Icon name="usb" :size="17"
          /></span>
        </div>
      </div>

      <div class="token_content_wrapper">
        <div class="amount_wrapper">
          <div class="icon_wrapper">
            <Icon v-if="asset === 'AERGO'" class="token_icon" :name="`aergo`" />
            <Icon v-else-if="!icon" class="token_icon" :name="`defaultToken`" />
            <img v-else class="token_icon" :src="icon" />
            <div class="token_amount">{{ tokenName }}</div>
          </div>
          <div :style="{ display: 'flex', alignItems: 'center' }">
            <div :style="{ fontWeight: '500', marginRight: '5px' }">
              {{ balance ? formatBalance(balance) : 0 }}
            </div>
            <div class="token_symbol">{{ symbol }}</div>
          </div>
        </div>
      </div>

      <div class="send_form_wrapper">
        <div class="flex-row">
          <div class="title">Asset</div>
          <div v-click-outside="hide">
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
                          textOverflow: 'ellipsis',
                        }
                      : {
                          cursor: 'default',
                          fontSize: '16px',
                          fontWeight: '500',
                          position: 'relative',
                          right: '5px',
                          textOverflow: 'ellipsis',
                        }
                  "
                >
                  {{ tokenName }}
                </div>
              </div>
              <Icon :name="selectAsset ? `dropupblue` : `dropdownblue`" />
            </div>
            <ul v-if="selectAsset" class="selectbox_asset">
              <li
                class="list"
                v-for="token in arc1Tokens"
                v-show="token.meta.type === tokenType"
                :key="token.meta.hash"
                @click="selectAssetFunc(token.hash)"
              >
                <img class="img" v-if="token.meta.image_url" :src="token.meta.image_url" />
                <Icon class="aergo" v-else-if="token.hash === 'AERGO'" :name="`aergo`" />
                <Icon v-else :name="`defaultToken`" />
                {{ token.meta.name }}
              </li>
            </ul>
          </div>
        </div>

        <div class="flex-row" v-if="tokenType !== 'ARC2'">
          <div class="title">Amount</div>
          <input v-model.number="inputAmount" type="text" class="text_box" placeholder="0" />
        </div>

        <div class="footer">
          <Button
            v-if="!receiveModal"
            type="primary"
            size="large"
            @click="handleShowQRClick"
            :disabled="!inputAmount && tokenType !== 'ARC2'"
            :hover="!!inputAmount || tokenType === 'ARC2'"
            >Show QR</Button
          >
        </div>
      </div>
    </div>
    <Notification
      v-if="notification"
      :title="notificationText"
      :icon="notificationText === 'Copied!' ? 'check' : 'warning2'"
      :size="notificationText !== 'Copied!' ? 250 : 100"
    />
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import ReceiveModal from '@aergo-connect/lib-ui/src/modal/ReceiveModal.vue';
import Notification from '@aergo-connect/lib-ui/src/modal/Notification.vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import Identicon from '@aergo-connect/lib-ui/src/content/Identicon.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';

export default Vue.extend({
  components: { ScrollView, ReceiveModal, Header, Identicon, Icon, Button, Notification },
  data() {
    return {
      selectAsset: false,
      receiveModal: false,
      notification: false,
      notificationText: '',
      asset: '',
      icon: '',
      balance: 0,
      tokenType: '',
      symbol: '',
      tokenName: '',
      inputAmount: '0',
      decimals: '',
      token: {},
      arc1Tokens: [],
    };
  },
  computed: {
    getTokens() {
      return this.$store.getters[`accounts/getTokens`];
    },
    networkName() {
      const chainId = this.$store.state.accounts.chainId;
      if (chainId === ('aergo.io' || 'testnet.aergo.io' || 'alpha.aergo.io')) {
        return `AERGO ${chainId.toUpperCase()}`;
      } else {
        return `${chainId.toUpperCase()}`;
      }
    },
  },
  async beforeMount() {
    const address = this.$store.state.accounts.address;
    const chainId = this.$store.state.accounts.chainId;
    this.account =
      (await this.$background.getActiveAccount()) ||
      (await this.$background.setActiveAccount({ address, chainId }));
    this.token = await this.getTokens[this.$store.state.accounts.selectedToken];
    this.arc1Tokens = await Object.values(this.getTokens).filter(
      (token) => token.meta.type === 'ARC1' || token.meta.type === 'AERGO',
    );
    if (this.$store.state.ui.input['receive']['inputAmount']) {
      this.inputAmount = this.$store.state.ui.input['receive']['inputAmount'];
    }
    if (this.$store.state.accounts.selectedToken) {
      this.asset = this.$store.state.accounts.selectedToken;
    } else {
      this.asset = 'AERGO';
    }
  },
  watch: {
    asset: function () {
      this.$store.commit('ui/clearInput', { key: 'receive' });
      this.balance = this.getTokens[this.asset]['balance'];
      this.tokenType = this.getTokens[this.asset]['meta']['type'];
      this.icon = this.getTokens[this.asset]['meta']['image_url'];
      this.symbol = this.getTokens[this.asset]['meta']['symbol'];
      this.tokenName = this.getTokens[this.asset]['meta']['name'];
      this.decimals = this.getTokens[this.asset]['meta']['decimals'];
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
    balance() {
      this.$forceUpdate();
    },
    tokenType() {
      if (this.tokenType === 'ARC2') {
        this.asset = 'AERGO';
      }
    },
  },
  updated() {
    this.$store.commit('ui/setInputs', {
      key: 'receive',
      data: {
        inputAmount: this.inputAmount,
      },
    });
  },
  methods: {
    handleBack() {
      this.$store.commit('ui/clearInput', { key: 'receive' });
      this.$router.push({ name: 'accounts-list' });
    },
    handleShowQRClick() {
      const testInputAmount = this.validateAmount(this.inputAmount);
      if (testInputAmount) {
        this.receiveModal = true;
      } else {
        this.notification = true;
        this.notificationText = this.processAmount(this.inputAmount);
      }
    },

    validateAmount(amount) {
      const amountRegex = /^[0-9]*\.?[0-9]{0,3}$/;
      if (!amountRegex.test(amount)) {
        return false;
      }
      const num = parseFloat(amount);
      if (isNaN(num)) {
        return false;
      }
      return true;
    },
    processAmount(amount) {
      if (!this.validateAmount(amount)) {
        if (!amount.toString().match(/[0-9]/g)) {
          return 'Please enter a number';
        } else if (amount.toString().split('.')[1]?.length > 3) {
          return 'Only allowed up to 3 decimals';
        } else {
          return 'Invalid input Value';
        }
      }
    },

    handleConfirm() {
      this.receiveModal = false;
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      this.notification = true;
      this.notificationText = 'Copied!';
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
    },
    hide() {
      this.selectAsset = false;
    },
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
        margin-left: 25px;

        width: 20px;
        height: 20px;
      }
      .account_title {
        margin-left: 12px;
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

        /* width: 120px; */
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
      .account-label {
        margin-top: 10px;
        display: block;
        border-radius: 10px;
        width: 36px;
        line-height: 20px;
        text-align: center;
        transform: translateY(-5px);
      }

      .account-label-new {
        background-color: #ff4f9f;
        font-size: (calc(8 / 16)) * 1rem;
        text-transform: uppercase;
        color: #fff;
      }

      .account-label-usb {
        background-color: #6f6f6f;

        .icon {
          line-height: 14px;
          height: 16px;
          transform: translateY(-1px);
        }
      }
      .account_button {
        cursor: pointer;
      }
    }
  }
  /* .token_content_wrapper {
    display: flex;
    align-items: center;
    width: 327px;
    height: 60px;
    margin-left: 24px;
    margin-top: 19px;
    background: #ffffff;

    border: 1px solid #f6f6f6;

    box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .token_icon {
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
      width: 281px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .token_amount {
      width: 141px;
      margin-left: 20px;


      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      letter-spacing: -0.333333px;



      color: #231f20;
    }
    .token_symbol {
      width: 100%;
    }
  } */
  .send_form_wrapper {
    /* Primary/lightsky */

    /* background: #eff5f7;
    box-shadow: inset 0px 6px 17px -8px rgba(0, 0, 0, 0.05);
    width: 375px;
    height: 100vh; */

    .flex-row {
      display: flex;
      align-items: center;
      margin-top: 20px;
      .title {
        margin-left: 26px;
        /* Primary/Blue01 */
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 17px;
        line-height: 21px;
        color: #279ecc;
      }
      .select_box {
        display: flex;
        justify-content: space-between;
        margin-left: 38px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
        width: 228px;
        height: 22px;
        /* White */

        background: #ffffff;
        /* Primary/Blue01 */

        border: 1px solid #279ecc;
        border-radius: 4px;
        .img {
          height: 32px;
          width: 32px;
          border-radius: 50%;
        }
        .icon--defaultToken {
          position: relative;
          right: 6px;
        }
      }
      .text_box {
        margin-left: 19px;
        /* White */

        background: #ffffff;
        /* Primary/Blue01 */

        border: 1px solid #279ecc;
        border-radius: 4px;
        width: 230px;
        height: 33px;
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
        margin-top: 9px;
        width: 300px;
        height: 33px;
        background: #ffffff;
        /* Primary/Blue01 */

        border: 1px solid #279ecc;
        border-radius: 4px;
      }
    }
  }
}
</style>
