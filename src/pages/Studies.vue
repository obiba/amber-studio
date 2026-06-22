<template>
  <q-page>
    <div class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="t('studies.title')" />
      </q-breadcrumbs>
    </div>
    <q-separator/>
    <div class="text-h5 q-ma-md">{{t('studies.title')}}</div>
    <div v-cloak>
      
          <q-table
            class="q-ma-md"
            v-if="studies && studies.length > 0"
            flat
            :rows="studies"
            :columns="columns"
            :filter="filter"
            row-key="name"
            :selection="isReadOnly ? 'none' : 'multiple'"
            v-model:selected="selected"
            v-model:pagination='paginationOpts'
            @request='getTableStudies'
            >
            <template v-slot:top>
              <q-btn
                v-if="!isReadOnly"
                color="primary"
                icon="add"
                size="sm"
                :title="t('studies.add_study_hint')"
                @click="createStudy()"
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
                :title="t('studies.delete_studies_hint')"
                @click="confirmDeleteStudies()" />
              <q-space />
              <q-input
                dense
                debounce="300"
                v-model="filter"
                :placeholder="t('search')"
                :title="t('studies.search_hint')">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
            </template>
            <template v-slot:body-cell-name='props'>
              <q-td :props='props'>
                <router-link :to="'/study/' + props.row._id">{{ props.row.name }}</router-link>
              </q-td>
            </template>
            <template v-slot:body-cell-description='props'>
              <q-td :props='props'>
                <div style="white-space: normal">
                  {{ makeEllipsis(props.row.description, 100) }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-forms='props'>
              <q-td :props='props'>
                <q-badge color="primary">{{ props.row.forms?.length || 0 }}</q-badge>
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
                  :title="t('studies.edit_study_hint')"
                  icon='edit'
                  :to="'/study/' + props.row._id">
                </q-btn>
                <q-btn
                  color="secondary"
                  size="12px"
                  flat
                  dense
                  round
                  :title="t('studies.delete_study_hint')"
                  icon='delete'
                  @click='confirmDeleteStudy(props.row)'>
                </q-btn>
              </q-td>
            </template>
          </q-table>

      <q-btn
        v-else
        color="primary"
        icon="add"
        size="sm"
        :label="t('studies.add_study_hint')"
        @click="createStudy()"
        class="q-mt-md q-ml-md" />
    </div>

    <q-dialog v-model='showCreateStudy' persistent>
      <q-card>
        <q-card-section class='row items-center'>
            <div class='col-12'>
            <q-input
              v-model='newStudyData.name'
              :label="t('name')"
              lazy-rules
              class='q-ma-sm'
              @blur="v$.newStudyData.name.$touch"
              :error="v$.newStudyData.name.$error"
              :hint="t('required')"
            >
              <template v-slot:error>
                <div v-for="error in v$.newStudyData.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12'>
            <q-input
              v-model='newStudyData.description'
              :label="t('description')"
              autogrow
              lazy-rules
              class='q-ma-sm'
            />
            <q-select
              v-model="newStudyData.services"
              :label="t('study.services')"
              :hint="t('study.services_hint')"
              :options="servicesOptions"
              multiple
              emit-value
              map-options
              clearable
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveStudy'
            :disable='disableCreateStudy'
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

    <q-dialog v-model='showConfirmDeleteStudy' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('studies.delete_study_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedStudy.name}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudy'
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

    <q-dialog v-model='showConfirmDeleteStudies' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('studies.delete_studies_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => g.name).join(', ')}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudies'
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
import useVuelidate from '@vuelidate/core'
import { date } from 'quasar'
import { useI18n } from 'vue-i18n'
import { required, minLength, maxLength } from '../boot/vuelidate'
import { settings } from '../boot/settings'
import { useStudyStore } from 'src/stores/study'
import { useAuth } from 'src/composables/useAuth'

const { t } = useI18n()
const studyStore = useStudyStore()
const { isReadOnly } = useAuth()

// data
const selected = ref([])
const filter = ref('')
const selectedStudy = ref({})
const showCreateStudy = ref(false)
const showConfirmDeleteStudy = ref(false)
const showConfirmDeleteStudies = ref(false)
const paginationOpts = ref({
  sortBy: 'name',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const newStudyData = ref({
  name: '',
  description: '',
  services: undefined
})

// validations
const rules = {
  newStudyData: {
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
}
const v$ = useVuelidate(rules, { newStudyData })

// computed
const studies = computed(() => studyStore.studies)
const disableCreateStudy = computed(() => v$.value.newStudyData.$invalid)
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
      name: 'forms',
      align: 'left',
      label: t('study.forms'),
      field: 'forms',
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
const servicesOptions = computed(() => [
  { label: t('study.case_reports'), value: 'case-reports' },
  { label: t('study.interviews'), value: 'interviews' }
])

// methods
function makeEllipsis(text, length) {
  if (text && text.length > length) {
    return text.substring(0, length) + ' ...'
  }
  return text
}

function setPagination() {
  paginationOpts.value = { ...studyStore.studyPaginationOpts }
}

async function getTableStudies(requestProp) {
  if (requestProp) {
    paginationOpts.value = { ...requestProp.pagination }
    studyStore.setStudyPagination(requestProp.pagination)
    await studyStore.getStudies(requestProp.pagination, requestProp.filter)
  } else {
    await studyStore.getStudies(paginationOpts.value, filter.value)
  }
  paginationOpts.value.rowsNumber = studyStore.studyPaginationOpts.rowsNumber
}

function createStudy() {
  newStudyData.value = { name: '', description: '', services: undefined }
  showCreateStudy.value = true
  selectedStudy.value = undefined
}

function confirmDeleteStudy(study) {
  showConfirmDeleteStudy.value = true
  selectedStudy.value = study
}

function confirmDeleteStudies() {
  if (selected.value.length > 0) {
    showConfirmDeleteStudies.value = true
  }
}

async function saveStudy() {
  v$.value.$reset()
  // create
  const createdData = { ...newStudyData.value }
  studyStore.createStudy(createdData, paginationOpts.value)
}

function deleteStudy() {
  studyStore.deleteStudy(selectedStudy.value._id, paginationOpts.value)
}

function deleteStudies() {
  const ids = selected.value.map(u => u._id)
  studyStore.deleteStudies(ids, paginationOpts.value)
  selected.value = []
}

// mounted
onMounted(() => {
  getTableStudies()
  setPagination()
})
</script>

<style scoped>

</style>
