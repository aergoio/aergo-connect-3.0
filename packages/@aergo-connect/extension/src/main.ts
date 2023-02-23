import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import connectToBackground from './background/client';
import Background from './plugins/background';
import IndexedDb from './plugins/indexeddb';
import extension from 'extensionizer';
import PortStream from 'extension-port-stream';
// import ClickOutside from 'vue-click-outside';
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

async function init(name: string) {
  console.log('main init', name);
  const extensionPort = extension.runtime.connect({ name });
  console.log('extensionPort', extensionPort);

  const connectionStream = new PortStream(extensionPort);
  console.log('connectionStream', connectionStream);

  const background = await connectToBackground(connectionStream);
  console.log('background', background);

  const manifest = extension.runtime.getManifest();
  console.log(manifest, 'manifest!!!');
  Vue.use(Background, { background });
  Vue.use(IndexedDb);
  Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
      el.clickOutsideEvent = function (event) {
        // here I check that click was outside the el and his children
        if (!(el == event.target || el.contains(event.target))) {
          // and if it did, call method provided in attribute value
          vnode.context[binding.expression](event);
        }
      };
      document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unbind: function (el) {
      document.body.removeEventListener('click', el.clickOutsideEvent);
    },
  });
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
    // console.log(router, 'router');
    // console.log(isNonAuthPage, 'isNonAuthPage');

    if (Object.prototype.hasOwnProperty.call(state, 'unlocked')) {
      store.commit('ui/setUnlocked', state.unlocked);
      if (state.unlocked === false && !isNonAuthPage) {
        router.push({ name: 'lockscreen' });
      }
    }
  });

  //  console.log('STATE', store.state.accounts);
  // console.log('idleTimeout:' + store.state.ui.idleTimeout);
  extension.idle.setDetectionInterval(store.state.ui.idleTimeout);

  console.log('main init end');
}

const elem = document.getElementById('app');
const name = elem ? elem.getAttribute('data-name') || '' : '';
init(name);
