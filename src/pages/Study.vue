<template>
  <q-page>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-md">{{ $t('study.dashboard') }}</div>
      <div v-if="myCampaigns.length" class="q-mb-md">
        <div class="text-h6 q-mb-md">{{ $t('study.my_campaigns') }}</div>
        <div v-for="campaign in myCampaigns" :key="campaign._id" class="q-mb-md">
          <q-btn
            color="primary"
            icon-right="arrow_forward"
            :to="`/study/${studyId}/interview-design/${campaign.interviewDesign}?c=${campaign._id}`">{{ getCampaignLabel(campaign) }}
          </q-btn>
        </div>
      </div>
      <div v-if="hasMetrics">
        <div class="text-h6 q-mb-md">{{ $t('study.metrics') }}</div>
        <dashboard-counts v-if="!isGuest" :counts="counts"/>
      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import { metricsService } from '../services/utils'
import { interviewDesignService, campaignService } from 'src/services/interview'
import AuthMixin from '../mixins/AuthMixin'

export default defineComponent({
  name: 'Study',
  components: {
    DashboardCounts: defineAsyncComponent(() => import('components/dashboard/DashboardCounts'))
  },
  mixins: [AuthMixin],
  data () {
    return {
      counts: {},
      interviewDesigns: [],
      myCampaigns: []
    }
  },
  mounted () {
    metricsService.getMetrics({
      type: 'study',
      query: {
        form: {
          study: this.studyId
        },
        'case-report-form': {
          study: this.studyId
        },
        'interview-design': {
          study: this.studyId
        },
        'case-report': {
          study: this.studyId
        },
        interview: {
          study: this.studyId
        }
      }
    }).then((result) => {
      this.counts = result.counts ? result.counts : {}
    })
    interviewDesignService.getInterviewDesignsByStudy(this.studyId).then((result) => {
      this.interviewDesigns = result.data ? result.data : []
      if (this.interviewDesigns.length > 0) {
        campaignService.getCampaignsByStudy(this.studyId).then((result) => {
          this.myCampaigns = (result.data ? result.data : [])
            .filter((c) => (c.investigators && c.investigators.includes(this.user._id)) || (c.supporters && c.supporters.includes(this.user._id)))
        })
      }
    })
  },
  computed: {
    studyId () {
      return this.$route.params.id
    },
    hasMetrics () {
      return (this.counts.case_reports_agg && this.counts.case_reports_agg.length) ||
        (this.counts.interviews_agg && this.counts.interviews_agg.length)
    }
  },
  methods: {
    getCampaignLabel (campaign) {
      return `${this.interviewDesigns.find(itwd => itwd._id === campaign.interviewDesign).name} - ${campaign.name}`
    }
  }
})
</script>
