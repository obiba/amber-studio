<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">{{$t('main.dashboard')}}</div>
    <div v-if="myCampaigns.length" class="q-mb-md">
      <div class="text-h6 q-mb-md">{{ $t('study.my_campaigns') }}</div>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
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
    <div class="text-h6 q-mb-md">{{ $t('study.metrics') }}</div>
    <dashboard-counts v-if="!isGuest" :counts="counts"/>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { metricsService } from '../services/utils'
import { interviewDesignService, campaignService } from '../services/interview'
import studyService from '../services/study'
import { useAuth } from 'src/composables/useAuth'
import DashboardCounts from 'components/dashboard/DashboardCounts.vue'

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
