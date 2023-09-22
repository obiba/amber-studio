<template>
  <div v-cloak>

    <q-card class="q-ma-md">
      <q-card-section>
        <div class="q-ml-md q-mr-d">
          <q-btn-dropdown
              class="q-mr-md"
              color="primary"
              icon="download"
              :title="$t('study.export_interviews_hint')"
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
              :disable="selected.length === 0"
              :title="$t('study.delete_interviews_hint')"
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
              :label="$t('study.interview_design')"
              style="min-width: 200px" />
            <q-select
              class="q-mr-md"
              v-model="campaignFilter"
              :options="campaignOptions"
              emit-value
              map-options
              :label="$t('study.campaign')"
              style="min-width: 200px" />
            <q-select
              class="q-mr-md"
              v-model="stateFilter"
              :options="stateOptions"
              emit-value
              map-options
              :label="$t('state')"
              style="min-width: 200px" />
            <div class="q-mr-md" style="max-width: 250px">
              <q-input filled v-model="fromDate" :placeholder="$t('from')">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="fromDate" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="fromDate" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" color="primary" flat />
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
              <q-input filled v-model="toDate" :placeholder="$t('to')">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="toDate" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="toDate" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" color="primary" flat />
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
              :placeholder="$t('search')"
              :title="$t('study.search_interview_hint')">
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
              {{ props.row.revision ? props.row.revision : $t('study.latest_revision') }}
            </q-td>
          </template>
          <template v-slot:body-cell-state='props'>
            <q-td :props='props'>
              {{ $t('study.interview_state.' + props.row.state) }}
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
                :title="$t(isReadOnly ? 'study.view_interview_hint' : 'study.edit_interview_hint')"
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
                :title="$t('study.delete_interview_hint')"
                icon="delete"
                @click='onConfirmDelete(props.row)'>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

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
        <q-card-actions align='right'>
          <q-btn :label="$t('close')" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteInterview' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_interview_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ getInterviewFullName(selectedInterview) }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteInterview'
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

    <q-dialog v-model='showConfirmDeleteInterviews' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_interviews_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => getInterviewFullName(g)).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteInterviews'
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

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { defineComponent, ref } from 'vue'
import { interviewService } from '../../services/interview'
import { t } from '../../boot/i18n'
import { date, Notify } from 'quasar'
import AuthMixin from '../../mixins/AuthMixin'

export default defineComponent({
  name: 'StudyInterviews',
  mixins: [AuthMixin],
  mounted: function () {
    this.setPagination()
    if (this.study) {
      this.getInterviewDesigns({ study: this.studyId })
      this.getCampaigns({ study: this.studyId })
      this.getTableInterviews()
    }
  },
  setup () {
    return {
      remountCounter: 0,
      locale: ref('en'),
      tab: ref('definition'),
      selected: ref([]),
      filter: ref(''),
      interviewDesignFilter: ref('0'),
      campaignFilter: ref('0'),
      stateFilter: ref('0'),
      fromDate: ref(''),
      toDate: ref(''),
      maximizedToggle: ref(false)
    }
  },
  data () {
    return {
      modelData: {},
      selectedInterview: {},
      showInterview: false,
      showConfirmDeleteInterview: false,
      showConfirmDeleteInterviews: false,
      paginationOpts: {
        sortBy: 'updatedAt',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
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
          label: this.$t('study.interview_design'),
          align: 'left',
          field: 'interviewDesign',
          sortable: true
        },
        {
          name: 'campaign',
          required: true,
          label: this.$t('study.campaign'),
          align: 'left',
          field: 'campaign',
          sortable: true,
          format: val =>
            this.campaigns.find(cmp => cmp._id === val)?.name
        },
        {
          name: 'state',
          required: true,
          label: this.$t('state'),
          align: 'left',
          field: 'state',
          sortable: true
        },
        {
          name: 'updatedAt',
          align: 'left',
          label: this.$t('updated_at'),
          field: 'updatedAt',
          sortable: true,
          format: val =>
            `${val ? date.formatDate(val, 'YYYY-MM-DD HH:mm:ss') : this.$t('unknown')}`
        },
        /* {
          name: 'state',
          align: 'left',
          label: this.$t('state'),
          field: 'state',
          sortable: true
        }, */
        {
          name: 'action',
          align: 'left',
          label: this.$t('action')
        }
      ]
    }
  },
  computed: {
    ...mapState({
      study: state => state.study.study,
      interviews: state => state.interview ? state.interview.interviews : [],
      interviewDesigns: state => state.interview ? state.interview.interviewDesigns : [],
      campaigns: state => state.interview ? state.interview.campaigns : []
    }),
    studyId () {
      return this.$route.params.id
    },
    interviewDesignOptions () {
      const opts = this.interviewDesigns.map(itwd => {
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
    },
    campaignOptions () {
      const opts = this.campaigns.map(cmp => {
        const itwd = this.interviewDesigns.find(itwd => itwd._id === cmp.interviewDesign)
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
    },
    stateOptions () {
      return [
        {
          value: '0',
          label: t('study.all_states')
        },
        {
          value: 'in_progress',
          label: t('study.interview_state.in_progress')
        },
        {
          value: 'completed',
          label: t('study.interview_state.completed')
        }
      ]
    },
    hasInterviews () {
      return this.interviews && this.interviews.length > 0
    },
    modelDataStr () {
      return JSON.stringify(this.modelData, null, '  ')
    }
  },
  watch: {
    study: function (newValue, oldValue) {
      this.getTableInterviews()
    },
    interviewDesignFilter: function (newValue) {
      this.onFilter()
    },
    campaignFilter: function (newValue) {
      this.onFilter()
    },
    stateFilter: function (newValue) {
      this.onFilter()
    },
    fromDate: function (newValue) {
      this.onFilter()
    },
    toDate: function (newValue) {
      this.onFilter()
    }
  },
  methods: {
    ...mapActions({
      getInterviews: 'interview/getInterviews',
      getInterviewDesigns: 'interview/getInterviewDesigns',
      getCampaigns: 'interview/getCampaigns'
    }),
    onFilter () {
      this.selected = []
      this.getInterviews({
        paginationOpts: this.paginationOpts,
        study: this.studyId,
        interviewDesign: this.interviewDesignFilter,
        campaign: this.campaignFilter,
        state: this.stateFilter,
        filter: this.filter,
        from: this.fromDate,
        to: this.toDate
      })
    },
    onExport (format) {
      let accept = 'application/json'
      if (format === 'csv') {
        accept = 'text/csv'
      } else if (format === 'xlsx') {
        accept = 'application/vnd.ms-excel'
      } else if (format === 'zip') {
        accept = 'application/zip'
      }
      const ids = this.selected.map(u => u._id)
      interviewService.downloadInterviews(accept, this.studyId, this.interviewDesignFilter, this.stateFilter, this.filter, this.fromDate, this.toDate, ids)
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
    },
    onLocale (newLocale) {
      this.locale = newLocale
    },
    onShow (studyInterview) {
      this.showInterview = true
      this.selectedInterview = studyInterview
      this.modelData = {}
      studyInterview.steps.forEach((step) => {
        this.modelData[step.name] = { ...step.data }
        delete this.modelData[step.name].__page
      })
      this.modelData.participant = studyInterview.data
      this.maximizedToggle = false
    },
    onSave () {
      const updatedData = { ...this.modelData }
      this.$store.dispatch('interview/updateInterview', {
        id: this.selectedInterview._id,
        interview: { data: updatedData },
        study: this.studyId,
        paginationOpts: this.paginationOpts
      })
    },
    onConfirmDelete (studyInterview) {
      this.showConfirmDeleteInterview = true
      this.selectedInterview = studyInterview
    },
    onConfirmDeleteMultiple () {
      if (this.selected.length > 0) {
        this.showConfirmDeleteInterviews = true
      }
    },
    onClearDate (name) {
      if (name === 'from') {
        this.fromDate = ''
      } else {
        this.toDate = ''
      }
    },
    getInterviewDesignName (id) {
      return this.interviewDesigns.filter(itwd => itwd._id === id).map(itwd => itwd.name).pop()
    },
    getInterviewFullName (interview) {
      return interview.code
    },
    getInterviewID (interview) {
      return interview.data && interview.data._id ? interview.data._id : ''
    },
    async getTableInterviews (requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination
        this.$store.commit('interview/setInterviewPagination', {
          interviewPaginationOpts: requestProp.pagination
        })
        await this.getInterviews({
          paginationOpts: requestProp.pagination,
          study: this.studyId,
          interviewDesign: this.interviewDesignFilter,
          state: this.stateFilter,
          filter: requestProp.filter,
          from: this.fromDate,
          to: this.toDate
        })
      } else {
        await this.getInterviews({
          paginationOpts: this.paginationOpts,
          study: this.studyId,
          interviewDesign: this.interviewDesignFilter,
          state: this.stateFilter,
          filter: this.filter,
          from: this.fromDate,
          to: this.toDate
        })
      }
      this.paginationOpts.rowsNumber = this.$store.state.interview.interviewPaginationOpts.rowsNumber
    },
    setPagination () {
      this.paginationOpts = this.$store.state.interview.interviewPaginationOpts
    },
    deleteInterview () {
      this.$store.dispatch('interview/deleteInterview', {
        id: this.selectedInterview._id,
        study: this.studyId,
        paginationOpts: this.paginationOpts
      })
    },
    deleteInterviews () {
      const ids = this.selected.map(u => u._id)
      this.$store.dispatch('interview/deleteInterviews', {
        ids: ids,
        study: this.studyId,
        paginationOpts: this.paginationOpts
      })
      this.selected = []
    }
  }
})
</script>
