# Implementation Guide for Claude

**Purpose:** This document provides a quick reference for implementing the Quasar 3 + Vite + Pinia migration based on the Phase 1 planning documents.

**Created:** 2026-05-31  
**For:** Phase 2+ Implementation

---

## Quick Reference: What's Where

### Planning Documents Overview

All planning documents are in `plans/` directory:

| Document | Purpose | Key Content | Lines |
|----------|---------|-------------|-------|
| **migration-strategy.md** | Overall strategy | Breaking changes, Vite config, decision log | 1,492 |
| **pinia-architecture.md** | Store migration | 7 stores analyzed, setup syntax patterns | 1,421 |
| **feathersvuex-migration.md** | Auth migration | Feathers-Pinia approach, auth flow | 477 |
| **component-setup-syntax.md** | Component conversion | 73 components, 12 patterns, priority list | 1,087 |
| **static-import-strategy.md** | Import conversion | 68 dynamic imports, manual chunking | 636 |
| **phase1-summary.md** | Summary | All decisions, GO/NO-GO, metrics | 875 |
| **phase2-kickoff-checklist.md** | Phase 2 prep | Prerequisites, tasks, success criteria | 427 |

**Total Planning:** 6,415 lines across 7 documents

---

## Key Numbers for Implementation

### Components to Migrate
- **73 total Vue components**
  - 28 pages (`src/pages/`)
  - 42 components (`src/components/`)
  - 2 layouts (`src/layouts/`)
  - 1 app root (`src/App.vue`)

### Priority Breakdown
- **High priority:** 15 files (Vuex + mixins)
- **Medium priority:** 2 files (mixins only)
- **Low priority:** 56 files (pure Options API)

**Conversion order:** Charts → Form items → Layouts → Auth → Admin → Study pages

### Stores to Create
- **7 Pinia stores** (from 6 Vuex modules + 1 auth)
  1. `stores/account.js` - User management (8 actions)
  2. `stores/admin.js` - Admin operations (19 actions, complex state)
  3. `stores/caseReport.js` - Case reports (9 actions, dual entity)
  4. `stores/form.js` - Form versioning (11 actions)
  5. `stores/interview.js` - Interviews (19 actions, most complex)
  6. `stores/study.js` - Study CRUD (6 actions, simplest)
  7. `stores/auth.js` - Feathers authentication (special case)

**Persistence:** Only auth store (using SecureLS)

### Dynamic Imports to Convert
- **68 total dynamic imports**
  - 27 route components
  - 24 async components (defineAsyncComponent)
  - 14 Quasar boot files (handled by Vite plugin)
  - 3 runtime i18n imports

---

## Critical Decisions Made

### Decision 1: Use Feathers-Pinia
**File:** `plans/feathersvuex-migration.md`

- **Choice:** Official Feathers-Pinia library (NOT custom implementation)
- **Why:** Actively maintained, Vue 3 native, official successor
- **Impact:** 27+ components using AuthMixin need migration
- **Pattern:** Convert AuthMixin → `useAuth()` composable

### Decision 2: All Static Imports
**File:** `plans/static-import-strategy.md`

- **Choice:** Convert ALL dynamic imports to static
- **Why:** Required for Vite compatibility, no exceptions
- **Mitigation:** Manual chunking with `manualChunks` config
- **Pattern:** `() => import()` → `import Component from 'path'`

### Decision 3: Setup Syntax Everywhere
**File:** `plans/component-setup-syntax.md`

- **Choice:** All 73 components use `<script setup>`
- **Why:** Aligns with Vue 3 best practices, simpler code
- **Patterns:** 12 documented conversion patterns
- **Key pattern:** `data() → ref()`, `computed → computed()`, `methods → functions`

### Decision 4: Pinia with Setup Syntax
**File:** `plans/pinia-architecture.md`

- **Choice:** All stores use setup syntax (not options)
- **Why:** Consistency with components, cleaner code
- **Pattern:** `defineStore('name', () => { ... })` with refs and computed
- **Persistence:** Auth only (no vuex-persistedstate migration)

---

## Implementation Patterns - Quick Reference

### Pattern: Vuex Module → Pinia Store (Setup)

**Before (Vuex):**
```javascript
// state.js
export default {
  items: [],
  loading: false
}

// getters.js
export const itemCount = (state) => state.items.length

// actions.js
export const fetchItems = async ({ commit }) => {
  const data = await api.get('/items')
  commit('SET_ITEMS', data)
}

// mutations.js
export const SET_ITEMS = (state, items) => {
  state.items = items
}
```

**After (Pinia with setup):**
```javascript
// stores/items.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useItemsStore = defineStore('items', () => {
  // State
  const items = ref([])
  const loading = ref(false)
  
  // Getters
  const itemCount = computed(() => items.value.length)
  
  // Actions (merged with mutations)
  const fetchItems = async () => {
    const data = await api.get('/items')
    items.value = data
  }
  
  return { items, loading, itemCount, fetchItems }
})
```

### Pattern: Options API Component → Setup Syntax

**Before (Options API):**
```vue
<template>
  <div>{{ message }}</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return { message: 'Hello' }
  },
  computed: {
    ...mapState('items', ['items']),
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    ...mapActions('items', ['fetchItems']),
    handleClick() {
      this.$router.push('/home')
    }
  },
  mounted() {
    this.fetchItems()
  }
}
</script>
```

**After (Setup Syntax):**
```vue
<template>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useItemsStore } from 'stores/items'

const message = ref('Hello')
const router = useRouter()
const itemsStore = useItemsStore()

const doubleCount = computed(() => count.value * 2)

const handleClick = () => {
  router.push('/home')
}

onMounted(() => {
  itemsStore.fetchItems()
})
</script>
```

### Pattern: Dynamic Import → Static Import

**Before (Route lazy loading):**
```javascript
const routes = [
  {
    path: '/admin',
    component: () => import('pages/Admin.vue')
  }
]
```

**After (Static import):**
```javascript
import Admin from 'pages/Admin.vue'

const routes = [
  {
    path: '/admin',
    component: Admin
  }
]
```

---

## Common Gotchas (Read This!)

### Gotcha 1: Forgetting `.value` in scripts
```javascript
// ❌ WRONG
const count = ref(0)
count++ // Won't work!

// ✅ CORRECT
const count = ref(0)
count.value++
```

### Gotcha 2: Using `.value` in templates
```vue
<!-- ❌ WRONG -->
<template>
  <div>{{ count.value }}</div>
</template>

<!-- ✅ CORRECT -->
<template>
  <div>{{ count }}</div>
</template>
```

### Gotcha 3: Store destructuring loses reactivity
```javascript
// ❌ WRONG - loses reactivity
const { items, loading } = useItemsStore()

// ✅ CORRECT - use toRefs
import { toRefs } from 'vue'
const { items, loading } = toRefs(useItemsStore())

// ✅ ALSO CORRECT - don't destructure
const itemsStore = useItemsStore()
// Use itemsStore.items, itemsStore.loading
```

### Gotcha 4: No `this` in setup
```javascript
// ❌ WRONG
<script setup>
const handleClick = () => {
  this.$router.push('/') // this is undefined!
}
</script>

// ✅ CORRECT
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const handleClick = () => {
  router.push('/')
}
</script>
```

---

## File Locations (Current Codebase)

### Vuex Stores (OLD - to be replaced)
```
src/store/
├── index.js              # Main store setup
├── store.auth.js         # FeathersVuex auth plugin
├── account/
│   ├── state.js
│   ├── getters.js
│   ├── actions.js
│   └── mutations.js
├── admin/               # Same structure
├── caseReport/          # Same structure
├── form/                # Same structure
├── interview/           # Same structure
└── study/               # Same structure
```

### Pinia Stores (NEW - to be created)
```
src/stores/
├── account.js           # Single file per store
├── admin.js
├── caseReport.js
├── form.js
├── interview.js
├── study.js
└── auth.js              # Feathers-Pinia integration
```

### Components
```
src/
├── App.vue
├── layouts/
│   ├── MainLayout.vue
│   └── StudyLayout.vue
├── pages/               # 28 page components
│   ├── Login.vue
│   ├── Dashboard.vue
│   ├── Studies.vue
│   └── ...
└── components/          # 42 components
    ├── forms/           # 29 form components
    ├── interviews/      # 6 interview components
    ├── charts/          # 6 chart components
    └── ...
```

### Boot Files (to be migrated)
```
src/boot/
├── axios.js             # Update LoadingBar, env vars
├── feathersClient.js    # Update for Feathers-Pinia
├── i18n.js              # Update language pack imports
├── vuelidate.js         # Update for setup syntax
├── auth.js              # Remove Vuex, add Pinia
└── ... (10 total)
```

---

## Phase 2 Task Checklist (What to Implement Next)

**Location:** See `plans/phase2-kickoff-checklist.md` for full details

### ⚠️ CRITICAL: Before Starting Phase 2

**BLOCKER:** Verify extension compatibility
- [ ] Check `@obiba/quasar-app-extension-amber` v1.2.0 exists
- [ ] Check qcalendar, qmarkdown, qhierarchy v3 compatibility
- [ ] Document fallback plans if not available

### Phase 2 Tasks (in order)

1. **Dependencies Update**
   - Upgrade Quasar 2.14.3 → 3.x
   - Install @quasar/app-vite (replace app-webpack)
   - Upgrade extensions to v3
   - Install Pinia, remove Vuex

2. **Vite Configuration**
   - Create `quasar.config.js` (Vite format)
   - Convert webpack config to Vite equivalents
   - Configure manual chunking
   - Set up environment variables (import.meta.env)

3. **Static Import Conversion**
   - Convert all 68 dynamic imports to static
   - Update `src/router/routes.js`
   - Update async components

4. **Boot Files Migration**
   - Update all 10 boot files for Vite
   - Remove Vuex initialization
   - Add Pinia initialization

5. **Testing & Validation**
   - Dev build works
   - Production build works
   - All pages load
   - No console errors

---

## Testing Strategy

**Location:** See each planning document for detailed testing approaches

### Per-Task Testing

**After converting each component:**
- [ ] Component renders without errors
- [ ] Props work correctly
- [ ] Events emit correctly
- [ ] Computed properties update
- [ ] Lifecycle hooks execute
- [ ] Navigation works

**After converting each store:**
- [ ] Store initializes correctly
- [ ] State is reactive
- [ ] Actions execute
- [ ] Getters compute correctly
- [ ] Persistence works (auth only)

**After each phase:**
- [ ] Full regression test
- [ ] Critical user paths work
- [ ] No console errors/warnings
- [ ] Build completes successfully

---

## Success Criteria (When Are We Done?)

### Phase 2 Success (Quasar 3 + Vite Setup)
- ✅ Project builds with Vite (dev & prod)
- ✅ All extensions work
- ✅ All pages load
- ✅ No dynamic imports remain
- ✅ Build time < 2min dev, < 5min prod

### Phase 3 Success (Pinia Migration)
- ✅ All 7 stores migrated
- ✅ Auth works (login, logout, session)
- ✅ State persistence works (auth only)
- ✅ All components can access stores
- ✅ Vuex completely removed

### Phase 4 Success (Component Conversion)
- ✅ All 73 components use `<script setup>`
- ✅ No Options API remains
- ✅ AuthMixin converted to composable
- ✅ All tests pass
- ✅ No functionality regressions

---

## Rollback Plan

**If migration fails at any phase:**

1. **Revert to tagged commit:**
   ```bash
   git reset --hard phase1-planning-complete-20260531
   ```

2. **Rebuild with old config:**
   ```bash
   rm -rf node_modules .quasar dist
   yarn install
   quasar dev
   ```

3. **Test old build works:**
   - All pages load
   - Login works
   - Data fetches correctly

**Rollback trigger:** Any critical bug blocking users for > 4 hours

---

## Where to Ask Questions During Implementation

### If stuck on Quasar 3:
- Reference: `plans/migration-strategy.md` (lines 42-178)
- Official: https://quasar.dev/start/upgrade-guide

### If stuck on Vite:
- Reference: `plans/migration-strategy.md` (lines 180-375)
- Official: https://vitejs.dev/guide/

### If stuck on Pinia:
- Reference: `plans/pinia-architecture.md`
- Official: https://pinia.vuejs.org/

### If stuck on Feathers-Pinia:
- Reference: `plans/feathersvuex-migration.md`
- Official: https://feathers-pinia.pages.dev/

### If stuck on setup syntax:
- Reference: `plans/component-setup-syntax.md`
- Official: https://vuejs.org/api/sfc-script-setup.html

### If stuck on static imports:
- Reference: `plans/static-import-strategy.md`
- Manual chunking example: lines 1094-1139

---

## Summary: What You Need to Know

1. **All planning is done** - 6,415 lines across 7 documents
2. **All decisions are made** - Feathers-Pinia, static imports, setup syntax, manual chunking
3. **All patterns are documented** - 12 component patterns, store patterns, import patterns
4. **All files are analyzed** - 73 components, 7 stores, 68 imports, 10 boot files
5. **All risks are identified** - With mitigation strategies
6. **Critical blocker:** Verify extension compatibility before Phase 2

**Next:** Read `plans/phase2-kickoff-checklist.md` and begin Phase 2 implementation

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-31  
**Status:** Ready for Phase 2 implementation  
**Estimated Implementation Time:** 6-8 weeks (all phases)
