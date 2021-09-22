import { feathersClient } from '../../boot/feathersClient';

export async function getUsers(opts, filter) {
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
  if (filter) {
    formData.query.$or = [
      { email: { $search: filter } },
      { firstname: { $search: filter } },
      { lastname: { $search: filter } }
    ];
  }
  return feathersClient.service('user').find(formData);
}
