<template>
  <ScrollView class="page">
    <Header button="back" title="Encrypted Private Key" :to="{ name: 'account-backup' }" />
    <div class="export-wif-content" style="padding-bottom: 0">
      <div class="password-field" v-if="!wif">
        <p class="export-wif-note">Choose a passphrase to encrypt your private key string.</p>
        <span>Passphrase</span>
        <PasswordStrengthField variant="default" v-model="password" @submit="createWif" autofocus />
        {{ errors.password }}
      </div>
      <div class="export-wif-content after-encrpted" v-else>
        <div class="phrase-wrapper">
          <p class="mnemonic">
            {{ wif }}
          </p>
          <Button
            @click="copyToClipBoard()"
            :type="copy === 'Copy' ? 'primary-outline' : 'primary'"
            size="medium"
          >
            <img v-if="copy === 'Copy'" src="@aergo-connect/lib-ui/src/icons/img/copy.svg" />
            <img v-if="copy === 'Copied'" src="@aergo-connect/lib-ui/src/icons/img/copied.svg" />
            {{ copy }}
          </Button>
        </div>
        <div class="WarningInBox-wrapper">
          <WarningInBox
            error="Never disclose this string and passphrase. Anyone with your private key can fully control your account."
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        v-if="!wif"
        type="primary"
        size="large"
        :disabled="isBtnDisabled"
        @click="createWif"
        :loading="loading"
      >
        Show
      </Button>
      <div v-else>
        <Button type="gradation" size="large" :to="{ name: 'account-backup' }">
          OK
        </Button>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { Header, ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { WarningInBox } from '@aergo-connect/lib-ui/src/items';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Button } from '@aergo-connect/lib-ui/src/buttons';
import { TextField, PasswordStrengthField } from '@aergo-connect/lib-ui/src/forms';

@Component({
  components: {
    ScrollView,
    Button,
    TextField,
    PasswordStrengthField,
    Header,
    WarningInBox,
  },
})
export default class AccountExportWif extends Vue {
  password = '';
  errors = {
    password: '',
  };
  loading = false;
  wif = '';
  isBtnDisabled = true;
  copy = 'Copy';
  imageName = '../../assets/img/copy.svg';

  updated() {
    if (this.password.length >= 1) {
      this.isBtnDisabled = false;
    }
  }

  copyToClipBoard() {
    navigator.clipboard.writeText(this.wif);
    this.copy = 'Copied';
    this.imageName = '@aergo-connect/lib-ui/src/icons/img/copy.svg';
  }

  async createWif() {

    if (!this.password) {
      this.errors.password = 'Cannot be empty';
      return;
    }

    this.loading = true;

    try {
      const result = await this.$background.exportAccount({
        address: this.$store.state.accounts.address,
        chainId: this.$store.state.accounts.network,
        password: this.password,
        format: 'wif',
      });

      console.log(result);
      this.wif = result.privateKey;

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
.export-wif-content {
  display: flex;
  flex-direction: column;
  justify-items: center;

  &.after-encrpted {
    align-items: center;
    .phrase-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 327px;
      height: 184px;
      background: #ffffff;
      border: 1px solid #ecf8fd;
      box-shadow: 0px 4px 13px rgba(111, 142, 154, 0.3);
      border-radius: 4px;
      padding-bottom: 16px;
      margin: 34px 0px 16px 0px;
      .mnemonic {
        margin-top: 20px;
        font-weight: 600;
        font-size: 20px;
        line-height: 25px;
        text-align: center;
        letter-spacing: -0.333333px;
        width: 260px;
        color: #454344;
        word-break: break-all;
        margin-bottom: 14px;
      }
    }
  }
  .export-wif-note {
    width: 327px;
    margin: 32px 0px 74px 0px;
  }
  .password-field {
    display: flex;
    flex-direction: column;
    margin-left: 24px;
    span {
      margin-bottom: 4px;
    }
  }
}

footer {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
</style>
