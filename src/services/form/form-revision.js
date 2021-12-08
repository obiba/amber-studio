import { feathersClient } from '../../boot/feathersClient'

export async function getFormRevisions (opts, form, filter) {
  const formData = { query: { $sort: { revision: -1 } } }
  if (opts) {
    // qtable pagination's 'All' sets limit to 0
    formData.query.$limit = opts.rowsPerPage === 0 ? 1000 : opts.rowsPerPage
    formData.query.$skip = (opts.page - 1) * opts.rowsPerPage
    if (opts.sortBy) {
      formData.query.$sort = {}
      formData.query.$sort[opts.sortBy] = opts.descending ? -1 : 1
    }
  } else {
    formData.query.$limit = 10
  }
  // use filter
  if (filter) {
    if (!Number.isNaN(Number(filter))) {
      formData.query.$and = [
        { form: form },
        { revision: filter }
      ]
    } else if (filter.length > 1) {
      formData.query.$and = [
        { form: form },
        { comment: { $search: filter } }
      ]
    } else {
      formData.query.form = form
    }
  } else {
    formData.query.form = form
  }

  return feathersClient.service('form-revision').find(formData)
}

export async function createFormRevision (formRevision) {
  return feathersClient.service('form-revision').create(formRevision)
}

export async function deleteFormRevision (id) {
  return feathersClient.service('form-revision').remove(id)
}

export async function deleteFormRevisions (ids) {
  return feathersClient.service('form-revision').remove(null, {
    query: {
      _id: {
        $in: ids
      }
    }
  })
}
