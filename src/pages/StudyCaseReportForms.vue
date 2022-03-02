<template>
  <q-page>

    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">{{$t('study.case_report_forms')}}</div>
      <div class="text-body2 text-grey-8">{{$t('study.case_report_forms_hint')}}</div>
    </div>

    <study-case-report-forms/>

  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    StudyCaseReportForms: defineAsyncComponent(() => import('src/components/forms/StudyCaseReportForms.vue'))
  }
})
</script>
