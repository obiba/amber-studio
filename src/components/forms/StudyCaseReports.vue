<template>
  <div>
    <q-table
      flat
      :rows="studyCaseReports"
      :columns="columns"
      :filter="filter"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      v-model:pagination='paginationOpts'
      @request='getTableStudyCaseReports'
    >
      <template v-slot:top>
        <q-btn
          class="q-mr-md"
          flat
          round
          color="red"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="$t('study.delete_case_reports_hint')"
          @click="onConfirmDeleteMultiple()" />
        <q-space />
        <q-input
          dense
          debounce="300"
          v-model="filter"
          :placeholder="$t('search')"
          :title="$t('study.search_case_report_hint')">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-form='props'>
        <q-td :props='props'>
          <router-link :to="'/form/' + props.row.form">{{ getFormName(props.row.form) }}</router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-revision='props'>
        <q-td :props='props'>
          {{ props.row.revision ? props.row.revision : $t('study.latest_revision') }}
        </q-td>
      </template>
      <template v-slot:body-cell-state='props'>
        <q-td :props='props'>
          {{ $t('study.case_report_state.' + props.row.state) }}
        </q-td>
      </template>
      <template v-slot:body-cell-action='props'>
        <q-td :props='props'>
          <q-btn
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('study.view_case_report_hint')"
            icon="visibility"
            @click='onView(props.row)'>
          </q-btn>
          <q-btn
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('study.delete_case_report_hint')"
            icon="delete"
            @click='onConfirmDelete(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model='showViewStudyCaseReport' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <div class="q-pl-none q-pr-none">
            <q-scroll-area style="height: 400px">
              <div class="bg-black text-white q-pa-md">
                <pre>{{ modelDataStr }}</pre>
              </div>
            </q-scroll-area>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('close')" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteStudyCaseReport' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_case_report_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ getCaseReportFullName(selectedStudyCaseReport) }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyCaseReport'
            :label="$t('delete')"
            type='submit'
            color='positive'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteStudyCaseReports' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_case_reports_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => getCaseReportFullName(g)).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyCaseReports'
            :label="$t('delete')"
            type='submit'
            color='positive'
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
// import { formRevisionService } from '../../services/form'
import { t } from '../../boot/i18n'

export default defineComponent({
  name: 'StudyCaseReports',
  mounted: function () {
    this.setPagination()
    if (this.study) {
      this.getTableStudyCaseReports()
    }
  },
  setup () {
    return {
      tab: ref('definition'),
      selected: ref([]),
      filter: ref('')
    }
  },
  data () {
    return {
      revisionOptions: [],
      selectedStudyCaseReport: {},
      showViewStudyCaseReport: false,
      showConfirmDeleteStudyCaseReport: false,
      showConfirmDeleteStudyCaseReports: false,
      paginationOpts: {
        sortBy: 'createdAt',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        {
          name: '_id',
          required: true,
          label: this.$t('id'),
          align: 'left',
          field: row => (row.data && row.data._id) ? row.data._id : '',
          sortable: true
        },
        {
          name: 'form',
          required: true,
          label: this.$t('study.form'),
          align: 'left',
          field: 'form',
          sortable: true
        },
        {
          name: 'revision',
          align: 'left',
          label: this.$t('revision'),
          field: 'revision',
          sortable: true
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
      forms: state => state.form.forms,
      studyCaseReports: state => state.caseReportForm ? state.caseReportForm.caseReports : []
    }),
    formOptions () {
      return this.forms.map(form => {
        return {
          value: form._id,
          label: form.name
        }
      })
    },
    hasStudyCaseReports () {
      return this.studyCaseReports && this.studyCaseReports.length > 0
    },
    modelDataStr () {
      return JSON.stringify(this.modelData, null, '  ')
    }
  },
  watch: {
    study: function (newValue, oldValue) {
      this.getTableStudyCaseReports()
    }
  },
  methods: {
    ...mapActions({
      getStudyCaseReports: 'caseReportForm/getCaseReports'
    }),
    onView (studyCaseReport) {
      this.showViewStudyCaseReport = true
      this.modelData = studyCaseReport.data
    },
    onConfirmDelete (studyCaseReport) {
      this.showConfirmDeleteStudyCaseReport = true
      this.selectedStudyCaseReport = studyCaseReport
    },
    onConfirmDeleteMultiple () {
      if (this.selected.length > 0) {
        this.showConfirmDeleteStudyCaseReports = true
      }
    },
    getFormName (formId) {
      return this.forms.filter(form => form._id === formId).map(form => form.name).pop()
    },
    getCaseReportFullName (caseReport) {
      return this.getCaseReportID(caseReport) + ':' + this.getFormName(caseReport.form) + ':' + (caseReport.revision ? caseReport.revision : t('study.latest_revision'))
    },
    getCaseReportID (caseReport) {
      return caseReport.data && caseReport.data._id ? caseReport.data._id : ''
    },
    async getTableStudyCaseReports (requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination
        this.$store.commit('caseReportForm/setCaseReportPagination', {
          caseReportPaginationOpts: requestProp.pagination
        })
        await this.getStudyCaseReports({ paginationOpts: requestProp.pagination, study: this.study._id, filter: requestProp.filter })
      } else {
        await this.getStudyCaseReports({ paginationOpts: this.paginationOpts, study: this.study._id, filter: this.filter })
      }
      this.paginationOpts.rowsNumber = this.$store.state.caseReportForm.caseReportPaginationOpts.rowsNumber
    },
    setPagination () {
      this.paginationOpts = this.$store.state.caseReportForm.caseReportPaginationOpts
    },
    deleteStudyCaseReport () {
      this.$store.dispatch('caseReportForm/deleteCaseReport', {
        id: this.selectedStudyCaseReport._id,
        study: this.study._id,
        paginationOpts: this.paginationOpts
      })
    },
    deleteStudyCaseReports () {
      const ids = this.selected.map(u => u._id)
      this.$store.dispatch('caseReportForm/deleteCaseReports', {
        ids: ids,
        study: this.study._id,
        paginationOpts: this.paginationOpts
      })
      this.selected = []
    }
  }
})
</script>
