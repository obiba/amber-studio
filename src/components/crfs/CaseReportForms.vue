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
              :title="$t('study.add_case_report_form_hint')"
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
              <router-link :to="'/study/' + this.studyId + '/form/' + props.row.form">{{ getFormName(props.row.form) }}</router-link>
            </q-td>
          </template>
          <template v-slot:body-cell-revision='props'>
            <q-td :props='props'>
              {{ props.row.revision ? props.row.revision : $t('study.latest_revision') }}
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
              {{ props.row.repeatPolicy ? $t('study.case_report_form_repeat_policy.' + props.row.repeatPolicy) : '?' }}
            </q-td>
          </template>
          <template v-slot:body-cell-state='props'>
            <q-td :props='props'>
              {{ $t('study.case_report_form_state.' + props.row.state) }}
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
                :title="$t('study.edit_case_report_form_hint')"
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
                :title="$t('study.start_case_report_form_hint')"
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
                :title="$t('study.pause_case_report_form_hint')"
                icon="pause"
                @click='pause(props.row)'>
              </q-btn>
              <q-btn
                color="secondary"
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
      </q-card-section>
    </q-card>

    <q-btn
      v-else-if="!isReadOnly"
      color="primary"
      icon="add"
      :label="$t('study.add_case_report_form_hint')"
      @click="onAdd()"
      class="q-ma-md" />

    <q-dialog v-model='showCreateStudyCaseReportForm' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='newStudyCaseReportFormData.name'
            :label="$t('name')"
            lazy-rules
            @blur="v$.newStudyCaseReportFormData.name.$touch"
            :error="v$.newStudyCaseReportFormData.name.$error"
            :hint="$t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.newStudyCaseReportFormData.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='newStudyCaseReportFormData.description'
            :label="$t('description')"
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
            :label="$t('study.form')" />
          <q-select
            v-model="newStudyCaseReportFormData.revision"
            :options="revisionOptions"
            emit-value
            map-options
            :label="$t('study.form_revision')"
            :disable="!newStudyCaseReportFormData.form" />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="newStudyCaseReportFormData.repeatPolicy"
            :options="repeatOptions"
            emit-value
            map-options
            :label="$t('study.case_report_form_repeat_policy.title')"
            :hint="$t('study.case_report_form_repeat_policy.hint')" />
        </q-card-section>
        <q-card-section>
          <q-toggle
            class="q-mt-md"
            v-model="newStudyCaseReportFormData.restrictedAccess"
            :label="$t('restricted_access')"
          />
          <q-select
            v-if="newStudyCaseReportFormData.restrictedAccess"
            v-model="newStudyCaseReportFormData.permissions.users"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="$t('study.permitted_users')" />
          <q-select
            v-if="newStudyCaseReportFormData.restrictedAccess"
            v-model="newStudyCaseReportFormData.permissions.groups"
            :options="groupSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="$t('study.permitted_groups')" />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveStudyCaseReportForm(true)'
            :disable='disableCreateStudyCaseReportForm'
            :label="$t('add')"
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
            :label="$t('name')"
            lazy-rules
            @blur="v$.selectedStudyCaseReportForm.name.$touch"
            :error="v$.selectedStudyCaseReportForm.name.$error"
            :hint="$t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.selectedStudyCaseReportForm.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='selectedStudyCaseReportForm.description'
            :label="$t('description')"
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
            :label="$t('study.form_revision')" />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="selectedStudyCaseReportForm.repeatPolicy"
            :options="repeatOptions"
            emit-value
            map-options
            :label="$t('study.case_report_form_repeat_policy.title')"
            :hint="$t('study.case_report_form_repeat_policy.hint')" />
        </q-card-section>
        <q-card-section>
          <q-toggle
            class="q-mt-md"
            v-model="selectedStudyCaseReportForm.restrictedAccess"
            :label="$t('restricted_access')"
          />
          <q-select
            v-if="selectedStudyCaseReportForm.restrictedAccess"
            v-model="selectedStudyCaseReportForm.permissions.users"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="$t('study.permitted_users')" />
          <q-select
            v-if="selectedStudyCaseReportForm.restrictedAccess"
            v-model="selectedStudyCaseReportForm.permissions.groups"
            :options="groupSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="$t('study.permitted_groups')" />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveStudyCaseReportForm(false)'
            :disable='disableEditStudyCaseReportForm'
            :label="$t('update')"
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
            {{$t('study.add_form_revision_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ getFormName(newStudyCaseReportFormData.form) }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='createFormRevision'
            :label="$t('add')"
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
import useVuelidate from '@vuelidate/core'
import { formRevisionService } from '../../services/form'
import { t } from '../../boot/i18n'
import { date } from 'quasar'
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { subjectsService } from '../../services/utils'
import AuthMixin from '../../mixins/AuthMixin'

export default defineComponent({
  name: 'StudyCaseReportForms',
  mixins: [AuthMixin],
  mounted: function () {
    this.setPagination()
    if (this.studyId) {
      this.getStudyForms({ study: this.studyId })
      this.getTableStudyCaseReportForms()
    }
    subjectsService.getSubjects().then((result) => {
      this.subjects = result
    })
  },
  setup () {
    return {
      v$: useVuelidate(),
      tab: ref('definition'),
      selected: ref([]),
      filter: ref('')
    }
  },
  data () {
    return {
      newStudyCaseReportFormData: {
        name: '',
        description: '',
        repeatPolicy: 'multiple'
      },
      revisionOptions: [],
      selectedStudyCaseReportForm: {},
      showCreateStudyCaseReportForm: false,
      showEditStudyCaseReportForm: false,
      showConfirmCreateFormRevision: false,
      showConfirmDeleteStudyCaseReportForm: false,
      showConfirmDeleteStudyCaseReportForms: false,
      paginationOpts: {
        sortBy: 'updatedAt',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      subjects: []
    }
  },
  validations: {
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
  },
  computed: {
    ...mapState({
      study: state => state.study.study,
      forms: state => state.form.forms,
      studyCaseReportForms: state => state.caseReport ? state.caseReport.caseReportForms : []
    }),
    studyId () {
      return this.$route.params.id
    },
    columns () {
      const cols = [
        {
          name: 'name',
          required: true,
          label: this.$t('name'),
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'description',
          align: 'left',
          label: this.$t('description'),
          field: 'description',
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
          name: 'repeatPolicy',
          align: 'left',
          label: this.$t('study.case_report_form_repeat_policy.title'),
          field: 'repeatPolicy',
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
        }
      ]
      if (this.subjects && this.subjects.length > 0) {
        cols.push({
          name: 'permissions',
          align: 'left',
          label: this.$t('restricted_access'),
          field: 'permissions',
          sortable: false
        })
      }
      cols.push({
        name: 'state',
        align: 'left',
        label: this.$t('state'),
        field: 'state',
        sortable: true
      })
      if (!this.isReadOnly) {
        cols.push({
          name: 'action',
          align: 'left',
          label: this.$t('action')
        })
      }
      return cols
    },
    formOptions () {
      return this.forms.map(form => {
        return {
          value: form._id,
          label: form.name
        }
      })
    },
    repeatOptions () {
      return [
        'multiple', 'single_reject', 'single_update'
      ].map(opt => {
        return {
          value: opt,
          label: this.$t('study.case_report_form_repeat_policy.' + opt)
        }
      })
    },
    userSubjectOptions () {
      return this.getSubjectOptions('user')
    },
    groupSubjectOptions () {
      return this.getSubjectOptions('group')
    },
    disableCreateStudyCaseReportForm () {
      return this.v$.newStudyCaseReportFormData.$invalid || !this.newStudyCaseReportFormData.form || !this.newStudyCaseReportFormData.revision || this.revisionOptions.length === 0
    },
    disableEditStudyCaseReportForm () {
      return this.v$.selectedStudyCaseReportForm.$invalid || !this.selectedStudyCaseReportForm.revision || this.revisionOptions.length === 0
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
        this.updateRevisionOptions(this.newStudyCaseReportFormData.form)
      } else {
        this.revisionOptions = []
      }
    }
  },
  methods: {
    ...mapActions({
      getStudyForms: 'form/getForms',
      getStudyCaseReportForms: 'caseReport/getCaseReportForms',
      createStudyCaseReportForm: 'caseReport/createCaseReportForm',
      updateStudyCaseReportForm: 'caseReport/updateCaseReportForm',
      createStudyFormRevision: 'form/createFormRevision'
    }),
    updateRevisionOptions (form) {
      formRevisionService.getFormRevisionsDigest(this.studyId, form)
        .then((response) => {
          this.revisionOptions = response.data ? response.data.map(rev => rev.revision) : []
          if (this.revisionOptions.length > 0) {
            this.revisionOptions.splice(0, 0, t('study.latest_revision'))
          } else {
            this.showConfirmCreateFormRevision = true
          }
        })
    },
    onAdd () {
      this.newStudyCaseReportFormData = {
        name: '',
        description: '',
        repeatPolicy: 'multiple',
        restrictedAccess: false,
        permissions: {
          users: [],
          groups: []
        }
      }
      this.showCreateStudyCaseReportForm = true
      this.selectedStudyCaseReportForm = undefined
    },
    onEdit (studyCaseReportForm) {
      this.selectedStudyCaseReportForm = { ...studyCaseReportForm }
      this.selectedStudyCaseReportForm.permissions = {
        users: studyCaseReportForm.permissions && studyCaseReportForm.permissions.users ? studyCaseReportForm.permissions.users : [],
        groups: studyCaseReportForm.permissions && studyCaseReportForm.permissions.groups ? studyCaseReportForm.permissions.groups : []
      }
      this.selectedStudyCaseReportForm.restrictedAccess = this.selectedStudyCaseReportForm.permissions.users.length > 0 || this.selectedStudyCaseReportForm.permissions.groups.length > 0
      this.updateRevisionOptions(this.selectedStudyCaseReportForm.form)
      this.showEditStudyCaseReportForm = true
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
    getSubject (id, type) {
      if (this.subjects && this.subjects.length > 0) {
        return this.subjects.filter(s => s.type === type && s.id === id).pop()
      }
      return { id: id, type: type, name: '?' }
    },
    getSubjectOptions (type) {
      return this.subjects.filter(s => s.type === type).map(s => {
        return {
          value: s.id,
          label: s.name
        }
      })
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
        this.$store.commit('caseReport/setCaseReportFormPagination', {
          caseReportFormPaginationOpts: requestProp.pagination
        })
        await this.getStudyCaseReportForms({ paginationOpts: requestProp.pagination, study: this.studyId, filter: requestProp.filter })
      } else {
        await this.getStudyCaseReportForms({ paginationOpts: this.paginationOpts, study: this.studyId, filter: this.filter })
      }
      this.paginationOpts.rowsNumber = this.$store.state.caseReport.caseReportFormPaginationOpts.rowsNumber
    },
    setPagination () {
      this.paginationOpts = this.$store.state.caseReport.caseReportFormPaginationOpts
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
    async createFormRevision () {
      const toSave = {
        form: this.newStudyCaseReportFormData.form,
        study: this.studyId
      }
      await this.createStudyFormRevision({
        formRevision: toSave
      })
      this.updateRevisionOptions()
    },
    deleteStudyCaseReportForm () {
      this.$store.dispatch('caseReport/deleteCaseReportForm', {
        id: this.selectedStudyCaseReportForm._id,
        study: this.studyId,
        paginationOpts: this.paginationOpts
      })
    },
    deleteStudyCaseReportForms () {
      const ids = this.selected.map(u => u._id)
      this.$store.dispatch('caseReport/deleteCaseReportForms', {
        ids: ids,
        study: this.studyId,
        paginationOpts: this.paginationOpts
      })
      this.selected = []
    },
    async saveStudyCaseReportForm (create) {
      this.v$.$reset()
      if (create) {
        const toSave = { ...this.newStudyCaseReportFormData }
        toSave.study = this.studyId
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
        this.createStudyCaseReportForm({
          caseReportForm: toSave
        })
      } else {
        const toSave = { ...this.selectedStudyCaseReportForm }
        if (this.selectedStudyCaseReportForm.restrictedAccess) {
          // empty permissions means it is not a restricted access
          if (this.selectedStudyCaseReportForm.permissions.users.length === 0 && this.selectedStudyCaseReportForm.permissions.groups.length === 0) {
            toSave.permissions = null
          }
        } else {
          toSave.permissions = null
        }
        delete toSave.restrictedAccess
        if (toSave.revision === t('study.latest_revision')) {
          delete toSave.revision
        }
        this.updateStudyCaseReportForm({
          caseReportForm: toSave,
          paginationOpts: this.paginationOpts
        })
      }
    }
  }
})
</script>
