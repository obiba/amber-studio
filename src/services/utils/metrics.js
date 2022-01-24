import { feathersClient } from '../../boot/feathersClient'

export async function getMetrics () {
  return feathersClient.service('metrics').find({})
}
