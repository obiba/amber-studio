<template>
  <div>
    <q-file
      v-model="importFile"
      :label="t('study.import_interview_design')"
      :hint="t('study.import_interview_design_hint')"
      :error="importError"
      :error-message="t('study.import_interview_design_invalid')"
      accept=".json"
      clearable
    />
    <div v-if="importMappings.length > 0" class="q-mt-lg">
      <div class="text-body2 q-mb-sm">{{ t('study.import_interview_design_forms') }}</div>
      <div v-for="mapping in importMappings" :key="mapping.key" class="row q-col-gutter-sm items-center">
        <div class="col-4 text-caption" :title="t('study.import_source_form')">
          {{ mapping.formName || '?' }} {{ mapping.revision ? '@' + mapping.revision : '' }}
        </div>
        <div class="col-5">
          <q-select
            v-model="mapping.targetForm"
            :options="importFormOptions"
            emit-value
            map-options
            dense
            :label="t('study.form')"
            @update:model-value="updateMappingRevisions(mapping, null)" />
        </div>
        <div class="col-3">
          <q-select
            v-model="mapping.targetRevision"
            :options="mapping.revisionOptions"
            emit-value
            map-options
            dense
            :label="t('study.form_revision')"
            :disable="!mapping.targetForm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { formRevisionService } from '../../services/form'
import { EXPORT_FORMAT, getStudyForms } from '../../utils/interviewDesign'

// model: undefined when no file, null when the file is invalid or forms are not all linked,
// otherwise the imported design with steps linked to the forms of this study
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const route = useRoute()

const importFile = ref(null)
const importData = ref(null)
const importError = ref(false)
const importMappings = ref([])
const importFormOptions = ref([])

const studyId = computed(() => route.params.id)

const imported = computed(() => {
  if (!importFile.value) return undefined
  if (!importData.value || importMappings.value.some(m => !m.targetForm)) return null
  const steps = importData.value.steps.map(({ formName, ...step }) => {
    const mapping = importMappings.value.find(m => m.key === mappingKey(formName, step.revision))
    const linked = { ...step, form: mapping.targetForm, revision: mapping.targetRevision }
    // latest revision is expressed by the absence of revision
    if (linked.revision === null) delete linked.revision
    return linked
  })
  const { format, version, ...design } = importData.value
  return { ...design, steps, i18n: design.i18n || {} }
})

function mappingKey (formName, revision) {
  return `${formName}@${revision ?? ''}`
}

async function updateMappingRevisions (mapping, revision) {
  mapping.revisionOptions = []
  mapping.targetRevision = null
  if (!mapping.targetForm) return
  const response = await formRevisionService.getFormRevisionsDigest(studyId.value, mapping.targetForm)
  const revisions = (response.data || []).map(rev => rev.revision)
  mapping.revisionOptions = [{ value: null, label: t('study.latest_revision') }, ...revisions.map(rev => ({ value: rev, label: rev }))]
  // same revision if it exists on this platform, latest otherwise
  mapping.targetRevision = revisions.includes(revision) ? revision : null
}

async function readImportFile (file) {
  importData.value = null
  importError.value = false
  importMappings.value = []
  if (!file) return
  let data
  try {
    data = JSON.parse(await file.text())
    if (data.format !== EXPORT_FORMAT || !Array.isArray(data.steps)) throw new Error('invalid format')
  } catch (err) {
    importError.value = true
    return
  }
  const forms = await getStudyForms(studyId.value)
  importFormOptions.value = forms.map(f => ({ value: f._id, label: f.name }))
  const mappings = {}
  data.steps.forEach(step => {
    const key = mappingKey(step.formName, step.revision)
    if (!mappings[key]) {
      mappings[key] = {
        key,
        formName: step.formName,
        revision: step.revision,
        targetForm: forms.find(f => f.name === step.formName)?._id || null,
        targetRevision: null,
        revisionOptions: []
      }
    }
  })
  importMappings.value = Object.values(mappings)
  await Promise.all(importMappings.value.map(m => updateMappingRevisions(m, m.revision)))
  importData.value = data
}

watch(importFile, readImportFile)
watch(imported, val => emit('update:modelValue', val), { immediate: true })
</script>
