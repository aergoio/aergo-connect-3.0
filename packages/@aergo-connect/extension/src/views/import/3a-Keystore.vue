<template>
  <ScrollView class="page">
    <Header button="back" title="Keystore File" :to="{ name: 'account-import' }" />
    <div class="import-keystore-content">
      <h3 class="import-keystore-note">Enter your keystore file and password.</h3>
      <div class="import-keystore-fileInput">
        <FileUploadInput
          label="Keystore file"
          type="file"
          @file="setKeystore"
          :error="errors.keystore"
        />
      </div>
      <div class="import-keystore-passwordInput">
        <PasswordStrengthField class="size" v-model="password" type="password" autoComplete="no" />
        <div v-if="errors.password" class="simple-left">
          <WarningInBox :error="errors.password" />
        </div>
      </div>
    </div>

    <template #footer>
      <div>
        <Button
          size="large"
          @click="loadKeystore"
          type="primary"
          :disabled="!canContinue || loading"
          :loading="loading"
        >
          Import
        </Button>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { BackButton, ContinueButton, Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { TextField, FileUploadInput, PasswordStrengthField } from '@aergo-connect/lib-ui/src/forms';
import { ScrollView, Header } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { PersistInputsMixin } from '../../store/ui';

import Component, { mixins } from 'vue-class-component';
import { identityFromKeystore } from '@herajs/crypto';
import { waitFor } from '@herajs/common';
import { WarningInBox } from '@aergo-connect/lib-ui/src/items';

@Component({
  components: {
    ScrollView,
    BackButton,
    ContinueButton,
    Heading,
    Button,
    ButtonGroup,
    TextField,
    FileUploadInput,
    WarningInBox,
    Header,
    PasswordStrengthField,
  },
})
export default class Keystore extends mixins(PersistInputsMixin) {
  //  chainId = '';
  //  persistFields = ['chainId']; // Data from 1-Network
  //  persistFieldsKey = 'account-create';

  keystoreContent: any = {};
  password = '';
  errors = {
    keystore: '',
    password: '',
  };
  loading = false;

  get canContinue(): boolean {
    return Boolean(this.keystoreContent.ks_version) && Boolean(this.password);
  }

  setKeystore(keystoreContent: string): void {
    this.errors.keystore = '';
    try {
      this.keystoreContent = JSON.parse(keystoreContent);
    } catch (e) {
      this.errors.keystore = 'Invalid file: failed to parse as JSON';
    }
  }

  async loadKeystore(): Promise<void> {
    if (!this.canContinue) return;
    this.loading = true;
    await waitFor(150);
    try {
      const identity = await identityFromKeystore(this.keystoreContent, this.password);
      const accountSpec = await this.$background.importAccount({
        privateKey: Array.from(identity.privateKey),
        chainId: 'aergo.io',
      });

      await this.$store.dispatch('accounts/addAccount', accountSpec.address);
      await this.$store.commit('accounts/setBackup', true);
      console.log('List', this.$background.getAccounts());
      this.$router.push({ name: 'regist-confirm' });
    } catch (e) {
      console.log(e);
      if (`${e}`.match(/invalid mac value/)) {
        this.errors.password = 'Please check the information you entered again.';
        // this.errors.password = 'Invalid password';
      } else {
        this.errors.password = `${e}`;
      }
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
.import-keystore-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .simple-left {
    margin-left: 0;
  }
  .import-keystore-note {
    width: 327px;
    margin-bottom: 49px;
  }

  .import-keystore-fileInput {
    margin-bottom: 32px;
  }
  .import-keystore-passwordInput {
    margin-bottom: 22px;
    .size {
      width: 327px;
    }
  }
}
</style>
