export function setUsers (state, users) {
  state.users = [...users]
}

export function setUser (state, user) {
  state.user = user
}

export function setUserPagination (state, payload) {
  state.userPaginationOpts = payload.userPaginationOpts
}

export function setUserCount (state, count) {
  state.userPaginationOpts.rowsNumber = count
}

export function setGroup (state, group) {
  state.group = group
}

export function setGroupUsers (state, users) {
  state.groupUsers = [...users]
}

export function setGroups (state, groups) {
  state.groups = [...groups]
}

export function setGroupPagination (state, payload) {
  state.groupPaginationOpts = payload.groupPaginationOpts
}

export function setGroupCount (state, count) {
  state.groupPaginationOpts.rowsNumber = count
}

export function setTasks (state, tasks) {
  state.tasks = [...tasks]
}

export function setTaskPagination (state, payload) {
  state.taskPaginationOpts = payload.taskPaginationOpts
}

export function setTaskCount (state, count) {
  state.taskPaginationOpts.rowsNumber = count
}
