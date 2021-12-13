export default function () {
  return {
    caseReportForms: [],
    caseReportFormPaginationOpts: {
      sortBy: 'createdAt',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    },
    caseReportForm: {}
  }
}
