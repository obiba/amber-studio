import { defineStore } from 'pinia'
import { ref } from 'vue'
import studyService from '../services/study'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'

export const useStudyStore = defineStore('study', () => {
  // State
  const studies = ref([])
  const study = ref({})
  const studyCount = ref(0)
  const studyPaginationOpts = ref({
    sortBy: 'name',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })

  // Actions
  async function getStudies(paginationOpts, filter) {
    try {
      const result = await studyService.getStudies(paginationOpts, filter)
      if (result) {
        studies.value = result.data || []
        studyCount.value = result.total || 0
        studyPaginationOpts.value.rowsNumber = result.total || 0
      } else {
        studies.value = []
        studyCount.value = 0
        studyPaginationOpts.value.rowsNumber = 0
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_studies'))
      studies.value = []
      studyCount.value = 0
    }
  }

  async function getStudy(id) {
    try {
      const result = await studyService.getStudy(id)
      if (result) {
        study.value = result
      } else {
        study.value = { _id: id }
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_study'))
      study.value = { _id: id }
    }
  }

  async function createStudy(studyData, paginationOpts) {
    try {
      const result = await studyService.createStudy(studyData)
      if (result) {
        Notify.create({
          message: t('success.create_study'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getStudies(paginationOpts)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function updateStudy(studyData, id, paginationOpts) {
    const studyId = id || studyData._id
    try {
      const result = await studyService.updateStudy(studyData, studyId)
      if (result) {
        Notify.create({
          message: t('success.update_study'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        study.value = result
        // Refresh list if pagination options provided
        if (paginationOpts) {
          await getStudies(paginationOpts)
        }
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteStudy(id, paginationOpts) {
    try {
      const result = await studyService.deleteStudy(id)
      if (result) {
        Notify.create({
          message: t('success.delete_study'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getStudies(paginationOpts)
      }
    } catch (err) {
      errorHandler.onError(err, {
        FormRemoveError: t('error.form_remove_error', err.data),
        FormRevisionRemoveError: t('error.form_revision_remove_error', err.data),
        default: t('error.general')
      })
    }
  }

  async function deleteStudies(ids, paginationOpts) {
    try {
      const result = await studyService.deleteStudies(ids)
      if (result) {
        Notify.create({
          message: t('success.delete_studies'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getStudies(paginationOpts)
      }
    } catch (err) {
      errorHandler.onError(err, {
        FormRemoveError: t('error.form_remove_error', err.data),
        FormRevisionRemoveError: t('error.form_revision_remove_error', err.data),
        default: t('error.general')
      })
    }
  }

  function setStudyPagination(opts) {
    studyPaginationOpts.value = opts
  }

  return {
    // State
    studies,
    study,
    studyCount,
    studyPaginationOpts,
    // Actions
    getStudies,
    getStudy,
    createStudy,
    updateStudy,
    deleteStudy,
    deleteStudies,
    setStudyPagination
  }
})
