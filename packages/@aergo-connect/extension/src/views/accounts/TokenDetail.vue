<template>
  <ScrollView class="page">
    <HeaderVue
      button="back"
      :title="getTitle()"
      refresh
      :to="{ name: 'accounts-list-address', params: { address: $store.state.accounts.address } }"
    />
    <div class="token_detail_content_wrapper">
      <div class="account_detail_wrapper">
        <div class="direction-row">
          <div class="circle" />
          <div class="network">{{ $store.state.accounts.network }}</div>
        </div>
        <div class="account_wrapper">
          <Identicon :text="$store.state.accounts.address" class="account_icon" />
          <div class="account_title">{{ $store.state.accounts.nick }}</div>
          <div class="account_title_wrapper">
            <div class="account">
              {{
                `${$store.state.accounts.address.slice(
                  0,
                  6,
                )}...${$store.state.accounts.address.slice(-6)}`
              }}
            </div>
            <Icon class="account_button" :name="`delete2`" @click="handleDelete" />
          </div>
        </div>
      </div>
      <div v-if="state === 'others'" class="token_transaction_history_wrapper">
        <Icon class="icon" />
        <div class="price">{{ $route.params.balance }}</div>
        <div class="token_name">ARG</div>
      </div>

      <div v-if="state === 'aergo'" class="token_transaction_history_wrapper aergo">
        <div class="flex-row">
          <Icon class="icon" :name="'aergo'" />
          <div class="price_wrapper">
            <div class="price">{{ $route.params.balance || '2,000,000.000' }}</div>
            <div class="dollor">$ 0.0</div>
          </div>
          <div class="token_name">AERGO</div>
        </div>
        <div class="line" />
        <div class="detail_wrapper">
          <div class="detail_title">Staked Balance</div>
          <div class="detail_content">0 AERGO</div>
        </div>
        <div class="line detail" />
        <div class="detail_wrapper">
          <div class="detail_title">Registered Names</div>
          <div class="detail_content">0</div>
        </div>
      </div>

      <div class="transaction_history_wrapper">
        <div class="title">Transaction History</div>
        <div class="checkbox">checkbox</div>
      </div>
      <div class="token_detail_background">
        <ul class="token_detail_wrapper">
          <li v-for="item in data" class="token_detail_list">
            <div class="time">{{ item.meta.ts }}</div>
            <div class="direction_row">
              <div class="sent">Sent</div>
              <div class="direction_row">
                <div class="price">
                  {{ getBalance(item.meta.amount, item.token.meta.decimals) }}
                </div>
                <div class="token_name">{{ item.token.meta.symbol }}</div>
              </div>
            </div>
            <div class="line"></div>
            <div class="direction_row">
              <div class="address">{{ item.meta.from }}</div>
              <Button :name="'pointer'" />
            </div>
          </li>
        </ul>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <Appear :delay="0.6">
          <ButtonGroup horizontal class="button_wrapper">
            <Button type="primary" size="small" :to="{ name: 'setup' }" hover>Send</Button>
            <Button type="primary" size="small" :to="{ name: 'setup' }" hover>Receive</Button>
          </ButtonGroup>
        </Appear>
      </div>
    </template>
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
import Identicon from '../../../../lib-ui/src/content/Identicon.vue';

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
  },

  /*
  props: {
    token: {
      type: any,
      default: []
    },
    token: {
      type: any,
      default: []
    },
  },
*/

  data() {
    return {
      error: '',
      data: [],
      //      totalItems: 0,
      //      isLoading: false,
      selectedFilterToken: 'all',
    };
  },

  beforeMount() {
    this.getHistory();
  },

  computed: {
    state() {
      if (this.getTitle() === 'AERGO') {
        return 'aergo';
      } else if (this.getTitle() === 'NFT') {
        return 'nft';
      } else {
        return 'others';
      }
    },
  },

  methods: {
    getBalance(value: float, decimals: float) {
      return value / Math.pow(10, decimals);
    },

    getTitle() {
      if (
        this.$store.state.ui.route.currentPath ===
        `/list/${this.$store.state.accounts.address}/tokendetail/aergo`
      ) {
        return 'AERGO';
      }
      return this.$route.params.token.meta.name;
    },

    async getHistory() {
      //  console.log("fetch", `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/tokenTransfers?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address}) AND address:${this.$route.params.token.hash}`) ;

      const resp = await fetch(
        `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/tokenTransfers?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address}) AND address:${this.$route.params.token.hash}`,
      );

      const response = await resp.json();
      console.log(response, 'response!!!!');
      if (response.error) {
        this.data = [];
      } else this.data = response.hits;

      console.log('response', this.data);

      /*
      if (response.error) {
        this.error = response.error.msg;
      } else if (response.hits.length) {
        this.data = await response.hits.map(item => ({
          ...item.meta,
          hash: item.hash,
          name: item.token.meta.name,
          symbol: item.token.meta.symbol,
          decimals: item.token.meta.decimals,
        }));
        console.log("data", data) ;
        this.totalItems = response.total;
      } else {
        this.data = [];
        this.totalItems = 0;
      }
*/

      this.$emit('onUpdateTotalCount', this.totalItems);
    },
    handleDelete() {
      console.log('delete');
    },
  },
});
</script>

<style lang="scss">
.token_detail_content_wrapper {
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

        width: 105px;
        height: 22px;
        background: #eff5f7;
        border-radius: 25px;
        .account {
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
          position: relative;
          left: 6px;
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
  .token_transaction_history_wrapper {
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
      height: 139px;
    }
    .flex-row {
      display: flex;
      justify-content: space-evenly;
      width: 100%;
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
    .price_wrapper {
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
    .price {
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
  .transaction_history_wrapper {
    display: flex;
    margin-top: 24px;
    .title {
      margin-left: 24px;
      width: 150px;
      height: 20px;
      /* Button/Btn3 */

      font-family: 'Outfit';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      display: flex;
      align-items: center;

      /* Grey/06 */

      color: #686767;
    }
    .checkbox {
      margin-left: 108px;
      margin-right: 24px;
      width: 80px;
      height: 28px;
    }
  }
  .token_detail_background {
    background: #eff5f7;
    box-shadow: inset 0px 21px 17px -19px rgba(0, 0, 0, 0.05);
    position: absolute;
    width: 375px;
    height: 260px;
    bottom: 0px;
    .token_detail_wrapper {
      flex-direction: column;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .line {
        margin-left: 16px;
        margin-top: 6px;
        width: 295px;
        height: 1px;
        background: #eff5f7;
      }
      .token_detail_list {
        margin-top: 10px;
        width: 327px;
        height: 88px;
        background: #ffffff;
        border-radius: 8px;
        .time {
          margin-left: 16px;
          margin-top: 8px;
          width: 89px;
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
          .recieved {
            margin-left: 16px;
            margin-top: 4px;
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
            margin-top: 4px;
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
          .price {
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
          .token_name {
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
    }
  }
}
</style>
