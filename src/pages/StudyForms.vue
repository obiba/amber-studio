<template>
  <q-page>

    <div class="q-ma-md">
      <div class="text-h5 q-mb-sm">{{t('study.forms')}}</div>
      <div class="text-body2 text-secondary">
        <span v-html="t('study.forms_hint')"/>
      </div>
    </div>

    <forms/>

  </q-page>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Forms from 'src/components/forms/Forms.vue'

const { t } = useI18n()
</script>
