<template>
  <ScrollView>
    <Header button="back" title="Security" @backClick="handleBack" />
    <div class="security_content">
      <div class="security_header">Confirm your password</div>
      <div class="password_wrapper">
        <div class="password_title">Password</div>
        <PasswordStrengthField />
      </div>
    </div>
    <template #footer>
      <Button type="primary" size="large" @click="handleGoStep2">Confirm</Button>
    </template>
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import PasswordStrengthField from '@aergo-connect/lib-ui/src/forms/PasswordStrengthField.vue';
import { encodePrivateKey } from '@herajs/crypto';
import { debounce } from 'lodash';
export default Vue.extend({
  components: { Header, ScrollView, Button, PasswordStrengthField },
  data() {
    return {
      hashedPassword: '',
    };
  },
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
    handleGoStep2() {
      console.log(window.indexedDB);
      this.$router
        .push({
          name: 'security-2',
        })
        .catch(() => {});
    },
  },
  async mounted() {
    // const request = indexedDB.open('data');
    // request.onsuccess = (e) => {
    //   const database = e.target.result;
    //   const transaction = database.transaction(['settings']);
    //   const objectStore = transaction.objectStore('settings');
    //   // const index = objectStore.index('key');
    //   const request = objectStore.get('encryptedId');
    //   request.onsuccess = async (e) => {
    //     console.log(e.target.result);
    //     this.hashedPassword = encodePrivateKey(e.target.result.data.value);
    //     const key = await this.$background.getKey({ account: this.hashedPassword });
    //     console.log(key, 'key');
    //   };
    //   request.onerror = (e) => {
    //     console.error(e.target.result);
    //   };
    // };
  },
});
</script>

<style lang="scss">
.security_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .security_header {
    margin-top: 46px;
    width: 318px;
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: -0.333333px;

    /* Grey/08 */

    color: #231f20;
  }
  .password_wrapper {
    width: 318px;
    margin-top: 75px;
    .password_title {
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.333333px;

      /* Grey/07 */

      color: #454344;
    }
    .input-field {
      width: 327px;
    }
  }
}
</style>
