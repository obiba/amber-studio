# Pinia Stores

All stores use Composition API setup syntax.

## Store List
- `account.js` - User account operations
- `admin.js` - Admin management (users, groups, tasks)
- `auth.js` - Authentication (Feathers-Pinia)
- `caseReport.js` - Case reports and CRF templates
- `form.js` - Study forms with versioning
- `interview.js` - Interviews, designs, campaigns
- `study.js` - Study CRUD operations

## Pattern
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  const items = ref([])
  const loading = ref(false)
  
  const itemCount = computed(() => items.value.length)
  
  async function fetchItems() {
    loading.value = true
    // ... fetch logic
    loading.value = false
  }
  
  return { items, loading, itemCount, fetchItems }
})
```
