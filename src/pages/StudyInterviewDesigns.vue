<template>
  <q-page>

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

const { t } = useI18n()
</script>
