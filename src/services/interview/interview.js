import { feathersClient } from '../../boot/feathersClient'
import { api } from '../../boot/axios'
import { LocalStorage } from 'quasar'

export async function downloadInterviews (accept, study, interviewDesign, state, filter, from, to, ids) {
  const query = {
    $limit: 10000,
    $skip: 0,
    study: study
  }
  // use filters
  if (interviewDesign && interviewDesign !== '0') {
    query.interviewDesign = interviewDesign
  }
  if (state && state !== '0') {
    query.state = state
  }
  if (filter) {
    query.$or = [
      { code: { $search: filter } },
      { identifier: { $search: filter } }
    ]
  }
  if (from) {
    query.updatedAt = {
      $gte: from
    }
  }
  if (to) {
    query.updatedAt = {
      $lte: to
    }
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

export async function getInterviews (opts, study, interviewDesign, campaign, state, participantValid, filter, from, to) {
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
  formData.query.study = study
  if (interviewDesign && interviewDesign !== '0') {
    formData.query.interviewDesign = interviewDesign
  }
  if (campaign && campaign !== '0') {
    formData.query.campaign = campaign
  }
  if (state && state !== '0') {
    formData.query.state = state
  }
  if (participantValid !== undefined) {
    formData.query.participantValid = participantValid
  }
  if (filter) {
    formData.query.$or = [
      { code: { $search: filter } },
      { identifier: { $search: filter } }
    ]
  }
  if (from) {
    formData.query.updatedAt = {
      $gte: from
    }
  }
  if (to) {
    formData.query.updatedAt = {
      $lte: to
    }
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
