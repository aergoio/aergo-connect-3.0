<template>
  <div class="password_backdrop">
    <div class="password_modal_wrapper">
      <Icon :name="`password`" />
      <div class="password_title">Confirm your password.</div>
      <PasswordStrengthField
        class="password_textField"
        v-model="password"
        :error="errors.password"
        :state="errors.password ? `invalid` : `default`"
        @submit="handlePassword"
      />
      <ButtonGroup class="button_wrapper" vertical>
        <ButtonVue type="primary-outline" size="medium" @click="handlePassword">Confirm</ButtonVue>
        <ButtonVue type="primary-outline" size="medium" @click="handleCancel">Cancel</ButtonVue>
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
import PasswordStrengthField from '@aergo-connect/lib-ui/src/forms/PasswordStrengthField.vue';
export default Vue.extend({
  components: { Icon, ButtonGroup, ButtonVue, TextField, PasswordStrengthField },
  data() {
    return {
      password: '',
      errors: {
        password: '',
      },
    };
  },
  /*
  computed: {
    async disabled() {
      try {
        await this.$background.unlock({ password: this.password });
        this.errors.password = `ok`;
        return true ;
        
      } catch (e) {
        this.errors.password = `${e}`;
        return true ;
      }
    },
  },
*/
  methods: {
    handleCancel() {
      this.$emit('cancel', 'passwordModal');
    },
    async handlePassword() {
      try {
        await this.$background.unlock({ password: this.password });
        this.$emit('confirm', 'passwordModal');
      } catch (e) {
        this.errors.password = `${e}`;
      }
    },
  },
});
</script>

<style lang="scss">
.password_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2;
  .password_modal_wrapper {
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
    .password_title {
      width: 275px;
      /* Headline/H2 */

      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 30px;
      text-align: center;
      letter-spacing: -0.333333px;

      /* Grey/08 */

      color: #231f20;
    }

    .password_textField {
      margin-top: 20px;
      width: 213px;
      height: 48px;
      .input-field {
        width: 274px;
      }
    }

    .password_text {
      width: 274px;
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
      margin-left: 7px;
      .button {
        width: 280px;
      }
      .button:hover {
        background: #279ecc;
        color: #ffffff;
      }
    }
  }
}
</style>
