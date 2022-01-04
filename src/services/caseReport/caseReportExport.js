// import { feathersClient } from '../../boot/feathersClient'
import { api } from '../../boot/axios'
import { LocalStorage } from 'quasar'

export async function downloadCaseReports (study, form, filter) {
  const query = {
    $limit: 1000000,
    $skip: 0
  }
  // use filters
  if (filter) {
    query['$and[0][study]'] = study
    query['$and[1][data._id][$search]'] = filter
    if (form && form !== '0') {
      query['$and[2][form]'] = form
    }
  } else if (form && form !== '0') {
    query['$and[0][study]'] = study
    query['$and[1][form]'] = form
  } else {
    query.study = study
  }
  const token = LocalStorage.getItem('feathers-jwt')
  return api.get('/case-report-export', {
    params: query,
    responseType: 'blob',
    headers: {
      Accept: 'application/zip',
      Authorization: `Bearer ${token}`
    }
  })
  // return feathersClient.service('case-report-export').find(params)
}
