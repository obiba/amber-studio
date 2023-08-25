import { feathersClient } from '../../boot/feathersClient'

export async function getTasks (opts, filter) {
  const formData = { query: {} }
  if (opts) {
    // qtable pagination's 'All' sets limit to 0
    formData.query.$limit = opts.rowsPerPage === 0 ? 1000 : opts.rowsPerPage
    formData.query.$skip = (opts.page - 1) * opts.rowsPerPage
    if (opts.sortBy) {
      formData.query.$sort = {}
      formData.query.$sort[opts.sortBy] = opts.descending ? 1 : -1
    }
  } else {
    formData.query.$limit = 10
  }
  // use filter
  if (filter && filter.length > 1) {
    formData.query = {
      $or: [
        { type: { $search: filter } },
        { state: { $search: filter } },
        { error: { $search: filter } },
        { message: { $search: filter } }
      ]
    }
  }

  return feathersClient.service('task').find(formData)
}

export async function getTask (id) {
  return feathersClient.service('task').get(id)
}

export async function createTask (task) {
  return feathersClient.service('task').create(task)
}

export async function deleteTask (id) {
  return feathersClient.service('task').remove(id)
}

export async function deleteTasks (ids) {
  const promises = []
  const chunkSize = 10
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize)
    promises.push(feathersClient.service('task').remove(null, {
      query: {
        _id: {
          $in: chunk
        }
      }
    }))
  }
  return Promise.all(promises)
}
