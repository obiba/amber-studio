import { feathersClient } from '../../boot/feathersClient'

export async function getInterviewDesigns (opts, study, filter) {
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
    if (!Number.isNaN(Number(filter))) {
      formData.query.$and = [
        { study: study },
        { revision: filter }
      ]
    } else {
      formData.query.study = study
    }
  } else {
    formData.query.study = study
  }
  return feathersClient.service('interview-design').find(formData)
}

export async function getInterviewDesign (id) {
  return feathersClient.service('interview-design').get(id)
}

export async function createInterviewDesign (interviewDesign) {
  return feathersClient.service('interview-design').create(interviewDesign)
}

export async function updateInterviewDesign (interviewDesign, id) {
  return feathersClient.service('interview-design').update(id, interviewDesign)
}

export async function deleteInterviewDesign (id) {
  return feathersClient.service('interview-design').remove(id)
}

export async function deleteInterviewDesigns (ids) {
  return feathersClient.service('interview-design').remove(null, {
    query: {
      _id: {
        $in: ids
      }
    }
  })
}
