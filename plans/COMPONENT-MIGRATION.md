# Component Setup Syntax Conversion Guide

## Overview

This document provides patterns and strategy for converting all 73 Vue components from Options API to `<script setup>` syntax as part of the Vue 3 + Pinia migration.

**Current State:**
- 73 total Vue files (28 pages, 42 components, 2 layouts, 1 App.vue)
- All using Options API with `export default`
- 15 components using Vuex helpers (mapState, mapGetters, mapActions)
- 7 components using mixins (primarily AuthMixin)
- 0 components currently using `<script setup>`

**Migration Goal:**
- Convert all to `<script setup>` syntax
- Replace Vuex store usage with Pinia
- Convert mixins to composables
- Maintain type safety and reactivity

---

## Component Inventory

### By Type
- **Pages**: 28 components in `src/pages/`
- **Components**: 42 components in `src/components/`
- **Layouts**: 2 components in `src/layouts/`
- **App**: 1 root component

### By Complexity

#### High Priority - Vuex + Mixins (15 components)
Components using both Vuex helpers and mixins - highest impact:

**Pages:**
1. src/pages/Studies.vue - mapState, mapActions, AuthMixin, validation
2. src/pages/Study.vue - mapState, mapActions, AuthMixin
3. src/pages/StudyForm.vue - Vuex, AuthMixin
4. src/pages/StudyInterviewDesign.vue - Vuex, AuthMixin
5. src/pages/Account.vue - mapState, mapActions
6. src/pages/Groups.vue - mapState, mapActions
7. src/pages/Group.vue - mapState, mapActions
8. src/pages/Users.vue - mapState, mapActions
9. src/pages/User.vue - mapState, mapActions
10. src/pages/Tasks.vue - mapState, mapActions
11. src/pages/Login.vue - mapState, mapActions
12. src/pages/Register.vue - mapState, mapActions
13. src/pages/ForgotPassword.vue - mapState, mapActions
14. src/pages/ResetPassword.vue - mapState, mapActions

**Layouts:**
15. src/layouts/StudyLayout.vue - mapState, mapActions, AuthMixin

#### Medium Priority - Mixins Only (2 components)
Components using mixins without Vuex:

1. src/layouts/MainLayout.vue - AuthMixin
2. src/pages/Dashboard.vue - AuthMixin

#### Low Priority - Pure Options API (56 components)
Components without Vuex or mixins - straightforward conversions:

**Components - Forms (24 files):**
1. src/components/forms/Forms.vue
2. src/components/forms/FormItems.vue
3. src/components/forms/FormItem.vue
4. src/components/forms/FormRevisions.vue
5. src/components/forms/FormTranslations.vue
6. src/components/forms/items/AutocompleteItem.vue
7. src/components/forms/items/CheckboxGroupItem.vue
8. src/components/forms/items/ComputedItem.vue
9. src/components/forms/items/DateItem.vue
10. src/components/forms/items/DateTimeItem.vue
11. src/components/forms/items/GroupItem.vue
12. src/components/forms/items/ImageSelectItem.vue
13. src/components/forms/items/MapItem.vue
14. src/components/forms/items/NumberItem.vue
15. src/components/forms/items/OptionsItem.vue
16. src/components/forms/items/RadioGroupItem.vue
17. src/components/forms/items/RatingItem.vue
18. src/components/forms/items/SectionItem.vue
19. src/components/forms/items/SelectItem.vue
20. src/components/forms/items/SliderItem.vue
21. src/components/forms/items/TextAreaItem.vue
22. src/components/forms/items/TextItem.vue
23. src/components/forms/items/TimeItem.vue
24. src/components/forms/items/ToggleItem.vue

**Components - Interviews (6 files):**
25. src/components/interviews/Campaigns.vue
26. src/components/interviews/InterviewDesignSteps.vue
27. src/components/interviews/InterviewDesigns.vue
28. src/components/interviews/InterviewDesignTranslations.vue
29. src/components/interviews/Interviews.vue
30. src/components/interviews/Participants.vue

**Components - CRFs (2 files):**
31. src/components/crfs/CaseReportForms.vue
32. src/components/crfs/CaseReports.vue

**Components - Charts (6 files):**
33. src/components/charts/AreaChart.vue
34. src/components/charts/BarChart.vue
35. src/components/charts/GuageChart.vue
36. src/components/charts/LineChart.vue
37. src/components/charts/PieChart.vue
38. src/components/charts/ScatterPlot.vue

**Components - Dashboard (2 files):**
39. src/components/dashboard/DashboardCounts.vue
40. src/components/dashboard/RecordsChart.vue

**Components - Cards (1 file):**
41. src/components/cards/CardCharts.vue

**Components - Other (1 file):**
42. src/components/Banner.vue

**Pages - Remaining (14 files):**
43. src/pages/Cards.vue
44. src/pages/Checkout.vue
45. src/pages/Datasets.vue
46. src/pages/Error404.vue
47. src/pages/Index.vue
48. src/pages/Loading.vue
49. src/pages/Maintenance.vue
50. src/pages/StudyCaseReportForms.vue
51. src/pages/StudyCaseReports.vue
52. src/pages/StudyForms.vue
53. src/pages/StudyInterviewDesigns.vue
54. src/pages/StudyInterviews.vue
55. src/pages/Verify.vue

**Root:**
56. src/App.vue

---

## Conversion Patterns

### Pattern 1: Basic Options API to Setup

**Before (Options API):**
```vue
<script>
export default {
  data() {
    return {
      count: 0,
      message: 'Hello'
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```

**After (Setup):**
```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const message = ref('Hello')

const doubleCount = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>
```

**Key Changes:**
- Remove `export default`
- Import `ref`, `computed` from Vue
- Convert `data()` properties to `ref()`
- Convert `computed` to `computed()`
- Convert `methods` to plain functions
- No need for `this.` - direct variable access

---

### Pattern 2: Vuex mapState Conversion

**Before (Options API + Vuex):**
```vue
<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      studies: state => state.study.studies
    })
  },
  methods: {
    ...mapActions({
      getStudies: 'study/getStudies'
    })
  }
}
</script>
```

**After (Setup + Pinia):**
```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useStudyStore } from '@/stores/study'

const studyStore = useStudyStore()
const { studies } = storeToRefs(studyStore)

// Actions are called directly
studyStore.getStudies()
</script>
```

**Key Changes:**
- Import store composable instead of Vuex helpers
- Use `storeToRefs()` for reactive state destructuring
- Call actions directly on store instance
- No mapping needed

---

### Pattern 3: Mixin to Composable

**Before (Mixin):**
```vue
<script>
import AuthMixin from '../mixins/AuthMixin'

export default {
  mixins: [AuthMixin],
  methods: {
    doSomething() {
      if (this.isAdministrator) {
        // ...
      }
    }
  }
}
</script>
```

**After (Composable):**
```vue
<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAdministrator, isReadOnly, userEmail } = useAuth()

function doSomething() {
  if (isAdministrator.value) {
    // ...
  }
}
</script>
```

**Key Changes:**
- Create `useAuth()` composable from AuthMixin
- Import and call composable in setup
- Destructure needed properties
- Properties are refs, access with `.value` in JS

---

### Pattern 4: Props Declaration

**Before (Options API):**
```vue
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  }
}
</script>
```

**After (Setup):**
```vue
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

// Or with TypeScript:
const props = defineProps<{
  title: string
  count?: number
}>()

// Access: props.title, props.count
</script>
```

**Key Changes:**
- Use `defineProps()` compiler macro
- No import needed (auto-imported)
- Can use TypeScript generic syntax
- Props are reactive by default

---

### Pattern 5: Events Emission

**Before (Options API):**
```vue
<script>
export default {
  methods: {
    handleClick() {
      this.$emit('update', { value: 123 })
    }
  }
}
</script>
```

**After (Setup):**
```vue
<script setup>
const emit = defineEmits(['update'])

// Or with TypeScript:
const emit = defineEmits<{
  update: [payload: { value: number }]
}>()

function handleClick() {
  emit('update', { value: 123 })
}
</script>
```

**Key Changes:**
- Use `defineEmits()` compiler macro
- No import needed (auto-imported)
- Can use TypeScript for type safety
- Call `emit()` directly

---

### Pattern 6: Lifecycle Hooks

**Before (Options API):**
```vue
<script>
export default {
  mounted() {
    this.loadData()
  },
  unmounted() {
    this.cleanup()
  }
}
</script>
```

**After (Setup):**
```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  loadData()
})

onUnmounted(() => {
  cleanup()
})
</script>
```

**Key Changes:**
- Import lifecycle hooks from Vue
- Call hooks directly in setup
- Pass callback function
- Note: `created()` not needed (setup runs at that time)

---

### Pattern 7: Watchers

**Before (Options API):**
```vue
<script>
export default {
  data() {
    return {
      search: ''
    }
  },
  watch: {
    search(newVal, oldVal) {
      this.performSearch(newVal)
    }
  }
}
</script>
```

**After (Setup):**
```vue
<script setup>
import { ref, watch } from 'vue'

const search = ref('')

watch(search, (newVal, oldVal) => {
  performSearch(newVal)
})

// Or watch multiple sources:
watch([search, filter], ([newSearch, newFilter]) => {
  performSearch(newSearch, newFilter)
})
</script>
```

**Key Changes:**
- Import `watch` from Vue
- First argument is source (ref or getter)
- Second argument is callback
- Can watch multiple sources with array

---

### Pattern 8: Template Refs

**Before (Options API):**
```vue
<template>
  <input ref="inputRef" />
</template>

<script>
export default {
  mounted() {
    this.$refs.inputRef.focus()
  }
}
</script>
```

**After (Setup):**
```vue
<template>
  <input ref="inputRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref(null)

onMounted(() => {
  inputRef.value.focus()
})
</script>
```

**Key Changes:**
- Create ref variable with same name as template ref
- Initialize to `null`
- Access DOM element via `.value`
- Available after component is mounted

---

### Pattern 9: Router Access

**Before (Options API):**
```vue
<script>
export default {
  methods: {
    goToPage() {
      this.$router.push('/about')
    },
    getCurrentRoute() {
      return this.$route.params.id
    }
  }
}
</script>
```

**After (Setup):**
```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function goToPage() {
  router.push('/about')
}

function getCurrentRoute() {
  return route.params.id
}
</script>
```

**Key Changes:**
- Import and call `useRouter()` and `useRoute()`
- `router` for navigation methods
- `route` for current route info
- Both are reactive

---

### Pattern 10: Store Direct Commits (Vuex to Pinia)

**Before (Vuex):**
```vue
<script>
export default {
  methods: {
    updatePagination(opts) {
      this.$store.commit('study/setStudyPagination', {
        studyPaginationOpts: opts
      })
    },
    async loadData() {
      await this.$store.dispatch('study/getStudies', {
        paginationOpts: this.paginationOpts
      })
    }
  }
}
</script>
```

**After (Pinia):**
```vue
<script setup>
import { useStudyStore } from '@/stores/study'

const studyStore = useStudyStore()

function updatePagination(opts) {
  // Direct state mutation or call action
  studyStore.studyPaginationOpts = opts
  // OR
  studyStore.setStudyPagination(opts)
}

async function loadData() {
  await studyStore.getStudies({
    paginationOpts: paginationOpts.value
  })
}
</script>
```

**Key Changes:**
- No commits/mutations - direct assignment or actions
- No dispatches - call actions directly
- Store actions can be async
- State is reactive

---

### Pattern 11: Vuelidate Integration

**Before (Options API):**
```vue
<script>
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '../boot/vuelidate'

export default {
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  data() {
    return {
      form: {
        name: ''
      }
    }
  },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(2)
      }
    }
  }
}
</script>
```

**After (Setup):**
```vue
<script setup>
import { reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@/boot/vuelidate'

const form = reactive({
  name: ''
})

const rules = computed(() => ({
  form: {
    name: {
      required,
      minLength: minLength(2)
    }
  }
}))

const v$ = useVuelidate(rules, { form })
</script>
```

**Key Changes:**
- Import `useVuelidate` from package
- Use `reactive()` for form data
- Define rules as computed
- Pass rules and state to useVuelidate
- Access validation: `v$.value.form.name.$error`

---

### Pattern 12: Component Registration

**Before (Options API):**
```vue
<script>
import ChildComponent from './ChildComponent.vue'

export default {
  components: {
    ChildComponent
  }
}
</script>
```

**After (Setup):**
```vue
<script setup>
import ChildComponent from './ChildComponent.vue'

// That's it! Auto-registered
</script>
```

**Key Changes:**
- Just import the component
- No `components` option needed
- Auto-registered in template
- Works for SFC imports

---

## Conversion Priority Order

### Phase 1: Foundation (Prerequisites)
**Before any component conversion:**
1. Create Pinia stores (see `store-migration.md`)
2. Create `useAuth()` composable from AuthMixin
3. Set up store structure and actions
4. Ensure all stores are working

### Phase 2: Low-Risk Conversions (Prove Patterns)
**Start with simple components to validate approach:**
1. **Charts** (6 files) - Pure presentation, no state
2. **Form Items** (24 files) - Props and events only
3. **Banner, CardCharts** (2 files) - Simple components

**Goal:** Validate conversion patterns work correctly

### Phase 3: Medium Complexity
**Components with local state but no Vuex:**
1. **Dashboard components** (2 files)
2. **Interview components** (6 files)
3. **CRF components** (2 files)
4. **Form management** (5 files)
5. **Simple pages** (14 files)

**Goal:** Validate complex local state patterns

### Phase 4: High Complexity (Core Features)
**Components with Vuex + Mixins:**
1. **Layouts first** (2 files) - Most used
   - MainLayout.vue
   - StudyLayout.vue

2. **Auth pages** (4 files) - Critical path
   - Login.vue
   - Register.vue
   - ForgotPassword.vue
   - ResetPassword.vue

3. **Admin pages** (5 files)
   - Users.vue
   - User.vue
   - Groups.vue
   - Group.vue
   - Tasks.vue

4. **Study pages** (6 files) - Core features
   - Studies.vue
   - Study.vue
   - StudyForm.vue
   - StudyInterviewDesign.vue
   - Account.vue
   - Dashboard.vue

5. **Root App** (1 file)
   - App.vue

**Goal:** Complete migration with thorough testing

---

## Testing Strategy

### 1. Component-Level Testing

For each converted component:

**Visual Testing:**
```bash
# Start dev server
npm run dev

# Test in browser:
# - Component renders correctly
# - Props work as expected
# - Events fire correctly
# - No console errors
```

**Manual Checklist:**
- [ ] Component loads without errors
- [ ] All data displays correctly
- [ ] User interactions work (clicks, inputs)
- [ ] Navigation works (if applicable)
- [ ] Store state updates correctly (if using store)
- [ ] Validation works (if using Vuelidate)
- [ ] No TypeScript errors
- [ ] No console warnings

### 2. Store Integration Testing

**For components using Pinia stores:**
```javascript
// Test in browser console:
const store = useStudyStore()
console.log(store.studies) // Should show data
store.getStudies() // Should fetch data
```

**Verify:**
- [ ] Store state is reactive
- [ ] Actions update state correctly
- [ ] Multiple components share state
- [ ] Store getters work

### 3. Router Testing

**For page components:**
```bash
# Test routes manually:
# - Navigate to page via URL
# - Navigate via router-link
# - Navigate via programmatic navigation
# - Check params/query work
```

### 4. Regression Testing

**Critical paths to test:**
- [ ] User login → Dashboard → Studies
- [ ] Create new study → Add forms → View study
- [ ] User management (admin only)
- [ ] Group management (admin only)
- [ ] Interview design workflow
- [ ] Form builder

### 5. Batch Testing

After converting a batch (e.g., all chart components):

```bash
# Run full app
npm run dev

# Test all converted components:
# - Navigate through app
# - Check each feature area
# - Look for console errors
# - Test edge cases
```

### 6. Performance Testing

**Compare before/after:**
- Page load times
- Component render times
- Memory usage
- Bundle size

**Tools:**
```bash
# Build and check bundle size
npm run build
# Check size of chunks

# Use Vue DevTools:
# - Component tree
# - Performance profiling
# - Timeline
```

### 7. E2E Testing (If Available)

If you have E2E tests:
```bash
npm run test:e2e
```

If not, create smoke tests for critical paths.

---

## Common Gotchas

### 1. Reactivity Loss
```javascript
// ❌ Wrong - loses reactivity
const { count } = storeToRefs(store)
const doubled = count * 2 // Not reactive!

// ✅ Correct - maintains reactivity
const { count } = storeToRefs(store)
const doubled = computed(() => count.value * 2)
```

### 2. Template Ref Timing
```javascript
// ❌ Wrong - ref not available yet
const inputRef = ref(null)
inputRef.value.focus() // Error!

// ✅ Correct - wait for mount
onMounted(() => {
  inputRef.value.focus()
})
```

### 3. Watch Immediate Execution
```javascript
// ❌ Wrong - may access undefined
watch(route, () => {
  const id = route.params.id // May be undefined first time
})

// ✅ Correct - check for value or use immediate
watch(route, () => {
  const id = route.params.id
  if (id) {
    // Use id
  }
}, { immediate: true })
```

### 4. Prop Mutation
```javascript
// ❌ Wrong - mutating prop
const props = defineProps(['modelValue'])
function update() {
  props.modelValue = 'new value' // Error!
}

// ✅ Correct - emit event
const emit = defineEmits(['update:modelValue'])
function update() {
  emit('update:modelValue', 'new value')
}
```

### 5. Async Setup
```javascript
// ❌ Wrong - setup cannot be async
<script setup>
await loadData() // Error!
</script>

// ✅ Correct - use onMounted
<script setup>
onMounted(async () => {
  await loadData()
})
</script>
```

### 6. Store Destructuring
```javascript
// ❌ Wrong - loses reactivity
const { studies } = studyStore

// ✅ Correct - use storeToRefs
const { studies } = storeToRefs(studyStore)

// ✅ Also correct - access directly
studyStore.studies
```

---

## Commit Strategy

### Batch Commits by Feature Area

**Example commit sequence:**

1. `feat: convert chart components to setup syntax`
   - All 6 chart components
   
2. `feat: convert form item components to setup syntax`
   - All 24 form item components

3. `feat: convert interview components to setup syntax`
   - All 6 interview components

4. `feat: convert dashboard components to setup syntax`
   - DashboardCounts.vue, RecordsChart.vue

5. `feat: convert layout components to setup syntax`
   - MainLayout.vue, StudyLayout.vue

6. `feat: convert auth pages to setup syntax`
   - Login, Register, ForgotPassword, ResetPassword

7. `feat: convert admin pages to setup syntax`
   - Users, User, Groups, Group, Tasks

8. `feat: convert study pages to setup syntax`
   - Studies, Study, StudyForm, StudyInterviewDesign

9. `feat: convert remaining pages to setup syntax`
   - All other page components

10. `feat: convert root app component to setup syntax`
    - App.vue

**Each commit should:**
- Include tests (if applicable)
- Be deployable (no breaking changes)
- Include any necessary store/composable changes
- Update documentation if needed

---

## Success Criteria

✅ **All 73 components converted to `<script setup>`**

✅ **No Options API patterns remaining**
- No `export default`
- No `data()`, `computed:`, `methods:`
- No Vuex `mapState`, `mapGetters`, `mapActions`
- No `mixins: []`

✅ **All functionality working**
- All pages load correctly
- All user interactions work
- All store operations work
- All validations work
- All routing works

✅ **No console errors or warnings**

✅ **No TypeScript errors** (if using TS)

✅ **Performance maintained or improved**
- No slower page loads
- No increased bundle size
- No memory leaks

✅ **Code is cleaner and more maintainable**
- Better organization
- Easier to understand
- Type-safe (with TypeScript)
- Less boilerplate

---

## Validation Checklist

After completing all conversions:

### Code Validation
- [ ] No `export default` in any Vue file
- [ ] No `mapState`, `mapGetters`, `mapActions` imports
- [ ] No `mixins: []` arrays
- [ ] All components use `<script setup>`
- [ ] All stores are Pinia (no Vuex)

### Functionality Validation
- [ ] Login/logout works
- [ ] All pages load
- [ ] All forms work
- [ ] All tables work
- [ ] All charts render
- [ ] All modals work
- [ ] All navigation works

### Build Validation
```bash
npm run build
# Should complete without errors
# Check bundle size is reasonable
```

### Runtime Validation
```bash
npm run dev
# Navigate entire app
# Check console for errors
# Test all features
```

---

## Next Steps

1. **Review this document** with team
2. **Set up Pinia stores** (prerequisite)
3. **Create useAuth composable** (prerequisite)
4. **Start Phase 2** - Convert simple components
5. **Test thoroughly** after each batch
6. **Move to Phase 3 & 4** - More complex components
7. **Final validation** - All 73 components done

---

## Resources

- [Vue 3 Composition API Docs](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Script Setup RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Vuelidate with Composition API](https://vuelidate-next.netlify.app/)

---

**Document Status:** Complete - Ready for Phase 4 Implementation
**Last Updated:** 2026-05-31
**Created by:** Component Analysis Task 4
