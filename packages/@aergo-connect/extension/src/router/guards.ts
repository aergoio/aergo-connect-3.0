import { NavigationGuard, Route } from 'vue-router';
import store from '../store';
import { capitalizeFirstLetter } from '../utils/strings';

const persistedPath = store.state.ui.route.currentPath;
const now: any = new Date();
const lastViewedTime: any = new Date(store.state.ui.route.lastViewedTime);
const timeDifference = now - lastViewedTime;
const isInitPage = timeDifference >= 60 * 60 * 1000 ? true : false;

/**
 * If we're coming from the lockscreen, check that app was actually unlocked.
 * Otherwise you can e.g. just 'go back' to show a previous screen (privacy issue).
 */
export const allowedToExitLockscreen: NavigationGuard = (to, from, next) => {
  if (from.name === 'lockscreen') {
    const exclude = ['', '/', '/welcome', isInitPage ? persistedPath : null];
    if (!store.state.ui.unlocked && exclude.indexOf(to.fullPath) === -1) {
      return next({ name: 'lockscreen' });
    }
  }
  return next();
};

/**
 * Load persisted route on initial load
 * or whenever selecting an account during permission request
 */
export const loadPersistedRoute: NavigationGuard = (to, from, next) => {
  const isStartTransition =
    from.fullPath === '/' && from.name === null && to.name === 'accounts-list';
  if (isStartTransition) {
    const exclude = [
      '',
      '/',
      '/welcome',
      '/connect-hw/accounts',
      to.fullPath,
      isInitPage ? persistedPath : null,
    ];
    if (persistedPath && exclude.indexOf(persistedPath) === -1) {
      return next(persistedPath);
    }
  }
  return next();
};

/**
 * Persist next route to store
 */
export const persistRoute: NavigationGuard = (to, _from, next) => {
  if (!((to.meta && to.meta.noTracking === true) || to.fullPath.match(/request/))) {
    store.commit('ui/setCurrentRoute', to);
    store.commit('ui/setTime', new Date().toISOString());
    // store.commit('ui/setCurrentPage', to.name);
    // if (_from.name != 'lockscreen') store.commit('ui/setPreviousPage', _from.name);
  }
  return next();
};

/**
 * afterEach hook to update document title
 */
export const updateTitle = (to: Route): void => {
  setTimeout(() => {
    document.title =
      (to.meta && to.meta.title) || capitalizeFirstLetter(to.name || '') + ' - Aergo Connect';
  });
};

/**
 * This guard is added if we are in request mode.
 * It overrides all other guards and redirects to 'request-select' if not in a request route.
 */
export const enforceRequest: NavigationGuard = (to, _from, next) => {
  // console.log(to, 'to');
  if (!to.fullPath.match(/request/) && to.fullPath !== '/locked') {
    return next({ name: 'request-select-account' });
  }
  return next();
};
