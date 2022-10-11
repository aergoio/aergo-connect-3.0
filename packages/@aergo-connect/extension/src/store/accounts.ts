import { Module } from 'vuex';
import { RootState } from './index';
import { Account, serializeAccountSpec } from '@herajs/wallet';
import { Amount } from '@herajs/common';
import Vue from 'vue';

export interface AccountsState {
  accounts: {
    [key: string]: {
      address: string;
      nick: string;
      token: {
        [network: string]: any;
      };
    };
  };

  network: string;
  address: string;
  nick: string;
}

function getVueInstance(instance: any): Vue {
  // @ts-ignore
  return instance._vm as Vue;
}

const storeModule: Module<AccountsState, RootState> = {
  namespaced: true,

  state: {
    accounts: {},
    network: 'aergo.io',
    address: '',
    nick: '',
  },

  getters: {},

  actions: {

    async tokens({ state }) {
        return state.accounts[state.address]['token'][state.network];
    },

    async loadAccount({ state, commit }) {
      const vue = getVueInstance(this);
      const accounts = await vue.$background.getAccounts();

      if (accounts.length !== 0) {
        commit('setActiveAccount', accounts[0]?.data.spec.address);
        console.log('loadAccount', state.address);
        return true;
      } else {
        return false;
      }
    },

    async removeAccount({ state, commit }) {
      const vue = getVueInstance(this);
      vue.$background.removeAccount({ address: state.address, chainId: 'aergo.io' });
      commit('removeAccount');

      const accounts = vue.$background.getAccounts();
      if (accounts.length !== 0) commit('setActiveAccount', accounts[0]?.data.spec.address);
      else commit('setActiveAccount', '');
    },

    async addAccount({ commit }, address: string) {
      console.log('addAccount', address);
      await commit('addAccount', address);
      commit('setActiveAccount', address);
    },

    async addToken({ state, commit }, token: any) {
      var tokens = state.accounts[state.address]['token'][state.network];
      
      if (!tokens) {
         tokens = {} ;
      } ;
      tokens[token.hash] = token ;
      commit('setTokens', tokens);
      console.log('Add tokens', tokens);
    },

    async deleteToken({ state, commit }, token: any) {
      const tokens = state.accounts[state.address]['token'][state.network];
      delete tokens[token.hash];
      commit('setTokens', tokens);
      console.log('deleteToken', token);
    },
  },

  mutations: {
    setActiveAccount(state, address: string) {
      console.log('setActive in', address);

      if (!address) {
        state.address = '';
        state.nick = '';
        console.log('setActive', 'NO_ADDRESS_INPUT');
        return;
      }

      const vue = getVueInstance(this);
      vue.$background.setActiveAccount({ address: address, chainId: 'aergo.io' });
      state.address = address;
      console.log('accounts', state.accounts[address]);

      state.nick = state.accounts[address]['nick'];

      console.log('SetActiveAccount');
    },

    removeAccount(state) {
      delete state.accounts[state.address];
      state.address = '';
      state.nick = '';
    },

    addAccount(state, address: string) {
      state.accounts[address] = {
        address: address,
        nick: address.substr(0, 5) + '_nick',
        token: {},
      };
      console.log('addAccount out', state.accounts[address]['nick']);
    },

    setNick(state, nick: string) {
      state.accounts[state.address]['nick'] = nick;
      state.nick = nick;
    },

    setTokens(state, tokens: any) {
      state.accounts[state.address]['token'][state.network] = tokens;
      console.log('tokens', tokens);
    },

    setNetwork(state, network: string) {
      state.network = network;
    },

    setAccounts(state, accounts: Account[]) {},
  },
};

export default storeModule;
