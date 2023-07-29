// import { feathersClient } from '../../boot/feathersClient'
import { api } from '../../boot/axios'
import { LocalStorage } from 'quasar'

export async function downloadTranslations (accept, form) {
  const token = LocalStorage.getItem('feathers-jwt')
  return api.get(`/form-i18n/${form}`, {
    responseType: 'blob',
    headers: {
      Accept: accept,
      Authorization: `Bearer ${token}`
    }
  })
}
