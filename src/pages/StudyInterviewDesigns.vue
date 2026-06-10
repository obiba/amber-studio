<template>
  <q-page>
    <q-toolbar class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs class="q-mr-md">
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="t('studies.title')" to="/studies"/>
        <q-breadcrumbs-el :label="studyStore.study?.name" :to="'/study/' + studyStore.study?._id" />
        <q-breadcrumbs-el :label="t('study.interview_designs')"/>
      </q-breadcrumbs>
    </q-toolbar>
    <q-separator/>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-sm">{{t('study.interview_designs')}}</div>
      <div class="note note-info text-body2 text-secondary">
        <span v-html="t('study.interview_designs_hint')"/>
      </div>
    </div>

    <interview-designs/>

  </q-page>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import InterviewDesigns from 'src/components/interviews/InterviewDesigns.vue'
import { useStudyStore } from 'src/stores/study'
import { settings } from 'src/boot/settings'

const studyStore = useStudyStore()
const { t } = useI18n()
</script>
