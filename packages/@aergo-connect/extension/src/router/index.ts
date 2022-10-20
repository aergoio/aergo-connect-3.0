import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { loadPersistedRoute, allowedToExitLockscreen, persistRoute, updateTitle } from './guards';

import AccountsContainer from '../views/Container.vue';
import Lockscreen from '../views/Lockscreen.vue';
import Welcome from '../views/Welcome.vue';
import Register from '../views/Register.vue';
import Setup from '../views/Setup.vue';
import Create from '../views/Create.vue';
import Home from '../views/Home.vue';
import SignMessage from '../views/SignMessage.vue';
import Security from '../views/Security.vue';
import ImportAsset from '../views/ImportAsset.vue';
import Send from '../views/Send.vue';
import Receive from '../views/Receive.vue';
import TokenDetail from '../views/TokenDetail.vue';
import NftDetail from '../views/NftDetail.vue';
import ImportFormat from '../views/import/2-Format.vue';
import ImportKeystore from '../views/import/3a-Keystore.vue';
import ImportWif from '../views/import/3b-Wif.vue';
import ImportSeedphrase from '../views/import/3c-Seedphrase.vue';

import ConnectHw from '../views/connect-hw/1-Network.vue';
import ConnectHwAccounts from '../views/connect-hw/2-Accounts.vue';
import Settings from '../views/Settings.vue';
import NetworksList from '../views/networks/List.vue';
import NetworksUpdate from '../views/networks/Update.vue';

import BackupPrivateKey from '../views/export/BackupPrivateKey.vue';
import MnemonicSeedPhrase from '../views/export/MnemonicSeedPhrase.vue';
import Keystore from '../views/export/Keystore.vue';
import ExportWif from '../views/export/Wif.vue';

/*
import AccountContainer from '../views/account/Container.vue';
import TabContainer from '../views/account/TabContainer.vue';
import AccountDetailsContainer from '../views/account/details/Container.vue';
import AccountDetails from '../views/account/details/Details.vue';
import AccountExportKeystore from '../views/export/Keystore.vue';
*/

//import ViewSeedPhrase from '../views/account/seedphrase/View.vue';
//import VerifySeedPhrase from '../views/account/seedphrase/Verify.vue';
//import AccountSend from '../views/account/send/1-Send.vue';
//import AccountSendConfirm from '../views/account/send/2-Confirm.vue';
//import AccountSendSuccess from '../views/account/send/3-Success.vue';
//import AccountHistory from '../views/account/History.vue';
//import AccountExportWif from '../views/account/export/Wif.vue';
//import AccountNameCreate from '../views/account/name/Create.vue';
//import AccountNameUpdate from '../views/account/name/Update.vue';
//import AccountRemove from '../views/account/Remove.vue';
//import AccountSign from '../views/account/Sign.vue';

//import RequestContainer from '../views/request/Container.vue';
//import RequestSelectAccount from '../views/request/SelectAccount.vue';
//import RequestSelectAction from '../views/request/SelectAction.vue';
//import RequestAccountContainer from '../views/request/AccountContainer.vue';
//import RequestAccountList from '../views/request/AccountList.vue';
//import RequestAddress from '../views/request/Address.vue';
//import RequestSign from '../views/request/Sign.vue';
//import RequestSendTx from '../views/request/Send.vue';
//import RequestSignTx from '../views/request/SignTx.vue';

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
      { path: '', redirect: 'list' },
      withMeta(
        0,
        { path: '/locked', name: 'lockscreen', component: Lockscreen },
        R.NoAuthCheck | R.NoTracking,
      ),
      withMeta(
        0,
        { path: '/settings', name: 'settings', component: Settings },
        R.NoAuthCheck | R.NoTracking,
      ),
      withMeta(0, { path: '/welcome', name: 'welcome', component: Welcome }, R.NoAuthCheck),
      withMeta(
        1,
        { path: '/setup', name: 'setup', component: Setup },
        R.NoAuthCheck | R.NoTracking,
      ),

      withMeta(1, { path: '/register', name: 'register', component: Register }),

      withMeta(1, {
        path: 'list',
        name: 'accounts-list',
        component: Home,
      }),
      withMeta(2, {
        path: 'list/importasset/:option',
        name: 'import-asset',
        component: ImportAsset,
      }),
      withMeta(2, {
        path: '/list/signmessage',
        name: 'sign-message',
        component: SignMessage,
      }),
      withMeta(2, {
        path: '/list/security',
        name: 'security',
        component: Security,
      }),
      withMeta(2, {
        path: '/list/send',
        name: 'send',
        component: Send,
      }),
      withMeta(2, {
        path: '/list/receive',
        name: 'receive',
        component: Receive,
      }),
      withMeta(2, {
        path: '/list/tokendetail/:option',
        name: 'token-detail',
        component: TokenDetail,
      }),
      withMeta(2, {
        path: '/list/nftdetail',
        name: 'nft-detail',
        component: NftDetail,
      }),

      withMeta(2, {
        path: '/account/create',
        name: 'account-create',
        component: Create,
      }),

      withMeta(3, {
        path: '/export/BackupPrivateKey',
        name: 'account-backup',
        component: BackupPrivateKey,
      }),

      withMeta(4, {
        path: '/export/MnemonicSeedPhrase ',
        name: 'account-backup-mnemonic',
        component: MnemonicSeedPhrase,
      }),

      withMeta(4, {
        path: '/export/Wif ',
        name: 'account-backup-encrypted',
        component: ExportWif,
      }),

      withMeta(4, {
        path: '/export/keystore ',
        name: 'account-backup-keystore',
        component: Keystore,
      }),

      withMeta(2, {
        path: '/import/format',
        name: 'account-import',
        component: ImportFormat,
      }),
      withMeta(3, {
        path: '/import/keystore',
        name: 'account-import-keystore',
        component: ImportKeystore,
      }),
      withMeta(3, {
        path: '/import/wif',
        name: 'account-import-wif',
        component: ImportWif,
      }),
      withMeta(3, {
        path: '/import/seedphrase',
        name: 'account-import-seedphrase',
        component: ImportSeedphrase,
      }),
      withMeta(2, {
        path: 'connect-hw',
        name: 'account-connect-hw',
        component: ConnectHw,
      }),
      withMeta(3, {
        path: 'connect-hw/accounts',
        name: 'account-connect-hw-accounts',
        component: ConnectHwAccounts,
      }),
      withMeta(
        4,
        { path: 'networks', name: 'networks-list', component: NetworksList },
        R.NoTracking,
      ),
      withMeta(
        5,
        {
          path: 'networks/create',
          name: 'networks-create',
          component: NetworksUpdate,
        },
        R.NoTracking,
      ),
      withMeta(
        5,
        {
          path: 'networks',
          name: 'networks-update',
          component: NetworksUpdate,
        },
        R.NoTracking,
      ),
      {
        path: 'import/',
        name: 'account-imported',
        component: Create,
      },
    ],
  },
/*
  {
    path: '/account/:from/:contract/',
    component: AccountContainer,
    children: [
      {
        path: '',
        component: TabContainer,
        children: [
          {
            path: 'details',
            component: AccountDetailsContainer,
            alias: '',
            children: [
              { path: '', name: 'account-details', component: AccountDetails },
              {
                path: 'export/keystore',
                name: 'account-export-keystore',
                component: AccountExportKeystore,
              },
              {
                path: 'export/wif',
                name: 'account-export-wif',
                component: AccountExportWif,
              },
              {
                path: 'name/create',
                name: 'account-name-create',
                component: AccountNameCreate,
              },
              {
                path: 'name/:name/update',
                name: 'account-name-update',
                component: AccountNameUpdate,
              },
            ],
          },
          {
            path: 'send',
            component: AccountDetailsContainer,
            alias: '',
            children: [
              { path: '', name: 'account-send', component: AccountSend },
              {
                path: 'confirm',
                name: 'account-send-confirm',
                component: AccountSendConfirm,
              },
            ],
          },
          {
            path: 'history',
            name: 'account-history',
            component: AccountHistory,
          },
          { path: 'sign', name: 'account-sign', component: AccountSign },
        ],
      },
      {
        path: 'send/success/:hash',
        name: 'account-send-success',
        component: AccountSendSuccess,
      },
      // withMeta(1, {
      //   path: 'created',
      //   name: 'account-created',
      //   component: AccountCreated,
      // }),
      withMeta(2, {
        path: 'seedphrase',
        name: 'account-seedphrase-view',
        component: ViewSeedPhrase,
      }),
      withMeta(3, {
        path: 'seedphrase-verify',
        name: 'account-seedphrase-verify',
        component: VerifySeedPhrase,
      }),
      { path: 'remove', name: 'account-remove', component: AccountRemove },
    ],
  },
/*
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
        path: 'account/testnet.aergo.io/',
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
        ],
      },
    ],
  },
*/
];

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

/*
router.beforeEach(function(to, from, next) {
  console.log('from', from.name, 'to', to.name);
  next();
});*/
router.beforeEach(allowedToExitLockscreen);
router.beforeEach(loadPersistedRoute);
router.beforeEach(persistRoute);
router.afterEach(updateTitle);

export default router;
