import userService from '../../services/user';
import { Notify } from 'quasar';

export async function getUsers({ commit }, payload) {
  let result = await userService.getUsers(payload.paginationOpts, payload.filter, payload.roles).catch(err => {
    console.error(err)
    if (err.response) {
      let errorCode = err.response.data.code;
      if (errorCode) {
        Notify.create({
          message: `There was an error retrieving users.`,
          color: 'negative'
        });
      }
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
