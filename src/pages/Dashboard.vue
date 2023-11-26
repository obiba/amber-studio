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

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import { metricsService } from '../services/utils'
import { interviewDesignService, campaignService } from '../services/interview'
import studyService from '../services/study'
import AuthMixin from '../mixins/AuthMixin'

export default defineComponent({
  name: 'Dashboard',
  components: {
    DashboardCounts: defineAsyncComponent(() => import('components/dashboard/DashboardCounts'))
  },
  mixins: [AuthMixin],
  data () {
    return {
      counts: {},
      studies: [],
      interviewDesigns: [],
      myCampaigns: []
    }
  },
  mounted () {
    metricsService.getMetrics().then((result) => {
      this.counts = result.counts ? result.counts : {}
    })
    studyService.getStudies().then((result) => {
      this.studies = result.data ? result.data : []
      if (this.studies.length > 0) {
        interviewDesignService.getInterviewDesignsByStudy(this.studyId).then((result) => {
          this.interviewDesigns = result.data ? result.data : []
          if (this.interviewDesigns.length > 0) {
            campaignService.getCampaigns().then((result) => {
              this.myCampaigns = (result.data ? result.data : [])
                .filter((c) => (c.investigators && c.investigators.includes(this.user._id)) || (c.supporters && c.supporters.includes(this.user._id)))
            })
          }
        })
      }
    })
  },
  methods: {
    getCampaignLabel (campaign) {
      return `${this.studies.find(std => std._id === campaign.study).name} / ${this.interviewDesigns.find(itwd => itwd._id === campaign.interviewDesign).name} / ${campaign.name}`
    }
  }
})
</script>
