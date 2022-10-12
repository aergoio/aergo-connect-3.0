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
              <div class="circle" />
              {{ $store.state.accounts.network }}
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
          <div class="title">Amount</div>
          <div class="flex-row">
            <div class="detail amount">{{ amount }}</div>
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

        <div class="flex-row">
          <div class="title">Payload</div>
          <div class="flex-row">
            <div class="detail payload">{{ payload }}</div>
          </div>
        </div>
      </div>
      <ButtonGroup vertical class="button_wrapper">
        <Button size="medium" type="primary" @click="handleOk">OK</Button>
        <Button size="medium" type="primary-outline" @click="handleCancel">Cancel</Button>
      </ButtonGroup>
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
    amount: Number,
    to: String,
    symbol: String,
    txType: String,
    payload: String,
  },

  methods: {
    handleOk() {
      console.log('ok', this.to);
      this.$emit('confirm');
    },
    handleCancel() {
      console.log('cancel');
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
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
  .confirmation_modal_wrapper {
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
      height: 200px;
      margin-top: 18px;
      width: 290px;
      overflow-y: scroll;
      overflow-x: hidden;
      .flex-row {
        display: flex;
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
            width: 178px;
            /* overflow-y:scroll; */
            overflow-x: hidden;
            word-break: break-all;
            text-align: left;
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
            width: 178px;
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
      margin-top: 15px;
      .button {
        width: 289px;
      }
    }
  }
}
</style>
