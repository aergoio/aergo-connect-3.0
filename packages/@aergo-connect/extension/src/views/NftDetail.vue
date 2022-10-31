<template>
  <ScrollView class="page">
    <HeaderVue
      button="back"
      :title="getTitle()"
      refresh
      :to="{ name: 'accounts-list' }"
      @refreshClick="refreshClick"
    />
    <LoadingBar v-if="isLoading" />
    <div class="nft_detail_content_wrapper">
      <div class="account_detail_wrapper">
        <div class="direction-row">
          <div class="circle" />
          <div class="network">{{ $store.state.accounts.network }}</div>
        </div>
        <div class="account_wrapper">
          <Identicon :text="$store.state.accounts.address" class="account_icon" />
          <div class="account_title">{{ $store.state.accounts.nick }}</div>
          <div class="account_title_wrapper">
            <div class="account" @click="copyToClipboard($store.state.accounts.address)">
              {{
                `${$store.state.accounts.address.slice(
                  0,
                  6,
                )}...${$store.state.accounts.address.slice(-6)}`
              }}
            </div>
            <Icon
              v-if="!token.meta.image"
              class="account_button"
              :name="`delete2`"
              @click="handleDelete(true)"
            />
          </div>
        </div>
      </div>
      <RemoveModal v-if="removeModal" @cancel="handleDelete" />

      <div class="tab_wrapper">
        <div
          :class="[tabState === `inventory` ? `tab_active` : `tab_disable`]"
          @click="handleChangeState('inventory')"
        >
          <div class="tab_text">Inventory</div>
          <div class="tab_line" />
        </div>
        <div
          :class="[tabState === `tx_history` ? `tab_active` : `tab_disable`]"
          @click="handleChangeState('tx_history')"
        >
          <div class="tab_text">Tx History</div>
          <div class="tab_line" />
        </div>
      </div>

      <div class="nft_detail_background">
        <ul
          v-if="tabState === 'inventory'"
          :class="[data.length > 0 ? 'nft_info_wrapper' : 'nft_info_wrapper noscroll']"
        >
          <li v-for="item in data" class="nft_info_list">
            <div>
              <!-- <img
                v-if="item.token.meta.image"
                class="img"
                :src="item.token.meta.image"
                alt="404"
              /> -->
              <!-- <Icon class="img" :name="`defaultNft`" /> -->
            </div>
            <div class="nft_name_wrapper">
              <div class="time">{{ item.meta.ts.slice(0, 16) }}</div>
              <!-- <div class="id">{{ item.token.meta.symbol }}</div> -->
              <div class="id">
                {{
                  `${
                    item.meta.token_id.length > 15
                      ? `${item.meta.token_id.slice(0, 15)}...`
                      : item.meta.token_id
                  }`
                }}
              </div>
            </div>
            <Icon class="icon" :name="`nftIcon`" @click="gotoSend(item)" />
          </li>
          <div v-if="data.length === 0" class="nft_detail_list_nothing_wrapper">
            <Icon class="nothing_icon" :name="`nothing`" />
            <div class="nothing_text">No Inventory.</div>
          </div>
        </ul>

        <ul
          v-if="tabState === 'tx_history'"
          :class="[data.length > 0 ? 'nft_detail_wrapper' : 'nft_detail_wrapper noscroll']"
        >
          <!-- <div v-if="data.length > 0"> -->
          <select
            v-if="tabState === `tx_history` && data.length > 0"
            class="select"
            v-model="filter"
          >
            <option class="option" selected value="All">All</option>
            <option class="option" value="Received">Received</option>
            <option class="option" value="Sent">Sent</option>
          </select>

          <li class="nft_detail_list" v-for="item in data" :key="item.meta.tx_id">
            <div class="time">{{ item.meta.ts.slice(0, 16) }}</div>
            <div class="direction_row">
              <div v-if="item.meta.from === $store.state.accounts.address" class="sent">Sent</div>
              <div v-else class="received">Received</div>

              <div class="token_symbol">
                {{
                  `${
                    item.meta.token_id.length > 15
                      ? `${item.meta.token_id.slice(0, 15)}...`
                      : item.meta.token_id
                  }`
                }}
              </div>
            </div>
            <div class="line"></div>
            <div class="direction_row">
              <div
                v-if="item.meta.from === $store.state.accounts.address"
                class="address"
                @click="gotoScanAccount(item.meta.to)"
              >
                {{ `To: ${item.meta.to.slice(0, 6)}...${item.meta.to.slice(-6)}` }}
              </div>
              <div v-else class="address" @click="gotoScanAccount(item.meta.to)">
                {{ `From: ${item.meta.to.slice(0, 6)}...${item.meta.to.slice(-6)}` }}
              </div>
              <Icon :name="'pointer'" @click="gotoScanTx(item.hash)" />
            </div>
          </li>
          <!-- </div> -->
          <div v-if="data.length === 0" class="nft_detail_list_nothing_wrapper">
            <Icon class="nothing_icon" :name="`nothing`" />
            <div class="nothing_text">No Transaction Details.</div>
          </div>
        </ul>
        <div v-if="!isLoading" class="footer">
          <Appear :delay="0.6">
            <ButtonGroup>
              <Button class="button" type="font-gradation" size="small" @click="handleSend"
                ><Icon class="button-icon" :name="`send`" /><span>Send</span></Button
              >
              <Button class="button" type="font-gradation" size="small" @click="handleReceive"
                ><Icon class="button-icon" :name="`receive`" /><span>Receive</span></Button
              >
            </ButtonGroup>
          </Appear>
        </div>
      </div>
    </div>
    <Notification v-if="clipboardNotification" :title="`Copied!`" :icon="`check`" />
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import HeaderVue from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import Identicon from '@aergo-connect/lib-ui/src/content/Identicon.vue';
import RemoveModal from '@aergo-connect/lib-ui/src/modal/RemoveTokenModal.vue';
import Notification from '@aergo-connect/lib-ui/src/modal/Notification.vue';
import LoadingBar from '@aergo-connect/lib-ui/src/forms/LoadingBar.vue';
import { Amount } from '@herajs/common';

export default Vue.extend({
  components: {
    ScrollView,
    Button,
    ButtonGroup,
    Heading,
    Appear,
    Icon,
    HeaderVue,
    Identicon,
    RemoveModal,
    Notification,
    LoadingBar,
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
    };
  },

  beforeMount() {
    this.token = this.$store.state.session.tokens[this.$store.state.session.token];
    console.log('token', this.token);
    this.getNftInventory();
  },

  watch: {
    filter: function () {
      if (this.filter === 'All') {
        this.getNftHistory();
      } else if (this.filter === 'Sent') {
        this.data = this.allData.filter((item) => {
          if (item.meta.from === this.$store.state.accounts.address) {
            return item;
          }
        });
      } else if (this.filter === 'Received') {
        this.data = this.allData.filter((item) => {
          if (item.meta.from !== this.$store.state.accounts.address) {
            return item;
          }
        });
      }
    },
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
            nft: item.meta.token_id,
          },
        })
        .catch(() => {});
    },

    gotoScanTx(hash: string) {
      const url = `https://${this.$store.state.accounts.network}.aergoscan.io/transaction/${
        hash.split('-')[0]
      }/`;
      window.open(url, '', 'width=1000,height=1000');
    },

    gotoScanAccount(address: string) {
      const url = `https://${this.$store.state.accounts.network}.aergoscan.io/account/${address}/`;
      window.open(url, '', 'width=1000,height=1000');
    },

    getTitle() {
      return this.token.meta.name;
    },

    async refreshClick() {
      this.isLoading = true;
      console.log('refresh');
      if (this.tabState === 'inventory') await this.getNftInventory();
      else await this.getNftHistory();
      this.isLoading = false;
    },

    async getNftHistory(): Promise<void> {
      console.log(
        'fetch',
        `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/nftTransfers?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address}) AND address:${this.token.hash}`,
      );

      const resp = await fetch(
        `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/nftTransfers?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address}) AND address:${this.token.hash}&size=100&sort=ts:desc`,
      );
      const response = await resp.json();
      if (response.error) this.data = [];
      else {
        this.data = response.hits;
        this.allData = response.hits;
      }

      console.log('history', this.data);
    },

    async getNftInventory(): Promise<void> {
      // console.log(
      //   'nft',
      //   `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/nftInventory?q=address:${this.token.hash} AND (account:${this.$store.state.accounts.address})&sort=blockno:desc&from=0&size=7`,
      // );

      const resp = await fetch(
        `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/nftInventory?q=address:${this.token.hash} AND (account:${this.$store.state.accounts.address})&sort=blockno:desc&from=0&size=100`,
      );

      const response = await resp.json();
      if (response.error) this.data = [];
      else this.data = response.hits.reverse();

      console.log('inventory', this.data);
    },

    handleDelete(state: boolean) {
      state ? (this.removeModal = true) : (this.removeModal = false);
    },

    handleSend() {
      this.$router.push({ name: 'send' }).catch(() => {});
      console.log('send');
    },
    handleReceive() {
      this.$router.push({ name: 'receive' }).catch(() => {});
      console.log('receive');
    },
    handleChangeState(state: string) {
      if (state == `inventory`) this.getNftInventory();
      else this.getNftHistory();

      this.tabState = state;
    },
    copyToClipboard(text: string) {
      navigator.clipboard.writeText(text);
      this.clipboardNotification = true;
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
        width: 83px;
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
        margin-left: 24px;

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
    height: 438px;
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
      &.aergo {
        top: 40px;
      }
    }
    .select {
      margin-left: 0;
      background: #ffffff;
      /* Grey/02 */
      width: 90px;
      height: 28px;
      border: 1px solid #d8d8d8;
      border-radius: 4px;
      margin-bottom: 12px;
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
      width: 350px;
      height: 21.5rem;
      overflow-y: scroll;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      .nft_info_list {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: 327px;
        height: 78px;
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
      &.noscroll {
        overflow-y: hidden;
        justify-content: center;
      }
    }
    .nft_detail_wrapper {
      overflow-x: hidden;
      overflow-y: scroll;
      width: 350px;
      height: 21rem;
      margin-top: 10px;
      flex-direction: column;
      display: flex;
      .nft_detail_list {
        margin-bottom: 10px;
        width: 327px;
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
        justify-content: center;
      }
    }
    .nft_detail_list_nothing_wrapper {
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
    border-radius: 4px;
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
      background: none;
      color: #fff;
      -webkit-text-fill-color: #fff;
    }
    &.button-type-font-gradation:hover path {
      background: none;
      color: #fff;
      fill: #fff;
      -webkit-text-fill-color: #fff;
    }
  }
}
</style>
