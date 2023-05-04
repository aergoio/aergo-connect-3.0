import { ChainConfigs, ChainConfig } from './../config';
import { Module } from 'vuex';
import { RootState } from './index';
import { Amount } from '@herajs/common';
// import { Account } from '@herajs/wallet';
import Vue from 'vue';
import store from '../store';
import { getScanApiUrl } from '@/utils/chain-urls';

export interface AccountsState {
  accounts: {
    [key: string]: {
      address: string;
      nick: string;
      tokens: {
        'aergo.io': any;
        'testnet.aergo.io': any;
        'alpha.aergo.io': any;
        [chainId: string]: any;
      };
    };
  };
  // keys: string[];
  chainId: string;
  chainLabel: string;
  networksPath: ChainConfig[];
  address: string;
  nick: string;
  selectedToken: string;
  option: string;
  lastSeedPhrase: string;
  lastestSendHash: string;
}

function getVueInstance(instance: any): Vue {
  // @ts-ignore
  return instance._vm as Vue;
}

const storeModule: Module<AccountsState, RootState> = {
  namespaced: true,

  state: {
    accounts: {},
    // keys: [],
    chainId: 'aergo.io',
    chainLabel: 'mainnet',
    networksPath: ChainConfigs,
    address: '',
    nick: '',
    selectedToken: 'AERGO',
    option: 'token',
    lastSeedPhrase: '',
    lastestSendHash: '',
  },

  getters: {
    getTokens: (state) => {
      return state.accounts[state.address][`tokens`][state.chainId];
    },
  },

  actions: {
    async initState({ state, commit }) {
      const vue = getVueInstance(this);
      const accountState = await vue.$background.getAccountState({
        address: state.address,
        chainId: state.chainId,
      });
      const aergoBalance = await new Amount(accountState.balance).formatNumber('aergo');
      const aergoChainIds = ['aergo.io', 'testnet.aergo.io', 'alpha.aergo.io'];
      const isScanApiUrl = state.networksPath.filter(
        (networkPath) => networkPath.chainId === state.chainId,
      )[0].scanApiUrl;

      if (!aergoChainIds.includes(state.chainId) && !isScanApiUrl) {
        const balances = { aergo: aergoBalance, others: [] };
        await commit('setTokenBalance', balances);
      } else {
        const scanApiUrl = getScanApiUrl(state);
        const getTokenBalanceUrl = `${scanApiUrl}/tokenBalance?q=${state.address}`;
        const resp = await fetch(getTokenBalanceUrl);
        const response = await resp.json();
        const balances = { aergo: aergoBalance, others: response.hits };
        await commit('setTokenBalance', balances);
        await commit('setSeedPhrase', '');
      }
    },

    async updateAccount({ commit }, { address, chainId }) {
      const vue = getVueInstance(this);
      vue.$background.setActiveAccount({ address, chainId });
      const account = await vue.$background.syncAccountState({ address, chainId });
      console.log(account, 'updatedAccount');
      // console.log(account, 'account updated?');
    },

    async loadAccount({ state, commit }) {
      const vue = getVueInstance(this);
      const accounts = await vue.$background.getAccounts();

      if (accounts.length !== 0) {
        commit('setActiveAccount', accounts[0]?.data.spec.address);
        // console.log('loadAccount', state.address);
        return true;
      } else {
        return false;
      }
    },

    async removeAccount({ state, commit }, address: string) {
      const vue = getVueInstance(this);
      await vue.$background.removeAccount({ address: state.address, chainId: state.chainId });
      commit('removeAccount');

      const accounts = await vue.$background.getAccounts();
      if (accounts.length !== 0) commit('setActiveAccount', accounts[0]?.data.spec.address);
      else commit('setActiveAccount', '');
    },

    async addAccount({ commit }, address: string) {
      // console.log('addAccount', address);
      await commit('addAccount', address);
      commit('setActiveAccount', address);
    },

    async addToken({ state, commit }, token: any) {
      let tokens = state.accounts[state.address]['tokens'][state.chainId];

      if (!tokens) {
        tokens = {};
      }
      // console.log(token, 'token?');
      // if (token.meta.type === 'ARC2') {
      //   token[`dropdownState`] = false;
      //   token[`balance`] = '0';
      // }
      tokens[token.hash] = token;

      commit('setTokens', tokens);
      // console.log('Add tokens', tokens);
    },

    async deleteToken({ state, commit }, token: string) {
      const tokens = state.accounts[state.address]['tokens'][state.chainId];
      delete tokens[token];
      commit('setTokens', tokens);
    },
  },

  mutations: {
    setAergo(state) {
      state.accounts[state.address]['tokens'][state.chainId][`AERGO`] = {
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
      // others
      Object.keys(state.accounts[state.address][`tokens`][state.chainId]).forEach((hash) => {
        const bal = balances.others.find((element: any) => element.meta.address == hash);
        if (bal) {
          if (bal.token.meta.type === 'ARC2') {
            state.accounts[state.address][`tokens`][state.chainId][hash]['balance'] =
              bal.meta.balance;
          } else {
            state.accounts[state.address][`tokens`][state.chainId][hash]['balance'] =
              Number(bal.meta.balance) / Math.pow(10, bal.token.meta.decimals);
            bal.meta.balance_float;
          }
        } else {
          state.accounts[state.address][`tokens`][state.chainId][hash]['balance'] = 0;
        }
      });
      if (balances['aergo']) {
        state.accounts[state.address][`tokens`][state.chainId]['AERGO'] = {
          ...state.accounts[state.address][`tokens`][state.chainId]['AERGO'],
          balance: balances['aergo'],
        };
      }
    },

    setActiveAccount(state, address: string) {
      if (!address) {
        state.address = '';
        state.nick = '';
        // console.log('setActive', 'NO_ADDRESS_INPUT');
        return;
      }
      const vue = getVueInstance(this);
      vue.$background.setActiveAccount({ address: address, chainId: state.chainId });
      state.address = address;
      state.nick = state.accounts[address]['nick'];

      // console.log('SetActiveAccount', address);
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
        tokens: {
          'aergo.io': {
            AERGO: {
              hash: 'AERGO',
              meta: {
                name: 'AERGO',
                symbol: 'aergo',
                image: '',
                type: 'AERGO',
                decimals: 0,
              },
              balance: '0',
            },
          },
          'testnet.aergo.io': {
            AERGO: {
              hash: 'AERGO',
              meta: {
                name: 'AERGO',
                symbol: 'aergo',
                image: '',
                type: 'AERGO',
                decimals: 0,
              },
              balance: '0',
            },
          },
          'alpha.aergo.io': {
            AERGO: {
              hash: 'AERGO',
              meta: {
                name: 'AERGO',
                symbol: 'aergo',
                image: '',
                type: 'AERGO',
                decimals: 0,
              },
              balance: '0',
            },
          },
        },
      };
      const setAergo = {
        AERGO: {
          hash: 'AERGO',
          meta: {
            name: 'AERGO',
            symbol: 'aergo',
            image: '',
            type: 'AERGO',
            decimals: 0,
          },
          balance: '0',
        },
      };
      if (!state.accounts[address].tokens[state.chainId]) {
        state.accounts[address].tokens[state.chainId] = setAergo;
      }
    },

    setNick(state, nick: string) {
      state.accounts[state.address]['nick'] = nick;
      state.nick = nick;
    },

    setTokens(state, tokens: any) {
      state.accounts[state.address]['tokens'][state.chainId] = tokens;
      // console.log('tokens', tokens);
    },
    setSelectedToken(state, token: any) {
      state.selectedToken = token;
    },
    setOption(state, option: string) {
      state.option = option;
    },
    setChainNetworkLabel(state, label: string) {
      state.networkLabel = label;
    },
    async setChainId(state, chainId: string) {
      state.chainId = chainId;
      const setAergo = {
        AERGO: {
          hash: 'AERGO',
          meta: {
            name: 'AERGO',
            symbol: 'aergo',
            image: '',
            type: 'AERGO',
            decimals: 0,
          },
          balance: '0',
        },
      };
      if (!state.accounts[state.address].tokens[chainId]) {
        state.accounts[state.address].tokens[chainId] = setAergo;
      }
    },
    setChainLabel(state, chainLabel: string) {
      state.chainLabel = chainLabel;
    },
    setBackup(state, value: boolean) {
      state.accounts[state.address]['backup'] = value;
    },
    removeToken(state, token: any) {
      state.selectedToken = '';
      delete state.accounts[state.address].tokens[state.chainId][token];
    },
    handleDropdownState(state, { hash, dropdownState }) {
      state.accounts[state.address][`tokens`][state.chainId][hash] = {
        ...state.accounts[state.address][`tokens`][state.chainId][hash],
        dropdownState,
      };
    },
    // setNftWallet(state, { nftWallet, hash }) {
    //   if (nftWallet.length === 0) {
    //     state.accounts[state.address].token[state.chainId][hash]['nftWallet'] = [];
    //   } else {
    //     state.accounts[state.address].token[state.chainId][hash]['nftWallet'] = nftWallet;
    //   }
    // },
    addNftToLocalStorage(state, userNftData) {
      const contractAddress = userNftData.meta.address;
      state.accounts[state.address][`tokens`][state.chainId][contractAddress][`nftWallet`] = [
        ...state.accounts[state.address][`tokens`][state.chainId][contractAddress][`nftWallet`],
        userNftData,
      ];
    },
    updateNftInLocalStorage(state, changedNftData) {
      const contractAddress = changedNftData.meta.address;
      state.accounts[state.address].tokens[state.chainId][contractAddress][`nftWallet`] = [
        ...state.accounts[state.address][`tokens`][state.chainId][contractAddress][`nftWallet`],
        changedNftData,
      ];
    },
    deleteNftInLocalStorage(state, userNftData) {
      const contractAddress = userNftData.meta.address;
      const deletedNftWallet = state.accounts[state.address].tokens[state.chainId][contractAddress][
        `nftWallet`
      ].filter((nft: any) => nft.meta.token_id !== userNftData.meta.token_id);
      // console.log(deletedNftWallet, 'deletedNftWallet?');
      if (deletedNftWallet.length === 0) {
        store.commit('accounts/removeToken', contractAddress);
      } else {
        state.accounts[state.address].tokens[state.chainId][contractAddress].nftWallet =
          deletedNftWallet;
      }
    },
    setNetworkPath(state, networkPath) {
      const addChainId = networkPath.chainId;
      if (addChainId === 'aergo.io' || addChainId === 'testnet.aergo.io') return;
      const findChainLabel = state.networksPath.find(
        (network) => network.label === networkPath.label,
      );
      if (!findChainLabel) {
        state.networksPath = [...state.networksPath, networkPath];
      }
    },
    updateNetworkPath(state, { updateNetworkName, networkPath }) {
      const removedNetworkPath = state.networksPath.filter(
        (network) => network.chainId !== updateNetworkName,
      );
      state.networksPath = [...removedNetworkPath, networkPath];
    },
    removeNetworkPath(state, chainId) {
      delete state.accounts[state.address].tokens[chainId];
      const removedNetworkPath = state.networksPath.filter(
        (network) => network.chainId !== chainId,
      );
      state.networksPath = [...removedNetworkPath];
    },
    removeNetwork(state) {
      state.chainId = state.networksPath[0].chainId;
      state.chainLabel = state.networksPath[0].label;
    },
    getLastestSendHash(state, hash) {
      state.lastestSendHash = hash;
    },
  },
};

export default storeModule;
