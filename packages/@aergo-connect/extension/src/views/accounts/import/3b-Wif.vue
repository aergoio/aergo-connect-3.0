<template>
  <ScrollView class="page">
    <Header button="back" title="Encrypted Private Key" />
    <div class="import-wif-content">
      <p class="import-wif-note">Enter your encrypted private key and password.</p>
      <div class="import-wif-textField">
        <TextField label="Encrypted private key" v-model="encryptedKey" :error="errors.keystore" />
      </div>
      <PasswordStrengthField v-model="password" label="Encryption password" autoComplete="no" />
      <div v-if="errors.password" class="import-wif-error">
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
import { TextField, PasswordStrengthField } from '@aergo-connect/lib-ui/src/forms';
import { ScrollView, Header } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { PersistInputsMixin } from '../../../store/ui';
import { WarningInBox } from '@aergo-connect/lib-ui/src/items';
import Component, { mixins } from 'vue-class-component';
import { decodePrivateKey, decryptPrivateKey, identityFromPrivateKey } from '@herajs/crypto';
import { waitFor } from '@herajs/common';

@Component({
  components: {
    ScrollView,
    BackButton,
    ContinueButton,
    Heading,
    Button,
    ButtonGroup,
    TextField,
    Header,
    PasswordStrengthField,
    WarningInBox,
  },
})
export default class Keystore extends mixins(PersistInputsMixin) {
  chainId = '';
  persistFields = ['chainId']; // Data from 1-Network
  persistFieldsKey = 'account-create';

  encryptedKey = '';
  password = '';
  errors = {
    keystore: '',
    password: '',
  };
  loading = false;

  get canContinue(): boolean {
    return Boolean(this.encryptedKey) && Boolean(this.password);
  }

  async loadKeystore(): Promise<void> {
    if (!this.canContinue) return;
    this.loading = true;
    await waitFor(150);

    try {
      const encryptedBytes = decodePrivateKey(this.encryptedKey);
      const decryptedBytes = await decryptPrivateKey(encryptedBytes, this.password);
      const identity = await identityFromPrivateKey(decryptedBytes);
      const accountSpec = await this.$background.importAccount({
        privateKey: Array.from(identity.privateKey),
        chainId: this.chainId,
      });
      this.$router.push({ name: 'account-imported', params: { ...accountSpec } });
    } catch (e) {
      console.log(e);
      if (`${e}`.match(/invalid mac value/)) {
        this.errors.password = 'Invalid password';
      } else {
        // this.errors.password = `${e}`;
        this.errors.password = 'Please check the information you entered again.';
      }
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
.import-wif-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .import-wif-note {
    font-weight: 600;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: -0.333333px;
    color: #231f20;
    width: 327px;
    margin-top: 32px;
  }

  .import-wif-textField {
    margin-bottom: 32px;
  }
  .import-wif-error {
    margin-top: 14px;
  }
}

footer {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
</style>
