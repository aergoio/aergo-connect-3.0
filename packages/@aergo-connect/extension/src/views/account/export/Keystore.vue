<template>
  <ScrollView class="page">
    <Header button="back" title="Keystore FIle" />
    <ConfirmModal
      v-if="modal"
      title="Your private key has been saved in account.txt!"
      to="accounts-list"
    />
    <div class="content" style="padding-bottom: 0">
      <div>
        <p>Choose a passphrase to encrypt your keystore file.</p>
        <p>Passphrase</p>
        <PasswordStrengthField
          variant="main"
          v-model="password"
          @submit="createKeystore"
          autofocus
        />
        {{ errors.password }}
      </div>
      <div>
        <WarningInBox
          error="Never disclose this passphrase and keyfile. Anyone with your private key can fully control
          your account."
        />
      </div>
      <p>Keyfile Name</p>
      <p>{{ account }}.txt</p>
    </div>
    <template #footer>
      <ButtonGroup vertical class="content">
        <Button v-if="!keystore" type="primary" @click="createKeystore" :loading="loading"
          >Save</Button
        >
        <a
          v-else
          class="button button-type-primary button-size-default inverted-colors"
          :href="encodedKeystoreUrl"
          target="_blank"
          :download="fileName"
          ref="downloadButton"
          >Save</a
        >
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
    const address = this.$route.params.address;
    return `${address}__keystore.txt`;
  }

  async createKeystore() {
    if (!this.password) {
      this.errors.password = 'Cannot be empty';
      return;
    }
    this.loading = true;
    try {
      const result = await this.$background.exportAccount({
        address: this.$route.params.address,
        chainId: this.$route.params.chainId,
        password: this.password,
        format: 'keystore',
      });
      this.keystore = result.privateKey;
      setTimeout(() => {
        (this.$refs.downloadButton as HTMLElement).click();
        this.modal = true;
      }, 150);
    } catch (e) {
      this.errors.password = `${e}`;
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss"></style>
