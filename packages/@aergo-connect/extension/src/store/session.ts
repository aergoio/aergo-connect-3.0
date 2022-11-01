import { Module } from 'vuex';
import { RootState } from './index';
import { Account, serializeAccountSpec } from '@herajs/wallet';
import { Amount } from '@herajs/common';
import Vue from 'vue';
import store from '../store';

export interface SessionState {
  tokens: Record<string, any>;
  token: string;
  currentPage: string;
  previousPage: string;
  option: Record<string, any>;
}

function getVueInstance(instance: any): Vue {
  // @ts-ignore
  return instance._vm as Vue;
}

const storeModule: Module<SessionState, RootState> = {
  namespaced: true,

  state: {
    token: 'AERGO',
    tokens: {},
    currentPage: '',
    previousPage: '',
    option: '',
  },

  actions: {
    tokenBalance({ state }, address: string) {
      return state.tokens[address]['balance'];
    },

    async updateBalances({ state, commit }) {
      const vue = getVueInstance(this);
      const val = await vue.$background.getAccountState({
        address: store.state.accounts.address,
        chainId: store.state.accounts.network,
      });

      const aergoBalance = await new Amount(val.balance).formatNumber('aergo');

      const prefix = store.state.accounts.network === 'alpha' ? 'api-alpha' : 'api';
      const resp = await fetch(
        `https://${prefix}.aergoscan.io/${store.state.accounts.network}/v2/tokenBalance?q=${store.state.accounts.address}`,
      );

      const response = await resp.json();

      //      if (response.error) return;
      //      await commit('setTokenBalance', response.hits);

      const balances = { aergo: aergoBalance, others: response.hits };

      await commit('setTokenBalance', balances);
    },

    async initState({ state, commit }) {
      const tokens = await store.dispatch('accounts/tokens');
      await commit('setTokens', tokens);

      console.log(
        'fetch',
        `https://api.aergoscan.io/${store.state.accounts.network}/v2/tokenBalance?q=${store.state.accounts.address}`,
      );

      const prefix = store.state.accounts.network === 'alpha' ? 'api-alpha' : 'api';

      const resp = await fetch(
        `https://${prefix}.aergoscan.io/${store.state.accounts.network}/v2/tokenBalance?q=${store.state.accounts.address}`,
      );

      const response = await resp.json();

      await commit('updateTokens', response.hits);
      await store.dispatch('session/updateBalances');

      // Default Token : 'AERGO'
      // await commit('setToken', state.tokens['AERGO']);

      await store.commit('accounts/setSeedPhrase', '');
    },
  },

  mutations: {
    setTokenBalance(state, balances: any) {
      // others
      Object.keys(state.tokens).forEach((hash) => {
        const bal = balances.others.find((element) => element.meta.address == hash);
        if (bal) {
          if (bal.token.meta.type === 'ARC2') state.tokens[hash]['balance'] = bal.meta.balance;
          else
            state.tokens[hash]['balance'] =
              Number(bal.meta.balance) / Math.pow(10, bal.token.meta.decimals);
          bal.meta.balance_float;
        } else {
          state.tokens[hash]['balance'] = 0;
        }
      });

      state.tokens['AERGO']['balance'] = balances['aergo'];
    },

    setTokens(state, tokens: any) {
      if (tokens) state.tokens = tokens;
      else state.tokens = {};
    },

    updateTokens(state, balances: any) {
      if (balances)
        balances.forEach((e) => {
          if (e.token.meta.image) {
            console.log('ADD TOKEN', e.token.hash);
            state.tokens[e.token.hash] = e.token;
          }
        });
    },

    setToken(state, token: any) {
      state.token = token;
    },

    setCurrentPage(state, page: string) {
      state.currentPage = page;
    },

    setPreviousPage(state, page: string) {
      state.previousPage = page;
    },

    setOption(state, option: string) {
      state.option = option;
    },
    removeToken(state, token: any) {
      state.token = '';
      delete state.tokens[token];
    },
  },
};

export default storeModule;
