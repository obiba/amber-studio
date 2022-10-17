import { caseReportFormService, caseReportService } from '../../services/caseReport'
import { t } from '../../boot/i18n'
import { errorHandler } from '../../boot/errors'
import { Notify } from 'quasar'

export async function getCaseReports ({ commit }, payload) {
  const result = await caseReportService.getCaseReports(payload.paginationOpts, payload.study, payload.form, payload.caseReportForm, payload.filter, payload.from, payload.to).catch(err => {
    errorHandler.onError(err, t('error.get_case_reports'))
  })
  if (result) {
    commit('setCaseReports', result.data)
    commit('setCaseReportCount', result.total)
  } else {
    commit('setCaseReports', [])
    commit('setCaseReportCount', 0)
  }
}

export async function deleteCaseReport ({ dispatch }, payload) {
  const result = await caseReportService
    .deleteCaseReport(payload.id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.delete_case_report'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'caseReportForm/getCaseReports',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study,
      form: payload.form
    },
    { root: true }
  )
}

export async function deleteCaseReports ({ dispatch }, payload) {
  const result = await caseReportService
    .deleteCaseReports(payload.ids)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.delete_case_reports'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'caseReportForm/getCaseReports',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study,
      form: payload.form
    },
    { root: true }
  )
}

export async function getCaseReportForms ({ commit }, payload) {
  const result = await caseReportFormService.getCaseReportForms(payload.paginationOpts, payload.study, payload.filter).catch(err => {
    errorHandler.onError(err, t('error.get_case_report_forms'))
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
      if (err.code === 400) {
        errorHandler.onError(err, err.message)
      } else {
        errorHandler.onError(err, t('error.general'))
      }
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
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
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
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
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
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
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
