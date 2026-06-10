<template>
  <q-page>
    <q-toolbar class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs class="q-mr-md">
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="t('studies.title')" to="/studies"/>
        <q-breadcrumbs-el :label="studyStore.study?.name" :to="'/study/' + studyStore.study?._id" />
        <q-breadcrumbs-el :label="t('study.forms')"/>
      </q-breadcrumbs>
    </q-toolbar>
    <q-separator/>

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
import { useStudyStore } from 'src/stores/study'
import { settings } from 'src/boot/settings'

const studyStore = useStudyStore()
const { t } = useI18n()
</script>
