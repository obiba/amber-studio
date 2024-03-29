import { formService, formRevisionService } from '../../services/form'
import { t } from '../../boot/i18n'
import { errorHandler } from '../../boot/errors'
import { Notify } from 'quasar'

export async function getForms ({ commit }, payload) {
  const result = await formService.getForms(payload.paginationOpts, payload.study, payload.filter).catch(err => {
    errorHandler.onError(err, t('error.get_study_forms'))
  })
  if (result) {
    commit('setForms', result.data)
    commit('setFormCount', result.total)
  } else {
    commit('setForms', [])
    commit('setFormCount', 0)
  }
}

export async function getForm ({ commit }, payload) {
  const result = await formService.getForm(payload.id).catch(err => {
    errorHandler.onError(err, t('error.get_study_form'))
  })
  if (result) {
    commit('setForm', result)
  } else {
    commit('setForm', { _id: payload.id })
  }
}

export async function createForm ({ dispatch }, payload) {
  const result = await formService
    .createForm(payload.form)
    .catch(err => {
      if (err.code === 400) {
        errorHandler.onError(err, err.message)
      } else {
        errorHandler.onError(err, t('error.general'))
      }
    })
  if (result) {
    Notify.create({
      message: t('success.create_study_form'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'form/getForms',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.form.study
    },
    { root: true }
  )
}

export async function updateForm ({ commit, dispatch }, payload) {
  const result = await formService
    .updateForm(payload.form, payload.id ? payload.id : payload.form._id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    if (payload.notification) {
      Notify.create({
        message: t('success.update_study_form'),
        color: 'positive',
        icon: 'fas fa-check'
      })
    }
    commit('setForm', result)
  }
  if (payload.paginationOpts) {
    dispatch(
      'study/getForms',
      {
        paginationOpts: payload.paginationOpts,
        study: payload.form.study
      },
      { root: true }
    )
  }
}

export async function deleteForm ({ dispatch }, payload) {
  const result = await formService
    .deleteForm(payload.id)
    .catch((err) => {
      errorHandler.onError(err, {
        FormRemoveError: t('error.form_remove_error', err.data),
        default: t('error.general')
      })
    })
  if (result) {
    Notify.create({
      message: t('success.delete_study_form'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'form/getForms',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study
    },
    { root: true }
  )
}

export async function deleteForms ({ dispatch }, payload) {
  const result = await formService
    .deleteForms(payload.ids)
    .catch((err) => {
      errorHandler.onError(err, {
        FormRemoveError: t('error.form_remove_error', err.data),
        default: t('error.general')
      })
    })
  if (result) {
    Notify.create({
      message: t('success.delete_study_forms'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'form/getForms',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study
    },
    { root: true }
  )
}

export async function createFormRevision ({ dispatch }, payload) {
  const result = await formRevisionService
    .createFormRevision(payload.formRevision)
    .catch(err => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.tagged_form'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
}

export async function getFormRevisions ({ commit }, payload) {
  const result = await formRevisionService.getFormRevisions(payload.paginationOpts, payload.form, payload.filter).catch(err => {
    errorHandler.onError(err, t('error.get_form_revisions'))
  })
  if (result) {
    commit('setFormRevisions', result.data)
    commit('setFormRevisionCount', result.total)
  } else {
    commit('setFormRevisions', [])
    commit('setFormRevisionCount', 0)
  }
}

export async function deleteFormRevision ({ dispatch }, payload) {
  const result = await formRevisionService
    .deleteFormRevision(payload.id)
    .catch((err) => {
      errorHandler.onError(err, {
        FormRevisionRemoveError: t('error.form_revision_remove_error', err.data),
        default: t('error.general')
      })
    })
  if (result) {
    Notify.create({
      message: t('success.delete_form_revision'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'form/getFormRevisions',
    {
      paginationOpts: payload.paginationOpts,
      form: payload.form
    },
    { root: true }
  )
}

export async function deleteFormRevisions ({ dispatch }, payload) {
  const result = await formRevisionService
    .deleteFormRevisions(payload.ids)
    .catch((err) => {
      errorHandler.onError(err, {
        FormRevisionRemoveError: t('error.form_revision_remove_error', err.data),
        default: t('error.general')
      })
    })
  if (result) {
    Notify.create({
      message: t('success.delete_form_revisions'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'form/getFormRevisions',
    {
      paginationOpts: payload.paginationOpts,
      form: payload.form
    },
    { root: true }
  )
}
