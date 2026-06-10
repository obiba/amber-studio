<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">{{t('main.dashboard')}}</div>
    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-8 col-sm-8 col-xs-12">
        <q-item-label header class="text-uppercase q-pl-none">{{ t('study.metrics') }}</q-item-label>
        <dashboard-counts v-if="!isGuest" :counts="counts"/>
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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { metricsService } from '../services/utils'
import { interviewDesignService, campaignService } from '../services/interview'
import studyService from '../services/study'
import { useAuth } from 'src/composables/useAuth'
import DashboardCounts from 'src/components/dashboard/DashboardCounts.vue'

const { t } = useI18n()

const { isGuest, user } = useAuth()

// data
const counts = ref({})
const studies = ref([])
const interviewDesigns = ref([])
const myCampaigns = ref([])

// methods
function getCampaignLabel(campaign) {
  return `${studies.value.find(std => std._id === campaign.study).name} / ${interviewDesigns.value.find(itwd => itwd._id === campaign.interviewDesign).name} / ${campaign.name}`
}

// mounted
onMounted(() => {
  metricsService.getMetrics().then((result) => {
    counts.value = result.counts ? result.counts : {}
  })
  studyService.getStudies().then((result) => {
    studies.value = result.data ? result.data : []
    if (studies.value.length > 0) {
      interviewDesignService.getInterviewDesignsByStudy().then((result) => {
        interviewDesigns.value = result.data ? result.data : []
        if (interviewDesigns.value.length > 0) {
          campaignService.getCampaigns().then((result) => {
            myCampaigns.value = (result.data ? result.data : [])
              .filter((c) => (c.investigators && c.investigators.includes(user.value._id)) || (c.supporters && c.supporters.includes(user.value._id)))
          })
        }
      })
    }
  })
})
</script>
