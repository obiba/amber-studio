<template>
  <q-page>

    <div class="q-pl-md q-pr-md q-pt-sm q-pb-md">
      <div class="row">
        <div class="col-12">
          <q-breadcrumbs class="q-mt-sm q-mr-md text-h5" :class="isReadOnly ? '' : 'float-left'">
            <q-breadcrumbs-el :label="$t('study.interview_designs')" :to="'/study/' + studyId + '/interview-designs'"/>
            <q-breadcrumbs-el :label="interviewDesign.name" />
          </q-breadcrumbs>
          <div class="text-grey-7 q-mt-sm">
            <q-btn
              v-if="!isReadOnly"
              @click='onEdit'
              :title="$t('edit_settings')"
              icon="settings"
              flat
              dense
              round>
            </q-btn>
            <q-btn
              v-if="!isReadOnly"
              @click='save'
              :title="$t(changeDetected === 0 ? 'save_done' : (changeDetected < 0 ? 'saving' : 'save'))"
              :icon="saveIcon"
              :disable="changeDetected < 0"
              flat
              dense
              round>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="text-caption text-grey-8 col-12">
          {{ interviewDesign.description }}
        </div>
      </div>
      <div class="row">
        <div class="text-body2 text-grey-8 col-12">
          <div class="note note-info">
            <span v-html="$t('study.interview_designs_hint')"/>
          </div>
        </div>
      </div>
    </div>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="steps" :label="$t('interview.steps')" />
      <q-tab name="campaigns" :label="$t('interview.campaigns')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">

      <q-tab-panel name="steps" class="q-pa-none">
        <q-table
          v-if="hasSteps"
          flat
          :rows="interviewDesign.steps"
          :columns="stepsColumns"
          :filter="filter"
          row-key="_id"
          :selection="isReadOnly ? 'none' : 'multiple'"
          v-model:selected="selected"
          v-model:pagination='paginationOpts'
        >
          <template v-slot:top>
            <q-btn
              v-if="!isReadOnly"
              color="primary"
              icon="add"
              :title="$t('interview.add_step_hint')"
              @click="onAddStep()"
              class="q-mr-md" />
            <q-btn
              v-if="!isReadOnly"
              class="q-mr-md"
              flat
              round
              color="negative"
              icon="delete_outline"
              :disable="selected.length === 0"
              :title="$t('interview.delete_steps_hint')"
              @click="onConfirmDeleteMultipleSteps()" />
            <q-space />
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
          <template v-slot:body-cell-action='props'>
            <q-td :props='props'>
              <q-btn
                class="text-grey-8"
                size="12px"
                flat
                dense
                round
                :title="$t('interview.move_up_step_hint')"
                icon="arrow_upward"
                @click='moveUpStep(props.row)'>
              </q-btn>
              <q-btn
                class="text-grey-8"
                size="12px"
                flat
                dense
                round
                :title="$t('interview.move_down_step_hint')"
                icon="arrow_downward"
                @click='moveDownStep(props.row)'>
              </q-btn>
              <q-btn
                class="text-grey-8"
                size="12px"
                flat
                dense
                round
                :title="$t('interview.edit_step_hint')"
                icon="edit"
                @click='onEditStep(props.row)'>
              </q-btn>
              <q-btn
                class="text-grey-8"
                size="12px"
                flat
                dense
                round
                :title="$t('interview.delete_step_hint')"
                icon="delete"
                @click='onConfirmDeleteStep(props.row)'>
              </q-btn>
            </q-td>
          </template>
        </q-table>

        <q-btn
          v-else-if="!isReadOnly"
          color="primary"
          icon="add"
          :label="$t('interview.add_step_hint')"
          @click="onAddStep()"
          class="q-ma-md" />

      </q-tab-panel>

      <q-tab-panel name="campaigns">

      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model='showEditDefinition' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section class="row items-center">
          <div class="col-12">
            <q-input
              v-model='interviewDesignData.name'
              :label="$t('name')"
              lazy-rules
              class='q-mb-sm'
              @blur="v$.interviewDesignData.name.$touch"
              :error="v$.interviewDesignData.name.$error"
              :hint="$t('required')">
              <template v-slot:error>
              <div v-for="error in v$.interviewDesignData.name.$errors">
                  {{error.$message}}
              </div>
              </template>
            </q-input>
            <q-input
              v-model='interviewDesignData.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              class='q-mb-sm'/>
           </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='save(true)'
            :disable='disableSave'
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

    <q-dialog v-model='showAddStep' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='newStepData.name'
            :label="$t('name')"
            lazy-rules
            @blur="v$.newStepData.name.$touch"
            :error="v$.newStepData.name.$error"
            :hint="$t('interview.step_name_hint')"
          >
            <template v-slot:error>
              <div v-for="error in v$.newStepData.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='newStepData.label'
            :label="$t('title')"
            lazy-rules
            @blur="v$.newStepData.label.$touch"
            :error="v$.newStepData.label.$error"
            :hint="$t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.newStepData.label.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='newStepData.description'
            :label="$t('description')"
            autogrow
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="newStepData.form"
            :options="formOptions"
            emit-value
            map-options
            :label="$t('study.form')" />
          <q-select
            v-model="newStepData.revision"
            :options="revisionOptions"
            emit-value
            map-options
            :label="$t('study.form_revision')"
            :disable="!newStepData.form" />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='addStep'
            :disable="disableAddStep"
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

    <q-dialog v-model='showConfirmDeleteStep' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('interview.delete_step_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ selectedStep.name }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStep'
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

    <q-dialog v-model='showConfirmDeleteSteps' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_steps_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => g.name).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteSteps'
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

  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { defineComponent, ref, toRaw } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'
import { formRevisionService } from '../services/form'
import { t } from '../boot/i18n'
import AuthMixin from '../mixins/AuthMixin'

export default defineComponent({
  mixins: [AuthMixin],
  mounted () {
    if (this.studyId) {
      this.getStudyForms({ study: this.studyId })
    }
    // check for changes every 2 seconds
    this.saveIntervalId = setInterval(() => {
      if (!this.isReadOnly) {
        if (this.changeDetected >= 0 && this.originalStepsStr !== JSON.stringify(this.interviewDesignData.steps)) {
          this.changeDetected++
          // auto save every 4s
          if (this.changeDetected > 2) {
            this.save(false)
          }
        }
      }
    }, 2000)
    this.initStudyInterviewDesignData()
  },
  beforeUnmount () {
    if (this.saveIntervalId) {
      clearInterval(this.saveIntervalId)
    }
  },
  setup () {
    return {
      v$: useVuelidate(),
      tab: ref('steps'),
      selected: ref([]),
      reload: ref(0),
      paginationOpts: {
        descending: true,
        page: 1,
        rowsPerPage: 10
      }
    }
  },
  data () {
    return {
      saveIntervalId: null,
      changeDetected: 0,
      showEditDefinition: false,
      showAddStep: false,
      showConfirmDeleteStep: false,
      showConfirmDeleteSteps: false,
      newStepData: {
        name: '',
        description: ''
      },
      revisionOptions: [],
      interviewDesignData: {},
      originalStepsStr: null
    }
  },
  validations: {
    interviewDesignData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      label: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    },
    newStepData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      label: {
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
      interviewDesign: state => state.interview.interviewDesign
    }),
    stepsColumns () {
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
          name: 'label',
          align: 'left',
          label: this.$t('title'),
          field: 'label',
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
        }
      ]
      if (!this.isReadOnly) {
        cols.push({
          name: 'action',
          align: 'left',
          label: this.$t('action')
        })
      }
      return cols
    },
    studyId () {
      return this.$route.params.id
    },
    formOptions () {
      return this.forms.map(form => {
        return {
          value: form._id,
          label: form.name
        }
      })
    },
    hasSteps () {
      return this.interviewDesignData.steps && this.interviewDesignData.steps.length > 0
    },
    disableAddStep () {
      return this.v$.newStepData.$invalid || !this.newStepData.form || !this.newStepData.revision || this.revisionOptions.length === 0
    },
    disableSave () {
      return this.v$.interviewDesignData.$invalid
    },
    saveIcon () {
      if (this.changeDetected < 0) {
        return 'cloud_sync'
      }
      if (this.changeDetected === 0) {
        return 'cloud_done'
      }
      return 'cloud_upload'
    }
  },
  watch: {
    'newStepData.form': function () {
      if (this.newStepData.form) {
        this.updateRevisionOptions(this.newStepData.form)
      } else {
        this.revisionOptions = []
      }
    }
  },
  methods: {
    ...mapActions({
      getStudy: 'study/getStudy',
      getStudyForms: 'form/getForms',
      getStudyInterviewDesign: 'interview/getInterviewDesign',
      updateStudyInterviewDesign: 'interview/updateInterviewDesign'
    }),
    async initStudyInterviewDesignData () {
      await this.getStudyInterviewDesign({ id: this.$route.params.itwid })
      this.interviewDesignData = JSON.parse(JSON.stringify(this.interviewDesign))
      this.originalStepsStr = JSON.stringify(this.interviewDesignData.steps)
      await this.getStudy({ id: this.interviewDesign.study })
    },
    async save (notification, interviewDesign) {
      this.v$.$reset()
      this.changeDetected = -1
      const toSave = interviewDesign || toRaw(this.interviewDesignData)
      return this.updateStudyInterviewDesign({ interviewDesign: toSave, notification: notification }).then(() => {
        this.originalStepsStr = JSON.stringify(this.interviewDesignData.steps)
        this.changeDetected = 0
      })
    },
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
    getFormName (formId) {
      return this.forms.filter(form => form._id === formId).map(form => form.name).pop()
    },
    moveUpStep (step) {
      const idx = this.interviewDesignData.steps.indexOf(step)
      if (idx > 0) {
        this.interviewDesignData.steps.splice(idx, 1)
        this.interviewDesignData.steps.splice(idx - 1, 0, step)
      }
    },
    moveDownStep (step) {
      const idx = this.interviewDesignData.steps.indexOf(step)
      if (idx < this.interviewDesignData.steps.length) {
        this.interviewDesignData.steps.splice(idx, 1)
        this.interviewDesignData.steps.splice(idx + 1, 0, step)
      }
    },
    addStep () {
      const toSave = JSON.parse(JSON.stringify(this.interviewDesignData))
      if (!toSave.steps) {
        toSave.steps = []
      }
      if (!toSave.steps.find(step => step.name === this.newStepData.name)) {
        toSave.steps.push({ ...this.newStepData })
        this.save(false, toSave)
      }
    },
    deleteStep () {
      if (this.selectedStep) {
        const toSave = toRaw(this.interviewDesignData)
        toSave.steps = toSave.steps.filter(step => step.name !== this.selectedStep.name)
        this.save(false)
      }
    },
    deleteSteps () {
      if (this.selected) {
        const toSave = toRaw(this.interviewDesignData)
        const selectedNames = this.selected.map(step => step.name)
        toSave.steps = toSave.steps.filter(step => !selectedNames.includes(step.name))
        this.save(false)
      }
    },
    onAddStep () {
      this.newStepData = {
        name: '',
        description: ''
      }
      this.showAddStep = true
    },
    onConfirmDeleteStep (step) {
      this.showConfirmDeleteStep = true
      this.selectedStep = step
    },
    onConfirmDeleteMultipleSteps () {
      if (this.selected.length > 0) {
        this.showConfirmDeleteSteps = true
      }
    },
    onExport () {
      const data = JSON.parse(JSON.stringify(this.interviewDesignData))
      delete data._id
      delete data.name
      this.deleteIds(data.items)
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const a = document.createElement('a')
      a.download = this.interviewDesignData.name + '-interview-design.json'
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['application/json', a.download, a.href].join(':')
      a.click()
      a.remove()
    },
    onImport () {
      this.showImportSchema = true
      this.importSchemaFile = null
    },
    onEdit () {
      this.showEditDefinition = true
    },
    onTag () {
      this.showTag = true
      this.publicationComment = null
    },
    onReinstate () {
      this.interviewDesignData = JSON.parse(JSON.stringify(this.interviewDesign))
      this.originalStepsStr = JSON.stringify(this.interviewDesignData.steps)
      this.reload++
    }
  }
})

</script>
