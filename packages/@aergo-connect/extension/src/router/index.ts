import store from '../store';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { loadPersistedRoute, allowedToExitLockscreen, persistRoute, updateTitle } from './guards';

import AccountsContainer from '../views/Container.vue';
import Lockscreen from '../views/Lockscreen.vue';
// import Settings from '../views/Settings.vue';
import Welcome from '../views/Welcome.vue';
import Register from '../views/Register.vue';
import Password from '../views/Password.vue';
import RegistConfirm from '../views/RegistConfirm.vue';
import Home from '../views/Home.vue';
import SignMessage from '../views/SignMessage.vue';
import Security from '../views/Security.vue';
import ImportAsset from '../views/ImportAsset.vue';
import Send from '../views/Send.vue';
import Receive from '../views/Receive.vue';
import TokenDetail from '../views/TokenDetail.vue';
import NftDetail from '../views/NftDetail.vue';
import Version from '../views/Version.vue';

import ImportFormat from '../views/import/2-Format.vue';
import ImportKeystore from '../views/import/3a-Keystore.vue';
import ImportWif from '../views/import/3b-Wif.vue';
import ImportSeedphrase from '../views/import/3c-Seedphrase.vue';
import BackupPrivateKey from '../views/export/BackupPrivateKey.vue';
import MnemonicSeedPhrase from '../views/export/MnemonicSeedPhrase.vue';
import Keystore from '../views/export/Keystore.vue';
import ExportWif from '../views/export/Wif.vue';

import RequestContainer from '../views/request/Container.vue';
import RequestSelectAccount from '../views/request/SelectAccount.vue';
import RequestSelectAction from '../views/request/SelectAction.vue';
import RequestAccountContainer from '../views/request/AccountContainer.vue';
import RequestAccountList from '../views/request/AccountList.vue';
import RequestAddress from '../views/request/Address.vue';
import RequestSign from '../views/request/Sign.vue';
import RequestSendTx from '../views/request/Send.vue';
import RequestSignTx from '../views/request/SignTx.vue';
import RequestAddNetwork from '../views/request/AddNetwork.vue';

import ConnectHw from '../views/connect-hw/1-Network.vue';
import ConnectHwAccounts from '../views/connect-hw/2-Accounts.vue';
import NetworksList from '../views/networks/List.vue';
import NetworksUpdate from '../views/networks/Update.vue';

enum R {
  None = 0,
  NoAuthCheck = 1 << 0,
  NoTracking = 1 << 1,
}

function withMeta(index: number | undefined, route: RouteConfig, flags: R = R.None): RouteConfig {
  return {
    ...route,
    meta: {
      ...route.meta,
      index, // used for route transition animations
      noAuthCheck: (flags & R.NoAuthCheck) === R.NoAuthCheck,
      noTracking: (flags & R.NoTracking) === R.NoTracking,
    },
  };
}

const routes: RouteConfig[] = [
  { path: '/', redirect: '/accounts' },
  {
    path: '/accounts',
    component: AccountsContainer,
    children: [
      { path: '', redirect: '/home' },
      withMeta(0, { path: '/welcome', name: 'welcome', component: Welcome }, R.NoAuthCheck),
      withMeta(
        1,
        { path: '/locked', name: 'lockscreen', component: Lockscreen },
        R.NoAuthCheck | R.NoTracking,
      ),

      withMeta(
        1,
        { path: '/password', name: 'password', component: Password },
        R.NoAuthCheck | R.NoTracking,
      ),
      withMeta(1, { path: '/home', name: 'accounts-list', component: Home }),
      withMeta(2, {
        path: '/register',
        name: 'register',
        component: Register,
      }),
      withMeta(3, { path: '/register/confirm', name: 'regist-confirm', component: RegistConfirm }),

      withMeta(2, { path: '/home/tokendetail', name: 'token-detail', component: TokenDetail }),
      withMeta(2, { path: '/home/nftdetail/:id', name: 'nft-detail', component: NftDetail }),
      withMeta(2, {
        path: '/home/importasset/:option',
        name: 'import-asset',
        component: ImportAsset,
      }),
      withMeta(3, { path: '/home/send/:id', name: 'send', component: Send }),
      withMeta(3, { path: '/home/receive', name: 'receive', component: Receive }),
      withMeta(3, { path: '/home/signmessage', name: 'sign-message', component: SignMessage }),
      withMeta(3, { path: '/home/version', name: 'version', component: Version }),
      withMeta(3, { path: '/home/security', name: 'security', component: Security }),

      withMeta(4, {
        path: '/export/BackupPrivateKey',
        name: 'account-backup',
        component: BackupPrivateKey,
      }),
      withMeta(5, {
        path: '/export/MnemonicSeedPhrase ',
        name: 'account-backup-mnemonic',
        component: MnemonicSeedPhrase,
      }),
      withMeta(5, { path: '/export/wif ', name: 'account-backup-encrypted', component: ExportWif }),
      withMeta(5, {
        path: '/export/keystore ',
        name: 'account-backup-keystore',
        component: Keystore,
      }),

      withMeta(4, { path: '/import/format', name: 'account-import', component: ImportFormat }),
      withMeta(5, {
        path: '/import/keystore',
        name: 'account-import-keystore',
        component: ImportKeystore,
      }),
      withMeta(5, { path: '/import/wif', name: 'account-import-wif', component: ImportWif }),
      withMeta(5, {
        path: '/import/seedphrase',
        name: 'account-import-seedphrase',
        component: ImportSeedphrase,
      }),

      withMeta(
        4,
        { path: '/connect-hw', name: 'account-connect-hw', component: ConnectHw },
        R.NoAuthCheck | R.NoTracking,
      ),
      withMeta(
        5,
        {
          path: '/connect-hw/accounts',
          name: 'account-connect-hw-accounts',
          component: ConnectHwAccounts,
        },
        R.NoAuthCheck | R.NoTracking,
      ),
      withMeta(5, { path: 'networks', name: 'networks-list', component: NetworksList }),
      withMeta(6, { path: 'networks/create', name: 'networks-create', component: NetworksUpdate }),
      withMeta(6, { path: 'networks/update', name: 'networks-update', component: NetworksUpdate }),
    ],
  },
  {
    path: '/request',
    component: RequestContainer,
    children: [
      {
        path: '',
        name: 'request-select-account',
        component: RequestSelectAccount,
      },
      {
        path: 'list',
        name: 'request-accounts-list',
        component: RequestAccountList,
      },
      {
        path: `account/${store.state.accounts.chainId}/`,
        component: RequestAccountContainer,
        children: [
          {
            path: '',
            name: 'request-select-action',
            component: RequestSelectAction,
          },
          {
            path: 'address',
            name: 'request-address',
            component: RequestAddress,
          },
          { path: 'sign', name: 'request-sign', component: RequestSign },
          {
            path: 'sign-tx',
            name: 'request-sign-tx',
            component: RequestSignTx,
          },
          { path: 'send', name: 'request-send', component: RequestSendTx },
          {
            path: 'addNetworks',
            name: 'request-add-network',
            component: RequestAddNetwork,
          },
        ],
      },
    ],
  },
];

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
});

// router.beforeEach(function (to, from, next) {
//   console.log('from', from.name, 'to', to.name);
//   next();
// });

router.beforeEach(allowedToExitLockscreen);
router.beforeEach(loadPersistedRoute);
router.beforeEach(persistRoute);
router.afterEach(updateTitle);

export default router;
