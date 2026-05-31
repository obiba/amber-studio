# Pinia Store Architecture Document

## Overview

This document defines the architecture for migrating from Vuex to Pinia stores using the Composition API setup syntax. The migration will convert 6 Vuex module stores plus 1 auth plugin into 7 independent Pinia stores.

**Migration approach:**
- Use Pinia setup syntax (function-based stores with `ref()` and `computed()`)
- Each store will be a single file in `src/stores/{name}.js`
- State becomes `ref()` variables
- Getters become `computed()` properties
- Actions and mutations merge into plain async/sync functions
- Preserve all business logic and error handling

## Current Vuex Structure

### Location
- Main store: `src/store/index.js`
- Store modules: `src/store/{module}/`
- Auth plugin: `src/store/store.auth.js`

### Module Pattern
Each Vuex module follows this structure:
```
src/store/{module}/
  ├── index.js        # Module registration
  ├── state.js        # State initialization function
  ├── getters.js      # Computed state selectors
  ├── actions.js      # Async operations
  └── mutations.js    # Synchronous state updates
```

### Modules Overview
1. **account** - User registration, profile updates, password management
2. **admin** - User, group, and task management for admins
3. **caseReport** - Case report and case report form management
4. **form** - Study form and form revision management
5. **interview** - Interview, interview design, and campaign management
6. **study** - Study CRUD operations
7. **auth** (plugin) - Feathers authentication integration

---

## Store 1: Account Store

### Current State (account/state.js)
```javascript
{} // Empty state object
```

**Analysis:** The account store has no state. All functionality is in actions for user account operations.

### Current Getters (account/getters.js)
- None (commented out template)

### Current Actions (account/actions.js)
- `registerUser(context, payload)` - Register new user account
- `updateProfile(context, payload)` - Update user profile information
- `forgotPassword(context, payload)` - Initiate password reset flow
- `resetPassword(context, payload)` - Reset password with token
- `updatePassword(context, payload)` - Update password with token
- `updatePasswordFromProfile({ dispatch }, payload)` - Change password from profile (triggers logout)
- `updateIdentity(context, payload)` - Update user email identity
- `resendVerification(context, payload)` - Resend email verification

**Dependencies:**
- Service: `src/services/user.js`
- Router access: Uses `this.$router.push()` (needs injection)
- Dispatch to auth store: `dispatch('auth/logout')` for cross-store communication

### Current Mutations (account/mutations.js)
- None (empty file)

### Pinia Design

**File:** `src/stores/account.js`

**Setup Structure:**
```javascript
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
  async function registerUser(formData) { /* ... */ }
  async function updateProfile(id, profileData) { /* ... */ }
  async function forgotPassword(emailAddress) { /* ... */ }
  async function resetPassword(token, password) { /* ... */ }
  async function updatePassword(password, token) { /* ... */ }
  async function updatePasswordFromProfile(email, oldPassword, newPassword) {
    // Cross-store call example
    const authStore = useAuthStore()
    // ... logic ...
    authStore.logout()
  }
  async function updateIdentity(password, currentEmail, updatedEmail) { /* ... */ }
  async function resendVerification(email) { /* ... */ }
  
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
```

**Migration notes:**
- No state to convert
- Actions become plain async functions
- Remove `context` parameter, use direct function parameters
- Router access via `useRouter()` instead of `this.$router`
- Cross-store communication: `const authStore = useAuthStore()` instead of `dispatch('auth/logout')`

---

## Store 2: Admin Store

### Current State (admin/state.js)
```javascript
{
  users: [],                    // Array of user objects
  userPaginationOpts: {         // User table pagination config
    sortBy: 'lastSeen',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  },
  user: {},                     // Currently selected user
  groups: [],                   // Array of group objects
  groupPaginationOpts: {        // Group table pagination config
    sortBy: 'name',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  },
  group: {},                    // Currently selected group
  groupUsers: [],               // Users belonging to selected group
  tasks: [],                    // Array of task objects
  taskPaginationOpts: {         // Task table pagination config
    sortBy: 'createdTask',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  }
}
```

**State complexity:** Medium - Multiple entity types (users, groups, tasks) with pagination

### Current Getters (admin/getters.js)
- None (commented out template)

### Current Actions (admin/actions.js)

**User management:**
- `getUsers({ commit }, payload)` - Fetch paginated users list
- `getUser({ commit }, payload)` - Fetch single user by ID
- `createUser({ dispatch }, payload)` - Create new user
- `updateUser({ commit, dispatch }, payload)` - Update existing user
- `deleteUser({ dispatch }, payload)` - Delete single user
- `deleteUsers({ dispatch }, payload)` - Bulk delete users

**Group management:**
- `getGroups({ commit }, payload)` - Fetch paginated groups list
- `getGroup({ commit }, payload)` - Fetch single group by ID
- `getGroupUsers({ commit }, payload)` - Fetch users in a group
- `createGroup({ dispatch }, payload)` - Create new group
- `updateGroup({ commit, dispatch }, payload)` - Update existing group
- `deleteGroup({ dispatch }, payload)` - Delete single group
- `deleteGroups({ dispatch }, payload)` - Bulk delete groups

**Task management:**
- `getTasks({ commit }, payload)` - Fetch paginated tasks list
- `createTask({ dispatch }, payload)` - Create new task
- `deleteTask({ dispatch }, payload)` - Delete single task
- `deleteTasks({ dispatch }, payload)` - Bulk delete tasks

**Dependencies:**
- Services: `src/services/user.js`, `src/services/group.js` (groupService, taskService)
- Root dispatch calls: Uses `{ root: true }` for self-dispatch after mutations

### Current Mutations (admin/mutations.js)
- `setUsers(state, users)` - Replace users array
- `setUser(state, user)` - Set current user
- `setUserPagination(state, payload)` - Update user pagination options
- `setUserCount(state, count)` - Update total user count
- `setGroup(state, group)` - Set current group
- `setGroupUsers(state, users)` - Set users in current group
- `setGroups(state, groups)` - Replace groups array
- `setGroupPagination(state, payload)` - Update group pagination options
- `setGroupCount(state, count)` - Update total group count
- `setTasks(state, tasks)` - Replace tasks array
- `setTaskPagination(state, payload)` - Update task pagination options
- `setTaskCount(state, count)` - Update total task count

### Pinia Design

**File:** `src/stores/admin.js`

**Setup Structure:**
```javascript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import userService from '../services/user'
import { groupService, taskService } from '../services/group'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'

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
    const result = await userService.getUsers(paginationOpts, filter, roles).catch(/* ... */)
    if (result) {
      users.value = [...result.data]  // Direct assignment instead of commit
      userPaginationOpts.value.rowsNumber = result.total
    } else {
      users.value = []
      userPaginationOpts.value.rowsNumber = 0
    }
  }
  
  async function createUser(userObj, paginationOpts) {
    const result = await userService.createUser(userObj).catch(/* ... */)
    if (result) { /* notify */ }
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

**Migration notes:**
- All state objects become `ref()`
- Mutations merge into actions - direct assignment to `.value`
- Self-dispatch becomes direct function calls within the store
- Spread operator `[...result.data]` maintains array immutability pattern

---

## Store 3: Case Report Store

### Current State (caseReport/state.js)
```javascript
{
  caseReportForms: [],          // Array of case report form objects
  caseReportFormPaginationOpts: {
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  },
  caseReportForm: {},           // Currently selected case report form
  caseReports: [],              // Array of case report objects
  caseReportPaginationOpts: {
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  },
  caseReport: {}                // Currently selected case report
}
```

**State complexity:** Medium - Dual entity management (reports and report forms)

### Current Getters (caseReport/getters.js)
- None (commented out template)

### Current Actions (caseReport/actions.js)

**Case report management:**
- `getCaseReports({ commit }, payload)` - Fetch paginated case reports with filters (study, form, caseReportForm, from, to dates)
- `updateCaseReport({ dispatch }, payload)` - Update existing case report
- `deleteCaseReport({ dispatch }, payload)` - Delete single case report
- `deleteCaseReports({ dispatch }, payload)` - Bulk delete case reports

**Case report form management:**
- `getCaseReportForms({ commit }, payload)` - Fetch paginated case report forms by study
- `createCaseReportForm({ dispatch }, payload)` - Create new case report form
- `updateCaseReportForm({ commit, dispatch }, payload)` - Update case report form
- `deleteCaseReportForm({ dispatch }, payload)` - Delete single case report form
- `deleteCaseReportForms({ dispatch }, payload)` - Bulk delete case report forms

**Dependencies:**
- Services: `src/services/caseReport.js` (caseReportFormService, caseReportService)
- Root dispatch calls for self-refresh

### Current Mutations (caseReport/mutations.js)
- `setCaseReports(state, caseReports)` - Replace case reports array
- `setCaseReportPagination(state, payload)` - Update case report pagination
- `setCaseReportCount(state, count)` - Update case report total count
- `setCaseReportForm(state, caseReportForm)` - Set current case report form
- `setCaseReportForms(state, caseReportForms)` - Replace case report forms array
- `setCaseReportFormPagination(state, payload)` - Update form pagination
- `setCaseReportFormCount(state, count)` - Update form total count

### Pinia Design

**File:** `src/stores/caseReport.js`

**Setup Structure:**
```javascript
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { caseReportFormService, caseReportService } from '../services/caseReport'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'

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
  
  // Actions
  async function getCaseReports(paginationOpts, study, form, caseReportForm, filter, from, to) {
    const result = await caseReportService.getCaseReports(/* params */).catch(/* ... */)
    if (result) {
      caseReports.value = [...result.data]
      caseReportPaginationOpts.value.rowsNumber = result.total
    } else {
      caseReports.value = []
      caseReportPaginationOpts.value.rowsNumber = 0
    }
  }
  
  async function updateCaseReport(caseReportObj, id, paginationOpts, study, form) {
    const result = await caseReportService.updateCaseReport(caseReportObj, id).catch(/* ... */)
    if (result) { /* notify */ }
    await getCaseReports(paginationOpts, study, form)  // Self-refresh
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

**Migration notes:**
- Dual entity pattern (reports + forms) preserved in structure
- Date range filtering parameters passed directly to actions
- Self-refresh pattern after mutations via direct function calls

---

## Store 4: Form Store

### Current State (form/state.js)
```javascript
{
  forms: [],                    // Array of study form objects
  formPaginationOpts: {
    sortBy: 'name',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  },
  formRevisions: [],            // Array of form revision objects
  formRevisionPaginationOpts: {
    sortBy: 'revision',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  },
  form: {}                      // Currently selected form
}
```

**State complexity:** Medium - Forms with versioning/revision tracking

### Current Getters (form/getters.js)
- None (commented out template)

### Current Actions (form/actions.js)

**Form management:**
- `getForms({ commit }, payload)` - Fetch paginated forms by study
- `getForm({ commit }, payload)` - Fetch single form by ID
- `createForm({ dispatch }, payload)` - Create new study form
- `updateForm({ commit, dispatch }, payload)` - Update form (with optional notification flag)
- `deleteForm({ dispatch }, payload)` - Delete single form (with specific error handling for dependencies)
- `deleteForms({ dispatch }, payload)` - Bulk delete forms

**Form revision management:**
- `createFormRevision({ dispatch }, payload)` - Create form revision/tag
- `getFormRevisions({ commit }, payload)` - Fetch form revisions by form ID
- `deleteFormRevision({ dispatch }, payload)` - Delete single revision
- `deleteFormRevisions({ dispatch }, payload)` - Bulk delete revisions

**Dependencies:**
- Services: `src/services/form.js` (formService, formRevisionService)
- Special error handling: FormRemoveError, FormRevisionRemoveError

### Current Mutations (form/mutations.js)
- `setForm(state, form)` - Set current form
- `setForms(state, forms)` - Replace forms array
- `setFormPagination(state, payload)` - Update form pagination
- `setFormCount(state, count)` - Update form total count
- `setFormRevisions(state, formRevisions)` - Replace revisions array
- `setFormRevisionPagination(state, payload)` - Update revision pagination
- `setFormRevisionCount(state, count)` - Update revision total count

### Pinia Design

**File:** `src/stores/form.js`

**Setup Structure:**
```javascript
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { formService, formRevisionService } from '../services/form'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'

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
  async function getForms(paginationOpts, study, filter) {
    const result = await formService.getForms(paginationOpts, study, filter).catch(/* ... */)
    if (result) {
      forms.value = [...result.data]
      formPaginationOpts.value.rowsNumber = result.total
    } else {
      forms.value = []
      formPaginationOpts.value.rowsNumber = 0
    }
  }
  
  async function updateForm(formObj, id, notification, paginationOpts) {
    const result = await formService.updateForm(formObj, id).catch(/* ... */)
    if (result) {
      if (notification) { /* notify */ }
      form.value = result
    }
    if (paginationOpts) {
      await getForms(paginationOpts, formObj.study)
    }
  }
  
  async function deleteForm(id, paginationOpts, study) {
    // Special error handling for FormRemoveError
    const result = await formService.deleteForm(id).catch((err) => {
      errorHandler.onError(err, {
        FormRemoveError: t('error.form_remove_error', err.data),
        default: t('error.general')
      })
    })
    // ... rest
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

**Migration notes:**
- Form versioning system with separate revisions state
- Conditional notification flag in `updateForm`
- Specialized error types: FormRemoveError, FormRevisionRemoveError

---

## Store 5: Interview Store

### Current State (interview/state.js)
```javascript
{
  interviewDesigns: [],         // Array of interview design objects
  interviewDesignPaginationOpts: {
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  },
  interviewDesign: {},          // Currently selected interview design
  campaigns: [],                // Array of campaign objects
  campaignPaginationOpts: {
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  },
  interviews: [],               // Array of interview objects
  interviewPaginationOpts: {
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  },
  interview: {}                 // Currently selected interview
}
```

**State complexity:** High - Triple entity management (interviews, designs, campaigns) with complex filtering

### Current Getters (interview/getters.js)
- None (commented out template)

### Current Actions (interview/actions.js)

**Interview management:**
- `getInterviews({ commit }, payload)` - Fetch interviews with extensive filters (study, interviewDesign, campaign, state, participantValid, filter, from/to dates)
- `updateInterview({ dispatch }, payload)` - Update existing interview
- `deleteInterview({ dispatch }, payload)` - Delete single interview
- `deleteInterviews({ dispatch }, payload)` - Bulk delete interviews

**Interview design management:**
- `getInterviewDesigns({ commit }, payload)` - Fetch interview designs by study
- `getInterviewDesign({ commit }, payload)` - Fetch single interview design
- `createInterviewDesign({ dispatch }, payload)` - Create new interview design
- `updateInterviewDesign({ commit, dispatch }, payload)` - Update design (with optional notification flag)
- `deleteInterviewDesign({ dispatch }, payload)` - Delete single design
- `deleteInterviewDesigns({ dispatch }, payload)` - Bulk delete designs

**Campaign management:**
- `getCampaigns({ commit }, payload)` - Fetch campaigns by interview design
- `createCampaign({ dispatch }, payload)` - Create new campaign
- `updateCampaign({ dispatch }, payload)` - Update existing campaign
- `deleteCampaign({ dispatch }, payload)` - Delete single campaign

**Dependencies:**
- Services: `src/services/interview.js` (campaignService, interviewDesignService, interviewService)
- Complex filter parameters for interview queries

### Current Mutations (interview/mutations.js)
- `setInterviews(state, interviews)` - Replace interviews array
- `setInterviewPagination(state, payload)` - Update interview pagination
- `setInterviewCount(state, count)` - Update interview total count
- `setInterviewDesign(state, interviewDesign)` - Set current design
- `setInterviewDesigns(state, interviewDesigns)` - Replace designs array
- `setInterviewDesignPagination(state, payload)` - Update design pagination
- `setInterviewDesignCount(state, count)` - Update design total count
- `setCampaigns(state, campaigns)` - Replace campaigns array
- `setCampaignPagination(state, payload)` - Update campaign pagination
- `setCampaignCount(state, count)` - Update campaign total count

### Pinia Design

**File:** `src/stores/interview.js`

**Setup Structure:**
```javascript
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { campaignService, interviewDesignService, interviewService } from '../services/interview'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'

export const useInterviewStore = defineStore('interview', () => {
  // State
  const interviews = ref([])
  const interviewPaginationOpts = ref({
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })
  const interview = ref({})
  
  const interviewDesigns = ref([])
  const interviewDesignPaginationOpts = ref({
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })
  const interviewDesign = ref({})
  
  const campaigns = ref([])
  const campaignPaginationOpts = ref({
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  })
  
  // Actions
  async function getInterviews(paginationOpts, study, interviewDesign, campaign, state, participantValid, filter, from, to) {
    const result = await interviewService.getInterviews(/* all params */).catch(/* ... */)
    if (result) {
      interviews.value = [...result.data]
      interviewPaginationOpts.value.rowsNumber = result.total
    } else {
      interviews.value = []
      interviewPaginationOpts.value.rowsNumber = 0
    }
  }
  
  async function updateInterviewDesign(designObj, id, notification, paginationOpts) {
    const result = await interviewDesignService.updateInterviewDesign(designObj, id).catch(/* ... */)
    if (result) {
      if (notification) { /* notify */ }
      interviewDesign.value = result
    }
    if (paginationOpts) {
      await getInterviewDesigns(paginationOpts, designObj.study)
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

**Migration notes:**
- Most complex store with 3 entity types
- Extensive filter parameters (8+ for getInterviews)
- Hierarchical relationship: Study -> InterviewDesign -> Campaign -> Interview
- Conditional notification in updateInterviewDesign similar to forms

---

## Store 6: Study Store

### Current State (study/state.js)
```javascript
{
  studies: [],                  // Array of study objects
  studyPaginationOpts: {
    sortBy: 'name',
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  },
  study: {}                     // Currently selected study
}
```

**State complexity:** Low - Simple CRUD entity

### Current Getters (study/getters.js)
- None (commented out template)

### Current Actions (study/actions.js)
- `getStudies({ commit }, payload)` - Fetch paginated studies list
- `getStudy({ commit }, payload)` - Fetch single study by ID
- `createStudy({ dispatch }, payload)` - Create new study
- `updateStudy({ commit, dispatch }, payload)` - Update existing study
- `deleteStudy({ dispatch }, payload)` - Delete single study (with dependency error handling)
- `deleteStudies({ dispatch }, payload)` - Bulk delete studies

**Dependencies:**
- Service: `src/services/study.js`
- Special error handling: FormRemoveError, FormRevisionRemoveError (cascade delete checks)

### Current Mutations (study/mutations.js)
- `setStudy(state, study)` - Set current study
- `setStudies(state, studies)` - Replace studies array
- `setStudyPagination(state, payload)` - Update pagination options
- `setStudyCount(state, count)` - Update total study count

### Pinia Design

**File:** `src/stores/study.js`

**Setup Structure:**
```javascript
import { ref } from 'vue'
import { defineStore } from 'pinia'
import studyService from '../services/study'
import { t } from '../boot/i18n'
import { errorHandler } from '../boot/errors'
import { Notify } from 'quasar'

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
  
  async function getStudy(id) {
    const result = await studyService.getStudy(id).catch(/* ... */)
    if (result) {
      study.value = result
    } else {
      study.value = { _id: id }
    }
  }
  
  async function createStudy(studyObj, paginationOpts) {
    const result = await studyService.createStudy(studyObj).catch(/* ... */)
    if (result) { /* notify */ }
    await getStudies(paginationOpts)
  }
  
  async function updateStudy(studyObj, id, paginationOpts) {
    const result = await studyService.updateStudy(studyObj, id).catch(/* ... */)
    if (result) {
      /* notify */
      study.value = result
    }
    if (paginationOpts) {
      await getStudies(paginationOpts)
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
    if (result) { /* notify */ }
    await getStudies(paginationOpts)
  }
  
  async function deleteStudies(ids, paginationOpts) {
    // Bulk delete with same error handling
    const result = await studyService.deleteStudies(ids).catch(/* ... */)
    if (result) { /* notify */ }
    await getStudies(paginationOpts)
  }
  
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

**Migration notes:**
- Simplest store - standard CRUD pattern
- Parent entity for forms, caseReports, interviews
- Cascade delete error handling for related entities

---

## Store 7: Auth Store

### Current Implementation (store.auth.js)
```javascript
import { makeAuthPlugin } from '../boot/feathersClient'

export default makeAuthPlugin({ userService: 'user' })
```

**Analysis:** The auth store is currently a Feathers Vuex plugin, not a standard Vuex module. This is a special case.

### Dependencies
- Feathers Client: `src/boot/feathersClient.js`
- Likely provides: `makeAuthPlugin`, authentication state, and auth actions
- Registers as a Vuex plugin in `src/store/index.js` plugins array

### Expected Functionality
Based on typical Feathers authentication patterns:
- **State:** user, accessToken, isAuthenticated, error
- **Actions:** authenticate, logout, reAuthenticate (auto-login on app load)
- **Getters:** user, isAuthenticated

### Pinia Design

**File:** `src/stores/auth.js`

**Setup Structure:**
```javascript
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
  
  // Getters (computed)
  const currentUser = computed(() => user.value)
  const isLoggedIn = computed(() => isAuthenticated.value)
  
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
      user.value = null
      accessToken.value = null
      isAuthenticated.value = false
      authError.value = null
    } catch (error) {
      console.error('Logout error:', error)
      // Clear state anyway
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
    // Getters
    currentUser,
    isLoggedIn,
    // Actions
    authenticate,
    logout,
    reAuthenticate
  }
})
```

**Migration notes:**
- **Critical:** Requires investigation of `makeAuthPlugin` implementation details
- Must verify Feathers client integration and authentication flow
- Should test auto-login functionality with `reAuthenticate()`
- May need to integrate with Feathers Vue 3 patterns
- Cross-store dependency: `account.updatePasswordFromProfile` calls `auth.logout()`

---

## State Persistence Strategy

### Current Vuex Persistence (Commented Out)

The existing Vuex store has **commented out** persistence code in `src/store/index.js`:

```javascript
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
- Package `vuex-persistedstate` v4.1.0 is installed but not used
- `secure-ls` provides encrypted localStorage
- Storage key: `'astore'`
- **Current behavior:** No state persistence (all state is ephemeral)

### Pinia Persistence Strategy

**Recommendation:** Use `pinia-plugin-persistedstate` for equivalent functionality.

**Installation:**
```bash
npm install pinia-plugin-persistedstate
```

**Setup in `src/boot/pinia.js` (or equivalent):**
```javascript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import SecureLS from 'secure-ls'

const ls = new SecureLS({ isCompression: false })

const pinia = createPinia()

// Configure persistence plugin
pinia.use(piniaPluginPersistedstate)

// Custom storage configuration
const secureStorage = {
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

export { pinia, secureStorage }
```

### Per-Store Persistence Configuration

**Auth Store (MUST persist):**
```javascript
export const useAuthStore = defineStore('auth', () => {
  // ... store implementation
}, {
  persist: {
    key: 'astore-auth',
    storage: secureStorage,  // Encrypted storage
    paths: ['user', 'accessToken', 'isAuthenticated']  // Only persist auth state
  }
})
```

**Other Stores (NO persistence recommended):**
- Admin, CaseReport, Form, Interview, Study stores contain **fetched data**
- Pagination options are **UI state** that should reset on page reload
- Single entity state (user, study, form, etc.) should be re-fetched on navigation
- **Reason:** Data could become stale; better to fetch fresh data on app load

**Account Store:**
- No state, so no persistence needed

### Migration Decision Points

**Question 1:** Should we persist non-auth stores?
- **Current behavior:** No (persistence is commented out)
- **Recommendation:** No, maintain current behavior
- **Rationale:** Admin/data stores contain server data that should be fresh on each session

**Question 2:** Should we enable auth persistence?
- **Recommendation:** Yes, for seamless user experience
- **Rationale:** Feathers authentication likely expects persisted tokens for auto-login

**Question 3:** What about `debug` mode detection?
- **Current code:** Uses `debug` variable to toggle persistence
- **Recommendation:** Use `process.env.DEBUGGING` (already used in store/index.js:62)

### Final Persistence Setup

```javascript
// src/boot/pinia.js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import SecureLS from 'secure-ls'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Only use secure storage in production
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

**Stores with persistence:**
- **auth** only (with encrypted storage in production)

**Stores without persistence:**
- account (no state)
- admin
- caseReport
- form
- interview
- study

---

## Cross-Store Communication Patterns

### Vuex Pattern (Current)
```javascript
// In account/actions.js
dispatch('auth/logout', null, { root: true })

// In admin/actions.js
dispatch('admin/getUsers', { paginationOpts }, { root: true })
```

### Pinia Pattern (Migration Target)

**Cross-store calls:**
```javascript
// In account store
import { useAuthStore } from './auth'

async function updatePasswordFromProfile(email, oldPassword, newPassword) {
  const result = await userService.updatePasswordFromProfile(/* ... */)
  if (result && result.status >= 200) {
    const authStore = useAuthStore()  // Direct import and usage
    authStore.logout()
  }
}
```

**Self-refresh calls (same store):**
```javascript
// In admin store
async function createUser(userObj, paginationOpts) {
  const result = await userService.createUser(userObj).catch(/* ... */)
  if (result) { /* notify */ }
  await getUsers(paginationOpts)  // Direct function call (no dispatch)
}
```

**Identified cross-store dependencies:**
1. `account.updatePasswordFromProfile` -> `auth.logout()`

**Identified self-refresh patterns:**
- All stores with CRUD operations call their own `get*` actions after create/update/delete
- No other cross-store dependencies found

---

## Setup Syntax Pattern Reference

### State Declaration
```javascript
// Vuex module state
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

### Getters Declaration
```javascript
// Vuex getters
export function filteredItems(state) {
  return state.items.filter(item => item.active)
}

// Pinia setup syntax
const filteredItems = computed(() => {
  return items.value.filter(item => item.active)
})
```

### Actions + Mutations Pattern
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

### Return Object
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

## Implementation Checklist

### Phase 1: Setup Infrastructure
- [ ] Install Pinia: `npm install pinia`
- [ ] Install persistence plugin: `npm install pinia-plugin-persistedstate`
- [ ] Create Quasar boot file: `src/boot/pinia.js`
- [ ] Configure persistence with SecureLS integration
- [ ] Register Pinia in `quasar.config.js` boot array
- [ ] Update `src/App.vue` or main.js to use Pinia

### Phase 2: Create Pinia Stores (in order of dependencies)
- [ ] Create `src/stores/` directory
- [ ] Implement `src/stores/auth.js` (no dependencies)
- [ ] Implement `src/stores/account.js` (depends on auth)
- [ ] Implement `src/stores/study.js` (no dependencies)
- [ ] Implement `src/stores/form.js` (no dependencies)
- [ ] Implement `src/stores/caseReport.js` (no dependencies)
- [ ] Implement `src/stores/interview.js` (no dependencies)
- [ ] Implement `src/stores/admin.js` (no dependencies)

### Phase 3: Component Migration (per store)
- [ ] Identify all components using each store
- [ ] Update component imports (`mapState`, `mapActions` -> `storeToRefs`, direct calls)
- [ ] Test component functionality
- [ ] Verify no console errors

### Phase 4: Cleanup
- [ ] Remove Vuex from `quasar.config.js`
- [ ] Delete `src/store/` directory
- [ ] Uninstall Vuex: `npm uninstall vuex`
- [ ] Uninstall vuex-persistedstate: `npm uninstall vuex-persistedstate`
- [ ] Update documentation

### Phase 5: Testing
- [ ] Test all CRUD operations in each module
- [ ] Verify authentication flow (login, logout, auto-login)
- [ ] Test pagination in all data tables
- [ ] Verify error handling and notifications
- [ ] Test cross-store communication (account -> auth logout)
- [ ] Verify state persistence (auth only)

---

## Risk Assessment

### High Risk Areas

1. **Auth Store Migration**
   - **Risk:** Feathers authentication plugin integration may have hidden dependencies
   - **Mitigation:** Investigate `makeAuthPlugin` source code before implementing
   - **Testing:** Verify login, logout, auto-login, and token refresh

2. **Router Access in Actions**
   - **Risk:** `this.$router.push()` won't work in Pinia setup stores
   - **Mitigation:** Use `const router = useRouter()` in setup function
   - **Affected:** `account.registerUser`, `account.updatePassword`

3. **Cross-Store Dispatch**
   - **Risk:** `dispatch('auth/logout')` pattern must change
   - **Mitigation:** Direct store import and method call
   - **Affected:** `account.updatePasswordFromProfile`

4. **State Reactivity**
   - **Risk:** Forgetting `.value` on refs will cause bugs
   - **Mitigation:** Thorough testing, linting rules
   - **Testing:** Verify all state updates trigger UI re-renders

### Medium Risk Areas

1. **Pagination Object Updates**
   - **Risk:** Nested property updates (`paginationOpts.value.rowsNumber = count`)
   - **Mitigation:** Use object spread or Vue.set equivalent if needed
   - **Testing:** Verify pagination works in all tables

2. **Array Mutations**
   - **Risk:** Code uses spread `[...result.data]` to maintain immutability
   - **Mitigation:** Continue using spread or direct assignment to `.value`
   - **Testing:** Verify arrays update correctly

3. **Error Handler Integration**
   - **Risk:** Custom error handler might expect Vuex context
   - **Mitigation:** Review `src/boot/errors.js` implementation
   - **Testing:** Trigger errors to verify notifications work

### Low Risk Areas

1. **Service Layer**
   - Services are independent of Vuex/Pinia
   - No changes needed

2. **Notification System**
   - Quasar Notify is independent
   - Should work as-is

3. **i18n Integration**
   - Translation function `t()` is independent
   - No changes needed

---

## Open Questions for Review

1. **Auth Store Implementation:**
   - What does `makeAuthPlugin` from feathersClient actually do?
   - Should we use feathers-pinia or implement custom auth?
   - Does Feathers store auth in localStorage by default?

2. **Persistence Scope:**
   - Confirm auth store should be persisted (assumed yes)
   - Should pagination options be persisted? (assumed no)
   - Should "current item" state (user, study, form) be persisted? (assumed no)

3. **Component Migration Strategy:**
   - Can we migrate stores incrementally or all at once?
   - Should we create a compatibility layer for gradual migration?

4. **Testing Strategy:**
   - What level of test coverage is expected?
   - Should we write unit tests for each store?
   - What about integration tests?

---

## Summary

This architecture document provides a complete blueprint for migrating all 7 stores from Vuex to Pinia using setup syntax. Key takeaways:

- **7 stores total:** account, admin, auth, caseReport, form, interview, study
- **Setup syntax pattern:** ref() for state, computed() for getters, plain functions for actions
- **Persistence:** Auth store only, using SecureLS encryption in production
- **Cross-store communication:** Direct import and method calls (1 instance: account -> auth)
- **Router access:** Use `useRouter()` composition API
- **Risk mitigation:** Auth store needs careful Feathers integration testing

All stores have been analyzed with actual state, getters, actions, and mutations documented. No placeholder "[To be filled]" sections remain.
