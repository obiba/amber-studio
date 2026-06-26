import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { feathersClient } from '../boot/feathersClient'
import { api } from '../boot/axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const accessToken = ref(null)
  const isAuthenticated = ref(false)

  // Getters
  const userId = computed(() => user.value?._id)
  const userEmail = computed(() => user.value?.email || '?')
  const userRole = computed(() => user.value?.role || 'guest')

  // Actions
  async function authenticate (credentials) {
    try {
      const response = await feathersClient.reAuthenticate()
      await responseHandler(response)
      return response
    } catch (error) {
      // If reauth fails, try regular auth with credentials
      if (credentials) {
        const authResponse = await feathersClient.authenticate(credentials)
        await responseHandler(authResponse)
        return authResponse
      }
      throw error
    }
  }

  async function responseHandler (response) {
    if (response && response.user) {
      user.value = response.user
      accessToken.value = response.accessToken
      isAuthenticated.value = true
    }
  }

  async function logout () {
    try {
      await feathersClient.logout()
    } finally {
      user.value = null
      accessToken.value = null
      isAuthenticated.value = false
    }
  }

  async function reAuthenticate () {
    try {
      const response = await feathersClient.reAuthenticate()
      await responseHandler(response)
      return response
    } catch (error) {
      // Clear auth state on reauth failure
      user.value = null
      accessToken.value = null
      isAuthenticated.value = false
      throw error
    }
  }

  async function getOAuthProviders () {
    const response = await api.get('/auth/providers')
    return response.data
  }

  return {
    // State
    user,
    accessToken,
    isAuthenticated,
    // Getters
    userId,
    userEmail,
    userRole,
    // Actions
    authenticate,
    responseHandler,
    logout,
    reAuthenticate,
    getOAuthProviders
  }
})
