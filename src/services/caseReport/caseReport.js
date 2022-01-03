import { feathersClient } from '../../boot/feathersClient'

export async function getCaseReports (opts, study, filter) {
  const formData = { query: { $sort: { descending: -1 } } }
  if (opts) {
    // qtable pagination's 'All' sets limit to 0
    formData.query.$limit = opts.rowsPerPage === 0 ? 1000 : opts.rowsPerPage
    formData.query.$skip = (opts.page - 1) * opts.rowsPerPage
    if (opts.sortBy) {
      formData.query.$sort[opts.sortBy] = opts.descending ? 1 : -1
    }
  } else {
    formData.query.$limit = 10
  }
  // use filter
  if (filter) {
    formData.query.$and = [
      { study: study },
      { 'data._id': { $search: filter } }
    ]
  } else {
    formData.query.study = study
  }
  return feathersClient.service('case-report').find(formData)
}

export async function getCaseReport (id) {
  return feathersClient.service('case-report').get(id)
}

export async function deleteCaseReport (id) {
  return feathersClient.service('case-report').remove(id)
}

export async function deleteCaseReports (ids) {
  return feathersClient.service('case-report').remove(null, {
    query: {
      _id: {
        $in: ids
      }
    }
  })
}
