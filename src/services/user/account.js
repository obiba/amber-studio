import { feathersClient } from '../../boot/feathersClient'
import { api } from '../../boot/axios'

export async function login (email, password) {
  return feathersClient.service('auth').post({
    strategy: 'local',
    email: email,
    password: password
  })
}

export async function register (firstname, lastname, language, email, password, token) {
  return api.post('/user', {
    firstname: firstname,
    lastname: lastname,
    language: language,
    email: email,
    password: password,
    token: token,
    clientId: 'amber_studio'
  })
}

export async function updateProfile (id, user) {
  return feathersClient.service('user').patch(id, user)
}

export async function forgotPassword (email) {
  return api.post('/authManagement', {
    action: 'sendResetPwd',
    value: {
      email: email
    }
  })
}

export async function updatePasswordFromProfile (
  email,
  oldPassword,
  newPassword
) {
  return api.post('/authManagement', {
    action: 'passwordChange',
    value: {
      user: {
        email: email
      },
      oldPassword: oldPassword,
      password: newPassword
    }
  })
}

export async function updateIdentity (password, currentEmail, updatedEmail) {
  return api.post('/authManagement', {
    action: 'identityChange',
    value: {
      password: password,
      changes: { email: updatedEmail },
      user: {
        email: currentEmail
      }
    }
  })
}

export async function verifyAccount (token) {
  return api.post('/authManagement', {
    action: 'verifySignupLong',
    value: token
  })
}

export async function resendVerification (email) {
  return api.post('/authManagement', {
    action: 'resendVerifySignup',
    value: { email: email }
  })
}

export async function resetPassword (token, password) {
  return api.post('/authManagement', {
    action: 'resetPwdLong',
    value: { token: token, password: password }
  })
}
