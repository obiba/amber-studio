import { boot } from 'quasar/wrappers'
import { LocalStorage, Notify } from 'quasar';

export default boot(async ({ router, store }) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      // if requires admin
      let user = store.state.auth.payload ? store.state.auth.payload.user : undefined;
      if (user) {
        if (to.meta.requiresAdmin) {
          if (user.permissions && user.permissions.includes('administrator')) {
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
