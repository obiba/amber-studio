<template>
  <q-page>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-md">{{$t('study.interview_records')}}</div>
      <div class="note note-info text-body2 text-secondary">
        <span v-html="$t('study.interview_records_hint')"/>
      </div>
    </div>

    <interviews/>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Interviews from 'src/components/interviews/Interviews.vue'

export default defineComponent({
  components: {
    Interviews
  }
})
</script>
