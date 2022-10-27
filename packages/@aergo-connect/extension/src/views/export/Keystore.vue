<template>
  <ScrollView class="page">
    <Header button="back" title="Keystore FIle" :to="{ name: 'account-backup' }" />
    <ConfirmModal v-if="modal" :title="modalTitle" to="account-backup" />
    <div class="content" style="padding-bottom: 0">
      <p class="text">Choose a passphrase to encrypt your keystore file.</p>
      <p class="title">Passphrase</p>
      <PasswordStrengthField
        class="password"
        v-model="password"
        @submit="createKeystore"
        autofocus
      />
      {{ errors.password }}
      <div class="warningbox_wrapper">
        <WarningInBox
          error="Never disclose this passphrase and keyfile. Anyone with your private key can fully control
            your account."
        />
      </div>
      <p class="title">Keyfile Name</p>
      <div class="keystorefile_wrapper">
        <p class="text">{{ fileName }}.txt</p>
      </div>
    </div>
    <template #footer>
      <ButtonGroup vertical>
        <Button
          v-if="!keystore"
          type="primary"
          @click="createKeystore"
          :loading="loading"
          size="large"
          >Save</Button
        >
        <Button v-else type="primary" size="large">
          <a :href="encodedKeystoreUrl" target="_blank" :download="fileName" ref="downloadButton"
            >Save</a
          >
        </Button>
      </ButtonGroup>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';

import Vue from 'vue';
import Component from 'vue-class-component';
import { BackButton, Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { TextField, PasswordStrengthField } from '@aergo-connect/lib-ui/src/forms';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import { WarningInBox } from '@aergo-connect/lib-ui/src/items';
import ConfirmModal from '@aergo-connect/lib-ui/src/layouts/ConfirmModal.vue';

@Component({
  components: {
    ConfirmModal,
    Header,
    ScrollView,
    BackButton,
    Button,
    ButtonGroup,
    Heading,
    TextField,
    PasswordStrengthField,
    WarningInBox,
  },
})
export default class AccountExportKeystore extends Vue {
  password = '';
  errors = {
    password: '',
  };
  loading = false;
  account = 'account';
  keystore = '';
  modal = false;

  get encodedKeystoreUrl(): string {
    return 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.keystore);
  }
  get fileName(): string {
    const address = this.$store.state.accounts.address;
    return `${address.slice(0, 9)}_key.txt`;
  }

  get modalTitle(): string {
    return 'Your private key has been saved in ' + this.fileName + '!';
  }

  async createKeystore() {
    if (!this.password) {
      this.errors.password = 'Cannot be empty';
      return;
    }
    this.loading = true;
    try {
      const result = await this.$background.exportAccount({
        address: this.$store.state.accounts.address,
        chainId: 'aergo.io',
        password: this.password,
        format: 'keystore',
      });

      this.keystore = result.privateKey;
      setTimeout(() => {
        (this.$refs.downloadButton as HTMLElement).click();
        this.modal = true;
      }, 150);

      await this.$store.commit('accounts/setBackup', true);
    } catch (e) {
      this.errors.password = `${e}`;
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
.content {
  .text {
    margin: 32px 24px 36px 0;
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.333333px;
    color: #686767;
  }
  .title {
    color: #454344;
    margin: 0 0 10px 0;
  }
  .password {
    margin-right: 24px;
  }

  .warningbox_wrapper {
    margin: 16px 0 34px 0;
    .warningInBox-wrapper {
      margin-left: 0;
    }
  }
  .keystorefile_wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #f0f0f0;
    opacity: 0.7;
    border-radius: 4px;
    width: 327px;
    height: 48px;
    .text {
      margin-left: 12px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.333333px;
      text-decoration-line: underline;
      color: #454344;
    }
  }
  .button-size-default {
    box-sizing: border-box;
    min-height: 48px;
    line-height: 3em;
    padding: 0.5em 2.5em;
    height: 48px;
  }
}
.button-group {
  .button {
    width: 327px;
  }
}
</style>
