import { campaignService, interviewDesignService, interviewService } from '../../services/interview'
import { t } from '../../boot/i18n'
import { errorHandler } from '../../boot/errors'
import { Notify } from 'quasar'

export async function getInterviews ({ commit }, payload) {
  const result = await interviewService.getInterviews(payload.paginationOpts, payload.study, payload.interviewDesign, payload.state, payload.filter, payload.from, payload.to).catch(err => {
    errorHandler.onError(err, t('error.get_interviews'))
  })
  if (result) {
    commit('setInterviews', result.data)
    commit('setInterviewCount', result.total)
  } else {
    commit('setInterviews', [])
    commit('setInterviewCount', 0)
  }
}

export async function updateInterview ({ dispatch }, payload) {
  const result = await interviewService
    .updateInterview(payload.interview, payload.id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.update_interview'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'interview/getInterviews',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study,
      form: payload.form
    },
    { root: true }
  )
}

export async function deleteInterview ({ dispatch }, payload) {
  const result = await interviewService
    .deleteInterview(payload.id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.delete_interview'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'interview/getInterviews',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study,
      form: payload.form
    },
    { root: true }
  )
}

export async function deleteInterviews ({ dispatch }, payload) {
  const result = await interviewService
    .deleteInterviews(payload.ids)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.delete_interviews'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'interview/getInterviews',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study,
      form: payload.form
    },
    { root: true }
  )
}

export async function getInterviewDesigns ({ commit }, payload) {
  const result = await interviewDesignService.getInterviewDesigns(payload.paginationOpts, payload.study, payload.filter).catch(err => {
    errorHandler.onError(err, t('error.get_interview_designs'))
  })
  if (result) {
    commit('setInterviewDesigns', result.data)
    commit('setInterviewDesignCount', result.total)
  } else {
    commit('setInterviewDesigns', [])
    commit('setInterviewDesignCount', 0)
  }
}

export async function getInterviewDesign ({ commit }, payload) {
  const result = await interviewDesignService.getInterviewDesign(payload.id).catch(err => {
    errorHandler.onError(err, t('error.get_interview_design'))
  })
  if (result) {
    commit('setInterviewDesign', result)
  } else {
    commit('setInterviewDesign', { _id: payload.id })
  }
}

export async function createInterviewDesign ({ dispatch }, payload) {
  const result = await interviewDesignService
    .createInterviewDesign(payload.interviewDesign)
    .catch(err => {
      if (err.code === 400) {
        errorHandler.onError(err, err.message)
      } else {
        errorHandler.onError(err, t('error.general'))
      }
    })
  if (result) {
    Notify.create({
      message: t('success.create_interview_design'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'interview/getInterviewDesigns',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.interviewDesign.study
    },
    { root: true }
  )
}

export async function updateInterviewDesign ({ commit, dispatch }, payload) {
  const result = await interviewDesignService
    .updateInterviewDesign(payload.interviewDesign, payload.id ? payload.id : payload.interviewDesign._id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    if (payload.notification) {
      Notify.create({
        message: t('success.update_interview_design'),
        color: 'positive',
        icon: 'fas fa-check'
      })
    }
    commit('setInterviewDesign', result)
  }
  if (payload.paginationOpts) {
    dispatch(
      'interview/getInterviewDesigns',
      {
        paginationOpts: payload.paginationOpts,
        study: payload.interviewDesign.study
      },
      { root: true }
    )
  }
}

export async function deleteInterviewDesign ({ dispatch }, payload) {
  const result = await interviewDesignService
    .deleteInterviewDesign(payload.id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.delete_interview_design'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'interview/getInterviewDesigns',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study
    },
    { root: true }
  )
}

export async function deleteInterviewDesigns ({ dispatch }, payload) {
  const result = await interviewDesignService
    .deleteInterviewDesigns(payload.ids)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.delete_interview_designs'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'interview/getInterviewDesigns',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study
    },
    { root: true }
  )
}

export async function getCampaigns ({ commit }, payload) {
  const result = await campaignService.getCampaigns(payload.paginationOpts, payload.interviewDesign._id, payload.filter).catch(err => {
    errorHandler.onError(err, t('error.get_campaigns'))
  })
  if (result) {
    commit('setCampaigns', result.data)
    commit('setCampaignCount', result.total)
  } else {
    commit('setCampaigns', [])
    commit('setCampaignCount', 0)
  }
}

export async function createCampaign ({ dispatch }, payload) {
  const result = await campaignService
    .createCampaign(payload.campaign)
    .catch(err => {
      if (err.code === 400) {
        errorHandler.onError(err, err.message)
      } else {
        errorHandler.onError(err, t('error.general'))
      }
    })
  if (result) {
    Notify.create({
      message: t('success.create_campaign'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'interview/getCampaigns',
    {
      paginationOpts: payload.paginationOpts,
      interviewDesign: payload.interviewDesign
    },
    { root: true }
  )
}

export async function updateCampaign ({ dispatch }, payload) {
  const result = await campaignService
    .updateCampaign(payload.campaign, payload.id || payload.campaign._id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.update_campaign'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'interview/getCampaigns',
    {
      paginationOpts: payload.paginationOpts,
      interviewDesign: payload.interviewDesign
    },
    { root: true }
  )
}

export async function deleteCampaign ({ dispatch }, payload) {
  const result = await campaignService
    .deleteCampaign(payload.id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.delete_campaign'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'interview/getCampaigns',
    {
      paginationOpts: payload.paginationOpts,
      interviewDesign: payload.interviewDesign
    },
    { root: true }
  )
}
