<template>
  <ScrollView>
    <ReceiveModal
      v-if="receiveModal"
      :amount="inputAmount"
      :symbol="symbol"
      :asset="asset"
      :tokenName="tokenName"
      :decimal="decimal"
      @confirm="handleConfirm"
    />
    <Header button="back" title="Receive" @backClick="handleBack" />
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

      <div class="token_content_wrapper">
        <Icon v-if="asset === 'AERGO'" class="token_icon" :name="`aergo`" />
        <Icon v-else-if="!icon" class="token_icon" :name="`defaultToken`" />
        <!-- <Identicon v-else-if="!icon" :text="asset" class="token_icon" /> -->
        <img v-else class="token_icon" :src="icon" />
        <div class="amount_wrapper">
          <div class="token_amount">{{ balance ? formatBalance(balance) : 0 }}</div>
          <div class="token_symbol">{{ symbol }}</div>
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
              class="selectbox_asset"
              :style="{ height: assetListStyle(), 'overflow-y': assetListScrollStyle() }"
            >
              <li
                class="list"
                v-for="token in $store.state.session.tokens"
                :key="token.meta.hash"
                @click="selectAssetFunc(token.hash)"
              >
                <img class="img" v-if="token.meta.image" :src="token.meta.image" />
                <Icon class="aergo" v-else-if="token.hash === 'AERGO'" :name="`aergo`" />
                <Icon v-else :name="`defaultToken`" />
                {{ token.meta.name }}
              </li>
            </ul>
          </div>
        </div>

        <div class="flex-row" v-if="tokenType !== 'ARC2'">
          <div class="title">Amount</div>
          <input v-model.number="inputAmount" type="text" class="text_box" />
        </div>
      </div>
    </div>
    <template #footer class="footer">
      <Button
        v-if="!receiveModal"
        type="primary"
        size="large"
        @click="handleShowQRClick"
        :disabled="!inputAmount && tokenType !== 'ARC2'"
        :hover="inputAmount || tokenType === 'ARC2'"
        >Show QR</Button
      >
    </template>
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
      inputAmount: '',
      decimal: '',
      token: {},
    };
  },

  async beforeMount() {
    this.token = await this.$store.state.session.tokens[this.$store.state.session.token];

    if (this.$store.state.session.token) this.asset = this.$store.state.session.token;
    else this.asset = 'AERGO';
  },

  watch: {
    asset: function () {
      this.balance = this.$store.state.session.tokens[this.asset]['balance'];
      this.tokenType = this.$store.state.session.tokens[this.asset]['meta']['type'];
      this.icon = this.$store.state.session.tokens[this.asset]['meta']['image'];
      this.symbol = this.$store.state.session.tokens[this.asset]['meta']['symbol'];
      this.tokenName = this.$store.state.session.tokens[this.asset]['meta']['name'];
      this.decimal = this.$store.state.session.tokens[this.asset]['meta']['decimal'];
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
  },

  methods: {
    handleBack() {
      this.$router.push({ name: 'accounts-list' });
    },
    handleShowQRClick() {
      const regex = /[^0-9]/g;
      if (!regex.test(this.inputAmount)) {
        this.receiveModal = true;
      } else {
        this.notification = true;
        this.notificationText = 'Please input a number.';
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
    assetListStyle() {
      switch (Object.keys(this.$store.state.session.tokens).length) {
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
    assetListScrollStyle() {
      switch (Object.keys(this.$store.state.session.tokens).length) {
        case 4:
          return 'scroll';
        default:
          return 'hidden';
      }
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
        margin-left: 38px;

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
        margin-left: 35px;
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

    background: #eff5f7;
    box-shadow: inset 0px 6px 17px -8px rgba(0, 0, 0, 0.05);
    position: absolute;
    width: 375px;
    height: 380px;
    bottom: 0px;
    .selectbox_asset {
      width: 243px;
      height: 172px;
      position: absolute;
      left: 105px;
      border-radius: 3px;
      border: 1px solid #279ecc;
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
        width: 240px;
        height: 33px;
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
