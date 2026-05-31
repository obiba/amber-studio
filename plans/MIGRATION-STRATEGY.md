# Quasar 2.19.3 + Vite Migration Strategy

**Project:** amber-studio v1.5.2  
**Date Created:** 2026-05-31  
**Status:** Planning Complete  
**Document Type:** Consolidated Migration Strategy  

**Consolidates:**
- Original migration-strategy.md (Quasar + Vite + Pinia strategy)
- Original static-import-strategy.md (Import conversion details)
- Original VERSION-CORRECTION.md (Version clarifications)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Version Strategy & Correction](#version-strategy--correction)
3. [Breaking Changes Analysis](#breaking-changes-analysis)
4. [Build Tool Migration: Webpack → Vite](#build-tool-migration-webpack--vite)
5. [Static Import Conversion Strategy](#static-import-conversion-strategy)
6. [Environment Variables Migration](#environment-variables-migration)
7. [Extension Compatibility](#extension-compatibility)
8. [Migration Decision Log](#migration-decision-log)
9. [Risk Assessment](#risk-assessment)
10. [Success Criteria](#success-criteria)
11. [Timeline & Next Steps](#timeline--next-steps)

---

## Executive Summary

### Current State
- **Framework:** Quasar 2.14.3 with Webpack (@quasar/app-webpack 3.12.3)
- **Build Tool:** Webpack 5
- **State Management:** Vuex 4.0.1 (6 modules: account, admin, caseReport, form, interview, study)
- **Component API:** Options API (73 Vue components)
- **Vue Version:** 3.0.0
- **Vue Router:** 4.0.0
- **Source Files:** 148 total files (*.vue, *.js)
- **Dynamic Imports:** 68 total occurrences (27 routes, 24 async components, 14 boot files, 3 i18n)

### Target State
- **Framework:** Quasar 2.19.3 (latest stable v2) with Vite (@quasar/app-vite 2.6.1)
- **Build Tool:** Vite 5.x (bundled with @quasar/app-vite 2.6.1)
- **State Management:** Pinia 2.x (latest) - see STATE-MANAGEMENT.md
- **Component API:** Composition API with setup syntax - see COMPONENT-MIGRATION.md
- **Vue Version:** 3.x (latest stable)
- **Vue Router:** 4.x (latest stable)
- **Import Strategy:** Static imports only (all 68 dynamic imports converted)

### Migration Approach
**All-at-once migration** - No incremental hybrid state. This is required because:
1. Vite requires different configuration structure (quasar.config.js vs quasar.conf.js)
2. Static imports requirement makes incremental migration impractical
3. Clean separation between Webpack and Vite build tooling
4. Different package dependencies (@quasar/app-webpack vs @quasar/app-vite)

### Key Constraints
- **No dynamic imports allowed** in Vite-based Quasar setup
- **All route components must be statically imported**
- **All async components must be converted to static imports**
- **Extension compatibility** must be verified (completed ✅)
- **Manual chunking** required to optimize bundle size

---

## Version Strategy & Correction

### Critical Version Clarification

**IMPORTANT:** Initial planning assumed migration to "Quasar 3" but this was incorrect.

**Correct Target Versions:**
- **Quasar:** 2.14.3 → **2.19.3** (latest stable v2, NOT v3)
- **@quasar/app-vite:** Install **2.6.1** (latest stable, NOT v3 beta)
- **Vite:** 5.x (bundled with @quasar/app-vite)

**Why This Matters:**
```bash
$ npm view quasar version
2.19.3  # ← Latest stable (no v3 exists yet)

$ npm view @quasar/app-vite version
2.6.1  # ← Latest stable
# Note: v3.0.0-beta.33 exists but is beta
```

### Impact of Version Correction

**GOOD NEWS - Easier Migration:**
1. ✅ **NOT a major version migration** (2.x → 2.x, not 2.x → 3.x)
2. ✅ **Fewer breaking changes** than anticipated (semantic versioning)
3. ✅ **More stable** - using released versions, not betas
4. ✅ **Lower risk** - minor version upgrades are safer
5. ✅ **Better support** - stable versions have better docs/community support
6. ✅ **Extension compatibility** - v2 extensions more likely compatible

**What This Means:**
- Quasar 2.14 → 2.19 is a **minor version upgrade** (5 patch releases)
- Most breaking changes are in **build tool** (Webpack → Vite), not framework
- Component APIs remain largely compatible
- Focus effort on Vite migration, not Quasar API changes

### Dependency Upgrade Matrix

| Package | Current | Target | Change Type |
|---------|---------|--------|-------------|
| quasar | 2.14.3 | 2.19.3 | Minor upgrade |
| @quasar/app-webpack | 3.12.3 | *(remove)* | Remove |
| @quasar/app-vite | *(none)* | 2.6.1 | Install |
| @obiba/amber | 1.1.6 | 1.2.0 | Minor upgrade (Vite v2 support) |
| vue | 3.0.0 | 3.x (latest) | Patch upgrade |
| vue-router | 4.0.0 | 4.x (latest) | Patch upgrade |

---

## Breaking Changes Analysis

### 1. Quasar 2.14.3 → 2.19.3 Changes

**Type:** Minor version upgrades (2.14 → 2.15 → ... → 2.19)  
**Semantic Versioning:** Minimal breaking changes expected

#### 1.1 Component API Changes

**QBtn (Button Component) - 316 occurrences**
- Remove `glossy` prop if used (deprecated)
- `loading` prop behavior unchanged
- Color system remains compatible
- Icon props unchanged

**QInput (Input Component) - 255 occurrences**
- `filled`, `outlined`, `borderless`, `standout` props unchanged
- `dense` prop still supported
- Rules validation API unchanged
- All event handlers compatible

**QDialog (Dialog Component) - 66 occurrences**
- v-model usage remains the same
- `persistent` prop behavior unchanged
- All event handlers compatible

**QTable (Table Component) - 48 occurrences**
- `rows-per-page-options` prop unchanged
- Pagination API compatible
- Selection mode API unchanged

**QSelect (Select Component) - 45 occurrences**
- `use-input` for filtering still supported
- `emit-value` and `map-options` behavior unchanged
- Options structure remains the same

**General Component Changes:**
- All 57 unique Quasar components work with both Options API and Composition API
- No breaking changes in most commonly used props
- Component registration (auto-import) works identically
- **Action:** Review Quasar release notes v2.14.4 through v2.19.3 for any deprecations

#### 1.2 Plugin API Changes

**Notify Plugin - 12 files**
- API remains unchanged
- Usage patterns compatible:
  - Options API: `this.$q.notify()`
  - Composition API: `useQuasar().notify()`

**LocalStorage/SessionStorage Plugin - 6 files**
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

**Migration Impact:** Low - plugins mostly backward compatible

#### 1.3 Composable Changes

**useQuasar()**
- Primary way to access Quasar functionality in Composition API
- Returns object with: `$q`, `platform`, `screen`, `dark`, etc.
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
- **File renamed** from `quasar.conf.js` to `quasar.config.js`
- **Uses ES modules** (import/export) instead of CommonJS (require/module.exports)
- **Build configuration** moves from `build.webpack` to `build.vite`
- **Environment variables** change from `build.env` to Vite's native system

Current structure:
```js
// quasar.conf.js (OLD)
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
// quasar.config.js (NEW)
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

#### 1.5 RTL & Dark Mode Support

**No Breaking Changes:**
- RTL (Right-to-Left) support configuration unchanged
- `quasar.config.js` → `framework.lang` configuration identical
- Dark mode API unchanged: `$q.dark.set()`, `.toggle()`, `.isActive`
- CSS classes and directives work identically

---

### 2. Build Tool: Webpack → Vite

**This is the major migration work** - not Quasar framework changes!

#### 2.1 Configuration Conversion

**File Structure Changes:**
```
OLD: quasar.conf.js (CommonJS)
NEW: quasar.config.js (ESM)
```

**Webpack Config → Vite Config:**

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
import { fileURLToPath } from 'node:url'

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
5. Convert webpack `build.env` to Vite's environment system

#### 2.2 Environment Variable Changes

**Critical Change: process.env → import.meta.env**

This is a **global search-and-replace** requirement across entire codebase.

| Webpack (OLD) | Vite (NEW) | Notes |
|---------------|------------|-------|
| `process.env.NODE_ENV` | `import.meta.env.MODE` | Development/production mode |
| `process.env.API` | `import.meta.env.VITE_API` | Custom variables need `VITE_` prefix |
| `process.env.RECAPTCHA_SITE_KEY` | `import.meta.env.VITE_RECAPTCHA_SITE_KEY` | All custom vars need prefix |
| `process.env.SETTINGS` | `import.meta.env.VITE_SETTINGS` | JSON config |
| `process.env.VERSION` | `import.meta.env.VITE_VERSION` | App version |

**Reserved Vite Variables (no prefix needed):**
- `import.meta.env.MODE` - 'development', 'production', etc.
- `import.meta.env.BASE_URL` - Public base path
- `import.meta.env.PROD` - Boolean, true in production
- `import.meta.env.DEV` - Boolean, true in development
- `import.meta.env.SSR` - Boolean, true during SSR

**Migration Steps:**
1. Rename all environment variables in `.env` files to use `VITE_` prefix
2. Global search and replace `process.env` with `import.meta.env`
3. Update variable names with `VITE_` prefix
4. Update `quasar.config.js` env configuration (remove `build.env` section)

**Current Usage in Codebase (10 occurrences):**
1. `src/boot/feathersClient.js` - `process.env.API`
2. `src/boot/axios.js` - `process.env.API`
3. `src/boot/recaptcha.js` - `process.env.RECAPTCHA_SITE_KEY`
4. `src/boot/settings.js` - `process.env.SETTINGS`, `VERSION`, `REGISTER_ENABLED`
5. `src/store/index.js` - `process.env.DEBUGGING`
6. `src/router/index.js` - `process.env.MODE`, `VUE_ROUTER_MODE`, `VUE_ROUTER_BASE`

#### 2.3 Asset Import Changes

**Static Assets:**

Vite handles assets mostly compatible with Webpack:

```js
// Both work the same way:
import logo from '@/assets/logo.svg'  // Returns URL string

// New Vite-specific queries (optional optimizations):
import logoUrl from '@/assets/logo.svg?url'      // Explicit URL
import logoRaw from '@/assets/logo.svg?raw'      // Raw string content
import logoInline from '@/assets/logo.svg?inline' // Inline base64
```

**Public Directory:**
- `/public` folder behavior identical to Webpack
- Files in `/public` served as-is at root URL
- No changes needed for existing public assets

**Migration Impact:** Low - most asset imports work identically

#### 2.4 Plugin Equivalents

**Webpack Plugins → Vite Equivalents:**

Current webpack plugins in use (based on `quasar.conf.js` analysis):

| Webpack Feature | Current Usage | Vite Equivalent | Action Required |
|-----------------|---------------|-----------------|-----------------|
| `DefinePlugin` (via `build.env`) | Yes - API, RECAPTCHA_SITE_KEY, SETTINGS, VERSION | `define` in config | Update to Vite's define syntax |
| `webpack-chain` alias | Yes - Vue alias resolution | Vite `resolve.alias` | Update alias syntax |
| Workbox Plugin (PWA) | Yes - `pwa.workboxPluginMode: 'GenerateSW'` | `vite-plugin-pwa` | Install and configure |
| No CopyPlugin | N/A | `vite-plugin-static-copy` | Install only if needed |
| No CompressionPlugin | N/A | Built-in or `vite-plugin-compression` | Optional |
| No ESLint webpack plugin | N/A | `vite-plugin-eslint` | May need to install |

**Action Items:**
1. Review current `quasar.conf.js` for webpack plugins ✅
2. Install `vite-plugin-pwa` for Workbox replacement
3. Configure Vite's native `define` for environment variables
4. Update alias configuration syntax

#### 2.5 Build Optimization

**Performance Characteristics:**

| Feature | Webpack | Vite |
|---------|---------|------|
| Cold start | 5-30s | 1-5s |
| HMR (Hot Module Replacement) | 1-3s | <100ms |
| Production build | Optimized | Optimized (Rollup) |
| Bundle size | Good with config | Excellent by default |

**Vite Optimizations (Automatic):**
- Tree-shaking enabled by default
- CSS code splitting automatic
- Chunk splitting optimized
- Modern browser targets (ES2020+)
- Superior dependency pre-bundling with esbuild

**Expected Improvements:**
- **Dev server start:** ~15s → <5s (70% faster)
- **HMR updates:** ~2s → <100ms (95% faster)
- **Build time:** Similar or faster
- **Bundle size:** 10-30% reduction (with tree-shaking)

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
- Vite dev server significantly faster
- HMR is more reliable and granular
- Proxy configuration mostly compatible (add `changeOrigin` if needed)

---

## Static Import Conversion Strategy

### Overview

**Requirement:** All dynamic imports must be converted to static imports for Vite compatibility.

**Total Dynamic Imports Found:** 68 occurrences
- **Router Lazy Loading:** 27 route components
- **Async Components:** 24 defineAsyncComponent calls
- **Quasar Boot Files:** 14 boot file imports (auto-generated, handled by Vite plugin)
- **Runtime i18n:** 3 dynamic language imports

**Current Bundle Size:** 4.6MB JS + 416KB CSS = ~6.0MB total  
**Target Bundle Size:** 3.0-4.0MB (13-30% reduction via tree-shaking)

### 1. Dynamic Import Inventory

#### 1.1 Router Components (27 imports)

Located in: `src/router/routes.js`

**Layouts (2):**
- `layouts/MainLayout.vue` - Main application layout
- `layouts/StudyLayout.vue` - Study-specific layout

**Pages - Authentication & Public (8):**
- `pages/Login.vue`
- `pages/Register.vue`
- `pages/ForgotPassword.vue`
- `pages/ResetPassword.vue`
- `pages/Verify.vue`
- `pages/Error404.vue`
- `pages/Maintenance.vue`
- `pages/Loading.vue`

**Pages - Admin (5):**
- `pages/Users.vue`
- `pages/User.vue`
- `pages/Groups.vue`
- `pages/Group.vue`
- `pages/Tasks.vue`

**Pages - Main App (4):**
- `pages/Dashboard.vue`
- `pages/Account.vue`
- `pages/Studies.vue`
- `pages/Datasets.vue`

**Pages - Study Features (8):**
- `pages/Study.vue`
- `pages/StudyForms.vue`
- `pages/StudyForm.vue`
- `pages/StudyCaseReportForms.vue`
- `pages/StudyCaseReports.vue`
- `pages/StudyInterviewDesigns.vue`
- `pages/StudyInterviewDesign.vue`
- `pages/StudyInterviews.vue`

#### 1.2 Async Components (24 imports)

**Component Usage by Parent:**

| Parent File | Async Components | Purpose |
|------------|------------------|---------|
| `src/components/interviews/Campaigns.vue` | Participants, RecordsChart, PieChart | Campaign dashboard |
| `src/components/dashboard/DashboardCounts.vue` | RecordsChart | Statistics |
| `src/components/forms/FormItems.vue` | FormItem | Recursive rendering |
| `src/pages/Study.vue` | DashboardCounts | Overview |
| `src/pages/StudyForms.vue` | Forms | Management |
| `src/pages/StudyCaseReports.vue` | CaseReports | CRF list |
| `src/pages/StudyCaseReportForms.vue` | CaseReportForms | CRF templates |
| `src/pages/StudyInterviewDesigns.vue` | InterviewDesigns | Templates |
| `src/pages/StudyForm.vue` | FormItems, FormTranslations, FormRevisions | Editor tabs |
| `src/pages/Dashboard.vue` | DashboardCounts | Main dashboard |
| `src/pages/StudyInterviews.vue` | Interviews | Interview list |
| `src/pages/StudyInterviewDesign.vue` | InterviewDesignSteps, InterviewDesignTranslations, Campaigns | Designer tabs |

#### 1.3 Runtime i18n Imports (3 imports)

Dynamic language file loading for Quasar UI translations:

- `src/layouts/MainLayout.vue` - Language switcher
- `src/layouts/StudyLayout.vue` - Language switcher
- `src/pages/Login.vue` - Language switcher

Current pattern:
```javascript
import('quasar/lang/' + langIso)
```

### 2. Conversion Patterns

#### 2.1 Route Lazy Loading → Static Imports

**Before (Webpack):**
```javascript
const routes = [
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'users',
        component: () => import('pages/Users.vue')
      }
    ]
  }
]
```

**After (Vite - Required):**
```javascript
import MainLayout from 'layouts/MainLayout.vue'
import AdminUsers from 'pages/Users.vue'
import AdminSettings from 'pages/Settings.vue'
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

#### 2.2 Async Components → Static Imports

**Before (Webpack):**
```javascript
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    HeavyComponent: defineAsyncComponent(() =>
      import('@/components/HeavyComponent.vue')
    )
  }
}
```

**After (Vite - Required):**
```javascript
import HeavyComponent from '@/components/HeavyComponent.vue'

export default {
  components: {
    HeavyComponent
  }
}
```

#### 2.3 i18n Runtime Imports → Static Language Map

**Before (Webpack):**
```javascript
async function changeLanguage(langIso) {
  const lang = await import('quasar/lang/' + langIso)
  Quasar.lang.set(lang.default)
}
```

**After (Vite - Required):**
```javascript
import langEn from 'quasar/lang/en-US'
import langFr from 'quasar/lang/fr'
import langEs from 'quasar/lang/es'

const langMap = {
  'en-US': langEn,
  'fr': langFr,
  'es': langEs
}

function changeLanguage(langIso) {
  Quasar.lang.set(langMap[langIso])
}
```

### 3. Manual Chunking Strategy

Since all imports are now static, we use Vite's `manualChunks` to optimize bundle size.

#### 3.1 Chunk Groups

**Chunk 1: Vendor Core** (target: 500KB)
- Vue 3 runtime, Vue Router, Pinia

**Chunk 2: Quasar UI** (target: 800KB)
- Quasar components, plugins, directives

**Chunk 3: Third-Party Libraries** (target: 300KB)
- Axios, FeathersJS, Vuelidate, Chart libraries

**Chunk 4-11: Feature Modules** (target: 100-250KB each)
- Authentication Module
- Admin Module
- Study Core
- Forms Module
- Case Reports Module
- Interviews Module
- Dashboard Module
- Common Components

#### 3.2 Vite Configuration

```javascript
// quasar.config.js
export default defineConfig({
  build: {
    vite: {
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor chunks
              'vendor-vue': ['vue', 'vue-router', 'pinia'],
              'vendor-quasar': ['quasar'],
              'vendor-libs': [
                'axios',
                '@feathersjs/client',
                '@feathersjs/authentication-client',
                '@vuelidate/core',
                '@vuelidate/validators'
              ],
              
              // Feature chunks
              'auth': [
                './src/pages/Login.vue',
                './src/pages/Register.vue',
                './src/pages/ForgotPassword.vue',
                './src/pages/ResetPassword.vue',
                './src/pages/Verify.vue',
                './src/boot/auth.js'
              ],
              
              'admin': [
                './src/pages/Users.vue',
                './src/pages/User.vue',
                './src/pages/Groups.vue',
                './src/pages/Group.vue',
                './src/pages/Tasks.vue'
              ],
              
              'study-core': [
                './src/layouts/StudyLayout.vue',
                './src/pages/Study.vue'
              ],
              
              'study-forms': [
                './src/pages/StudyForms.vue',
                './src/pages/StudyForm.vue',
                './src/components/forms/FormItems.vue',
                './src/components/forms/FormItem.vue',
                './src/components/forms/Forms.vue',
                './src/components/forms/FormTranslations.vue',
                './src/components/forms/FormRevisions.vue'
              ],
              
              'study-crfs': [
                './src/pages/StudyCaseReportForms.vue',
                './src/pages/StudyCaseReports.vue',
                './src/components/crfs/CaseReportForms.vue',
                './src/components/crfs/CaseReports.vue'
              ],
              
              'study-interviews': [
                './src/pages/StudyInterviewDesigns.vue',
                './src/pages/StudyInterviewDesign.vue',
                './src/pages/StudyInterviews.vue',
                './src/components/interviews/InterviewDesigns.vue',
                './src/components/interviews/InterviewDesignSteps.vue',
                './src/components/interviews/InterviewDesignTranslations.vue',
                './src/components/interviews/Interviews.vue',
                './src/components/interviews/Campaigns.vue',
                './src/components/interviews/Participants.vue'
              ],
              
              'dashboard': [
                './src/pages/Dashboard.vue',
                './src/components/dashboard/DashboardCounts.vue',
                './src/components/dashboard/RecordsChart.vue',
                './src/components/charts/PieChart.vue'
              ]
            }
          }
        }
      }
    }
  }
})
```

#### 3.3 Chunk Size Targets

| Chunk Category | Target Size | Max Size |
|---------------|-------------|----------|
| Critical Path (Vue + App Core) | 200KB | 300KB |
| Quasar UI | 500KB | 800KB |
| Feature Modules | 100-200KB each | 300KB |
| Small Components | < 50KB | 100KB |

**Total Target:** ~3-4MB (down from 4.6MB, 13-30% reduction)

### 4. Bundle Impact Assessment

#### 4.1 Expected Changes

**Positive:**
- Faster page transitions (no lazy load delay)
- Better tree-shaking with static analysis
- Improved caching strategy (stable chunk names)
- Reduced network requests
- Vite's superior optimization

**Considerations:**
- Initial bundle may be larger per chunk (more eager loading)
- Less granular code splitting than 40+ webpack chunks
- All route components loaded upfront per chunk

**Mitigation:**
- Aggressive manual chunking by feature area
- Route-based code splitting at chunk level
- Service worker caching strategy
- Compression (gzip/brotli) - ~70% reduction
- HTTP/2 parallel loading optimization

#### 4.2 Bundle Size Comparison

**Current (Webpack):**
- Total: 4.6MB JS + 416KB CSS = ~6.0MB
- Vendor chunk: 3.9MB (too large)
- App chunk: 131KB
- 40+ lazy chunks (many very small: 5-20KB)

**Target (Vite with manual chunking):**
- Total: 3.0-4.0MB (13-30% reduction)
- 10-15 logical chunks
- Better HTTP/2 parallel loading
- Improved tree-shaking

### 5. Implementation Checklist

#### Phase 1: Router Conversion
- [ ] Add static imports for all layouts (2 files)
- [ ] Add static imports for all pages (27 files)
- [ ] Replace lazy functions with component references
- [ ] Test all routes load correctly
- [ ] Verify route guards still work

#### Phase 2: Component Conversion
- [ ] Convert async components in `src/components/interviews/` (4 components)
- [ ] Convert async components in `src/components/dashboard/` (1 component)
- [ ] Convert async components in `src/components/forms/` (1 component)
- [ ] Convert async components in `src/pages/` (10 files)
- [ ] Remove unused `defineAsyncComponent` imports
- [ ] Test all converted components render

#### Phase 3: i18n Conversion
- [ ] Identify all supported languages
- [ ] Create static language imports
- [ ] Create language map lookup
- [ ] Replace dynamic imports in layouts (2 files)
- [ ] Replace dynamic import in Login page
- [ ] Test language switching

#### Phase 4: Manual Chunking
- [ ] Configure Vite `manualChunks`
- [ ] Test chunk loading in dev mode
- [ ] Build and analyze chunks
- [ ] Optimize chunk groups based on sizes
- [ ] Verify chunk loading in production

#### Phase 5: Validation
- [ ] Run full test suite
- [ ] Test all routes manually
- [ ] Verify all components load
- [ ] Check bundle sizes (target: 3-4MB)
- [ ] Performance testing (Lighthouse)
- [ ] Compare before/after metrics

---

## Environment Variables Migration

### Current Usage Inventory

**Process.env usage in codebase:** 10 occurrences

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

### Migration Steps

**Step 1: Update .env files**

```bash
# OLD (.env)
NODE_ENV=development
API=http://localhost:3030
RECAPTCHA_SITE_KEY=your_key_here

# NEW (.env)
MODE=development
VITE_API=http://localhost:3030
VITE_RECAPTCHA_SITE_KEY=your_key_here
```

**Step 2: Global search and replace in source code**

```bash
# Find all process.env usage
grep -r "process\.env" src/

# Replace with import.meta.env
# Use IDE's find-and-replace or:
find src/ -type f \( -name "*.js" -o -name "*.vue" \) -exec sed -i 's/process\.env/import.meta.env/g' {} +
```

**Step 3: Update quasar.config.js**

```js
// OLD (quasar.conf.js)
build: {
  env: {
    API: process.env.API || 'http://localhost:3030',
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    SETTINGS: JSON.stringify(require('./settings.json')),
    VERSION: require('./package.json').version,
    REGISTER_ENABLED: !!process.env.RECAPTCHA_SITE_KEY
  }
}
```

```js
// NEW (quasar.config.js)
import { defineConfig } from '#q/app'
import pkg from './package.json' assert { type: 'json' }
import settings from './settings.json' assert { type: 'json' }

export default defineConfig({
  build: {
    env: {
      VITE_APP_VERSION: pkg.version,
      VITE_SETTINGS: JSON.stringify(settings)
      // VITE_API and VITE_RECAPTCHA_SITE_KEY come from .env files
      // VITE_REGISTER_ENABLED can be computed in boot file
    }
  }
})
```

**Step 4: Update all source file references**

Example updates:
```js
// src/boot/feathersClient.js
// OLD
const apiUrl = process.env.API

// NEW
const apiUrl = import.meta.env.VITE_API

// src/boot/settings.js
// OLD
const version = process.env.VERSION
const settings = JSON.parse(process.env.SETTINGS)

// NEW
const version = import.meta.env.VITE_APP_VERSION
const settings = JSON.parse(import.meta.env.VITE_SETTINGS)

// src/router/index.js
// OLD
const mode = process.env.VUE_ROUTER_MODE
const isDev = process.env.NODE_ENV === 'development'

// NEW
const mode = import.meta.env.VITE_VUE_ROUTER_MODE
const isDev = import.meta.env.DEV  // Built-in Vite variable
```

### TypeScript Definitions (Optional)

For better IDE support, create `src/env.d.ts`:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API: string
  readonly VITE_APP_VERSION: string
  readonly VITE_RECAPTCHA_SITE_KEY: string
  readonly VITE_SETTINGS: string
  readonly VITE_VUE_ROUTER_MODE: string
  readonly VITE_VUE_ROUTER_BASE: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## Extension Compatibility

### Extension Status: VERIFIED ✅

All extension compatibility has been verified as part of Phase 1.

**See:** `plans/archive/extension-usage-verification.md` for detailed analysis

### Summary

| Extension | Current | Target | Status | Action |
|-----------|---------|--------|--------|--------|
| **@obiba/quasar-app-extension-amber** | 1.1.6 | 1.2.0 | ✅ **VERIFIED** | Upgrade to 1.2.0 (Vite v2 support confirmed by maintainer) |
| **@quasar/quasar-app-extension-qcalendar** | 4.0.0-beta.16 | *(remove)* | ❌ **NOT USED** | Remove - 0 usages found |
| **@quasar/quasar-app-extension-qmarkdown** | 2.0.0-beta.10 | *(remove)* | ❌ **NOT USED** | Remove - 0 usages found |
| **quasar-app-extension-qhierarchy** | 1.0.0-alpha.1 | *(remove)* | ❌ **NOT USED** | Remove - uses native q-tree instead |

**Result:**
- **1 extension to upgrade:** @obiba/amber 1.1.6 → 1.2.0
- **3 extensions to remove:** qcalendar, qmarkdown, qhierarchy
- **No blockers** - v1.2.0 confirmed available and compatible

---

## Migration Decision Log

### Decision 1: Build Tool Selection
- **Decision:** Migrate to Vite (required for Quasar 2.19.3)
- **Rationale:** 
  - Quasar 2.19.3 uses Vite as primary build tool
  - Significantly faster development (HMR <100ms vs 1-3s)
  - Better ecosystem alignment with modern Vue 3
  - Simpler configuration than Webpack
  - Superior tree-shaking and optimization
- **Risks:** 
  - Learning curve for team unfamiliar with Vite
  - Some webpack plugins may not have direct equivalents
  - Build configuration needs complete rewrite
- **Mitigation:**
  - Document all Vite-specific patterns
  - Provide training on Vite concepts
  - Allocate time for configuration migration (Phase 2)

### Decision 2: No Dynamic Imports
- **Decision:** Convert all 68 dynamic imports to static imports
- **Rationale:** 
  - Vite + Quasar combination has issues with dynamic imports
  - Simpler dependency graph, easier to debug
  - Eliminates runtime import resolution complexity
  - Better for tree-shaking and optimization
  - More predictable build output
- **Impact:** 
  - Initial bundle size will increase per chunk
  - Need to implement manual code-splitting via `manualChunks`
  - 27 route lazy imports to convert
  - 24 defineAsyncComponent usages to convert
  - 3 i18n runtime imports to convert
  - 14 boot file imports (handled by Vite plugin automatically)
- **Mitigation:**
  - Use Vite's `manualChunks` for code splitting (10-15 logical chunks)
  - Monitor bundle size and optimize chunks
  - Target 13-30% size reduction via tree-shaking
  - HTTP/2 parallel loading optimization

### Decision 3: All-at-Once Migration
- **Decision:** Full migration in single effort, no hybrid state
- **Rationale:**
  - Cannot run Quasar 2 (webpack) and Quasar 2.19.3 (Vite) configurations simultaneously
  - Different package dependencies (@quasar/app-webpack vs @quasar/app-vite)
  - Configuration files incompatible (quasar.conf.js vs quasar.config.js)
  - Cleaner long-term maintenance
  - No technical debt from mixed patterns
- **Risks:**
  - Larger scope increases risk of issues
  - Cannot deploy incrementally
  - Longer testing cycle required
- **Mitigation:**
  - Use git branch for migration work
  - Comprehensive testing before merge
  - Rollback plan: keep Quasar 2 branch available
  - Phased implementation (Phases 1-6)
  - Daily progress reviews

### Decision 4: Pinia Over Vuex
- **Decision:** Migrate from Vuex 4 to Pinia 2
- **Rationale:**
  - Pinia is official Vue 3 recommendation (replaces Vuex 5)
  - Better TypeScript support
  - Simpler API (no mutations boilerplate)
  - Better devtools integration
  - Smaller bundle size
  - Designed for Composition API
- **Impact:**
  - 6 Vuex modules + 1 auth plugin → 7 Pinia stores
  - Update all component store usage (~150+ references)
  - Migrate persistence (vuex-persistedstate → pinia-plugin-persistedstate)
- **Benefits:**
  - Cleaner code (no mutation boilerplate)
  - Better developer experience
  - Future-proof (official recommendation)
- **See:** STATE-MANAGEMENT.md for detailed Pinia migration plan

### Decision 5: Composition API Target
- **Decision:** Migrate all 73 components to Composition API with `<script setup>`
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
- **See:** COMPONENT-MIGRATION.md for detailed component conversion plan

### Decision 6: Manual Chunking Strategy
- **Decision:** Use Vite's `manualChunks` for 10-15 logical feature-based chunks
- **Rationale:**
  - Required since all imports are now static
  - Better control over bundle composition
  - Optimize caching strategy (stable chunk names)
  - Reduce from 40+ webpack chunks to logical groups
- **Strategy:**
  - Vendor chunks: Vue, Quasar, Libraries (separate for caching)
  - Feature chunks: Admin, Forms, Interviews, CRFs, Dashboard, Auth
  - Common chunks: Layouts, shared components
- **Expected Result:**
  - 10-15 chunks instead of 40+
  - 3-4MB total (down from 4.6MB)
  - Better HTTP/2 parallel loading
  - Improved caching (vendor chunks change less frequently)

---

## Risk Assessment

### High Risk Areas

| Risk | Impact | Likelihood | Mitigation | Status |
|------|--------|-----------|------------|--------|
| ~~Extension incompatibility~~ | ~~High (blocker)~~ | ~~Medium~~ | Verify before migration, prepare fallbacks | ✅ **RESOLVED** |
| Dynamic import errors | High (runtime failures) | Medium | Systematic conversion, chunk verification, testing | In Progress |
| State management bugs | High (data loss) | Low | Careful Vuex→Pinia migration, persistence testing | Planned |
| Bundle size explosion | Medium (performance) | Medium | Manual chunking, monitoring, optimization | Planned |

### Medium Risk Areas

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Environment variable errors | Medium | Medium | Careful migration, systematic replacement, testing |
| Component conversion bugs | Medium | Medium | Test each component, phased approach |
| Build configuration errors | Medium | Low | Incremental changes, validation at each step |
| Developer learning curve | Medium (velocity) | High | Documentation, training, pair programming |

### Low Risk Areas

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| CSS/SCSS issues | Low | Low | Sass support built-in to Vite |
| Asset loading | Low | Low | Similar asset handling |
| Devtools integration | Low | Very Low | Better in Pinia |

### Risk Mitigation Summary

**Completed:**
- ✅ Extension compatibility verified (1 to upgrade, 3 to remove)
- ✅ Comprehensive planning documents created
- ✅ Version strategy clarified (Quasar 2.19.3, not v3)

**In Progress:**
- 🔄 Static import conversion strategy documented
- 🔄 Manual chunking configuration designed
- 🔄 Environment variable migration plan created

**Remaining:**
- ⏳ Team training on Vite and Composition API
- ⏳ Test environment setup
- ⏳ Implementation execution (Phases 2-6)

---

## Success Criteria

### Technical Metrics

**Build & Performance:**
- [ ] Application builds successfully with Vite (dev & prod)
- [ ] Dev server starts in <5 seconds (vs current ~15s)
- [ ] HMR updates in <100ms (vs current ~2s)
- [ ] Production bundle size within target: 3.0-4.0MB (vs current 4.6MB)
- [ ] Zero dynamic imports remaining in codebase (verify with grep)

**Code Quality:**
- [ ] All 73 components migrated to Composition API (see COMPONENT-MIGRATION.md)
- [ ] All 7 stores migrated to Pinia (see STATE-MANAGEMENT.md)
- [ ] All tests passing
- [ ] No console errors in development
- [ ] No console errors in production build
- [ ] ESLint passing with no errors

**Feature Completeness:**
- [ ] All features working identically to Quasar 2.14.3 version
- [ ] Authentication flow works correctly
- [ ] State persistence working (localStorage/SecureLS)
- [ ] All API calls functioning
- [ ] All forms submitting correctly
- [ ] All admin features operational
- [ ] RTL mode working
- [ ] Dark mode working

**Developer Experience:**
- [ ] Vue Devtools showing correct component tree
- [ ] Pinia devtools showing all 7 stores
- [ ] HMR working reliably for all file types
- [ ] Build errors are clear and actionable
- [ ] Team comfortable with new patterns

### Quality Metrics

**Functionality:**
- [ ] All 73 components render without errors
- [ ] All 27 routes navigate correctly
- [ ] All user workflows functional
- [ ] No functionality regressions

**Performance:**
- [ ] Initial page load ≤ current performance
- [ ] Route transitions ≤ current performance
- [ ] API response times unchanged
- [ ] Memory usage within acceptable range

**Maintainability:**
- [ ] Code follows consistent patterns
- [ ] Documentation complete and accurate
- [ ] Team trained on new architecture
- [ ] Technical debt reduced (no mixed patterns)

---

## Timeline & Next Steps

### Overall Timeline: 8-10 weeks

**Phase 1: Planning & Architecture** ✅ **COMPLETE**
- Duration: 2 weeks
- Status: Complete (2026-05-31)
- Deliverables:
  - ✅ Consolidated MIGRATION-STRATEGY.md (this document)
  - ✅ STATE-MANAGEMENT.md (Pinia + Feathers-Pinia)
  - ✅ COMPONENT-MIGRATION.md (Component conversion)
  - ✅ Extension compatibility verified
  - ✅ GO/NO-GO decision: **GO** ✅

**Phase 2: Foundation (Quasar 2.19.3 + Vite Setup)**
- Duration: 2 weeks
- Tasks:
  - Remove unused extensions (qcalendar, qmarkdown, qhierarchy)
  - Upgrade @obiba/amber to v1.2.0
  - Install Quasar 2.19.3 + @quasar/app-vite 2.6.1
  - Create quasar.config.js from quasar.conf.js
  - Convert all 68 dynamic imports to static
  - Update environment variables (process.env → import.meta.env)
  - Configure manual chunking
  - Test dev and prod builds
- Success Criteria:
  - `quasar dev` starts successfully (<5s)
  - `quasar build` completes successfully
  - All pages accessible
  - No console errors
- See: `plans/phase2-kickoff-checklist.md`

**Phase 3: State Management (Pinia Migration)**
- Duration: 1-2 weeks
- Tasks: See STATE-MANAGEMENT.md
- Deliverables: 7 Pinia stores operational

**Phase 4: Component Migration (Composition API)**
- Duration: 3-4 weeks
- Tasks: See COMPONENT-MIGRATION.md
- Deliverables: All 73 components using `<script setup>`

**Phase 5: Testing & Refinement**
- Duration: 1-2 weeks
- Full regression testing, bug fixes, optimization

**Phase 6: Deployment & Stabilization**
- Duration: 1 week
- Staging deployment, final validation, production deployment

### Immediate Next Steps

1. **Review & Approve** this consolidated strategy document
2. **Schedule Phase 2 kickoff** meeting with team
3. **Set up test environment** (optional, can do in Phase 2)
4. **Create migration feature branch**
5. **Begin Phase 2 implementation**

### Dependencies & Blockers

**Resolved:**
- ✅ Extension compatibility verified
- ✅ Version strategy clarified
- ✅ All planning documents complete

**Remaining:**
- Team availability for 8-10 week migration
- Test environment setup (low priority, can do in Phase 2)
- Stakeholder approval to proceed

---

## References

### Documentation Links

**Quasar:**
- [Quasar 2.19.3 Upgrade Guide](https://quasar.dev/start/upgrade-guide)
- [Quasar Vite Plugin](https://quasar.dev/start/vite-plugin)
- [Quasar CLI with Vite](https://quasar.dev/quasar-cli-vite/quasar-config-file)

**Vite:**
- [Vite Features Guide](https://vitejs.dev/guide/features.html)
- [Vite Migration Guide](https://vitejs.dev/guide/migration.html)
- [Vite Code Splitting](https://vitejs.dev/guide/build.html#chunking-strategy)
- [Rollup Manual Chunks](https://rollupjs.org/configuration-options/#output-manualchunks)

**Vue:**
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue 3 Setup Syntax](https://vuejs.org/api/sfc-script-setup.html)
- [Vue Router Lazy Loading](https://router.vuejs.org/guide/advanced/lazy-loading.html)

**Pinia:**
- [Pinia Introduction](https://pinia.vuejs.org/introduction.html)
- [Pinia vs Vuex](https://pinia.vuejs.org/introduction.html#comparison-with-vuex-3-x-4-x)

### Related Planning Documents

**Primary Technical Specs:**
- `STATE-MANAGEMENT.md` - Vuex→Pinia migration (Pinia architecture + FeathersVuex)
- `COMPONENT-MIGRATION.md` - Options API→Composition API (component conversion patterns)

**Master Guides:**
- `IMPLEMENTATION-GUIDE.md` - Quick reference for implementers
- `phase1-summary.md` - Phase 1 summary with GO/NO-GO decision
- `phase2-kickoff-checklist.md` - Phase 2 preparation checklist

**Archive (Historical):**
- `archive/2026-05-29-studio-quasar-pinia.md` - Original estimate document
- `archive/2026-05-31-phase1-planning-architecture.md` - Phase 1 implementation plan
- `archive/extension-usage-verification.md` - Extension analysis details

### Key Findings Summary

1. **Quasar 2.19.3 is a minor upgrade** - mostly backward compatible at component level
2. **Main work is Webpack → Vite**, not Quasar framework changes
3. **Vite requires different thinking** about imports and optimization
4. **Static imports are manageable** with proper manual chunking strategy
5. **Expected 13-30% bundle size reduction** via tree-shaking
6. **70% faster dev experience** with Vite (<5s start, <100ms HMR)
7. **Extension compatibility resolved** - only 1 to upgrade, 3 to remove

---

**Document Version:** 1.0 (Consolidated)  
**Last Updated:** 2026-05-31  
**Status:** Planning Complete - Ready for Phase 2  
**Next Review:** After Phase 2 completion

**Consolidation Note:** This document consolidates content from original planning documents:
- `migration-strategy.md` (1,494 lines) - Overall strategy
- `static-import-strategy.md` (636 lines) - Import conversion details
- `VERSION-CORRECTION.md` (322 lines) - Version clarifications

Original files archived to `plans/archive/`. Total consolidated content: ~2,450 lines → streamlined to 1,348 lines for clarity and action.
