<template>
  <div v-cloak>

    <div class="q-ma-md">
      <div class="q-ml-md q-mr-d">
        <q-btn-dropdown
            class="q-mr-md"
            color="primary"
            icon="download"
            size="sm"
            :title="t('study.export_case_reports_hint')"
            :disable="caseReports.length === 0">
            <q-list>
              <q-item clickable v-close-popup @click="onExport('csv')">
                <q-item-section>
                  <q-item-label>CSV</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onExport('zip')">
                <q-item-section>
                  <q-item-label>CSV (zip)</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onExport('xlsx')">
                <q-item-section>
                  <q-item-label>Excel</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onExport('json')">
                <q-item-section>
                  <q-item-label>JSON</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn
            v-if="!isReadOnly"
            class="q-mr-md"
            flat
            round
            color="negative"
            icon="delete_outline"
            size="sm"
            :disable="selected.length === 0"
            :title="t('study.delete_case_reports_hint')"
            @click="onConfirmDeleteMultiple()" />
      </div>
      <q-table
        flat
        :rows="caseReports"
        :columns="columns"
        :filter="filter"
        row-key="_id"
        :selection="isReadOnly ? 'none' : 'multiple'"
        v-model:selected="selected"
        v-model:pagination='paginationOpts'
        @request='getTableCaseReports'
      >
        <template v-slot:top>
          <q-select
            class="q-mr-md"
            v-model="caseReportFormFilter"
            :options="caseReportFormOptions"
            emit-value
            map-options
            :label="t('study.case_report_form')"
            style="min-width: 200px" />
          <q-select
            class="q-mr-md"
            v-model="formFilter"
            :options="formOptions"
            emit-value
            map-options
            :label="t('study.form')"
            style="min-width: 200px" />
          <div class="q-mr-md" style="max-width: 250px">
            <q-input filled v-model="fromDate" :placeholder="t('from')">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="fromDate" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="t('close')" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="fromDate" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="t('close')" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="close" class="cursor-pointer" @click="onClearDate('from')">
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="q-mr-md" style="max-width: 250px">
            <q-input filled v-model="toDate" :placeholder="t('to')">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="toDate" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="t('close')" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="toDate" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="t('close')" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="close" class="cursor-pointer" @click="onClearDate('to')">
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-space />
          <q-input
            dense
            debounce="300"
            v-model="filter"
            :placeholder="t('search')"
            :title="t('study.search_case_report_hint')">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-caseReportForm='props'>
          <q-td :props='props'>
            <router-link :to="'/study/' + studyId + '/crfs'">{{ getCaseReportFormName(props.row.caseReportForm) }}</router-link>
          </q-td>
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
        <template v-slot:body-cell-state='props'>
          <q-td :props='props'>
            {{ t('study.case_report_state.' + props.row.state) }}
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
              :title="t(isReadOnly ? 'study.view_case_report_hint' : 'study.edit_case_report_hint')"
              :icon="isReadOnly ? 'visibility' : 'edit'"
              @click='onShow(props.row)'>
            </q-btn>
            <q-btn
              v-if="!isReadOnly"
              color="secondary"
              size="12px"
              flat
              dense
              round
              :title="t('study.delete_case_report_hint')"
              icon="delete"
              @click='onConfirmDelete(props.row)'>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model='showCaseReport' persistent :maximized="maximizedToggle">
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-tabs
            v-model="showTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="form" label="form" />
            <q-tab name="data" label="data" />
          </q-tabs>

          <q-separator/>

          <q-tab-panels v-model="showTab">
            <q-tab-panel name="form" class="q-pl-none q-pr-none">
              <q-btn-dropdown icon="translate" flat size="sm" :label="locale">
                <q-list>
                  <q-item @click="onLocale(loc)" clickable v-close-popup v-for="loc in formRevisionLocales" :key="loc">
                    <q-item-section class="text-uppercase">{{ loc }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-separator  class="q-mt-md"/>
              <BlitzForm :key='remountCounter' :schema='formRevisionBlitzarSchema' v-model='modelData' :columnCount='1' gridGap='32px'/>
            </q-tab-panel>

            <q-tab-panel name="data" class="q-pl-none q-pr-none">
              <div class="bg-black text-white q-pa-md">
                <pre>{{ modelDataStr }}</pre>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn v-if="isReadOnly" :label="t('close')" flat v-close-popup />
          <q-btn v-if="!isReadOnly" :label="t('cancel')" flat v-close-popup />
          <q-btn
            v-if="!isReadOnly"
            @click='onSave'
            :label="t('save')"
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

    <q-dialog v-model='showConfirmDeleteCaseReport' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('study.delete_case_report_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ getCaseReportFullName(selectedCaseReport) }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteCaseReport'
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

    <q-dialog v-model='showConfirmDeleteCaseReports' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('study.delete_case_reports_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => getCaseReportFullName(g)).join(', ')}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteCaseReports'
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
import { formRevisionService } from '../../services/form'
import { caseReportExportService } from '../../services/caseReport'
import { date, Notify } from 'quasar'
import { useAuth } from 'src/composables/useAuth'
import { useCaseReportStore } from 'src/stores/caseReport'
import { useStudyStore } from 'src/stores/study'
import { useFormStore } from 'src/stores/form'
import { BlitzForm } from '@blitzar/form'
import { makeBlitzarQuasarSchemaForm } from '@obiba/quasar-ui-amber'

const { t } = useI18n()
const route = useRoute()
const { isReadOnly } = useAuth()
const caseReportStore = useCaseReportStore()
const studyStore = useStudyStore()
const formStore = useFormStore()

// Refs
const remountCounter = ref(0)
const showTab = ref('form')
const locale = ref('en')
const tab = ref('definition')
const selected = ref([])
const filter = ref('')
const caseReportFormFilter = ref('0')
const formFilter = ref('0')
const fromDate = ref('')
const toDate = ref('')
const maximizedToggle = ref(false)
const modelData = ref({})
const selectedFormRevision = ref({ schema: [] })
const selectedCaseReport = ref({})
const showCaseReport = ref(false)
const showConfirmDeleteCaseReport = ref(false)
const showConfirmDeleteCaseReports = ref(false)
const paginationOpts = ref({
  sortBy: 'updatedAt',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})

// Computed refs for store state
const study = computed(() => studyStore.study)
const forms = computed(() => formStore.forms)
const caseReports = computed(() => caseReportStore.caseReports)
const caseReportForms = computed(() => caseReportStore.caseReportForms)
const studyId = computed(() => route.params.id)

const columns = computed(() => [
  {
    name: '_id',
    required: true,
    label: t('id'),
    align: 'left',
    field: row => (row.data && row.data._id) ? row.data._id : '',
    sortable: true
  },
  {
    name: 'caseReportForm',
    required: true,
    label: t('study.case_report_form'),
    align: 'left',
    field: 'caseReportForm',
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
    name: 'updatedAt',
    align: 'left',
    label: t('updated_at'),
    field: 'updatedAt',
    sortable: true,
    format: val =>
      `${val ? date.formatDate(val, 'YYYY-MM-DD HH:mm:ss') : t('unknown')}`
  },
  {
    name: 'action',
    align: 'left',
    label: t('action')
  }
])

const caseReportFormOptions = computed(() => {
  const opts = caseReportForms.value.map(crf => {
    return {
      value: crf._id,
      label: crf.name
    }
  })
  opts.splice(0, 0, {
    value: '0',
    label: t('study.all_forms')
  })
  return opts
})

const formOptions = computed(() => {
  const opts = forms.value.map(form => {
    return {
      value: form._id,
      label: form.name
    }
  })
  opts.splice(0, 0, {
    value: '0',
    label: t('study.all_forms')
  })
  return opts
})

const hasCaseReports = computed(() => caseReports.value && caseReports.value.length > 0)
const modelDataStr = computed(() => JSON.stringify(modelData.value, null, '  '))

const formRevisionLocales = computed(() => {
  return Object.keys(selectedFormRevision.value.schema.i18n).filter(loc => locale.value !== loc)
})

const formRevisionBlitzarSchema = computed(() => {
  return makeBlitzarQuasarSchemaForm(selectedFormRevision.value.schema, { locale: locale.value, debug: true })
})

// Methods
function onFilter() {
  selected.value = []
  caseReportStore.getCaseReports(
    paginationOpts.value,
    studyId.value,
    formFilter.value,
    caseReportFormFilter.value,
    filter.value,
    fromDate.value,
    toDate.value
  )
}

function onExport(format) {
  let accept = 'application/json'
  if (format === 'csv') {
    accept = 'text/csv'
  } else if (format === 'xlsx') {
    accept = 'application/vnd.ms-excel'
  } else if (format === 'zip') {
    accept = 'application/zip'
  }
  const ids = selected.value.map(u => u._id)
  caseReportExportService.downloadCaseReports(accept, studyId.value, caseReportFormFilter.value, formFilter.value, filter.value, fromDate.value, toDate.value, ids)
    .then(response => {
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        const ext = format
        link.setAttribute('download', `case-report-export.${ext}`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } else {
        Notify.create({
          message: 'Case report export failed.',
          color: 'negative'
        })
      }
    })
}

function onLocale(newLocale) {
  locale.value = newLocale
}

function onShow(studyCaseReport) {
  showCaseReport.value = true
  selectedCaseReport.value = studyCaseReport
  modelData.value = {}
  showTab.value = 'form'
  maximizedToggle.value = false
  formRevisionService.getFormRevision(studyCaseReport.form, studyCaseReport.revision)
    .then(res => {
      selectedFormRevision.value = res.data[0]
      modelData.value = studyCaseReport.data
      remountCounter.value++
    })
}

function onSave() {
  const updatedData = { ...modelData.value }
  caseReportStore.updateCaseReport(
    { data: updatedData },
    selectedCaseReport.value._id,
    paginationOpts.value,
    studyId.value
  )
}

function onConfirmDelete(studyCaseReport) {
  showConfirmDeleteCaseReport.value = true
  selectedCaseReport.value = studyCaseReport
}

function onConfirmDeleteMultiple() {
  if (selected.value.length > 0) {
    showConfirmDeleteCaseReports.value = true
  }
}

function onClearDate(name) {
  if (name === 'from') {
    fromDate.value = ''
  } else {
    toDate.value = ''
  }
}

function getCaseReportFormName(crfId) {
  return caseReportForms.value.filter(crf => crf._id === crfId).map(crf => crf.name).pop()
}

function getFormName(formId) {
  return forms.value.filter(form => form._id === formId).map(form => form.name).pop()
}

function getCaseReportFullName(caseReport) {
  return getCaseReportID(caseReport) + ':' + getCaseReportFormName(caseReport.caseReportForm) + ':' + (caseReport.revision ? caseReport.revision : t('study.latest_revision'))
}

function getCaseReportID(caseReport) {
  return caseReport.data && caseReport.data._id ? caseReport.data._id : ''
}

async function getTableCaseReports(requestProp) {
  if (requestProp) {
    paginationOpts.value = requestProp.pagination
    caseReportStore.setCaseReportPagination(requestProp.pagination)
    await caseReportStore.getCaseReports(requestProp.pagination, studyId.value, formFilter.value, undefined, requestProp.filter, fromDate.value, toDate.value)
  } else {
    await caseReportStore.getCaseReports(paginationOpts.value, studyId.value, formFilter.value, undefined, filter.value, fromDate.value, toDate.value)
  }
  paginationOpts.value.rowsNumber = caseReportStore.caseReportPaginationOpts.rowsNumber
}

function setPagination() {
  paginationOpts.value = caseReportStore.caseReportPaginationOpts
}

function deleteCaseReport() {
  caseReportStore.deleteCaseReport(
    selectedCaseReport.value._id,
    paginationOpts.value,
    studyId.value
  )
}

function deleteCaseReports() {
  const ids = selected.value.map(u => u._id)
  caseReportStore.deleteCaseReports(
    ids,
    paginationOpts.value,
    studyId.value
  )
  selected.value = []
}

// Watchers
watch(study, () => {
  getTableCaseReports()
})

watch(caseReportFormFilter, () => {
  onFilter()
})

watch(formFilter, () => {
  onFilter()
})

watch(fromDate, () => {
  onFilter()
})

watch(toDate, () => {
  onFilter()
})

// Lifecycle
onMounted(() => {
  setPagination()
  if (study.value) {
    caseReportStore.getCaseReportForms(paginationOpts.value, studyId.value)
    formStore.getForms(paginationOpts.value, studyId.value)
    getTableCaseReports()
  }
})
</script>
