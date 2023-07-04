<template>
  <ScrollView class="page">
    <HeaderVue
      button="back"
      title="NFT Detail"
      refresh
      :to="{ name: 'accounts-list' }"
      @refreshClick="refreshClick"
    />
    <LoadingIndicator
      v-if="isLoading"
      :size="56"
      :style="{ position: 'absolute', zIndex: 10, top: 0, bottom: 0, left: 0, right: 0 }"
    />
    <RemoveModal v-if="removeModal" @cancel="handleDelete" :userNft="token" />
    <div class="nft_detail_content_wrapper">
      <div class="account_detail_wrapper">
        <div class="direction-row">
          <!-- <div :class="`circle ${$store.state.accounts.chainId}`" /> -->
          <div class="network">{{ networkName }}</div>
        </div>
        <div class="account_wrapper">
          <Identicon :text="$store.state.accounts.address" class="account_icon" />
          <div class="account_title">
            {{
              $store.state.accounts.nick.length > 12
                ? `${$store.state.accounts.nick.slice(0, 12)}...`
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
            <Icon class="account_button" :name="`delete2`" @click="handleDelete(true)" />
          </div>
        </div>
      </div>

      <div class="nft_detail_background">
        <span
          :style="[
            token?.meta?.img_url
              ? { textAlign: 'center', fontSize: `1.1rem`, marginTop: '16px' }
              : { textAlign: 'center', fontSize: `1.1rem`, marginTop: '38px' },
          ]"
        >
          {{ token?.meta?.img_url ? token?.token?.meta?.name : '' }}
        </span>
        <div v-if="tabState === 'inventory'" class="nft_info_wrapper">
          <img
            v-if="token?.meta?.img_url"
            :src="token?.meta?.img_url"
            alt="img"
            :style="{ height: '100%' }"
          />
          <div
            v-else
            :style="{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }"
          >
            <span>{{ token?.token?.meta?.name }}</span>
            <span :style="{ wordBreak: 'break-all', margin: '8px' }">{{
              `#${token?.meta?.token_id}`
            }}</span>
          </div>
        </div>
        <span
          v-if="token?.meta?.img_url"
          :style="{ textAlign: 'center', fontSize: `1rem`, marginTop: '15px' }"
          >{{ `#${token?.meta?.token_id}` }}</span
        >
        <span :style="token?.meta?.img_url ? { marginTop: '5px' } : { marginTop: '15px' }">{{
          `Latest Transaction Hash`
        }}</span>
        <span
          v-if="latestTransactionHash"
          :style="{
            wordBreak: 'break-all',
            fontSize: '14px',
            width: '230px',
            marginTop: '5px',
            color: '#279ecc',
            cursor: 'pointer',
          }"
          @click="goToLatestTransactionHash"
          >{{ `${latestTransactionHash.slice(0, 12)}......${latestTransactionHash.slice(-12)}` }}
        </span>
        <span
          v-else
          :style="{
            wordBreak: 'break-all',
            fontSize: '14px',
            width: '230px',
            marginTop: '5px',
            textAlign: 'center',
            color: '#279ecc',
          }"
          >{{ `No Transaction History` }}</span
        >
        <div v-if="!isLoading" class="footer">
          <Button class="button" type="font-gradation" size="large" @click="handleSend" hover
            ><Icon class="button-icon" :name="`send`" /><span>Send</span></Button
          >
        </div>
      </div>
    </div>
    <Notification v-if="clipboardNotification" :title="`Copied!`" :icon="`check`" />
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import HeaderVue from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import Identicon from '@aergo-connect/lib-ui/src/content/Identicon.vue';
import Notification from '@aergo-connect/lib-ui/src/modal/Notification.vue';
import LoadingIndicator from '@aergo-connect/lib-ui/src/icons/LoadingIndicator.vue';
import RemoveModal from '@aergo-connect/lib-ui/src/modal/RemoveTokenModal.vue';
import { getScanApiUrl, getScanExplorerUrl } from '../utils/chain-urls';

export default Vue.extend({
  components: {
    ScrollView,
    Button,
    Heading,
    Icon,
    HeaderVue,
    Identicon,
    Notification,
    LoadingIndicator,
    RemoveModal,
  },

  data() {
    return {
      tabState: 'inventory',
      removeModal: false,
      clipboardNotification: false,
      error: '',
      data: [],
      allData: [],
      filter: 'All',
      isLoading: false,
      token: {},
      winWidth: '',
      nftImgUrl: '',
      latestTransactionHash: '' || null,
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

  beforeMount() {
    const nftWallet = this.getTokens[this.$store.state.accounts.selectedToken]['nftWallet'];
    const nft = nftWallet.filter((nft: any) => nft.meta.token_id === this.$route.params.id);
    this.token = nft[0];

    this.getLatestTransactionHash().then((data) => {
      if (!data) {
        this.latestTransactionHash = null;
      } else {
        this.latestTransactionHash = data;
      }
    });
  },
  watch: {
    clipboardNotification(state: boolean) {
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
    gotoSend(item: object) {
      this.$router
        .push({
          name: 'send',
          params: {
            id: item.meta.token_id,
          },
        })
        .catch(() => {});
    },

    gotoScanTx(hash: string) {
      const scanExplorerUrl = getScanExplorerUrl(this.$store.state.accounts);
      const url = `${scanExplorerUrl}/transaction/${hash.split('-')[0]}/`;
      window.open(url, '_blank');
    },

    gotoScanAccount(address: string) {
      const scanExplorerUrl = getScanExplorerUrl(this.$store.state.accounts);
      const url = `${scanExplorerUrl}/account/${address}/`;
      window.open(url, '_blank');
    },

    gotoScanNft(address: string, nftName: string) {
      const scanExplorerUrl = getScanExplorerUrl(this.$store.state.accounts);
      const url = `${scanExplorerUrl}/nft/${address}/?tx=inventory&keyword=${nftName}`;
      window.open(url, '_blank');
    },
    goToLatestTransactionHash() {
      const scanExplorerUrl = getScanExplorerUrl(this.$store.state.accounts);
      window.open(`${scanExplorerUrl}/transaction/${this.latestTransactionHash}?tx=nft`, '_blank');
    },
    async refreshClick() {
      this.isLoading = true;
      // if (this.tabState === 'inventory') await this.getNftInventory();
      // else await this.getNftHistory();
      this.isLoading = false;
    },

    handleSend() {
      this.$router.push({ name: 'send', params: { id: this.$route.params.id } }).catch(() => {});
    },

    copyToClipboard(text: string) {
      navigator.clipboard.writeText(text);
      this.clipboardNotification = true;
    },
    async getLatestTransactionHash() {
      const scanApiUrl = getScanApiUrl(this.$store.state.accounts);
      const getNftTransferUrl = `${scanApiUrl}/nftTransfers?q=address:${this.token?.meta?.address} AND token_id:${this.token?.meta?.token_id}&sort=ts:desc&from=0&size=1`;
      const fetchUrl = await fetch(getNftTransferUrl);
      const jsonData = await fetchUrl.json();
      const responseData = await jsonData.hits[0];
      return responseData?.meta?.tx_id;
    },
    handleDelete(state) {
      this.removeModal = state;
    },
  },
});
</script>

<style lang="scss">
.nft_detail_content_wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .tab_wrapper {
    width: 375px;
    height: 35px;
    display: flex;
    cursor: pointer;
    .tab_active {
      height: 35px;
      width: 187px;
      .tab_text {
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 7px;
        color: #279ecc;
      }
      .tab_line {
        width: 187px;
        align-items: flex-start;
        border: 2px solid #279ecc;
      }
    }
    .tab_disable {
      width: 187px;
      .tab_text {
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 7px;
        color: #9c9a9a;
      }
      .tab_line {
        display: none;
      }
    }
  }
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
        margin-left: 20px;
      }
    }
  }
  .nft_transaction_history_wrapper {
    margin-top: 10px;
    margin-left: 24px;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 327px;
    height: 61px;
    background: #ffffff;
    /* Grey/00 */

    border: 1px solid #f6f6f6;
    /* 05 */

    box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    &.aergo {
      height: 143px;
    }
    &.others {
      flex-direction: row;
      justify-content: space-evenly;
      .icon {
        margin-top: 0;
      }
    }

    .flex-row {
      display: flex;
      justify-content: space-evenly;
      width: 100%;
      align-items: center;
      .token_symbol {
        margin-right: 13px;
        margin-bottom: 10px;
      }
    }

    .line {
      margin-top: 12px;
      background: #f0f0f0;
      width: 299px;
      height: 1px;
    }
    &.detail {
      margin-top: 6px;
    }
    .detail_wrapper {
      margin-top: 6px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .detail_title {
        /* Caption/C1 */
        margin-left: 14px;
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
      .detail_content {
        word-break: break-all;
        margin-right: 14px;
        /* Caption/C1 */
        float: right;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 19px;
        /* identical to box height */

        text-align: right;
        letter-spacing: -0.333333px;

        /* Grey/07 */

        color: #454344;
      }
    }
    .icon {
      margin-top: 14px;
      margin-left: 8px;
      border: 1px solid #d8d8d8;
      width: 41px;
      height: 41px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
    }
    .balance_wrapper {
      word-break: break-all;
      width: 200px;
      margin-top: 14px;
      .dollor {
        /* Caption/C3 */
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        /* identical to box height */

        letter-spacing: -0.333333px;

        /* Grey/04 */

        color: #9c9a9a;
        margin-left: 15px;
        word-break: break-all;
      }
    }
    .balance {
      margin-left: 15px;
      /* Headline/H3 */
      width: 141px;
      height: 25px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      letter-spacing: -0.333333px;

      /* Grey/08 */

      color: #231f20;
    }
    .token_name {
      /* Subtitle/S3 */
      margin-right: 8px;
      margin-top: 18px;
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

  .nft_detail_background {
    background: #eff5f7;
    box-shadow: inset 0px 21px 17px -19px rgba(0, 0, 0, 0.05);
    position: absolute;
    width: 375px;
    height: 460px;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .footer {
      position: absolute;
      bottom: 0;
      margin-bottom: 10px;
      .button.button-type-font-gradation {
        border: none;
      }
      .button-icon {
        margin-top: 4px;
        margin-right: 8.5px;
      }
      &.aergo {
        top: 40px;
      }
    }
    .select {
      margin-bottom: 8px;
      background: #ffffff;
      /* Grey/02 */
      width: 90px;
      border: 1px solid #d8d8d8;
      border-radius: 4px;
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
    &.others {
      height: 345px;
    }
    .nft_info_wrapper {
      margin-top: 10px;
      width: 240px;
      height: 240px;
      overflow-y: hidden;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      border: solid 0.01em #d0d0d0;
      border-radius: 8px;
      box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.25);
      -webkit-box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.25);
      -moz-box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.25);
      &.scroll {
        overflow-y: scroll;
      }
      .nft_info_list {
        width: 315px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-top: 5px;
        margin-bottom: 3px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: #ffffff;
        border-radius: 8px;
        .icon {
          cursor: pointer;
        }
        .img {
          width: 46px;
          height: 46px;
        }
        .nft_name_wrapper {
          width: 11.5rem;
          display: flex;
          flex-direction: column;
          .time {
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 300;
            font-size: 12px;
            line-height: 15px;
            letter-spacing: -0.333333px;

            /* Grey/04 */

            color: #9c9a9a;
          }

          .id {
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 500;
            font-size: 18px;
            line-height: 24px;
            /* or 133% */

            /* Grey/07 */

            color: #454344;
          }
        }
      }
      .nft_info_list:hover {
        background: #f6f6f6;
      }
      &.noscroll {
        overflow-y: hidden;
        justify-content: center;
      }
    }
    .nft_info_wrapper:hover {
      transform: scale(1.05);
      transition: 0.4s;
    }
    .nft_detail_wrapper {
      overflow-x: hidden;
      overflow-y: scroll;
      width: 340px;
      height: 19.5rem;
      margin-top: 15px;
      flex-direction: column;
      display: flex;
      .nft_detail_list {
        margin-bottom: 10px;
        height: 88px;
        background: #ffffff;
        border-radius: 8px;
        .time {
          margin-left: 16px;
          margin-top: 8px;
          width: 100px;
          height: 15px;
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 300;
          font-size: 12px;
          line-height: 15px;
          letter-spacing: -0.333333px;

          /* Grey/04 */

          color: #9c9a9a;
        }

        .direction_row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
          .icon {
            cursor: pointer;
            margin-right: 10px;
          }
          .received {
            margin-left: 16px;
            width: 68px;
            height: 21px;
            /* Button/Btn2 */

            font-family: 'Outfit';
            font-style: normal;
            font-weight: 500;
            font-size: 17px;
            line-height: 21px;

            /* Primary/Blue01 */

            color: #279ecc;
          }
          .sent {
            margin-left: 16px;
            width: 35px;
            height: 21px;
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 500;
            font-size: 17px;
            line-height: 21px;

            /* Grey/07 */

            color: #454344;
          }
          .balance {
            margin-right: 8px;
            width: 66px;
            height: 21px;
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 500;
            font-size: 17px;
            line-height: 21px;
            text-align: right;

            /* Grey/07 */

            color: #454344;
          }
          .token_symbol {
            margin-right: 16px;
          }

          .address {
            margin-left: 16px;
            /* Caption/C3_line */

            font-family: 'Outfit';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            letter-spacing: -0.333333px;
            text-decoration-line: underline;
            cursor: pointer;
            /* Grey/06 */

            color: #686767;
          }
          .button {
            width: 22px;
            height: 22px;
          }
        }
      }
      &.noscroll {
        overflow-y: hidden;
      }
    }
    .nft_detail_list_nothing_wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 19px;
      text-align: center;
      letter-spacing: -0.333333px;
      color: #bababa;

      .nothing_text {
        /* Caption/C1 */
        margin-top: 8px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 19px;
        /* identical to box height */

        text-align: center;
        letter-spacing: -0.333333px;

        /* Grey/03 */

        color: #bababa;
      }
      .line {
        margin-left: 16px;
        margin-top: 6px;
        width: 295px;
        height: 1px;
        background: #eff5f7;
      }
    }
    .footer {
      position: absolute;
      bottom: 0px;
      margin-bottom: 25px;
      &.aergo {
        top: 40px;
      }
    }
  }
}

.button-group {
  width: 328px;
  display: flex;
  justify-content: space-between;
  .button {
    box-shadow: 0px 4px 13px rgba(119, 153, 166, 0.25);
    width: 157px;
    .button-icon {
      margin-right: 9.49px;
    }
    &.button-type-font-gradation:hover {
      background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
      /* shadow/02 */
      box-shadow: 0px 4px 13px rgba(119, 153, 166, 0.25);
      border-radius: 4px;
    }
    &.button-type-font-gradation:hover span {
      /* background: none; */
      color: #fff;
      -webkit-text-fill-color: #fff;
    }
    &.button-type-font-gradation:hover path {
      /* background: none; */
      color: #fff;
      fill: #fff;
      -webkit-text-fill-color: #fff;
    }
  }
}
</style>
