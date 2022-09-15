<template>
  <div :visible="visible" title="Export Account" @close="$emit('close')">
    <Header button="back" title="Backup Private Key" />
    <section class="exportAccountDialog-contents">
      <div class="btn-p-wrapper">
        <Button type="gradation" size="large" :to="{ name: 'account-backup-mnemonic' }">
          Mnemonic Seed Phrase
        </Button>
        <p>Show mnemonic seed phrase of the private key for the current selected account.</p>
      </div>
      <div class="btn-p-wrapper">
        <Button type="gradation" size="large" :to="{ name: 'account-backup-encrypted' }">
          Encrypted Private Key
        </Button>
        <p>Show the encrypted private key for the current selected account.</p>
      </div>
      <div class="btn-p-wrapper">
        <Button type="gradation" size="large" :to="{ name: 'account-backup-keystore' }">
          Keystore File
        </Button>
        <p>Save private key to a file for the current selected account.</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { ModalDialog, Header } from '@aergo-connect/lib-ui/src/layouts';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import { Button } from '@aergo-connect/lib-ui/src/buttons';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
  components: {
    Icon,
    ModalDialog,
    Header,
    Button,
  },
})
export default class AddAccountDialog extends Vue {
  @Prop(Boolean) readonly visible = false;
}
</script>

<style lang="scss">
.exportAccountDialog-contents {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .btn-p-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;

    &:first-child {
      margin-top: 61px;
    }

    p {
      margin: 0;
      margin-top: 12px;
      width: 327px;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.333333px;
      color: #9c9a9a;
    }
  }
}
</style>
