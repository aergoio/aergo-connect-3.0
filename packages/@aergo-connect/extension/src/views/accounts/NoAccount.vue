<template>
  <div class="noAccount_backdrop">
    <div class="noAccount_modal_wrapper">
      <Icon name="warning" :size="100" />
      <div class="noAccount_text">
        <span class="highlight">No Accounts </span>
        <span>resgistered on this wallet. Would you like to add an Account?</span>
      </div>
      <ButtonGroup class="button_wrapper" vertical>
        <ButtonVue type="secondary" size="medium" :to="{ name: 'register' }">Add Account</ButtonVue>
        <ButtonVue type="secondary-outline" size="medium" @click="handleCancel">Cancel</ButtonVue>
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
  methods: {
    handleCancel() {
      this.$emit('click');
    },
  },
});
</script>

<style lang="scss">
.noAccount_backdrop {
  width: 375px;
  height: 700px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.3);
  .noAccount_modal_wrapper {
    position: absolute;
    width: 317px;
    height: 400px;
    left: 32px;
    top: 100px;

    background: #ffffff;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .noAccount_text {
      width: 259px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      text-align: center;
      letter-spacing: -0.333333px;

      .highlight {
        color: #e4097d;
      }
    }

    .button_wrapper {
      margin-top: 33px;
    }
  }
}
</style>
