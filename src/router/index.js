import { defineRouter } from '#q-app'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = import.meta.env.QUASAR_SSR_MODE
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const appEnv = typeof window !== 'undefined' ? window.env : {}
  const base = appEnv.PATH_PREFIX || '/'

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.QUASAR_SSR_MODE ? void 0 : base)
  })

  return Router
})
