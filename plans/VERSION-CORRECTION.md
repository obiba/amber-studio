# CRITICAL CORRECTION: Quasar Version Strategy

**Date:** 2026-05-31  
**Type:** Major Planning Correction  
**Impact:** HIGH - Changes entire migration strategy

---

## Issue Identified

**Incorrect Assumption in All Planning Documents:**
- Assumed target: Quasar 2.19.3.x
- Actual reality: **Quasar 2.19.3 does not exist!**

---

## Correct Version Information

### Quasar Framework

**Current Versions (npm registry):**
```bash
$ npm view quasar version
2.19.3  # ← Latest stable

$ npm view quasar versions --json | tail -5
  "2.19.0",
  "2.19.1",
  "2.19.2",
  "2.19.3"
]
```

**Reality:**
- **Latest stable:** 2.19.3
- **No v3.x exists** (highest version is 2.19.3)
- v3 may be in development, but not released

### @quasar/app-vite 2.6.1

**Current Versions (npm registry):**
```bash
$ npm view @quasar/app-vite version
2.6.1  # ← Latest stable (dist-tag: latest)

$ npm view @quasar/app-vite versions --json | tail -5
  "2.5.4",
  "2.5.5",
  "2.6.0",
  "2.6.1",
  "3.0.0-beta.33"  # ← Beta, not stable
]
```

**Reality:**
- **Latest stable:** 2.6.1
- **v3.0.0 is in beta** (beta.33 as of now)
- Using stable v2.6.1 is the safe choice

---

## Corrected Migration Strategy

### Current State
- Quasar: **2.14.3**
- @quasar/app-webpack: **3.12.3**
- Vue: 3.0.0

### Target State (CORRECTED)

**Option A: Conservative (Recommended)**
- Quasar: **2.14.3 → 2.19.3** (minor version upgrade)
- @quasar/app-webpack: Remove
- @quasar/app-vite: **2.6.1** (latest stable)
- Vue: 3.0.0 → 3.x (latest)

**Option B: Bleeding Edge (Not Recommended)**
- Quasar: **2.14.3 → 2.19.3**
- @quasar/app-vite: **3.0.0-beta.33** (beta, unstable)
- Vue: 3.0.0 → 3.x

**Recommendation:** Option A (stable releases only)

---

## Impact on Migration Planning

### What Changes

**Good News:**
1. ✅ **NOT a major version migration** (2.x → 2.x, not 2.x → 3.x)
2. ✅ **Fewer breaking changes** than anticipated
3. ✅ **More stable** - using released versions, not betas
4. ✅ **Lower risk** - minor version upgrades are safer
5. ✅ **Better support** - stable versions have better docs/community support

**What Needs Updating:**
1. ❌ All references to "Quasar 3" → "Quasar 2.19.3"
2. ❌ "Quasar 2.19.3 breaking changes" → "Quasar 2.14 → 2.19 changes"
3. ❌ Extension compatibility assumptions (they may already work!)
4. ❌ Timeline estimates (may be faster with fewer breaking changes)
5. ❌ Risk assessment (lower risk than major version jump)

---

## Breaking Changes Analysis (CORRECTED)

### Quasar 2.14.3 → 2.19.3

**Type:** Minor version upgrades (2.14 → 2.15 → ... → 2.19)

**Typical Changes:**
- Bug fixes
- New features (backward compatible)
- Deprecation warnings (not breaking)
- Performance improvements

**Breaking Changes:** Minimal (semantic versioning guarantees)

**Documentation:**
- Release notes: https://github.com/quasarframework/quasar/releases
- Check releases from v2.14.3 to v2.19.3 for any breaking changes

### @quasar/app-webpack 3.12.3 → @quasar/app-vite 2.6.1

**Type:** Build tool migration (major change)

**Breaking Changes:**
- Configuration file format (quasar.conf.js → quasar.config.js)
- Import syntax differences (Vite vs Webpack)
- Environment variables (process.env → import.meta.env)
- Plugin system differences
- Asset handling differences

**This IS the major migration work** - not Quasar itself!

---

## Extension Compatibility (Re-assessment)

### With Quasar 2.19.3 (not 3.x)

**Previously thought:**
- Extensions need "Quasar 2.19.3 compatibility"
- Major upgrades required
- High risk of incompatibility

**Corrected reality:**
- Extensions built for Quasar v2.x should work!
- @obiba/quasar-app-extension-amber 1.1.6 likely already compatible
- May only need Vite compatibility, not Quasar compatibility

**Action Required:**
- Re-check @obiba/quasar-app-extension-amber compatibility
- Check if 1.2.0 is specifically for Vite support (not Quasar 2.19.3)
- Unused extensions still need removal (qcalendar, qmarkdown, qhierarchy)

---

## Documents Requiring Updates

**All Phase 1 Planning Documents:**
1. ✅ `plans/migration-strategy.md` - Change Quasar 2.19.3 → Quasar 2.19.3
2. ✅ `plans/pinia-architecture.md` - Update target versions
3. ✅ `plans/feathersvuex-migration.md` - Update target versions
4. ✅ `plans/component-setup-syntax.md` - Update target versions
5. ✅ `plans/static-import-strategy.md` - Update target versions
6. ✅ `plans/phase1-summary.md` - Update executive summary
7. ✅ `plans/phase2-kickoff-checklist.md` - Update prerequisites
8. ✅ `plans/IMPLEMENTATION-GUIDE.md` - Update version info
9. ✅ `plans/extension-usage-verification.md` - Update compatibility notes

**Search & Replace Required:**
- "Quasar 3" → "Quasar 2.19.3"
- "Quasar 2.19.3" → "Quasar v2.19.3"
- "Quasar 2.19.3" → "Quasar 2.19.3"
- "Quasar 2.19.3+" → "Quasar v2.19.3"
- "upgrade to v3" → "upgrade to v2.19.3"
- "@quasar/app-vite (v3)" → "@quasar/app-vite 2.6.1"

---

## Updated Migration Phases

### Phase 1: Planning ✅ COMPLETE (needs correction)
- Update all planning docs with correct versions

### Phase 2: Foundation (Corrected)
- **Goal:** Migrate from @quasar/app-webpack 3.12.3 → @quasar/app-vite 2.6.1
- **Quasar version:** 2.14.3 → 2.19.3 (minor upgrade)
- **Build tool:** Webpack → Vite (major change)
- **Risk:** Lower than anticipated (not a major framework version jump)

### Phase 3-6: Unchanged
- Pinia migration
- Component conversion
- Testing
- Documentation

---

## Risk Re-assessment

### Original Risk Assessment
- **Extension incompatibility:** 7/10 (Quasar 2.19.3 compatibility)
- **Overall migration risk:** HIGH (major version jump)

### Corrected Risk Assessment
- **Extension incompatibility:** 3/10 (Quasar v2 extensions likely compatible)
- **Overall migration risk:** MEDIUM (build tool change, not framework major version)

---

## Recommended Actions (Immediate)

### 1. Verify Correct Versions
```bash
# Confirm Quasar latest
npm view quasar version
# Output: 2.19.3

# Confirm @quasar/app-vite latest
npm view @quasar/app-vite version
# Output: 2.6.1

# Check if Quasar 2.19.3 exists
npm view quasar versions --json | grep "3\."
# Output: (empty or only betas)
```

### 2. Check @obiba/amber Extension
```bash
# Check what Quasar version it supports
npm view @obiba/quasar-app-extension-amber@1.1.6 peerDependencies
npm view @obiba/quasar-app-extension-amber@1.2.0 peerDependencies

# Check release notes for 1.2.0
# Does it mention Vite support? Or Quasar 2.19.3?
```

### 3. Update All Planning Documents
- Search and replace all "Quasar 3" references
- Update version numbers throughout
- Revise risk assessments
- Update timelines (may be faster!)

### 4. Re-validate Migration Strategy
- Webpack → Vite is the main challenge
- Quasar 2.14 → 2.19 is minor
- Most effort goes to build tool, not framework

---

## Questions for Maintainer (Yannick) - ANSWERED ✅

Since you're the @obiba/quasar-app-extension-amber maintainer:

1. **Does v1.2.0 target Quasar v2 or v3.19.3?**
   - ✅ ANSWER: **Quasar v2** + Vite support

2. **Is v1.2.0 specifically for Vite support?**
   - ✅ ANSWER: Yes - specifically for **Vite v2 compatibility**

3. **Does v1.1.6 work with Vite?**
   - ✅ ANSWER: v1.1.6 works with @quasar/app-vite v1 (older)
   - v1.2.0 required for @quasar/app-vite 2.6.1 (Vite v2)

4. **Correct migration target versions?**
   - ✅ CONFIRMED:
     - Quasar: 2.14.3 → **2.19.3** (latest stable v2)
     - @quasar/app-webpack 3.12.3 → **@quasar/app-vite 2.6.1** (latest stable)
     - @obiba/amber: 1.1.6 → **1.2.0** (Vite v2 compatibility)

---

## Corrected Timeline Estimate

### Original Estimate (Based on Quasar 2.19.3)
- Phase 2: 5-7 days (major version + Vite)
- Total: 27-37 days (5-7 weeks)

### Revised Estimate (Based on Quasar 2.19.3)
- Phase 2: 3-5 days (minor version + Vite) ⬇️
- Total: 20-30 days (4-6 weeks) ⬇️

**Savings:** ~1 week faster due to fewer breaking changes

---

## Summary

### The Big Mistake
- Assumed Quasar 2.19.3 existed and was the target
- Reality: Quasar v2.19.3 is latest stable
- This is GOOD NEWS - easier migration!

### What This Means
1. ✅ Fewer breaking changes
2. ✅ Lower risk
3. ✅ Faster migration
4. ✅ Better stability
5. ✅ More documentation available
6. ❌ Need to update all planning docs

### Next Steps
1. Confirm versions with maintainer (Yannick)
2. Update all 9 planning documents
3. Re-commit with corrected information
4. Proceed with Phase 2 (now lower risk!)

---

**Status:** CRITICAL CORRECTION REQUIRED  
**Priority:** HIGH  
**Action:** Update all planning documents before Phase 2  
**Impact:** Positive (easier migration than planned)

---

**Created:** 2026-05-31  
**Author:** Migration Team  
**Type:** Planning Correction
