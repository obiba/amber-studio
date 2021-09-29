export function setUsers(state, users) {
  state.users = [...users];
}

export function setUserPagination(state, payload) {
  state.userPaginationOpts = payload.userPaginationOpts;
}

export function setUserCount(state, count) {
  state.userPaginationOpts.rowsNumber = count;
}

export function setGroups(state, groups) {
  state.groups = [...groups];
}

export function setGroupPagination(state, payload) {
  state.groupPaginationOpts = payload.groupPaginationOpts;
}

export function setGroupCount(state, count) {
  state.groupPaginationOpts.rowsNumber = count;
}
