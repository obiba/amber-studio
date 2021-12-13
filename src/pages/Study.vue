<template>
  <q-page>
    <div class="bg-blue-grey-1 q-pa-md">
      <q-breadcrumbs class="float-left q-mt-sm q-mr-md">
        <q-breadcrumbs-el icon="inventory_2" :title="$t('studies.title')" to="/studies"/>
        <q-breadcrumbs-el :label="study.name" />
      </q-breadcrumbs>
      <q-btn
        @click='onEdit'
        :title="$t('edit_settings')"
        icon="settings"
        class="text-grey-7"
        flat
        dense
        round>
      </q-btn>
      <div class="text-caption text-grey-8">
        {{ study.description }}
      </div>
    </div>
    <q-separator/>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="forms" :label="$t('study.forms')" />
      <q-tab name="dce" :label="$t('study.data_collection')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">

      <q-tab-panel name="forms">
        <study-forms/>
      </q-tab-panel>

      <q-tab-panel name="dce" class="q-pa-none">
        <q-splitter
          v-model="splitterModel"
        >
          <template v-slot:before>
            <q-tabs
              v-model="innerTab"
              vertical
              class="text-teal"
            >
              <q-tab name="caseReports" icon="summarize" :label="$t('study.case_report_forms')" />
              <q-tab name="interviews" icon="record_voice_over" :label="$t('study.interviews')" />
              <q-tab name="instruments" icon="straighten" :label="$t('study.instruments')" />
              <q-tab name="records" icon="cloud_circle" :label="$t('study.records')" />
            </q-tabs>
          </template>
          <template v-slot:after>
            <q-tab-panels
                  v-model="innerTab"
                >
              <q-tab-panel name="caseReports">
                <study-case-report-forms/>
              </q-tab-panel>

              <q-tab-panel name="interviews">
                TODO interviews design
              </q-tab-panel>

              <q-tab-panel name="instruments">
                TODO instrument devices registration and calibration
              </q-tab-panel>

              <q-tab-panel name="records">
                TODO list, filter, extract data records
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-tab-panel>

    </q-tab-panels>

    <q-dialog v-model='showEditDefinition' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section class="row items-center">
           <div class="col-12">
            <q-input
              v-model='studyData.name'
              :label="$t('name')"
              lazy-rules
              class='q-mb-sm'
              @blur="v$.studyData.name.$touch"
                  :error="v$.studyData.name.$error"
                  :hint="$t('required')"
                >
              <template v-slot:error>
                <div v-for="error in v$.studyData.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
            <q-input
              v-model='studyData.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              class='q-mb-sm'
            />
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='save'
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

  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'

export default defineComponent({
  components: {
    StudyForms: defineAsyncComponent(() => import('components/forms/StudyForms.vue')),
    StudyCaseReportForms: defineAsyncComponent(() => import('src/components/forms/StudyCaseReportForms.vue'))
  },
  mounted: function () {
    this.initStudyData()
  },
  setup () {
    return {
      tab: ref('forms'),
      innerTab: ref('caseReports'),
      splitterModel: ref(20),
      v$: useVuelidate()
    }
  },
  data () {
    return {
      showEditDefinition: false,
      studyData: {
        name: '',
        description: ''
      },
      selectedUserOptions: '',
      userOptionsLoading: false
    }
  },
  validations: {
    studyData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    }
  },
  computed: {
    ...mapState({
      study: state => state.study.study
    }),
    currentStudy () {
      return this.$store.state.study.study
    },
    disableSave () {
      return this.v$.studyData.$invalid
    }
  },
  methods: {
    ...mapActions({
      getStudy: 'study/getStudy',
      updateStudy: 'study/updateStudy'
    }),
    async initStudyData () {
      await this.getStudy({ id: this.$route.params.id })
      this.studyData = { ...JSON.parse(JSON.stringify(this.study)) }
    },
    onEdit () {
      this.showEditDefinition = true
    },
    async save () {
      this.v$.$reset()
      const toSave = { ...this.studyData }
      this.updateStudy({
        study: toSave
      })
    }
  }
})
</script>
