import { feathersClient } from '../../boot/feathersClient'

export async function getParticipants (opts, campaign, filter) {
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
  if (filter && filter.length > 1) {
    formData.query.$and = [
      { campaign: campaign },
      {
        $or: [
          { code: { $search: filter } },
          { identifier: { $search: filter } }
        ]
      }
    ]
  } else {
    formData.query.campaign = campaign
  }
  return feathersClient.service('participant').find(formData)
}

export async function getParticipant (id) {
  return feathersClient.service('participant').get(id)
}

export async function createParticipant (entity) {
  return feathersClient.service('participant').create(entity)
}

export async function updateParticipant (entity, id) {
  return feathersClient.service('participant').update(id, entity)
}

export async function deleteParticipant (id) {
  return feathersClient.service('participant').remove(id)
}

export async function deleteParticipants (ids) {
  return feathersClient.service('participant').remove(null, {
    query: {
      _id: {
        $in: ids
      }
    }
  })
}
