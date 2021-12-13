import { feathersClient } from '../../boot/feathersClient'

export async function getCaseReportForms (opts, study) {
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
  formData.query.study = study

  return feathersClient.service('case-report-form').find(formData)
}

export async function getCaseReportForm (id) {
  return feathersClient.service('case-report-form').get(id)
}

export async function createCaseReportForm (caseReport) {
  return feathersClient.service('case-report-form').create(caseReport)
}

export async function updateCaseReportForm (caseReport, id) {
  return feathersClient.service('case-report-form').patch(id, caseReport)
}

export async function deleteCaseReportForm (id) {
  return feathersClient.service('case-report-form').remove(id)
}

export async function deleteCaseReportForms (ids) {
  return feathersClient.service('case-report-form').remove(null, {
    query: {
      _id: {
        $in: ids
      }
    }
  })
}
