<template>
  <q-page>
    <q-toolbar class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs class="q-mr-md">
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="t('studies.title')" to="/studies"/>
        <q-breadcrumbs-el :label="studyStore.study?.name" :to="'/study/' + studyStore.study?._id" />
        <q-breadcrumbs-el :label="t('study.interview_designs')" :to="'/study/' + studyStore.study?._id + '/interview-designs'"/>
        <q-breadcrumbs-el :label="interviewDesign.name" />
      </q-breadcrumbs>
    </q-toolbar>
    <q-separator/>

    <div class="q-ma-md">
      <div class="row">
        <div class="text-h5">{{ t('study.interview_design') }}</div>
        <q-btn
          v-if="!isReadOnly"
          @click='onEdit'
          :title="t('edit_settings')"
          icon="settings"
          color="grey-7"
          flat
          dense
          round
          class="on-right">
        </q-btn>
        <q-btn
          v-if="!isReadOnly"
          @click='save'
          :title="t(changeDetected === 0 ? 'save_done' : (changeDetected < 0 ? 'saving' : 'save'))"
          :icon="saveIcon"
          :disable="changeDetected < 0"
          color="grey-7"
          flat
          dense
          round>
        </q-btn>
      </div>
      <div class="text-body2 text-secondary q-mb-sm">
        <span v-html="t('study.interview_designs_hint')"/>
      </div>
      <div class="row q-mb-md">
        <div class="col col-md-6 col-xs-12">
          <q-list bordered separator class="q-mt-md">
            <q-item>
              <q-item-section style="max-width: 200px;">
                <q-item-label side class="text-overline">{{ t('name') }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ interviewDesign.name }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section style="max-width: 200px;">
                <q-item-label side class="text-overline">{{ t('description') }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ interviewDesign.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>

    <div class="q-ma-md" v-if="!isReadOnly">
      <div class="text-h6 q-mb-md">{{ t('interview.design') }}</div>
        <div class="row q-ma-sm">
          <q-btn
            @click='innerTab = "steps"'
            :label="t('interview.steps')"
            icon="category"
            size="sm"
            color="teal"
            :outline="innerTab !== 'steps'" />
          <q-btn
            @click='innerTab = "translations"'
            :label="t('form.translations')"
            icon="translate"
            size="sm"
            color="teal"
            :outline="innerTab !== 'translations'"
            class="on-right" />
        </div>
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
      </div>

    <div class="q-ma-md">
      <div class="text-h6 q-mb-md">{{ t('interview.campaigns') }}</div>
      <campaigns/>
    </div>

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
              <div v-for="error in v$.interviewDesignData.name.$errors" :key="error.$uid">
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
                <div v-for="error in v$.interviewDesignData.label.$errors" :key="error.$uid">
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
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
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
import { settings } from 'src/boot/settings'

const { t } = useI18n()

const route = useRoute()
const interviewStore = useInterviewStore()
const studyStore = useStudyStore()
const { isReadOnly } = useAuth()

// data
const innerTab = ref('steps')
const saveIntervalId = ref(null)
const changeDetected = ref(0)
const showEditDefinition = ref(false)
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
const interviewDesign = computed(() => interviewStore.interviewDesign)
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
function initOriginalInterviewDesign () {
  originalInterviewDesign.steps = JSON.parse(JSON.stringify(interviewDesignData.value.steps))
  originalInterviewDesign.i18n = interviewDesignData.value.i18n ? JSON.parse(JSON.stringify(interviewDesignData.value.i18n)) : undefined
}

async function initStudyInterviewDesignData () {
  await interviewStore.getInterviewDesign(route.params.itwid)
  interviewDesignData.value = JSON.parse(JSON.stringify(interviewDesign.value))
  initOriginalInterviewDesign()
  await studyStore.getStudy(interviewDesign.value.study)
}

function hasInterviewDesignChanged () {
  return JSON.stringify(originalInterviewDesign.steps) !== JSON.stringify(interviewDesignData.value.steps) ||
    JSON.stringify(originalInterviewDesign.i18n) !== JSON.stringify(interviewDesignData.value.i18n)
}

async function save (notification, interviewDesignArg) {
  v$.value.$reset()
  changeDetected.value = -1
  const toSave = interviewDesignArg || toRaw(interviewDesignData.value)
  return interviewStore.updateInterviewDesign(toSave, undefined, undefined, notification).then(() => {
    initOriginalInterviewDesign()
    changeDetected.value = 0
  })
}

function onEdit () {
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
