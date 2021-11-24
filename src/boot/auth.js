import { boot } from 'quasar/wrappers'
import { LocalStorage, Notify } from 'quasar'
import { feathersClient } from './feathersClient'

export default boot(async ({ router, store }) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      // if requires admin
      const user = store.state.auth.payload && store.state.auth.payload.user ? store.state.auth.payload.user : undefined
      if (user) {
        if (to.meta.requiresAdmin) {
          if (user.role && user.role === 'administrator') {
            next()
          } else {
            Notify.create({
              message: 'Your account is not authorized to see this view. If this is in error, please contact support.',
              color: 'negative'
            })
            next(from.path)
          }
        } else if (!LocalStorage.getItem('feathers-jwt') && to.path !== '/') {
          next('/login')
        } else {
          next()
        }
      } else if (LocalStorage.getItem('feathers-jwt')) {
        next('/loading')
        // could be not expired but also still not valid, then reauth
        feathersClient.reAuthenticate().then((response) => {
          // show application page
          store.dispatch('auth/responseHandler', response)
          router.push('/')
        }).catch(() => {
          // remove expired/unusable token
          LocalStorage.remove('feathers-jwt')
          router.push('/login')
        })
      } else if (to.path !== '/login') {
        next('/login')
      } else {
        next()
      }
    } else {
      next()
    }
  })
})
