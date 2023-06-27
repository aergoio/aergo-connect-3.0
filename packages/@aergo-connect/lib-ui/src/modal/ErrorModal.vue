<template>
  <div class="error-modal_backdrop">
    <div class="error-modal_wrapper">
      <Icon :name="`warning`" :size="100" />
      <div class="error-modal_text">
        <!-- <span class="highlight">No Accounts </span> -->
        <span class="highlight">{{ errorMessage }}</span>
      </div>
      <ButtonGroup class="button_wrapper" horizontal>
        <ButtonVue type="secondary" hover size="small" @click="handleRefresh">Refresh</ButtonVue>
        <ButtonVue type="secondary-outline" hover size="small" @click="handleCancel"
          >Cancel</ButtonVue
        >
      </ButtonGroup>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import ButtonGroup from '@aergo-connect/lib-ui/src/buttons/ButtonGroup.vue';
import ButtonVue from '@aergo-connect/lib-ui/src/buttons/Button.vue';
export default Vue.extend({
  components: { Icon, ButtonGroup, ButtonVue },
  props: {
    errorMessage: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleRefresh() {
      this.$emit('refresh');
    },
    handleCancel() {
      this.$emit('cancel', 'errorModal');
    },
  },
});
</script>

<style lang="scss">
.error-modal_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  .error-modal_wrapper {
    width: 317px;
    height: 294px;
    position: absolute;
    left: 28px;
    top: 170px;
    background: #ffffff;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .error-modal_text {
      width: 259px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 17px;
      line-height: 25px;
      text-align: center;
      letter-spacing: -0.333333px;
      margin-top: 20px;

      .highlight {
        color: #e4097d;
      }
    }

    .button_wrapper {
      margin-top: 53px;
      width: 300px;
      .button {
        width: 289px;
      }
      /* .add_account:hover {
          background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
        } */
      /* .cancel:hover {
          border: 2px solid transparent;
          border-radius: 4px;
          border-image: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
          border-image-slice: 1;
          background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        } */
    }
  }
}
</style>
