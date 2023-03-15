<template>
  <div class="confirmation_modal_backdrop">
    <div class="confirmation_modal_wrapper">
      <div class="flex-column">
        <Icon :name="`confirmation`" />
        <div class="title">Confirmation</div>
      </div>
      <div class="detail_form">
        <div class="flex-row">
          <div class="title">Network</div>
          <div class="flex-row network">
            <div class="detail network">
              <div :class="`circle ${$store.state.accounts.network}`" />
              {{ `AERGO ${$store.state.accounts.network.toUpperCase()}` }}
            </div>
          </div>
        </div>
        <div class="line" />
        <div class="flex-row">
          <div class="title">Recipient</div>
          <div class="flex-row">
            <div class="detail address">{{ to }}</div>
          </div>
        </div>
        <div class="line" />

        <div class="flex-row">
          <div v-if="tokenType !== 'ARC2'" class="title">Amount</div>
          <div v-else class="title">Token_ID</div>
          <div class="flex-row">
            <div v-if="tokenType !== 'ARC2'" class="detail amount">
              {{ amount + '  ' + symbol }}
            </div>
            <div v-else class="detail amount">{{ amount }}</div>
          </div>
        </div>
        <div class="line" />

        <div class="flex-row">
          <div class="title">Type</div>
          <div class="flex-row">
            <div class="detail type">{{ txType }}</div>
          </div>
        </div>
        <div class="line" />

        <div class="flex-row">
          <div class="title gas">Gas Limit</div>
          <div class="flex-row">
            <div class="detail gas">0</div>
          </div>
        </div>
        <div class="line" />

        <div class="flex-row payload-wrapper">
          <div class="title">Payload</div>
          <div class="flex-row payload">
            <div class="detail payload" v-html="formattedPayload"></div>
          </div>
        </div>
      </div>
      <ButtonGroup vertical class="button_wrapper">
        <Button size="medium" type="primary" @click="handleOk" hover>OK</Button>
        <Button size="medium" type="primary-outline" @click="handleCancel" hover
          ><span>Cancel</span></Button
        >
      </ButtonGroup>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Icon from '../icons/Icon.vue';
import ButtonGroup from '../buttons/ButtonGroup.vue';
import Button from '../buttons/Button.vue';

import { jsonHighlight } from '@aergo-connect/extension/src/utils/json';
export default Vue.extend({
  components: { Icon, Button, ButtonGroup },

  props: {
    amount: String,
    to: String,
    symbol: String,
    txType: String,
    payload: String,
    tokenType: String,
  },
  computed: {
    formattedPayload() {
      const payload = `${this.payload}`;
      try {
        JSON.parse(payload);
        return jsonHighlight(payload);
      } catch {
        return `<span class="string">${payload}</span>`;
      }
    },
  },
  methods: {
    handleOk() {
      this.$emit('confirm');
    },
    handleCancel() {
      this.$emit('cancel');
    },
  },
});
</script>

<style lang="scss">
.confirmation_modal_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2;
  .confirmation_modal_wrapper {
    position: absolute;
    max-height: 510px;
    left: 20px;
    top: 50px;
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
      max-height: 300px;
      margin-top: 10px;
      width: auto;
      overflow-y: auto;
      overflow-x: hidden;
      .flex-row {
        display: flex;
        justify-content: center;
        &.payload-wrapper {
          margin-left: 24px;
          max-width: 265px;
        }
        &.network {
          align-items: center;
        }
        .circle {
          /* Primary/Pink01 */
          align-items: center;
          width: 4px;
          height: 4px;
          border-radius: 50%;
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
        .title {
          &.gas {
            width: 65px;
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 19px;

            letter-spacing: -0.333333px;

            color: #454344;
          }
        }
        .detail {
          width: 178px;
          margin-left: 35px;
          margin-top: 4px;
          text-align: right;
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 300;
          font-size: 14px;
          line-height: 18px;
          /* identical to box height */

          letter-spacing: -0.333333px;

          /* Grey/06 */

          color: #686767;
          &.payload {
            width: 200px;
            overflow-x: hidden;
            word-break: break-all;
            text-align: left;
            font-family: monospace;
            white-space: pre-wrap;
            color: #777;

            .string,
            .boolean,
            .number,
            .null {
              font-weight: 500;
            }
            .key {
              color: #0082c7;
            }
            .string {
              color: #000;
            }
            .boolean,
            .number,
            .null {
              color: #259603;
            }
          }
          &.gas {
            width: 168px;
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
            /* max-width: 170px; */
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;

            letter-spacing: -0.333333px;

            color: #454344;
          }
          &.type {
            margin-left: 56px;
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
      margin-top: 10px;
      margin-bottom: 20px;

      .button {
        width: 289px;
      }
    }
  }
}
</style>
