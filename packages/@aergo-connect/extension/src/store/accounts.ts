import { Module } from 'vuex';
import { RootState } from './index';
import { Account, serializeAccountSpec } from '@herajs/wallet';
import Vue from 'vue';

export interface AccountsState {
  keys: string[];
  accounts: {
    [key: string]: Account;
  };
  lastSeedPhrase: string;
  balances: any;
  nick: string;
}

interface AccountSpec {
  address: string;
  chainId: string;
}

function getVueInstance(instance: any): Vue {
  // @ts-ignore
  return instance._vm as Vue;
}

const storeModule: Module<AccountsState, RootState> = {
  namespaced: true,
  state: {
    accounts: {},
    // Save keys extra for reactivity as the `accounts` object is not observable in the beginning.
    keys: [],
    lastSeedPhrase: '',
    balances: {},
    nick: '',
  },
  getters: {
    getAccount: state => (accountSpec: AccountSpec): Account | undefined => {
      const key = serializeAccountSpec(accountSpec);
      // Check state.keys to make the getter react to changes
      if (state.keys.indexOf(key) === -1) return undefined;
      return state.accounts[key];
    },
    getAccounts: state => () => {
      return state.accounts;
    },
  },
  actions: {
    async fetchAccounts({ commit }) {
      const vue = getVueInstance(this);
      const accounts = await vue.$background.getAccounts();
      commit('setAccounts', accounts);
    },
    async updateAccount({ commit }, { address, chainId }: AccountSpec) {
      const vue = getVueInstance(this);
      vue.$background.setActiveAccount({ address, chainId });
      const account = await vue.$background.syncAccountState({
        address,
        chainId,
      });
      commit('setAccounts', [account]);
    },

    // 시연용
    async fetchAccountBalances({ commit }, { address, chainId }: AccountSpec) {
      const vue = getVueInstance(this);
      //vue.$background.setActiveAccount({ address, chainId });
      const balances = await vue.$background.getAccountBalance({
        address,
        chainId,
      });
      commit('setAccountBalances', balances);
    },
  },
  mutations: {
    setAccountBalances(state, balances: any) {
      console.log('setAccountBalances');
      console.log(balances);
      state.balances = balances;
    },

    setAccounts(state, accounts: Account[]) {
      for (const account of accounts) {
        state.accounts[account.key] = account;
      }
      //TODO nick key값으로 넣어줘야함.
      const newKeys = accounts.map(acc => acc.key).filter(key => state.keys.indexOf(key) === -1);
      state.keys.push(...newKeys);
    },
    removeAccounts(state, accountSpecs: AccountSpec[]) {
      const keys = accountSpecs.map(spec => serializeAccountSpec(spec));
      state.keys = state.keys.filter(key => keys.indexOf(key) === -1);
      for (const key of keys) {
        delete state.accounts[key];
      }
    },
    setSeedPhrase(state, phrase: string) {
      state.lastSeedPhrase = phrase;
    },
    setAccountNick(state, nick: string) {
      state.nick = nick;
    },
  },
};

export default storeModule;
