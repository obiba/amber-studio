<template>
  <q-page>
    <div class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs class="q-mt-sm">
        <q-breadcrumbs-el icon="groups" :label="t('groups.title')" />
      </q-breadcrumbs>
    </div>
    <q-separator/>

    <q-card class="q-ma-md">
      <q-card-section>
        <q-table
            flat
            :rows='groups'
            :columns='columns'
            :filter='filter'
            row-key='name'
            selection="multiple"
            v-model:selected="selected"
            v-model:pagination='paginationOpts'
            @request='getTableGroups'
          >
          <template v-slot:top>
            <q-btn
              color="primary"
              icon="add"
              :title="t('groups.add_group_hint')"
              @click="createGroup()"
              class="q-mr-md" />
            <q-btn
              class="q-mr-md"
              flat
              round
              color="negative"
              icon="delete_outline"
              :disable="selected.length === 0"
              :title="t('groups.delete_groups_hint')"
              @click="confirmDeleteGroups()" />
            <q-space />
            <q-input
              dense
              debounce="300"
              v-model="filter"
              :placeholder="t('search')"
              :title="t('groups.search_hint')">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-name='props'>
            <q-td :props='props'>
              <router-link :to="'/group/' + props.row._id">{{ props.row.name }}</router-link>
            </q-td>
          </template>
          <template v-slot:body-cell-description='props'>
            <q-td :props='props'>
              <div style="white-space: normal">
                {{ makeEllipsis(props.row.description, 100) }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-members='props'>
            <q-td :props='props'>
              <q-badge v-if="props.row.users.length>0" color="info">
                {{ props.row.users.length }}
              </q-badge>
              <span v-else>0</span>
            </q-td>
          </template>
          <template v-slot:body-cell-action='props'>
            <q-td :props='props'>
              <q-btn
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="t('groups.edit_group_hint')"
                icon='edit'
                :to="'/group/' + props.row._id">
              </q-btn>
              <q-btn
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="t('groups.delete_group_hint')"
                icon='delete'
                @click='confirmDeleteGroup(props.row)'>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model='showCreateGroup' persistent>
      <q-card>
        <q-card-section class='row items-center'>
           <div class='col-12'>
            <q-input
              v-model='newGroupData.name'
              :label="t('name')"
              lazy-rules
              class='q-ma-sm'
              @blur="v$.name.$touch"
              :error="v$.name.$error"
              :hint="t('required')"
            >
              <template v-slot:error>
                <div v-for="error in v$.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12'>
            <q-input
              v-model='newGroupData.description'
              :label="t('description')"
              autogrow
              lazy-rules
              class='q-ma-sm'
            />
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveGroup'
            :disable='disableCreateGroup'
            :label="t('add')"
            type='submit'
            color='primary'
            v-close-popup
          >
           <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteGroup' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('groups.delete_group_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedGroup.name}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteGroup'
            :label="t('delete')"
            type='submit'
            color='primary'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteGroups' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('groups.delete_groups_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => g.name).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteGroups'
            :label="t('delete')"
            type='submit'
            color='primary'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'
import { settings } from '../boot/settings'
import { useAdminStore } from 'src/stores/admin'

const { t } = useI18n()
const adminStore = useAdminStore()

// Reactive state
const selected = ref([])
const filter = ref('')
const selectedGroup = ref({})
const showCreateGroup = ref(false)
const showConfirmDeleteGroup = ref(false)
const showConfirmDeleteGroups = ref(false)
const paginationOpts = ref({
  sortBy: 'name',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const groupData = ref({
  name: '',
  description: ''
})
const newGroupData = ref({
  name: '',
  description: ''
})

// Columns definition
const columns = [
  {
    name: 'name',
    required: true,
    label: t('name'),
    align: 'left',
    field: 'name',
    sortable: true
  },
  {
    name: 'description',
    align: 'left',
    label: t('description'),
    field: 'description',
    sortable: true
  },
  {
    name: 'members',
    align: 'left',
    label: t('members'),
    field: 'users',
    format: val => {
      return val ? val.length : 0
    },
    sortable: false
  },
  {
    name: 'action',
    align: 'left',
    label: t('action')
  }
]

// Validation rules
const rules = {
  name: {
    required,
    minLength: minLength(2),
    maxLength: maxLength(30)
  },
  description: {
    minLength: minLength(2),
    maxLength: maxLength(500)
  }
}

const v$ = useVuelidate(rules, newGroupData)

// Computed
const groups = computed(() => adminStore.groups)
const disableCreateGroup = computed(() => v$.value.$invalid)

// Methods
function makeEllipsis(text, length) {
  if (text && text.length > length) {
    return text.substring(0, length) + ' ...'
  }
  return text
}

function setPagination() {
  paginationOpts.value = adminStore.groupPaginationOpts
}

async function getTableGroups(requestProp) {
  if (requestProp) {
    paginationOpts.value = requestProp.pagination
    adminStore.setGroupPagination(requestProp.pagination)
    await adminStore.getGroups(requestProp.pagination, requestProp.filter)
  } else {
    await adminStore.getGroups(paginationOpts.value, filter.value)
  }
  paginationOpts.value.rowsNumber = adminStore.groupPaginationOpts.rowsNumber
}

function createGroup() {
  newGroupData.value = {}
  showCreateGroup.value = true
  selectedGroup.value = undefined
}

function confirmDeleteGroup(group) {
  showConfirmDeleteGroup.value = true
  selectedGroup.value = group
}

function confirmDeleteGroups() {
  if (selected.value.length > 0) {
    showConfirmDeleteGroups.value = true
  }
}

async function saveGroup() {
  v$.value.$reset()
  // create
  const createdData = { ...newGroupData.value }
  await adminStore.createGroup(createdData, paginationOpts.value)
}

function deleteGroup() {
  adminStore.deleteGroup(selectedGroup.value._id, paginationOpts.value)
}

function deleteGroups() {
  const ids = selected.value.map(u => u._id)
  adminStore.deleteGroups(ids, paginationOpts.value)
  selected.value = []
}

// Lifecycle
onMounted(() => {
  getTableGroups()
  setPagination()
})
</script>
