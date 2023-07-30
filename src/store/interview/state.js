export default function () {
  return {
    interviewDesigns: [],
    interviewDesignPaginationOpts: {
      sortBy: 'createdAt',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    },
    interviewDesign: {},
    interviews: [],
    interviewPaginationOpts: {
      sortBy: 'createdAt',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    },
    interview: {}
  }
}
