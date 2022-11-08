<template>
  <ScrollView class="page">
    <Header button="back" title="Mnemonic Seed Phrase" :to="{ name: 'account-import' }" />
    <div class="simple-content">
      <span class="simple-preheader">Enter your Mnemonic Seed Phrase.</span>
      <div class="import-seedphrase-preheader">Seed Phrase</div>
      <div class="simple-center">
        <TextArea
          v-model="seedPhrase"
          placeholder="Seed phrase is a set of twelve words. Add one space between each word."
          :state="
            seedPhrase.length <= 0
              ? ''
              : errors.seedPhrase.length <= 0 && errors.derivationPath.length <= 0
              ? 'valid'
              : 'invalid'
          "
        />
      </div>
      <div
        class="import-seedphrase-validation invalid"
        v-if="(seedPhrase && errors.seedPhrase) || (seedPhrase && errors.derivationPath)"
      >
        <img src="@aergo-connect/lib-ui/src/icons/img/danger.svg" width="16px" />
        <span>{{ errors.seedPhrase || errors.derivationPath }}</span>
      </div>
      <div
        class="import-seedphrase-validation valid"
        v-if="seedPhraseValid && !errors.seedPhrase && !errors.derivationPath"
      >
        <img src="@aergo-connect/lib-ui/src/icons/img/checkmark-circle.svg" width="16px" />
        <span>Phrase verification completed.</span>
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
import { TextField, TextArea } from '@aergo-connect/lib-ui/src/forms';
import { ScrollView, Header } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { PersistInputsMixin } from '../../store/ui';
import Component, { mixins } from 'vue-class-component';
import { privateKeyFromMnemonic, identityFromPrivateKey, validateMnemonic } from '@herajs/crypto';
import { waitFor, constants } from '@herajs/common';
import { Watch } from 'vue-property-decorator';

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
    TextArea,
  },
})
export default class Keystore extends mixins(PersistInputsMixin) {
  chainId = '';
  persistFields = ['chainId']; // Data from 1-Network
  persistFieldsKey = 'account-create';
  derivationPath = constants.WALLET_HDPATH;
  seedPhrase = '';
  errors = {
    seedPhrase: '',
    derivationPath: '',
  };
  loading = false;
  seedPhraseValidationTimeout: NodeJS.Timeout | null = null;
  seedPhraseValid = false;

  get canContinue(): boolean | void {
    return this.seedPhraseValid ? true : false;
  }

  get textAreaState(): string {
    if (this.seedPhrase.length >= 1) {
      if (this.seedPhraseValid) {
        return 'valid';
      } else {
        return 'valid';
      }
    }
    return '';
  }

  validateSeedPhrase() {
    if (this.seedPhraseValidationTimeout) {
      clearTimeout(this.seedPhraseValidationTimeout);
    }
    this.seedPhraseValidationTimeout = setTimeout(() => {
      this.errors.seedPhrase = '';
      this.seedPhraseValid = false;
      if (!this.seedPhrase) {
        return;
      }
      this.seedPhraseValid = validateMnemonic(this.seedPhrase);
      if (!this.seedPhraseValid) {
        this.errors.seedPhrase = 'Please check the seed phrase again.';
      }
      if (this.seedPhraseValid) {
        this.seedPhraseValid = true;
        this.errors.seedPhrase = '';
      }
    }, 250);
  }

  @Watch('seedPhrase', { immediate: true, deep: true })
  exampleMethod() {
    this.validateSeedPhrase();
    console.log(this.errors);
  }

  async loadKeystore(): Promise<void> {
    if (!this.canContinue) return;
    const isvalidateSeedPhrase = validateMnemonic(this.seedPhrase);
    if (!isvalidateSeedPhrase) {
      this.errors.seedPhrase = 'Please check the seed phrase again.';
      return;
    }

    await waitFor(150);

    this.loading = true;
    try {
      const opts = { hdpath: this.derivationPath };
      const privateKey = await privateKeyFromMnemonic(this.seedPhrase, opts);
      const identity = identityFromPrivateKey(privateKey);

      const accountSpec = await this.$background.importAccount({
        privateKey: Array.from(identity.privateKey),
        chainId: 'aergo.io',
      });

      await this.$store.dispatch('accounts/addAccount', accountSpec.address);
      await this.$store.commit('accounts/setBackup', true);

      this.$router.push({
        name: 'regist-confirm',
      });
    } catch (e) {
      console.log(e);
      this.errors.derivationPath = `${e}`;
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
.import-seedphrase-preheader {
  display: flex;
  flex-direction: column;
  font-weight: 400;
  font-size: 18px;
  line-height: 18px;
  letter-spacing: -0.333333px;
  color: #454344;
  margin-top: 30px;
  margin-left: 26px;
  margin-bottom: 10px;
}
.inputContainer {
  width: 327px;
}
.import-seedphrase-validation {
  display: flex;
  font-weight: 300;
  font-size: 18px;
  line-height: 18px;
  letter-spacing: -0.333333px;
  margin-top: 10px;
  margin-left: 24px;
  &.invalid {
    color: #e4097d;
  }
  &.valid {
    color: #279ecc;
  }
  img {
    margin-right: 6px;
  }
}
</style>
