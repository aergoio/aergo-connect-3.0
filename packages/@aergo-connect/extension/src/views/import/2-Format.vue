<template>
  <ScrollView class="page">
    <Header button="back" title="Import Account" :to="{ name: 'register' }" />
    <div class="format-content">
      <span class="preheader">Please select the import format.</span>
      <p class="buttons">
        <Button
          type="font-gradation"
          size="large-outline"
          :to="{ name: 'account-import-seedphrase' }"
          hover
        >
          <span>Mnemonic Seedphrase</span>
        </Button>

        <Button
          type="font-gradation"
          size="large-outline"
          :to="{ name: 'account-import-wif' }"
          hover
        >
          <span>Encrypted Private Key</span>
        </Button>

        <Button
          type="font-gradation"
          size="large-outline"
          :to="{ name: 'account-import-keystore' }"
          hover
        >
          <span>Keystore File</span>
        </Button>
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
.format-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .preheader {
    margin-top: 32px;
    width: 318px;
    height: 25px;
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
  .buttons {
    margin-top: 40px;
    margin-bottom: 20px;
    button {
      margin-bottom: 40px;
    }
    .button:hover {
      .button_text {
        color: #ffffff;
      }
    }
  }

  .note {
    margin-left: 24px;
    width: 320px;
    font-weight: 400;
    font-size: 15px;
    line-height: 19px;
    letter-spacing: -0.333333px;
    color: #686767;
    word-wrap: break-word;
    span {
      color: #279ecc;
    }
  }
}
</style>
