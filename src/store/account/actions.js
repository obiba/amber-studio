import userService from '../../services/user';
import { t } from '../../boot/i18n';
import { Notify } from 'quasar';

export async function registerUser(context, payload) {
  let result = await userService
    .register(
      payload.formData.firstname,
      payload.formData.lastname,
      payload.formData.language,
      payload.formData.email,
      payload.formData.password,
      payload.formData.token
    )
    .catch(err => {
      if (err.response) {
        let errorCode = err.response.data.code;
        if (errorCode === 409) {
          Notify.create({
            message: t('error.account_already_exists'),
            color: 'negative'
          });
        } else {
          Notify.create({
            message: t('error.create_account'),
            color: 'negative'
          });
        }
      }
    });
  if (result && result.status >= 201) {
    Notify.create({
      message: t('success.create_account'),
      color: 'positive'
    });
    this.$router.push('/login');
  }
}

export async function updateProfile(context, payload) {
  let result = await userService
    .updateProfile(payload.id, payload.profileData)
    .catch(err => {
      if (err.response) {
        let errorCode = err.response.data.code;
        if (errorCode) {
          Notify.create({
            message: t('error.update_account'),
            color: 'negative'
          });
        }
      }
    });
  if (result) {
    Notify.create({
      message: t('success.update_account'),
      color: 'positive'
    });
  }
}

export async function forgotPassword(context, payload) {
  return userService
    .forgotPassword(payload.emailAddress)
    .then(() => {
      Notify.create({
        message: t('success.send_reset_password'),
        color: 'positive',
        icon: 'fas fa-check'
      });
    })
    .catch(err => {
      Notify.create({
        message: err.response.data.message,
          //'There was an error processing your request. If this problem persists, contact support.',
        color: 'negative'
      });
    });
}

export async function resetPassword(context, payload) {
  return userService.resetPassword(payload.token, payload.password);
}

export async function updatePassword(context, payload) {
  let result = await userService.updatePassword(
    payload.password,
    payload.token
  );
  if (result && result.status === 200) {
    this.$router.push('/account');
    Notify.create({
      message: t('success.reset_password'),
      color: 'positive' });
  }
}

export async function updatePasswordFromProfile({ dispatch }, payload) {
  let result = await userService
    .updatePasswordFromProfile(
      payload.email,
      payload.oldPassword,
      payload.newPassword
    )
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result && result.status >= 200) {
    Notify.create({
      message: t('success.update_password'),
      color: 'positive'
    });
    dispatch('auth/logout', null, { root: true });
  }
}

export async function updateIdentity(context, payload) {
  let result = await userService
    .updateIdentity(
      payload.password,
      payload.currentEmail,
      payload.updatedEmail
    )
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result && result.status === 201) {
    Notify.create({
      message: t('success.send_verify_email'),
      color: 'positive'
    });
  }
}

export async function resendVerification(context, payload) {
  let result = await userService
    .resendVerification(payload.email)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result && result.status >= 200 && result.status < 300) {
    Notify.create({
      message: t('success.resend_verify_email'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
}

export async function createUser({ dispatch }, payload) {
  let result = await userService
    .createUser(payload.user)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.create_user'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'admin/getUsers',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  );
}

export async function updateUser({ dispatch }, payload) {
  let result = await userService
    .updateUser(payload.user, payload.id)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.update_user'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'admin/getUsers',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  );
}

export async function deleteUser({ dispatch }, payload) {
  let result = await userService
    .deleteUser(payload.id)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.delete_user'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'admin/getUsers',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  );
}

export async function deleteUsers({ dispatch }, payload) {
  let result = await userService
    .deleteUsers(payload.ids)
    .catch(err => {
      Notify.create({
        message: t('error.general'),
        color: 'negative'
      });
    });
  if (result) {
    Notify.create({
      message: t('success.delete_users'),
      color: 'positive',
      icon: 'fas fa-check'
    });
  }
  dispatch(
    'admin/getUsers',
    {
      paginationOpts: payload.paginationOpts
    },
    { root: true }
  );
}