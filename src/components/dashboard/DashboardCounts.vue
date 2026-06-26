<template>
  <div class="q-mb-md">
    <q-item-label v-if="caseReportsAggregations.length>0" header class="text-uppercase q-pl-none">{{ t('study_design') }}</q-item-label>
    <div v-if="caseReportsAggregations.length>0" class="items-grid-4 q-mb-md">
      <div v-for="(item, index) in studyItems" :key="index">
        <q-list bordered class="rounded-borders">
          <q-item class="q-pa-none">
            <q-item-section avatar>
              <div class="q-ml-md q-pa-md bg-light-blue-1 rounded-borders">
                <router-link v-if="item.link" :to="item.link">
                  <q-icon :name="item.icon" color="light-blue" size="24px"></q-icon>
                </router-link>
                <q-icon v-else :name="item.icon" color="light-blue" size="24px"></q-icon>
              </div>
            </q-item-section>
            <q-item-section class="q-py-md q-pr-md q-ml-none text-grey-9">
              <q-item-label class="text-h4 text-weight-bolder">
                <router-link v-if="item.link" class="text-grey-9" :to="item.link">{{ item.value }}</router-link>
                <span v-else>{{ item.value }}</span>
              </q-item-label>
              <q-item-label>
                <router-link v-if="item.link" class="text-grey-9" :to="item.link">{{ t(item.title) }}</router-link>
                <span v-else>{{ t(item.title) }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <q-item-label v-if="collectedDataItems.length > 0" header class="text-uppercase q-pl-none">{{ t('collected_data') }}</q-item-label>
    <div v-if="collectedDataItems.length > 0" class="q-mb-md" :class="`items-grid-${collectedDataItems.length}`">
      <div v-for="(item, index) in collectedDataItems" :key="index">
        <q-list bordered class="rounded-borders">
          <q-item class="q-pa-none">
            <q-item-section avatar>
              <div class="q-ml-md q-pa-md bg-light-blue-1 rounded-borders">
                <router-link v-if="item.link" :to="item.link">
                  <q-icon :name="item.icon" color="light-blue" size="24px"></q-icon>
                </router-link>
                <q-icon v-else :name="item.icon" color="light-blue" size="24px"></q-icon>
              </div>
            </q-item-section>
            <q-item-section class="q-py-md q-pr-md q-ml-none text-grey-9">
              <q-item-label class="text-h4 text-weight-bolder">
                <router-link v-if="item.link" class="text-grey-9" :to="item.link">{{ item.value }}</router-link>
                <span v-else>{{ item.value }}</span>
              </q-item-label>
              <q-item-label>
                <router-link v-if="item.link" class="text-grey-9" :to="item.link">{{ t(item.title) }}</router-link>
                <span v-else>{{ t(item.title) }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <div v-if="collectedDataItems.length > 0" class="q-mb-md" :class="`items-grid-${collectedDataItems.length}`">
      <records-chart
        v-if="caseReportsAggregations.length>0"
        chartId="case-reports"
        :title="t('chart.cumulated_case_reports')"
        :aggregations="caseReportsAggregations"/>
      <records-chart
        v-if="interviewsAggregations.length>0"
        chartId="interviews"
        :title="t('chart.cumulated_interviews')"
        :aggregations="interviewsAggregations"/>
    </div>
    <q-item-label v-if="accessItems.length>0" header class="text-uppercase q-pl-none">{{ t('access') }}</q-item-label>
    <div v-if="accessItems.length>0" class="items-grid-4 q-mb-md">
      <div v-for="(item, index) in accessItems" :key="index">
        <q-list bordered class="rounded-borders">
          <q-item class="q-pa-none">
            <q-item-section avatar>
              <div class="q-ml-md q-pa-md bg-light-blue-1 rounded-borders">
                <router-link v-if="item.link" :to="item.link">
                  <q-icon :name="item.icon" color="light-blue" size="sm"></q-icon>
                </router-link>
                <q-icon v-else :name="item.icon" color="light-blue" size="sm"></q-icon>
              </div>
            </q-item-section>
            <q-item-section class="q-py-md q-pr-md q-ml-none text-grey-9">
              <q-item-label class="text-h4 text-weight-bolder">
                <router-link v-if="item.link" class="text-grey-9" :to="item.link">{{ item.value }}</router-link>
                <span v-else>{{ item.value }}</span>
              </q-item-label>
              <q-item-label>
                <router-link v-if="item.link" class="text-grey-9" :to="item.link">{{ t(item.title) }}</router-link>
                <span v-else>{{ t(item.title) }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from 'src/composables/useAuth'
import RecordsChart from 'src/components/dashboard/RecordsChart.vue'

const { t } = useI18n()

const props = defineProps({
  counts: {
    type: Object,
    required: false
  }
})

const { isAdministrator } = useAuth()

const caseReportsAggregations = computed(() => {
  return props.counts && props.counts.case_reports_agg ? props.counts.case_reports_agg : []
})

const interviewsAggregations = computed(() => {
  return props.counts && props.counts.interviews_agg ? props.counts.interviews_agg : []
})

const accessItems = computed(() => {
  const cards = []
  if (isAdministrator.value) {
    if (props.counts.users !== undefined && props.counts.groups !== undefined) {
      cards.push({
        title: 'users.title',
        icon: 'person',
        value: props.counts.users ? props.counts.users : '-',
        link: '/users'
      },
      {
        title: 'groups.title',
        icon: 'people',
        value: props.counts.groups ? props.counts.groups : '-',
        link: '/groups'
      })
    }
  }
  return cards
})

const studyItems = computed(() => {
  const cards = []
  if (props.counts.studies !== undefined) {
    cards.push({
      title: 'studies.title',
      icon: 'inventory',
      value: props.counts.studies ? props.counts.studies : '-',
      link: '/studies'
    })
  }
  if (props.counts.forms !== undefined) {
    cards.push(
      {
        title: 'study.forms',
        icon: 'speaker_notes',
        value: props.counts.forms ? props.counts.forms : '-'
      })
  }
  cards.push(
    {
      title: 'study.case_report_forms',
      icon: 'ballot',
      value: props.counts.case_report_forms ? props.counts.case_report_forms : '-'
    })
  cards.push(

    {
      title: 'study.interview_designs',
      icon: 'ballot',
      value: props.counts.interview_designs ? props.counts.interview_designs : '-'
    }
  )
  return cards
})

const collectedDataItems = computed(() => {
  const cards = []
  if (caseReportsAggregations.value.length > 0) {
    cards.push(
      {
        title: 'study.case_reports',
        icon: 'bar_chart',
        value: props.counts.case_reports ? props.counts.case_reports : '-'
      })
  }
  if (interviewsAggregations.value.length > 0) {
    cards.push(
      {
        title: 'study.interviews',
        icon: 'bar_chart',
        value: props.counts.interviews ? props.counts.interviews : '-'
      })
  }
  return cards
})
</script>

<style scoped>
.items-grid-1 {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}
.items-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.items-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
</style>
