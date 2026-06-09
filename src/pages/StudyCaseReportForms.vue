<template>
  <q-page>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-sm">{{t('study.case_report_forms')}}</div>
      <div class="text-body2 text-secondary">
        <span v-html="t('study.case_report_forms_hint')"/>
      </div>
    </div>

    <case-report-forms/>

  </q-page>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import CaseReportForms from 'src/components/crfs/CaseReportForms.vue'

const { t } = useI18n()
</script>
