import { feathersClient } from '../../boot/feathersClient'

export async function getSubjects () {
  return feathersClient.service('subjects').find({
    query: {
      $limit: 1000
    }
  })
}
