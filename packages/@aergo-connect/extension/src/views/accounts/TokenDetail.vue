<template>
  <ScrollView class="page_style">
    <HeaderVue
      button="back"
      :title="getTitle()"
      refresh
      :to="{ name: 'accounts-list', params: { address: $store.state.accounts.address } }"
      @refreshClick="refreshClick"
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
            <Icon
              v-if="state === 'others' && !$store.state.session.token.meta.image"
              class="account_button"
              :name="`delete2`"
              @click="handleDelete(true)"
            />
          </div>
        </div>
      </div>
      <RemoveModal v-if="removeModal" @cancel="handleDelete" />
      <div v-if="state === 'aergo'" class="token_transaction_history_wrapper aergo">
        <div class="flex-row">
          <Icon class="icon" :name="'aergo'" />
          <div class="balance_wrapper">
            <div class="balance">{{ $store.state.session.aergoBalance || '2,000,000.000' }}</div>
            <div class="dollor">$</div>
          </div>
          <div class="token_symbol">aergo</div>
        </div>
        <div class="line" />
        <div class="detail_wrapper">
          <div class="detail_title">Staked Balance</div>
          <div class="detail_content">{{ `${aergoStaking()} aergo` }}</div>
        </div>
        <div class="line detail" />
        <div class="detail_wrapper">
          <div class="detail_title">Registered Names</div>
          <div class="detail_content">{{ `0` }}</div>
        </div>
      </div>

      <div v-else-if="'others'" class="token_transaction_history_wrapper others">
        <img class="icon" :src="$store.state.session.token.meta.image" alt="404" />
        <div class="balance">{{ $store.state.session.token.balance }}</div>
        <div class="token_symbol">{{ $store.state.session.token.meta.symbol }}</div>
      </div>

      <div class="transaction_history_wrapper">
        <div class="title">Transaction History</div>
        <select class="select">
          <option class="option" selected>All</option>
          <option class="option">Received</option>
          <option class="option">Sent</option>
        </select>
      </div>

      <table v-if="state === 'aergo'" class="token_detail_background" >
        <tbody class="token_detail_wrapper">
          <tr v-for="item in data" class="token_detail_list">
            <td>
              <div class="time">{{ item.meta.ts.slice(0, 16) }}</div>
              <div class="direction_row">
<<<<<<< HEAD
                <div class="balance">{{ item.meta.amount_float }}</div>
                <div class="token_symbol">aergo</div>
              </div>
            </div>
            <div class="direction_row">
              <div v-if="item.meta.from == $store.state.accounts.address" class="address">
                {{ item.meta.to }}
              </div>
              <div v-else class="address">{{ item.meta.from }}</div>
              <Button :name="'pointer'" />
            </div>
          </li>
          <div v-if="data.length === 0" class="token_detail_list_nothing_wrapper aergo">
            <Icon class="nothing_icon" :name="`nothing`" />
            <div class="nothing_text">No Transaction Details.</div>
          </div>
        </ul>
        <div class="footer aergo">
          <Appear :delay="0.6">
            <ButtonGroup>
              <Button class="button" type="font-gradation" size="small" @click="handleSend"
                ><Icon class="button-icon" :name="`send`" /><span>Send</span></Button
              >
              <Button class="button" type="font-gradation" size="small" @click="handleReceive"
                ><Icon class="button-icon" :name="`send`" /><span>Receive</span></Button
              >
            </ButtonGroup>
          </Appear>
        </div>
      </div>

      <div v-else-if="state === 'others'" class="token_detail_background others">
        <ul class="token_detail_wrapper">
          <li v-for="item in data" class="token_detail_list">
            <div class="time">{{ item.meta.ts.slice(0, 16) }}</div>
            <div class="direction_row">
              <div v-if="item.meta.from == $store.state.accounts.address" class="sent">Sent</div>
              <div v-else class="sent">Recevied</div>
              <div class="direction_row">
                <div class="balance">
                  {{ getBalance(item.meta.amount, item.token.meta.decimals) }}
=======
                <div v-if="item.meta.from === $store.state.accounts.address" class="sent">Sent</div>
                <div v-else class="sent">Recevied</div>
                <div class="direction_row">
                  <div class="balance">{{ item.meta.amount_float }}</div>
                  <div class="token_symbol">aergo</div>
>>>>>>> a3bdf966ad11c18cc149b3a9df14bee5c40124c3
                </div>
              </div>
              <div class="direction_row">
                <div v-if="item.meta.from == $store.state.accounts.address" class="address">
                  <span>To:</span>
                  <span>
                  {{
                    `${item.meta.to.slice(
                    0,
                    6,
                    )}...${item.meta.to.slice(-6)}`
                  }}
                  </span>
                </div>
                <div v-else class="address">
                  <span>From:</span>
                  <span>
                  {{  
                    `${item.meta.from.slice(
                    0,
                    6,
                    )}...${item.meta.from.slice(-6)}`
                  }}
                  </span>
                </div>
                <Button :name="'pointer'" />
              </div>
<<<<<<< HEAD
              <div v-else class="address">{{ item.meta.from }}</div>
              <Button :name="'pointer'" />
            </div>
          </li>
          <div v-if="data.length === 0" class="token_detail_list_nothing_wrapper others">
            <Icon class="nothing_icon" :name="`nothing`" />
            <div class="nothing_text">No Transaction Details.</div>
          </div>
        </ul>
        <div class="footer">
          <Appear :delay="0.6">
            <ButtonGroup>
              <Button class="button" type="font-gradation" size="small" @click="handleSend"
                ><Icon class="button-icon" :name="`send`" /><span>Send</span></Button
              >
              <Button class="button" type="font-gradation" size="small" @click="handleReceive"
                ><Icon class="button-icon" :name="`send`" /><span>Receive</span></Button
              >
            </ButtonGroup>
          </Appear>
        </div>
      </div>
=======
            </td>
            <td  v-if="data.length === 0" class="token_detail_list_nothing_wrapper">
              <Icon class="nothing_icon" :name="`nothing`" />
              <div class="nothing_text">No Transaction Details.</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table v-else class="token_detail_background others">
        <tbody class="token_detail_wrapper">
          <tr v-for="item in data" class="token_detail_list">
            <td>
              <div class="time">{{ item.meta.ts.slice(0, 16) }}</div>
              <div class="direction_row">
                <div v-if="item.meta.from == $store.state.accounts.address" class="sent">Sent</div>
                <div v-else class="sent">Recevied</div>
                <div class="direction_row">
                  <div class="balance">
                    {{ getBalance(item.meta.amount, item.token.meta.decimals) }}
                  </div>
                  <div class="token_symbol">{{ item.token.meta.symbol }}</div>
                </div>
              </div>
              <div class="line"></div>
              <div class="direction_row">
                <div v-if="item.meta.from == $store.state.accounts.address" class="address">
                  <span>To:</span>
                  <span>
                  {{
                    `${item.meta.to.slice(
                      0,
                      6,
                    )}...${item.meta.to.slice(-6)}`
                  }}
                  </span>
                </div>
                <div v-else class="address">
                  <span>From:</span>
                  <span>
                  {{  
                    `${item.meta.from.slice(
                    0,
                    6,
                    )}...${item.meta.from.slice(-6)}`
                  }}
                  </span>
                </div>
                <Button :name="'pointer'" />
              </div>
            </td>
            <td v-if="data.length === 0" class="token_detail_list_nothing_wrapper others">
              <Icon class="nothing_icon" :name="`nothing`" />
              <div class="nothing_text">No Transaction Details.</div>
            </td>
          </tr>
        </tbody>
      </table>
>>>>>>> a3bdf966ad11c18cc149b3a9df14bee5c40124c3
    </div>
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
import RemoveModal from '@aergo-connect/lib-ui/src/modal/RemoveAccountModal.vue';
import { Amount } from '@herajs/common';

function getVueInstance(instance: any): Vue {
  // @ts-ignore
  return instance._vm as Vue;
}

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
  },

  data() {
    return {
      removeModal: false,
      error: '',
      data: [],
      selectedFilterToken: 'all',
    };
  },

  beforeMount() {
    console.log('token', this.$store.state.session.token);
    if (this.state === 'aergo') this.getAergoHistory();
    else this.getTokenHistory();
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
    aergoStaking() {
      return '0';
      const staking = this.$background.getStaking({
        chainId: this.$store.state.accounts.network,
        address: this.$store.state.accounts.address,
      });
      if (!staking) return '';
      else return new Amount(staking.amount).formatNumber('aergo');
    },

    getBalance(value: number, decimals: number) {
      return value / Math.pow(10, decimals);
    },

    getTitle() {
      if (
        this.$store.state.ui.route.currentPath ===
        `/list/${this.$store.state.accounts.address}/tokendetail/aergo`
      ) {
        return 'AERGO';
      }
      return this.$store.state.session.token.meta.name;
    },

    refreshClick() {
      console.log('refresh');
      if (this.state === 'aergo') this.getAergoHistory();
      else this.getTokenHistory();
    },

    async getTokenHistory(): Promise<void> {
      //  console.log("fetch", `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/tokenTransfers?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address}) AND address:${this.$store.state.session.token.hash}`) ;

      const resp = await fetch(
        `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/tokenTransfers?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address}) AND address:${this.$store.state.session.token.hash}`,
      );

      const response = await resp.json();
      if (response.error) this.data = [];
      else this.data = response.hits;
    },

    async getAergoHistory(): Promise<void> {
      console.log(
        'aergo fetch',
        `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/transactions?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address})`,
      );

      const resp = await fetch(
        `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/transactions?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address})`,
      );

      const response = await resp.json();
      if (response.error) this.data = [];
      else this.data = response.hits;

      console.log('tx', this.data);
    },

    /*
    get stakedFiatBalance(): string {
      if (!this.tokenPriceInfo || !this.tokenPriceInfo.price || !this.staking || !this.staking.amount) return '';
      const aergoAmount = new Amount(this.staking.amount).formatNumber('aergo');
      const balance = Number(aergoAmount) * this.tokenPriceInfo.price;
      return formatCurrency(balance, this.tokenPriceInfo.currency);
    },

    async load() {
      if (this.state === 'initial') {
        this.state = 'loading';
      }
      this.staking = await this.$background.getStaking(this.accountSpec);
      this.state = 'loaded';
    },
*/
    handleDelete(state: boolean) {
      state ? (this.removeModal = true) : (this.removeModal = false);
    },

    handleSend() {
      console.log('send');
    },
    handleReceive() {
      console.log('receive');
    },
  },
});
</script>

<style lang="scss">
.page_style {
  background: #eff5f7;
}
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

        width: 120px;
        height: 22px;
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
        margin-left: 40px;
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
    height: 55px;
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
      margin-top: 10px;
      background: #f0f0f0;
      width: 299px;
      height: 1px;
    }
    &.detail {
      margin-top: 0px;
    }
    .detail_wrapper {
      margin-top: 5px;
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
  .transaction_history_wrapper {
    display: flex;
    margin-top: 14px;
    align-items: end;
    .title {
      margin-left: 24px;
      width: 150px;
      height: 20px;
      flex-direction: column;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #eff5f7;
    box-shadow: inset 0px 21px 17px -19px rgba(0, 0, 0, 0.05);
    position: absolute;
    width: 375px;
    height: 180px;
    bottom: 100px;
    justify-content: center;
    &.others {
      height: 265px;
    }
    .token_detail_wrapper {
      overflow-y: scroll ;
      flex-direction: column;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .token_detail_list_nothing_wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &.aergo {
          margin-bottom: 10px;
        }
        &.others {
          margin-bottom: 50px;
        }
        .nothing_text {
          /* Caption/C1 */
          margin-top: 18.5px;
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
      }
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
    }
    .footer {
      position: relative;
      top: 60px;
      &.aergo {
        top: 40px;
      }
    }
  }
}
.select {
  margin-left: 98px;
  background: #ffffff;
  /* Grey/02 */
  width: 80px;
  height: 28px;
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
