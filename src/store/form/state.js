export default function () {
  return {
    forms: [],
    formPaginationOpts: {
      sortBy: 'name',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    },
    formRevisions: [],
    formRevisionPaginationOpts: {
      sortBy: 'revision',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    },
    form: {}
  }
}
