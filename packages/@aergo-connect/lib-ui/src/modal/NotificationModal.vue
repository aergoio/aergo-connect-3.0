<template>
  <div class="notification_backdrop">
    <div class="notification_modal_wrapper">
      <Icon :name="`warning`" :size="100" />
      <div class="notification_text">Need to backup private key</div>
      <ButtonGroup class="button_wrapper" vertical>
        <ButtonVue type="secondary" size="medium" hover @click="handleCancel">BACK</ButtonVue>
      </ButtonGroup>
    </div>
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

  methods: {
    handleCancel() {
      this.$emit('cancel', 'notificationModal');
    },
  },
});
</script>

<style lang="scss">
.notification_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  .notification_modal_wrapper {
    width: 317px;
    height: 300px;
    position: absolute;
    left: 28px;
    top: 110px;
    background: #ffffff;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .notification_title {
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
    .notification_text {
      /* Headline/H2 */

      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
      line-height: 30px;
      text-align: center;
      letter-spacing: -0.333333px;

      /* Primary/Pink01 */

      color: #e4097d;

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
