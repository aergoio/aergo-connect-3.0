import { Module } from 'vuex';
import { RootState } from './index';
import { Account, serializeAccountSpec } from '@herajs/wallet';
import { Amount } from '@herajs/common';
import Vue from 'vue';
import store from '../store';

export interface SessionState {
  tokens: any ;
  token: any ;
  balances: any;
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
    tokens: [], 
    token: {},
    balances: [],
    aergoBalance: 0,
    tokenBalance: 0,
  },

  getters: {},

  actions: {

    async aergoBalance({ state, commit }) {
      const vue = await getVueInstance(this);
      const val = await vue.$background.getAccountState({
        address: store.state.accounts.address,
        chainId: store.state.accounts.network,
      });
      const result = await new Amount(val.balance).formatNumber('aergo');
      console.log('aergoBalance', result);
      commit('setAergoBalance', result) ;
      return result ;
    },

    async tokenBalance({ state, commit }, token: string) {

      console.log('BALANCE', state.balances, token);
      const result = await state.balances.find(element => element.meta.address == token);
      if (!result) {
//        commit('setTokenBalance', 0) ;
        return 0;
      }
      else {
        const value = result.meta.balance_float / Math.pow(10, result.token.meta.decimals);
//        commit('setTokenBalance', value) ;
        return value;
      }
    },

    async InitState({state, commit}) {

      const tokens = await store.dispatch('accounts/tokens');
      commit('setTokens', tokens);

      const resp = await fetch(
        `https://api.aergoscan.io/${store.state.accounts.network}/v2/tokenBalance?q=${store.state.accounts.address}`,
      ) ;
      const response = await resp.json();

      if (response.error) commit('setState', []) ;
      else commit('setState', response.hits);

    },
  },

  mutations: {

    setState(state, balances: any) {

      state.balances = balances ;
      console.log("balance structure", state.balances) ;

      state.balances.forEach(e => { if (e.token.image) state.tokens.push(e.token) }) ;
      console.log("tokens structure", state.tokens) ;
    },

    setToken(state, token: any) {
      state.token = token ;
      console.log("token", state.tokens) ;
    },

    setTokenBalance(state, val: number) {
      state.tokenBalance = val ;
      console.log("tokenBal", state.tokenBalance) ;
    },

    setAergoBalance(state, val: number) {
      state.aergoBalance = val ;
      console.log("aergoBal", state.aergoBalance) ;
    },

    setTokens(state, tokens: any) {
      state.tokens = tokens ;
      console.log("tokens", state.tokens) ;
    },
  },
};

export default storeModule;
