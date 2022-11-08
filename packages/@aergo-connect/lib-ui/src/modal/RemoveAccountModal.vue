<template>
  <div class="removeAccount_backdrop">
    <div class="removeAccount_modal_wrapper" v-if="!isNext">
      <Icon :name="`warning`" :size="100" />
      <div class="removeAccount_title">Remove the current account?</div>
      <div class="removeAccount_text">
        This will remove access to this account in this wallet. Make sure you have a backup or do
        not need this account anymore.
      </div>
      <ButtonGroup class="button_wrapper" vertical>
        <ButtonVue type="secondary" size="medium" hover @click="handleGoNext" @cancel="handleCancel"
          >Confirm</ButtonVue
        >
        <ButtonVue type="secondary-outline" hover size="medium-outline" @click="handleCancel"
          >Cancel</ButtonVue
        >
      </ButtonGroup>
    </div>
    <RemoveAccountStep2Modal v-if="isNext" @cancel="handleCancel" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import ButtonGroup from '@aergo-connect/lib-ui/src/buttons/ButtonGroup.vue';
import ButtonVue from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import RemoveAccountStep2Modal from './RemoveAccountStep2Modal.vue';
export default Vue.extend({
  components: { Icon, ButtonGroup, ButtonVue, RemoveAccountStep2Modal },
  data() {
    return {
      isNext: false,
    };
  },

  methods: {
    handleCancel() {
      this.$emit('cancel', 'removeAccountModal');
    },
    handleGoNext() {
      this.isNext = true;
    },
  },
});
</script>

<style lang="scss">
.removeAccount_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  .removeAccount_modal_wrapper {
    width: 317px;
    height: 400px;
    position: absolute;
    left: 28px;
    top: 110px;
    background: #ffffff;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .removeAccount_title {
      margin-bottom: 17px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      text-align: center;
      letter-spacing: -0.333333px;

      /* Primary/Pink01 */

      color: #e4097d;
    }
    .removeAccount_text {
      width: 259px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      text-align: center;
      letter-spacing: -0.333333px;

      /* Grey/07 */

      color: #454344;

      .highlight {
        color: #e4097d;
      }
    }

    .button_wrapper {
      margin-top: 33px;
      .button {
        width: 289px;
      }
    }
  }
}
</style>
