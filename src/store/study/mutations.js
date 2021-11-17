export function setStudy (state, study) {
  state.study = study
}

export function setStudies (state, studies) {
  state.studies = [...studies]
}

export function setStudyPagination (state, payload) {
  state.studyPaginationOpts = payload.studyPaginationOpts
}

export function setStudyCount (state, count) {
  state.studyPaginationOpts.rowsNumber = count
}
