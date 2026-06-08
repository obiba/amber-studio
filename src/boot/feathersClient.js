import { boot } from 'quasar/wrappers'
import { createClient } from 'feathers-pinia'
import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'
import { iff, discard } from 'feathers-hooks-common'
import { axios } from './axios'

const restClient = rest(import.meta.env.VITE_API || import.meta.env.API)

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
        // context => console.debug(context)
      ]
    }
  })

// Create Feathers-Pinia client
const api = createClient(feathersClient, {
  idField: '_id',
  whitelist: ['$regex', '$options'],
  storage: window.localStorage
})

export default boot(({ app }) => {
  // Feathers-Pinia auto-creates service stores
  // Services will be set up in their respective stores
})

export { api, feathersClient }
