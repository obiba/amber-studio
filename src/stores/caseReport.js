import { defineStore } from 'pinia'
import { ref } from 'vue'
import { caseReportFormService, caseReportService } from '../services/caseReport'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'

export const useCaseReportStore = defineStore('caseReport', () => {
  // State - Case Reports
  const caseReports = ref([])
  const caseReport = ref({})
  const caseReportCount = ref(0)
  const caseReportPaginationOpts = ref({
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })

  // State - Case Report Forms
  const caseReportForms = ref([])
  const caseReportForm = ref({})
  const caseReportFormCount = ref(0)
  const caseReportFormPaginationOpts = ref({
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })

  // Actions - Case Reports
  async function getCaseReports (paginationOpts, study, form, caseReportForm, filter, from, to) {
    try {
      const result = await caseReportService.getCaseReports(
        paginationOpts,
        study,
        form,
        caseReportForm,
        filter,
        from,
        to
      )
      if (result) {
        caseReports.value = result.data || []
        caseReportCount.value = result.total || 0
        caseReportPaginationOpts.value.rowsNumber = result.total || 0
      } else {
        caseReports.value = []
        caseReportCount.value = 0
        caseReportPaginationOpts.value.rowsNumber = 0
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_case_reports'))
      caseReports.value = []
      caseReportCount.value = 0
    }
  }

  async function updateCaseReport (caseReportData, id, paginationOpts, study, form) {
    try {
      const result = await caseReportService.updateCaseReport(caseReportData, id)
      if (result) {
        Notify.create({
          message: t('success.update_case_report'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current options
        await getCaseReports(paginationOpts, study, form)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteCaseReport (id, paginationOpts, study, form) {
    try {
      const result = await caseReportService.deleteCaseReport(id)
      if (result) {
        Notify.create({
          message: t('success.delete_case_report'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current options
        await getCaseReports(paginationOpts, study, form)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteCaseReports (ids, paginationOpts, study, form) {
    try {
      const result = await caseReportService.deleteCaseReports(ids)
      if (result) {
        Notify.create({
          message: t('success.delete_case_reports'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current options
        await getCaseReports(paginationOpts, study, form)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  // Actions - Case Report Forms
  async function getCaseReportForms (paginationOpts, study, filter) {
    try {
      const result = await caseReportFormService.getCaseReportForms(
        paginationOpts,
        study,
        filter
      )
      if (result) {
        caseReportForms.value = result.data || []
        caseReportFormCount.value = result.total || 0
        caseReportFormPaginationOpts.value.rowsNumber = result.total || 0
      } else {
        caseReportForms.value = []
        caseReportFormCount.value = 0
        caseReportFormPaginationOpts.value.rowsNumber = 0
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_case_report_forms'))
      caseReportForms.value = []
      caseReportFormCount.value = 0
    }
  }

  async function createCaseReportForm (caseReportFormData, paginationOpts) {
    try {
      const result = await caseReportFormService.createCaseReportForm(caseReportFormData)
      if (result) {
        Notify.create({
          message: t('success.create_case_report_form'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getCaseReportForms(paginationOpts, caseReportFormData.study)
      }
    } catch (err) {
      // Special error handling: use err.message for 400 errors
      if (err.code === 400) {
        errorHandler.onError(err, err.message)
      } else {
        errorHandler.onError(err, t('error.general'))
      }
    }
  }

  async function updateCaseReportForm (caseReportFormData, id, paginationOpts) {
    const formId = id || caseReportFormData._id
    try {
      const result = await caseReportFormService.updateCaseReportForm(caseReportFormData, formId)
      if (result) {
        Notify.create({
          message: t('success.update_case_report_form'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Update single form state
        caseReportForm.value = result
        // Refresh list if pagination options provided
        if (paginationOpts) {
          await getCaseReportForms(paginationOpts, caseReportFormData.study)
        }
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteCaseReportForm (id, paginationOpts, study) {
    try {
      const result = await caseReportFormService.deleteCaseReportForm(id)
      if (result) {
        Notify.create({
          message: t('success.delete_case_report_form'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getCaseReportForms(paginationOpts, study)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteCaseReportForms (ids, paginationOpts, study) {
    try {
      const result = await caseReportFormService.deleteCaseReportForms(ids)
      if (result) {
        Notify.create({
          message: t('success.delete_case_report_forms'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getCaseReportForms(paginationOpts, study)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  // Pagination setters
  function setCaseReportPagination (opts) {
    caseReportPaginationOpts.value = opts
  }

  function setCaseReportFormPagination (opts) {
    caseReportFormPaginationOpts.value = opts
  }

  return {
    // State - Case Reports
    caseReports,
    caseReport,
    caseReportCount,
    caseReportPaginationOpts,
    // State - Case Report Forms
    caseReportForms,
    caseReportForm,
    caseReportFormCount,
    caseReportFormPaginationOpts,
    // Actions - Case Reports
    getCaseReports,
    updateCaseReport,
    deleteCaseReport,
    deleteCaseReports,
    // Actions - Case Report Forms
    getCaseReportForms,
    createCaseReportForm,
    updateCaseReportForm,
    deleteCaseReportForm,
    deleteCaseReportForms,
    // Pagination setters
    setCaseReportPagination,
    setCaseReportFormPagination
  }
})
