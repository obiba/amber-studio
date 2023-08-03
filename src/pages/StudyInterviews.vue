<template>
  <q-page>

    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">{{$t('study.interview_records')}}</div>
      <div class="note note-info text-body2 text-grey-8">
        <span v-html="$t('study.interview_records_hint')"/>
      </div>
    </div>

    <interviews/>

  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    Interviews: defineAsyncComponent(() => import('src/components/interviews/Interviews.vue'))
  }
})
</script>
