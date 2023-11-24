<template>
  <q-page>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-md">{{ $t('study.dashboard') }}</div>
      <dashboard-counts v-if="!isGuest" :counts="counts"/>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import { mapState } from 'vuex'
import { metricsService } from '../services/utils'
import AuthMixin from '../mixins/AuthMixin'

export default defineComponent({
  name: 'Study',
  components: {
    DashboardCounts: defineAsyncComponent(() => import('components/dashboard/DashboardCounts'))
  },
  mixins: [AuthMixin],
  data () {
    return {
      counts: {}
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
  },
  computed: {
    ...mapState({
      study: state => state.study.study
    }),
    studyId () {
      return this.$route.params.id
    }
  }
})
</script>
