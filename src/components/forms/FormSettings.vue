<template>
  <div class="row q-col-gutter-lg q-pa-md">
    <div class="col-md-6 col-sm-12">
      <p class="text-weight-bold q-mb-sm">{{ t('form.definition') }}</p>
      <q-input class="q-mb-md" v-model="value.label" :label="t('form.title')" :hint="t('form.form_title_hint')" :disable="isReadOnly" />
      <q-input class="q-mb-md" v-model="value.description" :label="t('form.description')" :hint="t('form.form_description_hint')" autogrow :disable="isReadOnly" />
      <q-input class="q-mb-md" v-model="value.copyright" :label="t('form.copyright')" :hint="t('form.form_copyright_hint')" :disable="isReadOnly" />
      <q-select class="q-mb-md" v-model="value.license" :options="licenseOptions" :label="t('form.license')" :hint="t('form.form_license_hint')" emit-value map-options :disable="isReadOnly" />
      <div v-html="t('form.form_license_cc')" class="text-caption text-grey-7 q-mb-md"/>
      <q-select class="q-mb-md" v-model="value.layout" :options="layoutOptions" :label="t('form.layout')" :hint="t('form.layout_hint')" emit-value map-options :disable="isReadOnly" />
    </div>
    <div class="col-md-6 col-sm-12">
      <p class="text-weight-bold q-mb-sm">{{ t('form.settings') }}</p>
      <q-input class="q-mb-md" v-model="value.idLabel" :label="t('form.id_label')" :hint="t('form.id_label_hint')" :disable="isReadOnly" />
      <q-input class="q-mb-md" v-model="value.idDescription" :label="t('form.id_description')" :hint="t('form.id_description_hint')" autogrow :disable="isReadOnly" />
      <q-input class="q-mb-md" v-model.number="value.idMask" :label="t('form.id_mask')" :hint="t('form.mask_hint')" :disable="isReadOnly" />
      <q-input class="q-mb-md" v-model="value.idValidation" :label="t('form.id_validation')" :hint="t('form.id_validation_hint')" :disable="isReadOnly" />
      <q-input class="q-mb-md" v-model="value.idValidationMessage" :label="t('form.id_validation_message')" :hint="t('form.validation_message_hint')" :disable="isReadOnly" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { settings } from '../../boot/settings'
import { useAuth } from '@/composables/useAuth'

// the form-level settings of a form schema, in either format
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const { isReadOnly } = useAuth()
const { t } = useI18n({ useScope: 'global' })

const ccLicenses = [
  { value: 'cc-by-40', label: 'license.cc_by_40' },
  { value: 'cc-by-sa-40', label: 'license.cc_by_sa_40' },
  { value: 'cc-by-nc-40', label: 'license.cc_by_nc_40' },
  { value: 'cc-by-nc-sa-40', label: 'license.cc_by_nc_sa_40' },
  { value: 'cc-by_nd-40', label: 'license.cc_by_nd_40' },
  { value: 'cc-by-nc-nd-40', label: 'license.cc_by_nc_nd_40' },
  { value: 'cc-cc0-10', label: 'license.cc_cc0_10' }
]

const value = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})

const layoutOptions = computed(() => [
  { value: 'single', label: t('form.single_page') },
  { value: 'multi', label: t('form.multi_steps') }
])

const licenseOptions = computed(() => {
  const licenses = ccLicenses.map(lic => ({ value: lic.value, label: t(lic.label) }))
  if (settings.licenses) {
    settings.licenses.forEach(lic => licenses.push({
      value: lic.value,
      label: lic.label ? t(lic.label) : t(lic.value)
    }))
  }
  return licenses
})
</script>
