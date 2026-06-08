<template>
  <q-page>
    <div class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs class="q-mt-sm">
        <q-breadcrumbs-el icon="tasks" :label="$t('tasks.title')" />
      </q-breadcrumbs>
    </div>
    <q-separator/>

    <q-card class="q-ma-md">
      <q-card-section>
        <q-table
            flat
            :rows='tasks'
            :columns='columns'
            :filter='filter'
            row-key='_id'
            selection="multiple"
            v-model:selected="selected"
            v-model:pagination='paginationOpts'
            @request='getTableTasks'
          >
          <template v-slot:top>
            <q-btn
              color="primary"
              icon="add"
              :title="$t('tasks.add_task_hint')"
              @click="createTask()"
              class="q-mr-md" />
            <q-btn
              class="q-mr-md"
              flat
              round
              color="negative"
              icon="delete_outline"
              :disable="selected.length === 0"
              :title="$t('tasks.delete_tasks_hint')"
              @click="confirmDeleteTasks()" />
            <q-space />
            <q-input
              dense
              debounce="300"
              v-model="filter"
              :placeholder="$t('search')"
              :title="$t('tasks.search_hint')">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-name='props'>
            <q-td :props='props'>
              <router-link :to="'/task/' + props.row._id">{{ props.row.name }}</router-link>
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
                v-if="props.row.logs && props.row.logs.length > 0"
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="$t('tasks.view_task_hint')"
                icon='visibility'
                @click='viewTask(props.row)'>
              </q-btn>
              <q-btn
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="$t('tasks.delete_task_hint')"
                icon='delete'
                @click='confirmDeleteTask(props.row)'>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model='showCreateTask'>
      <q-card style="width: 400px;">
        <q-card-section>
          <q-select
            v-model="newTaskData.type"
            :options="typeOptions"
            :label="$t('type')"
            emit-value
            map-options
          />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveTask'
            :disable='disableCreateTask'
            :label="$t('add')"
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

    <q-dialog v-model='showConfirmDeleteTask'>
      <q-card>
        <q-card-section>
          <div>
            {{$t('tasks.delete_task_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedTask.type}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteTask'
            :label="$t('delete')"
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

    <q-dialog v-model='showViewTask'>
      <q-card>
        <q-card-section>
          <div class="text-weight-bold q-mb-md">
            {{$t(`tasks.types.${selectedTask.type}`)}}
          </div>
          <div>
            <q-toggle
              v-model="logFilterDebug"
              label="debug" />
          </div>
          <q-list separator>
            <q-item v-for="log in filteredSelectedTaskLogs" :key="log._id">
              <q-item-section style="max-width: 80px">
                <span>
                  <q-chip
                    :color="log.level === 'error' ? 'negative' : log.level === 'debug' ? '' : 'primary'"
                    :text-color="log.level === 'debug' ? '' : 'white'"
                    :title="log.timestamp">{{log.level}}
                  </q-chip>
                </span>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-caption">{{log.message}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('close')" flat color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteTasks'>
      <q-card>
        <q-card-section>
          <div>
            {{$t('tasks.delete_tasks_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(t => t.type).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteTasks'
            :label="$t('delete')"
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
import { settings } from '../boot/settings'
import { date } from 'quasar'
import { useAdminStore } from 'src/stores/admin'

const { t } = useI18n()
const adminStore = useAdminStore()

const types = [
  'participants-info-activate',
  'participants-activate',
  'participants-reminder',
  'participants-info-expire',
  'participants-deactivate',
  'participants-summary'
]

// Reactive state
const selected = ref([])
const filter = ref('')
const selectedTask = ref({})
const showCreateTask = ref(false)
const showConfirmDeleteTask = ref(false)
const showViewTask = ref(false)
const showConfirmDeleteTasks = ref(false)
const logFilterDebug = ref(false)
const paginationOpts = ref({
  sortBy: 'createdAt',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const newTaskData = ref({})

// Columns definition
const columns = [
  {
    name: 'type',
    required: true,
    label: t('type'),
    align: 'left',
    field: 'type',
    sortable: true,
    format: val => t(`tasks.types.${val}`)
  },
  {
    name: 'state',
    required: true,
    label: t('state'),
    align: 'left',
    field: 'state',
    sortable: true,
    format: val => t(`tasks.states.${val}`)
  },
  {
    name: 'error',
    required: true,
    label: t('tasks.error'),
    align: 'left',
    field: 'error',
    sortable: true
  },
  {
    name: 'createdAt',
    align: 'left',
    label: t('date'),
    field: 'createdAt',
    sortable: true,
    format: val =>
      `${val ? date.formatDate(val, 'YYYY-MM-DD HH:mm:ss') : t('unknown')}`
  },
  {
    name: 'action',
    align: 'left',
    label: t('action')
  }
]

// Computed
const tasks = computed(() => adminStore.tasks)
const typeOptions = computed(() => {
  return types.map((opt) => {
    return {
      value: opt,
      label: t(`tasks.types.${opt}`)
    }
  })
})
const filteredSelectedTaskLogs = computed(() => {
  if (logFilterDebug.value) {
    return selectedTask.value.logs
  }
  return selectedTask.value.logs?.filter(log => log.level !== 'debug') || []
})
const disableCreateTask = computed(() => !newTaskData.value.type)

// Methods
function makeEllipsis(text, length) {
  if (text && text.length > length) {
    return text.substring(0, length) + ' ...'
  }
  return text
}

function setPagination() {
  paginationOpts.value = adminStore.taskPaginationOpts
}

async function getTableTasks(requestProp) {
  if (requestProp) {
    paginationOpts.value = requestProp.pagination
    adminStore.setTaskPagination(requestProp.pagination)
    await adminStore.getTasks(requestProp.pagination, requestProp.filter)
  } else {
    await adminStore.getTasks(paginationOpts.value, filter.value)
  }
  paginationOpts.value.rowsNumber = adminStore.taskPaginationOpts.rowsNumber
}

function createTask() {
  newTaskData.value = {
    type: types[0]
  }
  showCreateTask.value = true
  selectedTask.value = undefined
}

function confirmDeleteTask(task) {
  showConfirmDeleteTask.value = true
  selectedTask.value = task
}

function viewTask(task) {
  selectedTask.value = task
  showViewTask.value = true
}

function confirmDeleteTasks() {
  if (selected.value.length > 0) {
    showConfirmDeleteTasks.value = true
  }
}

async function saveTask() {
  // create
  const createdData = { ...newTaskData.value }
  await adminStore.createTask(createdData, paginationOpts.value)
}

function deleteTask() {
  adminStore.deleteTask(selectedTask.value._id, paginationOpts.value)
}

function deleteTasks() {
  const ids = selected.value.map(u => u._id)
  adminStore.deleteTasks(ids, paginationOpts.value)
  selected.value = []
}

// Lifecycle
onMounted(() => {
  getTableTasks()
  setPagination()
})
</script>
