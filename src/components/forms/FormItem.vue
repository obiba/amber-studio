<template>
  <div>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator>
      <q-tab name="design" :label="t('form.design')" />
      <q-tab name="schema" :label="t('form.schema')" />
      <q-tab name="preview" :label="t('form.preview')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
      <q-tab-panel name="design" class="q-pa-none">
        <div v-if="isRoot" class="row q-col-gutter-lg q-pa-md">
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
        <div v-else>
          <div class="q-pa-md bg-grey-2">
            <p class="text-weight-bold q-mb-sm">{{ t('form.definition') }}</p>
            <div class="row q-col-gutter-lg">
              <div class="col-md-6 col-sm-12">
                <q-select class="q-mb-md" v-model="value.type" :options="typeOptions" :label="t('form.type')" :hint="t('form.type_hint')" emit-value map-options :disable="isReadOnly" />
                <q-input class="q-mb-md" v-model="value.name" :label="t('form.name')" :hint="t(isVariable ? 'form.name_hint': 'form.section_hint')" :disable="isReadOnly" />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input class="q-mb-md" v-model="value.label" :label="t('form.label')" :hint="t('form.label_hint')" :disable="isReadOnly" />
                <q-input class="q-mb-md" v-model="value.description" :label="t('form.description')" :hint="t('form.description_hint')" autogrow :disable="isReadOnly" />
              </div>
            </div>
          </div>
          <q-separator />
          <component :is="typeComponent" v-model="value" :read-only="isReadOnly" class="q-pa-md"/>
        </div>
      </q-tab-panel>

      <q-tab-panel name="schema">
        <div class="bg-black text-white q-pa-md">
          <pre>{{ schemaStr }}</pre>
        </div>
      </q-tab-panel>

      <q-tab-panel name="preview">
        <q-card>
          <q-card-section class="bg-grey-3">
            <q-btn-dropdown icon="translate" flat size="sm" :label="locale">
              <q-list>
                <q-item @click="onLocale(loc)" clickable v-close-popup v-for="loc in formLocales" :key="loc">
                  <q-item-section class="text-uppercase">{{ loc }}</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-section>
          <q-separator/>
          <q-card-section v-if="isRoot">
            <div class="text-h6">{{ tr(modelValue.label) }}</div>
            <div v-html="md(tr(modelValue.description))"/>
          </q-card-section>
          <q-separator v-if="isRoot" />
          <q-card-section>
            <div>
              <BlitzForm :key='remountCounter' :schema='blitzarSchema' v-model='modelData' :columnCount='1' gridGap='32px'/>
            </div>
          </q-card-section>
        </q-card>
        <q-card class="q-mt-md" v-if="isVariable">
          <q-card-section class="bg-grey-3">
            <q-btn
              icon="edit"
              flat
              size="sm"
              :label="t('form.preview_data_edit')"
              @click="editModelData()"/>
            <q-btn
              icon="backspace"
              flat
              size="sm"
              :label="t('form.preview_data_clear')"
              @click="clearModelData()"/>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <div class="bg-black text-white q-pa-md">
              <pre>{{ modelDataStr }}</pre>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model='showEditModelData' persistent :maximized="maximizedToggle">
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model="modelDataStrEdit"
            type="textarea"
            autogrow
            rows="10"
            :label="t('form.preview_data')"
            :hint="t('form.preview_data_hint')" />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='onApplyModelData'
            :label="t('apply')"
            type='submit'
            color='primary'
            v-close-popup
          >
           <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import { BlitzForm } from '@blitzar/form'
import { makeBlitzarQuasarSchemaForm, makeSchemaFormTr } from '@obiba/quasar-ui-amber'
import { settings } from '../../boot/settings'
import { useAuth } from 'src/composables/useAuth'
import { useI18n } from 'vue-i18n'

import AutocompleteItem from './items/AutocompleteItem.vue'
import CheckboxGroupItem from './items/CheckboxGroupItem.vue'
import ComputedItem from './items/ComputedItem.vue'
import DateItem from './items/DateItem.vue'
import DateTimeItem from './items/DateTimeItem.vue'
import GroupItem from './items/GroupItem.vue'
import ImageSelectItem from './items/ImageSelectItem.vue'
import MapItem from './items/MapItem.vue'
import NumberItem from './items/NumberItem.vue'
import RadioGroupItem from './items/RadioGroupItem.vue'
import RatingItem from './items/RatingItem.vue'
import SectionItem from './items/SectionItem.vue'
import SelectItem from './items/SelectItem.vue'
import SliderItem from './items/SliderItem.vue'
import TextAreaItem from './items/TextAreaItem.vue'
import TextItem from './items/TextItem.vue'
import TimeItem from './items/TimeItem.vue'
import ToggleItem from './items/ToggleItem.vue'

const props = defineProps(['modelValue', 'i18n'])
const emit = defineEmits(['update:modelValue'])

const { isReadOnly } = useAuth()
const { locale: i18nLocale, t } = useI18n({ useScope: 'global' })

const ccLicenses = [
  {
    value: 'cc-by-40',
    label: 'license.cc_by_40'
  },
  {
    value: 'cc-by-sa-40',
    label: 'license.cc_by_sa_40'
  },
  {
    value: 'cc-by-nc-40',
    label: 'license.cc_by_nc_40'
  },
  {
    value: 'cc-by-nc-sa-40',
    label: 'license.cc_by_nc_sa_40'
  },
  {
    value: 'cc-by_nd-40',
    label: 'license.cc_by_nd_40'
  },
  {
    value: 'cc-by-nc-nd-40',
    label: 'license.cc_by_nc_nd_40'
  },
  {
    value: 'cc-cc0-10',
    label: 'license.cc_cc0_10'
  }
]

const types = [
  'text', 'textarea', 'number',
  'date', 'datetime', 'time',
  'radiogroup', 'checkboxgroup',
  'select', 'autocomplete', 'image-select',
  'slider', 'rating',
  'toggle',
  'section', 'group',
  'computed', 'map'
]

// Refs
const remountCounter = ref(0)
const tab = ref('design')
const modelData = ref({})
const showEditModelData = ref(false)
const modelDataStrEdit = ref('')
const optionsFile = ref(null)
const optionsCount = ref(5)
const imageFile = ref(null)
const areasFile = ref(null)
const areasCount = ref(5)
const locale = ref(i18nLocale.value)
const maximizedToggle = ref(false)

// Computed
const value = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})

const formLocales = computed(() => {
  return props.i18n ? Object.keys(props.i18n).sort().filter(loc => locale.value !== loc) : ['en']
})

const schemaStr = computed(() => {
  const valueToShow = { ...props.modelValue }
  const deleteId = (item) => {
    delete item._id
    if (item.items) {
      item.items.forEach(it => deleteId(it))
    }
  }
  if (valueToShow.name === '.') {
    delete valueToShow.name
  }
  deleteId(valueToShow)
  return JSON.stringify(valueToShow, null, '  ')
})

const modelDataStr = computed(() => {
  return JSON.stringify(modelData.value, null, '  ')
})

const isRoot = computed(() => {
  return props.modelValue.name === '.'
})

const isVariable = computed(() => {
  return ['section', 'group'].includes(props.modelValue.type) !== true
})

const isComputed = computed(() => {
  return props.modelValue.type === 'computed'
})

const isArray = computed(() => {
  return props.modelValue.type === 'checkbox' || props.modelValue.multiple
})

const hasPlaceholder = computed(() => {
  return ['text', 'textarea'].includes(props.modelValue.type)
})

const hasDescriptionClass = computed(() => {
  return !['section', 'group'].includes(props.modelValue.type)
})

const hasPopup = computed(() => {
  return ['date', 'datetime', 'time'].includes(props.modelValue.type)
})

const hasHint = computed(() => {
  return ['text', 'textarea', 'number', 'date', 'datetime', 'time', 'select', 'autocomplete', 'image-select'].includes(props.modelValue.type)
})

const hasMultiple = computed(() => {
  return ['select', 'autocomplete', 'image-select', 'map'].includes(props.modelValue.type)
})

const hasOptions = computed(() => {
  return ['radiogroup', 'checkboxgroup', 'select', 'autocomplete', 'image-select'].includes(props.modelValue.type)
})

const hasImageMap = computed(() => {
  return ['image-select'].includes(props.modelValue.type)
})

const hasGeoMap = computed(() => {
  return ['map'].includes(props.modelValue.type)
})

const hasNumber = computed(() => {
  return ['rating', 'slider'].includes(props.modelValue.type)
})

const layoutOptions = computed(() => {
  return [
    {
      value: 'single',
      label: t('form.single_page')
    },
    {
      value: 'multi',
      label: t('form.multi_steps')
    }
  ]
})

const licenseOptions = computed(() => {
  const licenses = ccLicenses.map(lic => {
    return {
      value: lic.value,
      label: t(lic.label)
    }
  })
  if (settings.licenses) {
    settings.licenses.forEach(lic => licenses.push({
      value: lic.value,
      label: lic.label ? t(lic.label) : t(lic.value)
    }))
  }
  return licenses
})

const typeOptions = computed(() => {
  return types.map(tp => {
    return {
      value: tp,
      label: t('form.types.' + tp)
    }
  }).sort((a, b) => a.label.localeCompare(b.label))
})

const typeComponent = computed(() => {
  switch (value.value.type) {
    case 'text':
      return TextItem
    case 'textarea':
      return TextAreaItem
    case 'number':
      return NumberItem
    case 'date':
      return DateItem
    case 'datetime':
      return DateTimeItem
    case 'time':
      return TimeItem
    case 'radiogroup':
      return RadioGroupItem
    case 'checkboxgroup':
      return CheckboxGroupItem
    case 'select':
      return SelectItem
    case 'autocomplete':
      return AutocompleteItem
    case 'image-select':
      return ImageSelectItem
    case 'slider':
      return SliderItem
    case 'rating':
      return RatingItem
    case 'toggle':
      return ToggleItem
    case 'section':
      return SectionItem
    case 'group':
      return GroupItem
    case 'computed':
      return ComputedItem
    case 'map':
      return MapItem
  }
  return TextItem
})

const blitzarSchema = computed(() => {
  const items = isRoot.value ? [...value.value.items] : [value.value]
  if (isRoot.value) {
    items.splice(0, 0, {
      name: '_id',
      type: 'text',
      label: value.value.idLabel ? value.value.idLabel : 'ID',
      description: value.value.idDescription,
      mask: value.value.idMask,
      validation: value.value.idValidation,
      validationMessage: value.value.idValidationMessage,
      required: true
    })
  }
  const schema = {
    items: items,
    i18n: props.i18n ? props.i18n : {}
  }
  return makeBlitzarQuasarSchemaForm(schema, { locale: locale.value, debug: true })
})

// Watch
watch(() => props.modelValue, () => {
  emit('update:modelValue', props.modelValue)
  optionsCount.value = 5
})

watch(() => props.modelValue?.type, (newValue, oldValue) => {
  if (!hasOptions.value) {
    delete props.modelValue.options
  }
  if (!hasImageMap.value) {
    delete props.modelValue.imageSrc
    delete props.modelValue.imageClass
    delete props.modelValue.showSelect
    delete props.modelValue.areas
  }
  if (!hasGeoMap.value) {
    delete props.modelValue.geometryType
    delete props.modelValue.center
    delete props.modelValue.zoom
    delete props.modelValue.geoLocation
    delete props.modelValue.mapHeight
  }
  if (!hasNumber.value) {
    delete props.modelValue.icon
    delete props.modelValue.size
    delete props.modelValue.color
    delete props.modelValue.min
    delete props.modelValue.max
  }
  if (!hasPlaceholder.value) {
    delete props.modelValue.placeholder
  }
  if (!hasHint.value) {
    delete props.modelValue.hint
  }
  if (!hasPopup.value) {
    delete props.modelValue.closeLabel
  }
  if (!hasMultiple.value) {
    delete props.modelValue.multiple
  }
  if (!isComputed.value) {
    delete props.modelValue.compute
  }
  if (!isVariable.value) {
    delete props.modelValue.required
    delete props.modelValue.validation
    delete props.modelValue.validationMessage
    delete props.modelValue.mask
    delete props.modelValue.default
    delete props.modelValue.options
    delete props.modelValue.newValue
  }
})

watch(() => props.modelValue?.default, (newValue, oldValue) => {
  if (newValue === '') {
    delete props.modelValue.default
  }
  modelData.value = isArray.value ? (props.modelValue.default ? [props.modelValue.default] : []) : props.modelValue.default
})

// Methods
function tr (key) {
  return makeSchemaFormTr({ i18n: props.i18n ? props.i18n : {} }, { locale: locale.value })(key)
}

function md (text) {
  return text ? marked.parse(tr(text), { headerIds: false, mangle: false }) : text
}

function onLocale (newLocale) {
  locale.value = newLocale
}

function editModelData () {
  modelDataStrEdit.value = modelDataStr.value
  showEditModelData.value = true
}

function onApplyModelData () {
  try {
    modelData.value = JSON.parse(modelDataStrEdit.value)
    showEditModelData.value = false
    remountCounter.value++
  } catch (e) {
    console.error(e)
  }
}

function clearModelData () {
  modelData.value = {}
  remountCounter.value++
}
</script>
