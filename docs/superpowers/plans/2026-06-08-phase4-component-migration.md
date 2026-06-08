# Phase 4: Component Migration from Vuex to Pinia

**Date:** 2026-06-08  
**Status:** In Progress  
**Goal:** Migrate all 23 components from Vuex to Pinia stores

---

## Scope

**Components to Migrate:** 23 Vue components using Vuex
**AuthMixin Usage:** 42 component references (overlaps with Vuex usage)
**Approach:** Systematic migration with batching by store type

---

## Migration Statistics

**Total Vue Components:** 73  
**Components Using Vuex:** 23 (32%)  
**Components Using AuthMixin:** 27 (from Phase 3 analysis)  

**Stores Used:**
- Account: 3 components (Login, Register, ForgotPassword, ResetPassword, Account)
- Study: 2 components (Studies, Study, StudyLayout)
- Form: 3 components (Forms, FormRevisions, StudyForm)
- Interview: 4 components (Interviews, InterviewDesigns, InterviewDesignSteps, Campaigns, StudyInterviewDesign)
- CaseReport: 2 components (CaseReports, CaseReportForms)
- Admin: 5 components (Users, User, Groups, Group, Tasks)

---

## Component List (23 files)

### Pages (15 files):
1. `src/pages/Login.vue` - account store (auth only)
2. `src/pages/Register.vue` - account store
3. `src/pages/ForgotPassword.vue` - account store
4. `src/pages/ResetPassword.vue` - account store
5. `src/pages/Account.vue` - account store
6. `src/pages/Studies.vue` - study store
7. `src/pages/Study.vue` - study store
8. `src/pages/StudyForm.vue` - form store
9. `src/pages/StudyInterviewDesign.vue` - interview store
10. `src/pages/Users.vue` - admin store (users)
11. `src/pages/User.vue` - admin store (users)
12. `src/pages/Groups.vue` - admin store (groups)
13. `src/pages/Group.vue` - admin store (groups)
14. `src/pages/Tasks.vue` - admin store (tasks)

### Layouts (1 file):
15. `src/layouts/StudyLayout.vue` - study store

### Components (8 files):
16. `src/components/forms/Forms.vue` - form store
17. `src/components/forms/FormRevisions.vue` - form store
18. `src/components/interviews/Interviews.vue` - interview store
19. `src/components/interviews/InterviewDesigns.vue` - interview store
20. `src/components/interviews/InterviewDesignSteps.vue` - interview store
21. `src/components/interviews/Campaigns.vue` - interview store
22. `src/components/crfs/CaseReports.vue` - caseReport store
23. `src/components/crfs/CaseReportForms.vue` - caseReport store

---

## Migration Pattern

### For Each Component:

1. **Import Changes:**
   ```javascript
   // Old (Vuex)
   import { mapState, mapActions } from 'vuex'
   
   // New (Pinia)
   import { useAccountStore } from 'src/stores/account'
   import { useAuth } from 'src/composables/useAuth'
   ```

2. **Remove mapState/mapActions from computed/methods:**
   ```javascript
   // Old
   computed: {
     ...mapState({
       users: state => state.admin.users
     })
   }
   
   // New (in setup())
   const adminStore = useAdminStore()
   const users = computed(() => adminStore.users)
   ```

3. **Replace AuthMixin:**
   ```javascript
   // Old
   mixins: [AuthMixin],
   
   // New (in setup())
   const { user, isAdministrator, userEmail } = useAuth()
   ```

4. **Action Calls:**
   ```javascript
   // Old
   ...mapActions({
     getUsers: 'admin/getUsers'
   })
   this.getUsers({ paginationOpts })
   
   // New
   adminStore.getUsers(paginationOpts)
   ```

---

## Migration Strategy

### Batch 1: Account Pages (5 components)
Simple auth flows, minimal state usage
- Login.vue
- Register.vue  
- ForgotPassword.vue
- ResetPassword.vue
- Account.vue

### Batch 2: Study Pages (3 components)
Study CRUD operations
- Studies.vue
- Study.vue
- StudyLayout.vue

### Batch 3: Form Components (3 components)
Form + revision management
- Forms.vue
- FormRevisions.vue
- StudyForm.vue

### Batch 4: Interview Components (5 components)
Interview, design, campaign management
- Interviews.vue
- InterviewDesigns.vue
- InterviewDesignSteps.vue
- Campaigns.vue
- StudyInterviewDesign.vue

### Batch 5: CaseReport Components (2 components)
Case report management
- CaseReports.vue
- CaseReportForms.vue

### Batch 6: Admin Pages (5 components)
User, group, task management
- Users.vue
- User.vue
- Groups.vue
- Group.vue
- Tasks.vue

---

## Testing After Each Batch

1. Run dev server: `yarn quasar dev`
2. Navigate to migrated pages/components
3. Test CRUD operations (create, read, update, delete)
4. Verify error handling and notifications
5. Check pagination works correctly

---

## Cleanup After All Batches

1. Delete `src/store/` directory (Vuex modules)
2. Delete `src/mixins/AuthMixin.js`
3. Remove vuex from package.json (if still present - was removed in Phase 2)
4. Final test: Full app smoke test
5. Commit: "feat: complete Vuex to Pinia migration - remove old Vuex code"

---

## Success Criteria

- ✅ All 23 components migrated to Pinia
- ✅ Zero Vuex imports remaining
- ✅ Zero AuthMixin usage remaining
- ✅ All functionality preserved (CRUD, pagination, auth checks)
- ✅ Dev server starts without errors
- ✅ All routes navigable
- ✅ Old Vuex code removed
