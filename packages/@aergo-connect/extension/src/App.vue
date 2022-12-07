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
// import LoadingBar from '@aergo-connect/lib-ui/src/forms/LoadingBar.vue';
import extension from 'extensionizer';

export default Vue.extend({
  components: {
    RouteTransition,
    LoadingDialog,
    // LoadingBar,
  },

  data() {
    return {
      isLoading: false,
    };
  },

  async mounted() {
    const isSetup = await this.$background.isSetup();
    const unlocked = await this.$background.isUnlocked();
    console.log(this.$store.state.ui.currentPage, 'currentPage');
    console.log(this.$store.state.ui.previousPage, 'previousPage');
    if (!isSetup) {
      this.$router.push({ name: 'welcome' }).catch(() => {});
    } else if (!unlocked) {
      // Upon App launch, get initial state for 'unlocked'
      this.$router.push({ name: 'lockscreen' }).catch(() => {});
    }

    this.$store.commit('ui/setUnlocked', unlocked);
    console.log('unlock', unlocked);

    //const getAccounts = await this.$background.getAccounts();

    console.log('idleTimeout:' + this.$store.state.ui.idleTimeout);
    extension.idle.setDetectionInterval(this.$store.state.ui.idleTimeout);

    /*
    extension.idle.onStateChanged.addListener(function(newState: IdleState) {
      console.log(newState, "State") ;
      if (newState === 'idle' || !this.$store.state.ui.unlocked)  {
        this.$background.lock();
        this.$store.commit('ui/setUnlocked', false);
      }
    }) ;
*/

    //  extension.idle.onStateChanged.addListener(this.$background.lock());

    //    const peformAuthCheck = !(
    //      this.$router.currentRoute.meta && this.$router.currentRoute.meta.noAuthCheck
    //    );

    //    if (!unlocked && peformAuthCheck && isSetup) {
    //      this.$router.push({ name: 'lockscreen' }).catch(() => {});
    //    }

    // request.onsuccess = (e) => {
    //   const database = e.target.result;
    //   const transaction = database.transaction(['data']);
    //   const objectStore = transaction.objectStore('data');
    //   const index = objectStore.index['data'];
    //   const request = index.get['chrome'];
    //   request.onsuccess = (e) => {
    //     console.info(e.target.result);
    //   };
    //   request.onerror = (e) => {
    //     console.error(e.target.result);
    //   };
    // };

    // if (isSetup && unlocked) {
    //   if (getAccounts.length > 0) {
    //     const key = getAccounts[0].data.spec.address.substr(0, 5) + '_nick';
    //     let nick = '';
    //     try {
    //       nick = localStorage.getItem(key);
    //     } catch (error) {
    //       nick = key;
    //       console.log('STORE_ERRORS', error);
    //     }
    //     if (!nick) nick = key;
    //     console.log('Nick', nick);
    //     this.$router
    //       .push({
    //         name: 'accounts-list',
    //         params: {
    //           address: getAccounts[0].data.spec.address,
    //           // chainId: getAccounts[0].data.spec.chainId,
    //           nick: nick,
    //         },
    //       })
    //       .catch(() => {});
    //   }
    //   // if (getAccounts.length === 0) {
    //   //   this.$router
    //   //     .push({
    //   //       name: 'accounts-list',
    //   //     })
    //   //     .catch(() => {});
    //   // }
    // }
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
  max-height: 100vh;
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
