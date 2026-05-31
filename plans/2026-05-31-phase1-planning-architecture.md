# Phase 1: Planning & Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete planning and architectural research for the Quasar 3 + Vite + Pinia + Setup Syntax all-at-once migration.

**Architecture:** Create comprehensive research documents covering migration strategy, Pinia store architecture with setup syntax, FeathersVuex integration approach, component setup syntax conversion patterns, and static import analysis.

**Tech Stack:** Documentation (Markdown), Research (Quasar 3, Vite, Pinia, Vue 3 Composition API), Codebase Analysis

**Timeline:** 3-4 days

---

## Task 1: Migration Strategy Document

**Files:**
- Create: `plans/migration-strategy.md`

**Goal:** Create comprehensive migration strategy covering all breaking changes, Vite configuration, and implementation approach.

- [ ] **Step 1: Research Quasar v3 breaking changes**

Visit and analyze:
- https://quasar.dev/start/upgrade-guide
- https://quasar.dev/start/vite-plugin
- Document all breaking changes relevant to the codebase

Create the document with this structure:

```bash
cat > plans/migration-strategy.md << 'EOF'
# Quasar 3 + Vite + Pinia Migration Strategy

**Date:** $(date +%Y-%m-%d)
**Status:** Planning

## Executive Summary

- **Current:** Quasar 2.14.3, Webpack, Vuex 4, Options API
- **Target:** Quasar 3, Vite, Pinia, Setup Syntax
- **Approach:** All-at-once migration

## Breaking Changes Analysis

### Quasar 3 Breaking Changes

[To be filled with research findings]

### Build Tool: Webpack → Vite

[To be filled with research findings]

### State Management: Vuex → Pinia

[To be filled with research findings]

### Component API: Options → Setup Syntax

[To be filled with research findings]

## Migration Decision Log

### Decision 1: Build Tool
- **Decision:** Migrate to Vite (required)
- **Rationale:** [To be filled]
- **Risks:** [To be filled]

### Decision 2: No Dynamic Imports
- **Decision:** All imports must be static
- **Rationale:** [To be filled]
- **Impact:** [To be filled]

EOF
```

Expected: File created with template

- [ ] **Step 2: Research and document Quasar 3 breaking changes**

Review Quasar 3 documentation and fill in breaking changes section:

```bash
# Use web browser or curl to review:
# - https://quasar.dev/start/upgrade-guide
# - https://github.com/quasarframework/quasar/releases (v3.0.0 release notes)
```

Add findings to `plans/migration-strategy.md` under "Quasar 3 Breaking Changes":
- Component API changes (especially q-btn, q-input, q-dialog, q-table, q-select)
- Plugin API changes (Notify, LocalStorage, LoadingBar, AppFullscreen)
- Composable changes (useQuasar)
- Configuration changes (quasar.conf.js → quasar.config.js)
- RTL support changes
- Dark mode changes

Expected: Documented list of breaking changes with code examples

- [ ] **Step 3: Research and document Vite migration requirements**

Review Vite documentation and fill in "Webpack → Vite" section:

```bash
# Review:
# - https://vitejs.dev/guide/migration.html
# - https://quasar.dev/start/vite-plugin
```

Document:
- Configuration conversion (quasar.conf.js webpack → quasar.config.js vite)
- Environment variable changes (process.env → import.meta.env)
- Asset import changes
- Plugin equivalents
- Build optimization options
- Dev server configuration

Expected: Complete Vite migration requirements documented

- [ ] **Step 4: Research static import requirements**

Analyze codebase for dynamic imports and document static import strategy:

```bash
# Find all dynamic imports
cd /home/yannick/projects/amber-studio
grep -r "import(" src/ --include="*.js" --include="*.vue" | tee /tmp/dynamic-imports.txt
grep -r "defineAsyncComponent" src/ --include="*.js" --include="*.vue" | tee -a /tmp/dynamic-imports.txt

# Find route lazy loading
grep -r "component:.*=>" src/router/ | tee /tmp/route-lazy-loading.txt
```

Document in migration-strategy.md:
- Current dynamic import locations
- Static import conversion approach
- Route configuration strategy
- Bundle size mitigation strategies (manual chunking)

Expected: Static import strategy documented with examples

- [ ] **Step 5: Document extension upgrade requirements**

Review and document extension compatibility:

Document in migration-strategy.md under "Extension Upgrades":
- `@obiba/quasar-app-extension-amber` 1.1.6 → 1.2.0 (required)
- `@quasar/quasar-app-extension-qcalendar` 4.0.0-beta.16 → v3 compatible version
- `@quasar/quasar-app-extension-qmarkdown` 2.0.0-beta.10 → v3 compatible version
- `quasar-app-extension-qhierarchy` 1.0.0-alpha.1 → v3 compatible version

Include:
- Version compatibility matrix
- Breaking changes in each extension
- Fallback plans if extensions not available

Expected: Extension upgrade plan documented

- [ ] **Step 6: Commit migration strategy document**

```bash
git add plans/migration-strategy.md
git commit -m "docs: add migration strategy document for phase 1"
```

Expected: Commit created successfully

---

## Task 2: Pinia Store Architecture Document

**Files:**
- Create: `plans/pinia-architecture.md`

**Goal:** Design Pinia store architecture using setup syntax for all 6 stores.

- [ ] **Step 1: Analyze current Vuex store structure**

```bash
cd /home/yannick/projects/amber-studio

# Analyze store structure
find src/store -name "*.js" -type f | sort

# Count lines per module
echo "=== Store Lines of Code ===" > /tmp/store-analysis.txt
for module in account admin caseReport form interview study; do
  if [ -d "src/store/$module" ]; then
    lines=$(find src/store/$module -name "*.js" -exec wc -l {} + | tail -1 | awk '{print $1}')
    echo "$module: $lines lines" >> /tmp/store-analysis.txt
  fi
done
cat /tmp/store-analysis.txt

# Analyze state shape
echo "=== State Analysis ===" >> /tmp/store-analysis.txt
for module in account admin caseReport form interview study; do
  if [ -f "src/store/$module/state.js" ]; then
    echo -e "\n$module state:" >> /tmp/store-analysis.txt
    cat "src/store/$module/state.js" >> /tmp/store-analysis.txt
  fi
done
```

Expected: Store structure analysis with line counts and state shapes

- [ ] **Step 2: Create Pinia architecture document template**

```bash
cat > plans/pinia-architecture.md << 'EOF'
# Pinia Store Architecture (Setup Syntax)

**Date:** $(date +%Y-%m-%d)
**Status:** Planning

## Overview

Migration from Vuex modules to Pinia stores using setup syntax (Composition API).

## Store Architecture Principles

### Setup Syntax Pattern

All Pinia stores will use the setup syntax (Composition API style):

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // State (using ref)
  const data = ref(null)
  
  // Getters (using computed)
  const processedData = computed(() => {
    return data.value ? data.value.toUpperCase() : ''
  })
  
  // Actions (plain functions)
  const fetchData = async () => {
    // action logic
  }
  
  return {
    // State
    data,
    // Getters
    processedData,
    // Actions
    fetchData
  }
})
```

### Store Organization

- **File structure:** `src/stores/{storeName}.js`
- **Naming convention:** `use{StoreName}Store`
- **Export pattern:** Named export of store definition
- **No subdirectories:** Single file per store

### State Persistence

- **Plugin:** `pinia-plugin-persistedstate`
- **Storage:** localStorage (secure-ls for sensitive data)
- **Configuration:** Per-store persistence settings

## Store Migration Plan

### 1. Account Store

**Current:** `src/store/account/`
**Target:** `src/stores/account.js`

**State to migrate:**
[To be filled after analysis]

**Getters to migrate:**
[To be filled after analysis]

**Actions to migrate:**
[To be filled after analysis]

**Files using this store:**
[To be filled after analysis]

### 2. Admin Store

[Similar structure for each store...]

### 3. CaseReport Store

[Similar structure...]

### 4. Form Store

[Similar structure...]

### 5. Interview Store

[Similar structure...]

### 6. Study Store

[Similar structure...]

### 7. Auth Store (FeathersVuex)

**Current:** `src/store/store.auth.js`
**Target:** `src/stores/auth.js`

**Special considerations:**
- FeathersJS authentication integration
- Real-time data synchronization
- Token management
- Session persistence

[To be filled after FeathersVuex research]

## Setup Syntax Conversion Patterns

### Pattern 1: Simple State

```javascript
// Vuex (before)
export default {
  user: null,
  loading: false
}

// Pinia setup syntax (after)
const user = ref(null)
const loading = ref(false)
```

### Pattern 2: Computed Getters

```javascript
// Vuex (before)
export const isAdmin = (state) => {
  return state.user?.role === 'admin'
}

// Pinia setup syntax (after)
const isAdmin = computed(() => user.value?.role === 'admin')
```

### Pattern 3: Actions with Mutations

```javascript
// Vuex (before)
export const updateUser = ({ commit }, userData) => {
  commit('SET_USER', userData)
}
export const SET_USER = (state, userData) => {
  state.user = userData
}

// Pinia setup syntax (after)
const updateUser = (userData) => {
  user.value = userData
}
```

### Pattern 4: Async Actions

```javascript
// Vuex (before)
export const fetchUser = async ({ commit }, id) => {
  const response = await api.get(`/users/${id}`)
  commit('SET_USER', response.data)
}

// Pinia setup syntax (after)
const fetchUser = async (id) => {
  const response = await api.get(`/users/${id}`)
  user.value = response.data
}
```

## Component Usage Patterns

### Pattern 1: Replace mapState

```vue
<!-- Vuex (before) -->
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('account', ['user', 'loading'])
  }
}
</script>

<!-- Pinia setup syntax (after) -->
<script setup>
import { useAccountStore } from 'stores/account'
const accountStore = useAccountStore()
// Use accountStore.user, accountStore.loading in template
</script>
```

### Pattern 2: Replace mapGetters

```vue
<!-- Vuex (before) -->
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('account', ['isAdmin', 'fullName'])
  }
}
</script>

<!-- Pinia setup syntax (after) -->
<script setup>
import { useAccountStore } from 'stores/account'
const accountStore = useAccountStore()
// Use accountStore.isAdmin, accountStore.fullName in template
</script>
```

### Pattern 3: Replace mapActions

```vue
<!-- Vuex (before) -->
<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions('account', ['updateUser', 'logout'])
  }
}
</script>

<!-- Pinia setup syntax (after) -->
<script setup>
import { useAccountStore } from 'stores/account'
const accountStore = useAccountStore()
// Call accountStore.updateUser(), accountStore.logout()
</script>
```

## Testing Strategy

### Unit Test Pattern

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { useAccountStore } from 'stores/account'

describe('Account Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('should initialize with null user', () => {
    const store = useAccountStore()
    expect(store.user).toBeNull()
  })
  
  it('should update user', () => {
    const store = useAccountStore()
    const userData = { name: 'John', role: 'admin' }
    store.updateUser(userData)
    expect(store.user).toEqual(userData)
  })
  
  it('should compute isAdmin correctly', () => {
    const store = useAccountStore()
    store.updateUser({ role: 'admin' })
    expect(store.isAdmin).toBe(true)
  })
})
```

## Migration Checklist

- [ ] Design store structure for each module
- [ ] Document state, getters, actions for each store
- [ ] Identify files using each store
- [ ] Create setup syntax conversion patterns
- [ ] Plan persistence strategy
- [ ] Design testing approach

EOF
```

Expected: Architecture document template created

- [ ] **Step 3: Analyze each Vuex store module**

For each store module (account, admin, caseReport, form, interview, study), analyze and document:

```bash
cd /home/yannick/projects/amber-studio

# Create analysis script
cat > /tmp/analyze-store.sh << 'EOF'
#!/bin/bash
MODULE=$1

echo "=== Analyzing $MODULE store ==="
echo ""

echo "State properties:"
if [ -f "src/store/$MODULE/state.js" ]; then
  grep -E "^\s+\w+:" src/store/$MODULE/state.js | sed 's/://g' | sed 's/,//g'
fi
echo ""

echo "Getters:"
if [ -f "src/store/$MODULE/getters.js" ]; then
  grep -E "^export (const|function)" src/store/$MODULE/getters.js | sed 's/export const //g' | sed 's/export function //g' | sed 's/ =.*//g'
fi
echo ""

echo "Actions:"
if [ -f "src/store/$MODULE/actions.js" ]; then
  grep -E "^export (const|function)" src/store/$MODULE/actions.js | sed 's/export const //g' | sed 's/export function //g' | sed 's/ =.*//g'
fi
echo ""

echo "Mutations:"
if [ -f "src/store/$MODULE/mutations.js" ]; then
  grep -E "^export (const|function)" src/store/$MODULE/mutations.js | sed 's/export const //g' | sed 's/export function //g' | sed 's/ =.*//g'
fi
echo ""

echo "Files using this store:"
grep -r "mapState.*'$MODULE'" src/ --include="*.vue" --include="*.js" | cut -d: -f1 | sort -u
grep -r "mapGetters.*'$MODULE'" src/ --include="*.vue" --include="*.js" | cut -d: -f1 | sort -u
grep -r "mapActions.*'$MODULE'" src/ --include="*.vue" --include="*.js" | cut -d: -f1 | sort -u
grep -r "\$store.state.$MODULE" src/ --include="*.vue" --include="*.js" | cut -d: -f1 | sort -u
grep -r "\$store.dispatch\('$MODULE" src/ --include="*.vue" --include="*.js" | cut -d: -f1 | sort -u
echo ""
EOF

chmod +x /tmp/analyze-store.sh

# Run analysis for each module
for module in account admin caseReport form interview study; do
  /tmp/analyze-store.sh $module > /tmp/store-analysis-$module.txt
  cat /tmp/store-analysis-$module.txt
done

# Analyze auth store separately
echo "=== Analyzing auth store ==="
if [ -f "src/store/store.auth.js" ]; then
  head -50 src/store/store.auth.js
fi
```

Expected: Analysis output for each store showing state, getters, actions, mutations, and usage

- [ ] **Step 4: Fill in store migration details**

Using the analysis from Step 3, manually fill in each store section in `plans/pinia-architecture.md`:
- State properties to migrate
- Getters to convert to computed
- Actions to merge (actions + mutations)
- Files that use the store

For each store, provide:
- Current Vuex structure
- Target Pinia setup syntax structure
- Estimated complexity (Simple/Medium/Complex)
- Special considerations

Expected: Complete store-by-store migration plan

- [ ] **Step 5: Document state persistence strategy**

Add to `plans/pinia-architecture.md`:

```markdown
## State Persistence Strategy

### Stores Requiring Persistence

| Store | Persist | Storage | Paths | Reason |
|-------|---------|---------|-------|--------|
| account | Yes | SecureLS | all | User session data |
| admin | No | - | - | Temporary admin state |
| caseReport | Yes | localStorage | ['drafts'] | Save unsaved work |
| form | Yes | localStorage | ['drafts'] | Save unsaved work |
| interview | Yes | localStorage | ['drafts'] | Save unsaved work |
| study | No | - | - | Fetched on demand |
| auth | Yes | SecureLS | ['accessToken', 'user'] | Authentication |

### Persistence Configuration

```javascript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import SecureLS from 'secure-ls'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Store-specific configuration
export const useAccountStore = defineStore('account', () => {
  // ... store definition
}, {
  persist: {
    storage: new SecureLS({ encodingType: 'aes' }),
    paths: ['user', 'settings'] // Only persist these
  }
})
```

### Migration from vuex-persistedstate

Current vuex-persistedstate config:
[To be analyzed from src/store/index.js]

Migration approach:
1. Identify currently persisted state
2. Map to Pinia stores
3. Handle data migration if format changes
4. Test persistence across browser refresh
```

Expected: Complete persistence strategy documented

- [ ] **Step 6: Commit Pinia architecture document**

```bash
git add plans/pinia-architecture.md /tmp/store-analysis*.txt
git commit -m "docs: add Pinia store architecture with setup syntax"
```

Expected: Commit created successfully

---

## Task 3: FeathersVuex Migration Strategy

**Files:**
- Create: `plans/feathersvuex-migration.md`

**Goal:** Research and document approach for migrating FeathersVuex authentication to Pinia with setup syntax.

- [ ] **Step 1: Analyze current FeathersVuex usage**

```bash
cd /home/yannick/projects/amber-studio

# Find all FeathersVuex imports
echo "=== FeathersVuex Imports ===" > /tmp/feathers-analysis.txt
grep -r "@feathersjs/vuex" src/ --include="*.js" --include="*.vue" | tee -a /tmp/feathers-analysis.txt

# Analyze auth store
echo -e "\n=== Auth Store Analysis ===" >> /tmp/feathers-analysis.txt
cat src/store/store.auth.js | tee -a /tmp/feathers-analysis.txt

# Analyze feathers boot file
echo -e "\n=== Feathers Boot File ===" >> /tmp/feathers-analysis.txt
cat src/boot/feathersClient.js | tee -a /tmp/feathers-analysis.txt

# Find authentication usage
echo -e "\n=== Authentication Usage ===" >> /tmp/feathers-analysis.txt
grep -r "auth\." src/ --include="*.js" --include="*.vue" | grep -v "node_modules" | head -20 | tee -a /tmp/feathers-analysis.txt

# Find AuthMixin usage
echo -e "\n=== AuthMixin Usage ===" >> /tmp/feathers-analysis.txt
cat src/mixins/AuthMixin.js | tee -a /tmp/feathers-analysis.txt
grep -r "AuthMixin" src/ --include="*.vue" | tee -a /tmp/feathers-analysis.txt
```

Expected: Complete analysis of FeathersVuex usage

- [ ] **Step 2: Research Feathers-Pinia library**

Create research document:

```bash
cat > plans/feathersvuex-migration.md << 'EOF'
# FeathersVuex → Pinia Migration Strategy

**Date:** $(date +%Y-%m-%d)
**Status:** Research

## Current Implementation

### FeathersVuex Usage

**Dependencies:**
- @feathersjs/vuex: 4.0.1-pre.7
- @feathersjs/authentication-client: 4.5.11
- @feathersjs/feathers: 4.5.11

**Current auth store:** `src/store/store.auth.js`

[To be filled with analysis from Step 1]

**Authentication flow:**
[To be documented]

**Real-time synchronization:**
[To be documented]

## Migration Options

### Option 1: Feathers-Pinia (Official Library)

**Library:** https://feathers-pinia.pages.dev/

**Pros:**
- Official integration
- Maintained by Feathers team
- Built for Pinia + FeathersJS
- Handles real-time updates
- Well-documented

**Cons:**
- May have breaking changes from FeathersVuex
- Need to learn new API
- Possible beta/stability issues

**Compatibility:**
- FeathersJS v5 recommended
- Current project uses v4 (need to check compatibility)

**Research needed:**
- [ ] Check Feathers-Pinia compatibility with Feathers v4
- [ ] Review migration guide
- [ ] Test authentication flow
- [ ] Test real-time data sync

### Option 2: Custom Pinia Integration

**Approach:** Build custom Pinia store wrapping FeathersJS client

**Pros:**
- Full control over implementation
- Can match existing API closely
- No external dependency updates

**Cons:**
- More development effort
- Need to handle real-time sync manually
- Maintenance burden

**Implementation approach:**
```javascript
// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import feathersClient from 'src/boot/feathersClient'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const accessToken = ref(null)
  const isAuthenticated = ref(false)
  
  // Getters
  const userId = computed(() => user.value?._id)
  const userRole = computed(() => user.value?.role)
  
  // Actions
  const authenticate = async (credentials) => {
    try {
      const response = await feathersClient.authenticate(credentials)
      accessToken.value = response.accessToken
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (error) {
      throw error
    }
  }
  
  const logout = async () => {
    await feathersClient.logout()
    user.value = null
    accessToken.value = null
    isAuthenticated.value = false
  }
  
  const reAuthenticate = async () => {
    try {
      const response = await feathersClient.reAuthenticate()
      accessToken.value = response.accessToken
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (error) {
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
    userRole,
    // Actions
    authenticate,
    logout,
    reAuthenticate
  }
}, {
  persist: {
    storage: localStorage, // Or SecureLS
    paths: ['accessToken', 'user']
  }
})
```

### Option 3: Hybrid Approach

**Approach:** Keep Vuex for Feathers integration, use Pinia for everything else

**Pros:**
- Lower risk for authentication
- Can migrate other stores first
- Defer FeathersJS migration

**Cons:**
- Two state management systems in codebase
- Technical debt remains
- Doesn't meet "all Pinia" requirement

**Verdict:** Not recommended due to requirement constraints

## Recommended Approach

[To be determined after research]

## Authentication Flow

### Current Flow (FeathersVuex)

```javascript
// Login
this.$store.dispatch('auth/authenticate', { strategy: 'local', email, password })

// Logout
this.$store.dispatch('auth/logout')

// Check auth
this.$store.state.auth.user
this.$store.getters['auth/isAuthenticated']
```

### Target Flow (Pinia with Setup Syntax)

```javascript
// Login
const authStore = useAuthStore()
await authStore.authenticate({ strategy: 'local', email, password })

// Logout
await authStore.logout()

// Check auth
authStore.user
authStore.isAuthenticated
```

## Real-time Data Synchronization

### Current Implementation

[To be documented after analysis]

### Target Implementation

[To be designed based on chosen approach]

## Migration Checklist

- [ ] Research Feathers-Pinia library
- [ ] Check compatibility with Feathers v4
- [ ] Prototype authentication flow
- [ ] Test real-time data sync
- [ ] Document chosen approach
- [ ] Plan AuthMixin → composable migration
- [ ] Identify all files using auth

EOF
```

Expected: FeathersVuex migration document template created

- [ ] **Step 3: Research Feathers-Pinia compatibility**

```bash
# Research Feathers-Pinia
# Visit: https://feathers-pinia.pages.dev/
# Check: GitHub repo, npm package, documentation
# Note: This is manual research - document findings in the markdown file

# Key questions to answer:
# - Is Feathers-Pinia compatible with FeathersJS v4?
# - What's the authentication API?
# - How does real-time sync work?
# - Are there migration guides from FeathersVuex?
# - What's the maturity/stability level?
```

Document findings in `plans/feathersvuex-migration.md` under "Option 1: Feathers-Pinia"

Expected: Research findings documented

- [ ] **Step 4: Analyze authentication requirements**

```bash
cd /home/yannick/projects/amber-studio

# Find all authentication-related code
echo "=== Authentication Flow ===" > /tmp/auth-flow.txt

# Login usage
echo -e "\nLogin usage:" >> /tmp/auth-flow.txt
grep -r "authenticate" src/pages --include="*.vue" -A 3 -B 3 | head -30 | tee -a /tmp/auth-flow.txt

# Logout usage
echo -e "\nLogout usage:" >> /tmp/auth-flow.txt
grep -r "logout" src/ --include="*.vue" -A 2 -B 2 | head -20 | tee -a /tmp/auth-flow.txt

# Auth guards
echo -e "\nRoute guards:" >> /tmp/auth-flow.txt
if [ -f src/router/index.js ]; then
  grep -A 10 "beforeEach" src/router/index.js | tee -a /tmp/auth-flow.txt
fi

cat /tmp/auth-flow.txt
```

Document authentication flow in `plans/feathersvuex-migration.md`

Expected: Complete authentication flow documented

- [ ] **Step 5: Make recommendation**

Based on research, fill in "Recommended Approach" section:
- Chosen option (Feathers-Pinia or Custom)
- Justification
- Risk assessment
- Implementation strategy
- Estimated effort

Expected: Clear recommendation with rationale

- [ ] **Step 6: Commit FeathersVuex migration document**

```bash
git add plans/feathersvuex-migration.md /tmp/feathers-analysis.txt /tmp/auth-flow.txt
git commit -m "docs: add FeathersVuex migration strategy"
```

Expected: Commit created successfully

---

## Task 4: Component Setup Syntax Conversion Plan

**Files:**
- Create: `plans/component-setup-syntax.md`

**Goal:** Document patterns and strategy for converting all 73 Vue components from Options API to setup syntax.

- [ ] **Step 1: Analyze component Options API usage**

```bash
cd /home/yannick/projects/amber-studio

# Count components by type
echo "=== Component Breakdown ===" > /tmp/component-analysis.txt
echo "Pages: $(find src/pages -name "*.vue" | wc -l)" | tee -a /tmp/component-analysis.txt
echo "Components: $(find src/components -name "*.vue" | wc -l)" | tee -a /tmp/component-analysis.txt
echo "Layouts: $(find src/layouts -name "*.vue" | wc -l)" | tee -a /tmp/component-analysis.txt

# Analyze Options API patterns
echo -e "\n=== Options API Pattern Usage ===" >> /tmp/component-analysis.txt

echo -e "\nComponents with data():" >> /tmp/component-analysis.txt
grep -r "^\s*data\s*(" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

echo -e "\nComponents with computed:" >> /tmp/component-analysis.txt
grep -r "^\s*computed\s*:" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

echo -e "\nComponents with methods:" >> /tmp/component-analysis.txt
grep -r "^\s*methods\s*:" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

echo -e "\nComponents with mounted:" >> /tmp/component-analysis.txt
grep -r "^\s*mounted\s*(" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

echo -e "\nComponents with watch:" >> /tmp/component-analysis.txt
grep -r "^\s*watch\s*:" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

echo -e "\nComponents with props:" >> /tmp/component-analysis.txt
grep -r "^\s*props\s*:" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

echo -e "\nComponents with emits:" >> /tmp/component-analysis.txt
grep -r "^\s*emits\s*:" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

# Find mapState/mapGetters/mapActions usage
echo -e "\n=== Vuex Helper Usage ===" >> /tmp/component-analysis.txt
echo -e "\nComponents with mapState:" >> /tmp/component-analysis.txt
grep -r "mapState" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

echo -e "\nComponents with mapGetters:" >> /tmp/component-analysis.txt
grep -r "mapGetters" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

echo -e "\nComponents with mapActions:" >> /tmp/component-analysis.txt
grep -r "mapActions" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

# Find $store direct access
echo -e "\nComponents with \$store access:" >> /tmp/component-analysis.txt
grep -r "\$store" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

# Find Quasar plugin usage
echo -e "\n=== Quasar Plugin Usage ===" >> /tmp/component-analysis.txt
echo -e "\nComponents using \$q:" >> /tmp/component-analysis.txt
grep -r "this\.\$q" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

echo -e "\nComponents using \$router:" >> /tmp/component-analysis.txt
grep -r "this\.\$router" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

echo -e "\nComponents using \$route:" >> /tmp/component-analysis.txt
grep -r "this\.\$route" src/ --include="*.vue" -l | wc -l | tee -a /tmp/component-analysis.txt

cat /tmp/component-analysis.txt
```

Expected: Complete component Options API usage statistics

- [ ] **Step 2: Create component conversion document**

```bash
cat > plans/component-setup-syntax.md << 'EOF'
# Component Setup Syntax Conversion Plan

**Date:** $(date +%Y-%m-%d)
**Status:** Planning

## Overview

Convert all 73 Vue components from Options API to `<script setup>` syntax (Composition API).

## Component Inventory

[To be filled from analysis]

**Total:** 73 Vue files
- **Pages:** [count] files
- **Components:** [count] files
- **Layouts:** [count] files

## Options API Pattern Distribution

[To be filled from analysis]

## Setup Syntax Conversion Patterns

### Pattern 1: data() → ref/reactive

```vue
<!-- Before (Options API) -->
<script>
export default {
  data() {
    return {
      message: 'Hello',
      count: 0,
      user: { name: '', email: '' }
    }
  }
}
</script>

<!-- After (Setup Syntax) -->
<script setup>
import { ref, reactive } from 'vue'

const message = ref('Hello')
const count = ref(0)
const user = reactive({ name: '', email: '' })
</script>
```

**Rule:** Use `ref()` for primitives, `reactive()` for objects (or ref for all).

### Pattern 2: computed → computed()

```vue
<!-- Before (Options API) -->
<script>
export default {
  computed: {
    doubleCount() {
      return this.count * 2
    },
    fullName() {
      return `${this.firstName} ${this.lastName}`
    }
  }
}
</script>

<!-- After (Setup Syntax) -->
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const firstName = ref('')
const lastName = ref('')

const doubleCount = computed(() => count.value * 2)
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
</script>
```

### Pattern 3: methods → plain functions

```vue
<!-- Before (Options API) -->
<script>
export default {
  methods: {
    increment() {
      this.count++
    },
    async fetchData() {
      const response = await api.get('/data')
      this.data = response.data
    }
  }
}
</script>

<!-- After (Setup Syntax) -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
const data = ref(null)

const increment = () => {
  count.value++
}

const fetchData = async () => {
  const response = await api.get('/data')
  data.value = response.data
}
</script>
```

### Pattern 4: Lifecycle hooks

```vue
<!-- Before (Options API) -->
<script>
export default {
  mounted() {
    console.log('Component mounted')
    this.fetchData()
  },
  unmounted() {
    console.log('Component unmounted')
  }
}
</script>

<!-- After (Setup Syntax) -->
<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('Component mounted')
  fetchData()
})

onUnmounted(() => {
  console.log('Component unmounted')
})
</script>
```

### Pattern 5: watch → watch/watchEffect

```vue
<!-- Before (Options API) -->
<script>
export default {
  watch: {
    count(newValue, oldValue) {
      console.log(`Count changed from ${oldValue} to ${newValue}`)
    },
    user: {
      deep: true,
      handler(newUser) {
        this.saveUser(newUser)
      }
    }
  }
}
</script>

<!-- After (Setup Syntax) -->
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)
const user = ref({ name: '', email: '' })

watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

watch(user, (newUser) => {
  saveUser(newUser)
}, { deep: true })
</script>
```

### Pattern 6: props → defineProps()

```vue
<!-- Before (Options API) -->
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<!-- After (Setup Syntax) -->
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  }
})

// Access: props.title, props.items
</script>
```

### Pattern 7: emits → defineEmits()

```vue
<!-- Before (Options API) -->
<script>
export default {
  emits: ['update', 'delete'],
  methods: {
    handleUpdate() {
      this.$emit('update', data)
    }
  }
}
</script>

<!-- After (Setup Syntax) -->
<script setup>
const emit = defineEmits(['update', 'delete'])

const handleUpdate = () => {
  emit('update', data)
}
</script>
```

### Pattern 8: this.$router → useRouter()

```vue
<!-- Before (Options API) -->
<script>
export default {
  methods: {
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>

<!-- After (Setup Syntax) -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.push('/')
}
</script>
```

### Pattern 9: this.$route → useRoute()

```vue
<!-- Before (Options API) -->
<script>
export default {
  computed: {
    userId() {
      return this.$route.params.id
    }
  }
}
</script>

<!-- After (Setup Syntax) -->
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const userId = computed(() => route.params.id)
</script>
```

### Pattern 10: this.$q → useQuasar()

```vue
<!-- Before (Options API) -->
<script>
export default {
  methods: {
    showNotification() {
      this.$q.notify({
        message: 'Success!',
        color: 'positive'
      })
    }
  }
}
</script>

<!-- After (Setup Syntax) -->
<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

const showNotification = () => {
  $q.notify({
    message: 'Success!',
    color: 'positive'
  })
}
</script>
```

### Pattern 11: Vuex mapState → Pinia store

```vue
<!-- Before (Options API + Vuex) -->
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('account', ['user', 'loading'])
  }
}
</script>

<!-- After (Setup Syntax + Pinia) -->
<script setup>
import { useAccountStore } from 'stores/account'

const accountStore = useAccountStore()
// Use accountStore.user, accountStore.loading in template
</script>
```

### Pattern 12: Mixins → Composables

```vue
<!-- Before (Options API + Mixin) -->
<script>
import AuthMixin from 'mixins/AuthMixin'
export default {
  mixins: [AuthMixin],
  methods: {
    handleAction() {
      if (this.isAuthenticated) {
        // do something
      }
    }
  }
}
</script>

<!-- After (Setup Syntax + Composable) -->
<script setup>
import { useAuth } from 'composables/useAuth'

const { isAuthenticated, user, login, logout } = useAuth()

const handleAction = () => {
  if (isAuthenticated.value) {
    // do something
  }
}
</script>
```

## Conversion Strategy

### Phase 1: Layouts (2 files, 0.5 days)
- Convert MainLayout.vue
- Convert EmptyLayout.vue (if exists)
- Test layout functionality

### Phase 2: Pages - Batch 1 (~10 files, 3 days)
Priority: Most critical/complex pages
- Convert high-traffic pages first
- Test each page after conversion
- Verify routing works

### Phase 3: Pages - Batch 2 (~10 files, 3 days)
- Continue page conversion
- Test functionality

### Phase 4: Pages - Batch 3 (~9 files, 2 days)
- Complete remaining pages
- Full page regression test

### Phase 5: Components (~42 files, 3 days)
- Convert in order of usage (most-used first)
- Test in isolation where possible
- Test integration with pages

### Phase 6: Mixins → Composables (1 day)
- Convert AuthMixin to useAuth composable
- Convert other mixins if any
- Update all consuming components

## Conversion Checklist (Per Component)

```markdown
### Component: [filename.vue]

- [ ] Analyze current Options API usage
- [ ] Create setup syntax version
- [ ] Convert data → ref/reactive
- [ ] Convert computed → computed()
- [ ] Convert methods → functions
- [ ] Convert lifecycle hooks
- [ ] Convert watch → watch()
- [ ] Convert props → defineProps()
- [ ] Convert emits → defineEmits()
- [ ] Replace this.$router with useRouter()
- [ ] Replace this.$route with useRoute()
- [ ] Replace this.$q with useQuasar()
- [ ] Replace Vuex with Pinia store
- [ ] Replace mixins with composables
- [ ] Update template (remove this.)
- [ ] Test component functionality
- [ ] Test component props/events
- [ ] Commit changes
```

## Testing Strategy

### Manual Testing
- [ ] Component renders correctly
- [ ] Props work as expected
- [ ] Events emit correctly
- [ ] Methods execute properly
- [ ] Computed properties update
- [ ] Watchers trigger correctly
- [ ] Lifecycle hooks run at right time

### Automated Testing
- [ ] Unit tests updated for setup syntax
- [ ] Integration tests pass
- [ ] E2E tests pass

## Common Pitfalls

### Pitfall 1: Forgetting .value
```javascript
// ❌ Wrong
const count = ref(0)
count++ // Won't work!

// ✅ Correct
const count = ref(0)
count.value++
```

### Pitfall 2: Using .value in templates
```vue
<!-- ❌ Wrong -->
<template>
  <div>{{ count.value }}</div>
</template>

<!-- ✅ Correct -->
<template>
  <div>{{ count }}</div>
</template>
```

### Pitfall 3: Not importing Vue functions
```javascript
// ❌ Wrong
<script setup>
const data = ref(null) // ref is not defined!
</script>

// ✅ Correct
<script setup>
import { ref } from 'vue'
const data = ref(null)
</script>
```

### Pitfall 4: Destructuring reactive objects
```javascript
// ❌ Wrong - loses reactivity
const { user, loading } = accountStore

// ✅ Correct - use toRefs
import { toRefs } from 'vue'
const { user, loading } = toRefs(accountStore)

// ✅ Also correct - don't destructure
const accountStore = useAccountStore()
// Use accountStore.user, accountStore.loading
```

## Batch Conversion Priority

| Priority | Component Type | Count | Reason |
|----------|---------------|-------|--------|
| 1 | Layouts | 2 | Used by all pages |
| 2 | Auth pages | ~3 | Critical functionality |
| 3 | Dashboard | ~2 | High traffic |
| 4 | Remaining pages | ~24 | Lower priority |
| 5 | Shared components | ~20 | Used by multiple pages |
| 6 | Page-specific components | ~22 | Can be done last |

## Migration Checklist

- [ ] Analyze all 73 components
- [ ] Document Options API usage patterns
- [ ] Create conversion patterns documentation
- [ ] Prioritize component conversion order
- [ ] Plan testing strategy
- [ ] Identify common pitfalls

EOF
```

Expected: Component conversion document template created

- [ ] **Step 3: Fill in component inventory**

Using analysis from Step 1, fill in component counts and pattern distribution in `plans/component-setup-syntax.md`

Expected: Complete component inventory documented

- [ ] **Step 4: Create prioritized component list**

```bash
cd /home/yannick/projects/amber-studio

# Create prioritized list of components to convert
cat > /tmp/component-priority.txt << 'EOF'
# Component Conversion Priority List

## Batch 1: Layouts (2 files)
EOF

find src/layouts -name "*.vue" -type f | sort >> /tmp/component-priority.txt

cat >> /tmp/component-priority.txt << 'EOF'

## Batch 2: Pages - High Priority (~10 files)
# TODO: Identify high-traffic/critical pages
# Examples: Login, Dashboard, Home
EOF

find src/pages -name "*.vue" -type f | head -10 >> /tmp/component-priority.txt

cat >> /tmp/component-priority.txt << 'EOF'

## Batch 3: Pages - Medium Priority (~10 files)
EOF

find src/pages -name "*.vue" -type f | tail -n +11 | head -10 >> /tmp/component-priority.txt

cat >> /tmp/component-priority.txt << 'EOF'

## Batch 4: Pages - Remaining
EOF

find src/pages -name "*.vue" -type f | tail -n +21 >> /tmp/component-priority.txt

cat >> /tmp/component-priority.txt << 'EOF'

## Batch 5: Components
EOF

find src/components -name "*.vue" -type f | sort >> /tmp/component-priority.txt

cat /tmp/component-priority.txt
```

Add this list to the document with proper prioritization based on:
- Frequency of use
- Complexity
- Dependencies

Expected: Prioritized component conversion list

- [ ] **Step 5: Document testing approach**

Add detailed testing strategy for each conversion pattern to ensure no regressions

Expected: Complete testing strategy documented

- [ ] **Step 6: Commit component conversion plan**

```bash
git add plans/component-setup-syntax.md /tmp/component-analysis.txt /tmp/component-priority.txt
git commit -m "docs: add component setup syntax conversion plan"
```

Expected: Commit created successfully

---

## Task 5: Static Import Analysis and Strategy

**Files:**
- Create: `plans/static-import-strategy.md`

**Goal:** Analyze all dynamic imports and create strategy for converting to static imports.

- [ ] **Step 1: Find all dynamic imports**

```bash
cd /home/yannick/projects/amber-studio

echo "=== Dynamic Import Analysis ===" > /tmp/dynamic-import-analysis.txt

# Find all import() calls
echo -e "\n--- import() usage ---" >> /tmp/dynamic-import-analysis.txt
grep -rn "import(" src/ --include="*.js" --include="*.vue" | tee -a /tmp/dynamic-import-analysis.txt

# Find defineAsyncComponent usage
echo -e "\n--- defineAsyncComponent usage ---" >> /tmp/dynamic-import-analysis.txt
grep -rn "defineAsyncComponent" src/ --include="*.js" --include="*.vue" | tee -a /tmp/dynamic-import-analysis.txt

# Analyze route configuration
echo -e "\n--- Route lazy loading ---" >> /tmp/dynamic-import-analysis.txt
if [ -f src/router/routes.js ]; then
  cat src/router/routes.js | tee -a /tmp/dynamic-import-analysis.txt
fi
if [ -f src/router/index.js ]; then
  cat src/router/index.js | tee -a /tmp/dynamic-import-analysis.txt
fi

# Count dynamic imports
echo -e "\n--- Summary ---" >> /tmp/dynamic-import-analysis.txt
echo "Total import() calls: $(grep -r "import(" src/ --include="*.js" --include="*.vue" | wc -l)" | tee -a /tmp/dynamic-import-analysis.txt
echo "Total defineAsyncComponent calls: $(grep -r "defineAsyncComponent" src/ --include="*.js" --include="*.vue" | wc -l)" | tee -a /tmp/dynamic-import-analysis.txt

cat /tmp/dynamic-import-analysis.txt
```

Expected: Complete list of all dynamic imports in the codebase

- [ ] **Step 2: Analyze bundle size impact**

```bash
cd /home/yannick/projects/amber-studio

# Check current build output (if exists)
if [ -d dist/spa ]; then
  echo "=== Current Build Size ===" > /tmp/bundle-analysis.txt
  du -sh dist/spa >> /tmp/bundle-analysis.txt
  echo -e "\nJavaScript bundles:" >> /tmp/bundle-analysis.txt
  find dist/spa/js -name "*.js" -exec ls -lh {} \; | awk '{print $5, $9}' >> /tmp/bundle-analysis.txt
  cat /tmp/bundle-analysis.txt
else
  echo "No existing build found. Will need to build to analyze bundle size."
fi

# Estimate components and pages
echo -e "\n=== Code Size Estimate ===" >> /tmp/bundle-analysis.txt
echo "Total pages: $(find src/pages -name "*.vue" | wc -l)" >> /tmp/bundle-analysis.txt
echo "Total components: $(find src/components -name "*.vue" | wc -l)" >> /tmp/bundle-analysis.txt
echo "Total Vue files: $(find src -name "*.vue" | wc -l)" >> /tmp/bundle-analysis.txt

# Calculate total lines of code
echo -e "\nTotal Vue file lines: $(find src -name "*.vue" -exec cat {} \; | wc -l)" >> /tmp/bundle-analysis.txt
echo "Total JS file lines: $(find src -name "*.js" -exec cat {} \; | wc -l)" >> /tmp/bundle-analysis.txt
```

Expected: Bundle size analysis and LOC counts

- [ ] **Step 3: Create static import strategy document**

```bash
cat > plans/static-import-strategy.md << 'EOF'
# Static Import Strategy

**Date:** $(date +%Y-%m-%d)
**Status:** Planning

## Requirement

**No dynamic imports allowed** - All imports must be static for Vite compatibility.

## Current Dynamic Import Usage

[To be filled from analysis]

**Total dynamic imports:** [count]
**Locations:**
- Router: [count]
- Components: [count]
- Other: [count]

## Static Import Conversion Patterns

### Pattern 1: Route Lazy Loading → Static Imports

```javascript
// Before (Dynamic - NOT ALLOWED)
const routes = [
  {
    path: '/admin',
    component: () => import('pages/Admin.vue')
  },
  {
    path: '/dashboard',
    component: () => import('pages/Dashboard.vue')
  }
]

// After (Static - REQUIRED)
import Admin from 'pages/Admin.vue'
import Dashboard from 'pages/Dashboard.vue'

const routes = [
  {
    path: '/admin',
    component: Admin
  },
  {
    path: '/dashboard',
    component: Dashboard
  }
]
```

### Pattern 2: defineAsyncComponent → Direct Import

```javascript
// Before (Dynamic - NOT ALLOWED)
import { defineAsyncComponent } from 'vue'

const MyComponent = defineAsyncComponent(() =>
  import('components/MyComponent.vue')
)

// After (Static - REQUIRED)
import MyComponent from 'components/MyComponent.vue'
```

### Pattern 3: Conditional Component Loading → v-if

```vue
<!-- Before (Dynamic - NOT ALLOWED) -->
<script>
export default {
  computed: {
    currentComponent() {
      return () => import(`components/${this.componentName}.vue`)
    }
  }
}
</script>

<!-- After (Static - REQUIRED) -->
<script setup>
import ComponentA from 'components/ComponentA.vue'
import ComponentB from 'components/ComponentB.vue'
import ComponentC from 'components/ComponentC.vue'

const props = defineProps(['componentName'])

// Use v-if in template to show correct component
</script>

<template>
  <component-a v-if="componentName === 'ComponentA'" />
  <component-b v-if="componentName === 'ComponentB'" />
  <component-c v-if="componentName === 'ComponentC'" />
</template>
```

## Bundle Size Optimization Strategies

Since we can't use route-level code splitting via dynamic imports, we need alternative strategies:

### Strategy 1: Vite Manual Chunking

```javascript
// vite.config.js (via quasar.config.js)
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-quasar': ['quasar'],
          'vendor-feathers': ['@feathersjs/feathers', '@feathersjs/authentication-client'],
          
          // Feature chunks
          'pages-admin': [
            'src/pages/admin/Users.vue',
            'src/pages/admin/Settings.vue',
            // ... other admin pages
          ],
          'pages-reports': [
            'src/pages/reports/CaseReport.vue',
            // ... other report pages
          ]
        }
      }
    }
  }
}
```

### Strategy 2: Tree Shaking

Ensure proper tree shaking by:
- Using named imports only
- Avoiding barrel exports
- Removing unused code
- Using production builds

### Strategy 3: Component Optimization

- Remove unused Quasar components from imports
- Lazy load heavy libraries (charts, editors) at component level with suspense
- Optimize images and assets

### Strategy 4: Route-Based Layouts

Instead of lazy-loading routes, use layouts to separate concerns:

```javascript
// Group routes by layout
import MainLayout from 'layouts/MainLayout.vue'
import AdminLayout from 'layouts/AdminLayout.vue'

// Admin routes use AdminLayout
// Regular routes use MainLayout
// This provides some logical separation even without code splitting
```

## Impact Analysis

### Current State (With Dynamic Imports)
- **Initial bundle:** [size] KB
- **Lazy chunks:** [count]
- **Largest chunk:** [size] KB

### Projected State (Static Imports Only)
- **Initial bundle:** [estimated size] KB
- **Vendor chunks:** [estimated count]
- **Manual chunks:** [estimated count]

**Increase estimate:** ~[X]% larger initial bundle

### Mitigation
- Aggressive tree shaking
- Manual chunking strategy
- Asset optimization
- Caching strategy

## Conversion Checklist

- [ ] Identify all dynamic imports
- [ ] Convert router lazy loading to static imports
- [ ] Convert defineAsyncComponent to static imports
- [ ] Remove conditional component imports
- [ ] Configure manual chunking in Vite
- [ ] Test bundle sizes
- [ ] Optimize if bundle too large
- [ ] Document any workarounds needed

## Files Requiring Changes

### Router Configuration
- [ ] `src/router/routes.js` - Convert all route component imports to static
- [ ] `src/router/index.js` - Verify no dynamic imports

### Component Files
[To be filled with specific files using dynamic imports]

### Other Files
[To be filled]

EOF
```

Expected: Static import strategy document template created

- [ ] **Step 4: Fill in analysis findings**

Add the findings from Step 1 and Step 2 to the document:
- Count of dynamic imports
- Specific file locations
- Current bundle sizes (if available)
- Estimated impact of static imports

Expected: Complete analysis documented

- [ ] **Step 5: Design manual chunking strategy**

Create a detailed manual chunking configuration for Vite:

```bash
cd /home/yannick/projects/amber-studio

# Group components by feature for manual chunking
cat > /tmp/manual-chunks.js << 'EOF'
// Suggested manual chunking strategy for static imports

export const manualChunks = {
  // Core vendor chunks
  'vendor-vue': ['vue', 'vue-router', 'pinia'],
  'vendor-quasar': ['quasar', '@quasar/extras'],
  'vendor-feathers': [
    '@feathersjs/feathers',
    '@feathersjs/authentication-client',
    '@feathersjs/rest-client'
  ],
  'vendor-forms': ['@vuelidate/core', '@vuelidate/validators', '@blitzar/form'],
  'vendor-utils': ['axios', 'marked', 'echarts', 'uuid'],
  
  // Feature-based chunks (pages grouped by functionality)
  'pages-auth': [
    // Auth-related pages
    '/src/pages/Login.vue',
    '/src/pages/Register.vue',
    '/src/pages/ForgotPassword.vue'
  ],
  'pages-admin': [
    // Admin pages
    // List all admin-related page paths here
  ],
  'pages-reports': [
    // Report pages
    // List all report-related page paths here
  ],
  'pages-forms': [
    // Form pages
  ],
  
  // Component chunks
  'components-shared': [
    // Shared components used across features
  ]
}

EOF

cat /tmp/manual-chunks.js
```

Document this in the strategy

Expected: Manual chunking configuration designed

- [ ] **Step 6: Commit static import strategy**

```bash
git add plans/static-import-strategy.md /tmp/dynamic-import-analysis.txt /tmp/bundle-analysis.txt /tmp/manual-chunks.js
git commit -m "docs: add static import conversion strategy"
```

Expected: Commit created successfully

---

## Task 6: Phase 1 Summary and Review

**Files:**
- Create: `plans/phase1-summary.md`
- Update: `plans/2026-05-29-studio-quasar-pinia.md`

**Goal:** Summarize Phase 1 findings, create decision log, and prepare for Phase 2.

- [ ] **Step 1: Create Phase 1 summary document**

```bash
cat > plans/phase1-summary.md << 'EOF'
# Phase 1: Planning & Architecture - Summary

**Completion Date:** $(date +%Y-%m-%d)
**Status:** Complete

## Documents Created

1. **Migration Strategy** (`plans/migration-strategy.md`)
   - Quasar 3 breaking changes
   - Vite migration requirements
   - Extension upgrade plan
   - Decision log

2. **Pinia Architecture** (`plans/pinia-architecture.md`)
   - Store-by-store migration plan
   - Setup syntax patterns
   - State persistence strategy
   - Testing approach

3. **FeathersVuex Migration** (`plans/feathersvuex-migration.md`)
   - Migration options analysis
   - Recommended approach
   - Authentication flow design
   - Real-time sync strategy

4. **Component Setup Syntax** (`plans/component-setup-syntax.md`)
   - Conversion patterns (12 patterns)
   - Prioritized component list
   - Testing strategy
   - Common pitfalls

5. **Static Import Strategy** (`plans/static-import-strategy.md`)
   - Dynamic import analysis
   - Static conversion patterns
   - Bundle optimization strategy
   - Manual chunking configuration

## Key Decisions

### Decision 1: FeathersVuex Migration Approach
**Decision:** [Feathers-Pinia / Custom Integration]
**Rationale:** [To be filled]
**Risks:** [To be filled]
**Mitigation:** [To be filled]

### Decision 2: Manual Chunking Strategy
**Decision:** Feature-based manual chunks with Vite
**Rationale:** Required due to no dynamic imports constraint
**Impact:** Larger initial bundle, but predictable loading
**Mitigation:** Aggressive tree shaking, vendor chunk separation

### Decision 3: Component Conversion Order
**Decision:** Layouts → Pages (priority batches) → Components
**Rationale:** Top-down approach, test critical paths first
**Timeline:** 10-12 days for 73 components

### Decision 4: Extension Upgrade Approach
**Decision:** [To be filled based on availability]
- @obiba/quasar-app-extension-amber: 1.2.0 (required)
- Other extensions: Latest v3 compatible versions
**Fallback:** Fork/fix if needed

## Risk Assessment

### High Risks
1. **FeathersVuex → Pinia migration complexity**
   - Risk Level: 8/10
   - Mitigation: [Strategy from feathersvuex-migration.md]

2. **Bundle size increase from static imports**
   - Risk Level: 6/10
   - Mitigation: Manual chunking, tree shaking, optimization

3. **Extension compatibility**
   - Risk Level: 7/10
   - Mitigation: Early testing, fallback plans

### Medium Risks
1. **Setup syntax conversion scope**
   - Risk Level: 5/10
   - Mitigation: Batch approach, thorough testing

2. **Vite configuration complexity**
   - Risk Level: 5/10
   - Mitigation: Research completed, examples documented

### Low Risks
1. **Quasar 3 component updates**
   - Risk Level: 3/10
   - Mitigation: Well-documented migration path

## Metrics

- **Files to create:** ~6 new stores + ~73 converted components
- **Files to modify:** ~73 components + ~10 boot files + config files
- **Lines of code to migrate:** ~3,000+ LOC in stores + ~8,000+ LOC in components
- **Testing required:** Unit tests for stores + component tests + integration tests

## Readiness for Phase 2

### Prerequisites Met
- [x] Quasar 3 breaking changes documented
- [x] Vite migration strategy defined
- [x] Pinia architecture designed
- [x] FeathersVuex approach decided
- [x] Setup syntax patterns documented
- [x] Static import strategy created

### Go/No-Go Decision
**Status:** [GO / NO-GO]

**Blockers (if any):**
- [ ] None

**Recommendations:**
- Proceed to Phase 2: Core Framework Migration
- Allocate 1.5-2.0 FTE for Phase 2 (5-7 days)
- Setup development branch for migration work
- Prepare rollback strategy

## Next Steps

1. **Create migration branch**
   ```bash
   git checkout -b migration/quasar3-vite-pinia
   git push -u origin migration/quasar3-vite-pinia
   ```

2. **Setup development environment**
   - Backup current node_modules
   - Document current package versions
   - Prepare test environment

3. **Begin Phase 2: Core Framework Migration**
   - Update dependencies
   - Configure Vite
   - Convert static imports
   - Migrate boot files

## Lessons Learned (To be filled during Phase 2+)

[This section will be updated as we progress]

---

**Phase 1 Duration:** [X] days
**Team:** [Names]
**Next Review:** After Phase 2 completion

EOF
```

Expected: Phase 1 summary template created

- [ ] **Step 2: Fill in key decisions**

Review all planning documents and fill in the "Key Decisions" section with actual decisions made during planning

Expected: All key decisions documented

- [ ] **Step 3: Update master migration plan**

Update `plans/2026-05-29-studio-quasar-pinia.md` to mark Phase 1 as complete and add any adjustments based on planning findings:

```bash
cd /home/yannick/projects/amber-studio

# Add Phase 1 completion note
cat >> plans/2026-05-29-studio-quasar-pinia.md << 'EOF'

---

## Phase 1 Completion Notes

**Completed:** $(date +%Y-%m-%d)
**Status:** Planning phase complete

### Planning Documents
- [x] Migration Strategy (`plans/migration-strategy.md`)
- [x] Pinia Architecture (`plans/pinia-architecture.md`)
- [x] FeathersVuex Migration (`plans/feathersvuex-migration.md`)
- [x] Component Setup Syntax (`plans/component-setup-syntax.md`)
- [x] Static Import Strategy (`plans/static-import-strategy.md`)
- [x] Phase 1 Summary (`plans/phase1-summary.md`)

### Key Findings
[Add findings from Phase 1 work]

### Adjustments to Original Plan
[Document any timeline, approach, or scope adjustments]

### Ready for Phase 2
- [x] All research complete
- [x] Architecture decisions made
- [x] Risks identified and mitigation planned
- [ ] Development branch created
- [ ] Team aligned on approach

EOF
```

Expected: Master plan updated with Phase 1 completion

- [ ] **Step 4: Create Phase 2 kick-off checklist**

```bash
cat > plans/phase2-kickoff-checklist.md << 'EOF'
# Phase 2: Core Framework Migration - Kick-off Checklist

**Phase:** Core Framework Migration (Quasar 3 + Vite + Static Imports)
**Duration:** 5-7 days
**Prerequisites:** Phase 1 complete

## Pre-Migration Checklist

### Environment Setup
- [ ] Backup current codebase (git tag)
- [ ] Create migration branch
- [ ] Document current node/yarn versions
- [ ] Backup package.json and yarn.lock
- [ ] Document current build configuration

### Team Preparation
- [ ] Review all Phase 1 planning documents
- [ ] Align on migration approach
- [ ] Assign responsibilities
- [ ] Setup daily check-in schedule
- [ ] Define success criteria

### Development Environment
- [ ] Clear node_modules: `rm -rf node_modules`
- [ ] Clear yarn cache: `yarn cache clean`
- [ ] Clear Quasar cache: `rm -rf .quasar`
- [ ] Clear dist: `rm -rf dist`

### Backup & Rollback Plan
- [ ] Create git tag: `git tag pre-phase2-$(date +%Y%m%d)`
- [ ] Push tag: `git push origin --tags`
- [ ] Document rollback procedure
- [ ] Test rollback procedure

## Migration Order

1. **Dependencies Update** (Task 2.1)
2. **Vite Configuration** (Task 2.2)
3. **Static Import Conversion** (Task 2.3)
4. **Boot Files Migration** (Task 2.4)
5. **Asset Import Updates** (Task 2.5)

## Success Criteria

- [ ] Project builds successfully with Vite (dev mode)
- [ ] Project builds successfully with Vite (production mode)
- [ ] All pages load without errors
- [ ] No dynamic imports in codebase
- [ ] All Quasar plugins work
- [ ] All extensions load correctly
- [ ] Build time < 2 minutes (dev)
- [ ] Build time < 5 minutes (prod)

## Emergency Contacts

- **Project Lead:** [Name/Contact]
- **Tech Lead:** [Name/Contact]
- **Quasar Expert:** [Name/Contact]
- **DevOps:** [Name/Contact]

## Notes

[Add any additional notes or concerns before starting Phase 2]

---

**Created:** $(date +%Y-%m-%d)
**Status:** Ready to begin

EOF
```

Expected: Phase 2 kick-off checklist created

- [ ] **Step 5: Review all Phase 1 documents**

Manually review all created documents to ensure:
- All sections are filled in (no [To be filled] remaining)
- Decisions are clear and justified
- Risks are identified with mitigation
- Code examples are correct and complete
- Next steps are clear

Create a review checklist:

```bash
cat > /tmp/phase1-review-checklist.txt << 'EOF'
# Phase 1 Document Review Checklist

## Migration Strategy (plans/migration-strategy.md)
- [ ] All breaking changes documented
- [ ] Vite requirements complete
- [ ] Extension upgrades planned
- [ ] No [To be filled] placeholders
- [ ] Code examples tested

## Pinia Architecture (plans/pinia-architecture.md)
- [ ] All 7 stores analyzed
- [ ] Setup syntax patterns documented
- [ ] Component usage patterns clear
- [ ] Persistence strategy defined
- [ ] Testing approach outlined

## FeathersVuex Migration (plans/feathersvuex-migration.md)
- [ ] All options evaluated
- [ ] Decision made (Feathers-Pinia or Custom)
- [ ] Authentication flow designed
- [ ] Real-time sync approach defined
- [ ] Risk mitigation planned

## Component Setup Syntax (plans/component-setup-syntax.md)
- [ ] All 12 conversion patterns documented
- [ ] Component inventory complete
- [ ] Priority list created
- [ ] Testing strategy defined
- [ ] Common pitfalls documented

## Static Import Strategy (plans/static-import-strategy.md)
- [ ] All dynamic imports identified
- [ ] Conversion patterns documented
- [ ] Manual chunking strategy designed
- [ ] Bundle optimization planned
- [ ] Impact analysis complete

## Phase 1 Summary (plans/phase1-summary.md)
- [ ] All key decisions documented
- [ ] Risk assessment complete
- [ ] Metrics calculated
- [ ] Go/No-Go decision made
- [ ] Next steps clear

EOF

cat /tmp/phase1-review-checklist.txt
```

Work through this checklist and address any gaps

Expected: All documents reviewed and complete

- [ ] **Step 6: Final commit**

```bash
git add plans/phase1-summary.md plans/phase2-kickoff-checklist.md plans/2026-05-29-studio-quasar-pinia.md
git commit -m "docs: complete phase 1 planning and architecture

- Created comprehensive migration strategy
- Designed Pinia store architecture with setup syntax  
- Defined FeathersVuex migration approach
- Documented component setup syntax conversion patterns
- Analyzed static import requirements and optimization
- Summarized findings and prepared for Phase 2

All planning documents complete and ready for implementation."
```

Expected: Final commit created successfully

- [ ] **Step 7: Create Phase 1 completion tag**

```bash
git tag -a phase1-complete-$(date +%Y%m%d) -m "Phase 1: Planning & Architecture complete

All research and architectural planning completed for:
- Quasar 3 + Vite migration  
- Vuex → Pinia with setup syntax
- Options API → Setup syntax (73 components)
- Dynamic → Static imports

Ready to begin Phase 2: Core Framework Migration"

git push origin --tags
```

Expected: Git tag created and pushed

---

## Phase 1 Completion Summary

**Total Tasks:** 6 major tasks
**Total Steps:** ~35 detailed steps
**Estimated Duration:** 3-4 days
**Deliverables:**
- 5 comprehensive planning documents
- 1 phase summary document  
- 1 phase 2 kick-off checklist
- Complete architectural foundation for migration

**Next Phase:** Phase 2 - Core Framework Migration (5-7 days)

---

## Notes for Execution

### Using Subagent-Driven Development (Recommended)
- Execute one task at a time
- Review outputs after each task
- Adjust next task based on findings
- Commit frequently

### Using Inline Execution
- Execute tasks in sequence
- Review after each major milestone (every 2 tasks)
- Have checkpoints for validation

### Manual Execution
- Follow the step-by-step instructions
- Don't skip steps (especially analysis steps)
- Fill in all [To be filled] sections
- Review examples for accuracy

---

**Plan Version:** 1.0
**Created:** $(date +%Y-%m-%d)
**Estimated Effort:** 3-4 days
**Prerequisites:** Codebase analysis complete
**Success Criteria:** All planning documents complete, decisions made, ready for Phase 2
