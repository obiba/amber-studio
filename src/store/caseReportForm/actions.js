import caseReportFormService from '../../services/caseReportForm'
import { t } from '../../boot/i18n'
import { Notify } from 'quasar'

export async function getCaseReportForms ({ commit }, payload) {
  const result = await caseReportFormService.getCaseReportForms(payload.paginationOpts, payload.study, payload.filter).catch(err => {
    console.error(err)
    const errorCode = err.code
    if (errorCode) {
      Notify.create({
        message: t('error.get_case_report_forms'),
        color: 'negative'
      })
    }
  })
  if (result) {
    commit('setCaseReportForms', result.data)
    commit('setCaseReportFormCount', result.total)
  } else {
    commit('setCaseReportForms', [])
    commit('setCaseReportFormCount', 0)
  }
}

export async function createCaseReportForm ({ dispatch }, payload) {
  const result = await caseReportFormService
    .createCaseReportForm(payload.caseReportForm)
    .catch(err => {
      console.error(err)
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      })
    })
  if (result) {
    Notify.create({
      message: t('success.create_case_report_form'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'caseReportForm/getCaseReportForms',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.caseReportForm.study
    },
    { root: true }
  )
}

export async function updateCaseReportForm ({ commit, dispatch }, payload) {
  const result = await caseReportFormService
    .updateCaseReportForm(payload.caseReportForm, payload.id ? payload.id : payload.caseReportForm._id)
    .catch(() => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      })
    })
  if (result) {
    Notify.create({
      message: t('success.update_case_report_form'),
      color: 'positive',
      icon: 'fas fa-check'
    })
    commit('setCaseReportForm', result)
  }
  if (payload.paginationOpts) {
    dispatch(
      'caseReportForm/getCaseReportForms',
      {
        paginationOpts: payload.paginationOpts,
        study: payload.caseReportForm.study
      },
      { root: true }
    )
  }
}

export async function deleteCaseReportForm ({ dispatch }, payload) {
  const result = await caseReportFormService
    .deleteCaseReportForm(payload.id)
    .catch(() => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      })
    })
  if (result) {
    Notify.create({
      message: t('success.delete_case_report_form'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'caseReportForm/getCaseReportForms',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study
    },
    { root: true }
  )
}

export async function deleteCaseReportForms ({ dispatch }, payload) {
  const result = await caseReportFormService
    .deleteCaseReportForms(payload.ids)
    .catch(() => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      })
    })
  if (result) {
    Notify.create({
      message: t('success.delete_case_report_forms'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'caseReportForm/getCaseReportForms',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study
    },
    { root: true }
  )
}
