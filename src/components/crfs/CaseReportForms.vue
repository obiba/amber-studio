<template>
  <div v-cloak>

    <q-card class="q-ma-md"
      v-if="hasStudyCaseReportForms">
      <q-card-section>
        <q-table
          flat
          :rows="studyCaseReportForms"
          :columns="columns"
          :filter="filter"
          row-key="_id"
          :selection="isReadOnly ? 'none' : 'multiple'"
          v-model:selected="selected"
          v-model:pagination='paginationOpts'
          @request='getTableStudyCaseReportForms'
        >
          <template v-slot:top>
            <q-btn
              v-if="!isReadOnly"
              color="primary"
              icon="add"
              :title="t('study.add_case_report_form_hint')"
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
              :title="t('study.delete_case_report_forms_hint')"
              @click="onConfirmDeleteMultiple()" />
            <q-space />
            <q-input
              dense
              debounce="300"
              v-model="filter"
              :placeholder="t('search')"
              :title="t('study.search_case_report_form_hint')">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-form='props'>
            <q-td :props='props'>
              <router-link :to="'/study/' + studyId + '/form/' + props.row.form">{{ getFormName(props.row.form) }}</router-link>
            </q-td>
          </template>
          <template v-slot:body-cell-revision='props'>
            <q-td :props='props'>
              {{ props.row.revision ? props.row.revision : t('study.latest_revision') }}
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
          <template v-slot:body-cell-repeatPolicy='props'>
            <q-td :props='props'>
              {{ props.row.repeatPolicy ? t('study.case_report_form_repeat_policy.' + props.row.repeatPolicy) : '?' }}
            </q-td>
          </template>
          <template v-slot:body-cell-state='props'>
            <q-td :props='props'>
              {{ t('study.case_report_form_state.' + props.row.state) }}
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
                :title="t('study.edit_case_report_form_hint')"
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
                :title="t('study.start_case_report_form_hint')"
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
                :title="t('study.pause_case_report_form_hint')"
                icon="pause"
                @click='pause(props.row)'>
              </q-btn>
              <q-btn
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="t('study.delete_case_report_form_hint')"
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
      :label="t('study.add_case_report_form_hint')"
      @click="onAdd()"
      class="q-ma-md" />

    <q-dialog v-model='showCreateStudyCaseReportForm' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='newStudyCaseReportFormData.name'
            :label="t('name')"
            lazy-rules
            @blur="v$.newStudyCaseReportFormData.name.$touch"
            :error="v$.newStudyCaseReportFormData.name.$error"
            :hint="t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.newStudyCaseReportFormData.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='newStudyCaseReportFormData.description'
            :label="t('description')"
            autogrow
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="newStudyCaseReportFormData.form"
            :options="formOptions"
            emit-value
            map-options
            :label="t('study.form')" />
          <q-select
            v-model="newStudyCaseReportFormData.revision"
            :options="revisionOptions"
            emit-value
            map-options
            :label="t('study.form_revision')"
            :disable="!newStudyCaseReportFormData.form" />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="newStudyCaseReportFormData.repeatPolicy"
            :options="repeatOptions"
            emit-value
            map-options
            :label="t('study.case_report_form_repeat_policy.title')"
            :hint="t('study.case_report_form_repeat_policy.hint')" />
        </q-card-section>
        <q-card-section>
          <q-toggle
            class="q-mt-md"
            v-model="newStudyCaseReportFormData.restrictedAccess"
            :label="t('restricted_access')"
          />
          <q-select
            v-if="newStudyCaseReportFormData.restrictedAccess"
            v-model="newStudyCaseReportFormData.permissions.users"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="t('study.permitted_users')" />
          <q-select
            v-if="newStudyCaseReportFormData.restrictedAccess"
            v-model="newStudyCaseReportFormData.permissions.groups"
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
            @click='saveStudyCaseReportForm(true)'
            :disable='disableCreateStudyCaseReportForm'
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

    <q-dialog v-model='showEditStudyCaseReportForm' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='selectedStudyCaseReportForm.name'
            :label="t('name')"
            lazy-rules
            @blur="v$.selectedStudyCaseReportForm.name.$touch"
            :error="v$.selectedStudyCaseReportForm.name.$error"
            :hint="t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.selectedStudyCaseReportForm.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='selectedStudyCaseReportForm.description'
            :label="t('description')"
            autogrow
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="selectedStudyCaseReportForm.revision"
            :options="revisionOptions"
            emit-value
            map-options
            :label="t('study.form_revision')" />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="selectedStudyCaseReportForm.repeatPolicy"
            :options="repeatOptions"
            emit-value
            map-options
            :label="t('study.case_report_form_repeat_policy.title')"
            :hint="t('study.case_report_form_repeat_policy.hint')" />
        </q-card-section>
        <q-card-section>
          <q-toggle
            class="q-mt-md"
            v-model="selectedStudyCaseReportForm.restrictedAccess"
            :label="t('restricted_access')"
          />
          <q-select
            v-if="selectedStudyCaseReportForm.restrictedAccess"
            v-model="selectedStudyCaseReportForm.permissions.users"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="t('study.permitted_users')" />
          <q-select
            v-if="selectedStudyCaseReportForm.restrictedAccess"
            v-model="selectedStudyCaseReportForm.permissions.groups"
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
            @click='saveStudyCaseReportForm(false)'
            :disable='disableEditStudyCaseReportForm'
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

    <q-dialog v-model='showConfirmCreateFormRevision' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('study.add_form_revision_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ getFormName(newStudyCaseReportFormData.form) }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='createFormRevision'
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

    <q-dialog v-model='showConfirmDeleteStudyCaseReportForm' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('study.delete_case_report_form_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ getCaseReportFormFullName(selectedStudyCaseReportForm) }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyCaseReportForm'
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

    <q-dialog v-model='showConfirmDeleteStudyCaseReportForms' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('study.delete_case_report_forms_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => getCaseReportFormFullName(g)).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyCaseReportForms'
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
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { formRevisionService } from '../../services/form'
import { date } from 'quasar'
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { subjectsService } from '../../services/utils'
import { useAuth } from 'src/composables/useAuth'
import { useCaseReportStore } from 'src/stores/caseReport'
import { useStudyStore } from 'src/stores/study'
import { useFormStore } from 'src/stores/form'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const { isReadOnly } = useAuth()
const caseReportStore = useCaseReportStore()
const studyStore = useStudyStore()
const formStore = useFormStore()
const route = useRoute()

// Refs
const selected = ref([])
const filter = ref('')
const newStudyCaseReportFormData = ref({
  name: '',
  description: '',
  repeatPolicy: 'multiple'
})
const revisionOptions = ref([])
const selectedStudyCaseReportForm = ref({})
const showCreateStudyCaseReportForm = ref(false)
const showEditStudyCaseReportForm = ref(false)
const showConfirmCreateFormRevision = ref(false)
const showConfirmDeleteStudyCaseReportForm = ref(false)
const showConfirmDeleteStudyCaseReportForms = ref(false)
const paginationOpts = ref({
  sortBy: 'updatedAt',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const subjects = ref([])

// Validation rules
const rules = {
  newStudyCaseReportFormData: {
    name: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    }
  },
  selectedStudyCaseReportForm: {
    name: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    }
  }
}

const v$ = useVuelidate(rules, { newStudyCaseReportFormData, selectedStudyCaseReportForm })

// Computed
const study = computed(() => studyStore.study)
const forms = computed(() => formStore.forms)
const studyCaseReportForms = computed(() => caseReportStore.caseReportForms)

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
      name: 'description',
      align: 'left',
      label: t('description'),
      field: 'description',
      sortable: true
    },
    {
      name: 'form',
      required: true,
      label: t('study.form'),
      align: 'left',
      field: 'form',
      sortable: true
    },
    {
      name: 'revision',
      align: 'left',
      label: t('revision'),
      field: 'revision',
      sortable: true
    },
    {
      name: 'repeatPolicy',
      align: 'left',
      label: t('study.case_report_form_repeat_policy.title'),
      field: 'repeatPolicy',
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

const formOptions = computed(() => {
  return forms.value.map(form => {
    return {
      value: form._id,
      label: form.name
    }
  })
})

const repeatOptions = computed(() => {
  return [
    'multiple', 'single_reject', 'single_update'
  ].map(opt => {
    return {
      value: opt,
      label: t('study.case_report_form_repeat_policy.' + opt)
    }
  })
})

const userSubjectOptions = computed(() => getSubjectOptions('user'))
const groupSubjectOptions = computed(() => getSubjectOptions('group'))

const disableCreateStudyCaseReportForm = computed(() => {
  return v$.value.newStudyCaseReportFormData.$invalid || !newStudyCaseReportFormData.value.form || !newStudyCaseReportFormData.value.revision || revisionOptions.value.length === 0
})

const disableEditStudyCaseReportForm = computed(() => {
  return v$.value.selectedStudyCaseReportForm.$invalid || !selectedStudyCaseReportForm.value.revision || revisionOptions.value.length === 0
})

const hasStudyCaseReportForms = computed(() => {
  return studyCaseReportForms.value && studyCaseReportForms.value.length > 0
})

// Watchers
watch(study, () => {
  getTableStudyCaseReportForms()
})

watch(() => newStudyCaseReportFormData.value.form, (newForm) => {
  if (newForm) {
    updateRevisionOptions(newForm)
  } else {
    revisionOptions.value = []
  }
})

// Methods
function updateRevisionOptions (form) {
  formRevisionService.getFormRevisionsDigest(studyId.value, form)
    .then((response) => {
      revisionOptions.value = response.data ? response.data.map(rev => rev.revision) : []
      if (revisionOptions.value.length > 0) {
        revisionOptions.value.splice(0, 0, t('study.latest_revision'))
      } else {
        showConfirmCreateFormRevision.value = true
      }
    })
}

function onAdd () {
  newStudyCaseReportFormData.value = {
    name: '',
    description: '',
    repeatPolicy: 'multiple',
    restrictedAccess: false,
    permissions: {
      users: [],
      groups: []
    }
  }
  showCreateStudyCaseReportForm.value = true
  selectedStudyCaseReportForm.value = undefined
}

function onEdit (studyCaseReportForm) {
  selectedStudyCaseReportForm.value = { ...studyCaseReportForm }
  selectedStudyCaseReportForm.value.permissions = {
    users: studyCaseReportForm.permissions && studyCaseReportForm.permissions.users ? studyCaseReportForm.permissions.users : [],
    groups: studyCaseReportForm.permissions && studyCaseReportForm.permissions.groups ? studyCaseReportForm.permissions.groups : []
  }
  selectedStudyCaseReportForm.value.restrictedAccess = selectedStudyCaseReportForm.value.permissions.users.length > 0 || selectedStudyCaseReportForm.value.permissions.groups.length > 0
  updateRevisionOptions(selectedStudyCaseReportForm.value.form)
  showEditStudyCaseReportForm.value = true
}

function onConfirmDelete (studyCaseReportForm) {
  showConfirmDeleteStudyCaseReportForm.value = true
  selectedStudyCaseReportForm.value = studyCaseReportForm
}

function onConfirmDeleteMultiple () {
  if (selected.value.length > 0) {
    showConfirmDeleteStudyCaseReportForms.value = true
  }
}

function getSubject (id, type) {
  if (subjects.value && subjects.value.length > 0) {
    return subjects.value.filter(s => s.type === type && s.id === id).pop()
  }
  return { id: id, type: type, name: '?' }
}

function getSubjectOptions (type) {
  return subjects.value.filter(s => s.type === type).map(s => {
    return {
      value: s.id,
      label: s.name
    }
  })
}

function getFormName (formId) {
  return forms.value.filter(form => form._id === formId).map(form => form.name).pop()
}

function getCaseReportFormFullName (caseReportForm) {
  return getFormName(caseReportForm.form) + ':' + (caseReportForm.revision ? caseReportForm.revision : t('study.latest_revision'))
}

async function getTableStudyCaseReportForms (requestProp) {
  if (requestProp) {
    paginationOpts.value = requestProp.pagination
    caseReportStore.setCaseReportFormPagination(requestProp.pagination)
    await caseReportStore.getCaseReportForms(requestProp.pagination, studyId.value, requestProp.filter)
  } else {
    await caseReportStore.getCaseReportForms(paginationOpts.value, studyId.value, filter.value)
  }
  paginationOpts.value.rowsNumber = caseReportStore.caseReportFormPaginationOpts.rowsNumber
}

function setPagination () {
  paginationOpts.value = caseReportStore.caseReportFormPaginationOpts
}

function start (studyCaseReportForm) {
  setState(studyCaseReportForm, 'active')
}

function pause (studyCaseReportForm) {
  setState(studyCaseReportForm, 'paused')
}

function setState (studyCaseReportForm, state) {
  const toSave = { ...studyCaseReportForm }
  toSave.state = state
  caseReportStore.updateCaseReportForm(
    toSave,
    undefined,
    paginationOpts.value
  )
}

async function createFormRevision () {
  const toSave = {
    form: newStudyCaseReportFormData.value.form,
    study: studyId.value
  }
  await formStore.createFormRevision(toSave)
  updateRevisionOptions()
}

function deleteStudyCaseReportForm () {
  caseReportStore.deleteCaseReportForm(
    selectedStudyCaseReportForm.value._id,
    paginationOpts.value,
    studyId.value
  )
}

function deleteStudyCaseReportForms () {
  const ids = selected.value.map(u => u._id)
  caseReportStore.deleteCaseReportForms(
    ids,
    paginationOpts.value,
    studyId.value
  )
  selected.value = []
}

async function saveStudyCaseReportForm (create) {
  v$.value.$reset()
  if (create) {
    const toSave = { ...newStudyCaseReportFormData.value }
    toSave.study = studyId.value
    if (toSave.restrictedAccess) {
      // empty permissions means it is not a restricted access
      if (toSave.permissions.users.length === 0 && toSave.permissions.groups.length === 0) {
        toSave.permissions = null
      }
    } else {
      toSave.permissions = null
    }
    if (toSave.revision === t('study.latest_revision')) {
      delete toSave.revision
    }
    caseReportStore.createCaseReportForm(
      toSave,
      paginationOpts.value
    )
  } else {
    const toSave = { ...selectedStudyCaseReportForm.value }
    if (selectedStudyCaseReportForm.value.restrictedAccess) {
      // empty permissions means it is not a restricted access
      if (selectedStudyCaseReportForm.value.permissions.users.length === 0 && selectedStudyCaseReportForm.value.permissions.groups.length === 0) {
        toSave.permissions = null
      }
    } else {
      toSave.permissions = null
    }
    delete toSave.restrictedAccess
    if (toSave.revision === t('study.latest_revision')) {
      delete toSave.revision
    }
    caseReportStore.updateCaseReportForm(
      toSave,
      undefined,
      paginationOpts.value
    )
  }
}

// Lifecycle
onMounted(() => {
  setPagination()
  if (studyId.value) {
    formStore.getForms(undefined, studyId.value)
    getTableStudyCaseReportForms()
  }
  subjectsService.getSubjects().then((result) => {
    subjects.value = result
  })
})
</script>
