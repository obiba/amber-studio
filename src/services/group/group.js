import { feathersClient } from '../../boot/feathersClient'

export async function getGroups (opts, filter) {
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
    formData.query = {
      $or: [
        { name: { $search: filter } },
        { description: { $search: filter } }
      ]
    }
  }

  return feathersClient.service('group').find(formData)
}

export async function getGroup (id) {
  return feathersClient.service('group').get(id)
}

export async function createGroup (group) {
  return feathersClient.service('group').create(group)
}

export async function updateGroup (group, id) {
  return feathersClient.service('group').patch(id, group)
}

export async function deleteGroup (id) {
  return feathersClient.service('group').remove(id)
}

export async function deleteGroups (ids) {
  const promises = []
  const chunkSize = 10
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize)
    promises.push(feathersClient.service('group').remove(null, {
      query: {
        _id: {
          $in: chunk
        }
      }
    }))
  }
  return Promise.all(promises)
}
