<template>
  <q-page>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-md">{{$t('study.forms')}}</div>
      <div class="note note-info text-body2 text-secondary">
        <span v-html="$t('study.forms_hint')"/>
      </div>
    </div>

    <forms/>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Forms from 'components/forms/Forms.vue'

export default defineComponent({
  components: {
    Forms
  }
})
</script>
