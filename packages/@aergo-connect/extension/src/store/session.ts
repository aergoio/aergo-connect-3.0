import { Module } from 'vuex';
import { RootState } from './index';
import { Account, serializeAccountSpec } from '@herajs/wallet';
import { Amount } from '@herajs/common';
import Vue from 'vue';
import store from '../store';
import { NftInventoryType, NftTokenType } from '@/types';
import { before } from 'lodash';

interface NftSessionType extends NftTokenType {
  dropdownsState: boolean;
  nftWallet: NftInventoryType[];
}
export interface SessionState {
  tokens: Record<string, any>;
  token: string;
  currentPage: string;
  previousPage: string;
  option: string;
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
    option: 'token',
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
      console.log(response, 'response');
      if (response.error) return;

      const balances = { aergo: aergoBalance, others: response.hits };

      await commit('setTokenBalance', balances);
    },

    async initState({ state, commit }) {
      try {
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
      } catch (e) {
        console.error(e);
      }
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

    setOption(state, option: string) {
      state.option = option;
    },
    removeToken(state, token: any) {
      state.token = '';
      delete state.tokens[token];
    },

    addNftToLocalStorage(state, userNftData) {
      const beforeNftData = JSON.parse(
        localStorage.getItem(
          `${userNftData.meta.account}_${store.state.accounts.network}_${userNftData.meta.address}`,
        ) || '{}',
      );
      const array =
        Object.values(beforeNftData).length !== 0 ? [...beforeNftData, userNftData] : [userNftData];
      localStorage.setItem(
        `${userNftData.meta.account}_${store.state.accounts.network}_${userNftData.meta.address}`,
        JSON.stringify(array),
      );
    },
    deleteNftInLocalStorage(state, userNftData) {
      const beforeNftData = JSON.parse(
        localStorage.getItem(
          `${userNftData.meta.account}_${store.state.accounts.network}_${userNftData.meta.address}`,
        ) || '{}',
      );
      const deleteUserNftDataInLocalStorage = beforeNftData.filter(
        (nft: any) => nft.meta.token_id !== userNftData.meta.token_id,
      );
      localStorage.setItem(
        `${userNftData.meta.account}_${store.state.accounts.network}_${userNftData.meta.address}`,
        JSON.stringify(deleteUserNftDataInLocalStorage),
      );
    },
    handleDropdownState(state, hash) {
      const copiedObject = { ...state.tokens[hash] };
      const dropdownClickNum = store.state.ui.dropdownClickNum;
      if (copiedObject.dropdownState) {
        copiedObject['dropdownState'] = false;
        store.commit('ui/setDropdownClickNum', dropdownClickNum - 1);
      } else {
        copiedObject['dropdownState'] = true;
        store.commit('ui/setDropdownClickNum', dropdownClickNum + 1);
      }
      state.tokens[hash] = copiedObject;
    },
  },
};

export default storeModule;
