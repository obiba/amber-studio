<template>
  <div v-cloak>
    <div class="q-ma-md">
      <div class="q-ml-md q-mr-d">
        <q-btn-dropdown
            class="q-mr-md"
            color="primary"
            icon="download"
            size="sm"
            :title="t('study.export_interviews_hint')"
            :disable="interviews.length === 0">
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
            :title="t('study.delete_interviews_hint')"
            @click="onConfirmDeleteMultiple()" />
      </div>
      <q-table
        flat
        :rows="interviews"
        :columns="columns"
        :filter="filter"
        row-key="_id"
        :selection="isReadOnly ? 'none' : 'multiple'"
        v-model:selected="selected"
        v-model:pagination='paginationOpts'
        @request='getTableInterviews'
      >
        <template v-slot:top>
          <q-select
            class="q-mr-md"
            v-model="interviewDesignFilter"
            :options="interviewDesignOptions"
            emit-value
            map-options
            :label="t('study.interview_design')"
            style="min-width: 150px"
            @update:model-value="onFilter" />
          <q-select
            class="q-mr-md"
            v-model="campaignFilter"
            :options="campaignOptions"
            emit-value
            map-options
            :label="t('study.campaign')"
            style="min-width: 150px"
            @update:model-value="onFilter" />
          <q-select
            class="q-mr-md"
            v-model="stateFilter"
            :options="stateOptions"
            emit-value
            map-options
            :label="t('state')"
            style="min-width: 150px"
            @update:model-value="onFilter" />
          <q-select
            class="q-mr-md"
            v-model="eligibleFilter"
            :options="eligibleOptions"
            emit-value
            map-options
            :label="t('interview.participant_eligibility')"
            style="min-width: 150px"
            @update:model-value="onFilter"/>
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
            :title="t('study.search_interview_hint')">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-code="props">
          <q-td :props="props">
            <q-chip>{{ props.row.code }}</q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-interviewDesign='props'>
          <q-td :props='props'>
            <router-link :to="'/study/' + studyId + '/interview-design/' + props.row.interviewDesign">{{ getInterviewDesignName(props.row.interviewDesign) }}</router-link>
          </q-td>
        </template>
        <template v-slot:body-cell-revision='props'>
          <q-td :props='props'>
            {{ props.row.revision ? props.row.revision : t('study.latest_revision') }}
          </q-td>
        </template>
        <template v-slot:body-cell-state='props'>
          <q-td :props='props'>
            {{ t('study.interview_state.' + props.row.state) }}
          </q-td>
        </template>
        <template v-slot:body-cell-participantValid='props'>
          <q-td :props='props'>
            <q-icon v-if="props.row.participantValid" name="done"
              size="sm"
              color="secondary"/>
          </q-td>
        </template>
        <template v-slot:body-cell-action='props'>
          <q-td :props='props'>
            <q-btn
              v-if="!isReadOnly"
              color="secondary"
              size="12px"
              flat
              dense
              round
              :title="t('study.edit_interview_filling_date_hint')"
              icon="access_time_filled"
              @click='onShowEditFillingDate(props.row)'>
            </q-btn>
            <q-btn
              color="secondary"
              size="12px"
              flat
              dense
              round
              :title="t('study.view_interview_data_hint')"
              icon="visibility"
              @click='onShow(props.row)'>
            </q-btn>
            <q-btn
              v-if="!isReadOnly"
              color="secondary"
              size="12px"
              flat
              dense
              round
              :title="t('study.delete_interview_hint')"
              icon="delete"
              @click='onConfirmDelete(props.row)'>
            </q-btn>
            <q-btn
              v-if="!isReadOnly && props.row.state === 'completed' && props.row.participantValid"
              color="secondary"
              size="12px"
              flat
              dense
              round
              :title="t('study.reopen_interview_hint')"
              icon="replay"
              @click='onReopen(props.row)'>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model='showInterview' persistent :maximized="maximizedToggle">
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
          <div class="bg-black text-white q-pa-md">
            <pre>{{ modelDataStr }}</pre>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('close')" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteInterview' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('study.delete_interview_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ getInterviewFullName(selectedInterview) }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteInterview'
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

    <q-dialog v-model='showConfirmDeleteInterviews' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('study.delete_interviews_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => getInterviewFullName(g)).join(', ')}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteInterviews'
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

    <q-dialog v-model='showEditFillingDate' persistent>
      <q-card style="width: 400px; max-width: 80vw;">
        <q-card-section>
          <div class="q-mb-sm">
            <q-chip>{{ selectedInterview.code }}</q-chip>
          </div>
          <q-input filled v-model="selectedFillingDate" :label="t('study.interview_filling_date')" :hint="t('study.interview_filling_date_hint')">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="selectedFillingDate" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="t('close')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='onEditFillingDate'
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

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { interviewService } from '../../services/interview'
import { date, Notify } from 'quasar'
import { useInterviewStore } from 'src/stores/interview'
import { useStudyStore } from 'src/stores/study'
import { useAuth } from 'src/composables/useAuth'

const { t } = useI18n()
const route = useRoute()
const interviewStore = useInterviewStore()
const studyStore = useStudyStore()
const { isReadOnly } = useAuth()

// Refs
const selected = ref([])
const filter = ref('')
const interviewDesignFilter = ref('0')
const campaignFilter = ref('0')
const stateFilter = ref('0')
const eligibleFilter = ref('0')
const fromDate = ref('')
const toDate = ref('')
const maximizedToggle = ref(false)
const modelData = ref({})
const selectedInterview = ref({})
const selectedFillingDate = ref(null)
const showInterview = ref(false)
const showConfirmDeleteInterview = ref(false)
const showConfirmDeleteInterviews = ref(false)
const showEditFillingDate = ref(false)
const paginationOpts = ref({
  sortBy: 'updatedAt',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})

// Computed
const study = computed(() => studyStore.study)
const interviews = computed(() => interviewStore.interviews)
const interviewDesigns = computed(() => interviewStore.interviewDesigns)
const campaigns = computed(() => interviewStore.campaigns)
const studyId = computed(() => route.params.id)

const columns = computed(() => [
  {
    name: 'code',
    required: true,
    label: t('interview.participant_code'),
    align: 'left',
    field: 'code',
    sortable: true
  },
  {
    name: 'identifier',
    required: false,
    label: t('id'),
    align: 'left',
    field: 'identifier',
    sortable: true
  },
  {
    name: 'interviewDesign',
    required: true,
    label: t('study.interview_design'),
    align: 'left',
    field: 'interviewDesign',
    sortable: true
  },
  {
    name: 'campaign',
    required: true,
    label: t('study.campaign'),
    align: 'left',
    field: 'campaign',
    sortable: true,
    format: val =>
      campaigns.value.find(cmp => cmp._id === val)?.name
  },
  {
    name: 'state',
    required: true,
    label: t('state'),
    align: 'left',
    field: 'state',
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
    name: 'fillingDate',
    align: 'left',
    label: t('study.interview_filling_date'),
    field: 'fillingDate',
    sortable: true,
    format: val =>
      `${val ? date.formatDate(val, 'YYYY-MM-DD') : ''}`
  },
  {
    name: 'participantValid',
    align: 'left',
    label: t('interview.eligibility'),
    field: 'participantValid',
    sortable: false
  },
  {
    name: 'action',
    align: 'left',
    label: t('action')
  }
])

const interviewDesignOptions = computed(() => {
  const opts = interviewDesigns.value.map(itwd => {
    return {
      value: itwd._id,
      label: itwd.name
    }
  })
  opts.sort((a, b) => {
    if (a.label < b.label) return -1
    if (a.label > b.label) return 1
    return 0
  })
  opts.splice(0, 0, {
    value: '0',
    label: t('study.all_designs')
  })
  return opts
})

const campaignOptions = computed(() => {
  const opts = campaigns.value.map(cmp => {
    const itwd = interviewDesigns.value.find(itwd => itwd._id === cmp.interviewDesign)
    return {
      value: cmp._id,
      label: `${itwd ? itwd.name : '?'} - ${cmp.name}`
    }
  })
  opts.sort((a, b) => {
    if (a.label < b.label) return -1
    if (a.label > b.label) return 1
    return 0
  })
  opts.splice(0, 0, {
    value: '0',
    label: t('study.all_campaigns')
  })
  return opts
})

const stateOptions = computed(() => [
  {
    value: '0',
    label: t('study.all_states')
  },
  {
    value: 'initiated',
    label: t('study.interview_state.initiated')
  },
  {
    value: 'in_progress',
    label: t('study.interview_state.in_progress')
  },
  {
    value: 'completed',
    label: t('study.interview_state.completed')
  }
])

const eligibleOptions = computed(() => [
  {
    value: '0',
    label: t('interview.any_eligibility')
  },
  {
    value: 'true',
    label: t('interview.eligible')
  },
  {
    value: 'false',
    label: t('interview.not_eligible')
  }
])

const modelDataStr = computed(() => JSON.stringify(modelData.value, null, '  '))

// Methods
function onFilter () {
  selected.value = []
  interviewStore.getInterviews(
    paginationOpts.value,
    studyId.value,
    interviewDesignFilter.value,
    campaignFilter.value,
    stateFilter.value,
    eligibleFilter.value === 'true' ? true : eligibleFilter.value === 'false' ? false : undefined,
    filter.value,
    fromDate.value,
    toDate.value
  )
}

function onExport (format) {
  let accept = 'application/json'
  if (format === 'csv') {
    accept = 'text/csv'
  } else if (format === 'xlsx') {
    accept = 'application/vnd.ms-excel'
  } else if (format === 'zip') {
    accept = 'application/zip'
  }
  const ids = selected.value.map(u => u._id)
  const participantValid = eligibleFilter.value === 'true' ? true : eligibleFilter.value === 'false' ? false : undefined
  interviewService.downloadInterviews(accept, studyId.value, interviewDesignFilter.value, campaignFilter.value, stateFilter.value, participantValid, filter.value, fromDate.value, toDate.value, ids)
    .then(response => {
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        const ext = format
        link.setAttribute('download', `interview-export.${ext}`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } else {
        Notify.create({
          message: 'Interview export failed.',
          color: 'negative'
        })
      }
    })
}

function onShow (studyInterview) {
  showInterview.value = true
  selectedInterview.value = studyInterview
  modelData.value = {}
  studyInterview.steps.forEach((step) => {
    modelData.value[step.name] = { ...step.data }
    delete modelData.value[step.name].__page
  })
  modelData.value.participant = studyInterview.data
  maximizedToggle.value = false
}

function onShowEditFillingDate (studyInterview) {
  showEditFillingDate.value = true
  selectedInterview.value = studyInterview
  selectedFillingDate.value = studyInterview.fillingDate ? date.formatDate(studyInterview.fillingDate, 'YYYY-MM-DD') : null
}

function onEditFillingDate () {
  interviewStore.updateInterview(
    { fillingDate: new Date(selectedFillingDate.value) },
    selectedInterview.value._id,
    paginationOpts.value,
    studyId.value
  )
}

function onConfirmDelete (studyInterview) {
  showConfirmDeleteInterview.value = true
  selectedInterview.value = studyInterview
}

function onConfirmDeleteMultiple () {
  if (selected.value.length > 0) {
    showConfirmDeleteInterviews.value = true
  }
}

function onReopen (studyInterview) {
  interviewStore.updateInterview(
    { state: 'in_progress' },
    studyInterview._id,
    paginationOpts.value,
    studyId.value
  )
}

function onClearDate (name) {
  if (name === 'from') {
    fromDate.value = ''
  } else {
    toDate.value = ''
  }
}

function getInterviewDesignName (id) {
  return interviewDesigns.value.filter(itwd => itwd._id === id).map(itwd => itwd.name).pop()
}

function getInterviewFullName (interview) {
  return interview.code
}

async function getTableInterviews (requestProp) {
  if (requestProp) {
    paginationOpts.value = requestProp.pagination
    interviewStore.setInterviewPagination(requestProp.pagination)
    await interviewStore.getInterviews(
      requestProp.pagination,
      studyId.value,
      interviewDesignFilter.value,
      undefined,
      stateFilter.value,
      undefined,
      requestProp.filter,
      fromDate.value,
      toDate.value
    )
  } else {
    await interviewStore.getInterviews(
      paginationOpts.value,
      studyId.value,
      interviewDesignFilter.value,
      undefined,
      stateFilter.value,
      undefined,
      filter.value,
      fromDate.value,
      toDate.value
    )
  }
  paginationOpts.value.rowsNumber = interviewStore.interviewPaginationOpts.rowsNumber
}

function setPagination () {
  paginationOpts.value = interviewStore.interviewPaginationOpts
}

function deleteInterview () {
  interviewStore.deleteInterview(
    selectedInterview.value._id,
    paginationOpts.value,
    studyId.value
  )
}

function deleteInterviews () {
  const ids = selected.value.map(u => u._id)
  interviewStore.deleteInterviews(
    ids,
    paginationOpts.value,
    studyId.value
  )
  selected.value = []
}

// Watchers
watch(study, () => {
  getTableInterviews()
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
    interviewStore.getInterviewDesigns(undefined, studyId.value)
    interviewStore.getCampaigns(undefined, undefined, studyId.value)
    getTableInterviews()
  }
})
</script>
