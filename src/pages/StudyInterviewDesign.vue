<template>
  <q-page>

    <div class="q-ml-md q-mr-md q-mt-sm q-mb-md">
      <div class="row">
        <div class="col-12">
          <q-breadcrumbs class="q-mt-sm q-mr-md text-h5" :class="isReadOnly ? '' : 'float-left'">
            <q-breadcrumbs-el :label="t('study.interview_designs')" :to="'/study/' + studyId + '/interview-designs'"/>
            <q-breadcrumbs-el :label="interviewDesign.name" />
          </q-breadcrumbs>
          <div class="text-grey-7 q-mt-sm">
            <q-btn
              v-if="!isReadOnly"
              @click='onEdit'
              :title="t('edit_settings')"
              icon="settings"
              flat
              dense
              round>
            </q-btn>
            <q-btn
              v-if="!isReadOnly"
              @click='save'
              :title="t(changeDetected === 0 ? 'save_done' : (changeDetected < 0 ? 'saving' : 'save'))"
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
            <span v-html="t('study.interview_designs_hint')"/>
          </div>
        </div>
      </div>
    </div>
    <q-card class="q-ma-md">

      <q-card-section v-if="!isReadOnly">
        <div class="text-h5 q-mb-md">{{ t('interview.design') }}</div>
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
              <q-tab name="steps" icon="category" :label="t('interview.steps')" />
              <q-tab name="translations" icon="translate" :label="t('form.translations')" />
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
        <div class="text-h5 q-mb-md">{{ t('interview.campaigns') }}</div>
        <campaigns/>
      </q-card-section>

    </q-card>

    <q-dialog v-model='showEditDefinition' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section class="row items-center">
          <div class="col-12">
            <q-input
              v-model='interviewDesignData.name'
              :label="t('name')"
              lazy-rules
              class='q-mb-sm'
              @blur="v$.interviewDesignData.name.$touch"
              :error="v$.interviewDesignData.name.$error"
              :hint="t('required')">
              <template v-slot:error>
              <div v-for="error in v$.interviewDesignData.name.$errors">
                  {{error.$message}}
              </div>
              </template>
            </q-input>
            <q-input
              v-model='interviewDesignData.label'
              :label="t('title')"
              lazy-rules
              @blur="v$.interviewDesignData.label.$touch"
              :error="v$.interviewDesignData.label.$error"
              :hint="t('required')"
            >
              <template v-slot:error>
                <div v-for="error in v$.interviewDesignData.label.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
            <q-input
              v-model='interviewDesignData.description'
              :label="t('description')"
              autogrow
              lazy-rules
              class='q-mb-sm'/>
            <q-input
              v-model='interviewDesignData.interviewer_instructions'
              :label="t('interview.interviewer_instructions')"
              :hint="t('interview.interviewer_instructions_hint')"
              autogrow
              lazy-rules
              class='q-mb-sm'/>
            <q-input
              v-model='interviewDesignData.participant_instructions'
              :label="t('interview.participant_instructions')"
              :hint="t('interview.participant_instructions_hint')"
              autogrow
              lazy-rules
              class='q-mb-sm'/>
           </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='save(true)'
            :disable='disableSave'
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

  </q-page>
</template>

<script setup>
import { ref, reactive, computed, toRaw, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'
import InterviewDesignSteps from 'src/components/interviews/InterviewDesignSteps.vue'
import InterviewDesignTranslations from 'src/components/interviews/InterviewDesignTranslations.vue'
import Campaigns from 'src/components/interviews/Campaigns.vue'
import { useInterviewStore } from 'src/stores/interview'
import { useStudyStore } from 'src/stores/study'
import { useAuth } from 'src/composables/useAuth'

const { t } = useI18n()

const route = useRoute()
const interviewStore = useInterviewStore()
const studyStore = useStudyStore()
const { isReadOnly } = useAuth()

// data
const tab = ref('design')
const innerTab = ref('steps')
const splitterModel = ref(15)
const selected = ref([])
const reload = ref(0)
const paginationOpts = ref({
  descending: true,
  page: 1,
  rowsPerPage: 10
})
const saveIntervalId = ref(null)
const changeDetected = ref(0)
const showEditDefinition = ref(false)
const revisionOptions = ref([])
const interviewDesignData = ref({})
const originalInterviewDesign = reactive({ steps: [], i18n: {} })

// validations
const rules = {
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
}
const v$ = useVuelidate(rules, { interviewDesignData })

// computed
const study = computed(() => studyStore.study)
const interviewDesign = computed(() => interviewStore.interviewDesign)
const studyId = computed(() => route.params.id)
const disableSave = computed(() => v$.value.interviewDesignData.$invalid)
const saveIcon = computed(() => {
  if (changeDetected.value < 0) {
    return 'cloud_sync'
  }
  if (changeDetected.value === 0) {
    return 'cloud_done'
  }
  return 'cloud_upload'
})

// methods
function asReference() {
  return { steps: interviewDesignData.value.steps, i18n: interviewDesignData.value.i18n }
}

function initOriginalInterviewDesign() {
  originalInterviewDesign.steps = JSON.parse(JSON.stringify(interviewDesignData.value.steps))
  originalInterviewDesign.i18n = interviewDesignData.value.i18n ? JSON.parse(JSON.stringify(interviewDesignData.value.i18n)) : undefined
}

async function initStudyInterviewDesignData() {
  await interviewStore.getInterviewDesign(route.params.itwid)
  interviewDesignData.value = JSON.parse(JSON.stringify(interviewDesign.value))
  initOriginalInterviewDesign()
  await studyStore.getStudy(interviewDesign.value.study)
}

function hasInterviewDesignChanged() {
  return JSON.stringify(originalInterviewDesign.steps) !== JSON.stringify(interviewDesignData.value.steps) ||
    JSON.stringify(originalInterviewDesign.i18n) !== JSON.stringify(interviewDesignData.value.i18n)
}

async function save(notification, interviewDesignArg) {
  v$.value.$reset()
  changeDetected.value = -1
  const toSave = interviewDesignArg || toRaw(interviewDesignData.value)
  return interviewStore.updateInterviewDesign(toSave, undefined, undefined, notification).then(() => {
    initOriginalInterviewDesign()
    changeDetected.value = 0
  })
}

function onEdit() {
  showEditDefinition.value = true
}

// mounted
onMounted(() => {
  // check for changes every 2 seconds
  saveIntervalId.value = setInterval(() => {
    if (!isReadOnly.value) {
      if (changeDetected.value >= 0 && hasInterviewDesignChanged()) {
        changeDetected.value++
        // auto save every 4s
        if (changeDetected.value > 2) {
          save(false)
        }
      }
    }
  }, 2000)
  initStudyInterviewDesignData()
})

onBeforeUnmount(() => {
  if (saveIntervalId.value) {
    clearInterval(saveIntervalId.value)
  }
})
</script>
