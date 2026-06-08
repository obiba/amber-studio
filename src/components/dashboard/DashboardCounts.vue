<template>
  <div class="q-mb-md">
    <div v-if="items.length>0" class="row q-col-gutter-sm q-mb-md">
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
              <router-link v-if="item.link" class="text-white" :to="item.link">{{ t(item.title) }}</router-link>
              <span v-else>{{ t(item.title) }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
    <div class="row q-col-gutter-sm q-mb-md">
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
                  <router-link v-if="item.link" class="text-white" :to="item.link">{{ t(item.title) }}</router-link>
                  <span v-else>{{ t(item.title) }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
        <records-chart
          chartId="case-reports"
          :title="t('chart.cumulated_case_reports')"
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
                  <router-link v-if="item.link" class="text-white" :to="item.link">{{ t(item.title) }}</router-link>
                  <span v-else>{{ t(item.title) }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
        <records-chart
          chartId="interviews"
          :title="t('chart.cumulated_interviews')"
          :aggregations="interviews_aggregations"/>
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

const case_reports_aggregations = computed(() => {
  return props.counts && props.counts.case_reports_agg ? props.counts.case_reports_agg : []
})

const interviews_aggregations = computed(() => {
  return props.counts && props.counts.interviews_agg ? props.counts.interviews_agg : []
})

const items = computed(() => {
  const cards = []
  if (isAdministrator.value) {
    if (props.counts.users !== undefined && props.counts.groups !== undefined) {
      cards.push({
        title: 'users.title',
        icon: 'person',
        value: props.counts.users ? props.counts.users : '-',
        color1: '#5064b5',
        color2: '#3e51b5',
        link: '/users'
      },
      {
        title: 'groups.title',
        icon: 'people',
        value: props.counts.groups ? props.counts.groups : '-',
        color1: '#5064b5',
        color2: '#3e51b5',
        link: '/groups'
      })
    }
  }
  if (props.counts.studies !== undefined) {
    cards.push({
      title: 'studies.title',
      icon: 'inventory',
      value: props.counts.studies ? props.counts.studies : '-',
      color1: '#f37169',
      color2: '#f34636',
      link: '/studies'
    })
  }
  if (props.counts.forms !== undefined) {
    cards.push(
      {
        title: 'study.forms',
        icon: 'speaker_notes',
        value: props.counts.forms ? props.counts.forms : '-',
        color1: '#ea6a7f',
        color2: '#ea4b64'
      })
  }
  return cards
})

const caseReportItems = computed(() => {
  const cards = [
    {
      title: 'study.case_report_forms',
      icon: 'ballot',
      value: props.counts.case_report_forms ? props.counts.case_report_forms : '-',
      color1: '#a270b1',
      color2: '#9f52b1'
    },
    {
      title: 'study.case_reports',
      icon: 'bar_chart',
      value: props.counts.case_reports ? props.counts.case_reports : '-',
      color1: '#a270b1',
      color2: '#9f52b1'
    }
  ]
  return cards
})

const interviewItems = computed(() => {
  const cards = [
    {
      title: 'study.interview_designs',
      icon: 'ballot',
      value: props.counts.interview_designs ? props.counts.interview_designs : '-',
      color1: '#a270b1',
      color2: '#9f52b1'
    },
    {
      title: 'study.interviews',
      icon: 'bar_chart',
      value: props.counts.interviews ? props.counts.interviews : '-',
      color1: '#a270b1',
      color2: '#9f52b1'
    }
  ]
  return cards
})
</script>
