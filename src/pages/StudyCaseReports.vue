<template>
  <q-page>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-md">{{$t('study.case_report_records')}}</div>
      <div class="note note-info text-body2 text-secondary">
        <span v-html="$t('study.case_report_records_hint')"/>
      </div>
    </div>

    <case-reports/>

  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    CaseReports: defineAsyncComponent(() => import('src/components/crfs/CaseReports.vue'))
  }
})
</script>
