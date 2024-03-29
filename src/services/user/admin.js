import { feathersClient } from '../../boot/feathersClient'

export async function getUsers (opts, filter, roles) {
  const formData = { query: { $sort: { descending: 1 } } }
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
  let filterQuery
  if (filter && filter.length > 1) {
    filterQuery = {
      $or: [
        { email: { $search: filter } },
        { firstname: { $search: filter } },
        { lastname: { $search: filter } }
      ]
    }
  }
  let rolesQuery
  if (roles && roles.length > 0) {
    rolesQuery = {
      role: {
        $in: roles
      }
    }
  }
  if (filterQuery && rolesQuery) {
    formData.query.$and = [filterQuery, rolesQuery]
  } else if (filterQuery) {
    formData.query = filterQuery
  } else if (rolesQuery) {
    formData.query = rolesQuery
  }

  return feathersClient.service('user').find(formData)
}

export async function getUsersByIds (ids) {
  return feathersClient.service('user').find({
    query: {
      $limit: 100,
      $sort: {
        email: 1
      },
      _id: {
        $in: ids
      }
    }
  })
}

export async function getUser (id) {
  return feathersClient.service('user').get(id)
}

export async function createUser (user) {
  return feathersClient.service('user').create(user)
}

export async function updateUser (user, id) {
  return feathersClient.service('user').patch(id, user)
}

export async function deleteUser (id) {
  return feathersClient.service('user').remove(id)
}

export async function deleteUsers (ids) {
  const promises = []
  const chunkSize = 10
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize)
    promises.push(feathersClient.service('user').remove(null, {
      query: {
        _id: {
          $in: chunk
        }
      }
    }))
  }
  return Promise.all(promises)
}
