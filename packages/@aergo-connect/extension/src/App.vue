<template>
  <div id="app" :class="`page-${$router.currentRoute.name}`">
    <router-view />

    <!-- <RouteTransition> <router-view /> </RouteTransition> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LoadingDialog from '@aergo-connect/lib-ui/src/layouts/LoadingDialog.vue';
import RouteTransition from '@aergo-connect/lib-ui/src/nav/RouteTransition.vue';
import extension from 'extensionizer';
import { decodePrivateKey } from '@herajs/crypto';
export default Vue.extend({
  components: {
    RouteTransition,
    LoadingDialog,
  },

  data() {
    return {
      isLoading: false,
    };
  },

  async mounted() {
    const isSetup = await this.$background.isSetup();
    const unlocked = await this.$background.isUnlocked();
    const storeInitSetupKey = this.$store.state.ui.initSetupKey;
    const storeUnlocked = this.$store.state.ui.unlocked;
    console.log(isSetup, 'isSetup');
    console.log(unlocked, 'isUnlocked?!');
    console.log(storeInitSetupKey, 'storeInitSetupKey');
    console.log(storeUnlocked, 'storeUnlocked');
    if (!isSetup && !storeInitSetupKey) {
      this.$router.push({ name: 'welcome' }).catch(() => {});
    } else if (!unlocked && !storeUnlocked) {
      // Upon App launch, get initial state for 'unlocked'
      this.$router.push({ name: 'lockscreen' }).catch(() => {});
    }
    const decodedPassword = decodePrivateKey(storeInitSetupKey).toString();
    await this.$background.unlock({ password: decodedPassword });
    extension.idle.setDetectionInterval(this.$store.state.ui.idleTimeout);
    this.$store.commit('ui/setUnlocked', unlocked);
  },
});
</script>

<style lang="scss">
body {
  margin: 0;
  font-size: 100%;
}

#app {
  max-width: 375px;
  /* max-height: 100vh; */
  height: 600px;
  margin: 0 auto;
  background-color: #fff;
  position: relative;
  overflow: hidden;
  font-family: 'Outfit';
}

body.fullpage {
  padding: 10px;

  #app {
    border-radius: 8px;
    box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.08);
  }
}
</style>
