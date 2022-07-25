// import { feathersClient } from '../../boot/feathersClient'
import { api } from '../../boot/axios'
import { LocalStorage } from 'quasar'

export async function downloadCaseReports (study, accept, form, filter, from, to) {
  const query = {
    $limit: 1000000,
    $skip: 0
  }
  // use filters
  const and = {}
  and['[study]'] = study
  if (filter) {
    and['[data._id][$search]'] = filter
  }
  if (form && form !== '0') {
    and['[study]'] = form
    query['$and[1][form]'] = form
  }
  if (from) {
    and['[updatedAt][$gte]'] = from
  }
  if (to) {
    and['[updatedAt][$lte]'] = to
  }

  if (Object.keys(and) === 1) {
    query.study = study
  } else {
    let i = 0
    for (const [key, value] of Object.entries(and)) {
      query[`$and[${i}]${key}`] = value
      i++
    }
  }
  const token = LocalStorage.getItem('feathers-jwt')
  return api.get('/case-report-export', {
    params: query,
    responseType: 'blob',
    headers: {
      Accept: accept,
      Authorization: `Bearer ${token}`
    }
  })
  // return feathersClient.service('case-report-export').find(params)
}
