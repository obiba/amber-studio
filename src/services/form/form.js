import { feathersClient } from '../../boot/feathersClient'

export async function getForms (opts, study, filter) {
  const formData = { query: { $sort: { descending: -1 } } }
  if (opts) {
    // qtable pagination's 'All' sets limit to 0
    formData.query.$limit = opts.rowsPerPage === 0 ? 1000 : opts.rowsPerPage
    formData.query.$skip = (opts.page - 1) * opts.rowsPerPage
    if (opts.sortBy) {
      formData.query.$sort[opts.sortBy] = opts.descending ? 1 : -1
    }
  } else {
    formData.query.$limit = 100
  }
  // use filter
  if (filter && filter.length > 1) {
    formData.query.$and = [
      { study: study },
      {
        $or: [
          { name: { $search: filter } },
          { description: { $search: filter } }
        ]
      }
    ]
  } else {
    formData.query.study = study
  }

  return feathersClient.service('form').find(formData)
}

export async function getForm (id) {
  return feathersClient.service('form').get(id)
}

export async function createForm (form) {
  return feathersClient.service('form').create(form)
}

export async function updateForm (form, id) {
  return feathersClient.service('form').patch(id, form)
}

export async function deleteForm (id) {
  return feathersClient.service('form').remove(id)
}

export async function deleteForms (ids) {
  return feathersClient.service('form').remove(null, {
    query: {
      _id: {
        $in: ids
      }
    }
  })
}
