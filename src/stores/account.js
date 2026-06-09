import { defineStore } from 'pinia'
import userService from '../services/user'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from './auth'

export const useAccountStore = defineStore('account', () => {
  // No state needed - all operations only

  // Actions
  async function registerUser(formData) {
    const router = useRouter()
    try {
      const result = await userService.register(
        formData.firstname,
        formData.lastname,
        formData.language,
        formData.email,
        formData.password,
        formData.token
      )
      if (result && result.status >= 201) {
        Notify.create({
          message: t('success.create_account'),
          color: 'positive'
        })
        router.push('/login')
      }
    } catch (err) {
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
      throw err
    }
  }

  async function updateProfile(id, profileData) {
    try {
      const result = await userService.updateProfile(id, profileData)
      if (result) {
        Notify.create({
          message: t('success.update_account'),
          color: 'positive'
        })
      }
      return result
    } catch (err) {
      errorHandler.onError(err, t('error.update_account'))
      throw err
    }
  }

  async function forgotPassword(emailAddress) {
    try {
      await userService.forgotPassword(emailAddress)
      Notify.create({
        message: t('success.send_reset_password'),
        color: 'positive',
        icon: 'fas fa-check'
      })
    } catch (err) {
      errorHandler.onError(err)
      throw err
    }
  }

  async function resetPassword(token, password) {
    return userService.resetPassword(token, password)
  }

  async function updatePassword(password, token) {
    const router = useRouter()
    try {
      const result = await userService.resetPassword(token, password)
      if (result && result.status === 200) {
        router.push('/account')
        Notify.create({
          message: t('success.reset_password'),
          color: 'positive'
        })
      }
      return result
    } catch (err) {
      throw err
    }
  }

  async function updatePasswordFromProfile(email, oldPassword, newPassword) {
    const authStore = useAuthStore()
    try {
      const result = await userService.updatePasswordFromProfile(
        email,
        oldPassword,
        newPassword
      )
      if (result && result.status >= 200) {
        Notify.create({
          message: t('success.update_password'),
          color: 'positive'
        })
        // Logout user after password change
        await authStore.logout()
      }
      return result
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
      throw err
    }
  }

  async function updateIdentity(password, currentEmail, updatedEmail) {
    try {
      const result = await userService.updateIdentity(
        password,
        currentEmail,
        updatedEmail
      )
      if (result && result.status === 201) {
        Notify.create({
          message: t('success.send_verify_email'),
          color: 'positive'
        })
      }
      return result
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
      throw err
    }
  }

  async function resendVerification(email) {
    try {
      const result = await userService.resendVerification(email)
      if (result && result.status >= 200 && result.status < 300) {
        Notify.create({
          message: t('success.resend_verify_email'),
          color: 'positive',
          icon: 'fas fa-check'
        })
      }
      return result
    } catch (err) {
      errorHandler.onError(err, t('error.general'))
      throw err
    }
  }

  return {
    // Actions
    registerUser,
    updateProfile,
    forgotPassword,
    resetPassword,
    updatePassword,
    updatePasswordFromProfile,
    updateIdentity,
    resendVerification
  }
})
