# Phase 2: Foundation - Kick-off Checklist

**Phase:** Foundation (Quasar 2.19.3 + Vite Setup)  
**Prerequisites:** Phase 1 Complete ✅  
**Date:** 2026-05-31

---

## Extension Compatibility: VERIFIED ✅

**Status:** All extensions verified, unused extensions identified for removal

### Extension Verification Results

- [x] **@obiba/quasar-app-extension-amber** ✅ **VERIFIED**
  - Current: v1.1.6
  - Target: v1.2.0 (exact)
  - Status: **CONFIRMED** by maintainer (Yannick Marcon)
  - Decision: **GO** - Upgrade to v1.2.0 during Phase 2

- [x] **@quasar/quasar-app-extension-qcalendar** ❌ **NOT USED**
  - Current: v4.0.0-beta.16
  - Usage: 0 occurrences in codebase
  - Decision: **REMOVE** - No QCalendar component usage found

- [x] **@quasar/quasar-app-extension-qmarkdown** ❌ **NOT USED**
  - Current: v2.0.0-beta.10
  - Usage: 0 occurrences in codebase (only i18n text mentions markdown)
  - Decision: **REMOVE** - No QMarkdown component usage found

- [x] **quasar-app-extension-qhierarchy** ❌ **NOT USED**
  - Current: v1.0.0-alpha.1
  - Usage: Uses native `q-tree` component instead (FormItems.vue)
  - Decision: **REMOVE** - No QHierarchy component usage found

**Extension Status:** ✅ **ALL VERIFIED** - 1 to upgrade, 3 to remove

**See:** `plans/extension-usage-verification.md` for detailed analysis

---

## Pre-Migration Checklist

### 1. Environment Setup

- [ ] **Create migration branch**
  ```bash
  git checkout -b migration/quasar3-vite-pinia
  git push -u origin migration/quasar3-vite-pinia
  ```

- [ ] **Backup configuration**
  ```bash
  cp quasar.conf.js quasar.conf.js.backup
  cp package.json package.json.backup
  cp yarn.lock yarn.lock.backup
  ```

### 2. Team Preparation

- [ ] **Review Phase 1 documents**
  - [ ] MIGRATION-STRATEGY.md (consolidated migration guide)
  - [ ] STATE-MANAGEMENT.md (consolidated Pinia + Feathers-Pinia guide)
  - [ ] COMPONENT-MIGRATION.md (component conversion patterns)
  - [ ] IMPLEMENTATION-GUIDE.md (quick reference)
  - [ ] phase1-summary.md (overview and decisions)

- [ ] **Align on migration approach**
  - [ ] All team members understand the plan
  - [ ] Roles and responsibilities assigned
  - [ ] Communication channels established
  - [ ] Daily check-in scheduled (time: ______)

- [ ] **Training sessions scheduled**
  - [ ] Vite fundamentals (______ date/time)
  - [ ] Composition API overview (______ date/time)
  - [ ] Pinia patterns (______ date/time)

### 3. Development Environment

- [ ] **Clean workspace**
  ```bash
  # Clear build artifacts
  rm -rf dist/
  rm -rf .quasar/
  rm -rf node_modules/
  
  # Clear caches
  yarn cache clean
  ```

- [ ] **Test environment prepared**
  - [ ] Test database/API available
  - [ ] Test data prepared
  - [ ] Test accounts created

---

## Phase 2: Task Breakdown

### 1: Quasar 2.19.3 + Vite Setup

**Task 2.1: Dependency Updates**
- [ ] Remove unused extensions from package.json
  - [ ] Remove @quasar/quasar-app-extension-qcalendar
  - [ ] Remove @quasar/quasar-app-extension-qmarkdown
  - [ ] Remove quasar-app-extension-qhierarchy
- [ ] Remove unused extensions from quasar.extensions.json
- [ ] Update package.json dependencies
- [ ] Install Quasar 2.19.3 and Vite
- [ ] Upgrade @obiba/quasar-app-extension-amber to v1.2.0
- [ ] Resolve dependency conflicts
- [ ] Test clean install

**Task 2.2: Configuration Migration**
- [ ] Create quasar.config.js from quasar.conf.js
- [ ] Convert CommonJS → ESM
- [ ] Configure Vite build options
- [ ] Set up manual chunking
- [ ] Configure environment variables
- [ ] Test dev server starts

**Task 2.3: Static Import Conversion**
- [ ] Convert router lazy loading (27 routes)
- [ ] Convert async components (24 usages)
- [ ] Convert i18n dynamic imports (3 usages)
- [ ] Update all import paths
- [ ] Test all routes load

### 2: Verification and Polish

**Task 2.4: Boot File Migration**
- [ ] Update boot file imports
- [ ] Verify all boot files work with Vite
- [ ] Test Quasar plugins
- [ ] Test @obiba/amber extension boot file

**Task 2.5: Asset Import Updates**
- [ ] Update asset import syntax
- [ ] Verify public assets load
- [ ] Test image/font loading
- [ ] Optimize asset loading

**Task 2.6: Testing & Validation**
- [ ] Build succeeds in dev mode
- [ ] Build succeeds in production mode
- [ ] All pages load without errors
- [ ] All features work
- [ ] No console errors
- [ ] Performance baseline met

---

## Success Criteria

### Build Success
- [ ] `quasar dev` starts successfully (<5 seconds)
- [ ] `quasar build` completes successfully (<5 minutes)
- [ ] No build errors or warnings
- [ ] HMR works correctly (<100ms updates)

### Functionality
- [ ] All pages accessible via routing
- [ ] All Quasar plugins functional (Notify, Dialog, etc.)
- [ ] @obiba/amber extension loaded correctly
- [ ] No console errors in dev mode
- [ ] No console errors in production build

### Code Quality
- [ ] No dynamic imports remaining (verified)
- [ ] All static imports resolve correctly
- [ ] Environment variables work
- [ ] Asset imports work

---

## Risk Mitigation

### High Risk: Extension Incompatibility
**Risk Status: MITIGATED** ✅
- Only 1 extension used (@obiba/amber)
- Maintainer confirmed v1.2.0 availability
- 3 unused extensions removed

### Medium Risk: Configuration Issues
**If configuration doesn't work:**
1. Review Quasar 2.19.3 documentation
2. Check Quasar Discord/forums
3. Test minimal configuration
4. Incrementally add features

---

**Created:** 2026-05-31  
**Updated:** 2026-05-31 (extension verification complete)  
**Status:** ✅ **READY TO START** (all blockers resolved)  
**Next Phase:** Phase 3 - State Management (Pinia + Feathers-Pinia)

---

## Phase 2 Completion Criteria

**Before marking Phase 2 complete:**
- [ ] All tasks checked off
- [ ] All success criteria met
- [ ] Phase 2 summary document created
- [ ] Phase 3 kickoff checklist created
- [ ] Git commit and tag created
- [ ] Team review completed
