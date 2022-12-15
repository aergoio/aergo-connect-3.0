<template>
  <div class="options_modal_backdrop" @click="hideModal">
    <div class="options_modal_wrapper">
      <div class="title">Optional Fields</div>
      <div class="flex-column">
        <div class="title">Type</div>
        <!-- <select class="select_box" v-model="iTxType">
          <option :key="type" v-for="type in $store.state.ui.txTypes" :value="type">
            {{ type }}
          </option>
        </select> -->
        <div class="select_box" @click="handleSelectTxType" v-click-outside="hide">
          <div class="text">{{ iTxType }}</div>
          <Icon :name="select ? `dropupblue` : `dropdownblue`" />
        </div>
      </div>
      <ul v-if="select" class="list_wrapper">
        <li
          class="list"
          v-for="txType in $store.state.ui.txTypes"
          :key="txType"
          @click="selectTxType(txType)"
        >
          {{ txType }}
        </li>
      </ul>
      <div class="flex-column">
        <div class="title data">Data (payload)</div>
        <input v-model="iPayload" type="text" class="text_box" />
      </div>
      <Button size="medium" type="primary" class="button" @click="handleOk" hover>OK</Button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Button from '../buttons/Button.vue';
import Icon from '../icons/Icon.vue';
import { Tx } from '@herajs/client';

export default Vue.extend({
  components: { Button, Icon },
  props: {
    payload: String,
    txType: String,
  },
  data() {
    return {
      select: false,
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
    },
    selectTxType(txType) {
      this.iTxType = txType;
      this.select = false;
    },
    handleSelectTxType() {
      this.select = !this.select;
    },
    hide() {
      this.select = false;
    },
    hideModal(event) {
      // event.stopPropagation();
      if (event.eventPhase === 2) {
        this.$emit('closeOptionsModal');
      }
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
  background: rgba(0, 0, 0, 0.6);
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
        display: flex;
        justify-content: space-between;
        padding: 8px;
        border-radius: 3px;
        /* White */
        background: #ffffff;
        /* Primary/Blue01 */
        border: 1px solid #279ecc;
        border-radius: 4px;

        margin-top: 9px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 17px;
        line-height: 21px;

        color: #454344;
        .text {
          cursor: default;
          margin-left: 3px;
        }
      }

      .text_box {
        margin-top: 14px;
        height: 89px;

        /* White */

        background: #ffffff;
        /* Primary/Blue01 */

        border: 1px solid #279ecc;
        border-radius: 4px;
        white-space: pre;
      }
    }
    .button {
      margin-top: 76px;
    }
  }

  .list_wrapper {
    cursor: pointer;
    height: 172px;
    position: absolute;
    bottom: 116px;
    width: 261px;
    border-radius: 3px;
    border: 1px solid #279ecc;
    overflow-y: scroll;
    overflow-x: hidden;
    .list {
      padding-left: 10px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      cursor: pointer;
      height: 43px;
      background: #ffffff;
      border-radius: 3px;
      font-size: 16px;
      font-weight: 500;
    }
    .list:hover {
      background: #f6f6f6;
    }
  }
}
</style>
