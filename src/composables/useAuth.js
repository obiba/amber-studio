import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

/**
 * Auth helpers composable
 * Replaces AuthMixin functionality
 */
export function useAuth () {
  const authStore = useAuthStore()

  // User reference
  const user = computed(() => authStore.user)
  const userEmail = computed(() => authStore.userEmail)

  // Role checks
  const isAdministrator = computed(() =>
    authStore.user?.role === 'administrator'
  )

  const isManager = computed(() =>
    authStore.user?.role === 'manager'
  )

  const isInterviewer = computed(() =>
    authStore.user?.role === 'interviewer'
  )

  const isGuest = computed(() =>
    !authStore.user || authStore.user?.role === 'guest'
  )

  const isReadOnly = computed(() => {
    if (!authStore.user) return true
    const role = authStore.user.role
    return role !== 'administrator' && role !== 'manager'
  })

  return {
    user,
    userEmail,
    isAdministrator,
    isManager,
    isInterviewer,
    isGuest,
    isReadOnly,
    // Expose store actions
    authenticate: authStore.authenticate,
    logout: authStore.logout,
    reAuthenticate: authStore.reAuthenticate
  }
}
