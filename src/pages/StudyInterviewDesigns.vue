<template>
  <q-page>

    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">{{$t('study.interview_designs')}}</div>
      <div class="note note-info text-body2 text-grey-8">
        <span v-html="$t('study.interview_designs_hint')"/>
      </div>
    </div>

    <interview-designs/>

  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    InterviewDesigns: defineAsyncComponent(() => import('src/components/interviews/InterviewDesigns.vue'))
  }
})
</script>
