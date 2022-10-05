<template>
  <ScrollView class="page">
    <HeaderVue
      button="back"
      title="AERGO GEM"
      refresh
      :to="{
        name: 'accounts-list-address',
        params: {
          address: $route.params.address,
        },
      }"
    />
    <div class="token_detail_content_wrapper">
      <div class="account_detail_wrapper">
        <div class="direction-row">
          <div class="circle" />
          <div class="network">AERGO Mainnet</div>
        </div>
        <div class="account_wrapper">
          <Icon class="account_icon" />
          <div class="account_title">ACCOUNT</div>
          <div class="account_title_wrapper">
            <div class="account">AmsyLn...dePgfY</div>
            <Icon class="account_button" :name="`delete2`" @click="handleDelete" />
          </div>
        </div>
      </div>
      <div class="token_transaction_history_wrapper">
        <Icon class="icon" />
        <div class="price">2,000,000,000</div>
        <div class="token_name">ARG</div>
      </div>

      <div class="transaction_history_wrapper">
        <div class="title">Transaction History</div>
        <div class="checkbox">checkbox</div>
      </div>
      <div class="token_detail_background">
        <ul class="token_detail_wrapper">
          <li class="token_detail_list">
            <div class="time">2022.03.08 22:56</div>
            <div class="direction_row">
              <div class="recieved">Received</div>
              <div class="direction_row">
                <div class="price">525.000</div>
                <div class="token_name">ARG</div>
              </div>
            </div>
            <div class="line"></div>
            <div class="direction_row">
              <div class="address">From: AmLx...e42f</div>
              <Button class="button" :name="'pointer'" />
            </div>
          </li>
          <li class="token_detail_list">
            <div class="time">2022.03.08 22:56</div>
            <div class="direction_row">
              <div class="sent">Sent</div>
              <div class="direction_row">
                <div class="price">525.000</div>
                <div class="token_name">ARG</div>
              </div>
            </div>
            <div class="line"></div>
            <div class="direction_row">
              <div class="address">From: AmLx...e42f</div>
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
  methods: {
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
        display: flex;
        align-items: center;
        margin-left: 40px;

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
          left: 10px;
          /* Primary/Blue01 */

          color: #279ecc;
        }
      }
      .account_button {
        cursor: pointer;
        margin-left: 58px;
      }
    }
  }
  .token_transaction_history_wrapper {
    margin-top: 10px;
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
