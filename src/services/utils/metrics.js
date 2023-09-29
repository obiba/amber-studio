import { feathersClient } from '../../boot/feathersClient'

export async function getMetrics (payload) {
  if (payload && payload.type) {
    return feathersClient.service('metrics').get(payload.type, payload)
  }
  return feathersClient.service('metrics').find(payload || {})
}
