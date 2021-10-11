import { boot } from 'quasar/wrappers'
import { LocalStorage, Notify } from 'quasar';
import jwt_decode from "jwt-decode";
import { feathersClient } from './feathersClient';

export default boot(async ({ router, store }) => {

  var loading = false;

  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      // if requires admin
      let user = store.state.auth.payload && store.state.auth.payload.user ? store.state.auth.payload.user : undefined;
      if (user) {
        if (to.meta.requiresAdmin) {
          if (user.role && user.role === 'administrator') {
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
      } else if (localStorage.getItem('feathers-jwt')) {
        let token = jwt_decode(localStorage.getItem('feathers-jwt'))
        const expiresAt = token.exp
        if (Math.round(new Date().getTime() / 1000) < expiresAt) {
          //console.log("reauth...")
          feathersClient.reAuthenticate().then((response) => {
            // show application page
            store.dispatch('auth/responseHandler', response)
            //console.log(JSON.parse(JSON.stringify(store.state)))
            router.push('/');
          }).catch((err) => {
            // remove expired/unusable token
            localStorage.removeItem('feathers-jwt');
            router.push('/login');
          });
        }
        next('/loading')
      } else if (to.path !== '/login') {
        next('/login');
      } else {
        next();
      }
    } else {
      next();
    }
  });


  
});
