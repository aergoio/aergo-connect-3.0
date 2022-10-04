<template>
  <ScrollView class="page">
    <HeaderVue
      button="back"
      :title="$route.params.token.meta.name"
      refresh
      :to="{
        name: 'accounts-list-address',
        params: {
          address: $store.state.accounts.address,
        },
      }"
    />
    <div class="token_detail_content_wrapper">
      <div class="account_detail_wrapper">
        <div class="direction-row">
          <div class="circle" />
          <div class="network">{{ $store.state.accounts.network }}</div>
        </div>
        <div class="account_wrapper">
          <Icon class="account_icon" />
          <div class="account_title">{{ $store.state.accounts.nick }} </div>
          <div class="account_title_wrapper">
            <div class="account">{{ `${$store.state.accounts.address.slice(0, 15)}...${$store.state.accounts.address.slice(-5)}` }}</div>
          </div>
          <Button class="account_button">-</Button>
        </div>
      </div>
      <div class="token_transaction_history_wrapper">
        <Icon class="icon" />
        <div class="price">{{ $route.params.balance }}</div>
        <div class="token_name">ARG</div>
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
                <div class="price">{{ getBalance(item.meta.amount,item.token.meta.decimals) }}</div>
                <div class="token_name">{{ item.token.meta.symbol }}</div>
              </div>
            </div>
            <div class="line"></div>
            <div class="direction_row">
              <div class="address">{{ item.meta.from  }}</div>
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

export default Vue.extend({
  components: {
    ScrollView,
    Button,
    ButtonGroup,
    Heading,
    Appear,
    Icon,
    HeaderVue,
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
      selectedFilterToken: 'all'
    }
  },

  beforeMount () {
    this.getHistory() ;
  },

  methods: {

    getBalance(value: float, decimals: float) {
       return value / Math.pow(10,decimals) ;
    },


    async getHistory() {

    //  console.log("fetch", `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/tokenTransfers?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address}) AND address:${this.$route.params.token.hash}`) ;

      const resp = await fetch(`https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/tokenTransfers?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address}) AND address:${this.$route.params.token.hash}`) ;

      const response = await resp.json() ;

      if (response.error) {
          this.data = [] ;
      }
      else this.data = response.hits ;

      console.log("response", this.data) ;

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
  }
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
      .account_icon {
        margin-left: 38px;
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
        margin-left: 24px;
        width: 105px;
        height: 22px;
        background: #eff5f7;
        border-radius: 25px;
        .account {
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
        margin-left: 53px;
      }
    }
  }
  .token_transaction_history_wrapper {
    margin-left: 24px;
    display: flex;
    align-items: center;
    width: 327px;
    height: 61px;
    background: #ffffff;
    /* Grey/00 */

    border: 1px solid #f6f6f6;
    /* 05 */

    box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .icon {
      margin-left: 14px;
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
      margin-left: 69px;
      width: 33px;
      height: 20px;
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
    height: 340px;
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
