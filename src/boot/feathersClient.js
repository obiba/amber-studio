import { boot } from 'quasar/wrappers'
import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'
import { iff, discard } from 'feathers-hooks-common'
import { axios } from './axios'
import feathersVuex from '@feathersjs/vuex'

const restClient = rest(process.env.API)

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
    },
    after: {
      all: [
        context => console.debug(context)
      ]
    }
  })

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
})

export default boot(({ app }) => {
  app.use(FeathersVuex)
})

export { feathersClient, makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex }
