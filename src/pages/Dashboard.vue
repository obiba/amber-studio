<template>
  <q-page class="q-pa-sm">
    <dashboard-counts :counts="counts"/>
    <card-charts/>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import metricsService from '../services/metrics'

export default defineComponent({
  name: 'Dashboard',
  components: {
    DashboardCounts: defineAsyncComponent(() => import('components/dashboard/DashboardCounts')),
    CardCharts: defineAsyncComponent(() => import('components/cards/CardCharts'))
  },
  data () {
    return {
      counts: {}
    }
  },
  mounted () {
    metricsService.getMetrics().then((result) => {
      this.counts = result.counts ? result.counts : {}
    })
  }
})
</script>
