import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import ui, { UiState } from './ui';
import accounts, { AccountsState } from './accounts';
import request, { RequestState } from './request';
// import session, { SessionState } from './session';

Vue.use(Vuex);

// Persist some modules to local storage
const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
  modules: ['ui', 'accounts', 'session'],
});

export interface RootState {
  ui: UiState;
  accounts: AccountsState;
  request: RequestState;
  // session: SessionState;
}

export default new Vuex.Store<RootState>({
  modules: {
    ui,
    accounts,
    request,
    // session,
  },
  strict: process.env.NODE_ENV !== 'production',
  plugins: [vuexLocal.plugin],
});
