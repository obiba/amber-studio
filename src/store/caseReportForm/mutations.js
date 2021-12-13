export function setCaseReportForm (state, caseReportForm) {
  state.caseReportForm = caseReportForm
}

export function setCaseReportForms (state, caseReportForms) {
  state.caseReportForms = [...caseReportForms]
}

export function setCaseReportFormPagination (state, payload) {
  state.caseReportFormPaginationOpts = payload.caseReportFormPaginationOpts
}

export function setCaseReportFormCount (state, count) {
  state.caseReportFormPaginationOpts.rowsNumber = count
}
