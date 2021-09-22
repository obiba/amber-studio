import { boot } from 'quasar/wrappers'
import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import auth from '@feathersjs/authentication-client';
import { iff, discard } from 'feathers-hooks-common';
import { axios } from './axios';
import Vuex from 'vuex';
import feathersVuex from '@feathersjs/vuex';
import jwt_decode from "jwt-decode";

const restClient = rest(process.env.API);

const feathersClient = feathers()
  .configure(restClient.axios(axios))
  .configure(auth({ storage: window.localStorage }))
  .hooks({
    before: {
      all: [
        iff(
          context => ['create', 'update', 'patch'].includes(context.method),
          discard('__id', '__isTemp')
        )
      ]
    }
  });


// Setting up feathers-vuex
const {
  makeServicePlugin,
  makeAuthPlugin,
  BaseModel,
  models,
  FeathersVuex
} = feathersVuex(feathersClient, {
  serverAlias: 'api', // optional for working with multiple APIs (this is the default value)
  idField: '_id', // Must match the id field in your database table/collection
  whitelist: ['$regex', '$options']
});

export default boot(({ app, router, store }) => {
  app.use(feathersClient);
  //app.use(api);
  app.use(Vuex);
  app.use(FeathersVuex);

  // reauthenticate on page refresh
  if (localStorage.getItem('feathers-jwt')) {
    let token = jwt_decode(localStorage.getItem('feathers-jwt'))
    console.log(token)
    const expiresAt = token.exp
    if (Math.round(new Date().getTime() / 1000) < expiresAt) {
      feathersClient.reAuthenticate().then((response) => {
        // show application page
        //dispatch('responseHandler', response);
        //store.state.auth.payload = response
        store.commit('auth/setAccessToken', response.accessToken)
        store.commit('auth/setPayload', response)
        let user = response[store.state.auth.responseEntityField]
        if (user) {
          store.commit('auth/setUser', user)
        }
        //console.log(JSON.parse(JSON.stringify(store.state)))
        router.push('/')
      }).catch((err) => {
        // remove expired token
        localStorage.removeItem('feathers-jwt')
      });
    }
  }
})

export { feathersClient, makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex };

