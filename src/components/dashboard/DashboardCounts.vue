<template>
  <div class="q-mb-md">
    <div class="row q-col-gutter-sm">
      <div v-for="(item, index) in items" :key="index" class="col-sm-6 col-xs-12" :class="isAdministrator ? 'col-md-2' : 'col-md-3'">
        <q-item :style="`background-color: ${item.color1}`" class="q-pa-none">
          <q-item-section side :style="`background-color: ${item.color2}`"
                          class=" q-pa-lg q-mr-none text-white">
            <router-link v-if="item.link" class="text-white" :to="item.link">
              <q-icon :name="item.icon" color="white" size="24px"></q-icon>
            </router-link>
            <q-icon v-else :name="item.icon" color="white" size="24px"></q-icon>
          </q-item-section>
          <q-item-section class=" q-pa-md q-ml-none text-white">
            <q-item-label class="text-white text-h6 text-weight-bolder">
              <router-link v-if="item.link" class="text-white" :to="item.link">{{ item.value }}</router-link>
              <span v-else>{{ item.value }}</span>
            </q-item-label>
            <q-item-label>
              <router-link v-if="item.link" class="text-white" :to="item.link">{{ $t(item.title) }}</router-link>
              <span v-else>{{ $t(item.title) }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
    <div class="row q-col-gutter-sm q-mt-md q-mb-md">
      <div v-if="case_reports_aggregations.length>0" class="col-md-6 col-sm-12 col-xs-12">
        <div class="row q-col-gutter-sm q-mb-md">
          <div v-for="(item, index) in caseReportItems" :key="index" class="col-md-6 col-sm-6 col-xs-12">
            <q-item :style="`background-color: ${item.color1}`" class="q-pa-none">
              <q-item-section side :style="`background-color: ${item.color2}`"
                              class=" q-pa-lg q-mr-none text-white">
                <router-link v-if="item.link" class="text-white" :to="item.link">
                  <q-icon :name="item.icon" color="white" size="24px"></q-icon>
                </router-link>
                <q-icon v-else :name="item.icon" color="white" size="24px"></q-icon>
              </q-item-section>
              <q-item-section class=" q-pa-md q-ml-none text-white">
                <q-item-label class="text-white text-h6 text-weight-bolder">
                  <router-link v-if="item.link" class="text-white" :to="item.link">{{ item.value }}</router-link>
                  <span v-else>{{ item.value }}</span>
                </q-item-label>
                <q-item-label>
                  <router-link v-if="item.link" class="text-white" :to="item.link">{{ $t(item.title) }}</router-link>
                  <span v-else>{{ $t(item.title) }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
        <records-chart
          chartId="case-reports"
          :title="$t('chart.cumulated_case_reports')"
          :aggregations="case_reports_aggregations"/>
      </div>
      <div v-if="interviews_aggregations.length>0" class="col-md-6 col-sm-12 col-xs-12">
        <div class="row q-col-gutter-sm q-mb-md">
          <div v-for="(item, index) in interviewItems" :key="index" class="col-md-6 col-sm-6 col-xs-12">
            <q-item :style="`background-color: ${item.color1}`" class="q-pa-none">
              <q-item-section side :style="`background-color: ${item.color2}`"
                              class=" q-pa-lg q-mr-none text-white">
                <router-link v-if="item.link" class="text-white" :to="item.link">
                  <q-icon :name="item.icon" color="white" size="24px"></q-icon>
                </router-link>
                <q-icon v-else :name="item.icon" color="white" size="24px"></q-icon>
              </q-item-section>
              <q-item-section class=" q-pa-md q-ml-none text-white">
                <q-item-label class="text-white text-h6 text-weight-bolder">
                  <router-link v-if="item.link" class="text-white" :to="item.link">{{ item.value }}</router-link>
                  <span v-else>{{ item.value }}</span>
                </q-item-label>
                <q-item-label>
                  <router-link v-if="item.link" class="text-white" :to="item.link">{{ $t(item.title) }}</router-link>
                  <span v-else>{{ $t(item.title) }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
        <records-chart
          chartId="interviews"
          :title="$t('chart.cumulated_interviews')"
          :aggregations="interviews_aggregations"/>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import AuthMixin from '../../mixins/AuthMixin'

export default defineComponent({
  name: 'DashboardCounts',
  props: {
    counts: {
      type: Object,
      required: false
    }
  },
  components: {
    RecordsChart: defineAsyncComponent(() => import('components/dashboard/RecordsChart'))
  },
  mixins: [AuthMixin],
  computed: {
    case_reports_aggregations () {
      return this.counts && this.counts.case_reports_agg ? this.counts.case_reports_agg : []
    },
    interviews_aggregations () {
      return this.counts && this.counts.interviews_agg ? this.counts.interviews_agg : []
    },
    items () {
      const cards = []
      if (this.isAdministrator) {
        cards.push({
          title: 'users.title',
          icon: 'person',
          value: this.counts.users ? this.counts.users : '-',
          color1: '#5064b5',
          color2: '#3e51b5',
          link: '/users'
        },
        {
          title: 'groups.title',
          icon: 'people',
          value: this.counts.groups ? this.counts.groups : '-',
          color1: '#5064b5',
          color2: '#3e51b5',
          link: '/groups'
        })
      }
      cards.push(
        {
          title: 'studies.title',
          icon: 'inventory',
          value: this.counts.studies ? this.counts.studies : '-',
          color1: '#f37169',
          color2: '#f34636',
          link: '/studies'
        },
        {
          title: 'study.forms',
          icon: 'speaker_notes',
          value: this.counts.forms ? this.counts.forms : '-',
          color1: '#ea6a7f',
          color2: '#ea4b64'
        })
      return cards
    },
    caseReportItems () {
      const cards = [
        {
          title: 'study.case_report_forms',
          icon: 'ballot',
          value: this.counts.case_report_forms ? this.counts.case_report_forms : '-',
          color1: '#a270b1',
          color2: '#9f52b1'
        },
        {
          title: 'study.case_reports',
          icon: 'bar_chart',
          value: this.counts.case_reports ? this.counts.case_reports : '-',
          color1: '#a270b1',
          color2: '#9f52b1'
        }
      ]
      return cards
    },
    interviewItems () {
      const cards = [
        {
          title: 'study.interview_designs',
          icon: 'ballot',
          value: this.counts.interview_designs ? this.counts.interview_designs : '-',
          color1: '#a270b1',
          color2: '#9f52b1'
        },
        {
          title: 'study.interviews',
          icon: 'bar_chart',
          value: this.counts.interviews ? this.counts.interviews : '-',
          color1: '#a270b1',
          color2: '#9f52b1'
        }
      ]
      return cards
    }
  }
})
</script>
