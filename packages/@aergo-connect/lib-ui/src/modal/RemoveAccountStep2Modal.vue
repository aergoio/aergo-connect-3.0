<template>
  <div className="removeAccount_backdrop">
    <div class="removeAccount_modal_wrapper">
      <Icon :name="`warning2`" />
      <div class="removeAccount_title">Type 'delete' to confirm deleting this account.</div>
      <input type="text" v-model="value" />
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
export default Vue.extend({
  components: { Icon, ButtonGroup, ButtonVue },
  data() {
    return {
      value: '',
      disabled: false,
    };
  },
  watch: {
    value() {
      if (this.value === 'delete') {
        this.disabled = true;
      }
    },
  },
  methods: {
    handleCancel() {
      this.$emit('click', 'removeAccountModal');
    },
    async handleDeleteAccount() {
      const nativeCheck = confirm(
        `Are you really sure you want to remove the account ${this.$route.params.address} from this wallet?`,
      );
      if (!nativeCheck) return;
      await this.$background.removeAccount({
        chainId: this.$route.params.chainId,
        address: this.$route.params.address,
      });
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
