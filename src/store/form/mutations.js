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
