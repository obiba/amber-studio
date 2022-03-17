import studyService from '../../services/study'
import { t } from '../../boot/i18n'
import { errorHandler } from '../../boot/errors'
import { Notify } from 'quasar'

export async function getStudies ({ commit }, payload) {
  const result = await studyService.getStudies(payload.paginationOpts, payload.filter).catch(err => {
    errorHandler.onError(err, t('error.get_studies'))
  })
  if (result) {
    commit('setStudies', result.data)
    commit('setStudyCount', result.total)
  } else {
    commit('setStudies', [])
    commit('setStudyCount', 0)
  }
}

export async function getStudy ({ commit }, payload) {
  const result = await studyService.getStudy(payload.id).catch(err => {
    errorHandler.onError(err, t('error.get_study'))
  })
  if (result) {
    commit('setStudy', result)
  } else {
    commit('setStudy', { _id: payload.id })
  }
}

export async function createStudy ({ dispatch }, payload) {
  const result = await studyService
    .createStudy(payload.study)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.create_study'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'study/getStudies',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  )
}

export async function updateStudy ({ commit, dispatch }, payload) {
  const result = await studyService
    .updateStudy(payload.study, payload.id ? payload.id : payload.study._id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.update_study'),
      color: 'positive',
      icon: 'fas fa-check'
    })
    commit('setStudy', result)
  }
  if (payload.paginationOpts) {
    dispatch(
      'study/getStudies',
      {
        paginationOpts: payload.paginationOpts
      },
      { root: true }
    )
  }
}

export async function deleteStudy ({ dispatch }, payload) {
  const result = await studyService
    .deleteStudy(payload.id)
    .catch((err) => {
      errorHandler.onError(err, {
        FormRevisionHasCaseReports: t('error.form_revision_has_case_reports', err.data),
        default: t('error.general')
      })
    })
  if (result) {
    Notify.create({
      message: t('success.delete_study'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'study/getStudies',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  )
}

export async function deleteStudies ({ dispatch }, payload) {
  const result = await studyService
    .deleteStudies(payload.ids)
    .catch((err) => {
      errorHandler.onError(err, {
        FormRevisionHasCaseReports: t('error.form_revision_has_case_reports', err.data),
        default: t('error.general')
      })
    })
  if (result) {
    Notify.create({
      message: t('success.delete_studies'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'study/getStudies',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  )
}
