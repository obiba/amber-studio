<template>
  <q-page>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-md">{{ $t('study.dashboard') }}</div>
      <div v-if="myCampaigns.length" class="q-mb-md">
        <div class="text-h6 q-mb-md">{{ $t('study.my_campaigns') }}</div>
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
        <div class="text-h6 q-mb-md">{{ $t('study.metrics') }}</div>
        <dashboard-counts v-if="!isGuest" :counts="counts"/>
      </div>
      <div v-else>
        <div class="note note-info text-body2 text-secondary">
          <div v-if="hasForms">
            <div>{{ $t('study.form_use') }}</div>
            <q-btn
              v-if="hasCaseReportService"
              color="primary"
              icon-right="arrow_forward"
              :label="$t('study.case_report_forms')"
              :to="`/study/${this.studyId}/case-report-forms`"
              class="q-mt-md q-mr-md" />
            <q-btn
              v-if="hasInterviewService"
              color="primary"
              icon-right="arrow_forward"
              :label="$t('study.interview_designs')"
              :to="`/study/${this.studyId}/interview-designs`"
              class="q-mt-md" />
          </div>
          <div v-else class="q-mt-md">
            <div>{{ $t('study.form_create') }}</div>
            <q-btn
              color="primary"
              icon-right="arrow_forward"
              :label="$t('study.forms')"
              :to="`/study/${this.studyId}/forms`"
              class="q-mt-md" />
          </div>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import { mapState } from 'vuex'
import { metricsService } from '../services/utils'
import { interviewDesignService, campaignService } from '../services/interview'
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
    ...mapState({
      study: state => state.study.study
    }),
    studyId () {
      return this.$route.params.id
    },
    hasMetrics () {
      return (this.counts.case_reports_agg && this.counts.case_reports_agg.length) ||
        (this.counts.interviews_agg && this.counts.interviews_agg.length)
    },
    hasForms () {
      return this.counts.forms > 0
    },
    hasCaseReportService () {
      return this.study && (!this.study.services || this.study.services.length === 0 || this.study.services?.includes('case-reports'))
    },
    hasInterviewService () {
      return this.study && (!this.study.services || this.study.services.length === 0 || this.study.services?.includes('interviews'))
    }
  },
  methods: {
    getCampaignLabel (campaign) {
      return `${this.interviewDesigns.find(itwd => itwd._id === campaign.interviewDesign).name} / ${campaign.name}`
    }
  }
})
</script>
