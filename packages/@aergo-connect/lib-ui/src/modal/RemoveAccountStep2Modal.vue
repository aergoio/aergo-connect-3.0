<template>
  <div className="removeAccount_backdrop">
    <div class="removeAccount_modal2_wrapper">
      <Icon :name="`warning2`" />
      <div class="removeAccount_title">
        {{ `Type '${$store.state.accounts.nick}' to confirm deleting this account.` }}
      </div>
      <div class="removeAccount_textField">
        <TextField type="text" v-model="value" @submit="handleDeleteAccount" />
      </div>
      <ButtonGroup class="button_wrapper" vertical>
        <ButtonVue type="secondary" size="medium" :disabled="!disabled" @click="handleDeleteAccount"
          >Confirm</ButtonVue
        >
        <ButtonVue type="secondary-outline" hover size="medium-outline" @click="handleCancel"
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
import TextField from '@aergo-connect/lib-ui/src/forms/TextField.vue';
export default Vue.extend({
  components: { Icon, ButtonGroup, ButtonVue, TextField },
  data() {
    return {
      value: '',
    };
  },
  computed: {
    disabled() {
      if (this.value === this.$store.state.accounts.nick) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    handleCancel() {
      this.$emit('cancel', 'removeAccountModal');
    },

    async handleDeleteAccount() {
      await this.$store.dispatch('accounts/removeAccount', this.$store.state.accounts.address);
      this.$router.push({ name: 'accounts-list' });
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
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  .removeAccount_modal2_wrapper {
    width: 317px;
    height: 360px;
    position: absolute;
    left: 28px;
    top: 110px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon_size {
      border: solid;
      width: 31px;
      height: 28.36px;
    }
    .removeAccount_title {
      width: 255px;
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
    .removeAccount_textField {
      width: 270px;
      margin-top: 10px;
      height: 48px;
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
      .button-type-secondary:hover:not([disabled]) {
        background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
      }
      .button {
        width: 270px;
      }
    }
  }
}
</style>
