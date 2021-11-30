import formService from '../../services/form'
import { t } from '../../boot/i18n'
import { Notify } from 'quasar'

export async function getForms ({ commit }, payload) {
  const result = await formService.getForms(payload.paginationOpts, payload.study, payload.filter).catch(err => {
    console.error(err)
    const errorCode = err.code
    if (errorCode) {
      Notify.create({
        message: t('error.get_study_forms'),
        color: 'negative'
      })
    }
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
    console.error(err)
    const errorCode = err.code
    if (errorCode) {
      Notify.create({
        message: t('error.get_study_form'),
        color: 'negative'
      })
    }
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
      console.error(err)
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      })
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
    .catch(() => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      })
    })
  if (result) {
    Notify.create({
      message: t('success.update_study_form'),
      color: 'positive',
      icon: 'fas fa-check'
    })
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
    .catch(() => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
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
    'study/getStudies',
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
    .catch(() => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
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
