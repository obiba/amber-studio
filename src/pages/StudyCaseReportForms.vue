<template>
  <q-page>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-md">{{$t('study.case_report_forms')}}</div>
      <div class="note note-info text-body2 text-secondary">
        <span v-html="$t('study.case_report_forms_hint')"/>
      </div>
    </div>

    <case-report-forms/>

  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    CaseReportForms: defineAsyncComponent(() => import('src/components/crfs/CaseReportForms.vue'))
  }
})
</script>
