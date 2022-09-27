import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { loadPersistedRoute, allowedToExitLockscreen, persistRoute, updateTitle } from './guards';

import AccountsContainer from '../views/accounts/Container.vue';
import Lockscreen from '../views/accounts/Lockscreen.vue';
import Welcome from '../views/accounts/Welcome.vue';
import Register from '../views/accounts/Register.vue';
import Setup from '../views/accounts/Setup.vue';
import Create from '../views/accounts/Create.vue';
import Home from '../views/accounts/Home.vue';

import Import from '../views/accounts/import/1-Network.vue';
import ImportFormat from '../views/accounts/import/2-Format.vue';
import ImportKeystore from '../views/accounts/import/3a-Keystore.vue';
import ImportWif from '../views/accounts/import/3b-Wif.vue';
import ImportSeedphrase from '../views/accounts/import/3c-Seedphrase.vue';

import ImportAsset from '../views/accounts/ImportAsset.vue';

import ConnectHw from '../views/accounts/connect-hw/1-Network.vue';
import ConnectHwAccounts from '../views/accounts/connect-hw/2-Accounts.vue';
import AccountsList from '../views/accounts/List.vue';
import BalanceList from '../views/accounts/balance/List.vue';
import Settings from '../views/accounts/Settings.vue';
import NetworksList from '../views/accounts/networks/List.vue';
import NetworksUpdate from '../views/accounts/networks/Update.vue';

import BackupPrivateKey from '../views/account/export/BackupPrivateKey.vue';
import MnemonicSeedPhrase from '../views/account/export/MnemonicSeedPhrase.vue';
import EncryptedPrivateKey from '../views/account/export/EncryptedPrivateKey.vue';
import Keystore from '../views/account/export/Keystore.vue';
import ExportWif from '../views/account/export/Wif.vue';

import AccountContainer from '../views/account/Container.vue';
import AccountCreated from '../views/account/Created.vue';
import ViewSeedPhrase from '../views/account/seedphrase/View.vue';
import VerifySeedPhrase from '../views/account/seedphrase/Verify.vue';
import AccountImported from '../views/account/Imported.vue';
import TabContainer from '../views/account/TabContainer.vue';
import AccountSend from '../views/account/send/1-Send.vue';
import AccountSendConfirm from '../views/account/send/2-Confirm.vue';
import AccountSendSuccess from '../views/account/send/3-Success.vue';
import AccountHistory from '../views/account/History.vue';
import AccountDetailsContainer from '../views/account/details/Container.vue';
import AccountDetails from '../views/account/details/Details.vue';
import AccountExportKeystore from '../views/account/export/Keystore.vue';
import AccountExportWif from '../views/account/export/Wif.vue';
import AccountNameCreate from '../views/account/name/Create.vue';
import AccountNameUpdate from '../views/account/name/Update.vue';
import AccountRemove from '../views/account/Remove.vue';
import AccountSign from '../views/account/Sign.vue';

import RequestContainer from '../views/request/Container.vue';
import RequestSelectAccount from '../views/request/SelectAccount.vue';
import RequestSelectAction from '../views/request/SelectAction.vue';
import RequestAccountContainer from '../views/request/AccountContainer.vue';
import RequestAccountList from '../views/request/AccountList.vue';
import RequestAddress from '../views/request/Address.vue';
import RequestSign from '../views/request/Sign.vue';
import RequestSendTx from '../views/request/Send.vue';
import RequestSignTx from '../views/request/SignTx.vue';

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

      withMeta(1, {
        path: 'list/:chainId/:address',
        name: 'accounts-list-address',
        component: Home,
      }),
      withMeta(2, {
        path: 'list/:chainId/:address/import/asset',
        name: 'import-asset',
        component: ImportAsset,
      }), // 시연용
      withMeta(2, {
        path: 'balance/:chainId/:address',
        name: 'balance-list',
        component: BalanceList,
      }), // 시연용

      withMeta(2, {
        path: '/account/:chainId/:address/create',
        name: 'account-create',
        component: Create,
      }),

      withMeta(3, {
        path: '/account/:chainId/:address/backup ',
        name: 'account-backup',
        component: BackupPrivateKey,
      }),

      withMeta(4, {
        path: '/account/:chainId/:address/backup/mnemonic ',
        name: 'account-backup-mnemonic',
        component: MnemonicSeedPhrase,
      }),

      withMeta(4, {
        path: '/account/:chainId/:address/backup/encrypted ',
        name: 'account-backup-encrypted',
        component: ExportWif,
      }),

      withMeta(4, {
        path: '/account/:chainId/:address/backup/keystore ',
        name: 'account-backup-keystore',
        component: Keystore,
      }),

      withMeta(2, {
        path: 'import/format',
        name: 'account-import',
        component: ImportFormat,
      }),
      withMeta(3, {
        path: 'import/keystore',
        name: 'account-import-keystore',
        component: ImportKeystore,
      }),
      withMeta(3, {
        path: 'import/wif',
        name: 'account-import-wif',
        component: ImportWif,
      }),
      withMeta(3, {
        path: 'import/seedphrase',
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
          path: 'networks/:chainId',
          name: 'networks-update',
          component: NetworksUpdate,
        },
        R.NoTracking,
      ),
    ],
  },
  {
    path: '/account/:chainId/:address/:from/:contract/',
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
      {
        path: 'imported',
        name: 'account-imported',
        component: Create,
      },
      { path: 'remove', name: 'account-remove', component: AccountRemove },
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
        path: 'account/:chainId/:address/',
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
