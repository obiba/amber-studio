import { defineStore } from 'pinia'
import { ref } from 'vue'
import { formService, formRevisionService } from '../services/form'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'

export const useFormStore = defineStore('form', () => {
  // State - Forms
  const forms = ref([])
  const form = ref({})
  const formCount = ref(0)
  const formPaginationOpts = ref({
    sortBy: 'name',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })

  // State - Form Revisions
  const formRevisions = ref([])
  const formRevisionCount = ref(0)
  const formRevisionPaginationOpts = ref({
    sortBy: 'revision',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })

  // Actions - Forms
  async function getForms(paginationOpts, study, filter) {
    try {
      const result = await formService.getForms(paginationOpts, study, filter)
      if (result) {
        forms.value = result.data || []
        formCount.value = result.total || 0
        formPaginationOpts.value.rowsNumber = result.total || 0
      } else {
        forms.value = []
        formCount.value = 0
        formPaginationOpts.value.rowsNumber = 0
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_study_forms'))
      forms.value = []
      formCount.value = 0
    }
  }

  async function getForm(id) {
    try {
      const result = await formService.getForm(id)
      if (result) {
        form.value = result
      } else {
        form.value = { _id: id }
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_study_form'))
      form.value = { _id: id }
    }
  }

  async function createForm(formData, paginationOpts, study) {
    try {
      const result = await formService.createForm(formData)
      if (result) {
        Notify.create({
          message: t('success.create_study_form'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getForms(paginationOpts, study)
      }
    } catch (err) {
      // Special handling for 400 errors - use err.message directly
      if (err.code === 400) {
        errorHandler.onError(err, err.message)
      } else {
        errorHandler.onError(err, t('error.general'))
      }
    }
  }

  async function updateForm(formData, id, notification, paginationOpts, study) {
    const formId = id || formData._id
    try {
      const result = await formService.updateForm(formData, formId)
      if (result) {
        // Only show notification if explicitly requested
        if (notification) {
          Notify.create({
            message: t('success.update_study_form'),
            color: 'positive',
            icon: 'fas fa-check'
          })
        }
        form.value = result
        // Refresh list if pagination options provided
        if (paginationOpts) {
          await getForms(paginationOpts, study)
        }
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteForm(id, paginationOpts, study) {
    try {
      const result = await formService.deleteForm(id)
      if (result) {
        Notify.create({
          message: t('success.delete_study_form'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getForms(paginationOpts, study)
      }
    } catch (err) {
      errorHandler.onError(err, {
        FormRemoveError: t('error.form_remove_error', err.data),
        default: t('error.general')
      })
    }
  }

  async function deleteForms(ids, paginationOpts, study) {
    try {
      const result = await formService.deleteForms(ids)
      if (result) {
        Notify.create({
          message: t('success.delete_study_forms'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getForms(paginationOpts, study)
      }
    } catch (err) {
      errorHandler.onError(err, {
        FormRemoveError: t('error.form_remove_error', err.data),
        default: t('error.general')
      })
    }
  }

  // Actions - Form Revisions
  async function getFormRevisions(paginationOpts, form, filter) {
    try {
      const result = await formRevisionService.getFormRevisions(paginationOpts, form, filter)
      if (result) {
        formRevisions.value = result.data || []
        formRevisionCount.value = result.total || 0
        formRevisionPaginationOpts.value.rowsNumber = result.total || 0
      } else {
        formRevisions.value = []
        formRevisionCount.value = 0
        formRevisionPaginationOpts.value.rowsNumber = 0
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_form_revisions'))
      formRevisions.value = []
      formRevisionCount.value = 0
    }
  }

  async function createFormRevision(formRevisionData) {
    try {
      const result = await formRevisionService.createFormRevision(formRevisionData)
      if (result) {
        Notify.create({
          message: t('success.tagged_form'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Note: No list refresh for createFormRevision
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteFormRevision(id, paginationOpts, form) {
    try {
      const result = await formRevisionService.deleteFormRevision(id)
      if (result) {
        Notify.create({
          message: t('success.delete_form_revision'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getFormRevisions(paginationOpts, form)
      }
    } catch (err) {
      errorHandler.onError(err, {
        FormRevisionRemoveError: t('error.form_revision_remove_error', err.data),
        default: t('error.general')
      })
    }
  }

  async function deleteFormRevisions(ids, paginationOpts, form) {
    try {
      const result = await formRevisionService.deleteFormRevisions(ids)
      if (result) {
        Notify.create({
          message: t('success.delete_form_revisions'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getFormRevisions(paginationOpts, form)
      }
    } catch (err) {
      errorHandler.onError(err, {
        FormRevisionRemoveError: t('error.form_revision_remove_error', err.data),
        default: t('error.general')
      })
    }
  }

  // Pagination Helpers
  function setFormPagination(opts) {
    formPaginationOpts.value = opts
  }

  function setFormRevisionPagination(opts) {
    formRevisionPaginationOpts.value = opts
  }

  return {
    // State - Forms
    forms,
    form,
    formCount,
    formPaginationOpts,
    // State - Form Revisions
    formRevisions,
    formRevisionCount,
    formRevisionPaginationOpts,
    // Actions - Forms
    getForms,
    getForm,
    createForm,
    updateForm,
    deleteForm,
    deleteForms,
    // Actions - Form Revisions
    getFormRevisions,
    createFormRevision,
    deleteFormRevision,
    deleteFormRevisions,
    // Pagination Helpers
    setFormPagination,
    setFormRevisionPagination
  }
})
