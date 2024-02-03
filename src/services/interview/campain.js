import { feathersClient } from '../../boot/feathersClient'

export async function getCampaigns (opts, interviewDesign, study, filter) {
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
  const itwid = interviewDesign?._id ? interviewDesign._id : interviewDesign
  if (filter && filter.length > 1) {
    formData.query.$and = [
      { interviewDesign: itwid },
      {
        $or: [
          { name: { $search: filter } },
          { description: { $search: filter } }
        ]
      }
    ]
  } else {
    formData.query.interviewDesign = itwid
  }
  if (study) {
    formData.query.study = study
  }
  return feathersClient.service('campaign').find(formData)
}

export async function getCampaignsByStudy (study) {
  const formData = { query: { $sort: { descending: -1 } } }
  formData.query.study = study
  return feathersClient.service('campaign').find(formData)
}

export async function getCampaign (id) {
  return feathersClient.service('campaign').get(id)
}

export async function createCampaign (entity) {
  return feathersClient.service('campaign').create(entity)
}

export async function updateCampaign (entity, id) {
  return feathersClient.service('campaign').update(id, entity)
}

export async function deleteCampaign (id) {
  return feathersClient.service('campaign').remove(id)
}
