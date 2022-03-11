import userService from '../../services/user'
import groupService from '../../services/group'
import { t } from '../../boot/i18n'
import { errorHandler } from '../../boot/errors'
import { Notify } from 'quasar'

export async function getUsers ({ commit }, payload) {
  const result = await userService.getUsers(payload.paginationOpts, payload.filter, payload.roles).catch(err => {
    errorHandler.onError(err, t('error.get_users'))
  })
  if (result) {
    commit('setUsers', result.data)
    commit('setUserCount', result.total)
  } else {
    commit('setUsers', [])
    commit('setUserCount', 0)
  }
}

export async function getUser ({ commit }, payload) {
  const result = await userService.getUser(payload.id).catch(err => {
    errorHandler.onError(err, t('error.get_user'))
  })
  if (result) {
    commit('setUser', result)
  } else {
    commit('setUser', { _id: payload.id })
  }
}

export async function createUser ({ dispatch }, payload) {
  const result = await userService
    .createUser(payload.user)
    .catch(err => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.create_user'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'admin/getUsers',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  )
}

export async function updateUser ({ commit, dispatch }, payload) {
  const result = await userService
    .updateUser(payload.user, payload.id ? payload.id : payload.user._id)
    .catch(err => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.update_user'),
      color: 'positive',
      icon: 'fas fa-check'
    })
    commit('setUser', result)
  }
  if (payload.paginationOpts) {
    dispatch(
      'admin/getUsers',
      {
        paginationOpts: payload.paginationOpts
      },
      { root: true }
    )
  }
}

export async function deleteUser ({ dispatch }, payload) {
  const result = await userService
    .deleteUser(payload.id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.delete_user'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'admin/getUsers',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  )
}

export async function deleteUsers ({ dispatch }, payload) {
  const result = await userService
    .deleteUsers(payload.ids)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.delete_users'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'admin/getUsers',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  )
}

export async function getGroups ({ commit }, payload) {
  const result = await groupService.getGroups(payload.paginationOpts, payload.filter).catch(err => {
    errorHandler.onError(err, t('error.get_groups'))
  })
  if (result) {
    commit('setGroups', result.data)
    commit('setGroupCount', result.total)
  } else {
    commit('setGroups', [])
    commit('setGroupCount', 0)
  }
}

export async function getGroup ({ commit }, payload) {
  const result = await groupService.getGroup(payload.id).catch(err => {
    errorHandler.onError(err, t('error.get_group'))
  })
  if (result) {
    commit('setGroup', result)
    commit('setGroupUsers', [])
  } else {
    commit('setGroup', { _id: payload.id })
    commit('setGroupUsers', [])
  }
}

export async function getGroupUsers ({ commit }, payload) {
  if (payload.group.users && payload.group.users.length > 0) {
    const result = await userService.getUsersByIds(payload.group.users).catch(err => {
      errorHandler.onError(err, t('error.get_group_users'))
    })
    if (result) {
      commit('setGroupUsers', result.data)
    } else {
      commit('setGroupUsers', [])
    }
  } else {
    commit('setGroupUsers', [])
  }
}

export async function createGroup ({ dispatch }, payload) {
  const result = await groupService
    .createGroup(payload.group)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.create_group'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'admin/getGroups',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  )
}

export async function updateGroup ({ commit, dispatch }, payload) {
  const result = await groupService
    .updateGroup(payload.group, payload.id ? payload.id : payload.group._id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.update_group'),
      color: 'positive',
      icon: 'fas fa-check'
    })
    commit('setGroup', result)
  }
  if (payload.paginationOpts) {
    dispatch(
      'admin/getGroups',
      {
        paginationOpts: payload.paginationOpts
      },
      { root: true }
    )
  }
}

export async function deleteGroup ({ dispatch }, payload) {
  const result = await groupService
    .deleteGroup(payload.id)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.delete_group'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'admin/getGroups',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  )
}

export async function deleteGroups ({ dispatch }, payload) {
  const result = await groupService
    .deleteGroups(payload.ids)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result) {
    Notify.create({
      message: t('success.delete_groups'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
  dispatch(
    'admin/getGroups',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  )
}
