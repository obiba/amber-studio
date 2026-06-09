import { defineStore } from 'pinia'
import { ref } from 'vue'
import { campaignService, interviewDesignService, interviewService } from '../services/interview'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'

export const useInterviewStore = defineStore('interview', () => {
  // State - Interviews
  const interviews = ref([])
  const interview = ref({})
  const interviewCount = ref(0)
  const interviewPaginationOpts = ref({
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })

  // State - Interview Designs
  const interviewDesigns = ref([])
  const interviewDesign = ref({})
  const interviewDesignCount = ref(0)
  const interviewDesignPaginationOpts = ref({
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })

  // State - Campaigns
  const campaigns = ref([])
  const campaignCount = ref(0)
  const campaignPaginationOpts = ref({
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })

  // Actions - Interviews
  async function getInterviews(paginationOpts, study, interviewDesign, campaign, state, participantValid, filter, from, to) {
    try {
      const result = await interviewService.getInterviews(paginationOpts, study, interviewDesign, campaign, state, participantValid, filter, from, to)
      if (result) {
        interviews.value = result.data || []
        interviewCount.value = result.total || 0
        interviewPaginationOpts.value.rowsNumber = result.total || 0
      } else {
        interviews.value = []
        interviewCount.value = 0
        interviewPaginationOpts.value.rowsNumber = 0
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_interviews'))
      interviews.value = []
      interviewCount.value = 0
    }
  }

  async function updateInterview(interviewData, id, paginationOpts, study, form) {
    try {
      const result = await interviewService.updateInterview(interviewData, id)
      if (result) {
        Notify.create({
          message: t('success.update_interview'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getInterviews(paginationOpts, study, form)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteInterview(id, paginationOpts, study, form) {
    try {
      const result = await interviewService.deleteInterview(id)
      if (result) {
        Notify.create({
          message: t('success.delete_interview'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getInterviews(paginationOpts, study, form)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteInterviews(ids, paginationOpts, study, form) {
    try {
      const result = await interviewService.deleteInterviews(ids)
      if (result) {
        Notify.create({
          message: t('success.delete_interviews'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getInterviews(paginationOpts, study, form)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  // Actions - Interview Designs
  async function getInterviewDesigns(paginationOpts, study, filter) {
    try {
      const result = await interviewDesignService.getInterviewDesigns(paginationOpts, study, filter)
      if (result) {
        interviewDesigns.value = result.data || []
        interviewDesignCount.value = result.total || 0
        interviewDesignPaginationOpts.value.rowsNumber = result.total || 0
      } else {
        interviewDesigns.value = []
        interviewDesignCount.value = 0
        interviewDesignPaginationOpts.value.rowsNumber = 0
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_interview_designs'))
      interviewDesigns.value = []
      interviewDesignCount.value = 0
    }
  }

  async function getInterviewDesign(id) {
    try {
      const result = await interviewDesignService.getInterviewDesign(id)
      if (result) {
        interviewDesign.value = result
      } else {
        interviewDesign.value = { _id: id }
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_interview_design'))
      interviewDesign.value = { _id: id }
    }
  }

  async function createInterviewDesign(interviewDesignData, paginationOpts) {
    try {
      const result = await interviewDesignService.createInterviewDesign(interviewDesignData)
      if (result) {
        Notify.create({
          message: t('success.create_interview_design'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getInterviewDesigns(paginationOpts, interviewDesignData.study)
      }
    } catch (err) {
      if (err.code === 400) {
        errorHandler.onError(err, err.message)
      } else {
        errorHandler.onError(err, t('error.general'))
      }
    }
  }

  async function updateInterviewDesign(interviewDesignData, id, paginationOpts, notification = true) {
    const designId = id || interviewDesignData._id
    try {
      const result = await interviewDesignService.updateInterviewDesign(interviewDesignData, designId)
      if (result) {
        if (notification) {
          Notify.create({
            message: t('success.update_interview_design'),
            color: 'positive',
            icon: 'fas fa-check'
          })
        }
        interviewDesign.value = result
        // Refresh list if pagination options provided
        if (paginationOpts) {
          await getInterviewDesigns(paginationOpts, interviewDesignData.study)
        }
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteInterviewDesign(id, paginationOpts, study) {
    try {
      const result = await interviewDesignService.deleteInterviewDesign(id)
      if (result) {
        Notify.create({
          message: t('success.delete_interview_design'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getInterviewDesigns(paginationOpts, study)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteInterviewDesigns(ids, paginationOpts, study) {
    try {
      const result = await interviewDesignService.deleteInterviewDesigns(ids)
      if (result) {
        Notify.create({
          message: t('success.delete_interview_designs'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getInterviewDesigns(paginationOpts, study)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  // Actions - Campaigns
  async function getCampaigns(paginationOpts, interviewDesign, study, filter) {
    try {
      const result = await campaignService.getCampaigns(paginationOpts, interviewDesign, study, filter)
      if (result) {
        campaigns.value = result.data || []
        campaignCount.value = result.total || 0
        campaignPaginationOpts.value.rowsNumber = result.total || 0
      } else {
        campaigns.value = []
        campaignCount.value = 0
        campaignPaginationOpts.value.rowsNumber = 0
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_campaigns'))
      campaigns.value = []
      campaignCount.value = 0
    }
  }

  async function createCampaign(campaignData, paginationOpts, interviewDesign) {
    try {
      const result = await campaignService.createCampaign(campaignData)
      if (result) {
        Notify.create({
          message: t('success.create_campaign'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getCampaigns(paginationOpts, interviewDesign)
      }
    } catch (err) {
      if (err.code === 400) {
        errorHandler.onError(err, err.message)
      } else {
        errorHandler.onError(err, t('error.general'))
      }
    }
  }

  async function updateCampaign(campaignData, id, paginationOpts, interviewDesign) {
    const campaignId = id || campaignData._id
    try {
      const result = await campaignService.updateCampaign(campaignData, campaignId)
      if (result) {
        Notify.create({
          message: t('success.update_campaign'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getCampaigns(paginationOpts, interviewDesign)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteCampaign(id, paginationOpts, interviewDesign) {
    try {
      const result = await campaignService.deleteCampaign(id)
      if (result) {
        Notify.create({
          message: t('success.delete_campaign'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getCampaigns(paginationOpts, interviewDesign)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  // Pagination setters
  function setInterviewPagination(opts) {
    interviewPaginationOpts.value = opts
  }

  function setInterviewDesignPagination(opts) {
    interviewDesignPaginationOpts.value = opts
  }

  function setCampaignPagination(opts) {
    campaignPaginationOpts.value = opts
  }

  return {
    // State - Interviews
    interviews,
    interview,
    interviewCount,
    interviewPaginationOpts,
    // State - Interview Designs
    interviewDesigns,
    interviewDesign,
    interviewDesignCount,
    interviewDesignPaginationOpts,
    // State - Campaigns
    campaigns,
    campaignCount,
    campaignPaginationOpts,
    // Actions - Interviews
    getInterviews,
    updateInterview,
    deleteInterview,
    deleteInterviews,
    // Actions - Interview Designs
    getInterviewDesigns,
    getInterviewDesign,
    createInterviewDesign,
    updateInterviewDesign,
    deleteInterviewDesign,
    deleteInterviewDesigns,
    // Actions - Campaigns
    getCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    // Pagination setters
    setInterviewPagination,
    setInterviewDesignPagination,
    setCampaignPagination
  }
})
