import { defineStore } from 'pinia'
import { ref } from 'vue'
import userService from '../services/user'
import { groupService, taskService } from '../services/group'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'

export const useAdminStore = defineStore('admin', () => {
  // User State
  const users = ref([])
  const user = ref({})
  const userCount = ref(0)
  const userPaginationOpts = ref({
    sortBy: 'lastSeen',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })

  // Group State
  const groups = ref([])
  const group = ref({})
  const groupUsers = ref([])
  const groupCount = ref(0)
  const groupPaginationOpts = ref({
    sortBy: 'name',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })

  // Task State
  const tasks = ref([])
  const taskCount = ref(0)
  const taskPaginationOpts = ref({
    sortBy: 'createdTask',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })

  // User Actions
  async function getUsers (paginationOpts, filter, roles) {
    try {
      const result = await userService.getUsers(paginationOpts, filter, roles)
      if (result) {
        users.value = result.data || []
        userCount.value = result.total || 0
        userPaginationOpts.value.rowsNumber = result.total || 0
      } else {
        users.value = []
        userCount.value = 0
        userPaginationOpts.value.rowsNumber = 0
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_users'))
      users.value = []
      userCount.value = 0
    }
  }

  async function getUser (id) {
    try {
      const result = await userService.getUser(id)
      if (result) {
        user.value = result
      } else {
        user.value = { _id: id }
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_user'))
      user.value = { _id: id }
    }
  }

  async function createUser (userData, paginationOpts) {
    try {
      const result = await userService.createUser(userData)
      if (result) {
        Notify.create({
          message: t('success.create_user'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getUsers(paginationOpts)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function updateUser (userData, id, paginationOpts) {
    const userId = id || userData._id
    try {
      const result = await userService.updateUser(userData, userId)
      if (result) {
        Notify.create({
          message: t('success.update_user'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        user.value = result
        // Refresh list if pagination options provided
        if (paginationOpts) {
          await getUsers(paginationOpts)
        }
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteUser (id, paginationOpts) {
    try {
      const result = await userService.deleteUser(id)
      if (result) {
        Notify.create({
          message: t('success.delete_user'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getUsers(paginationOpts)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteUsers (ids, paginationOpts) {
    try {
      const result = await userService.deleteUsers(ids)
      if (result) {
        Notify.create({
          message: t('success.delete_users'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getUsers(paginationOpts)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  // Group Actions
  async function getGroups (paginationOpts, filter) {
    try {
      const result = await groupService.getGroups(paginationOpts, filter)
      if (result) {
        groups.value = result.data || []
        groupCount.value = result.total || 0
        groupPaginationOpts.value.rowsNumber = result.total || 0
      } else {
        groups.value = []
        groupCount.value = 0
        groupPaginationOpts.value.rowsNumber = 0
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_groups'))
      groups.value = []
      groupCount.value = 0
    }
  }

  async function getGroup (id) {
    try {
      const result = await groupService.getGroup(id)
      if (result) {
        group.value = result
        groupUsers.value = []
      } else {
        group.value = { _id: id }
        groupUsers.value = []
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_group'))
      group.value = { _id: id }
      groupUsers.value = []
    }
  }

  async function getGroupUsers (groupData) {
    if (groupData.users && groupData.users.length > 0) {
      try {
        const result = await userService.getUsersByIds(groupData.users)
        if (result) {
          groupUsers.value = result.data || []
        } else {
          groupUsers.value = []
        }
      } catch (err) {
        errorHandler.onError(err, t('error.get_group_users'))
        groupUsers.value = []
      }
    } else {
      groupUsers.value = []
    }
  }

  async function createGroup (groupData, paginationOpts) {
    try {
      const result = await groupService.createGroup(groupData)
      if (result) {
        Notify.create({
          message: t('success.create_group'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getGroups(paginationOpts)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function updateGroup (groupData, id, paginationOpts) {
    const groupId = id || groupData._id
    try {
      const result = await groupService.updateGroup(groupData, groupId)
      if (result) {
        Notify.create({
          message: t('success.update_group'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        group.value = result
        // Refresh list if pagination options provided
        if (paginationOpts) {
          await getGroups(paginationOpts)
        }
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteGroup (id, paginationOpts) {
    try {
      const result = await groupService.deleteGroup(id)
      if (result) {
        Notify.create({
          message: t('success.delete_group'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getGroups(paginationOpts)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteGroups (ids, paginationOpts) {
    try {
      const result = await groupService.deleteGroups(ids)
      if (result) {
        Notify.create({
          message: t('success.delete_groups'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getGroups(paginationOpts)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  // Task Actions
  async function getTasks (paginationOpts, filter) {
    try {
      const result = await taskService.getTasks(paginationOpts, filter)
      if (result) {
        tasks.value = result.data || []
        taskCount.value = result.total || 0
        taskPaginationOpts.value.rowsNumber = result.total || 0
      } else {
        tasks.value = []
        taskCount.value = 0
        taskPaginationOpts.value.rowsNumber = 0
      }
    } catch (err) {
      errorHandler.onError(err, t('error.get_tasks'))
      tasks.value = []
      taskCount.value = 0
    }
  }

  async function createTask (taskData, paginationOpts) {
    try {
      const result = await taskService.createTask(taskData)
      if (result) {
        Notify.create({
          message: t('success.create_task'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list only if pagination options provided
        if (paginationOpts) {
          await getTasks(paginationOpts)
        }
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteTask (id, paginationOpts) {
    try {
      const result = await taskService.deleteTask(id)
      if (result) {
        Notify.create({
          message: t('success.delete_task'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getTasks(paginationOpts)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  async function deleteTasks (ids, paginationOpts) {
    try {
      const result = await taskService.deleteTasks(ids)
      if (result) {
        Notify.create({
          message: t('success.delete_tasks'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        // Refresh list with current pagination
        await getTasks(paginationOpts)
      }
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
    }
  }

  // Pagination Setters
  function setUserPagination (opts) {
    userPaginationOpts.value = opts
  }

  function setGroupPagination (opts) {
    groupPaginationOpts.value = opts
  }

  function setTaskPagination (opts) {
    taskPaginationOpts.value = opts
  }

  return {
    // User State
    users,
    user,
    userCount,
    userPaginationOpts,
    // Group State
    groups,
    group,
    groupUsers,
    groupCount,
    groupPaginationOpts,
    // Task State
    tasks,
    taskCount,
    taskPaginationOpts,
    // User Actions
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    deleteUsers,
    // Group Actions
    getGroups,
    getGroup,
    getGroupUsers,
    createGroup,
    updateGroup,
    deleteGroup,
    deleteGroups,
    // Task Actions
    getTasks,
    createTask,
    deleteTask,
    deleteTasks,
    // Pagination Setters
    setUserPagination,
    setGroupPagination,
    setTaskPagination
  }
})
