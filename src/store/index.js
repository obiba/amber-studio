import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import authvuex from './store.auth'
import account from './account'
import admin from './admin'
import study from './study'
import form from './form'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'

const ls = new SecureLS({ isCompression: false })
const debug = true
const lsVuex = debug ? createPersistedState()
  : createPersistedState({
    key: 'astore',
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key)
    }
  })

const logPlugin = (store) => {
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    // called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.
    if (debug) {
      console.log(mutation)
      // console.log(state)
    }
  })
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 *
 * The function below can be async too either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    plugins: [authvuex, lsVuex, logPlugin],
    modules: {
      account,
      admin,
      study,
      form
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
