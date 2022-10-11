<template>
  <ScrollView>
    <Header button="back" title="Change Password" @backClick="handleBack" />
    <div class="changepassword_content">
      <div class="newpassword_wrapper">
        <PasswordStrengthField :label="`New Password`" />
      </div>
      <div class="confirmpassword_wrapper">
        <PasswordStrengthField :label="`Confirm Password`" />
      </div>
    </div>
    <template #footer>
      <Button type="primary" size="large">OK</Button>
    </template>
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import PasswordStrengthField from '@aergo-connect/lib-ui/src/forms/PasswordStrengthField.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
export default Vue.extend({
  components: { ScrollView, Header, PasswordStrengthField, Button },
  methods: {
    handleBack() {
      this.$router
        .push({
          name: 'security-2',
        })
        .catch(() => {});
    },
  },
});
</script>

<style lang="scss">
.changepassword_content {
  margin-top: 96px;
}
.confirmpassword_wrapper {
  margin-top: 72px;
}
</style>
