import { boot } from 'quasar/wrappers'
import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'
import { iff, discard } from 'feathers-hooks-common'
import { axios } from './axios'

const appEnv = window.env
const restClient = rest(appEnv.AMBER_URL)

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

export default boot(({ app }) => {
  // Feathers client is available globally through imports
})

export { feathersClient }
