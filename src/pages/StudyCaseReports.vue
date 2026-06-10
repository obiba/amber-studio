<template>
  <q-page>
    <q-toolbar class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs class="q-mr-md">
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="t('studies.title')" to="/studies"/>
        <q-breadcrumbs-el :label="studyStore.study?.name" :to="'/study/' + studyStore.study?._id" />
        <q-breadcrumbs-el :label="t('study.case_reports')"/>
      </q-breadcrumbs>
    </q-toolbar>
    <q-separator/>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-md">{{t('study.case_report_records')}}</div>
      <div class="text-body2 text-secondary">
        <span v-html="t('study.case_report_records_hint')"/>
      </div>
    </div>

    <case-reports/>

  </q-page>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import CaseReports from 'src/components/crfs/CaseReports.vue'
import { useStudyStore } from 'src/stores/study'
import { settings } from 'src/boot/settings'

const studyStore = useStudyStore()
const { t } = useI18n()
</script>
