import { feathersClient } from '../../boot/feathersClient'
import { api } from '../../boot/axios'
import { LocalStorage } from 'quasar'

export async function downloadInterviews (accept, study, interviewDesign, filter, from, to, ids) {
  const query = {
    $limit: 10000,
    $skip: 0,
    study: study
  }
  // use filters
  if (filter) {
    query['data._id[$search]'] = filter
  }
  if (interviewDesign && interviewDesign !== '0') {
    query.interviewDesign = interviewDesign
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
  return api.get('/interview-export', {
    params: query,
    responseType: 'blob',
    headers: {
      Accept: accept,
      Authorization: `Bearer ${token}`
    }
  })
}

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
  const promises = []
  const chunkSize = 10
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize)
    promises.push(feathersClient.service('interview').remove(null, {
      query: {
        _id: {
          $in: chunk
        }
      }
    }))
  }
  return Promise.all(promises)
}
