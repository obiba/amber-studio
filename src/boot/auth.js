import { boot } from 'quasar/wrappers'
import { LocalStorage, Notify } from 'quasar';

export default boot(async ({ router, store }) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      // if requires admin
      if (store.state.auth.user) {
        console.log(store.state.auth.user.email)
        if (to.meta.requiresAdmin) {
          if (
            store.state.auth.user.permissions &&
            store.state.auth.user.permissions.includes('administrator')
          ) {
            next();
          } else {
            Notify.create({
              message: `Your account is not authorized to see this view. If this is in error, please contact support.`,
              color: 'negative'
            });
            next(from.path);
          }
        } else if (!LocalStorage.getItem('feathers-jwt') && to.path !== '/') {
          next('/login');
        } else {
          next();
        }
      } else if (to.path !== '/login') {
        next('/login');
      } else {
        next();
      }
    } else {
      next();
    }
    //next();
  });
});
