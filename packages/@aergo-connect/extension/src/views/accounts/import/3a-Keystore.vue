<template>
  <ScrollView class="page">
    <Header button="back" title="Keystore File" :to="{ name: 'account-import' }" />
    <div class="simple-content">
      <div class="simple-preheader margin"> Enter your keystore file and password.</div>
      <div class="margin"></div>
      <div class="field-title"> Keystore File </div>
      <FileUploadInput
        class="simple-center margin"
        type="file"
        @file="setKeystore"
        :error="errors.keystore"
      />
      <div class="field-title"> Keystore Passphrase </div>
      <PasswordStrengthField
          class="simple-center"
          v-model="password"
          type="password"
          autoComplete="no"
      />
      <div v-if="errors.password" class="simple-left">
        <WarningInBox :error="errors.password" />
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
import { PersistInputsMixin } from '../../../store/ui';

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
  chainId = '';
  persistFields = ['chainId']; // Data from 1-Network
  persistFieldsKey = 'account-create';

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
        chainId: this.chainId,
      });
      this.$router.push({ name: 'account-imported', params: { ...accountSpec } });
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
.margin {
  margin-bottom: 40px;
}
</style>
