//
// Case Reports
//

export function setCaseReports (state, caseReports) {
  state.caseReports = [...caseReports]
}

export function setCaseReportPagination (state, payload) {
  state.caseReportPaginationOpts = payload.caseReportPaginationOpts
}

export function setCaseReportCount (state, count) {
  state.caseReportPaginationOpts.rowsNumber = count
}

//
// Case Report Forms
//

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
