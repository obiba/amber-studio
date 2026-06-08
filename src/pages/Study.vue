<template>
  <q-page>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-md">{{ t('study.dashboard') }}</div>
      <div v-if="myCampaigns.length" class="q-mb-md">
        <div class="text-h6 q-mb-md">{{ t('study.my_campaigns') }}</div>
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-3">
            <q-list bordered separator>
              <q-item v-for="campaign in myCampaigns" :key="campaign._id">
                <q-item-section>
                  <q-item-label overline>{{ getCampaignLabel(campaign) }}</q-item-label>
                  <q-item-label caption>{{  campaign.description }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-btn
                    color="purple"
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
      </div>
      <div v-if="hasMetrics">
        <div class="text-h6 q-mb-md">{{ t('study.metrics') }}</div>
        <dashboard-counts v-if="!isGuest" :counts="counts"/>
      </div>
      <div v-else>
        <div class="note note-info text-body2 text-secondary">
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

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { metricsService } from '../services/utils'
import { interviewDesignService, campaignService } from '../services/interview'
import { useStudyStore } from 'src/stores/study'
import { useAuth } from 'src/composables/useAuth'
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
</script>
