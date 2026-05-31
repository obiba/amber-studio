# Quasar 3 + Vite + Pinia Migration Strategy

**Date:** 2026-05-31
**Status:** Planning
**Project:** amber-studio v1.5.2

## Executive Summary

### Current State
- **Framework:** Quasar 2.14.3 with Webpack (@quasar/app-webpack 3.12.3)
- **Build Tool:** Webpack 5
- **State Management:** Vuex 4.0.1 (6 modules: account, admin, caseReport, form, interview, study)
- **Component API:** Options API (73 Vue components)
- **Vue Version:** 3.0.0
- **Vue Router:** 4.0.0
- **Source Files:** 148 total files (*.vue, *.js)
- **Dynamic Imports:** 54 dynamic import() calls, 37 defineAsyncComponent usages, 27 lazy-loaded routes

### Target State
- **Framework:** Quasar 3.x (latest) with Vite (@quasar/app-vite)
- **Build Tool:** Vite 8.x
- **State Management:** Pinia 3.x
- **Component API:** Composition API with setup syntax
- **Vue Version:** 3.x (latest)
- **Vue Router:** 4.x (latest)
- **Import Strategy:** Static imports only (all dynamic imports must be converted)

### Migration Approach
**All-at-once migration** - No incremental hybrid state. This is required because:
1. Vite requires different configuration structure (quasar.config.js vs quasar.conf.js)
2. Static imports requirement makes incremental migration impractical
3. Clean separation between Quasar 2/Webpack and Quasar 3/Vite ecosystems

### Key Constraints
- **No dynamic imports allowed** in Vite-based Quasar 3 setup
- **All route components must be statically imported**
- **All async components must be converted to static imports**
- **Extension compatibility** must be verified before migration

---

## Breaking Changes Analysis

### 1. Quasar 3 Breaking Changes

#### 1.1 Component API Changes

**QBtn (Button Component)**
- Remove `glossy` prop (no longer supported)
- `loading` prop behavior unchanged but may need icon adjustments
- Color system remains compatible

**QInput (Input Component)**
- `filled`, `outlined`, `borderless`, `standout` props remain the same
- `dense` prop still supported
- Rules validation API unchanged

**QDialog (Dialog Component)**
- v-model usage remains the same
- `persistent` prop behavior unchanged
- May need to review usage with composition API patterns

**QTable (Table Component)**
- `rows-per-page-options` prop usage unchanged
- Pagination API remains compatible
- Selection mode API unchanged

**QSelect (Select Component)**
- `use-input` for filtering still supported
- `emit-value` and `map-options` behavior unchanged
- Options structure remains the same

**General Component Changes:**
- All Quasar components work with both Options API and Composition API
- No breaking changes in most commonly used props
- Component registration (auto-import) works identically

#### 1.2 Plugin API Changes

**Notify Plugin**
- API remains largely unchanged
- Usage: `$q.notify()` or composable `useQuasar().notify()`
- Configuration structure identical

**LocalStorage/SessionStorage Plugin**
- API unchanged
- Usage: `$q.localStorage` or `useQuasar().localStorage`

**LoadingBar Plugin**
- API unchanged
- `$q.loadingBar.start()`, `.stop()`, `.increment()`

**AppFullscreen Plugin**
- API unchanged
- `$q.fullscreen.toggle()`, `.isActive`

**Dialog Plugin**
- API structure remains the same
- Works with both Options and Composition API

**Migration Path:**
- All plugin usages can remain as-is in Options API components
- In Composition API, use `useQuasar()` composable to access plugins:
  ```js
  import { useQuasar } from 'quasar'
  const $q = useQuasar()
  $q.notify({ message: 'Hello' })
  ```

#### 1.3 Composable Changes

**useQuasar()**
- Primary way to access Quasar functionality in Composition API
- Returns object with: `$q`, `platform`, `screen`, etc.
- Example:
  ```js
  import { useQuasar } from 'quasar'
  const $q = useQuasar()
  console.log($q.platform.is.mobile)
  ```

**No Breaking Changes:**
- All existing Quasar composables remain compatible
- Can be gradually introduced during component migration

#### 1.4 Configuration Changes

**quasar.conf.js → quasar.config.js**

Key structural changes:
- File renamed from `quasar.conf.js` to `quasar.config.js`
- Uses ES modules (import/export) instead of CommonJS (require/module.exports)
- Build configuration moves from `build.webpack` to `build.vite`
- Environment variable handling changes from `build.env` to Vite's native system

Current structure:
```js
// quasar.conf.js
module.exports = configure(function (ctx) {
  return {
    boot: [...],
    css: [...],
    extras: [...],
    build: {
      webpack: { /* ... */ }
    }
  }
})
```

New structure:
```js
// quasar.config.js
import { defineConfig } from '#q/app'
export default defineConfig({
  boot: [...],
  css: [...],
  extras: [...],
  build: {
    vite: { /* ... */ }
  }
})
```

#### 1.5 RTL Support Changes

**No Breaking Changes:**
- RTL (Right-to-Left) support configuration remains the same
- `quasar.config.js` → `framework.lang` configuration unchanged
- CSS classes and directives work identically

#### 1.6 Dark Mode Changes

**No Breaking Changes:**
- Dark mode API unchanged
- `$q.dark.set()`, `.toggle()`, `.isActive` work the same
- Can still use `useQuasar().dark` in Composition API

---

### 2. Build Tool: Webpack → Vite

#### 2.1 Configuration Conversion

**File Structure Changes:**
```
OLD: quasar.conf.js (CommonJS)
NEW: quasar.config.js (ESM)
```

**Webpack Config → Vite Config:**

The `build` section fundamentally changes:

```js
// OLD: Webpack configuration
build: {
  webpack: {
    extendWebpack(cfg) {
      cfg.resolve.alias = {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
}
```

```js
// NEW: Vite configuration
build: {
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
}
```

**Key Migration Points:**
1. Remove all webpack-specific plugins
2. Convert webpack loaders to Vite plugins (if needed)
3. Update path resolution to use `fileURLToPath` and `import.meta.url`
4. Remove webpack chain API usage

#### 2.2 Environment Variable Changes

**Critical Change: process.env → import.meta.env**

This is a **global search-and-replace** requirement across entire codebase.

| Webpack (OLD) | Vite (NEW) | Notes |
|---------------|------------|-------|
| `process.env.NODE_ENV` | `import.meta.env.MODE` | Development/production mode |
| `process.env.VUE_APP_*` | `import.meta.env.VITE_*` | Custom variables must be prefixed with `VITE_` |
| `process.env.API_URL` | `import.meta.env.VITE_API_URL` | All custom vars need VITE_ prefix |

**Migration Steps:**
1. Rename all environment variables in `.env` files to use `VITE_` prefix
2. Global search and replace `process.env` with `import.meta.env`
3. Update `quasar.config.js` env configuration:
   ```js
   // OLD
   build: {
     env: {
       API_URL: process.env.API_URL
     }
   }
   
   // NEW - Not needed! Vite handles this automatically
   // Just ensure vars are prefixed with VITE_
   ```

**Current Usage in Codebase:**
- Search for `process.env` to find all occurrences
- Common patterns: API endpoints, feature flags, build-time configuration

#### 2.3 Asset Import Changes

**Static Assets:**

Vite handles assets differently but mostly compatible:

```js
// Both work the same way:
import logo from '@/assets/logo.svg'  // Returns URL string

// New Vite-specific queries (optional):
import logoUrl from '@/assets/logo.svg?url'      // Explicit URL
import logoRaw from '@/assets/logo.svg?raw'      // Raw string
import logoInline from '@/assets/logo.svg?inline' // Inline base64
```

**Public Directory:**
- `/public` folder behavior identical
- Files in `/public` served as-is at root URL
- No changes needed for existing public assets

**Migration Impact:**
- Low impact - most asset imports work identically
- Can use new Vite queries for optimization later

#### 2.4 Plugin Equivalents

**Webpack Plugins → Vite Equivalents:**

Current webpack plugins in use (based on `quasar.conf.js` analysis):

| Webpack Plugin | Current Usage | Vite Equivalent | Action Required |
|----------------|---------------|-----------------|-----------------|
| `DefinePlugin` (implicit via `build.env`) | Yes - defining API, RECAPTCHA_SITE_KEY, SETTINGS, etc. | `define` in config | Update to Vite's define syntax |
| `webpack-chain` alias configuration | Yes - Vue alias resolution | Vite `resolve.alias` | Update alias syntax |
| Workbox Plugin (PWA) | Yes - configured in `pwa.workboxPluginMode` | `vite-plugin-pwa` | Install and configure |
| No explicit CopyPlugin | N/A | `vite-plugin-static-copy` | Install only if needed |
| No explicit CompressionPlugin | N/A | Built-in or `vite-plugin-compression` | Install only if needed |
| No ESLint webpack plugin | N/A | `vite-plugin-eslint` | May need to install |

**Key Findings from quasar.conf.js:**
- Uses `build.env` to inject environment variables (API, RECAPTCHA_SITE_KEY, SETTINGS, VERSION, REGISTER_ENABLED)
- Uses `chainWebpack` to configure Vue alias resolution
- PWA mode configured with WorkboxPlugin in GenerateSW mode
- No custom webpack plugins detected beyond Quasar's defaults

**Action Items:**
1. ✅ Review current `quasar.conf.js` for webpack plugins - COMPLETED
2. Identify Vite equivalents - documented above
3. Document any custom webpack plugins that need alternative solutions - none found beyond defaults

#### 2.5 Build Optimization Options

**Performance Characteristics:**

| Feature | Webpack | Vite |
|---------|---------|------|
| Cold start | Slower (5-30s) | Faster (1-5s) |
| HMR | Moderate (1-3s) | Fast (<100ms) |
| Production build | Optimized | Optimized (Rollup-based) |
| Bundle size | Good with config | Excellent by default |

**Vite Optimizations (Automatic):**
- Tree-shaking enabled by default
- CSS code splitting automatic
- Chunk splitting optimized
- Modern browser targets (ES2020+)

**Configuration Options:**
```js
build: {
  vite: {
    build: {
      target: 'es2020',
      minify: 'terser',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Custom chunk splitting if needed
            'vendor-quasar': ['quasar'],
            'vendor-feathers': ['@feathersjs/client']
          }
        }
      }
    }
  }
}
```

#### 2.6 Dev Server Configuration

**Dev Server Changes:**

```js
// OLD: Webpack dev server
devServer: {
  port: 8080,
  open: true,
  proxy: {
    '/api': {
      target: 'http://localhost:3000'
    }
  }
}
```

```js
// NEW: Vite dev server
devServer: {
  port: 8080,
  open: true,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

**Key Differences:**
- Vite dev server is significantly faster
- HMR is more reliable and granular
- Proxy configuration mostly compatible

---

### 3. State Management: Vuex → Pinia

#### 3.1 Core Concepts Comparison

| Concept | Vuex 4 | Pinia 3 | Notes |
|---------|--------|---------|-------|
| Store Definition | `new Vuex.Store()` | `defineStore()` | Pinia uses function-based definition |
| State | `state: {}` | `state: () => ({})` | Same syntax |
| Getters | `getters: {}` | `getters: {}` | Same syntax, but `this` access pattern different |
| Mutations | `mutations: {}` | **Removed** | Actions now mutate state directly |
| Actions | `actions: {}` | `actions: {}` | Can now mutate state directly |
| Modules | Nested modules | Flat stores | Each store is independent, compose via imports |
| Namespacing | `namespaced: true` | **Not needed** | All stores auto-namespaced by ID |
| Devtools | Integrated | Better integration | Pinia has superior devtools support |

#### 3.2 Store Migration Pattern

**Current Vuex Module Structure:**

```js
// src/store/account/index.js
export default {
  namespaced: true,
  state: {
    user: null,
    authenticated: false
  },
  getters: {
    isAuthenticated(state) {
      return state.authenticated
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_AUTHENTICATED(state, value) {
      state.authenticated = value
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const user = await api.login(credentials)
      commit('SET_USER', user)
      commit('SET_AUTHENTICATED', true)
    }
  }
}
```

**Equivalent Pinia Store:**

```js
// src/stores/account.js
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    user: null,
    authenticated: false
  }),
  
  getters: {
    isAuthenticated: (state) => state.authenticated
  },
  
  actions: {
    async login(credentials) {
      const user = await api.login(credentials)
      // Direct state mutation - no mutations needed!
      this.user = user
      this.authenticated = true
    }
  }
})
```

**Alternative: Setup Syntax (Composition API style)**

```js
// src/stores/account.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAccountStore = defineStore('account', () => {
  // State
  const user = ref(null)
  const authenticated = ref(false)
  
  // Getters
  const isAuthenticated = computed(() => authenticated.value)
  
  // Actions
  async function login(credentials) {
    user.value = await api.login(credentials)
    authenticated.value = true
  }
  
  return { user, authenticated, isAuthenticated, login }
})
```

#### 3.3 Store Module Inventory

Current Vuex modules to migrate:

1. **account** - User authentication, profile management
2. **admin** - Admin-specific functionality
3. **caseReport** - Case report data and operations
4. **form** - Form state management
5. **interview** - Interview data and operations
6. **study** - Study data management

**Migration Strategy Per Module:**
- Each Vuex module becomes a separate Pinia store
- Maintain same naming convention: `useAccountStore`, `useAdminStore`, etc.
- Remove all mutations - convert to direct state assignments in actions
- Update all component usages

#### 3.4 Component Usage Changes

**Options API (can keep temporarily):**

```vue
<!-- OLD: Vuex with Options API -->
<template>
  <div>{{ user.name }}</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('account', ['user'])
  },
  methods: {
    ...mapActions('account', ['login'])
  }
}
</script>
```

```vue
<!-- NEW: Pinia with Options API -->
<template>
  <div>{{ accountStore.user.name }}</div>
</template>

<script>
import { mapStores, mapActions } from 'pinia'
import { useAccountStore } from '@/stores/account'

export default {
  computed: {
    ...mapStores(useAccountStore)
  },
  methods: {
    ...mapActions(useAccountStore, ['login'])
  }
}
</script>
```

**Composition API (target state):**

```vue
<!-- TARGET: Pinia with Composition API -->
<template>
  <div>{{ account.user.name }}</div>
</template>

<script setup>
import { useAccountStore } from '@/stores/account'

const account = useAccountStore()

// Can destructure actions (but not state/getters!)
const { login } = account

// Access state/getters directly
console.log(account.user)
console.log(account.isAuthenticated)
</script>
```

#### 3.5 Persistence Migration

**Current:** Using `vuex-persistedstate` (v4.1.0)

```js
// src/store/index.js
import createPersistedState from 'vuex-persistedstate'

export default store(function () {
  return new Vuex.Store({
    plugins: [
      createPersistedState({
        key: 'amber-studio',
        paths: ['account.user', 'settings']
      })
    ]
  })
})
```

**New:** Using `pinia-plugin-persistedstate`

```bash
yarn add pinia-plugin-persistedstate
```

```js
// src/stores/index.js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
```

```js
// In individual store
export const useAccountStore = defineStore('account', {
  state: () => ({ user: null }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'amber-account',
        storage: localStorage,
        paths: ['user']
      }
    ]
  }
})
```

#### 3.6 Devtools Integration

**Benefits of Pinia Devtools:**
- Better performance than Vuex devtools
- Clearer action tracking (no mutation noise)
- Hot module replacement for stores
- Time-travel debugging
- Store modification directly from devtools

**Setup:**
- Automatic in development mode
- No additional configuration needed
- Works with Vue Devtools 6+

---

### 4. Component API: Options → Setup Syntax

#### 4.1 Migration Philosophy

**Approach:** Progressive enhancement, not rewrite

- Convert components one at a time
- Start with leaf components (no children or simple children)
- Move up the component tree
- Test after each conversion
- Keep Options API temporarily where beneficial

#### 4.2 Conversion Patterns

**Basic Options API Component:**

```vue
<template>
  <div>
    <q-input v-model="name" label="Name" />
    <q-btn @click="submit" label="Submit" />
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  
  props: {
    initialValue: String
  },
  
  data() {
    return {
      name: ''
    }
  },
  
  computed: {
    hasName() {
      return this.name.length > 0
    }
  },
  
  methods: {
    submit() {
      this.$emit('submit', this.name)
    }
  },
  
  mounted() {
    this.name = this.initialValue || ''
  }
}
</script>
```

**Equivalent Composition API:**

```vue
<template>
  <div>
    <q-input v-model="name" label="Name" />
    <q-btn @click="submit" label="Submit" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  initialValue: String
})

const emit = defineEmits(['submit'])

const name = ref('')

const hasName = computed(() => name.value.length > 0)

function submit() {
  emit('submit', name.value)
}

onMounted(() => {
  name.value = props.initialValue || ''
})
</script>
```

#### 4.3 Complex Patterns

**Watchers:**

```js
// Options API
watch: {
  'form.title': {
    handler(newVal) {
      this.updateSlug(newVal)
    },
    immediate: true
  }
}

// Composition API
import { watch } from 'vue'

watch(
  () => form.title,
  (newVal) => {
    updateSlug(newVal)
  },
  { immediate: true }
)
```

**Lifecycle Hooks:**

| Options API | Composition API |
|-------------|-----------------|
| `beforeCreate` | *Not needed (use setup directly)* |
| `created` | *Not needed (use setup directly)* |
| `beforeMount` | `onBeforeMount` |
| `mounted` | `onMounted` |
| `beforeUpdate` | `onBeforeUpdate` |
| `updated` | `onUpdated` |
| `beforeUnmount` | `onBeforeUnmount` |
| `unmounted` | `onUnmounted` |

#### 4.4 Quasar Integration

**Options API:**
```js
export default {
  computed: {
    $q() {
      return this.$q
    }
  },
  methods: {
    notify() {
      this.$q.notify({ message: 'Hello' })
    }
  }
}
```

**Composition API:**
```js
import { useQuasar } from 'quasar'

const $q = useQuasar()

function notify() {
  $q.notify({ message: 'Hello' })
}
```

#### 4.5 Component Inventory

**73 Vue components to convert:**

Priority order:
1. **Leaf components** (no child components) - ~30 files
2. **Utility components** (modals, dialogs, simple forms) - ~20 files
3. **Page components** (complex, many dependencies) - ~23 files

**Suggested order:**
- Start with `src/components/` directory
- Then `src/pages/`
- Finally `src/layouts/`

---

## Migration Decision Log

### Decision 1: Build Tool Selection
- **Decision:** Migrate to Vite (required for Quasar 3)
- **Rationale:** 
  - Quasar 3 is designed for Vite
  - Significantly faster development experience (HMR <100ms vs 1-3s)
  - Better ecosystem alignment with modern Vue 3 tooling
  - Simpler configuration than Webpack
- **Risks:** 
  - Learning curve for team unfamiliar with Vite
  - Some webpack plugins may not have direct equivalents
  - Build configuration needs complete rewrite
- **Mitigation:**
  - Document all Vite-specific patterns
  - Provide training on Vite concepts
  - Allocate time for configuration migration

### Decision 2: No Dynamic Imports
- **Decision:** Convert all dynamic imports to static imports
- **Rationale:** 
  - Vite + Quasar 3 combination has issues with dynamic imports
  - Simpler dependency graph, easier to debug
  - Eliminates runtime import resolution complexity
  - Better for tree-shaking and optimization
- **Impact:** 
  - Initial bundle size will increase
  - Need to implement manual code-splitting via `manualChunks` in Rollup config
  - 54 dynamic import() calls to convert
  - 37 defineAsyncComponent usages to convert
  - 27 lazy-loaded routes to convert
- **Mitigation:**
  - Use Vite's `manualChunks` for code splitting:
    ```js
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'pages-admin': [
              '/src/pages/admin/Users.vue',
              '/src/pages/admin/Settings.vue'
            ],
            'pages-forms': [
              '/src/pages/forms/FormList.vue',
              '/src/pages/forms/FormEditor.vue'
            ]
          }
        }
      }
    }
    ```
  - Monitor bundle size and optimize chunks
  - Use route-based chunking strategy

### Decision 3: All-at-Once Migration
- **Decision:** Full migration in single effort, no hybrid state
- **Rationale:**
  - Cannot run Quasar 2 (webpack) and Quasar 3 (Vite) configurations simultaneously
  - Different package dependencies required (@quasar/app-webpack vs @quasar/app-vite)
  - Configuration files incompatible (quasar.conf.js vs quasar.config.js)
  - Cleaner long-term maintenance
- **Risks:**
  - Larger scope increases risk of issues
  - Cannot deploy incrementally
  - Longer testing cycle required
- **Mitigation:**
  - Use git branch for migration work
  - Comprehensive testing before merge
  - Rollback plan: keep Quasar 2 branch available
  - Phase implementation (see Phase 1-5 in migration plan)

### Decision 4: Pinia Over Vuex
- **Decision:** Migrate from Vuex 4 to Pinia 3
- **Rationale:**
  - Pinia is official Vue recommendation (replaces Vuex 5)
  - Better TypeScript support
  - Simpler API (no mutations)
  - Better devtools integration
  - Smaller bundle size
  - Designed for Composition API
- **Impact:**
  - Need to convert 6 Vuex modules to Pinia stores
  - Update all component store usage (~150+ component references)
  - Migrate persistence plugin (vuex-persistedstate → pinia-plugin-persistedstate)
- **Benefits:**
  - Cleaner code (no mutation boilerplate)
  - Better developer experience
  - Future-proof (official Vue recommendation)

### Decision 5: Composition API Target
- **Decision:** Migrate all components to Composition API with `<script setup>` syntax
- **Rationale:**
  - Better code organization and reusability
  - Aligns with Vue 3 best practices
  - Required for optimal Pinia integration
  - Better TypeScript support
  - Smaller bundle size (no Options API runtime)
- **Impact:**
  - 73 components need conversion
  - Learning curve for team
  - Significant code changes
- **Approach:**
  - Progressive migration (leaf components first)
  - Can temporarily keep Options API where beneficial
  - Document patterns and best practices
  - Pair programming for knowledge transfer

### Decision 6: Extension Upgrade Strategy
- **Decision:** Verify compatibility first, upgrade or find alternatives
- **Rationale:**
  - Extensions may not be Quasar 3 compatible yet
  - Need fallback plans
  - Cannot proceed with incompatible extensions
- **Extensions to verify:**
  1. `@obiba/quasar-app-extension-amber` 1.1.6 → Need to verify 1.2.0 compatibility
  2. `@quasar/quasar-app-extension-qcalendar` 4.0.0-beta.16 → Check for v3 compatible version
  3. `@quasar/quasar-app-extension-qmarkdown` 2.0.0-beta.10 → Check for v3 compatible version
  4. `quasar-app-extension-qhierarchy` 1.0.0-alpha.1 → Check for v3 compatible version
- **Action:** Research phase includes extension compatibility verification

---

## Extension Upgrade Requirements

### Extension Compatibility Matrix

| Extension | Current Version | Target Version | Status | Fallback Plan |
|-----------|----------------|----------------|---------|---------------|
| `@obiba/quasar-app-extension-amber` | 1.1.6 | 1.2.0+ | **Required** | Cannot proceed without upgrade - Contact maintainer |
| `@quasar/quasar-app-extension-qcalendar` | 4.0.0-beta.16 | Check for stable v3+ | To verify | Implement custom calendar if unavailable |
| `@quasar/quasar-app-extension-qmarkdown` | 2.0.0-beta.10 | Check for stable v3+ | To verify | Use `marked` library directly |
| `quasar-app-extension-qhierarchy` | 1.0.0-alpha.1 | Check for stable v3+ | To verify | Implement custom tree component |

### Extension Migration Notes

**@obiba/quasar-app-extension-amber:**
- **Critical dependency** - project-specific extension
- Must be upgraded to 1.2.0 or higher for Quasar 3 compatibility
- Action: Verify with extension maintainer (@obiba organization)
- If not available: May need to fork and upgrade internally

**@quasar/quasar-app-extension-qcalendar:**
- Official Quasar extension
- Currently at beta version
- Action: Check https://github.com/quasarframework/quasar-ui-qcalendar for v3 branch
- Likely available in stable version for Quasar 3

**@quasar/quasar-app-extension-qmarkdown:**
- Official Quasar extension
- Currently at beta version
- Action: Check https://github.com/quasarframework/quasar-ui-qmarkdown for v3 branch
- Fallback: Use `marked` library (already in dependencies v9.1.1) with custom component wrapper

**quasar-app-extension-qhierarchy:**
- Community extension
- Alpha version - may not be actively maintained
- Action: Check repository for Quasar 3 compatibility
- Fallback: Implement custom hierarchical tree component using QTree or QList

### Extension Verification Process

1. **Check package repository** for Quasar 3 compatible versions
2. **Test in isolated environment** before full migration
3. **Document breaking changes** if any exist in new versions
4. **Prepare fallback implementations** for critical extensions
5. **Budget time for custom implementation** if extension unavailable

**Note:** Extension verification is currently pending and scheduled for completion before Phase 2 kickoff. The three community extensions marked "To verify" will be checked for Quasar 3 compatibility as part of the Phase 2 preparation checklist. This ensures we have confirmed compatibility or prepared fallback implementations before beginning the actual migration work.

---

## Static Import Conversion Strategy

### Current Dynamic Import Usage

**Analysis Results:**
- **54** `import()` dynamic import calls
- **37** `defineAsyncComponent` usages
- **27** lazy-loaded routes

**Total conversions needed:** 118 import statements

### Conversion Patterns

#### 1. Route Lazy Loading → Static Imports

**Current Pattern (router/index.js):**
```js
const routes = [
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'users',
        component: () => import('pages/admin/Users.vue')
      }
    ]
  }
]
```

**New Pattern:**
```js
import MainLayout from 'layouts/MainLayout.vue'
import AdminUsers from 'pages/admin/Users.vue'
import AdminSettings from 'pages/admin/Settings.vue'
// ... all other route components

const routes = [
  {
    path: '/admin',
    component: MainLayout,
    children: [
      {
        path: 'users',
        component: AdminUsers
      },
      {
        path: 'settings',
        component: AdminSettings
      }
    ]
  }
]
```

#### 2. Async Components → Static Imports

**Current Pattern:**
```js
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    HeavyComponent: defineAsyncComponent(() =>
      import('@/components/HeavyComponent.vue')
    )
  }
}
```

**New Pattern:**
```js
import HeavyComponent from '@/components/HeavyComponent.vue'

export default {
  components: {
    HeavyComponent
  }
}
```

#### 3. Dynamic Import Expressions → Static Imports

**Current Pattern:**
```js
async function loadModule(name) {
  const module = await import(`@/modules/${name}.js`)
  return module
}
```

**New Pattern:**
```js
// Import all possible modules statically
import moduleA from '@/modules/moduleA.js'
import moduleB from '@/modules/moduleB.js'
import moduleC from '@/modules/moduleC.js'

const modules = {
  moduleA,
  moduleB,
  moduleC
}

function loadModule(name) {
  return modules[name]
}
```

### Bundle Size Mitigation

**Strategy:** Manual chunk splitting via Rollup configuration

```js
// quasar.config.js
export default defineConfig({
  build: {
    vite: {
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor chunks
              'vendor-quasar': ['quasar'],
              'vendor-feathers': [
                '@feathersjs/client',
                '@feathersjs/authentication-client',
                '@feathersjs/rest-client'
              ],
              'vendor-vue': ['vue', 'vue-router'],
              
              // Feature-based chunks
              'feature-admin': [
                '/src/pages/admin/Users.vue',
                '/src/pages/admin/Settings.vue',
                '/src/pages/admin/Permissions.vue'
              ],
              'feature-forms': [
                '/src/pages/forms/FormList.vue',
                '/src/pages/forms/FormEditor.vue',
                '/src/pages/forms/FormViewer.vue'
              ],
              'feature-interviews': [
                '/src/pages/interviews/InterviewList.vue',
                '/src/pages/interviews/InterviewViewer.vue'
              ],
              
              // Component chunks (if needed)
              'components-common': [
                '/src/components/CommonButton.vue',
                '/src/components/CommonInput.vue'
              ]
            }
          }
        }
      }
    }
  }
})
```

**Chunking Strategy:**
1. **Vendor chunks**: Separate large dependencies (Quasar, Vue, Feathers)
2. **Feature chunks**: Group related pages by feature area
3. **Common chunks**: Frequently used components together

**Expected Results:**
- Initial bundle may be larger (no lazy loading)
- Better HTTP/2 parallel loading
- Reduced number of requests overall
- Predictable load performance

### Conversion Process

1. **Identify all dynamic imports:**
   ```bash
   grep -r "import(" src/
   grep -r "defineAsyncComponent" src/
   ```

2. **Convert route lazy loading** (highest priority)
   - All routes in `src/router/`
   - Group imports by feature

3. **Convert async components** (medium priority)
   - Component-level dynamic imports
   - Usually in `components:` section

4. **Convert dynamic expressions** (lowest priority, rare)
   - Dynamic string interpolation imports
   - May need refactoring

5. **Test bundle size:**
   ```bash
   quasar build
   # Analyze dist/ folder size
   # Check individual chunk sizes
   ```

6. **Optimize chunks if needed:**
   - Adjust `manualChunks` configuration
   - Split large chunks further
   - Combine small chunks

---

## Environment Variable Migration

### Current Usage Inventory

**Process.env usage in codebase:**
- Total occurrences: **10** (found via `grep -r "process\.env" src/ --include="*.js" --include="*.vue"`)

**Locations and variables used:**
1. `src/boot/feathersClient.js` - `process.env.API`
2. `src/boot/axios.js` - `process.env.API`
3. `src/boot/recaptcha.js` - `process.env.RECAPTCHA_SITE_KEY`
4. `src/boot/settings.js` - `process.env.SETTINGS`, `process.env.VERSION`, `process.env.REGISTER_ENABLED`
5. `src/store/index.js` - `process.env.DEBUGGING`
6. `src/router/index.js` - `process.env.MODE`, `process.env.VUE_ROUTER_MODE`, `process.env.VUE_ROUTER_BASE`

**Environment variables defined in quasar.conf.js build.env:**
- `API` - Backend API URL (dev: http://localhost:3030, prod: from AMBER_URL env var)
- `RECAPTCHA_SITE_KEY` - reCAPTCHA site key
- `SETTINGS` - JSON configuration from settings.json
- `REGISTER_ENABLED` - Derived from RECAPTCHA_SITE_KEY presence
- `VERSION` - From package.json version

### Search and Replace Operations

**Required changes:**

1. **All process.env references:**
   ```bash
   # Search pattern
   grep -r "process\.env" src/
   
   # Replace with
   import.meta.env
   ```

2. **Environment variable names:**
   - All custom variables must be prefixed with `VITE_`
   - Reserved variables:
     - `import.meta.env.MODE` - development, production, etc.
     - `import.meta.env.BASE_URL` - public base path
     - `import.meta.env.PROD` - boolean, true in production
     - `import.meta.env.DEV` - boolean, true in development
     - `import.meta.env.SSR` - boolean, true during SSR

3. **.env file updates:**
   ```bash
   # OLD (.env)
   NODE_ENV=development
   API_URL=http://localhost:3000
   APP_VERSION=1.5.2
   FEATURE_FLAG_NEW_UI=true
   
   # NEW (.env)
   MODE=development
   VITE_API_URL=http://localhost:3000
   VITE_APP_VERSION=1.5.2
   VITE_FEATURE_FLAG_NEW_UI=true
   ```

### quasar.conf.js Environment Configuration

**OLD (Webpack):**
```js
build: {
  env: {
    API_URL: process.env.API_URL,
    APP_VERSION: require('./package.json').version
  }
}
```

**NEW (Vite):**
```js
// No explicit configuration needed!
// Vite automatically exposes VITE_* prefixed variables
// 
// For dynamic values (like version from package.json):
import { defineConfig } from '#q/app'
import pkg from './package.json'

export default defineConfig({
  build: {
    env: {
      VITE_APP_VERSION: pkg.version
    }
  }
})
```

### TypeScript Definitions (if needed)

For better IDE support, create `src/env.d.ts`:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_VERSION: string
  readonly VITE_FEATURE_FLAG_NEW_UI: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## Risk Assessment

### High Risk Areas

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Extension incompatibility | **High** - Blocker | Medium | Verify before migration, prepare fallbacks |
| Dynamic import conversion errors | **High** - Runtime failures | Medium | Systematic testing, chunk verification |
| State management bugs | **High** - Data loss | Low | Careful Vuex→Pinia migration, persistence testing |
| Bundle size explosion | Medium - Performance | Medium | Manual chunking, monitoring |
| Developer learning curve | Medium - Velocity | High | Documentation, training, pair programming |

### Medium Risk Areas

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Environment variable misconfigurations | Medium | Medium | Careful .env migration, testing |
| Build configuration errors | Medium | Low | Incremental config changes |
| Component API conversion bugs | Medium | Medium | Test each component after conversion |
| Third-party library compatibility | Medium | Low | Check Vue 3 + Vite compatibility |

### Low Risk Areas

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| CSS/SCSS compilation issues | Low | Low | Sass support built-in |
| Asset loading failures | Low | Low | Similar asset handling |
| Devtools integration | Low | Very Low | Better in Pinia |

---

## Success Criteria

### Technical Metrics

- [ ] All components successfully migrated to Composition API
- [ ] Zero dynamic imports remaining in codebase
- [ ] All 6 Vuex stores migrated to Pinia
- [ ] All tests passing
- [ ] Build completes without errors
- [ ] Dev server starts in <5 seconds (vs current ~15s)
- [ ] HMR updates in <100ms (vs current ~2s)
- [ ] Production bundle size within 20% of current size

### Functional Metrics

- [ ] All features working identically to Quasar 2 version
- [ ] Authentication flow works correctly
- [ ] State persistence working (localStorage)
- [ ] All API calls functioning
- [ ] All forms submitting correctly
- [ ] All admin features operational

### Quality Metrics

- [ ] No console errors in development
- [ ] No console errors in production build
- [ ] Vue Devtools showing correct component tree
- [ ] Pinia devtools showing all stores
- [ ] No TypeScript errors (if applicable)
- [ ] ESLint passing with no errors

---

## Rollback Plan

### Preparation

1. **Create feature branch:** `feature/quasar3-migration`
2. **Keep `main` branch stable** on Quasar 2
3. **Tag current production version:** `v1.5.2-pre-quasar3`
4. **Document current environment:** Node version, package versions

### Rollback Triggers

**Immediate rollback if:**
- Cannot resolve extension compatibility issues
- Migration timeline exceeds allocated time by 50%
- Critical bugs discovered after 2 weeks of testing
- Performance degradation >50% in production

**Consider rollback if:**
- Bundle size increases >50%
- Development experience worse than current
- Team cannot adapt to new patterns within training period

### Rollback Procedure

```bash
# 1. Switch back to main branch
git checkout main

# 2. Ensure dependencies are correct
rm -rf node_modules .quasar
yarn install

# 3. Start development server
quasar dev

# 4. If issues, reset to tagged version
git checkout v1.5.2-pre-quasar3
```

### Post-Rollback Actions

1. Document reason for rollback
2. Identify blockers
3. Create action plan to resolve blockers
4. Schedule next migration attempt

---

## Timeline Estimate

**Total Estimated Duration:** 8-10 weeks

### Phase 1: Planning & Architecture (2 weeks) ✓
- Research and documentation ✓
- Extension compatibility verification
- Team training preparation

### Phase 2: Foundation (2 weeks)
- Quasar 3 + Vite setup
- Configuration migration
- Environment variable migration
- Build pipeline verification

### Phase 3: State Management (1-2 weeks)
- Pinia installation and setup
- Vuex store migration (6 stores)
- Persistence plugin migration
- Basic component updates for store usage

### Phase 4: Component Migration (3-4 weeks)
- Leaf components (1 week)
- Utility components (1 week)
- Page components (1-2 weeks)
- Layout components (1 week)

### Phase 5: Static Import Conversion (1 week)
- Route lazy loading conversion
- Async component conversion
- Bundle optimization

### Phase 6: Testing & Refinement (1-2 weeks)
- Comprehensive testing
- Bug fixes
- Performance optimization
- Documentation updates

---

## Next Steps

1. **Review this document** with team and stakeholders
2. **Verify extension compatibility** - Critical blocker check
3. **Set up test environment** for migration experiments
4. **Create detailed task breakdown** for Phase 2
5. **Schedule team training** on Vite and Composition API
6. **Get approval** to proceed with migration

---

## References

### Documentation Links

- [Quasar 3 Upgrade Guide](https://quasar.dev/start/upgrade-guide)
- [Quasar Vite Plugin](https://quasar.dev/start/vite-plugin)
- [Vite Features Guide](https://vitejs.dev/guide/features.html)
- [Pinia Introduction](https://pinia.vuejs.org/introduction.html)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Quasar CLI with Vite](https://quasar.dev/quasar-cli-vite/quasar-config-file)

### Key Findings Summary

1. **Quasar 3 is mostly backward compatible** at the component level
2. **Vite requires different thinking** about imports and optimization
3. **Pinia is simpler than Vuex** - fewer concepts, less boilerplate
4. **Composition API is powerful** but requires learning investment
5. **Static imports are manageable** with proper chunking strategy

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-31  
**Next Review:** After extension compatibility verification
