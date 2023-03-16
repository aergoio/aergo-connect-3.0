import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import connectToBackground from './background/client';
import Background from './plugins/background';
import IndexedDb from './plugins/indexeddb';
import './plugins/directives';
import PortStream from 'extension-port-stream';
import '@aergo-connect/lib-ui/src/styles/base.scss';
import { enforceRequest } from './router/guards';

Vue.config.productionTip = false;
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};

function getRequestId() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestId = urlParams.get('request');
  return requestId;
}

async function setupBackground(extensionPort: any) {
  const connectionStream = new PortStream(extensionPort);
  const background = await connectToBackground(connectionStream);
  // React to state updates from background
  background.on('update', function (state) {
    console.log('update from bg', state);
    const isNonAuthPage = router.currentRoute.meta && router.currentRoute.meta.noAuthCheck === true;
    if (Object.prototype.hasOwnProperty.call(state, 'unlocked')) {
      store.commit('ui/setUnlocked', state.unlocked);
      if (!state.unlocked && !isNonAuthPage) {
        router.push({ name: 'lockscreen' });
      }
    }
    if (Object.prototype.hasOwnProperty.call(state, 'accounts')) {
      store.commit('accounts/setAccounts', state.accounts);
    }
    if (Object.prototype.hasOwnProperty.call(state, 'accountsRemoved')) {
      store.commit('accounts/removeAccounts', state.accountsRemoved);
    }
  });
  return background;
}

async function init(name: string) {
  const extensionPort = chrome.runtime.connect({ name });
  console.log(extensionPort, 'extensionPort?');
  Vue.use(Background, { background: await setupBackground(extensionPort) });
  Vue.use(IndexedDb);

  const requestId = getRequestId();
  console.log(requestId, 'requestId?');
  if (requestId) {
    router.beforeEach(enforceRequest);
    store.commit('request/setRequestId', requestId);
  }

  const vue = new Vue({
    router,
    store,
    render: (h) => h(App),
    data() {
      return { name };
    },
  }).$mount('#app');

  // Need to reconnect when background disconnects
  // https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
  extensionPort.onDisconnect.addListener(async () => {
    const extensionPort = chrome.runtime.connect({ name });
    console.log(extensionPort, 'extensionPort?22');
    vue.$setBackground(await setupBackground(extensionPort));
  });
  // React to state updates from background

  chrome.idle.setDetectionInterval(store.state.ui.idleTimeout);
}

const elem = document.getElementById('app');
const name = elem ? elem.getAttribute('data-name') || '' : '';

init(name);
