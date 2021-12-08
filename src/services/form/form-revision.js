import { feathersClient } from '../../boot/feathersClient'

export async function createFormRevision (formRevision) {
  return feathersClient.service('form-revision').create(formRevision)
}
