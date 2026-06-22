<template>
  <q-page>
    <q-toolbar class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs class="q-mr-md">
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="t('studies.title')" to="/studies"/>
        <q-breadcrumbs-el :label="study.name" />
      </q-breadcrumbs>
      <q-btn
        @click='onEdit'
        :title="t('edit_settings')"
        icon="settings"
        class="text-grey-7"
        size="sm"
        flat
        dense
        round>
      </q-btn>
    </q-toolbar>
    <q-separator/>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-md">{{t('main.dashboard')}}</div>
      <div v-if="study.description" class="text-caption text-secondary">
        {{ study.description }}
      </div>
      <div class="row q-col-gutter-lg q-mb-lg">
        <div v-if="hasMetrics && !isGuest" class="col-8 col-sm-8 col-xs-12">
          <dashboard-counts :counts="counts"/>
        </div>
        <div v-if="myCampaigns.length" class="col-4 col-sm-4 col-xs-12">
          <q-item-label header class="text-uppercase q-pl-none">{{ t('study.my_campaigns') }}</q-item-label>
          <q-list bordered separator>
            <q-item v-for="campaign in myCampaigns" :key="campaign._id" clickable :to="`/study/${campaign.study}/interview-design/${campaign.interviewDesign}?c=${campaign._id}`">
              <q-item-section>
                <q-item-label overline>{{ getCampaignLabel(campaign) }}</q-item-label>
                <q-item-label caption>{{  campaign.description }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-btn
                  flat
                  round
                  size="sm"
                  icon="arrow_forward"
                  :to="`/study/${campaign.study}/interview-design/${campaign.interviewDesign}?c=${campaign._id}`">
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <div v-if="hasMetrics">
      </div>
      <div v-else>
        <div class="text-body2 text-secondary">
          <div v-if="hasForms">
            <div>{{ t('study.form_use') }}</div>
            <q-btn
              v-if="hasCaseReportService"
              color="primary"
              icon-right="arrow_forward"
              :label="t('study.case_report_forms')"
              :to="`/study/${studyId}/case-report-forms`"
              class="q-mt-md q-mr-md" />
            <q-btn
              v-if="hasInterviewService"
              color="primary"
              icon-right="arrow_forward"
              :label="t('study.interview_designs')"
              :to="`/study/${studyId}/interview-designs`"
              class="q-mt-md" />
          </div>
          <div v-else class="q-mt-md">
            <div>{{ t('study.form_create') }}</div>
            <q-btn
              color="primary"
              icon-right="arrow_forward"
              :label="t('study.forms')"
              :to="`/study/${studyId}/forms`"
              class="q-mt-md" />
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model='showEditDefinition' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section class="row items-center">
           <div class="col-12">
            <q-input
              v-model='studyData.name'
              :label="t('name')"
              lazy-rules
              class='q-mb-sm'
              @blur="v$.studyData.name.$touch"
                  :error="v$.studyData.name.$error"
                  :hint="t('required')"
                >
              <template v-slot:error>
                <div v-for="error in v$.studyData.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
            <q-input
              v-model='studyData.description'
              :label="t('description')"
              autogrow
              lazy-rules
              class='q-mb-sm'
            />
            <q-select
              v-model="studyData.services"
              :label="t('study.services')"
              :hint="t('study.services_hint')"
              :options="servicesOptions"
              multiple
              emit-value
              map-options
              clearable
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='save'
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { settings } from '../boot/settings'
import { metricsService } from '../services/utils'
import { interviewDesignService, campaignService } from '../services/interview'
import { useStudyStore } from 'src/stores/study'
import { useAuth } from 'src/composables/useAuth'
import { required, minLength, maxLength } from '../boot/vuelidate'
import DashboardCounts from 'src/components/dashboard/DashboardCounts.vue'

const { t } = useI18n()

const route = useRoute()
const studyStore = useStudyStore()
const { user, isGuest } = useAuth()

// data
const counts = ref({})
const interviewDesigns = ref([])
const myCampaigns = ref([])

// computed
const study = computed(() => studyStore.study)
const studyId = computed(() => route.params.id)
const hasMetrics = computed(() => {
  return (counts.value.case_reports_agg && counts.value.case_reports_agg.length) ||
    (counts.value.interviews_agg && counts.value.interviews_agg.length)
})
const hasForms = computed(() => counts.value.forms > 0)
const hasCaseReportService = computed(() => {
  return study.value && (!study.value.services || study.value.services.length === 0 || study.value.services?.includes('case-reports'))
})
const hasInterviewService = computed(() => {
  return study.value && (!study.value.services || study.value.services.length === 0 || study.value.services?.includes('interviews'))
})

// methods
function getCampaignLabel(campaign) {
  return `${interviewDesigns.value.find(itwd => itwd._id === campaign.interviewDesign).name} / ${campaign.name}`
}

// mounted
onMounted(() => {
  metricsService.getMetrics({
    type: 'study',
    query: {
      form: {
        study: studyId.value
      },
      'case-report-form': {
        study: studyId.value
      },
      'interview-design': {
        study: studyId.value
      },
      'case-report': {
        study: studyId.value
      },
      interview: {
        study: studyId.value
      }
    }
  }).then((result) => {
    counts.value = result.counts ? result.counts : {}
  })
  interviewDesignService.getInterviewDesignsByStudy(studyId.value).then((result) => {
    interviewDesigns.value = result.data ? result.data : []
    if (interviewDesigns.value.length > 0) {
      campaignService.getCampaignsByStudy(studyId.value).then((result) => {
        myCampaigns.value = (result.data ? result.data : [])
          .filter((c) => (c.investigators && c.investigators.includes(user.value._id)) || (c.supporters && c.supporters.includes(user.value._id)))
      })
    }
  })
})

const showEditDefinition = ref(false)
const studyData = ref({
  name: '',
  description: '',
  services: []
})

// Validation rules
const rules = {
  studyData: {
    name: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    }
  }
}

const v$ = useVuelidate(rules, { studyData })

const disableSave = computed(() => v$.value.studyData.$invalid)

const servicesOptions = computed(() => [
  { label: t('study.case_reports'), value: 'case-reports' },
  { label: t('study.interviews'), value: 'interviews' }
])

// Methods

function onEdit() {
  studyData.value = JSON.parse(JSON.stringify(study.value))
  showEditDefinition.value = true
}

async function save() {
  v$.value.$reset()
  const toSave = { ...studyData.value }
  studyStore.updateStudy(toSave)
}

</script>
