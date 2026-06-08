# Phase 3: Pinia + Feathers-Pinia Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate from Vuex 4 + FeathersVuex to Pinia 2 + Feathers-Pinia with 7 stores and useAuth composable

**Architecture:** Replace Vuex modules with Pinia stores using setup syntax. Replace FeathersVuex auth plugin with Feathers-Pinia client. Convert AuthMixin to useAuth composable. All stores use direct mutations (no commits).

**Tech Stack:** Pinia 2.3.1, feathers-pinia 4.5.4, Vue 3.5 Composition API, Feathers v5

---

## Prerequisites

**Phase 2 Complete:**
- ✅ Vite build infrastructure working
- ✅ Pinia 2.3.1 installed
- ✅ feathers-pinia 4.5.4 installed
- ✅ Vuex removed from package.json
- ✅ All static imports converted

**Current State:**
- Vuex code still in place (6 modules in `src/store/`)
- FeathersVuex still referenced in boot files
- 27+ components using AuthMixin
- All components still using Options API with Vuex

---

## File Structure Overview

### Files to Create

**Stores (7 files):**
- `src/stores/account.js` - User registration, profile, password management
- `src/stores/admin.js` - Users, groups, tasks management
- `src/stores/caseReport.js` - Case reports and CRF templates
- `src/stores/form.js` - Study forms with versioning
- `src/stores/interview.js` - Interviews, designs, campaigns  
- `src/stores/study.js` - Study CRUD operations
- `src/stores/auth.js` - Feathers-Pinia authentication (replaces store.auth.js)

**Composables (1 file):**
- `src/composables/useAuth.js` - Auth helpers (replaces AuthMixin)

**Boot Files (2 files to modify):**
- `src/boot/feathersClient.js` - Initialize Feathers-Pinia client
- `src/boot/auth.js` - Update router guards for Pinia

**Main Entry (1 file to modify):**
- `src/App.vue` - Initialize Pinia app plugin

### Files to Delete (After Migration)
- `src/store/` directory (entire folder after all components migrated)
- `src/mixins/AuthMixin.js` (after all components migrated)

---

## Task 1: Setup Pinia Foundation

**Files:**
- Modify: `src/App.vue`
- Create: `src/stores/README.md`

- [ ] **Step 1: Add Pinia to App.vue**

File: `src/App.vue`

Find the `<script>` section and ensure Pinia is available. Quasar's boot system should already have Pinia available, but verify the app setup.

No changes needed to App.vue - Pinia will be initialized via boot file.

- [ ] **Step 2: Create stores directory**

```bash
mkdir -p src/stores
mkdir -p src/composables
```

- [ ] **Step 3: Create stores README**

File: `src/stores/README.md`

```markdown
# Pinia Stores

All stores use Composition API setup syntax.

## Store List
- `account.js` - User account operations
- `admin.js` - Admin management (users, groups, tasks)
- `auth.js` - Authentication (Feathers-Pinia)
- `caseReport.js` - Case reports and CRF templates
- `form.js` - Study forms with versioning
- `interview.js` - Interviews, designs, campaigns
- `study.js` - Study CRUD operations

## Pattern
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  const items = ref([])
  const loading = ref(false)
  
  const itemCount = computed(() => items.value.length)
  
  async function fetchItems() {
    loading.value = true
    // ... fetch logic
    loading.value = false
  }
  
  return { items, loading, itemCount, fetchItems }
})
```
```

- [ ] **Step 4: Commit**

```bash
git add src/stores/README.md
git commit -m "feat: initialize Pinia stores structure"
```

---

## Task 2: Feathers-Pinia Client Setup

**Files:**
- Modify: `src/boot/feathersClient.js`
- Create: `src/boot/pinia.js`

- [ ] **Step 1: Create Pinia boot file**

File: `src/boot/pinia.js`

```javascript
import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'

export default boot(({ app }) => {
  const pinia = createPinia()
  app.use(pinia)
})

export { }
```

- [ ] **Step 2: Update quasar.config.js boot order**

File: `quasar.config.js`

Find the `boot` array and update to load pinia first:

```javascript
boot: [
  'pinia',  // Add this first
  'axios',
  'feathersClient',
  'auth',
  'i18n',
  'vuelidate',
  'recaptcha',
  'errors',
  'settings',
  'csv'
],
```

- [ ] **Step 3: Replace FeathersVuex with Feathers-Pinia**

File: `src/boot/feathersClient.js`

Replace entire content:

```javascript
import { boot } from 'quasar/wrappers'
import { createClient } from 'feathers-pinia'
import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'
import { iff, discard } from 'feathers-hooks-common'
import { axios } from './axios'

const restClient = rest(import.meta.env.VITE_API || import.meta.env.API)

const feathersClient = feathers()
  .configure(restClient.axios(axios))
  .configure(auth({ storage: window.localStorage }))
  .hooks({
    before: {
      all: [
        iff(
          context => ['create', 'update', 'patch'].includes(context.method),
          discard('__id', '__isTemp')
        )
      ]
    }
  })

// Create Feathers-Pinia client
const api = createClient(feathersClient, {
  idField: '_id',
  whitelist: ['$regex', '$options'],
  storage: window.localStorage
})

export default boot(({ app }) => {
  // Feathers-Pinia auto-creates service stores
  // Services will be set up in their respective stores
})

export { api, feathersClient }
```

- [ ] **Step 4: Test that app still runs**

```bash
yarn quasar dev
```

Expected: Dev server starts (will still have Vuex errors, that's OK)

- [ ] **Step 5: Commit**

```bash
git add src/boot/pinia.js src/boot/feathersClient.js quasar.config.js
git commit -m "feat: replace FeathersVuex with Feathers-Pinia client"
```

---

## Task 3: Create Auth Store (Feathers-Pinia)

**Files:**
- Create: `src/stores/auth.js`

- [ ] **Step 1: Create auth store with Feathers-Pinia**

File: `src/stores/auth.js`

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../boot/feathersClient'

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
  async function authenticate(credentials) {
    try {
      const response = await api.reAuthenticate()
      await responseHandler(response)
      return response
    } catch (error) {
      // If reauth fails, try regular auth with credentials
      if (credentials) {
        const authResponse = await api.authenticate(credentials)
        await responseHandler(authResponse)
        return authResponse
      }
      throw error
    }
  }

  async function responseHandler(response) {
    if (response && response.user) {
      user.value = response.user
      accessToken.value = response.accessToken
      isAuthenticated.value = true
    }
  }

  async function logout() {
    try {
      await api.logout()
    } finally {
      user.value = null
      accessToken.value = null
      isAuthenticated.value = false
    }
  }

  async function reAuthenticate() {
    try {
      const response = await api.reAuthenticate()
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
    reAuthenticate
  }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/auth.js
git commit -m "feat: create Pinia auth store with Feathers-Pinia"
```

---

## Task 4: Create useAuth Composable

**Files:**
- Create: `src/composables/useAuth.js`

- [ ] **Step 1: Create useAuth composable**

File: `src/composables/useAuth.js`

```javascript
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

/**
 * Auth helpers composable
 * Replaces AuthMixin functionality
 */
export function useAuth() {
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
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useAuth.js
git commit -m "feat: create useAuth composable to replace AuthMixin"
```

---

## Task 5: Update Router Guards for Pinia

**Files:**
- Modify: `src/boot/auth.js`

- [ ] **Step 1: Update auth boot file to use Pinia**

File: `src/boot/auth.js`

Replace entire content:

```javascript
import { boot } from 'quasar/wrappers'
import { LocalStorage, Notify } from 'quasar'
import { useAuthStore } from '../stores/auth'
import { feathersClient } from './feathersClient'

export default boot(async ({ router, app }) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      const authStore = useAuthStore()
      const user = authStore.user

      if (user) {
        // Check role-based access
        if (to.meta.requiresAdmin && (!user.role || user.role !== 'administrator')) {
          Notify.create({
            message: 'Your account is not authorized to see this view. If this is in error, please contact support.',
            color: 'negative'
          })
          next(from.path)
        } else if (to.meta.noGuest && (!user.role || user.role === 'guest')) {
          Notify.create({
            message: 'Your account is not authorized to see this view. If this is in error, please contact support.',
            color: 'negative'
          })
          next(from.path)
        } else if (!LocalStorage.getItem('feathers-jwt') && to.path !== '/') {
          next('/login')
        } else {
          next()
        }
      } else if (LocalStorage.getItem('feathers-jwt')) {
        next('/loading')
        // Could be not expired but also still not valid, then reauth
        feathersClient.reAuthenticate().then((response) => {
          authStore.responseHandler(response)
          router.push(to.path)
        }).catch(() => {
          // Remove expired/unusable token
          LocalStorage.remove('feathers-jwt')
          router.push('/login')
        })
      } else if (to.path !== '/login') {
        next('/login')
      } else {
        next()
      }
    } else {
      next()
    }
  })
})
```

- [ ] **Step 2: Test dev server starts**

```bash
yarn quasar dev
```

Expected: Should start, but will have errors from components still using Vuex

- [ ] **Step 3: Commit**

```bash
git add src/boot/auth.js
git commit -m "feat: update router guards to use Pinia auth store"
```

---

## Task 6: Create Study Store

**Files:**
- Create: `src/stores/study.js`
- Reference: `src/store/study/actions.js`

- [ ] **Step 1: Review current Vuex study store**

Read `src/store/study/actions.js` to understand current actions

- [ ] **Step 2: Create Pinia study store**

File: `src/stores/study.js`

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import studyService from '../services/study'

export const useStudyStore = defineStore('study', () => {
  // State
  const studies = ref([])
  const studyData = ref(null)
  const loading = ref(false)

  // Actions
  async function getStudies(query = {}) {
    loading.value = true
    try {
      const result = await studyService.getStudies(query)
      studies.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function getStudy(id) {
    loading.value = true
    try {
      const result = await studyService.getStudy(id)
      studyData.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function createStudy(study) {
    loading.value = true
    try {
      const result = await studyService.createStudy(study)
      studies.value.push(result)
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateStudy({ id, study }) {
    loading.value = true
    try {
      const result = await studyService.updateStudy(id, study)
      studyData.value = result
      // Update in list if present
      const index = studies.value.findIndex(s => s._id === id)
      if (index >= 0) {
        studies.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function deleteStudy(id) {
    loading.value = true
    try {
      await studyService.deleteStudy(id)
      // Remove from list
      studies.value = studies.value.filter(s => s._id !== id)
      if (studyData.value?._id === id) {
        studyData.value = null
      }
    } finally {
      loading.value = false
    }
  }

  async function initStudyData() {
    studyData.value = null
  }

  return {
    // State
    studies,
    studyData,
    loading,
    // Actions
    getStudies,
    getStudy,
    createStudy,
    updateStudy,
    deleteStudy,
    initStudyData
  }
})
```

- [ ] **Step 3: Commit**

```bash
git add src/stores/study.js
git commit -m "feat: create Pinia study store"
```

---

## Task 7: Create Account Store

**Files:**
- Create: `src/stores/account.js`
- Reference: `src/store/account/actions.js`

- [ ] **Step 1: Review current Vuex account store**

Read `src/store/account/actions.js` to understand current actions

- [ ] **Step 2: Create Pinia account store**

File: `src/stores/account.js`

```javascript
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from './auth'
import userService from '../services/user'
import { Notify } from 'quasar'

export const useAccountStore = defineStore('account', () => {
  const router = useRouter()

  // Actions (no state needed - all operations)
  async function registerUser(user) {
    try {
      await userService.createUser(user)
      Notify.create({
        message: 'Registration successful. Please check your email for verification.',
        color: 'positive'
      })
      router.push('/login')
    } catch (error) {
      Notify.create({
        message: error.message || 'Registration failed',
        color: 'negative'
      })
      throw error
    }
  }

  async function updateProfile(user) {
    try {
      const result = await userService.updateUser(user._id, user)
      Notify.create({
        message: 'Profile updated successfully',
        color: 'positive'
      })
      return result
    } catch (error) {
      Notify.create({
        message: error.message || 'Profile update failed',
        color: 'negative'
      })
      throw error
    }
  }

  async function forgotPassword(email) {
    try {
      await userService.forgotPassword(email)
      Notify.create({
        message: 'Password reset email sent. Please check your inbox.',
        color: 'positive'
      })
    } catch (error) {
      Notify.create({
        message: error.message || 'Password reset request failed',
        color: 'negative'
      })
      throw error
    }
  }

  async function resetPassword({ token, password }) {
    try {
      await userService.resetPassword(token, password)
      Notify.create({
        message: 'Password reset successfully. Please login.',
        color: 'positive'
      })
      router.push('/login')
    } catch (error) {
      Notify.create({
        message: error.message || 'Password reset failed',
        color: 'negative'
      })
      throw error
    }
  }

  async function updatePassword({ token, password }) {
    try {
      await userService.updatePassword(token, password)
      Notify.create({
        message: 'Password updated successfully',
        color: 'positive'
      })
    } catch (error) {
      Notify.create({
        message: error.message || 'Password update failed',
        color: 'negative'
      })
      throw error
    }
  }

  async function updatePasswordFromProfile({ oldPassword, newPassword }) {
    try {
      const authStore = useAuthStore()
      await userService.updatePasswordFromProfile(authStore.user._id, {
        oldPassword,
        newPassword
      })
      Notify.create({
        message: 'Password changed successfully. Please login again.',
        color: 'positive'
      })
      // Logout and redirect
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      Notify.create({
        message: error.message || 'Password change failed',
        color: 'negative'
      })
      throw error
    }
  }

  async function updateIdentity({ userId, email }) {
    try {
      await userService.updateIdentity(userId, email)
      Notify.create({
        message: 'Email updated successfully. Please verify your new email.',
        color: 'positive'
      })
    } catch (error) {
      Notify.create({
        message: error.message || 'Email update failed',
        color: 'negative'
      })
      throw error
    }
  }

  async function resendVerification(email) {
    try {
      await userService.resendVerification(email)
      Notify.create({
        message: 'Verification email sent. Please check your inbox.',
        color: 'positive'
      })
    } catch (error) {
      Notify.create({
        message: error.message || 'Failed to send verification email',
        color: 'negative'
      })
      throw error
    }
  }

  return {
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
```

- [ ] **Step 3: Commit**

```bash
git add src/stores/account.js
git commit -m "feat: create Pinia account store"
```

---

## Task 8: Create Form Store

**Files:**
- Create: `src/stores/form.js`
- Reference: `src/store/form/actions.js`, `src/store/form/state.js`

- [ ] **Step 1: Review current Vuex form store**

Read `src/store/form/` files to understand state and actions

- [ ] **Step 2: Create Pinia form store**

File: `src/stores/form.js`

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { formService, formRevisionService } from '../services/form'

export const useFormStore = defineStore('form', () => {
  // State
  const forms = ref([])
  const formData = ref(null)
  const formRevisions = ref([])
  const loading = ref(false)

  // Actions
  async function getForms(query = {}) {
    loading.value = true
    try {
      const result = await formService.getForms(query)
      forms.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function getForm(id) {
    loading.value = true
    try {
      const result = await formService.getForm(id)
      formData.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function createForm(form) {
    loading.value = true
    try {
      const result = await formService.createForm(form)
      forms.value.push(result)
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateForm({ id, form }) {
    loading.value = true
    try {
      const result = await formService.updateForm(id, form)
      formData.value = result
      // Update in list
      const index = forms.value.findIndex(f => f._id === id)
      if (index >= 0) {
        forms.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function deleteForm(id) {
    loading.value = true
    try {
      await formService.deleteForm(id)
      forms.value = forms.value.filter(f => f._id !== id)
      if (formData.value?._id === id) {
        formData.value = null
      }
    } finally {
      loading.value = false
    }
  }

  async function getFormRevisions(formId) {
    loading.value = true
    try {
      const result = await formRevisionService.getFormRevisions(formId)
      formRevisions.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function createFormRevision(revision) {
    loading.value = true
    try {
      const result = await formRevisionService.createFormRevision(revision)
      formRevisions.value.push(result)
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateFormRevision({ id, revision }) {
    loading.value = true
    try {
      const result = await formRevisionService.updateFormRevision(id, revision)
      // Update in list
      const index = formRevisions.value.findIndex(r => r._id === id)
      if (index >= 0) {
        formRevisions.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function deleteFormRevision(id) {
    loading.value = true
    try {
      await formRevisionService.deleteFormRevision(id)
      formRevisions.value = formRevisions.value.filter(r => r._id !== id)
    } finally {
      loading.value = false
    }
  }

  async function publishFormRevision(id) {
    loading.value = true
    try {
      const result = await formRevisionService.publishFormRevision(id)
      // Update in list
      const index = formRevisions.value.findIndex(r => r._id === id)
      if (index >= 0) {
        formRevisions.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  function initFormData() {
    formData.value = null
    formRevisions.value = []
  }

  return {
    // State
    forms,
    formData,
    formRevisions,
    loading,
    // Actions
    getForms,
    getForm,
    createForm,
    updateForm,
    deleteForm,
    getFormRevisions,
    createFormRevision,
    updateFormRevision,
    deleteFormRevision,
    publishFormRevision,
    initFormData
  }
})
```

- [ ] **Step 3: Commit**

```bash
git add src/stores/form.js
git commit -m "feat: create Pinia form store"
```

---

## Task 9: Create Interview Store

**Files:**
- Create: `src/stores/interview.js`
- Reference: `src/store/interview/actions.js`, `src/store/interview/state.js`

- [ ] **Step 1: Create Pinia interview store**

File: `src/stores/interview.js`

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  interviewService,
  interviewDesignService,
  campaignService
} from '../services/interview'

export const useInterviewStore = defineStore('interview', () => {
  // State
  const interviews = ref([])
  const interviewData = ref(null)
  const interviewDesigns = ref([])
  const interviewDesignData = ref(null)
  const campaigns = ref([])
  const campaignData = ref(null)
  const loading = ref(false)

  // Interview Actions
  async function getInterviews(query = {}) {
    loading.value = true
    try {
      const result = await interviewService.getInterviews(query)
      interviews.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function getInterview(id) {
    loading.value = true
    try {
      const result = await interviewService.getInterview(id)
      interviewData.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function createInterview(interview) {
    loading.value = true
    try {
      const result = await interviewService.createInterview(interview)
      interviews.value.push(result)
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateInterview({ id, interview }) {
    loading.value = true
    try {
      const result = await interviewService.updateInterview(id, interview)
      interviewData.value = result
      const index = interviews.value.findIndex(i => i._id === id)
      if (index >= 0) {
        interviews.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function deleteInterview(id) {
    loading.value = true
    try {
      await interviewService.deleteInterview(id)
      interviews.value = interviews.value.filter(i => i._id !== id)
      if (interviewData.value?._id === id) {
        interviewData.value = null
      }
    } finally {
      loading.value = false
    }
  }

  // Interview Design Actions
  async function getInterviewDesigns(query = {}) {
    loading.value = true
    try {
      const result = await interviewDesignService.getInterviewDesigns(query)
      interviewDesigns.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function getInterviewDesign(id) {
    loading.value = true
    try {
      const result = await interviewDesignService.getInterviewDesign(id)
      interviewDesignData.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function createInterviewDesign(design) {
    loading.value = true
    try {
      const result = await interviewDesignService.createInterviewDesign(design)
      interviewDesigns.value.push(result)
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateInterviewDesign({ id, design }) {
    loading.value = true
    try {
      const result = await interviewDesignService.updateInterviewDesign(id, design)
      interviewDesignData.value = result
      const index = interviewDesigns.value.findIndex(d => d._id === id)
      if (index >= 0) {
        interviewDesigns.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function deleteInterviewDesign(id) {
    loading.value = true
    try {
      await interviewDesignService.deleteInterviewDesign(id)
      interviewDesigns.value = interviewDesigns.value.filter(d => d._id !== id)
      if (interviewDesignData.value?._id === id) {
        interviewDesignData.value = null
      }
    } finally {
      loading.value = false
    }
  }

  // Campaign Actions
  async function getCampaigns(query = {}) {
    loading.value = true
    try {
      const result = await campaignService.getCampaigns(query)
      campaigns.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function getCampaign(id) {
    loading.value = true
    try {
      const result = await campaignService.getCampaign(id)
      campaignData.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function createCampaign(campaign) {
    loading.value = true
    try {
      const result = await campaignService.createCampaign(campaign)
      campaigns.value.push(result)
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateCampaign({ id, campaign }) {
    loading.value = true
    try {
      const result = await campaignService.updateCampaign(id, campaign)
      campaignData.value = result
      const index = campaigns.value.findIndex(c => c._id === id)
      if (index >= 0) {
        campaigns.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function deleteCampaign(id) {
    loading.value = true
    try {
      await campaignService.deleteCampaign(id)
      campaigns.value = campaigns.value.filter(c => c._id !== id)
      if (campaignData.value?._id === id) {
        campaignData.value = null
      }
    } finally {
      loading.value = false
    }
  }

  function initInterviewDesignData() {
    interviewDesignData.value = null
    campaigns.value = []
  }

  function initInterviewData() {
    interviewData.value = null
  }

  return {
    // State
    interviews,
    interviewData,
    interviewDesigns,
    interviewDesignData,
    campaigns,
    campaignData,
    loading,
    // Actions
    getInterviews,
    getInterview,
    createInterview,
    updateInterview,
    deleteInterview,
    getInterviewDesigns,
    getInterviewDesign,
    createInterviewDesign,
    updateInterviewDesign,
    deleteInterviewDesign,
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    initInterviewDesignData,
    initInterviewData
  }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/interview.js
git commit -m "feat: create Pinia interview store"
```

---

## Task 10: Create CaseReport Store

**Files:**
- Create: `src/stores/caseReport.js`
- Reference: `src/store/caseReport/actions.js`, `src/store/caseReport/state.js`

- [ ] **Step 1: Create Pinia caseReport store**

File: `src/stores/caseReport.js`

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { caseReportService, caseReportFormService } from '../services/caseReport'

export const useCaseReportStore = defineStore('caseReport', () => {
  // State
  const caseReports = ref([])
  const caseReportData = ref(null)
  const caseReportForms = ref([])
  const caseReportFormData = ref(null)
  const loading = ref(false)

  // Case Report Actions
  async function getCaseReports(query = {}) {
    loading.value = true
    try {
      const result = await caseReportService.getCaseReports(query)
      caseReports.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function getCaseReport(id) {
    loading.value = true
    try {
      const result = await caseReportService.getCaseReport(id)
      caseReportData.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function createCaseReport(caseReport) {
    loading.value = true
    try {
      const result = await caseReportService.createCaseReport(caseReport)
      caseReports.value.push(result)
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateCaseReport({ id, caseReport }) {
    loading.value = true
    try {
      const result = await caseReportService.updateCaseReport(id, caseReport)
      caseReportData.value = result
      const index = caseReports.value.findIndex(cr => cr._id === id)
      if (index >= 0) {
        caseReports.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function deleteCaseReport(id) {
    loading.value = true
    try {
      await caseReportService.deleteCaseReport(id)
      caseReports.value = caseReports.value.filter(cr => cr._id !== id)
      if (caseReportData.value?._id === id) {
        caseReportData.value = null
      }
    } finally {
      loading.value = false
    }
  }

  // Case Report Form (CRF Template) Actions
  async function getCaseReportForms(query = {}) {
    loading.value = true
    try {
      const result = await caseReportFormService.getCaseReportForms(query)
      caseReportForms.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function getCaseReportForm(id) {
    loading.value = true
    try {
      const result = await caseReportFormService.getCaseReportForm(id)
      caseReportFormData.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function createCaseReportForm(form) {
    loading.value = true
    try {
      const result = await caseReportFormService.createCaseReportForm(form)
      caseReportForms.value.push(result)
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateCaseReportForm({ id, form }) {
    loading.value = true
    try {
      const result = await caseReportFormService.updateCaseReportForm(id, form)
      caseReportFormData.value = result
      const index = caseReportForms.value.findIndex(f => f._id === id)
      if (index >= 0) {
        caseReportForms.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function deleteCaseReportForm(id) {
    loading.value = true
    try {
      await caseReportFormService.deleteCaseReportForm(id)
      caseReportForms.value = caseReportForms.value.filter(f => f._id !== id)
      if (caseReportFormData.value?._id === id) {
        caseReportFormData.value = null
      }
    } finally {
      loading.value = false
    }
  }

  function initCaseReportFormData() {
    caseReportFormData.value = null
  }

  function initCaseReportData() {
    caseReportData.value = null
  }

  return {
    // State
    caseReports,
    caseReportData,
    caseReportForms,
    caseReportFormData,
    loading,
    // Actions
    getCaseReports,
    getCaseReport,
    createCaseReport,
    updateCaseReport,
    deleteCaseReport,
    getCaseReportForms,
    getCaseReportForm,
    createCaseReportForm,
    updateCaseReportForm,
    deleteCaseReportForm,
    initCaseReportFormData,
    initCaseReportData
  }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/caseReport.js
git commit -m "feat: create Pinia caseReport store"
```

---

## Task 11: Create Admin Store

**Files:**
- Create: `src/stores/admin.js`
- Reference: `src/store/admin/actions.js`, `src/store/admin/state.js`

- [ ] **Step 1: Create Pinia admin store**

File: `src/stores/admin.js`

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService, groupService, taskService } from '../services/admin'

export const useAdminStore = defineStore('admin', () => {
  // State
  const users = ref([])
  const userData = ref(null)
  const groups = ref([])
  const groupData = ref(null)
  const tasks = ref([])
  const taskData = ref(null)
  const loading = ref(false)

  // User Actions
  async function getUsers(query = {}) {
    loading.value = true
    try {
      const result = await userService.getUsers(query)
      users.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function getUser(id) {
    loading.value = true
    try {
      const result = await userService.getUser(id)
      userData.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function createUser(user) {
    loading.value = true
    try {
      const result = await userService.createUser(user)
      users.value.push(result)
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateUser({ id, user }) {
    loading.value = true
    try {
      const result = await userService.updateUser(id, user)
      userData.value = result
      const index = users.value.findIndex(u => u._id === id)
      if (index >= 0) {
        users.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(id) {
    loading.value = true
    try {
      await userService.deleteUser(id)
      users.value = users.value.filter(u => u._id !== id)
      if (userData.value?._id === id) {
        userData.value = null
      }
    } finally {
      loading.value = false
    }
  }

  // Group Actions
  async function getGroups(query = {}) {
    loading.value = true
    try {
      const result = await groupService.getGroups(query)
      groups.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function getGroup(id) {
    loading.value = true
    try {
      const result = await groupService.getGroup(id)
      groupData.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function createGroup(group) {
    loading.value = true
    try {
      const result = await groupService.createGroup(group)
      groups.value.push(result)
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateGroup({ id, group }) {
    loading.value = true
    try {
      const result = await groupService.updateGroup(id, group)
      groupData.value = result
      const index = groups.value.findIndex(g => g._id === id)
      if (index >= 0) {
        groups.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function deleteGroup(id) {
    loading.value = true
    try {
      await groupService.deleteGroup(id)
      groups.value = groups.value.filter(g => g._id !== id)
      if (groupData.value?._id === id) {
        groupData.value = null
      }
    } finally {
      loading.value = false
    }
  }

  // Task Actions
  async function getTasks(query = {}) {
    loading.value = true
    try {
      const result = await taskService.getTasks(query)
      tasks.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function getTask(id) {
    loading.value = true
    try {
      const result = await taskService.getTask(id)
      taskData.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  async function createTask(task) {
    loading.value = true
    try {
      const result = await taskService.createTask(task)
      tasks.value.push(result)
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateTask({ id, task }) {
    loading.value = true
    try {
      const result = await taskService.updateTask(id, task)
      taskData.value = result
      const index = tasks.value.findIndex(t => t._id === id)
      if (index >= 0) {
        tasks.value[index] = result
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id) {
    loading.value = true
    try {
      await taskService.deleteTask(id)
      tasks.value = tasks.value.filter(t => t._id !== id)
      if (taskData.value?._id === id) {
        taskData.value = null
      }
    } finally {
      loading.value = false
    }
  }

  function initUserData() {
    userData.value = null
  }

  function initGroupData() {
    groupData.value = null
  }

  function initTaskData() {
    taskData.value = null
  }

  return {
    // State
    users,
    userData,
    groups,
    groupData,
    tasks,
    taskData,
    loading,
    // Actions
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    initUserData,
    initGroupData,
    initTaskData
  }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/admin.js
git commit -m "feat: create Pinia admin store"
```

---

## Task 12: Test All Stores Created

**Files:**
- All store files created

- [ ] **Step 1: Verify all stores exist**

```bash
ls -la src/stores/
```

Expected output:
```
account.js
admin.js
auth.js
caseReport.js
form.js
interview.js
study.js
README.md
```

- [ ] **Step 2: Test dev server starts**

```bash
yarn quasar dev
```

Expected: Should start with fewer errors (stores now exist, but components still use Vuex mapState/mapActions)

- [ ] **Step 3: Create checkpoint commit**

```bash
git add .
git commit -m "checkpoint: all 7 Pinia stores created"
```

---

## Completion Checklist

**Phase 3 Core Complete When:**
- [ ] All 7 Pinia stores created (account, admin, auth, caseReport, form, interview, study)
- [ ] useAuth composable created
- [ ] Feathers-Pinia client setup
- [ ] Router guards updated for Pinia
- [ ] Dev server starts (may have component errors - that's Phase 4)

**Remaining Work for Full Migration (Phase 4):**
- Update all components to use Pinia stores instead of Vuex
- Remove all `mapState`, `mapActions`, `mapGetters` usage
- Replace AuthMixin with useAuth composable in components
- Delete old Vuex store directory
- Convert components to `<script setup>` syntax

---

## Notes

**Store Pattern Consistency:**
- All stores use `ref()` for state
- All stores use `computed()` for getters (if needed)
- All actions are plain async/sync functions
- Direct state mutation (no commits)
- Loading states managed within stores

**Error Handling:**
- Service layer handles errors
- Stores catch and re-throw for component handling
- Notify component for user feedback

**Cross-Store Communication:**
- Import stores directly: `import { useAuthStore } from './auth'`
- Call actions directly: `authStore.logout()`
- No string-based dispatch

---

## Testing Strategy

After each store creation:
1. Verify file created in `src/stores/`
2. Check for syntax errors
3. Verify exports match expected pattern
4. Commit immediately

After all stores created:
1. Run dev server
2. Check console for import errors
3. Verify Pinia devtools shows all stores
4. Ready for Phase 4 component migration

---

**Plan Status:** Ready for execution  
**Created:** 2026-06-08  
**Estimated Duration:** 4-6 hours (all 12 tasks)  
**Next Phase:** Phase 4 - Component Migration (convert all components to use Pinia + setup syntax)
