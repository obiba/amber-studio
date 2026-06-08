<template>
  <q-page>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-md">{{t('study.case_report_records')}}</div>
      <div class="note note-info text-body2 text-secondary">
        <span v-html="t('study.case_report_records_hint')"/>
      </div>
    </div>

    <case-reports/>

  </q-page>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import CaseReports from 'src/components/crfs/CaseReports.vue'

const { t } = useI18n()
</script>
