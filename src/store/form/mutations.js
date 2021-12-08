export function setForm (state, form) {
  state.form = form
}

export function setForms (state, forms) {
  state.forms = [...forms]
}

export function setFormPagination (state, payload) {
  state.formPaginationOpts = payload.formPaginationOpts
}

export function setFormCount (state, count) {
  state.formPaginationOpts.rowsNumber = count
}

export function setFormRevisions (state, formRevisions) {
  state.formRevisions = [...formRevisions]
}

export function setFormRevisionPagination (state, payload) {
  state.formRevisionPaginationOpts = payload.formRevisionPaginationOpts
}

export function setFormRevisionCount (state, count) {
  state.formRevisionPaginationOpts.rowsNumber = count
}
