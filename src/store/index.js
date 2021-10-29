import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import authvuex from './store.auth';
import account from './account';
import admin from './admin';
import study from './study';
import studyForm from './studyForm';

const requireModule = require.context(
  // The path where the service modules live
  '../services/feathers-client',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
);

const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    plugins: [...servicePlugins, authvuex],
    modules: {
      account,
      admin,
      study,
      studyForm
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
