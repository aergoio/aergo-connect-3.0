<template>
  <ScrollView>
    <RemoveAccountModal v-if="removeAccountModal" @cancel="handleCancel" />
    <NotificationModal v-if="notificationModal" @cancel="handleCancel" />
    <Header button="back" title="Security" @backClick="handleBack" />
    <div class="security2_content">
      <div class="security2_autolock_wrapper">
        <div class="title">Auto Lock Timeout</div>
        <div class="flex-row">
          <div class="description">Set the amount of time before the screen locks.</div>
          <select class="select" @change="handleIdleTimeout" v-model="idleTimeout">
            <option :value="300">5 minutes</option>
            <option :value="600">10 minutes</option>
            <option :value="900">15 minutes</option>
            <option :value="1800">30 minutes</option>
            <option :value="3600">60 minutes</option>
          </select>
        </div>
      </div>
      <div class="security2_password_wrapper">
        <div class="title">Password</div>
        <div class="description">
          This password is used to unlock your wallet and send assets only on this device.
        </div>
        <Button type="primary" size="large" @click="handleChangePassword" hover
          >Change Password</Button
        >
      </div>
      <div class="security2_backup_wrapper">
        <div class="title">Backup Private Key</div>
        <div class="description">Protect your accounts by saving your private key.</div>
        <Button
          type="primary"
          size="large"
          @click="handleBackupPrivateKey"
          :hover="account?.data?.type === ''"
          :disabled="account?.data?.type === 'ledger'"
          >Backup Private Key</Button
        >
      </div>
      <div class="security2_backup_wrapper">
        <div class="title">Remove Account</div>
        <div class="description">This will remove access to this account in this wallet.</div>
        <Button
          type="primary"
          size="large"
          @click="
            [
              $store.state.accounts.accounts[$store.state.accounts.address].backup ||
              account?.data.type === 'ledger'
                ? handleRemoveModal()
                : handleAlert(),
            ]
          "
          hover
          >Remove Account</Button
        >
      </div>
    </div>
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import PasswordStrengthField from '@aergo-connect/lib-ui/src/forms/PasswordStrengthField.vue';
import RemoveAccountModal from '@aergo-connect/lib-ui/src/modal/RemoveAccountModal.vue';
import NotificationModal from '@aergo-connect/lib-ui/src/modal/NotificationModal.vue';

export default Vue.extend({
  components: {
    Header,
    ScrollView,
    Button,
    PasswordStrengthField,
    RemoveAccountModal,
    NotificationModal,
  },
  data() {
    return {
      idleTimeout: this.$store.state.ui.idleTimeout,
      removeAccountModal: false,
      notificationModal: false,
      account: {},
    };
  },
  created() {
    this.$store.dispatch('accounts/updateAccount', this.accountSpec);
  },
  async beforeMount() {
    // this.account = await this.$background.getActiveAccount();
    const address = this.$store.state.accounts.address;
    const chainId = this.$store.state.accounts.chainId;
    this.account =
      (await this.$background.getActiveAccount()) ||
      (await this.$background.setActiveAccount({ address, chainId }));
  },

  computed: {
    accountSpec() {
      return {
        address: this.$store.state.accounts.address,
        chainId: this.$store.state.accounts.chainId,
      };
    },
  },

  methods: {
    handleIdleTimeout() {
      this.$store.commit('ui/setIdleTimeout', this.idleTimeout);
      chrome.idle.setDetectionInterval(this.idleTimeout);
    },
    handleBack() {
      this.$router
        .push({
          name: 'accounts-list',
        })
        .catch(() => {});
    },

    handleGoStep2() {
      this.$router
        .push({
          name: 'security',
        })
        .catch(() => {});
    },

    handleChangePassword() {
      this.$router.push({
        name: 'password',
        params: { nextPage: 'accounts-list', backPage: 'security' },
      });
    },

    handleBackupPrivateKey() {
      this.$router.push({ name: 'account-backup' });
    },
    handleRemoveModal() {
      this.removeAccountModal = true;
      // this.$emit('removeModalClick');
    },
    handleAlert() {
      this.notificationModal = true;
      // this.$emit('notificationModalClick');
    },
    handleCancel(modalEvent) {
      if (modalEvent === 'removeAccountModal') {
        this.removeAccountModal = false;
      }
      if (modalEvent === 'notificationModal') {
        this.notificationModal = false;
      }
    },
  },
});
</script>

<style lang="scss">
.security2_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .security2_autolock_wrapper {
    margin-top: 25px;
    .select {
      float: right;
      width: 105px;
      height: 36px;
      background: #ffffff;
      /* Grey/02 */

      border: 1px solid #d8d8d8;
      border-radius: 4px;
      /* Subtitle/S3 */

      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.333333px;

      /* Grey/06 */

      color: #686767;
    }
  }
  .flex-row {
    display: flex;
    .description {
      width: 220px;
    }
  }
  .title {
    /* Headline/H3 */

    font-family: 'Outfit';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: -0.333333px;

    /* Grey/08 */

    color: #231f20;
  }
  .description {
    width: 327px;
    margin-top: 5px;
    margin-bottom: 0px;
    /* Subtitle/S3 */

    font-family: 'Outfit';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: -0.333333px;

    /* Grey/06 */

    color: #686767;
  }
  .security2_password_wrapper {
    margin-top: 25px;
    .button {
      margin-top: 10px;
    }
  }
  .security2_backup_wrapper {
    margin-top: 25px;
    .button {
      margin-top: 10px;
    }
  }
}
</style>
