<template>
  <div className="removeAccount_backdrop">
    <div class="removeAccount_modal_wrapper">
      <Icon :name="`warning2`" />
      <div class="removeAccount_title">Type 'delete' to confirm deleting this account.</div>
      <div class="removeAccount_textField">
        <TextField type="text" v-model="value" />
      </div>
      <ButtonGroup class="button_wrapper" vertical>
        <ButtonVue
          type="secondary"
          size="medium"
          hover
          :disabled="!disabled"
          @click="handleDeleteAccount"
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
      if (this.value === 'delete') {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    handleCancel() {
      this.$emit('cancel');
    },
    async handleDeleteAccount() {
      const nativeCheck = confirm(
        `Are you really sure you want to remove the account ${this.$store.state.accounts.address} from this wallet?`,
      );
      if (!nativeCheck) return;
      await this.$store.dispatch('accounts/removeAccount') ;
      this.$emit('cancel');
      this.$router.push({ 
        name: 'accounts-list-address', 
        params: { 
          address: this.$store.state.accounts.address, 
        }
      });
    }
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
      margin-top: 20px;
      width: 213px;
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
      margin-top: 53px;
    }
  }
}
</style>
