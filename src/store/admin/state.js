export default function () {
  return {
    users: [],
    userPaginationOpts: {
      sortBy: 'lastSeen',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    },
    user: {},
    groups: [],
    groupPaginationOpts: {
      sortBy: 'name',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    },
    group: {},
    groupUsers: []
  }
}
