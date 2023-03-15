import { Module } from 'vuex';
import { RootState } from './index';
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
    lastSeedPhrase: '',
  },

  // getters: {
  //   getNftInLocalStorage: (state, { account, network, contractAddress }) => {
  //     return state.accounts[account][`token`][network][contractAddress][`nftWallet`];
  //   },
  // },

  actions: {
    async tokens({ state, commit }) {
      if (!state.accounts[state.address]['token'][state.network]) {
        const init_tokens = {};
        init_tokens['AERGO'] = {
          hash: 'AERGO',
          meta: {
            name: 'AERGO',
            symbol: 'aergo',
            image: '',
            type: 'AERGO',
            decimals: 0,
          },
        };

        commit('setTokens', init_tokens);
        return state.accounts[state.address]['token'][state.network];
      } else {
        return state.accounts[state.address]['token'][state.network];
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
      let tokens = state.accounts[state.address]['token'][state.network];

      if (!tokens) {
        tokens = {};
      }
      tokens[token.hash] = token;

      commit('setTokens', tokens);
      // console.log('Add tokens', tokens);
    },

    async deleteToken({ state, commit }, token: string) {
      const tokens = state.accounts[state.address]['token'][state.network];
      delete tokens[token];
      commit('setTokens', tokens);
    },
  },

  mutations: {
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
        token: {},
      };
      console.log('addAccount', state.accounts[address]['nick']);
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

    setBackup(state, value: boolean) {
      state.accounts[state.address]['backup'] = value;
    },
    // setNftWallet(state, { nftWallet, hash }) {
    //   if (nftWallet.length === 0) {
    //     state.accounts[state.address].token[state.network][hash]['nftWallet'] = [];
    //   } else {
    //     state.accounts[state.address].token[state.network][hash]['nftWallet'] = nftWallet;
    //   }
    // },
  },
};

export default storeModule;
