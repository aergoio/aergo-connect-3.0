<template>
  <div class="sendfinish_modal_backdrop">
    <div class="sendfinish_modal_wrapper">
      <div class="flex-column">
        <Icon :name="`confirmation`" />
        <div class="title">Transaction Sent!</div>
      </div>
      <div class="detail_form">
        <div class="flex-row">
          <div class="title">Network</div>
          <div class="flex-row network">
            <div class="detail network">
              <div class="circle" />
              {{ $store.state.accounts.network }}
            </div>
          </div>
        </div>
        <div class="line" />
        <div class="flex-row">
          <div class="title">Hash</div>
          <div class="flex-row">
            <a 
              class="detail address"
              :href="`https://${$store.state.accounts.network}.aergoscan.io/transaction/${txHash}`"
              target="blank"
            >
              {{ txHash }}
            </a>
          </div>
        </div>
        <div class="line" />
        <div class="flex-row">
          <div class="title">Recipient</div>
          <div class="flex-row">
            <div class="detail address">{{ receipt }}</div>
          </div>
        </div>
        <div class="line" />
        <div class="flex-row">
          <div class="title">Amount</div>
          <div class="flex-row">
            <div class="detail amount">{{ amount }}</div>
            <div class="detail amount">{{ symbol }}</div>
          </div>
        </div>
        <div class="line" />
        <div v-if="txReceipt" class="flex-row">
          <div class="title">Fee</div>
          <div class="detail fee">{{ txReceipt.fee }}</div>
        </div>
        <div v-else class="flex-row">
          <div class="title">Status</div>
          <div class="detail fee"> No Receipt </div>
        </div>
        <div class="line" />
        <div class="flex-row">
          <div class="title balance">Update Balance</div>
          <div v-if="asset === 'AERGO'" class="detail balance"> {{ $store.state.session.aergoBalance }} </div>
          <div v-else class="detail balance"> {{ $store.state.session.tokens[asset].balance }} </div>
        </div>
        <div class="line" />
      </div>
      <Button size="medium" type="primary" @click="handleOk">OK</Button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Icon from '../icons/Icon.vue';
import ButtonGroup from '../buttons/ButtonGroup.vue';
import Button from '../buttons/Button.vue';
export default Vue.extend({
  components: { Icon, Button, ButtonGroup },

  props: {
    txHash: String,
    receipt: String,
    amount: Number,
    symbol: String,
    asset: String,
  },

  data() {
    return {
      txReceipt: null,
      txData: null,
    }
  },

  async mounted() {
    console.log("txHash", this.txHash) ;
    console.log("network", this.$store.state.accounts.network) ;
    console.log("asset", this.asset) ;
    await this.$store.dispatch('accounts/updateAccount', { 
      chainId: this.$store.state.accounts.network,
      address: this.$store.state.accounts.address,
    }) ;

    this.$store.commit('ui/clearInput', { key: 'send' });
    await this.$background
      .getTransactionReceipt(this.$store.state.accounts.network, this.txHash)
      .then(result => {
        this.txReceipt = result;
      });
/*
    await this.$background
      .getTransaction(this.$store.state.accounts.network, this.txHash)
      .then(result => {
        this.txData = result.tx;
        this.txData.payload = Buffer.from(Object.values(this.txData.payload)).toString();
      });
*/

    await this.$store.dispatch('session/updateBalances') ;
    console.log("receipt", this.txReceipt) ;
  },

  methods: {
    handleOk() {
      console.log('ok', this.to);
      this.$emit('close');
    },
  },
  
});
</script>

<style lang="scss">
.sendfinish_modal_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
  .sendfinish_modal_wrapper {
    position: absolute;
    width: 313px;
    height: 435px;
    left: 31px;
    top: 83px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .flex-column {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon {
        height: 35px;
      }
      .title {
        margin-top: 6px;
        /* Headline/H3 */

        font-family: 'Outfit';
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 25px;
        text-align: center;
        letter-spacing: -0.333333px;

        /* Grey/08 */

        color: #231f20;
      }
    }
    .detail_form {
      height: 260px;
      margin-top: 18px;
      width: 280px;
      .flex-row {
        display: flex;
        justify-content: space-between;
        &.network {
          align-items: center;
        }
        .circle {
          /* Primary/Pink01 */
          align-items: center;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #e4097d;
          margin-right: 4px;
        }
        .title {
          &.balance {
            width: 200px;
          }
        }
        .detail {
          width: 178px;
          margin-left: 35px;
          margin-top: 4px;
          margin-right: 6px;
          text-align: right;
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 300;
          font-size: 14px;
          line-height: 18px;
          /* identical to box height */

          letter-spacing: -0.333333px;
          justify-content: flex-end;
          /* Grey/06 */

          color: #686767;
          &.payload {
            width: 178px;
            word-break: break-all;
            text-align: left;
          }
          &.balance {
            margin-right: 6px;
          }
          &.network {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 175px;
          }
          &.address {
            margin-left: 28px;
            width: 178px;
            text-align: right;
            word-break: break-all;
          }
          &.amount {
            width: 178px;
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;

            letter-spacing: -0.333333px;

            color: #454344;
          }
          &.fee {
          }
        }
      }
      .title {
        margin-top: 4px;
      }
      .line {
        margin-top: 4px;
        /* Grey/01 */
        width: 265px;
        border: 1px solid #f0f0f0;
      }
    }
    .button_wrapper {
      margin-top: 15px;
    }
  }
}
</style>
