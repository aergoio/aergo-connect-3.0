<template>
  <ScrollView>
    <Header button="back" title="App Version" @backClick="handleBack" />
    <div class="version_content">
      <Icon :name="`aergoMainLogo`" />
      <div class="text">Currently Version: {{ checkVersion() }}</div>
      <div class="text">Your app is up to date.</div>
    </div>
    <Button class="version_button" type="primary" size="large" @click="handleBack" hover>OK</Button>
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
export default Vue.extend({
  components: { ScrollView, Header, Icon, Button },
  methods: {
    handleBack() {
      this.$router.push({
        name: 'accounts-list',
      });
    },
    checkVersion() {
      const manifest = chrome.runtime.getManifest();
      return manifest.version;
    },
  },
});
</script>

<style lang="scss">
.version_content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  background: linear-gradient(0deg, #ffffff -10.1%, #ecf8fd 58.85%, #fff1f9 139.14%);
  .text {
    margin-top: 20px;
    /* Subtitle/S3 */

    font-family: 'Outfit';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    letter-spacing: -0.333333px;

    /* Grey/06 */

    color: #686767;
  }
}
.version_button {
  margin-left: 24px;
}
</style>
