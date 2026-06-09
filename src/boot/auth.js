import { boot } from 'quasar/wrappers'
import { LocalStorage, Notify } from 'quasar'
import { useAuthStore } from '../stores/auth'
import { feathersClient } from './feathersClient'

export default boot(async ({ router, app }) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      const authStore = useAuthStore()
      const user = authStore.user

      if (user) {
        // Check role-based access
        if (to.meta.requiresAdmin && (!user.role || user.role !== 'administrator')) {
          Notify.create({
            message: 'Your account is not authorized to see this view. If this is in error, please contact support.',
            color: 'negative'
          })
          next(from.path)
        } else if (to.meta.noGuest && (!user.role || user.role === 'guest')) {
          Notify.create({
            message: 'Your account is not authorized to see this view. If this is in error, please contact support.',
            color: 'negative'
          })
          next(from.path)
        } else if (!LocalStorage.getItem('feathers-jwt') && to.path !== '/') {
          next('/login')
        } else {
          next()
        }
      } else if (LocalStorage.getItem('feathers-jwt')) {
        next('/loading')
        // Could be not expired but also still not valid, then reauth
        feathersClient.reAuthenticate().then((response) => {
          authStore.responseHandler(response)
          router.push(to.path)
        }).catch(() => {
          // Remove expired/unusable token
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
