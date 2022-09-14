<template>
  <ScrollView class="page">
    <Header button="back" title="Import Account" />
    <div class="foramt-content">
      <!-- <section class="dialog-header">
        <BackButton :to="{ name: 'account-import' }" />
      </section> -->
      <!-- <Heading>Import Format</Heading> -->
      <span class="preheaer">Please select the import format.</span>
      <p class="buttons">
        <Button type="gradation" size="large" :to="{ name: 'account-import-seedphrase' }"
          >Mnemonic Seedphrase</Button
        >
        <Button type="gradation" size="large" :to="{ name: 'account-import-wif' }"
          >Encrypted Private Key</Button
        >
        <Button type="gradation" size="large" :to="{ name: 'account-import-keystore' }"
          >Keystore File</Button
        >
      </p>
      <p class="note">
        <span>Keystore File</span> is the recommended format. Use it when you saved your key as an
        encrypted file.
        <br />
        <br />
        <span>Encrypted String</span> is a legacy format. Use it when you copied your key as an
        encrypted string.
      </p>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { BackButton, Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView, Header } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

import Component, { mixins } from 'vue-class-component';

@Component({
  components: {
    ScrollView,
    BackButton,
    Heading,
    Button,
    ButtonGroup,
    Header,
  },
})
export default class Import extends mixins() {}
</script>

<style lang="scss">
.foramt-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 100%;

  .buttons {
    margin-bottom: 32px;
    button {
      margin-bottom: 28px;
    }
  }

  .note {
    width: 327px;
    font-weight: 400;
    font-size: 15px;
    line-height: 19px;
    letter-spacing: -0.333333px;
    color: #686767;
    span {
      color: #279ecc;
    }
  }
}
</style>
