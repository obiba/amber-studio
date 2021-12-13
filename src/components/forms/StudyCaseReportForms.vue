<template>
  <div>
    <q-table
      v-if="hasStudyCaseReportForms"
      flat
      :rows="studyCaseReportForms"
      :columns="columns"
      :filter="filter"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      v-model:pagination='paginationOpts'
      @request='getTableStudyCaseReportForms'
    >
      <template v-slot:top>
        <q-btn
          color="primary"
          icon="add"
          :title="$t('study.add_case_report_form_hint')"
          @click="onAdd()"
          class="q-mr-md" />
        <q-btn
          class="q-mr-md"
          flat
          round
          color="red"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="$t('study.delete_case_report_forms_hint')"
          @click="onConfirmDeleteMultiple()" />
        <q-space />
        <q-input
          dense
          debounce="300"
          v-model="filter"
          :placeholder="$t('search')"
          :title="$t('study.search_case_report_form_hint')">
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
          {{ $t('study.case_report_form_state.' + props.row.state) }}
        </q-td>
      </template>
      <template v-slot:body-cell-action='props'>
        <q-td :props='props'>
          <q-btn
            v-if="props.row.state === 'paused'"
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('study.start_case_report_form_hint')"
            icon="play_arrow"
            @click='start(props.row)'>
          </q-btn>
          <q-btn
            v-if="props.row.state === 'active'"
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('study.pause_case_report_form_hint')"
            icon="pause"
            @click='pause(props.row)'>
          </q-btn>
          <q-btn
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('study.delete_case_report_form_hint')"
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
      :label="$t('study.add_case_report_form_hint')"
      @click="onAdd()"
      class="q-mr-md" />

    <q-dialog v-model='showCreateStudyCaseReportForm' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section class="row items-center">
           <div class="col-12">
             <q-select
              v-model="newStudyCaseReportFormData.form"
              :options="formOptions"
              emit-value
              map-options
              :label="$t('study.form')" />
             <q-select
              v-model="newStudyCaseReportFormData.revision"
              :options="revisionOptions"
              emit-value
              map-options
              :label="$t('study.form_revision')"
              :disable="!newStudyCaseReportFormData.form" />
           </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveStudyCaseReportForm'
            :disable='disableCreateStudyCaseReportForm'
            :label="$t('add')"
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

    <q-dialog v-model='showConfirmDeleteStudyCaseReportForm' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_case_report_form_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ getCaseReportFormFullName(selectedStudyCaseReportForm) }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyCaseReportForm'
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

    <q-dialog v-model='showConfirmDeleteStudyCaseReportForms' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_case_report_forms_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => getCaseReportFormFullName(g)).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyCaseReportForms'
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
import { t } from '../../boot/i18n'

export default defineComponent({
  name: 'StudyCaseReportForms',
  mounted: function () {
    this.setPagination()
    if (this.study) {
      this.getTableStudyCaseReportForms()
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
      newStudyCaseReportFormData: {},
      revisionOptions: [],
      selectedStudyCaseReportForm: {},
      showCreateStudyCaseReportForm: false,
      showConfirmDeleteStudyCaseReportForm: false,
      showConfirmDeleteStudyCaseReportForms: false,
      paginationOpts: {
        sortBy: 'createdAt',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
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
          name: 'state',
          align: 'left',
          label: this.$t('state'),
          field: 'state',
          sortable: true
        },
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
      studyCaseReportForms: state => state.caseReportForm ? state.caseReportForm.caseReportForms : []
    }),
    formOptions () {
      return this.forms.map(form => {
        return {
          value: form._id,
          label: form.name
        }
      })
    },
    disableCreateStudyCaseReportForm () {
      return !this.newStudyCaseReportFormData.form || !this.newStudyCaseReportFormData.revision || this.revisionOptions.length === 0
    },
    hasStudyCaseReportForms () {
      return this.studyCaseReportForms && this.studyCaseReportForms.length > 0
    }
  },
  watch: {
    study: function (newValue, oldValue) {
      this.getTableStudyCaseReportForms()
    },
    'newStudyCaseReportFormData.form': function () {
      if (this.newStudyCaseReportFormData.form) {
        formRevisionService.getFormRevisionsDigest(this.study._id, this.newStudyCaseReportFormData.form)
          .then((response) => {
            this.revisionOptions = response.data ? response.data.map(rev => rev.revision) : []
            if (this.revisionOptions.length > 0) {
              this.revisionOptions.splice(0, 0, t('study.latest_revision'))
            }
          })
      } else {
        this.revisionOptions = []
      }
    }
  },
  methods: {
    ...mapActions({
      getStudyCaseReportForms: 'caseReportForm/getCaseReportForms',
      createStudyCaseReportForm: 'caseReportForm/createCaseReportForm',
      updateStudyCaseReportForm: 'caseReportForm/updateCaseReportForm'
    }),
    onAdd () {
      this.newStudyCaseReportFormData = {}
      this.showCreateStudyCaseReportForm = true
      this.selectedStudyCaseReportForm = undefined
    },
    onConfirmDelete (studyCaseReportForm) {
      this.showConfirmDeleteStudyCaseReportForm = true
      this.selectedStudyCaseReportForm = studyCaseReportForm
    },
    onConfirmDeleteMultiple () {
      if (this.selected.length > 0) {
        this.showConfirmDeleteStudyCaseReportForms = true
      }
    },
    getFormName (formId) {
      return this.forms.filter(form => form._id === formId).map(form => form.name).pop()
    },
    getCaseReportFormFullName (caseReportForm) {
      return this.getFormName(caseReportForm.form) + ':' + (caseReportForm.revision ? caseReportForm.revision : t('study.latest_revision'))
    },
    async getTableStudyCaseReportForms (requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination
        this.$store.commit('caseReportForm/setCaseReportFormPagination', {
          caseReportFormPaginationOpts: requestProp.pagination
        })
        await this.getStudyCaseReportForms({ paginationOpts: requestProp.pagination, study: this.study._id, filter: requestProp.filter })
      } else {
        await this.getStudyCaseReportForms({ paginationOpts: this.paginationOpts, study: this.study._id, filter: this.filter })
      }
      this.paginationOpts.rowsNumber = this.$store.state.caseReportForm.caseReportFormPaginationOpts.rowsNumber
    },
    setPagination () {
      this.paginationOpts = this.$store.state.caseReportForm.caseReportFormPaginationOpts
    },
    start (studyCaseReportForm) {
      this.setState(studyCaseReportForm, 'active')
    },
    pause (studyCaseReportForm) {
      this.setState(studyCaseReportForm, 'paused')
    },
    setState (studyCaseReportForm, state) {
      const toSave = { ...studyCaseReportForm }
      toSave.state = state
      this.updateStudyCaseReportForm({
        caseReportForm: toSave,
        paginationOpts: this.paginationOpts
      })
    },
    deleteStudyCaseReportForm () {
      this.$store.dispatch('caseReportForm/deleteCaseReportForm', {
        id: this.selectedStudyCaseReportForm._id,
        study: this.study._id,
        paginationOpts: this.paginationOpts
      })
    },
    deleteStudyCaseReportForms () {
      const ids = this.selected.map(u => u._id)
      this.$store.dispatch('caseReportForm/deleteCaseReportForms', {
        ids: ids,
        study: this.study._id,
        paginationOpts: this.paginationOpts
      })
      this.selected = []
    },
    async saveStudyCaseReportForm () {
      const toSave = { ...this.newStudyCaseReportFormData }
      toSave.study = this.study._id
      if (toSave.revision === t('study.latest_revision')) {
        delete toSave.revision
      }
      this.createStudyCaseReportForm({
        caseReportForm: toSave
      })
    }
  }
})
</script>
