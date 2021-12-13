import caseReportFormService from '../../services/caseReportForm'
import { t } from '../../boot/i18n'
import { Notify } from 'quasar'

export async function getCaseReportForms ({ commit }, payload) {
  const result = await caseReportFormService.getCaseReportForms(payload.paginationOpts, payload.study, payload.filter).catch(err => {
    console.error(err)
    const errorCode = err.code
    if (errorCode) {
      Notify.create({
        message: t('error.get_study_case_report_forms'),
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

export async function getCaseReportForm ({ commit }, payload) {
  const result = await caseReportFormService.getCaseReportForm(payload.id).catch(err => {
    console.error(err)
    const errorCode = err.code
    if (errorCode) {
      Notify.create({
        message: t('error.get_study_case_report_form'),
        color: 'negative'
      })
    }
  })
  if (result) {
    commit('setCaseReportForm', result)
  } else {
    commit('setCaseReportForm', { _id: payload.id })
  }
}

export async function createCaseReportForm ({ dispatch }, payload) {
  const result = await caseReportFormService
    .createCaseReportForm(payload.caseReport)
    .catch(err => {
      console.error(err)
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      })
    })
  if (result) {
    Notify.create({
      message: t('success.create_study_case_report_form'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'caseReportForm/getCaseReportForms',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.caseReport.study
    },
    { root: true }
  )
}

export async function updateCaseReportForm ({ commit, dispatch }, payload) {
  const result = await caseReportFormService
    .updateCaseReportForm(payload.caseReport, payload.id ? payload.id : payload.caseReport._id)
    .catch(() => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      })
    })
  if (result) {
    console.log(payload)
    if (payload.notification) {
      Notify.create({
        message: t('success.update_study_case_report_form'),
        color: 'positive',
        icon: 'fas fa-check'
      })
    }
    commit('setCaseReportForm', result)
  }
  if (payload.paginationOpts) {
    dispatch(
      'study/getCaseReportForms',
      {
        paginationOpts: payload.paginationOpts,
        study: payload.caseReport.study
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
      message: t('success.delete_study_case_report_form'),
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
      message: t('success.delete_study_case_report_forms'),
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
