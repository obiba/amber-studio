export default function() {
  return {
    users: [],
    userPaginationOpts: {
      sortBy: "lastLoggedIn",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    },
    groups: [],
    groupPaginationOpts: {
      sortBy: "name",
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    },
    group: {},
    groupUsers: []
  };
}
