<template>
  <q-page>

    <div class="q-ml-md q-mr-md q-mt-sm q-mb-md">
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
        <div class="text-caption text-secondary col-12">
          {{ interviewDesign.description }}
        </div>
      </div>
      <div class="row">
        <div class="text-body2 text-secondary col-12">
          <div class="note note-info">
            <span v-html="$t('study.interview_designs_hint')"/>
          </div>
        </div>
      </div>
    </div>
    <q-card class="q-ma-md">

      <q-card-section v-if="!isReadOnly">
        <div class="text-h5 q-mb-md">{{ $t('interview.design') }}</div>
        <q-separator/>
        <q-splitter
          v-model="splitterModel"
        >
          <template v-slot:before>
            <q-tabs
              v-model="innerTab"
              vertical
              class="text-teal"
            >
              <q-tab name="steps" icon="category" :label="$t('interview.steps')" />
              <q-tab name="translations" icon="translate" :label="$t('form.translations')" />
            </q-tabs>
          </template>
          <template v-slot:after>
            <q-tab-panels
              v-model="innerTab"
            >
              <q-tab-panel name="steps" class="q-pa-none">
                <interview-design-steps v-model="interviewDesignData"/>
              </q-tab-panel>

              <q-tab-panel name="translations">
                <interview-design-translations v-model="interviewDesignData"/>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-card-section>

    </q-card>

    <q-card class="q-ma-md">

      <q-card-section>
        <div class="text-h5 q-mb-md">{{ $t('interview.campaigns') }}</div>
        <campaigns/>
      </q-card-section>

    </q-card>

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
              v-model='interviewDesignData.label'
              :label="$t('title')"
              lazy-rules
              @blur="v$.interviewDesignData.label.$touch"
              :error="v$.interviewDesignData.label.$error"
              :hint="$t('required')"
            >
              <template v-slot:error>
                <div v-for="error in v$.interviewDesignData.label.$errors">
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
            <q-input
              v-model='interviewDesignData.interviewer_instructions'
              :label="$t('interview.interviewer_instructions')"
              :hint="$t('interview.interviewer_instructions_hint')"
              autogrow
              lazy-rules
              class='q-mb-sm'/>
            <q-input
              v-model='interviewDesignData.participant_instructions'
              :label="$t('interview.participant_instructions')"
              :hint="$t('interview.participant_instructions_hint')"
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

<script>
import { mapState, mapActions } from 'vuex'
import { defineComponent, defineAsyncComponent, ref, toRaw } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'
import AuthMixin from '../mixins/AuthMixin'

export default defineComponent({
  components: {
    InterviewDesignSteps: defineAsyncComponent(() => import('src/components/interviews/InterviewDesignSteps.vue')),
    InterviewDesignTranslations: defineAsyncComponent(() => import('src/components/interviews/InterviewDesignTranslations.vue')),
    Campaigns: defineAsyncComponent(() => import('src/components/interviews/Campaigns.vue'))
  },
  mixins: [AuthMixin],
  mounted () {
    // check for changes every 2 seconds
    this.saveIntervalId = setInterval(() => {
      if (!this.isReadOnly) {
        if (this.changeDetected >= 0 && this.hasInterviewDesignChanged()) {
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
      tab: ref('design'),
      innerTab: ref('steps'),
      splitterModel: ref(15),
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
      revisionOptions: [],
      interviewDesignData: {},
      originalInterviewDesign: { steps: [], i18n: {} }
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
    }
  },
  computed: {
    ...mapState({
      study: state => state.study.study,
      interviewDesign: state => state.interview.interviewDesign
    }),
    studyId () {
      return this.$route.params.id
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
  methods: {
    ...mapActions({
      getStudy: 'study/getStudy',
      getStudyInterviewDesign: 'interview/getInterviewDesign',
      updateStudyInterviewDesign: 'interview/updateInterviewDesign'
    }),
    asReference () {
      return { steps: this.interviewDesignData.steps, i18n: this.interviewDesignData.i18n }
    },
    initOriginalInterviewDesign () {
      this.originalInterviewDesign.steps = JSON.parse(JSON.stringify(this.interviewDesignData.steps))
      this.originalInterviewDesign.i18n = this.interviewDesignData.i18n ? JSON.parse(JSON.stringify(this.interviewDesignData.i18n)) : undefined
    },
    async initStudyInterviewDesignData () {
      await this.getStudyInterviewDesign({ id: this.$route.params.itwid })
      this.interviewDesignData = JSON.parse(JSON.stringify(this.interviewDesign))
      this.initOriginalInterviewDesign()
      await this.getStudy({ id: this.interviewDesign.study })
    },
    hasInterviewDesignChanged () {
      return JSON.stringify(this.originalInterviewDesign.steps) !== JSON.stringify(this.interviewDesignData.steps) ||
        JSON.stringify(this.originalInterviewDesign.i18n) !== JSON.stringify(this.interviewDesignData.i18n)
    },
    async save (notification, interviewDesign) {
      this.v$.$reset()
      this.changeDetected = -1
      const toSave = interviewDesign || toRaw(this.interviewDesignData)
      return this.updateStudyInterviewDesign({ interviewDesign: toSave, notification: notification }).then(() => {
        this.initOriginalInterviewDesign()
        this.changeDetected = 0
      })
    },
    onEdit () {
      this.showEditDefinition = true
    }
  }
})

</script>
