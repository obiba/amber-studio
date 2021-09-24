import { feathersClient } from '../../boot/feathersClient';

export async function getUsers(opts, filter, roles) {
  let formData = { query: { $sort: { descending: 1 } } };
  if (opts) {
    // qtable pagination's 'All' sets limit to 0
    formData.query.$limit = opts.rowsPerPage === 0 ? 1000 : opts.rowsPerPage;
    formData.query.$skip = (opts.page - 1) * opts.rowsPerPage;
    if (opts.sortBy) {
      formData.query.$sort[opts.sortBy] = opts.descending ? 1 : -1;
    }
  } else {
    formData.query.$limit = 5;
  }
  // use filter
  let filterQuery;
  if (filter && filter.length>1) {
    filterQuery = { $or: [
      { email: { $search: filter } },
      { firstname: { $search: filter } },
      { lastname: { $search: filter } }
    ]};
  }
  let rolesQuery;
  if (roles) {
    rolesQuery = {
      role: {
        $in: roles
      }
    };
  }
  if (filterQuery && rolesQuery) {
    formData.query.$and = [filterQuery, rolesQuery];
  } else if (filterQuery) {
    formData.query = filterQuery;
  } else if (rolesQuery) {
    formData.query = rolesQuery;
  }
  
  return feathersClient.service('user').find(formData);
}
