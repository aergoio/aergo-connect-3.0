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
        mainnet: any;
        testnet: any;
        alpha: any;
        [chainLabel: string]: any;
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
      if (state.accounts[state.address][`tokens`]) {
        return state.accounts[state.address][`tokens`][state.chainLabel];
      }
    },
  },

  actions: {
    async initState({ state, commit }) {
      const vue = getVueInstance(this);
      const aergoChainIds = ['aergo.io', 'testnet.aergo.io', 'alpha.aergo.io'];
      const accountState = await vue.$background.getAccountState({
        address: state.address,
        chainId: state.chainId,
      });
      const aergoBalance = await new Amount(accountState.balance).formatNumber('aergo');
      const isScanApiUrl = state.networksPath.filter(
        (networkPath) => networkPath.chainId === state.chainId,
      )[0].scanApiUrl;

      if (!aergoChainIds.includes(state.chainId) && !isScanApiUrl) {
        const balances = { aergo: aergoBalance, others: [] };
        await commit('setTokenBalance', balances);
      } else {
        const scanApiUrl = getScanApiUrl(state);
        const getTokenBalanceUrl = `${scanApiUrl}/tokenBalance?q=${state.address}&size=10000`;
        const resp = await fetch(getTokenBalanceUrl);
        const response = await resp.json();
        const balances = { aergo: aergoBalance, others: response.hits };
        await commit('setTokenBalance', balances);
        await commit('setSeedPhrase', '');
      }
    },

    async updateAccount({ commit }, { address, chainId }) {
      const vue = getVueInstance(this);
      if (address && chainId) {
        await vue.$background.setActiveAccount({ address, chainId });
        const account = await vue.$background.syncAccountState({ address, chainId });
        console.log(account, 'account?');
      }
    },

    async loadAccount({ state, commit }) {
      const vue = getVueInstance(this);
      const accounts = await vue.$background.getAccounts();
      console.log(accounts, 'accounts');
      if (accounts.length !== 0) {
        commit('setActiveAccount', accounts[0]?.data.spec.address);
        return true;
      } else {
        return false;
      }
    },

    async removeAccount({ state, commit }, address: string) {
      const vue = getVueInstance(this);
      // await vue.$background.removeAccount({ address: state.address, chainId: state.chainId });
      await vue.$background.removeAccounts({ address });
      commit('removeAccount');

      const accounts = await vue.$background.getAccounts();
      if (accounts.length !== 0) commit('setActiveAccount', accounts[0]?.data.spec.address);
      else commit('setActiveAccount', '');
    },

    async addAccount({ commit }, address: string) {
      await commit('addAccount', address);
      commit('setActiveAccount', address);
    },

    async addToken({ state, commit }, token: any) {
      let tokens = state.accounts[state.address]['tokens'][state.chainLabel];

      if (!tokens) {
        tokens = {};
      }
      // if (token.meta.type === 'ARC2') {
      //   token[`dropdownState`] = false;
      //   token[`balance`] = '0';
      // }
      tokens[token.hash] = token;

      commit('setTokens', tokens);
    },

    async deleteToken({ state, commit }, token: string) {
      const tokens = state.accounts[state.address]['tokens'][state.chainLabel];
      delete tokens[token];
      commit('setTokens', tokens);
    },
  },

  mutations: {
    setAergo(state) {
      state.accounts[state.address]['tokens'][state.chainLabel][`AERGO`] = {
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
      Object.keys(state.accounts[state.address][`tokens`][state.chainLabel]).forEach((hash) => {
        const bal = balances.others.find((element: any) => element.meta.address == hash);
        if (bal) {
          if (bal.token.meta.type === 'ARC2') {
            state.accounts[state.address][`tokens`][state.chainLabel][hash]['balance'] =
              bal.meta.balance;
          } else {
            state.accounts[state.address][`tokens`][state.chainLabel][hash]['balance'] =
              Number(bal.meta.balance) / Math.pow(10, bal.token.meta.decimals);
            bal.meta.balance_float;
          }
        } else {
          state.accounts[state.address][`tokens`][state.chainLabel][hash]['balance'] = 0;
        }
      });
      if (balances['aergo']) {
        state.accounts[state.address][`tokens`][state.chainLabel]['AERGO'] = {
          ...state.accounts[state.address][`tokens`][state.chainLabel]['AERGO'],
          balance: balances['aergo'],
        };
      }
    },

    setActiveAccount(state, address: string) {
      if (!address) {
        state.address = '';
        state.nick = '';
        return;
      }
      const vue = getVueInstance(this);
      vue.$background.setActiveAccount({ address: address, chainId: state.chainId });
      state.address = address;
      state.nick = state.accounts[address]['nick'];
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
          mainnet: {
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
          testnet: {
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
          alpha: {
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
      if (!state.accounts[address].tokens[state.chainLabel]) {
        state.accounts[address].tokens[state.chainLabel] = setAergo;
      }
    },

    setNick(state, nick: string) {
      state.accounts[state.address]['nick'] = nick;
      state.nick = nick;
    },

    setTokens(state, tokens: any) {
      state.accounts[state.address]['tokens'][state.chainLabel] = tokens;
    },
    setSelectedToken(state, token: any) {
      state.selectedToken = token;
    },
    setOption(state, option: string) {
      state.option = option;
    },

    async setChain(state, { chainId, chainLabel }) {
      state.chainId = chainId;
      state.chainLabel = chainLabel;
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
      if (!state.accounts[state.address].tokens[chainLabel]) {
        state.accounts[state.address].tokens[chainLabel] = setAergo;
      }
    },

    setBackup(state, value: boolean) {
      state.accounts[state.address]['backup'] = value;
    },
    removeToken(state, token: any) {
      state.selectedToken = '';
      delete state.accounts[state.address].tokens[state.chainLabel][token];
    },
    handleDropdownState(state, { hash, dropdownState }) {
      state.accounts[state.address][`tokens`][state.chainLabel][hash] = {
        ...state.accounts[state.address][`tokens`][state.chainLabel][hash],
        dropdownState,
      };
    },
    // setNftWallet(state, { nftWallet, hash }) {
    //   if (nftWallet.length === 0) {
    //     state.accounts[state.address].token[state.chainLabel][hash]['nftWallet'] = [];
    //   } else {
    //     state.accounts[state.address].token[state.chainLabel][hash]['nftWallet'] = nftWallet;
    //   }
    // },
    addNftToLocalStorage(state, userNftData) {
      const contractAddress = userNftData.meta.address;
      state.accounts[state.address][`tokens`][state.chainLabel][contractAddress][`nftWallet`] = [
        ...state.accounts[state.address][`tokens`][state.chainLabel][contractAddress][`nftWallet`],
        userNftData,
      ];
    },
    updateNftInLocalStorage(state, changedNftData) {
      const contractAddress = changedNftData.meta.address;
      state.accounts[state.address].tokens[state.chainLabel][contractAddress][`nftWallet`] = [
        ...state.accounts[state.address][`tokens`][state.chainLabel][contractAddress][`nftWallet`],
        changedNftData,
      ];
    },
    deleteNftInLocalStorage(state, userNftData) {
      const contractAddress = userNftData.meta.address;
      const deletedNftWallet = state.accounts[state.address].tokens[state.chainLabel][
        contractAddress
      ][`nftWallet`].filter((nft: any) => nft.meta.token_id !== userNftData.meta.token_id);
      if (deletedNftWallet.length === 0) {
        store.commit('accounts/removeToken', contractAddress);
      } else {
        state.accounts[state.address].tokens[state.chainLabel][contractAddress].nftWallet =
          deletedNftWallet;
      }
    },
    setNetworkPath(state, networkPath) {
      const findChainLabel = state.networksPath.find(
        (network) => network.label === networkPath.label,
      );
      if (!findChainLabel) {
        state.networksPath = [...state.networksPath, networkPath];
      }
    },
    updateNetworkPath(state, { updateNetworkName, networkPath }) {
      const removedNetworkPath = state.networksPath.filter(
        (network) => network.label !== updateNetworkName,
      );
      state.networksPath = [...removedNetworkPath, networkPath];
    },
    removeNetworkPath(state, { chainId, label }) {
      const publicChains = ['aergo.io', 'testnet.aergo.io', 'alpha.aergo.io'];
      if (!publicChains.includes(chainId)) {
        delete state.accounts[state.address].tokens[chainId];
        const removedNetworkPath = state.networksPath.filter(
          (network) => network.chainId !== chainId,
        );
        state.networksPath = [...removedNetworkPath];
      } else {
        const removedNetworkPath = state.networksPath.filter((network) => network.label !== label);
        state.networksPath = [...removedNetworkPath];
      }
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
