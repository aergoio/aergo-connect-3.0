<template>
  <div class="options_modal_backdrop">
    <div class="options_modal_wrapper">
      <div class="title">Optional Fields</div>
      <div class="flex-column">
        <div class="title">Type</div>
        <select class="select_box" v-model="iTxType">
          <option v-for="type in $store.state.ui.txTypes" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
      <div class="flex-column">
        <div class="title data">Data (payload)</div>
        <input v-model="iPayload" type="text" class="text_box" />
      </div>
      <Button size="medium" type="primary" class="button" @click="handleOk">OK</Button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Button from '../buttons/Button.vue';
import { Tx } from '@herajs/client';

export default Vue.extend({
  components: { Button },
  props: {
    payload: String,
    txType: String,
  },
  data() {
    return {
      iPayload: '',
      iTxType: '',
    };
  },

  beforeMount() {
    this.iPayload = this.payload;
    this.iTxType = this.txType;
  },
  methods: {
    handleOk() {
      this.$emit('updateTx', this.iTxType, this.iPayload);
      console.log('ok');
    },
  },
});
</script>

<style lang="scss">
.options_modal_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
  .options_modal_wrapper {
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
    .title {
      margin-top: 26px;

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

    .flex-column {
      display: flex;
      flex-direction: column;
      width: 265px;
      .title {
        width: 37px;
        height: 21px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 17px;
        line-height: 21px;

        /* Grey/06 */

        color: #686767;
        &.data {
          width: 114px;
        }
      }

      .select_box {
        /* White */

        background: #ffffff;
        /* Primary/Blue01 */

        border: 1px solid #279ecc;
        border-radius: 4px;
        margin-top: 9px;
        height: 40px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 17px;
        line-height: 21px;

        /* Grey/06 */

        color: #454344;
      }
      .text_box {
        margin-top: 14px;
        width: 265px;
        height: 89px;

        /* White */

        background: #ffffff;
        /* Primary/Blue01 */

        border: 1px solid #279ecc;
        border-radius: 4px;
      }
    }
    .button {
      margin-top: 76px;
    }
  }
}
</style>
