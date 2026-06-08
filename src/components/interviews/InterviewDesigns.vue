<template>
  <div v-cloak>

    <q-card class="q-ma-md"
          v-if="hasStudyInterviewDesigns">
      <q-card-section>
        <q-table
          flat
          :rows="studyInterviewDesigns"
          :columns="columns"
          :filter="filter"
          row-key="_id"
          :selection="isReadOnly ? 'none' : 'multiple'"
          v-model:selected="selected"
          v-model:pagination='paginationOpts'
          @request='getTableStudyInterviewDesigns'
        >
          <template v-slot:top>
            <q-btn
              v-if="!isReadOnly"
              color="primary"
              icon="add"
              :title="t('study.add_interview_design_hint')"
              @click="onAdd()"
              class="q-mr-md" />
            <q-btn
              v-if="!isReadOnly"
              class="q-mr-md"
              flat
              round
              color="negative"
              icon="delete_outline"
              :disable="selected.length === 0"
              :title="t('study.delete_interview_designs_hint')"
              @click="onConfirmDeleteMultiple()" />
            <q-space />
            <q-input
              dense
              debounce="300"
              v-model="filter"
              :placeholder="t('search')"
              :title="t('study.search_interview_design_hint')">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-name='props'>
            <q-td :props='props'>
              <router-link :to="'/study/' + studyId + '/interview-design/' + props.row._id">{{ props.row.name }}</router-link>
            </q-td>
          </template>
          <template v-slot:body-cell-steps='props'>
            <q-td :props='props'>
              {{ props.row.steps ? props.row.steps.length : 0 }}
            </q-td>
          </template>
          <template v-slot:body-cell-permissions='props'>
            <q-td :props='props'>
              <div v-if="props.row.permissions">
                <q-chip v-for="id in props.row.permissions.users" icon="person" size="sm" :label="getSubject(id, 'user').name" :key="id"/>
                <q-chip v-for="id in props.row.permissions.groups" icon="people" size="sm" :label="getSubject(id, 'group').name" :key="id"/>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-state='props'>
            <q-td :props='props'>
              {{ t('study.interview_design_state.' + props.row.state) }}
              <q-icon v-if="props.row.permissions" name="lock"/>
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
                :title="t('study.edit_interview_design_hint')"
                icon="edit"
                @click='onEdit(props.row)'>
              </q-btn>
              <q-btn
                v-if="props.row.state === 'paused'"
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="t('study.start_interview_design_hint')"
                icon="play_arrow"
                @click='start(props.row)'>
              </q-btn>
              <q-btn
                v-if="props.row.state === 'active'"
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="t('study.pause_interview_design_hint')"
                icon="pause"
                @click='pause(props.row)'>
              </q-btn>
              <q-btn
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="t('study.delete_interview_design_hint')"
                icon="delete"
                @click='onConfirmDelete(props.row)'>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-btn
      v-else-if="!isReadOnly"
      color="primary"
      icon="add"
      :label="t('study.add_interview_design_hint')"
      @click="onAdd()"
      class="q-ma-md" />

    <q-dialog v-model='showCreateStudyInterviewDesign' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='newStudyInterviewDesignData.name'
            :label="t('name')"
            lazy-rules
            @blur="v$.newStudyInterviewDesignData.name.$touch"
            :error="v$.newStudyInterviewDesignData.name.$error"
            :hint="t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.newStudyInterviewDesignData.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='newStudyInterviewDesignData.label'
            :label="t('title')"
            lazy-rules
            @blur="v$.newStudyInterviewDesignData.label.$touch"
            :error="v$.newStudyInterviewDesignData.label.$error"
            :hint="t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.newStudyInterviewDesignData.label.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='newStudyInterviewDesignData.description'
            :label="t('description')"
            autogrow
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-toggle
            class="q-mt-md"
            v-model="newStudyInterviewDesignData.restrictedAccess"
            :label="t('restricted_access')"
          />
          <q-select
            v-if="newStudyInterviewDesignData.restrictedAccess"
            v-model="newStudyInterviewDesignData.permissions.users"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="t('study.permitted_users')" />
          <q-select
            v-if="newStudyInterviewDesignData.restrictedAccess"
            v-model="newStudyInterviewDesignData.permissions.groups"
            :options="groupSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="t('study.permitted_groups')" />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveStudyInterviewDesign(true)'
            :disable='disableCreateStudyInterviewDesign'
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

    <q-dialog v-model='showEditStudyInterviewDesign' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='selectedStudyInterviewDesign.name'
            :label="t('name')"
            lazy-rules
            @blur="v$.selectedStudyInterviewDesign.name.$touch"
            :error="v$.selectedStudyInterviewDesign.name.$error"
            :hint="t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.selectedStudyInterviewDesign.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='selectedStudyInterviewDesign.label'
            :label="t('title')"
            lazy-rules
            @blur="v$.selectedStudyInterviewDesign.label.$touch"
            :error="v$.selectedStudyInterviewDesign.label.$error"
            :hint="t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.selectedStudyInterviewDesign.label.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='selectedStudyInterviewDesign.description'
            :label="t('description')"
            autogrow
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-toggle
            class="q-mt-md"
            v-model="selectedStudyInterviewDesign.restrictedAccess"
            :label="t('restricted_access')"
          />
          <q-select
            v-if="selectedStudyInterviewDesign.restrictedAccess"
            v-model="selectedStudyInterviewDesign.permissions.users"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="t('study.permitted_users')" />
          <q-select
            v-if="selectedStudyInterviewDesign.restrictedAccess"
            v-model="selectedStudyInterviewDesign.permissions.groups"
            :options="groupSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="t('study.permitted_groups')" />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveStudyInterviewDesign(false)'
            :disable='disableEditStudyInterviewDesign'
            :label="t('update')"
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

    <q-dialog v-model='showConfirmDeleteStudyInterviewDesign' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('study.delete_interview_design_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ selectedStudyInterviewDesign.name }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyInterviewDesign'
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

    <q-dialog v-model='showConfirmDeleteStudyInterviewDesigns' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('study.delete_interview_designs_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => g.name).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyInterviewDesigns'
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

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { date } from 'quasar'
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { subjectsService } from '../../services/utils'
import { useInterviewStore } from 'src/stores/interview'
import { useStudyStore } from 'src/stores/study'
import { useAuth } from 'src/composables/useAuth'

const { t } = useI18n()
const route = useRoute()
const interviewStore = useInterviewStore()
const studyStore = useStudyStore()
const { isReadOnly } = useAuth()

// Refs
const tab = ref('definition')
const selected = ref([])
const filter = ref('')
const newStudyInterviewDesignData = ref({
  name: '',
  description: ''
})
const selectedStudyInterviewDesign = ref({})
const showCreateStudyInterviewDesign = ref(false)
const showEditStudyInterviewDesign = ref(false)
const showConfirmDeleteStudyInterviewDesign = ref(false)
const showConfirmDeleteStudyInterviewDesigns = ref(false)
const paginationOpts = ref({
  sortBy: 'updatedAt',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const subjects = ref([])

// Vuelidate
const rules = {
  newStudyInterviewDesignData: {
    name: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    },
    label: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    }
  },
  selectedStudyInterviewDesign: {
    name: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    },
    label: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    }
  }
}

const v$ = useVuelidate(rules, { newStudyInterviewDesignData, selectedStudyInterviewDesign })

// Computed
const study = computed(() => studyStore.study)
const studyInterviewDesigns = computed(() => interviewStore.interviewDesigns)
const studyId = computed(() => route.params.id)

const columns = computed(() => {
  const cols = [
    {
      name: 'name',
      required: true,
      label: t('name'),
      align: 'left',
      field: 'name',
      sortable: true
    },
    {
      name: 'label',
      align: 'left',
      label: t('title'),
      field: 'label',
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
      name: 'steps',
      align: 'left',
      label: t('interview.steps'),
      field: 'steps',
      sortable: true
    },
    {
      name: 'updatedAt',
      align: 'left',
      label: t('updated_at'),
      field: 'updatedAt',
      sortable: true,
      format: val =>
        `${val ? date.formatDate(val, 'YYYY-MM-DD HH:mm:ss') : t('unknown')}`
    }
  ]
  if (subjects.value && subjects.value.length > 0) {
    cols.push({
      name: 'permissions',
      align: 'left',
      label: t('restricted_access'),
      field: 'permissions',
      sortable: false
    })
  }
  cols.push({
    name: 'state',
    align: 'left',
    label: t('state'),
    field: 'state',
    sortable: true
  })
  if (!isReadOnly.value) {
    cols.push({
      name: 'action',
      align: 'left',
      label: t('action')
    })
  }
  return cols
})

const userSubjectOptions = computed(() => getSubjectOptions('user'))
const groupSubjectOptions = computed(() => getSubjectOptions('group'))

const disableCreateStudyInterviewDesign = computed(() => v$.value.newStudyInterviewDesignData.$invalid)
const disableEditStudyInterviewDesign = computed(() => v$.value.selectedStudyInterviewDesign.$invalid)
const hasStudyInterviewDesigns = computed(() => studyInterviewDesigns.value && studyInterviewDesigns.value.length > 0)

// Methods
function onAdd() {
  newStudyInterviewDesignData.value = {
    name: '',
    description: '',
    restrictedAccess: false,
    permissions: {
      users: [],
      groups: []
    }
  }
  showCreateStudyInterviewDesign.value = true
  selectedStudyInterviewDesign.value = undefined
}

function onEdit(studyInterviewDesign) {
  selectedStudyInterviewDesign.value = { ...studyInterviewDesign }
  selectedStudyInterviewDesign.value.permissions = {
    users: studyInterviewDesign.permissions && studyInterviewDesign.permissions.users ? studyInterviewDesign.permissions.users : [],
    groups: studyInterviewDesign.permissions && studyInterviewDesign.permissions.groups ? studyInterviewDesign.permissions.groups : []
  }
  selectedStudyInterviewDesign.value.restrictedAccess = selectedStudyInterviewDesign.value.permissions.users.length > 0 || selectedStudyInterviewDesign.value.permissions.groups.length > 0
  showEditStudyInterviewDesign.value = true
}

function onConfirmDelete(studyInterviewDesign) {
  showConfirmDeleteStudyInterviewDesign.value = true
  selectedStudyInterviewDesign.value = studyInterviewDesign
}

function onConfirmDeleteMultiple() {
  if (selected.value.length > 0) {
    showConfirmDeleteStudyInterviewDesigns.value = true
  }
}

function getSubject(id, type) {
  if (subjects.value && subjects.value.length > 0) {
    return subjects.value.filter(s => s.type === type && s.id === id).pop()
  }
  return { id: id, type: type, name: '?' }
}

function getSubjectOptions(type) {
  return subjects.value.filter(s => s.type === type).map(s => {
    return {
      value: s.id,
      label: s.name
    }
  })
}

async function getTableStudyInterviewDesigns(requestProp) {
  if (requestProp) {
    paginationOpts.value = requestProp.pagination
    interviewStore.setInterviewDesignPagination(requestProp.pagination)
    await interviewStore.getInterviewDesigns(requestProp.pagination, studyId.value, requestProp.filter)
  } else {
    await interviewStore.getInterviewDesigns(paginationOpts.value, studyId.value, filter.value)
  }
  paginationOpts.value.rowsNumber = interviewStore.interviewDesignPaginationOpts.rowsNumber
}

function setPagination() {
  paginationOpts.value = interviewStore.interviewDesignPaginationOpts
}

function start(studyInterviewDesign) {
  setState(studyInterviewDesign, 'active')
}

function pause(studyInterviewDesign) {
  setState(studyInterviewDesign, 'paused')
}

function setState(studyInterviewDesign, state) {
  const toSave = { ...studyInterviewDesign }
  toSave.state = state
  interviewStore.updateInterviewDesign(
    toSave,
    undefined,
    paginationOpts.value
  )
}

function deleteStudyInterviewDesign() {
  interviewStore.deleteInterviewDesign(
    selectedStudyInterviewDesign.value._id,
    paginationOpts.value,
    studyId.value
  )
}

function deleteStudyInterviewDesigns() {
  const ids = selected.value.map(u => u._id)
  interviewStore.deleteInterviewDesigns(
    ids,
    paginationOpts.value,
    studyId.value
  )
  selected.value = []
}

async function saveStudyInterviewDesign(create) {
  v$.value.$reset()
  if (create) {
    const toSave = { ...newStudyInterviewDesignData.value }
    toSave.study = studyId.value
    if (toSave.restrictedAccess) {
      // empty permissions means it is not a restricted access
      if (toSave.permissions.users.length === 0 && toSave.permissions.groups.length === 0) {
        toSave.permissions = null
      }
    } else {
      toSave.permissions = null
    }
    interviewStore.createInterviewDesign(
      toSave,
      paginationOpts.value
    )
  } else {
    const toSave = { ...selectedStudyInterviewDesign.value }
    if (selectedStudyInterviewDesign.value.restrictedAccess) {
      // empty permissions means it is not a restricted access
      if (selectedStudyInterviewDesign.value.permissions.users.length === 0 && selectedStudyInterviewDesign.value.permissions.groups.length === 0) {
        toSave.permissions = null
      }
    } else {
      toSave.permissions = null
    }
    delete toSave.restrictedAccess
    if (toSave.revision === t('study.latest_revision')) {
      delete toSave.revision
    }
    interviewStore.updateInterviewDesign(
      toSave,
      undefined,
      paginationOpts.value
    )
  }
}

// Watchers
watch(study, () => {
  getTableStudyInterviewDesigns()
})

// Lifecycle
onMounted(() => {
  setPagination()
  if (studyId.value) {
    getTableStudyInterviewDesigns()
  }
  subjectsService.getSubjects().then((result) => {
    subjects.value = result
  })
})
</script>
