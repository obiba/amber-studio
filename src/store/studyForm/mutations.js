export function setStudyForm(state, studyForm) {
  state.studyForm = studyForm;
}

export function setStudyForms(state, studyForms) {
  state.studyForms = [...studyForms];
}

export function setStudyFormPagination(state, payload) {
  state.studyFormPaginationOpts = payload.studyFormPaginationOpts;
}

export function setStudyFormCount(state, count) {
  state.studyFormPaginationOpts.rowsNumber = count;
}
