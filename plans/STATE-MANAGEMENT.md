# State Management Migration: Vuex to Pinia

**Project:** amber-studio v1.5.2  
**Date Created:** 2026-05-31  
**Status:** Planning Complete  
**Document Type:** Consolidated State Management Strategy  

**Consolidates:**
- Original pinia-architecture.md (Pinia store architecture with setup syntax)
- Original feathersvuex-migration.md (FeathersVuex to Feathers-Pinia migration)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Vuex Architecture](#current-vuex-architecture)
3. [Target Pinia Architecture](#target-pinia-architecture)
4. [FeathersVuex Migration Strategy](#feathersvuex-migration-strategy)
5. [Store-by-Store Migration Plans](#store-by-store-migration-plans)
6. [AuthMixin to useAuth Composable](#authmixin-to-useauth-composable)
7. [State Persistence Strategy](#state-persistence-strategy)
8. [Cross-Store Communication](#cross-store-communication)
9. [Implementation Checklist](#implementation-checklist)
10. [Risk Assessment](#risk-assessment)
11. [Testing Strategy](#testing-strategy)

---

## Executive Summary

### Migration Overview

**Goal:** Migrate from Vuex 4 + FeathersVuex to Pinia 2 + Feathers-Pinia using Composition API setup syntax.

**Scope:**
- **6 Vuex modules** (account, admin, caseReport, form, interview, study) → 6 Pinia stores
- **1 Vuex auth plugin** (FeathersVuex) → 1 Pinia auth store (Feathers-Pinia)
- **1 AuthMixin** (used in 27+ components) → 1 useAuth composable
- **Total:** 7 Pinia stores with setup syntax

### Current State

**Vuex Structure:**
```
src/store/
├── index.js              # Main store with Vuex + FeathersVuex plugins
├── store.auth.js         # FeathersVuex auth plugin
├── account/              # User account operations (no state)
├── admin/                # User, group, task management
├── caseReport/           # Case reports and CRF templates
├── form/                 # Study forms with versioning
├── interview/            # Interviews, designs, campaigns
└── study/                # Study CRUD operations
```

**Key Dependencies:**
- Vuex 4.0.1
- @feathersjs/vuex 4.0.1-pre.7 (pre-release, stale)
- @feathersjs/client 4.5.11
- vuex-persistedstate 4.1.0 (commented out, not active)

### Target State

**Pinia Structure:**
```
src/stores/
├── account.js            # Single file, setup syntax
├── admin.js
├── auth.js               # Feathers-Pinia integration
├── caseReport.js
├── form.js
├── interview.js
└── study.js

src/composables/
└── useAuth.js            # Replaces AuthMixin
```

**New Dependencies:**
- Pinia 2.x (latest)
- feathers-pinia v4.x (official Feathers-Pinia library)
- pinia-plugin-persistedstate (for auth persistence)

### Migration Approach

**Setup Syntax Pattern:**
- All stores use Composition API setup syntax
- `ref()` for state instead of plain objects
- `computed()` for getters instead of getter functions
- Plain async/sync functions for actions (merge actions + mutations)
- Single file per store

**FeathersVuex → Feathers-Pinia:**
- Official migration path (same author)
- Replace `makeAuthPlugin` with Feathers-Pinia client setup
- Replace `BaseModel` classes with service configurations
- Convert AuthMixin to useAuth composable

---

## Current Vuex Architecture

### Store Registration (src/store/index.js)

```javascript
import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import auth from './store.auth'

// Module imports
import account from './account'
import admin from './admin'
import caseReport from './caseReport'
import form from './form'
import interview from './interview'
import study from './study'

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      account,
      admin,
      caseReport,
      form,
      interview,
      study
    },
    
    plugins: [auth],  // FeathersVuex auth plugin
    
    strict: process.env.DEBUGGING
  })

  return Store
})
```

### Module Pattern

Each Vuex module follows this structure:
```
src/store/{module}/
├── index.js        # Module registration
├── state.js        # State initialization function
├── getters.js      # Computed state selectors (mostly empty)
├── actions.js      # Async operations
└── mutations.js    # Synchronous state updates
```

### FeathersVuex Integration

**Auth Store (src/store/store.auth.js):**
```javascript
import { makeAuthPlugin } from '../boot/feathersClient'
export default makeAuthPlugin({ userService: 'user' })
```

**Feathers Client Setup (src/boot/feathersClient.js):**
- Configures Feathers client with REST transport
- Initializes FeathersVuex plugin
- Exports: `makeServicePlugin`, `makeAuthPlugin`, `BaseModel`
- Global configuration:
  - `serverAlias: 'api'`
  - `idField: '_id'`
  - `whitelist: ['$regex', '$options']`

**Service Definitions:**
1. **User Service** (src/services/feathers-client/user.js)
   - Extends `BaseModel`
   - Instance defaults: `email`, `password`

2. **Group Service** (src/services/feathers-client/group.js)
   - Extends `BaseModel`
   - Instance defaults: `name`

### AuthMixin Usage

**File:** `src/mixins/AuthMixin.js`

**Provides:**
- `user` - from `state.auth.payload.user`
- `isAdministrator` - role === 'administrator'
- `isManager` - role === 'manager'
- `isReadOnly` - computed from roles
- `isInterviewer` - role === 'interviewer'
- `isGuest` - role === 'guest' or no user
- `userEmail` - user's email or '?'

**Usage:** 27+ components use AuthMixin across:
- Layouts (MainLayout, StudyLayout)
- Interview components
- Dashboard
- CRF components
- Form components

---

## Target Pinia Architecture

### Setup Syntax Pattern

All Pinia stores will use the Composition API setup syntax (function-based):

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // State (using ref)
  const items = ref([])
  const loading = ref(false)
  
  // Getters (using computed)
  const itemCount = computed(() => items.value.length)
  const hasItems = computed(() => items.value.length > 0)
  
  // Actions (plain async/sync functions - mutations merged in)
  async function fetchItems() {
    loading.value = true
    try {
      const result = await api.getItems()
      items.value = [...result.data]  // Direct assignment
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }
  
  function clearItems() {
    items.value = []  // Direct mutation
  }
  
  return {
    // State
    items,
    loading,
    // Getters
    itemCount,
    hasItems,
    // Actions
    fetchItems,
    clearItems
  }
})
```

### Store Organization Principles

**File Structure:** `src/stores/{storeName}.js`
- Single file per store (no subdirectories)
- Named export: `useXxxStore`
- Setup syntax (function-based, not options)

**State Management:**
- Use `ref()` for all state properties
- No nested modules (flat store structure)
- Each store is independent

**Getters:**
- Use `computed()` for derived state
- Return computed values, not functions

**Actions:**
- Plain async/sync functions
- Direct state mutation (no commits)
- Merge mutation logic into actions
- Self-calling actions for refresh patterns

**Cross-Store Communication:**
- Import and use stores directly
- No dispatch with namespace strings
- Type-safe cross-store calls

---

## FeathersVuex Migration Strategy

### Decision: Use Feathers-Pinia (Official Library)

**✅ Recommended Approach**

**Rationale:**
1. **Official & Maintained**
   - Feathers-Pinia is the official successor to FeathersVuex
   - Same author (Marshall Thompson)
   - FeathersVuex 4.0.1-pre.7 is a stale pre-release from 2020

2. **Vue 3 Best Practice**
   - Native Pinia + Composition API support
   - Better long-term sustainability
   - Actively maintained

3. **Feature Parity**
   - All FeathersVuex features available
   - Enhanced performance and TypeScript support
   - Better SSR support

4. **Compatibility**
   - ✅ Fully compatible with Feathers v4.5.11 (current version)
   - ✅ Works with both Options API and Composition API

### Feature Comparison

| Feature | FeathersVuex | Feathers-Pinia | Status |
|---------|--------------|----------------|--------|
| **State Management** | Vuex | Pinia | Better |
| **Model Classes** | BaseModel | useInstanceDefaults | Different pattern |
| **Authentication** | makeAuthPlugin | useAuth composable | Composable-first |
| **Service Stores** | makeServicePlugin | Auto-generated | Simplified |
| **Realtime Events** | Built-in | Built-in | Same |
| **Optimistic Updates** | Yes | Yes | Same |
| **Local Queries** | Yes | Enhanced | Better performance |
| **TypeScript** | Partial | Full | Better |
| **Setup Syntax** | No | Native | Required for project |

### Key Architectural Changes

#### 1. Store Setup

**FeathersVuex (Current):**
```javascript
const { makeServicePlugin, makeAuthPlugin } = feathersVuex(feathersClient, options)
const userPlugin = makeServicePlugin({ 
  Model: User, 
  service: feathersClient.service('user') 
})
```

**Feathers-Pinia (Target):**
```javascript
import { createPinia } from 'pinia'
import { createPiniaClient } from 'feathers-pinia'

const pinia = createPinia()
const client = createPiniaClient(feathersClient, {
  pinia,
  idField: '_id',
  whitelist: ['$regex', '$options']
})

// Auto-creates stores for services
const { api } = client
api.service('user')
api.service('group')
```

#### 2. Authentication

**FeathersVuex (Current):**
```javascript
// Store setup
const authPlugin = makeAuthPlugin({ userService: 'user' })

// Component usage
this.$store.dispatch('auth/authenticate', { strategy: 'local', email, password })
this.$store.dispatch('auth/logout')
this.$store.state.auth.user

// Via AuthMixin
computed: {
  ...mapState({ user: state => state.auth.payload.user })
}
```

**Feathers-Pinia (Target):**
```javascript
// Component usage (Composition API)
import { useAuth } from 'feathers-pinia'

const { user, isAuthenticated } = useAuth()

await authenticate({ strategy: 'local', email, password })
await logout()

// Role checking
const isAdmin = computed(() => user.value?.role === 'administrator')
```

#### 3. Models & Instances

**FeathersVuex (Current):**
```javascript
class User extends BaseModel {
  static modelName = 'User'
  static instanceDefaults() {
    return { email: '', password: '' }
  }
}
```

**Feathers-Pinia (Target):**
```javascript
// Instance defaults in service setup
const userService = client.service('user')
userService.useInstanceDefaults({ email: '', password: '' })
```

#### 4. AuthMixin → Composable

**FeathersVuex (Current - Mixin):**
```javascript
// Mixin pattern
const AuthMixin = {
  computed: {
    ...mapState({ user: state => state.auth.payload.user }),
    isAdministrator() { return this.user?.role === 'administrator' }
  }
}

// In component
export default {
  mixins: [AuthMixin],
  methods: {
    doSomething() {
      if (this.isAdministrator) { /* ... */ }
    }
  }
}
```

**Feathers-Pinia (Target - Composable):**
```javascript
// Composable pattern
export function useAuthHelpers() {
  const { user } = useAuth()
  const isAdministrator = computed(() => user.value?.role === 'administrator')
  const isManager = computed(() => user.value?.role === 'manager')
  return { user, isAdministrator, isManager }
}

// In component
<script setup>
import { useAuthHelpers } from 'composables/useAuth'

const { user, isAdministrator } = useAuthHelpers()

function doSomething() {
  if (isAdministrator.value) { /* ... */ }
}
</script>
```

### Migration Effort Assessment

**High Impact Areas:**
1. **Authentication Store** (1 file) - **Effort: Low**
   - Replace `makeAuthPlugin` with Feathers-Pinia setup
   
2. **Service Definitions** (2 files) - **Effort: Low**
   - Convert BaseModel classes to service configs

3. **AuthMixin → Composable** (1 mixin, 27+ components) - **Effort: Medium-High**
   - Create useAuth composable
   - Update all component imports and usage

4. **Feathers Client Setup** (1 file) - **Effort: Low**
   - Initialize Feathers-Pinia instead of FeathersVuex

**Benefits:**
- ✅ Modern Pinia architecture (Vue 3 standard)
- ✅ Native Composition API support
- ✅ Better TypeScript support
- ✅ Actively maintained
- ✅ Official Feathers recommendation

---

## Store-by-Store Migration Plans

### Store 1: Account Store

**Current State:** No state properties (actions only)

**Current Actions (8):**
- `registerUser` - Register new user account
- `updateProfile` - Update user profile
- `forgotPassword` - Initiate password reset
- `resetPassword` - Reset password with token
- `updatePassword` - Update password with token
- `updatePasswordFromProfile` - Change password (triggers logout)
- `updateIdentity` - Update email identity
- `resendVerification` - Resend email verification

**Dependencies:**
- Service: `src/services/user.js`
- Router access: Uses `this.$router.push()`
- Cross-store: Calls `dispatch('auth/logout')`

**Pinia Migration:**

```javascript
// src/stores/account.js
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from './auth'
import userService from '../services/user'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'

export const useAccountStore = defineStore('account', () => {
  const router = useRouter()
  
  // Actions (no state needed)
  async function registerUser(formData) {
    const result = await userService.registerUser(formData).catch(err => {
      errorHandler.onError(err, t('error.register_user'))
    })
    if (result) {
      Notify.create({ message: t('success.user_registered'), color: 'positive' })
      router.push('/login')
    }
  }
  
  async function updatePasswordFromProfile(email, oldPassword, newPassword) {
    const result = await userService.updatePasswordFromProfile(
      email, oldPassword, newPassword
    ).catch(err => {
      errorHandler.onError(err, t('error.update_password'))
    })
    if (result && result.status >= 200) {
      Notify.create({ message: t('success.password_updated'), color: 'positive' })
      // Cross-store call
      const authStore = useAuthStore()
      authStore.logout()
    }
  }
  
  // ... other actions
  
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

**Migration Notes:**
- No state to convert
- Router access: `useRouter()` instead of `this.$router`
- Cross-store: Direct import `useAuthStore()` instead of `dispatch()`

---

### Store 2: Admin Store

**Current State:**
```javascript
{
  users: [],
  userPaginationOpts: { sortBy: 'lastSeen', descending: false, page: 1, rowsPerPage: 10, rowsNumber: 0 },
  user: {},
  groups: [],
  groupPaginationOpts: { sortBy: 'name', descending: true, page: 1, rowsPerPage: 10, rowsNumber: 0 },
  group: {},
  groupUsers: [],
  tasks: [],
  taskPaginationOpts: { sortBy: 'createdTask', descending: true, page: 1, rowsPerPage: 10, rowsNumber: 0 }
}
```

**Complexity:** Medium - Multiple entity types with pagination

**Current Actions (19):**
- User management: `getUsers`, `getUser`, `createUser`, `updateUser`, `deleteUser`, `deleteUsers`
- Group management: `getGroups`, `getGroup`, `getGroupUsers`, `createGroup`, `updateGroup`, `deleteGroup`, `deleteGroups`
- Task management: `getTasks`, `createTask`, `deleteTask`, `deleteTasks`

**Pinia Migration:**

```javascript
// src/stores/admin.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import userService from '../services/user'
import { groupService, taskService } from '../services/group'

export const useAdminStore = defineStore('admin', () => {
  // State (all become ref())
  const users = ref([])
  const userPaginationOpts = ref({
    sortBy: 'lastSeen',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })
  const user = ref({})
  
  const groups = ref([])
  const groupPaginationOpts = ref({
    sortBy: 'name',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })
  const group = ref({})
  const groupUsers = ref([])
  
  const tasks = ref([])
  const taskPaginationOpts = ref({
    sortBy: 'createdTask',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })
  
  // Actions (merge mutations into action logic)
  async function getUsers(paginationOpts, filter, roles) {
    const result = await userService.getUsers(paginationOpts, filter, roles).catch(err => {
      errorHandler.onError(err, t('error.get_users'))
    })
    if (result) {
      users.value = [...result.data]  // Direct assignment
      userPaginationOpts.value.rowsNumber = result.total
    } else {
      users.value = []
      userPaginationOpts.value.rowsNumber = 0
    }
  }
  
  async function createUser(userObj, paginationOpts) {
    const result = await userService.createUser(userObj).catch(err => {
      errorHandler.onError(err, t('error.create_user'))
    })
    if (result) {
      Notify.create({ message: t('success.user_created'), color: 'positive' })
    }
    await getUsers(paginationOpts)  // Self-call instead of dispatch
  }
  
  // ... all other actions with inline state updates
  
  return {
    // State
    users, userPaginationOpts, user,
    groups, groupPaginationOpts, group, groupUsers,
    tasks, taskPaginationOpts,
    // Actions
    getUsers, getUser, createUser, updateUser, deleteUser, deleteUsers,
    getGroups, getGroup, getGroupUsers, createGroup, updateGroup, deleteGroup, deleteGroups,
    getTasks, createTask, deleteTask, deleteTasks
  }
})
```

**Migration Notes:**
- All state objects become `ref()`
- Mutations merge into actions with direct `.value` assignment
- Self-dispatch becomes direct function calls
- Spread operator maintains immutability pattern

---

### Store 3: Case Report Store

**Current State:**
```javascript
{
  caseReports: [],
  caseReportPaginationOpts: { sortBy: 'createdAt', descending: true, page: 1, rowsPerPage: 10, rowsNumber: 0 },
  caseReport: {},
  caseReportForms: [],
  caseReportFormPaginationOpts: { sortBy: 'createdAt', descending: true, page: 1, rowsPerPage: 10, rowsNumber: 0 },
  caseReportForm: {}
}
```

**Complexity:** Medium - Dual entity management (reports and report forms)

**Current Actions (9):**
- Case report management: `getCaseReports`, `updateCaseReport`, `deleteCaseReport`, `deleteCaseReports`
- Case report form management: `getCaseReportForms`, `createCaseReportForm`, `updateCaseReportForm`, `deleteCaseReportForm`, `deleteCaseReportForms`

**Pinia Migration:**

```javascript
// src/stores/caseReport.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { caseReportFormService, caseReportService } from '../services/caseReport'

export const useCaseReportStore = defineStore('caseReport', () => {
  // State
  const caseReports = ref([])
  const caseReportPaginationOpts = ref({
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })
  const caseReport = ref({})
  
  const caseReportForms = ref([])
  const caseReportFormPaginationOpts = ref({
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })
  const caseReportForm = ref({})
  
  // Actions with date range filtering
  async function getCaseReports(paginationOpts, study, form, caseReportForm, filter, from, to) {
    const result = await caseReportService.getCaseReports(
      paginationOpts, study, form, caseReportForm, filter, from, to
    ).catch(err => {
      errorHandler.onError(err, t('error.get_case_reports'))
    })
    if (result) {
      caseReports.value = [...result.data]
      caseReportPaginationOpts.value.rowsNumber = result.total
    } else {
      caseReports.value = []
      caseReportPaginationOpts.value.rowsNumber = 0
    }
  }
  
  // ... all other actions
  
  return {
    // State
    caseReports, caseReportPaginationOpts, caseReport,
    caseReportForms, caseReportFormPaginationOpts, caseReportForm,
    // Actions
    getCaseReports, updateCaseReport, deleteCaseReport, deleteCaseReports,
    getCaseReportForms, createCaseReportForm, updateCaseReportForm,
    deleteCaseReportForm, deleteCaseReportForms
  }
})
```

**Migration Notes:**
- Dual entity pattern (reports + forms) preserved
- Date range filtering parameters passed directly
- Self-refresh pattern via direct function calls

---

### Store 4: Form Store

**Current State:**
```javascript
{
  forms: [],
  formPaginationOpts: { sortBy: 'name', descending: true, page: 1, rowsPerPage: 10, rowsNumber: 0 },
  form: {},
  formRevisions: [],
  formRevisionPaginationOpts: { sortBy: 'revision', descending: true, page: 1, rowsPerPage: 10, rowsNumber: 0 }
}
```

**Complexity:** Medium - Forms with versioning/revision tracking

**Current Actions (11):**
- Form management: `getForms`, `getForm`, `createForm`, `updateForm`, `deleteForm`, `deleteForms`
- Form revision management: `createFormRevision`, `getFormRevisions`, `deleteFormRevision`, `deleteFormRevisions`

**Special Error Handling:** FormRemoveError, FormRevisionRemoveError

**Pinia Migration:**

```javascript
// src/stores/form.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { formService, formRevisionService } from '../services/form'

export const useFormStore = defineStore('form', () => {
  // State
  const forms = ref([])
  const formPaginationOpts = ref({
    sortBy: 'name',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })
  const form = ref({})
  
  const formRevisions = ref([])
  const formRevisionPaginationOpts = ref({
    sortBy: 'revision',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })
  
  // Actions
  async function deleteForm(id, paginationOpts, study) {
    // Special error handling for cascade deletes
    const result = await formService.deleteForm(id).catch((err) => {
      errorHandler.onError(err, {
        FormRemoveError: t('error.form_remove_error', err.data),
        default: t('error.general')
      })
    })
    if (result) {
      Notify.create({ message: t('success.form_deleted'), color: 'positive' })
    }
    await getForms(paginationOpts, study)
  }
  
  // ... all other actions
  
  return {
    // State
    forms, formPaginationOpts, form,
    formRevisions, formRevisionPaginationOpts,
    // Actions
    getForms, getForm, createForm, updateForm, deleteForm, deleteForms,
    createFormRevision, getFormRevisions, deleteFormRevision, deleteFormRevisions
  }
})
```

**Migration Notes:**
- Form versioning system with separate revisions state
- Conditional notification flag in `updateForm`
- Specialized error types for cascade delete checks

---

### Store 5: Interview Store

**Current State:**
```javascript
{
  interviews: [],
  interviewPaginationOpts: { sortBy: 'createdAt', descending: true, page: 1, rowsPerPage: 10, rowsNumber: 0 },
  interview: {},
  interviewDesigns: [],
  interviewDesignPaginationOpts: { sortBy: 'createdAt', descending: true, page: 1, rowsPerPage: 10, rowsNumber: 0 },
  interviewDesign: {},
  campaigns: [],
  campaignPaginationOpts: { sortBy: 'createdAt', descending: true, page: 1, rowsPerPage: 10, rowsNumber: 0 }
}
```

**Complexity:** High - Triple entity management with complex filtering

**Current Actions (19):**
- Interview management: `getInterviews`, `updateInterview`, `deleteInterview`, `deleteInterviews`
- Interview design management: `getInterviewDesigns`, `getInterviewDesign`, `createInterviewDesign`, `updateInterviewDesign`, `deleteInterviewDesign`, `deleteInterviewDesigns`
- Campaign management: `getCampaigns`, `createCampaign`, `updateCampaign`, `deleteCampaign`

**Pinia Migration:**

```javascript
// src/stores/interview.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { campaignService, interviewDesignService, interviewService } from '../services/interview'

export const useInterviewStore = defineStore('interview', () => {
  // State (3 entity types)
  const interviews = ref([])
  const interviewPaginationOpts = ref({ /* ... */ })
  const interview = ref({})
  
  const interviewDesigns = ref([])
  const interviewDesignPaginationOpts = ref({ /* ... */ })
  const interviewDesign = ref({})
  
  const campaigns = ref([])
  const campaignPaginationOpts = ref({ /* ... */ })
  
  // Actions with extensive filter parameters
  async function getInterviews(
    paginationOpts, study, interviewDesign, campaign, 
    state, participantValid, filter, from, to
  ) {
    const result = await interviewService.getInterviews(/* all params */).catch(err => {
      errorHandler.onError(err, t('error.get_interviews'))
    })
    if (result) {
      interviews.value = [...result.data]
      interviewPaginationOpts.value.rowsNumber = result.total
    } else {
      interviews.value = []
      interviewPaginationOpts.value.rowsNumber = 0
    }
  }
  
  // ... all other actions
  
  return {
    // State
    interviews, interviewPaginationOpts, interview,
    interviewDesigns, interviewDesignPaginationOpts, interviewDesign,
    campaigns, campaignPaginationOpts,
    // Actions
    getInterviews, updateInterview, deleteInterview, deleteInterviews,
    getInterviewDesigns, getInterviewDesign, createInterviewDesign,
    updateInterviewDesign, deleteInterviewDesign, deleteInterviewDesigns,
    getCampaigns, createCampaign, updateCampaign, deleteCampaign
  }
})
```

**Migration Notes:**
- Most complex store with 3 entity types
- Extensive filter parameters (8+ for getInterviews)
- Hierarchical relationship: Study → InterviewDesign → Campaign → Interview

---

### Store 6: Study Store

**Current State:**
```javascript
{
  studies: [],
  studyPaginationOpts: { sortBy: 'name', descending: true, page: 1, rowsPerPage: 10, rowsNumber: 0 },
  study: {}
}
```

**Complexity:** Low - Simple CRUD entity

**Current Actions (6):**
- `getStudies`, `getStudy`, `createStudy`, `updateStudy`, `deleteStudy`, `deleteStudies`

**Pinia Migration:**

```javascript
// src/stores/study.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import studyService from '../services/study'

export const useStudyStore = defineStore('study', () => {
  // State
  const studies = ref([])
  const studyPaginationOpts = ref({
    sortBy: 'name',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })
  const study = ref({})
  
  // Actions
  async function getStudies(paginationOpts, filter) {
    const result = await studyService.getStudies(paginationOpts, filter).catch(err => {
      errorHandler.onError(err, t('error.get_studies'))
    })
    if (result) {
      studies.value = [...result.data]
      studyPaginationOpts.value.rowsNumber = result.total
    } else {
      studies.value = []
      studyPaginationOpts.value.rowsNumber = 0
    }
  }
  
  async function deleteStudy(id, paginationOpts) {
    // Special cascade delete error handling
    const result = await studyService.deleteStudy(id).catch((err) => {
      errorHandler.onError(err, {
        FormRemoveError: t('error.form_remove_error', err.data),
        FormRevisionRemoveError: t('error.form_revision_remove_error', err.data),
        default: t('error.general')
      })
    })
    if (result) {
      Notify.create({ message: t('success.study_deleted'), color: 'positive' })
    }
    await getStudies(paginationOpts)
  }
  
  // ... other actions
  
  return {
    // State
    studies,
    studyPaginationOpts,
    study,
    // Actions
    getStudies,
    getStudy,
    createStudy,
    updateStudy,
    deleteStudy,
    deleteStudies
  }
})
```

**Migration Notes:**
- Simplest store - standard CRUD pattern
- Parent entity for forms, caseReports, interviews
- Cascade delete error handling for related entities

---

### Store 7: Auth Store (Feathers-Pinia)

**Current Implementation:**
```javascript
// src/store/store.auth.js
import { makeAuthPlugin } from '../boot/feathersClient'
export default makeAuthPlugin({ userService: 'user' })
```

**Pinia Migration (with Feathers-Pinia):**

```javascript
// src/stores/auth.js
import { defineStore } from 'pinia'
import { useAuth as useFeathersPiniaAuth } from 'feathers-pinia'

// Re-export Feathers-Pinia useAuth with custom helpers
export const useAuthStore = defineStore('auth', () => {
  // Use Feathers-Pinia's built-in auth
  const { user, isAuthenticated, authenticate, logout, reAuthenticate } = useFeathersPiniaAuth()
  
  return {
    // State from Feathers-Pinia
    user,
    isAuthenticated,
    // Actions from Feathers-Pinia
    authenticate,
    logout,
    reAuthenticate
  }
})
```

**Alternative: Simplified Custom Auth Store:**

```javascript
// src/stores/auth.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { feathersClient } from '../boot/feathersClient'
import { Notify } from 'quasar'
import { t } from '../boot/i18n'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const accessToken = ref(null)
  const isAuthenticated = ref(false)
  const authError = ref(null)
  
  // Actions
  async function authenticate(credentials) {
    try {
      const response = await feathersClient.authenticate({
        strategy: 'local',
        ...credentials
      })
      user.value = response.user
      accessToken.value = response.accessToken
      isAuthenticated.value = true
      authError.value = null
      return response
    } catch (error) {
      authError.value = error
      isAuthenticated.value = false
      Notify.create({
        message: t('error.authentication_failed'),
        color: 'negative'
      })
      throw error
    }
  }
  
  async function logout() {
    try {
      await feathersClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      accessToken.value = null
      isAuthenticated.value = false
    }
  }
  
  async function reAuthenticate() {
    try {
      const response = await feathersClient.reAuthenticate()
      user.value = response.user
      accessToken.value = response.accessToken
      isAuthenticated.value = true
      return response
    } catch (error) {
      authError.value = error
      isAuthenticated.value = false
      return null
    }
  }
  
  return {
    // State
    user,
    accessToken,
    isAuthenticated,
    authError,
    // Actions
    authenticate,
    logout,
    reAuthenticate
  }
}, {
  // Persistence configuration
  persist: {
    key: 'astore-auth',
    paths: ['user', 'accessToken', 'isAuthenticated']
  }
})
```

**Migration Notes:**
- **Option 1:** Use Feathers-Pinia's built-in `useAuth` (recommended)
- **Option 2:** Custom implementation wrapping feathersClient
- Must verify Feathers client integration and authentication flow
- Test auto-login functionality with `reAuthenticate()`
- Cross-store dependency: `account.updatePasswordFromProfile` calls `auth.logout()`

**Feathers Client Setup (src/boot/feathersClient.js):**

```javascript
import { createPiniaClient } from 'feathers-pinia'
import { createPinia } from 'pinia'
import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'
import axios from 'axios'

const feathersClient = feathers()
  .configure(rest(process.env.API).axios(axios))
  .configure(auth({ storage: window.localStorage }))

const pinia = createPinia()

const client = createPiniaClient(feathersClient, {
  pinia,
  idField: '_id',
  whitelist: ['$regex', '$options']
})

// Auto-create stores for services
const { api } = client
api.service('user')
api.service('group')

export { feathersClient, client, pinia }
```

---

## AuthMixin to useAuth Composable

### Current AuthMixin (src/mixins/AuthMixin.js)

```javascript
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      user: state => state.auth.payload.user
    }),
    isAdministrator() {
      return this.user && this.user.role === 'administrator'
    },
    isManager() {
      return this.user && this.user.role === 'manager'
    },
    isReadOnly() {
      return this.user && !this.isAdministrator && !this.isManager
    },
    isInterviewer() {
      return this.user && this.user.role === 'interviewer'
    },
    isGuest() {
      return !this.user || this.user.role === 'guest'
    },
    userEmail() {
      return this.user ? this.user.email : '?'
    }
  }
}
```

**Usage:** 27+ components across:
- Layouts (MainLayout, StudyLayout)
- Interview components
- Dashboard
- CRF components
- Form components

### Target useAuth Composable (src/composables/useAuth.js)

```javascript
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  
  // Base auth state
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  
  // Role checks
  const isAdministrator = computed(() => 
    user.value && user.value.role === 'administrator'
  )
  
  const isManager = computed(() => 
    user.value && user.value.role === 'manager'
  )
  
  const isReadOnly = computed(() => 
    user.value && !isAdministrator.value && !isManager.value
  )
  
  const isInterviewer = computed(() => 
    user.value && user.value.role === 'interviewer'
  )
  
  const isGuest = computed(() => 
    !user.value || user.value.role === 'guest'
  )
  
  const userEmail = computed(() => 
    user.value ? user.value.email : '?'
  )
  
  // Auth actions
  const { authenticate, logout, reAuthenticate } = authStore
  
  return {
    // State
    user,
    isAuthenticated,
    // Role checks
    isAdministrator,
    isManager,
    isReadOnly,
    isInterviewer,
    isGuest,
    userEmail,
    // Actions
    authenticate,
    logout,
    reAuthenticate
  }
}
```

### Component Migration Pattern

**Before (Options API + AuthMixin):**
```vue
<template>
  <div v-if="isAdministrator">
    <p>Welcome, {{ userEmail }}</p>
  </div>
</template>

<script>
import AuthMixin from 'mixins/AuthMixin'

export default {
  mixins: [AuthMixin],
  methods: {
    doAdminThing() {
      if (this.isAdministrator) {
        // admin logic
      }
    }
  }
}
</script>
```

**After (Composition API + useAuth):**
```vue
<template>
  <div v-if="isAdministrator">
    <p>Welcome, {{ userEmail }}</p>
  </div>
</template>

<script setup>
import { useAuth } from 'composables/useAuth'

const { user, isAdministrator, userEmail } = useAuth()

function doAdminThing() {
  if (isAdministrator.value) {
    // admin logic
  }
}
</script>
```

### Migration Checklist for AuthMixin

**Components using AuthMixin (27+):**
- [ ] src/layouts/MainLayout.vue
- [ ] src/layouts/StudyLayout.vue
- [ ] src/pages/Dashboard.vue
- [ ] src/pages/Study.vue
- [ ] src/pages/StudyForms.vue
- [ ] src/pages/StudyForm.vue
- [ ] src/pages/StudyInterviewDesigns.vue
- [ ] src/pages/StudyInterviewDesign.vue
- [ ] src/pages/StudyInterviews.vue
- [ ] src/pages/StudyCaseReportForms.vue
- [ ] src/pages/StudyCaseReports.vue
- [ ] (... and 16+ more components)

**Migration Steps per Component:**
1. Remove `AuthMixin` from `mixins` array
2. Add `import { useAuth } from 'composables/useAuth'`
3. Call `const { user, isAdmin, ... } = useAuth()` in setup
4. Update template refs if needed (no changes if using same names)
5. Update method logic to use `.value` when accessing computed values
6. Test component functionality

---

## State Persistence Strategy

### Current Vuex Persistence

**Status:** Commented out (not active)

```javascript
// src/store/index.js (commented out)
/*
import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'

const ls = new SecureLS({ isCompression: false })
const lsVuex = debug ? createPersistedState()
  : createPersistedState({
    key: 'astore',
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key)
    }
  })
*/
```

**Analysis:**
- Package `vuex-persistedstate` v4.1.0 installed but not used
- `secure-ls` provides encrypted localStorage
- Storage key: `'astore'`
- **Current behavior:** No state persistence (all state is ephemeral)

### Target Pinia Persistence

**Recommendation:** Persist auth store only

**Installation:**
```bash
npm install pinia-plugin-persistedstate
```

**Setup (src/boot/pinia.js):**

```javascript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import SecureLS from 'secure-ls'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Secure storage for production
const secureStorage = process.env.DEBUGGING
  ? window.localStorage  // Plain localStorage in debug mode
  : (() => {
      const ls = new SecureLS({ isCompression: false })
      return {
        getItem: (key) => {
          const item = ls.get(key)
          return item ? JSON.stringify(item) : null
        },
        setItem: (key, value) => {
          ls.set(key, JSON.parse(value))
        },
        removeItem: (key) => {
          ls.remove(key)
        }
      }
    })()

export { pinia, secureStorage }
```

**Auth Store Persistence Configuration:**

```javascript
export const useAuthStore = defineStore('auth', () => {
  // ... store implementation
}, {
  persist: {
    key: 'astore-auth',
    storage: secureStorage,  // Encrypted in production
    paths: ['user', 'accessToken', 'isAuthenticated']  // Only persist auth state
  }
})
```

### Persistence Decisions

**Stores with persistence:**
- ✅ **auth** only (encrypted with SecureLS in production)

**Stores without persistence:**
- ❌ account (no state)
- ❌ admin (fetched data should be fresh)
- ❌ caseReport (fetched data should be fresh)
- ❌ form (fetched data should be fresh)
- ❌ interview (fetched data should be fresh)
- ❌ study (fetched data should be fresh)

**Rationale:**
- Auth state needs persistence for seamless user experience (auto-login)
- Data stores contain server data that should be fetched fresh on session start
- Pagination options are UI state that should reset on page reload
- Single entity state (user, study, form) should be re-fetched on navigation

---

## Cross-Store Communication

### Vuex Pattern (Current)

```javascript
// In account/actions.js
dispatch('auth/logout', null, { root: true })

// In admin/actions.js
dispatch('admin/getUsers', { paginationOpts }, { root: true })
```

### Pinia Pattern (Target)

**Cross-store calls:**
```javascript
// In account store
import { useAuthStore } from './auth'

async function updatePasswordFromProfile(email, oldPassword, newPassword) {
  const result = await userService.updatePasswordFromProfile(/* ... */)
  if (result && result.status >= 200) {
    const authStore = useAuthStore()  // Direct import
    authStore.logout()  // Direct method call
  }
}
```

**Self-refresh calls (same store):**
```javascript
// In admin store
async function createUser(userObj, paginationOpts) {
  const result = await userService.createUser(userObj).catch(/* ... */)
  if (result) {
    Notify.create({ message: t('success.user_created'), color: 'positive' })
  }
  await getUsers(paginationOpts)  // Direct function call (no dispatch)
}
```

### Identified Dependencies

**Cross-store:**
1. `account.updatePasswordFromProfile` → `auth.logout()`

**Self-refresh patterns:**
- All stores with CRUD operations call their own `get*` actions after create/update/delete

**No other cross-store dependencies found**

---

## Implementation Checklist

### Phase 1: Setup Infrastructure
- [ ] Install Pinia: `npm install pinia`
- [ ] Install Feathers-Pinia: `npm install feathers-pinia`
- [ ] Install persistence plugin: `npm install pinia-plugin-persistedstate`
- [ ] Create Quasar boot file: `src/boot/pinia.js`
- [ ] Configure persistence with SecureLS integration
- [ ] Configure Feathers-Pinia client in `src/boot/feathersClient.js`
- [ ] Register Pinia in `quasar.config.js` boot array
- [ ] Update `src/App.vue` to use Pinia

### Phase 2: Create Pinia Stores (in dependency order)
- [ ] Create `src/stores/` directory
- [ ] Implement `src/stores/auth.js` (Feathers-Pinia, no dependencies)
- [ ] Test auth store: login, logout, reAuthenticate
- [ ] Implement `src/stores/account.js` (depends on auth)
- [ ] Test account store: cross-store logout call
- [ ] Implement `src/stores/study.js` (no dependencies)
- [ ] Implement `src/stores/form.js` (no dependencies)
- [ ] Implement `src/stores/caseReport.js` (no dependencies)
- [ ] Implement `src/stores/interview.js` (no dependencies)
- [ ] Implement `src/stores/admin.js` (no dependencies)
- [ ] Test all stores: CRUD operations, pagination

### Phase 3: Create useAuth Composable
- [ ] Create `src/composables/` directory
- [ ] Implement `src/composables/useAuth.js`
- [ ] Implement all role check computed properties
- [ ] Export auth actions from composable
- [ ] Test composable in isolation

### Phase 4: Component Migration
**Note:** See COMPONENT-MIGRATION.md for detailed component conversion patterns

- [ ] Identify all components using Vuex stores (mapState, mapActions, $store)
- [ ] Identify all 27+ components using AuthMixin
- [ ] Update component imports (Vuex helpers → Pinia stores)
- [ ] Replace AuthMixin with useAuth composable
- [ ] Update component logic (this.$store → storeInstance)
- [ ] Test each component after migration
- [ ] Verify no console errors

**Priority order:**
1. Layouts (MainLayout, StudyLayout) - highest impact
2. Pages using AuthMixin
3. Components using AuthMixin
4. Pages using Vuex stores
5. Components using Vuex stores

### Phase 5: Cleanup
- [ ] Remove Vuex from `quasar.config.js` boot array
- [ ] Delete `src/store/` directory
- [ ] Delete `src/mixins/AuthMixin.js`
- [ ] Uninstall Vuex: `npm uninstall vuex`
- [ ] Uninstall FeathersVuex: `npm uninstall @feathersjs/vuex`
- [ ] Uninstall vuex-persistedstate: `npm uninstall vuex-persistedstate`
- [ ] Update documentation

### Phase 6: Testing
- [ ] Test all CRUD operations in each module
- [ ] Verify authentication flow (login, logout, auto-login)
- [ ] Test all role-based permissions (via useAuth)
- [ ] Test pagination in all data tables
- [ ] Verify error handling and notifications
- [ ] Test cross-store communication (account → auth logout)
- [ ] Verify state persistence (auth only)
- [ ] Test in multiple browsers
- [ ] Test with network failures
- [ ] Full regression testing

---

## Risk Assessment

### High Risk Areas

| Risk | Impact | Likelihood | Mitigation | Status |
|------|--------|-----------|------------|--------|
| **FeathersVuex integration** | High (auth failure) | Medium | Use official Feathers-Pinia, test thoroughly | Mitigated |
| **AuthMixin migration** | High (broken permissions) | Low | Create useAuth early, test each component | Planned |
| **Router access in stores** | Medium (navigation fails) | Low | Use `useRouter()` in setup | Documented |
| **State reactivity** | Medium (UI not updating) | Medium | Thorough testing, proper `.value` usage | Planned |

### Medium Risk Areas

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| **Pagination object updates** | Medium | Low | Use nested `.value` access, test tables |
| **Array mutations** | Medium | Low | Continue spread pattern, test data updates |
| **Error handler integration** | Medium | Low | Review error boot file, test error flows |
| **Cross-store dispatch** | Medium | Low | Direct import pattern, test account→auth |

### Low Risk Areas

| Risk | Impact | Likelihood |
|------|--------|-----------|
| **Service layer** | Low | Very Low |
| **Notification system** | Low | Very Low |
| **i18n integration** | Low | Very Low |

### Risk Mitigation Actions

**Completed:**
- ✅ FeathersVuex successor identified (Feathers-Pinia)
- ✅ All 7 stores analyzed and migration patterns documented
- ✅ AuthMixin usage mapped (27+ components)
- ✅ Cross-store dependencies identified (1 instance)

**Remaining:**
- ⏳ Test environment setup for Pinia
- ⏳ Prototype Feathers-Pinia integration
- ⏳ Create comprehensive test plan

---

## Testing Strategy

### Unit Testing

**Store Tests:**
```javascript
import { setActivePinia, createPinia } from 'pinia'
import { useAccountStore } from 'stores/account'

describe('Account Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('should call registerUser and navigate', async () => {
    const store = useAccountStore()
    // Mock userService and router
    await store.registerUser({ email: 'test@example.com', password: 'password' })
    // Verify service called
    // Verify router.push called
  })
})
```

**Composable Tests:**
```javascript
import { useAuth } from 'composables/useAuth'

describe('useAuth Composable', () => {
  it('should compute isAdministrator correctly', () => {
    const authStore = useAuthStore()
    authStore.user = { role: 'administrator' }
    
    const { isAdministrator } = useAuth()
    expect(isAdministrator.value).toBe(true)
  })
})
```

### Integration Testing

**Authentication Flow:**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout clears user state
- [ ] Auto-login on app reload (reAuthenticate)
- [ ] Token refresh
- [ ] Session expiration handling

**CRUD Operations:**
- [ ] Create entity → refreshes list
- [ ] Update entity → updates state
- [ ] Delete entity → refreshes list
- [ ] Pagination works correctly
- [ ] Filtering works correctly
- [ ] Sorting works correctly

**Cross-Store:**
- [ ] account.updatePasswordFromProfile → auth.logout works
- [ ] No other cross-store dependencies

**Component Integration:**
- [ ] AuthMixin components work with useAuth
- [ ] Role-based UI rendering correct
- [ ] Vuex store components work with Pinia
- [ ] No reactivity issues

### Manual Testing Checklist

**For each store:**
- [ ] List view loads data
- [ ] Pagination controls work
- [ ] Create new item
- [ ] Edit existing item
- [ ] Delete single item
- [ ] Delete multiple items (bulk)
- [ ] Filter/search works
- [ ] Error handling shows notifications

**For auth:**
- [ ] Login succeeds with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Logout clears session
- [ ] Auto-login works on refresh
- [ ] Protected routes redirect when not authenticated
- [ ] Role-based features show/hide correctly

**For useAuth composable:**
- [ ] All role checks work (isAdministrator, isManager, etc.)
- [ ] User email displays correctly
- [ ] isGuest works when not logged in
- [ ] All 27+ components using AuthMixin migrated successfully

---

## Setup Syntax Pattern Reference

### Quick Reference Guide

**State Declaration:**
```javascript
// Vuex
export default function () {
  return {
    items: [],
    currentItem: {}
  }
}

// Pinia setup syntax
const items = ref([])
const currentItem = ref({})
```

**Getters Declaration:**
```javascript
// Vuex
export function filteredItems(state) {
  return state.items.filter(item => item.active)
}

// Pinia setup syntax
const filteredItems = computed(() => {
  return items.value.filter(item => item.active)
})
```

**Actions + Mutations:**
```javascript
// Vuex: Separate action and mutation
// actions.js
export async function fetchItems({ commit }) {
  const result = await service.getItems()
  commit('setItems', result.data)
}

// mutations.js
export function setItems(state, items) {
  state.items = [...items]
}

// Pinia: Merged into single action
async function fetchItems() {
  const result = await service.getItems()
  items.value = [...result.data]  // Direct assignment
}
```

**Return Object:**
```javascript
return {
  // State (refs)
  items,
  currentItem,
  // Getters (computed)
  filteredItems,
  // Actions (functions)
  fetchItems,
  createItem,
  updateItem,
  deleteItem
}
```

---

## Summary

This comprehensive state management migration strategy covers:

✅ **7 stores total:** account, admin, auth, caseReport, form, interview, study  
✅ **Setup syntax pattern:** `ref()` for state, `computed()` for getters, plain functions for actions  
✅ **FeathersVuex → Feathers-Pinia:** Official migration path with useAuth composable  
✅ **AuthMixin → useAuth:** Composable pattern for 27+ components  
✅ **Persistence:** Auth store only, using SecureLS encryption in production  
✅ **Cross-store communication:** Direct import and method calls (1 instance documented)  
✅ **Router access:** Use `useRouter()` composition API  
✅ **Risk mitigation:** All high-risk areas identified with mitigation strategies  

**All stores analyzed with actual state, getters, actions documented. Ready for implementation.**

---

**Document Version:** 1.0 (Consolidated)  
**Last Updated:** 2026-05-31  
**Status:** Planning Complete - Ready for Implementation  
**Next Review:** After Phase 3 (State Management) completion

**Consolidation Note:** This document consolidates content from original planning documents:
- `pinia-architecture.md` (1,421 lines) - Store architecture with setup syntax
- `feathersvuex-migration.md` (477 lines) - FeathersVuex to Feathers-Pinia strategy

Original files archived to `plans/archive/`. Total consolidated content: ~1,900 lines → organized for clarity and implementation readiness.

**See Also:**
- MIGRATION-STRATEGY.md - Build tool and framework migration
- COMPONENT-MIGRATION.md - Component conversion to Composition API
- IMPLEMENTATION-GUIDE.md - Quick reference for implementers
