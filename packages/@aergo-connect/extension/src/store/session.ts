import { Module } from 'vuex';
import { RootState } from './index';
import { Account, serializeAccountSpec } from '@herajs/wallet';
import { Amount } from '@herajs/common';
import Vue from 'vue';
import store from '../store';

export interface SessionState {
  tokens: any;
  token: any;
  aergoBalance: number;
  tokenBalance: number;
}

function getVueInstance(instance: any): Vue {
  // @ts-ignore
  return instance._vm as Vue;
}

const storeModule: Module<SessionState, RootState> = {
  namespaced: true,

  state: {
    token: {},
    tokens: [],
    aergoBalance: 0,
    tokenBalance: 0,
  },

  actions: {
    aergoBalance({ state }) {
      return state.aergoBalance;
    },

    tokenBalance({ state }, address: string) {
      return state.tokens[address]['balance'];
    },

    async updateBalances({ state, commit }) {
      const vue = getVueInstance(this);
      const val = await vue.$background.getAccountState({
        address: store.state.accounts.address,
        chainId: store.state.accounts.network,
      });

      const result = await new Amount(val.balance).formatNumber('aergo');
      await commit('setAergoBalance', result);

      const resp = await fetch(
        `https://api.aergoscan.io/${store.state.accounts.network}/v2/tokenBalance?q=${store.state.accounts.address}`,
      );

      const response = await resp.json();

      if (response.error) return;
      await commit('setTokenBalance', response.hits);

      console.log('UPDATE BAL', state.aergoBalance, state.tokens);
    },

    async initState({ state, commit }) {
      const tokens = await store.dispatch('accounts/tokens');
      console.log('INIT STATE', tokens);

      console.log(
        'fetch',
        `https://api.aergoscan.io/${store.state.accounts.network}/v2/tokenBalance?q=${store.state.accounts.address}`,
      );
      const resp = await fetch(
        `https://api.aergoscan.io/${store.state.accounts.network}/v2/tokenBalance?q=${store.state.accounts.address}`,
      );

      const response = await resp.json();

      await commit('setTokens', response.hits, tokens);
      await store.dispatch('session/updateBalances');

      console.log('INIT tokens', state.tokens);
    },
  },

  mutations: {
    setTokenBalance(state, balances: any) {
      Object.keys(state.tokens).forEach((key) => {
        const bal = balances.find((element) => element.meta.address == state.tokens[key].hash);
        if (bal) {
          state.tokens[key]['balance'] =
            bal.meta.balance_float / Math.pow(10, bal.token.meta.decimals);
        } else {
          state.tokens[key]['balance'] = 0;
        }
      });
    },

    setTokens(state, balances: any, tokens: any) {
      console.log('SET TOKENS Balances', tokens, balances);
      if (tokens) state.tokens = tokens;
      else state.tokens = [];

      if (balances)
        balances.forEach((e) => {
          if (e.token.meta.image) {
            console.log('ADD TOKEN', e.token.hash);
            state.tokens.push(e.token);
          }
        });
    },

    setAergoBalance(state, val: number) {
      state.aergoBalance = val;
      //      console.log("aergoBal", state.aergoBalance) ;
    },

    setToken(state, token: any) {
      state.token = token;
      //      console.log("token", state.tokens) ;
    },
  },
};

export default storeModule;
