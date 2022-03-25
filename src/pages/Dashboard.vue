<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">{{$t('main.dashboard')}}</div>
    <dashboard-counts v-if="!isGuest" :counts="counts" class="q-mb-md"/>
    <q-btn color="primary" :label="$t('main.my_profile')" icon="person" to="/account"/>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import { metricsService } from '../services/utils'
import AuthMixin from '../mixins/AuthMixin'

export default defineComponent({
  name: 'Dashboard',
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
    metricsService.getMetrics().then((result) => {
      this.counts = result.counts ? result.counts : {}
    })
  }
})
</script>
