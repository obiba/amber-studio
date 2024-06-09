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

<script>
import { mapState, mapActions } from 'vuex'
import { ref } from 'vue'
import { settings } from '../boot/settings'
import { date } from 'quasar'

const types = [
  'participants-info-activate',
  'participants-activate',
  'participants-reminder',
  'participants-info-expire',
  'participants-deactivate',
  'participants-summary'
]

export default {
  mounted: function () {
    this.getTableTasks()
    this.setPagination()
  },
  setup () {
    return {
      selected: ref([]),
      filter: ref(''),
      settings
    }
  },
  data () {
    return {
      columns: [
        {
          name: 'type',
          required: true,
          label: this.$t('type'),
          align: 'left',
          field: 'type',
          sortable: true,
          format: val => this.$t(`tasks.types.${val}`)
        },
        {
          name: 'state',
          required: true,
          label: this.$t('state'),
          align: 'left',
          field: 'state',
          sortable: true,
          format: val => this.$t(`tasks.states.${val}`)
        },
        {
          name: 'error',
          required: true,
          label: this.$t('tasks.error'),
          align: 'left',
          field: 'error',
          sortable: true
        },
        {
          name: 'createdAt',
          align: 'left',
          label: this.$t('date'),
          field: 'createdAt',
          sortable: true,
          format: val =>
            `${val ? date.formatDate(val, 'YYYY-MM-DD HH:mm:ss') : this.$t('unknown')}`
        },
        {
          name: 'action',
          align: 'left',
          label: this.$t('action')
        }
      ],
      selectedTask: {},
      showCreateTask: false,
      showConfirmDeleteTask: false,
      showViewTask: false,
      showConfirmDeleteTasks: false,
      logFilterDebug: false,
      paginationOpts: {
        sortBy: 'createdAt',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      newTaskData: {}
    }
  },
  computed: {
    ...mapState({
      tasks: state => state.admin.tasks
    }),
    typeOptions () {
      return types.map((opt) => {
        return {
          value: opt,
          label: this.$t(`tasks.types.${opt}`)
        }
      })
    },
    filteredSelectedTaskLogs () {
      if (this.logFilterDebug) {
        return this.selectedTask.logs
      }
      return this.selectedTask.logs.filter(log => log.level !== 'debug')
    }
  },
  methods: {
    makeEllipsis (text, length) {
      if (text && text.length > length) {
        return text.substring(0, length) + ' ...'
      }
      return text
    },
    setPagination () {
      this.paginationOpts = this.$store.state.admin.taskPaginationOpts
    },
    async getTableTasks (requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination
        this.$store.commit('admin/setTaskPagination', {
          taskPaginationOpts: requestProp.pagination
        })
        await this.getTasks({ paginationOpts: requestProp.pagination, filter: requestProp.filter })
      } else {
        await this.getTasks({ paginationOpts: this.paginationOpts, filter: this.filter })
      }
      this.paginationOpts.rowsNumber = this.$store.state.admin.taskPaginationOpts.rowsNumber
    },
    ...mapActions({
      getTasks: 'admin/getTasks'
    }),
    createTask () {
      this.newTaskData = {
        type: types[0]
      }
      this.showCreateTask = true
      this.selectedTask = undefined
    },
    confirmDeleteTask (task) {
      this.showConfirmDeleteTask = true
      this.selectedTask = task
    },
    viewTask (task) {
      this.selectedTask = task
      this.showViewTask = true
    },
    confirmDeleteTasks () {
      if (this.selected.length > 0) {
        this.showConfirmDeleteTasks = true
      }
    },
    async saveTask () {
      // create
      const createdData = { ...this.newTaskData }
      this.$store.dispatch('admin/createTask', {
        task: createdData,
        paginationOpts: this.paginationOpts
      })
    },
    deleteTask () {
      this.$store.dispatch('admin/deleteTask', {
        id: this.selectedTask._id,
        paginationOpts: this.paginationOpts
      })
    },
    deleteTasks () {
      const ids = this.selected.map(u => u._id)
      this.$store.dispatch('admin/deleteTasks', {
        ids: ids,
        paginationOpts: this.paginationOpts
      })
      this.selected = []
    }
  }
}
</script>
