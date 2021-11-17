import { feathersClient, makeServicePlugin, BaseModel } from '../../boot/feathersClient'

class Group extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Group'
  // Define default properties here
  static instanceDefaults () {
    return {
      name: ''
    }
  }
}
const servicePath = 'group'
const servicePlugin = makeServicePlugin({
  Model: Group,
  service: feathersClient.service(servicePath),
  servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})

export default servicePlugin
