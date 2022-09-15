<template>
  <ScrollView class="page">
    <Header button="back" title="Mnemonic Seed Phrase" />
    <div class="backup-mnemonic-content">
      <p class="note">
        For safe backup, write this recovery phrase on a piece of paper or copy it and save it.
        You’ll need to verify it on the next page.
      </p>

      <div class="phrase-wrapper">
        <p class="mnemonic">
          {{ mnemonic }}
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
          error="Never disclose this seed phrase. Anyone with your private key can fully control your account."
        />
      </div>
    </div>
    <template #footer>
      <Button type="gradation" size="large" :to="{ name: 'account-backup' }">
        OK
      </Button>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { Button } from '@aergo-connect/lib-ui/src/buttons';
import { Header, ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { WarningInBox } from '@aergo-connect/lib-ui/src/items';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

export default Vue.extend({
  components: {
    ScrollView,
    Header,
    Button,
    Heading,
    WarningInBox,
  },

  data() {
    return {
      mnemonic: '',
      copy: 'Copy',
      imageName: '../../../assets/img/copy.svg',
    };
  },

  methods: {
    copyToClipBoard() {
      navigator.clipboard.writeText(this.mnemonic);
      this.copy = 'Copied';
      this.imageName = '@aergo-connect/lib-ui/src/icons/img/copy.svg';
    },
  },

  async beforeMount() {
    return;
  },
});
</script>

<style lang="scss">
.backup-mnemonic-content {
  display: flex;
  flex-direction: column;
  align-items: center;

  .note {
    width: 327px;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.333333px;
    color: #686767;
    margin: 24px 0 36px 0;
  }

  .WarningInBox-wrapper {
    margin: 16px 0 70px 0;
  }
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
    .mnemonic {
      margin-top: 20px;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      text-align: center;
      letter-spacing: -0.333333px;
      width: 260px;
      color: #454344;
    }
  }
}

footer {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
</style>
