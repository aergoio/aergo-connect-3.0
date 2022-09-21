<template>
  <div class="noAccount_backdrop">
    <b-modal class="noAccount_modal_wrapper">
      <Icon name="warning" :size="100" class="noAccount_icon" />
      <div class="noAccount_text">
        <span class="highlight">No Accounts </span>
        <span>resgistered on this wallet. Would you like to add an Account?</span>
      </div>
      <ButtonGroup vertical class="buttonGroup-position">
        <ButtonVue type="secondary" size="medium" hover :to="{ name: 'register' }">
          Add Account
        </ButtonVue>
        <ButtonVue
          type="secondary-outline"
          hover
          size="medium-outline
          @click="handleCancel"
        >
          Cancel
        </ButtonVue>
      </ButtonGroup>
    </b-modal>
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
  height: 600px;
  position: absolute;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.3);
}
.noAccount_modal_wrapper {
  width: 317px;
  height: 400px;
  position: absolute;
  left: 29px;
  top: 100px;
  background: #ffffff;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;

  .noAccount_icon {
    margin-top: 30px;
  }
  .noAccount_text {
    width: 259px;
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 25px;
    text-align: center;
    letter-spacing: -0.333333px;
    margin-top: 20px;

    .highlight {
      color: #e4097d;
    }
  }
  .buttonGroup-position {
    top: 280px;
  }
}
</style>
