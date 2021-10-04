import userService from '../../services/user';
import groupService from '../../services/group';
import { t } from '../../boot/i18n';
import { Notify } from 'quasar';

export async function getUsers({ commit }, payload) {
  let result = await userService.getUsers(payload.paginationOpts, payload.filter, payload.roles).catch(err => {
    console.error(err)
    let errorCode = err.code;
    if (errorCode) {
      Notify.create({
        message: t('error.get_users'),
        color: 'negative'
      });
    }
  });
  if (result) {
    commit('setUsers', result.data);
    commit('setUserCount', result.total);
  } else {
    commit('setUsers', []);
    commit('setUserCount', 0);
  }
}

export async function getGroups({ commit }, payload) {
  let result = await groupService.getGroups(payload.paginationOpts, payload.filter).catch(err => {
    console.error(err)
    let errorCode = err.code;
    if (errorCode) {
      Notify.create({
        message: t('error.get_groups'),
        color: 'negative'
      });
    }
  });
  if (result) {
    commit('setGroups', result.data);
    commit('setGroupCount', result.total);
  } else {
    commit('setGroups', []);
    commit('setGroupCount', 0);
  }
}

export async function getGroup({ commit }, payload) {
  let result = await groupService.getGroup(payload.id).catch(err => {
    console.error(err)
    let errorCode = err.code;
    if (errorCode) {
      Notify.create({
        message: t('error.get_group'),
        color: 'negative'
      });
    }
  });
  if (result) {
    commit('setGroup', result);
    commit('setGroupUsers', []);
  } else {
    commit('setGroup', { _id: payload.id });
    commit('setGroupUsers', []);
  }
}

export async function getGroupUsers({ commit }, payload) {
  if (payload.group.users && payload.group.users.length>0) {
    let result = await userService.getUsersByIds(payload.group.users).catch(err => {
      console.error(err)
      let errorCode = err.code;
      if (errorCode) {
        Notify.create({
          message: t('error.get_group_users'),
          color: 'negative'
        });
      }
    });
    if (result) {
      commit('setGroupUsers', result.data);
    } else {
      commit('setGroupUsers', []);
    }
  } else {
    commit('setGroupUsers', []);  
  }
}

export async function createGroup({ dispatch }, payload) {
  let result = await groupService
    .createGroup(payload.group)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.create_group'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'admin/getGroups',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  );
}

export async function updateGroup({ commit, dispatch }, payload) {
  let result = await groupService
    .updateGroup(payload.group, payload.id ? payload.id : payload.group._id)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.update_group'),
      color: 'positive',
      icon: 'fas fa-check'
    });
    commit('setGroup', result);
  }
  if (payload.paginationOpts) {
    dispatch(
      'admin/getGroups',
      {
        paginationOpts: payload.paginationOpts
      },
      { root: true }
    );
  }
}

export async function deleteGroup({ dispatch }, payload) {
  let result = await groupService
    .deleteGroup(payload.id)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.delete_group'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'admin/getGroups',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  );
}

export async function deleteGroups({ dispatch }, payload) {
  let result = await groupService
    .deleteGroups(payload.ids)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.delete_groups'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'admin/getGroups',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  );
}