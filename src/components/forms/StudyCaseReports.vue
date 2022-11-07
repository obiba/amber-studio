<template>
  <div>
    <div class="q-ml-md q-mr-d">
      <q-btn-dropdown
          class="q-mr-md"
          color="primary"
          icon="download"
          :title="$t('study.export_case_reports_hint')"
          :disable="caseReports.length === 0">
          <q-list>
            <q-item clickable v-close-popup @click="onExport('csv')">
              <q-item-section>
                <q-item-label>CSV</q-item-label>
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
          :title="$t('study.delete_case_reports_hint')"
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
          :label="$t('study.case_report_form')"
          style="min-width: 200px" />
        <q-select
          class="q-mr-md"
          v-model="formFilter"
          :options="formOptions"
          emit-value
          map-options
          :label="$t('study.form')"
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
          :title="$t('study.search_case_report_hint')">
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
            :title="$t(isReadOnly ? 'study.view_case_report_hint' : 'study.edit_case_report_hint')"
            :icon="isReadOnly ? 'visibility' : 'edit'"
            @click='onShow(props.row)'>
          </q-btn>
          <q-btn
            v-if="!isReadOnly"
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
        <q-card-actions align='right'>
          <q-btn v-if="isReadOnly" :label="$t('close')" flat v-close-popup />
          <q-btn v-if="!isReadOnly" :label="$t('cancel')" flat v-close-popup />
          <q-btn
            v-if="!isReadOnly"
            @click='onSave'
            :label="$t('save')"
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

    <q-dialog v-model='showConfirmDeleteCaseReport' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_case_report_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ getCaseReportFullName(selectedCaseReport) }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteCaseReport'
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

    <q-dialog v-model='showConfirmDeleteCaseReports' persistent>
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
            @click='deleteCaseReports'
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
import { formRevisionService } from '../../services/form'
import { caseReportExportService } from '../../services/caseReport'
import { t } from '../../boot/i18n'
import { date, Notify } from 'quasar'
import AuthMixin from '../../mixins/AuthMixin'
import { BlitzForm } from '@blitzar/form'
import { makeBlitzarQuasarSchemaForm } from '@obiba/quasar-ui-amber'

export default defineComponent({
  name: 'StudyCaseReports',
  components: { BlitzForm },
  mixins: [AuthMixin],
  mounted: function () {
    this.setPagination()
    if (this.study) {
      this.getCaseReportForms({ study: this.studyId })
      this.getForms({ study: this.studyId })
      this.getTableCaseReports()
    }
  },
  setup () {
    return {
      remountCounter: 0,
      showTab: ref('form'),
      locale: ref('en'),
      tab: ref('definition'),
      selected: ref([]),
      filter: ref(''),
      caseReportFormFilter: ref('0'),
      formFilter: ref('0'),
      fromDate: ref(''),
      toDate: ref(''),
      maximizedToggle: ref(false)
    }
  },
  data () {
    return {
      modelData: {},
      selectedFormRevision: { schema: [] },
      selectedCaseReport: {},
      showCaseReport: false,
      showConfirmDeleteCaseReport: false,
      showConfirmDeleteCaseReports: false,
      paginationOpts: {
        sortBy: 'updatedAt',
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
          name: 'caseReportForm',
          required: true,
          label: this.$t('study.case_report_form'),
          align: 'left',
          field: 'caseReportForm',
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
      forms: state => state.form.forms,
      caseReports: state => state.caseReportForm ? state.caseReportForm.caseReports : [],
      caseReportForms: state => state.caseReportForm ? state.caseReportForm.caseReportForms : []
    }),
    studyId () {
      return this.$route.params.id
    },
    caseReportFormOptions () {
      const opts = this.caseReportForms.map(crf => {
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
    },
    formOptions () {
      const opts = this.forms.map(form => {
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
    },
    hasCaseReports () {
      return this.caseReports && this.caseReports.length > 0
    },
    modelDataStr () {
      return JSON.stringify(this.modelData, null, '  ')
    },
    formRevisionLocales () {
      return Object.keys(this.selectedFormRevision.schema.i18n).filter(loc => this.locale !== loc)
    },
    formRevisionBlitzarSchema () {
      return makeBlitzarQuasarSchemaForm(this.selectedFormRevision.schema, { locale: this.locale, debug: true })
    }
  },
  watch: {
    study: function (newValue, oldValue) {
      this.getTableCaseReports()
    },
    caseReportFormFilter: function (newValue) {
      this.onFilter()
    },
    formFilter: function (newValue) {
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
      getForms: 'form/getForms',
      getCaseReports: 'caseReportForm/getCaseReports',
      getCaseReportForms: 'caseReportForm/getCaseReportForms'
    }),
    onFilter () {
      this.selected = []
      this.getCaseReports({
        paginationOpts: this.paginationOpts,
        study: this.studyId,
        caseReportForm: this.caseReportFormFilter,
        form: this.formFilter,
        filter: this.filter,
        from: this.fromDate,
        to: this.toDate
      })
    },
    onExport (format) {
      const accept = format === 'csv' ? 'application/zip' : 'application/json'
      const ids = this.selected.map(u => u._id)
      caseReportExportService.downloadCaseReports(accept, this.studyId, this.caseReportFormFilter, this.formFilter, this.filter, this.fromDate, this.toDate, ids)
        .then(response => {
          if (response.status === 200) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            const ext = format === 'csv' ? 'zip' : format
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
    },
    onLocale (newLocale) {
      this.locale = newLocale
    },
    onShow (studyCaseReport) {
      this.showCaseReport = true
      this.selectedCaseReport = studyCaseReport
      this.modelData = {}
      this.showTab = 'form'
      this.maximizedToggle = false
      formRevisionService.getFormRevision(studyCaseReport.form, studyCaseReport.revision)
        .then(res => {
          this.selectedFormRevision = res.data[0]
          this.modelData = studyCaseReport.data
          this.remountCounter++
        })
    },
    onSave () {
      const updatedData = { ...this.modelData }
      this.$store.dispatch('caseReportForm/updateCaseReport', {
        id: this.selectedCaseReport._id,
        caseReport: { data: updatedData },
        study: this.studyId,
        paginationOpts: this.paginationOpts
      })
    },
    onConfirmDelete (studyCaseReport) {
      this.showConfirmDeleteCaseReport = true
      this.selectedCaseReport = studyCaseReport
    },
    onConfirmDeleteMultiple () {
      if (this.selected.length > 0) {
        this.showConfirmDeleteCaseReports = true
      }
    },
    onClearDate (name) {
      if (name === 'from') {
        this.fromDate = ''
      } else {
        this.toDate = ''
      }
    },
    getCaseReportFormName (crfId) {
      return this.caseReportForms.filter(crf => crf._id === crfId).map(crf => crf.name).pop()
    },
    getFormName (formId) {
      return this.forms.filter(form => form._id === formId).map(form => form.name).pop()
    },
    getCaseReportFullName (caseReport) {
      return this.getCaseReportID(caseReport) + ':' + this.getCaseReportFormName(caseReport.caseReportForm) + ':' + (caseReport.revision ? caseReport.revision : t('study.latest_revision'))
    },
    getCaseReportID (caseReport) {
      return caseReport.data && caseReport.data._id ? caseReport.data._id : ''
    },
    async getTableCaseReports (requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination
        this.$store.commit('caseReportForm/setCaseReportPagination', {
          caseReportPaginationOpts: requestProp.pagination
        })
        await this.getCaseReports({ paginationOpts: requestProp.pagination, study: this.studyId, form: this.formFilter, filter: requestProp.filter, from: this.fromDate, to: this.toDate })
      } else {
        await this.getCaseReports({ paginationOpts: this.paginationOpts, study: this.studyId, form: this.formFilter, filter: this.filter, from: this.fromDate, to: this.toDate })
      }
      this.paginationOpts.rowsNumber = this.$store.state.caseReportForm.caseReportPaginationOpts.rowsNumber
    },
    setPagination () {
      this.paginationOpts = this.$store.state.caseReportForm.caseReportPaginationOpts
    },
    deleteCaseReport () {
      this.$store.dispatch('caseReportForm/deleteCaseReport', {
        id: this.selectedCaseReport._id,
        study: this.studyId,
        paginationOpts: this.paginationOpts
      })
    },
    deleteCaseReports () {
      const ids = this.selected.map(u => u._id)
      this.$store.dispatch('caseReportForm/deleteCaseReports', {
        ids: ids,
        study: this.studyId,
        paginationOpts: this.paginationOpts
      })
      this.selected = []
    }
  }
})
</script>
