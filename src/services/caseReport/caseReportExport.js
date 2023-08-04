import { api } from '../../boot/axios'
import { LocalStorage } from 'quasar'

export async function downloadCaseReports (accept, study, caseReportForm, form, filter, from, to, ids) {
  const query = {
    $limit: 10000,
    $skip: 0,
    study: study
  }
  // use filters
  if (filter) {
    query['data._id[$search]'] = filter
  }
  if (caseReportForm && caseReportForm !== '0') {
    query.caseReportForm = caseReportForm
  }
  if (form && form !== '0') {
    query.form = form
  }
  if (from) {
    query['updatedAt[$gte]'] = from
  }
  if (to) {
    query['updatedAt[$lte]'] = to
  }
  if (ids && ids.length > 0) {
    query['_id[$in][]'] = ids
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
}
