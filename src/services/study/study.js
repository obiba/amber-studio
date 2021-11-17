import { feathersClient } from '../../boot/feathersClient'

export async function getStudies (opts, filter) {
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

  return feathersClient.service('study').find(formData)
}

export async function getStudy (id) {
  return feathersClient.service('study').get(id)
}

export async function createStudy (study) {
  return feathersClient.service('study').create(study)
}

export async function updateStudy (study, id) {
  return feathersClient.service('study').patch(id, study)
}

export async function deleteStudy (id) {
  return feathersClient.service('study').remove(id)
}

export async function deleteStudies (ids) {
  return feathersClient.service('study').remove(null, {
    query: {
      _id: {
        $in: ids
      }
    }
  })
}
