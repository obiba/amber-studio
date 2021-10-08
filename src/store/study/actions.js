import studyService from '../../services/study';
import { t } from '../../boot/i18n';
import { Notify } from 'quasar';

export async function getStudies({ commit }, payload) {
  let result = await studyService.getStudies(payload.paginationOpts, payload.filter).catch(err => {
    console.error(err)
    let errorCode = err.code;
    if (errorCode) {
      Notify.create({
        message: t('error.get_studies'),
        color: 'negative'
      });
    }
  });
  if (result) {
    commit('setStudies', result.data);
    commit('setStudyCount', result.total);
  } else {
    commit('setStudies', []);
    commit('setStudyCount', 0);
  }
}

export async function getStudy({ commit }, payload) {
  let result = await studyService.getStudy(payload.id).catch(err => {
    console.error(err)
    let errorCode = err.code;
    if (errorCode) {
      Notify.create({
        message: t('error.get_study'),
        color: 'negative'
      });
    }
  });
  if (result) {
    commit('setStudy', result);
  } else {
    commit('setStudy', { _id: payload.id });
  }
}

export async function createStudy({ dispatch }, payload) {
  let result = await studyService
    .createStudy(payload.study)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.create_study'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'study/getStudies',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  );
}

export async function updateStudy({ commit, dispatch }, payload) {
  let result = await studyService
    .updateStudy(payload.study, payload.id ? payload.id : payload.study._id)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.update_study'),
      color: 'positive',
      icon: 'fas fa-check'
    });
    commit('setStudy', result);
  }
  if (payload.paginationOpts) {
    dispatch(
      'study/getStudies',
      {
        paginationOpts: payload.paginationOpts
      },
      { root: true }
    );
  }
}

export async function deleteStudy({ dispatch }, payload) {
  let result = await studyService
    .deleteStudy(payload.id)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.delete_study'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'study/getStudies',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  );
}

export async function deleteStudies({ dispatch }, payload) {
  let result = await studyService
    .deleteStudies(payload.ids)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.delete_studies'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'study/getStudies',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  );
}