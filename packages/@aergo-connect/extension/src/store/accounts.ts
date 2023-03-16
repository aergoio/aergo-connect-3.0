import { Module } from 'vuex';
import { RootState } from './index';
import { Amount } from '@herajs/common';
import Vue from 'vue';
import store from '../store';

export interface AccountsState {
  accounts: {
    [key: string]: {
      address: string;
      nick: string;
      tokens: {
        mainnet: any;
        testnet: any;
        alpha: any;
        // [network: string]: any;
      };
    };
  };

  network: string;
  address: string;
  nick: string;
  selectedToken: string;
  option: string;
  lastSeedPhrase: string;
}

function getVueInstance(instance: any): Vue {
  // @ts-ignore
  return instance._vm as Vue;
}

const storeModule: Module<AccountsState, RootState> = {
  namespaced: true,

  state: {
    accounts: {},
    network: 'testnet',
    address: '',
    nick: '',
    selectedToken: 'AERGO',
    option: 'token',
    lastSeedPhrase: '',
  },

  getters: {
    getTokens: (state) => {
      return state.accounts[state.address][`tokens`][state.network];
    },
  },

  actions: {
    async initState({ state, commit }) {
      const vue = getVueInstance(this);
      const val = await vue.$background.getAccountState({
        address: state.address,
        chainId: state.network,
      });
      const aergoBalance = await new Amount(val.balance).formatNumber('aergo');
      const isAlpha = state.network === 'alpha' ? 'api-alpha' : 'api';
      try {
        if (!state.accounts[state.address]['tokens'][state.network]['AERGO']) {
          await commit('setAergo');
        }

        const resp = await fetch(
          `https://${isAlpha}.aergoscan.io/${state.network}/v2/tokenBalance?q=${state.address}`,
        );

        const response = await resp.json();
        console.log(response, 'response?');
        const balances = { aergo: aergoBalance, others: response.hits };

        // if (response.error) return;
        // Default Token : 'AERGO'
        // await commit('setToken', state[state.address][`tokens`][state.network]['AERGO']);

        await commit('setTokenBalance', balances);
        await commit('setSeedPhrase', '');
      } catch (e) {
        console.error(e, 'error?');
        return 'initError';
      }
    },

    async updateAccount({ commit }, { address, chainId }) {
      const vue = getVueInstance(this);
      vue.$background.setActiveAccount({ address, chainId });
      const account = await vue.$background.syncAccountState({ address, chainId });
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

    async removeAccount({ state, commit }, address: string) {
      const vue = getVueInstance(this);
      await vue.$background.removeAccount({ address: state.address, chainId: 'aergo.io' });
      commit('removeAccount');

      const accounts = await vue.$background.getAccounts();
      if (accounts.length !== 0) commit('setActiveAccount', accounts[0]?.data.spec.address);
      else commit('setActiveAccount', '');
    },

    async addAccount({ commit }, address: string) {
      console.log('addAccount', address);
      await commit('addAccount', address);
      commit('setActiveAccount', address);
    },

    async addToken({ state, commit }, token: any) {
      let tokens = state.accounts[state.address]['tokens'][state.network];

      if (!tokens) {
        tokens = {};
      }
      console.log(token, 'token?');
      if (token.meta.type === 'ARC2') {
        token[`dropdownState`] = false;
        token[`balance`] = '0';
      }
      tokens[token.hash] = token;

      commit('setTokens', tokens);
      // console.log('Add tokens', tokens);
    },

    async deleteToken({ state, commit }, token: string) {
      const tokens = state.accounts[state.address]['tokens'][state.network];
      delete tokens[token];
      commit('setTokens', tokens);
    },
  },

  mutations: {
    setAergo(state) {
      state.accounts[state.address]['tokens'][state.network][`AERGO`] = {
        hash: 'AERGO',
        meta: {
          name: 'AERGO',
          symbol: 'aergo',
          image: '',
          type: 'AERGO',
          decimals: 0,
        },
        balance: '0',
      };
    },

    setTokenBalance(state, balances: any) {
      console.log(balances, 'balances?');
      // others
      Object.keys(state.accounts[state.address][`tokens`][state.network]).forEach((hash) => {
        const bal = balances.others.find((element: any) => element.meta.address == hash);
        if (bal) {
          if (bal.token.meta.type === 'ARC2') {
            state.accounts[state.address][`tokens`][state.network][hash]['balance'] =
              bal.meta.balance;
          } else {
            state.accounts[state.address][`tokens`][state.network][hash]['balance'] =
              Number(bal.meta.balance) / Math.pow(10, bal.token.meta.decimals);
            bal.meta.balance_float;
          }
        } else {
          state.accounts[state.address][`tokens`][state.network][hash]['balance'] = 0;
        }
      });
      if (balances['aergo']) {
        state.accounts[state.address][`tokens`][state.network]['AERGO'] = {
          ...state.accounts[state.address][`tokens`][state.network]['AERGO'],
          balance: balances['aergo'],
        };
      }
    },

    setActiveAccount(state, address: string) {
      if (!address) {
        state.address = '';
        state.nick = '';
        console.log('setActive', 'NO_ADDRESS_INPUT');
        return;
      }

      const vue = getVueInstance(this);
      vue.$background.setActiveAccount({ address: address, chainId: 'aergo.io' });
      state.address = address;
      state.nick = state.accounts[address]['nick'];

      console.log('SetActiveAccount', address);
    },

    removeAccount(state) {
      delete state.accounts[state.address];
      state.address = '';
      state.nick = '';
    },

    setSeedPhrase(state, phrase: string) {
      state.lastSeedPhrase = phrase;
    },

    addAccount(state, address: string) {
      state.accounts[address] = {
        address: address,
        nick: `${address.substr(0, 5)}_${address.substr(-5)}`,
        tokens: { mainnet: {}, testnet: {}, alpha: {} },
      };
      console.log('addAccount', state.accounts[address]['nick']);
    },

    setNick(state, nick: string) {
      state.accounts[state.address]['nick'] = nick;
      state.nick = nick;
    },

    setTokens(state, tokens: any) {
      state.accounts[state.address]['tokens'][state.network] = tokens;
      console.log('tokens', tokens);
    },
    setSelectedToken(state, token: any) {
      state.selectedToken = token;
    },
    setOption(state, option: string) {
      state.option = option;
    },
    setNetwork(state, network: string) {
      state.network = network;
    },

    setBackup(state, value: boolean) {
      state.accounts[state.address]['backup'] = value;
    },
    removeToken(state, token: any) {
      state.selectedToken = '';
      delete state.accounts[state.address].tokens[state.network][token];
    },
    handleDropdownState(state, hash) {
      console.log(state, 'state');
      console.log(hash, 'hash');
      const copiedObject = { ...state.accounts[state.address].tokens[state.network][hash] };
      const dropdownClickNum = store.state.ui.dropdownClickNum;
      if (copiedObject[`dropdownState`]) {
        copiedObject['dropdownState'] = false;
        store.commit('ui/setDropdownClickNum', dropdownClickNum - 1);
      } else {
        copiedObject['dropdownState'] = true;
        store.commit('ui/setDropdownClickNum', dropdownClickNum + 1);
      }
      state.accounts[state.address][`tokens`][state.network][hash] = copiedObject;
    },
    // setNftWallet(state, { nftWallet, hash }) {
    //   if (nftWallet.length === 0) {
    //     state.accounts[state.address].token[state.network][hash]['nftWallet'] = [];
    //   } else {
    //     state.accounts[state.address].token[state.network][hash]['nftWallet'] = nftWallet;
    //   }
    // },
    addNftToLocalStorage(state, userNftData) {
      const contractAddress = userNftData.meta.address;
      state.accounts[state.address][`tokens`][state.network][contractAddress][`nftWallet`] = [
        ...state.accounts[state.address][`tokens`][state.network][contractAddress][`nftWallet`],
        userNftData,
      ];
      const dropdownClickNum = store.state.ui.dropdownClickNum;
      store.commit('ui/setDropdownClickNum', dropdownClickNum + 1);
    },
    updateNftInLocalStorage(state, changedNftData) {
      const contractAddress = changedNftData.meta.address;
      state.accounts[state.address].tokens[state.network][contractAddress][`nftWallet`] = [
        ...state.accounts[state.address][`tokens`][state.network][contractAddress][`nftWallet`],
        changedNftData,
      ];
    },
    deleteNftInLocalStorage(state, userNftData) {
      const contractAddress = userNftData.meta.address;
      const deletedNftWallet = state.accounts[state.address].tokens[state.network][contractAddress][
        `nftWallet`
      ].filter((nft: any) => nft.meta.token_id !== userNftData.meta.token_id);
      console.log(deletedNftWallet, 'deletedNftWallet?');
      if (deletedNftWallet.length === 0) {
        store.commit('accounts/removeToken', contractAddress);
      } else {
        state.accounts[state.address].tokens[state.network][contractAddress].nftWallet =
          deletedNftWallet;
      }
      const dropdownClickNum = store.state.ui.dropdownClickNum;
      store.commit('ui/setDropdownClickNum', dropdownClickNum - 1);
    },
  },
};

export default storeModule;
