import studyFormService from '../../services/studyForm';
import { t } from '../../boot/i18n';
import { Notify } from 'quasar';

export async function getStudyForms({ commit }, payload) {
  let result = await studyFormService.getStudyForms(payload.paginationOpts, payload.study, payload.filter).catch(err => {
    console.error(err)
    let errorCode = err.code;
    if (errorCode) {
      Notify.create({
        message: t('error.get_study_forms'),
        color: 'negative'
      });
    }
  });
  if (result) {
    commit('setStudyForms', result.data);
    commit('setStudyFormCount', result.total);
  } else {
    commit('setStudForms', []);
    commit('setStudyFormCount', 0);
  }
}

export async function getStudyForm({ commit }, payload) {
  let result = await studyFormService.getStudyForm(payload.id).catch(err => {
    console.error(err)
    let errorCode = err.code;
    if (errorCode) {
      Notify.create({
        message: t('error.get_study_form'),
        color: 'negative'
      });
    }
  });
  if (result) {
    commit('setStudyForm', result);
  } else {
    commit('setStudyForm', { _id: payload.id });
  }
}

export async function createStudyForm({ dispatch }, payload) {
  console.log(payload);
  let result = await studyFormService
    .createStudyForm(payload.studyForm)
    .catch(err => {
      console.error(err)
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.create_study_form'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'studyForm/getStudyForms',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.studyForm.study
    },
    { root: true }
  );
}

export async function updateStudyForm({ commit, dispatch }, payload) {
  let result = await studyFormService
    .updateStudyForm(payload.studyForm, payload.id ? payload.id : payload.studyForm._id)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.update_study_form'),
      color: 'positive',
      icon: 'fas fa-check'
    });
    commit('setStudyForm', result);
  }
  if (payload.paginationOpts) {
    dispatch(
      'study/getStudyForms',
      {
        paginationOpts: payload.paginationOpts,
        study: payload.studyForm.study
      },
      { root: true }
    );
  }
}

export async function deleteStudyForm({ dispatch }, payload) {
  let result = await studyFormService
    .deleteStudyForm(payload.id)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.delete_study_form'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'study/getStudies',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study
    },
    { root: true }
  );
}

export async function deleteStudyForms({ dispatch }, payload) {
  let result = await studyFormService
    .deleteStudyForms(payload.ids)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.delete_study_forms'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'studyForm/getStudyForms',
    {
      paginationOpts: payload.paginationOpts,
      study: payload.study
    },
    { root: true }
  );
}