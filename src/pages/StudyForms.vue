<template>
  <q-page>

    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">{{$t('study.forms')}}</div>
      <div class="text-body2 text-grey-8">{{$t('study.forms_hint')}}</div>
    </div>

    <study-forms/>

  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    StudyForms: defineAsyncComponent(() => import('components/forms/StudyForms.vue'))
  }
})
</script>
