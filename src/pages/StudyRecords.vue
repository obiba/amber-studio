<template>
  <q-page>

    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">{{$t('study.records')}}</div>
      <div class="note note-info text-body2 text-grey-8">
        <span v-html="$t('study.records_hint')"/>
      </div>
    </div>

    <study-case-reports/>

  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    StudyCaseReports: defineAsyncComponent(() => import('src/components/forms/StudyCaseReports.vue'))
  }
})
</script>
