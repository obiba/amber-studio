<template>
  <div v-cloak>
    <q-table
      class="q-ma-md"
      v-if="hasStudyForms"
      flat
      :rows="studyForms"
      :columns="columns"
      :filter="filter"
      row-key="_id"
      :selection="isReadOnly ? 'none' : 'multiple'"
      v-model:selected="selected"
      v-model:pagination='paginationOpts'
      @request='getTableStudyForms'
    >
      <template v-slot:top>
        <q-btn
          v-if="!isReadOnly"
          color="primary"
          icon="add"
          :title="t('study.add_study_form_hint')"
          size="sm"
          @click="onAdd()"
          class="q-mr-md" />
        <q-btn
          v-if="!isReadOnly"
          class="q-mr-md"
          flat
          round
          color="negative"
          icon="delete_outline"
          size="sm"
          :disable="selected.length === 0"
          :title="t('study.delete_study_forms_hint')"
          @click="onConfirmDeleteMultiple()" />
        <q-space />
        <q-input
          dense
          debounce="300"
          v-model="filter"
          :placeholder="t('search')"
          :title="t('study.search_study_form_hint')">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-name='props'>
        <q-td :props='props'>
          <router-link :to="'/study/' + studyId + '/form/' + props.row._id">{{ props.row.name }}</router-link>
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
            :title="t('study.edit_study_form_hint')"
            icon="edit"
            :to="'/study/' + studyId + '/form/' + props.row._id">
          </q-btn>
          <q-btn
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('study.delete_study_form_hint')"
            icon="delete"
            @click='onConfirmDelete(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-btn
      v-else
      color="primary"
      icon="add"
      :label="t('study.add_study_form_hint')"
      @click="onAdd()"
      class="q-ma-md" />

    <q-dialog v-model='showCreateStudyForm' persistent>
      <q-card>
        <q-card-section class="row items-center">
           <div class="col-12">
            <q-input
              v-model='newStudyFormData.name'
              :label="t('name')"
              lazy-rules
              class="q-ma-sm"
              @blur="v$.newStudyFormData.name.$touch"
              :error="v$.newStudyFormData.name.$error"
              :hint="t('required')"
            >
              <template v-slot:error>
                <div v-for="error in v$.newStudyFormData.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input
              v-model='newStudyFormData.description'
              :label="t('description')"
              autogrow
              lazy-rules
              class="q-ma-sm"
            />
          </div>
          <div class="col-12">
            <q-file
              v-model="newStudyFormData.importSchema"
              :label="t('study.import_schema')"
              :hint="t('study.import_schema_hint')"
              class="q-ma-sm"
              accept=".json"
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveStudyForm'
            :disable='disableCreateStudyForm'
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

    <q-dialog v-model='showConfirmDeleteStudyForm' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('study.delete_study_form_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedStudyForm.name}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyForm'
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

    <q-dialog v-model='showConfirmDeleteStudyForms' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('study.delete_study_forms_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => g.name).join(', ')}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyForms'
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
import useVuelidate from '@vuelidate/core'
import { date } from 'quasar'
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { useFormStore } from 'src/stores/form'
import { useAuth } from 'src/composables/useAuth'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const formStore = useFormStore()
const { isReadOnly } = useAuth()
const route = useRoute()
const { t } = useI18n()

// Refs
const tab = ref('definition')
const selected = ref([])
const filter = ref('')
const newStudyFormData = ref({
  name: '',
  description: ''
})
const selectedStudyForm = ref({})
const showCreateStudyForm = ref(false)
const showConfirmDeleteStudyForm = ref(false)
const showConfirmDeleteStudyForms = ref(false)
const paginationOpts = ref({
  sortBy: 'name',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})

// Validation rules
const rules = {
  newStudyFormData: {
    name: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    }
  }
}

const v$ = useVuelidate(rules, { newStudyFormData })

// Computed
const studyForms = computed(() => formStore.forms)
const formPaginationOpts = computed(() => formStore.formPaginationOpts)

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
      name: 'updatedAt',
      align: 'left',
      label: t('updated_at'),
      field: 'updatedAt',
      sortable: true,
      format: val =>
        `${val ? date.formatDate(val, 'YYYY-MM-DD HH:mm:ss') : t('unknown')}`
    }
  ]
  if (!isReadOnly.value) {
    cols.push({
      name: 'action',
      align: 'left',
      label: t('action')
    })
  }
  return cols
})

const disableCreateStudyForm = computed(() => v$.value.newStudyFormData.$invalid)

const hasStudyForms = computed(() => studyForms.value && studyForms.value.length > 0)

// Watch
watch(() => route.params.id, () => {
  getTableStudyForms()
})

// Methods
function onAdd () {
  newStudyFormData.value = {}
  showCreateStudyForm.value = true
  selectedStudyForm.value = undefined
}

function onConfirmDelete (studyForm) {
  showConfirmDeleteStudyForm.value = true
  selectedStudyForm.value = studyForm
}

function onConfirmDeleteMultiple () {
  if (selected.value.length > 0) {
    showConfirmDeleteStudyForms.value = true
  }
}

async function getTableStudyForms (requestProp) {
  if (requestProp) {
    paginationOpts.value = requestProp.pagination
    formStore.setFormPagination(requestProp.pagination)
    await formStore.getForms(requestProp.pagination, studyId.value, requestProp.filter)
  } else {
    await formStore.getForms(paginationOpts.value, studyId.value, filter.value)
  }
  paginationOpts.value.rowsNumber = formStore.formPaginationOpts.rowsNumber
}

function setPagination () {
  paginationOpts.value = { ...formStore.formPaginationOpts }
}

function deleteStudyForm () {
  formStore.deleteForm(selectedStudyForm.value._id, paginationOpts.value, studyId.value)
}

function deleteStudyForms () {
  const ids = selected.value.map(u => u._id)
  formStore.deleteForms(ids, paginationOpts.value, studyId.value)
  selected.value = []
}

async function saveStudyForm () {
  v$.value.$reset()
  const toSave = { ...newStudyFormData.value }
  toSave.study = studyId.value

  if (newStudyFormData.value.importSchema) {
    delete toSave.importSchema
    const reader = new FileReader()
    reader.readAsText(newStudyFormData.value.importSchema, 'UTF-8')
    reader.onload = evt => {
      const schema = JSON.parse(evt.target.result)
      toSave.schema = schema
      toSave.schema.name = '.'
      if (!toSave.schema.label) {
        toSave.schema.label = toSave.name
      }
      if (!toSave.schema.description) {
        toSave.schema.description = toSave.description
      }
      formStore.createForm(toSave, paginationOpts.value, studyId.value)
    }
    reader.onerror = evt => {
      console.error(evt)
    }
  } else {
    toSave.schema = {
      label: toSave.name,
      description: toSave.description
    }
    formStore.createForm(toSave, paginationOpts.value, studyId.value)
  }
}

// Lifecycle
onMounted(() => {
  setPagination()
  if (studyId.value) {
    getTableStudyForms()
  }
})
</script>
