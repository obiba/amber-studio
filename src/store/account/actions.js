import userService from '../../services/user'
import { t } from '../../boot/i18n'
import { errorHandler } from '../../boot/errors'
import { Notify } from 'quasar'

export async function registerUser (context, payload) {
  const result = await userService
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
        const errorCode = err.response.data.code
        if (errorCode === 409) {
          Notify.create({
            message: t('error.account_already_exists'),
            color: 'negative'
          })
        } else if (errorCode === 400) {
          errorHandler.onError(err.response.data, t('error.create_account_invalid'))
        } else {
          Notify.create({
            message: t('error.create_account'),
            color: 'negative'
          })
        }
      }
    })
  if (result && result.status >= 201) {
    Notify.create({
      message: t('success.create_account'),
      color: 'positive'
    })
    this.$router.push('/login')
  }
}

export async function updateProfile (context, payload) {
  const result = await userService
    .updateProfile(payload.id, payload.profileData)
    .catch(err => {
      errorHandler.onError(err, t('error.update_account'))
    })
  if (result) {
    Notify.create({
      message: t('success.update_account'),
      color: 'positive'
    })
  }
}

export async function forgotPassword (context, payload) {
  return userService
    .forgotPassword(payload.emailAddress)
    .then(() => {
      Notify.create({
        message: t('success.send_reset_password'),
        color: 'positive',
        icon: 'fas fa-check'
      })
    })
    .catch(err => {
      errorHandler.onError(err)
    })
}

export async function resetPassword (context, payload) {
  return userService.resetPassword(payload.token, payload.password)
}

export async function updatePassword (context, payload) {
  const result = await userService.updatePassword(
    payload.password,
    payload.token
  )
  if (result && result.status === 200) {
    this.$router.push('/account')
    Notify.create({
      message: t('success.reset_password'),
      color: 'positive'
    })
  }
}

export async function updatePasswordFromProfile ({ dispatch }, payload) {
  const result = await userService
    .updatePasswordFromProfile(
      payload.email,
      payload.oldPassword,
      payload.newPassword
    )
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result && result.status >= 200) {
    Notify.create({
      message: t('success.update_password'),
      color: 'positive'
    })
    dispatch('auth/logout', null, { root: true })
  }
}

export async function updateIdentity (context, payload) {
  const result = await userService
    .updateIdentity(
      payload.password,
      payload.currentEmail,
      payload.updatedEmail
    )
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result && result.status === 201) {
    Notify.create({
      message: t('success.send_verify_email'),
      color: 'positive'
    })
  }
}

export async function resendVerification (context, payload) {
  const result = await userService
    .resendVerification(payload.email)
    .catch((err) => {
      errorHandler.onError(err, t('error.general'))
    })
  if (result && result.status >= 200 && result.status < 300) {
    Notify.create({
      message: t('success.resend_verify_email'),
      color: 'positive',
      icon: 'fas fa-check'
    })
  }
}
