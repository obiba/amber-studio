import { feathersClient } from '../../boot/feathersClient'

export async function getInterviews (opts, study, interviewDesign, filter, from, to) {
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
  // use filters
  formData.query.$and = [{ study: study }]
  if (interviewDesign && interviewDesign !== '0') {
    formData.query.$and.push({ interviewDesign: interviewDesign })
  }
  if (filter) {
    formData.query.$and.push({ code: { $search: filter } })
  }
  if (from) {
    formData.query.$and.push({
      updatedAt: {
        $gte: from
      }
    })
  }
  if (to) {
    formData.query.$and.push({
      updatedAt: {
        $lte: to
      }
    })
  }
  return feathersClient.service('interview').find(formData)
}

export async function getInterview (id) {
  return feathersClient.service('interview').get(id)
}

export async function updateInterview (interview, id) {
  return feathersClient.service('interview').patch(id, interview)
}

export async function deleteInterview (id) {
  return feathersClient.service('interview').remove(id)
}

export async function deleteInterviews (ids) {
  return feathersClient.service('interview').remove(null, {
    query: {
      _id: {
        $in: ids
      }
    }
  })
}
