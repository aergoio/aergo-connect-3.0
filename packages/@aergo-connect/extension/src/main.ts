import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import connectToBackground from './background/client';
import Background from './plugins/background';
import IndexedDb from './plugins/indexeddb';
import extension from 'extensionizer';
import PortStream from 'extension-port-stream';
import '@aergo-connect/lib-ui/src/styles/base.scss';
import { enforceRequest } from './router/guards';

Vue.config.productionTip = false;

function getRequestId() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestId = urlParams.get('request');
  return requestId;
}

async function init(name: string) {
  const extensionPort = extension.runtime.connect({ name });
  const connectionStream = new PortStream(extensionPort);
  const background = await connectToBackground(connectionStream);
  // const manifest = extension.runtime.getManifest();

  Vue.use(Background, { background });
  Vue.use(IndexedDb);

  const requestId = getRequestId();

  if (requestId) {
    router.beforeEach(enforceRequest);
    store.commit('request/setRequestId', requestId);
  }

  new Vue({
    router,
    store,
    render: (h) => h(App),
    data() {
      return { name };
    },
  }).$mount('#app');

  // React to state updates from background
  background.on('update', function (state) {
    console.log('update from bg', state);
    const isNonAuthPage = router.currentRoute.meta && router.currentRoute.meta.noAuthCheck === true;
    console.log(isNonAuthPage, 'isNonAuthPage');

    if (Object.prototype.hasOwnProperty.call(state, 'unlocked')) {
      store.commit('ui/setUnlocked', state.unlocked);
      if (state.unlocked === false && !isNonAuthPage) {
        router.push({ name: 'lockscreen' });
      }
    }

  });

  //  console.log('STATE', store.state.accounts);
  console.log('idleTimeout:' + store.state.ui.idleTimeout);
  extension.idle.setDetectionInterval(store.state.ui.idleTimeout);
}

const elem = document.getElementById('app');
const name = elem ? elem.getAttribute('data-name') || '' : '';
init(name);
