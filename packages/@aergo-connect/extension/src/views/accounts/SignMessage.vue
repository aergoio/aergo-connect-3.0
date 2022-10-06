<template>
  <ScrollView>
    <Header button="back" title="Sign Message" @backClick="handleBack" />
    <div class="sign_content">
      <div class="sign_title">Enter Your message</div>
      <div>
        <div class="sign_message_text">Sign Message</div>
        <TextArea class="textarea_size" />
        <div class="sign_message_confirm">
          <CheckboxButton />
          <div class="sign_message_hash_text">This is a message hash</div>
          <Button type="primary-outline" class="button_size">OK</Button>
        </div>
      </div>
      <div class="hash_result">
        <TextArea class="textarea_size" />
        <Button class="copy_button" type="primary-outline">Copy</Button>
      </div>
    </div>
    <template #footer>
      <Button type="primary" size="large">OK</Button>
    </template>
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import TextArea from '@aergo-connect/lib-ui/src/forms/TextArea.vue';
import CheckboxButton from '@aergo-connect/lib-ui/src/buttons/CheckboxButton.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
export default Vue.extend({
  components: { Header, ScrollView, TextArea, CheckboxButton, Button },
  computed: {
    accountSpec() {
      return {
        address: this.$route.params.address,
        chainId: this.$route.params.chainId,
      };
    },
  },
  methods: {
    handleBack() {
      this.$router
        .push({
          name: 'accounts-list',
          params: { ...this.accountSpec, nick: this.$route.params.nick },
        })
        .catch(() => {});
    },
  },
});
</script>

<style lang="scss">
.sign_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .sign_title {
    margin-top: 46px;
    margin-bottom: 35px;
    width: 318px;
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: -0.333333px;

    color: #231f20;
  }
  .sign_message_text {
    width: 93px;
    margin-bottom: 10px;
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.333333px;

    /* Grey/07 */

    color: #454344;
  }
  .textarea_size {
    width: 327px;
    height: 80px;
  }
  .sign_message_confirm {
    display: flex;
    align-items: center;
    .sign_message_hash_text {
      margin-left: 4px;
      margin-right: 71px;
      width: 143px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 19px;
      /* identical to box height */

      letter-spacing: -0.333333px;

      /* Grey/06 */

      color: #686767;
    }
    .button_size {
      margin-top: 10px;
      width: 89px;
      height: 30px;
    }
  }
  .hash_result {
    margin-top: 35.5px;
    .textarea_size {
      height: 102px;
    }
    .copy_button {
      float: right;
      width: 34px;
      height: 19px;
      margin-right: 6px;
      margin-top: 6px;
    }
  }
}
</style>
