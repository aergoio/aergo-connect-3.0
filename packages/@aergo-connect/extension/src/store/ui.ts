import { Module } from 'vuex';
import { Route } from 'vue-router';
import { RootState } from './index';
import { Json } from '../types';

interface InputData {
  // Values get persisted into localstorage, so only use json-compatible types
  [field: string]: Json;
}

const defaultSettings = {
  features: {
    enableHardwareWallet: true,
    enableSignMessage: true,
  },
};

export interface UiState {
  input: {
    [form: string]: InputData;
    settings: typeof defaultSettings;
  };
  txTypes: any;
  initSetupKey: string;
  idleTimeout: number;
  unlocked: boolean;
  route: {
    currentPath: string;
    previousPath: string;
    lastViewedTime: any;
  };
}

const storeModule: Module<UiState, RootState> = {
  namespaced: true,
  state: {
    input: {
      settings: defaultSettings,
    },
    txTypes: ['TRANSFER', 'CALL', 'FEEDELEGATION', 'MULTICALL', 'GOVERNANCE'],
    initSetupKey: '',
    idleTimeout: 60,
    unlocked: false,
    route: {
      currentPath: '',
      previousPath: '',
      lastViewedTime: '',
    },
  },
  getters: {
    getSetting:
      (state) =>
      (keyPath: string): Json => {
        function getKey<T extends Record<string, any>>(obj: T, keyPath: string): Json {
          const [key, rest] = keyPath.split('.', 2);
          if (!rest) {
            return obj[key as keyof T] as unknown as Json;
          }
          return getKey(obj[key as keyof T], rest);
        }
        return getKey(state.input.settings, keyPath);
      },
  },
  mutations: {
    setUnlocked(state, unlocked) {
      state.unlocked = unlocked;
    },

    setIdleTimeout(state, time) {
      state.idleTimeout = time;
    },

    setInput(state, { key, field, value }: { key: string; field: string; value: Json }) {
      if (typeof state.input[key] === 'undefined') {
        state.input[key] = {};
      }
      state.input[key][field] = value;
    },
    setInputs(state, { key, data }: { key: string; data: InputData }) {
      state.input[key] = data;
    },
    clearInput(state, { key }) {
      state.input[key] = {};
    },
    setInitSetupKey(state, initSetupKey) {
      state.initSetupKey = initSetupKey;
    },
    setCurrentPage(state, page: string) {
      state.route.currentPath = page;
    },
    setPreviousPage(state, page: string) {
      state.route.previousPath = page;
    },
    setCurrentRoute(state, route: Route) {
      if (route.fullPath === state.route.currentPath) return;
      state.route.previousPath = state.route.currentPath;
      state.route.currentPath = route.fullPath;
    },
    setTime(state, time: any) {
      state.route.lastViewedTime = time;
    },
  },
  actions: {
    setTxBody({ commit }, txBody) {
      commit('setInput', {
        key: 'send',
        field: 'txBody',
        value: txBody,
      });
    },
  },
};

export default storeModule;

import Vue from 'vue';
import Component from 'vue-class-component';
import { debounce } from 'lodash';

/**
 * Mixin that helps persisting local component data into the vuex store,
 * from where it gets persisted into localstorage.
 */
@Component
export class PersistInputsMixin extends Vue {
  persistFields: string[] = [];
  persistDebounceTime = 500;
  persistInitialValues = true;
  persistFieldsKey = '';
  get persistFieldsKeyAuto(): string {
    return this.persistFieldsKey || String(this.$vnode.key);
  }
  private restorePersistedValue(field: string) {
    const key = this.persistFieldsKeyAuto;
    const state = this.$store.state.ui as UiState;
    if (typeof state.input[key] !== 'undefined') {
      const persistedValue = state.input[key][field];
      if (typeof persistedValue === 'object') {
        // Copy the object to get rid of observers on it
        // @ts-ignore
        this.$set(this, field, { ...persistedValue });
      } else if (typeof persistedValue !== 'undefined') {
        this.$set(this, field, persistedValue);
      }
    }
  }
  private watchField(field: string) {
    const key = this.persistFieldsKeyAuto;
    const watchHandler = debounce((value: Json) => {
      this.$store.commit('ui/setInput', { key, field, value });
    }, this.persistDebounceTime);
    this.$watch(field, watchHandler, { immediate: this.persistInitialValues, deep: true });
  }
  created() {
    for (const field of this.persistFields) {
      this.restorePersistedValue(field);
      this.watchField(field);
    }
  }
}
