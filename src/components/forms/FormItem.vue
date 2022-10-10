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
      <q-tab name="design" :label="$t('form.design')" />
      <q-tab name="schema" :label="$t('form.schema')" />
      <q-tab name="preview" :label="$t('form.preview')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
      <q-tab-panel name="design" class="q-pa-none">
        <div v-if="isRoot" class="row q-col-gutter-lg q-pa-md">
          <div class="col-md-6 col-sm-12">
            <p class="text-weight-bold q-mb-sm">{{ $t('form.definition') }}</p>
            <q-input class="q-mb-md" v-model="value.label" :label="$t('form.title')" :hint="$t('form.form_title_hint')" :disable="isReadOnly" />
            <q-input class="q-mb-md" v-model="value.description" :label="$t('form.description')" :hint="$t('form.form_description_hint')" autogrow :disable="isReadOnly" />
            <q-input class="q-mb-md" v-model="value.copyright" :label="$t('form.copyright')" :hint="$t('form.form_copyright_hint')" :disable="isReadOnly" />
            <q-select class="q-mb-md" v-model="value.license" :options="licenseOptions" :label="$t('form.license')" :hint="$t('form.form_license_hint')" emit-value map-options :disable="isReadOnly" />
            <div v-html="$t('form.form_license_cc')" class="text-caption text-grey-7 q-mb-md"/>
            <q-select class="q-mb-md" v-model="value.layout" :options="layoutOptions" :label="$t('form.layout')" :hint="$t('form.layout_hint')" emit-value map-options :disable="isReadOnly" />
          </div>
          <div class="col-md-6 col-sm-12">
            <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
            <q-input class="q-mb-md" v-model="value.idLabel" :label="$t('form.id_label')" :hint="$t('form.id_label_hint')" :disable="isReadOnly" />
            <q-input class="q-mb-md" v-model="value.idDescription" :label="$t('form.id_description')" :hint="$t('form.id_description_hint')" autogrow :disable="isReadOnly" />
            <q-input class="q-mb-md" v-model.number="value.idMask" :label="$t('form.id_mask')" :hint="$t('form.mask_hint')" :disable="isReadOnly" />
            <q-input class="q-mb-md" v-model="value.idValidation" :label="$t('form.id_validation')" :hint="$t('form.id_validation_hint')" :disable="isReadOnly" />
            <q-input class="q-mb-md" v-model="value.idValidationMessage" :label="$t('form.id_validation_message')" :hint="$t('form.validation_message_hint')" :disable="isReadOnly" />
          </div>
        </div>
        <div v-else>
          <div class="q-pa-md bg-grey-2">
            <p class="text-weight-bold q-mb-sm">{{ $t('form.definition') }}</p>
            <div class="row q-col-gutter-lg">
              <div class="col-md-6 col-sm-12">
                <q-select class="q-mb-md" v-model="value.type" :options="typeOptions" :label="$t('form.type')" :hint="$t('form.type_hint')" emit-value map-options :disable="isReadOnly" />
                <q-input class="q-mb-md" v-model="value.name" :label="$t('form.name')" :hint="$t(isVariable ? 'form.name_hint': 'form.section_hint')" :disable="isReadOnly" />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input class="q-mb-md" v-model="value.label" :label="$t('form.label')" :hint="$t('form.label_hint')" :disable="isReadOnly" />
                <q-input class="q-mb-md" v-model="value.description" :label="$t('form.description')" :hint="$t('form.description_hint')" autogrow :disable="isReadOnly" />
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
              icon="backspace"
              flat
              size="sm"
              :label="$t('form.preview_data_clear')"
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
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import snarkdown from 'snarkdown'
import { BlitzForm } from '@blitzar/form'
import { makeBlitzarQuasarSchemaForm, makeSchemaFormTr } from '@obiba/quasar-ui-amber'
import { settings } from '../../boot/settings'
import AuthMixin from '../../mixins/AuthMixin'

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
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'FormItem',
  components: { BlitzForm },
  props: ['modelValue', 'i18n'],
  emits: ['update:modelValue'],
  mixins: [AuthMixin],
  setup () {
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

    const { locale } = useI18n({ useScope: 'global' })

    return {
      remountCounter: 0,
      tab: ref('design'),
      types: [
        'text', 'textarea', 'number',
        'date', 'datetime', 'time',
        'radiogroup', 'checkboxgroup',
        'select', 'autocomplete', 'image-select',
        'slider', 'rating',
        'toggle',
        'section', 'group',
        'computed', 'map'
      ],
      modelData: ref({}),
      optionsFile: ref(null),
      optionsCount: ref(5),
      imageFile: ref(null),
      areasFile: ref(null),
      areasCount: ref(5),
      locale: ref(locale.value),
      settings: settings,
      ccLicenses: ccLicenses
    }
  },
  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    },
    formLocales () {
      return this.i18n ? Object.keys(this.i18n).sort().filter(loc => this.locale !== loc) : ['en']
    },
    schemaStr () {
      const valueToShow = { ...this.modelValue }
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
    },
    modelDataStr () {
      return JSON.stringify(this.modelData, null, '  ')
    },
    isRoot () {
      return this.modelValue.name === '.'
    },
    isVariable () {
      return ['section', 'group'].includes(this.modelValue.type) !== true
    },
    isComputed () {
      return this.modelValue.type === 'computed'
    },
    isArray () {
      return this.modelValue.type === 'checkbox' || this.modelValue.multiple
    },
    hasPlaceholder () {
      return ['text', 'textarea'].includes(this.modelValue.type)
    },
    hasDescriptionClass () {
      return !['section', 'group'].includes(this.modelValue.type)
    },
    hasPopup () {
      return ['date', 'datetime', 'time'].includes(this.modelValue.type)
    },
    hasHint () {
      return ['text', 'textarea', 'number', 'date', 'datetime', 'time', 'select', 'autocomplete', 'image-select'].includes(this.modelValue.type)
    },
    hasMultiple () {
      return ['select', 'autocomplete', 'image-select', 'map'].includes(this.modelValue.type)
    },
    hasOptions () {
      return ['radiogroup', 'checkboxgroup', 'select', 'autocomplete', 'image-select'].includes(this.modelValue.type)
    },
    hasImageMap () {
      return ['image-select'].includes(this.modelValue.type)
    },
    hasGeoMap () {
      return ['map'].includes(this.modelValue.type)
    },
    hasNumber () {
      return ['rating', 'slider'].includes(this.modelValue.type)
    },
    layoutOptions () {
      return [
        {
          value: 'single',
          label: this.$t('form.single_page')
        },
        {
          value: 'multi',
          label: this.$t('form.multi_steps')
        }
      ]
    },
    licenseOptions () {
      const licenses = this.ccLicenses.map(lic => {
        return {
          value: lic.value,
          label: this.$t(lic.label)
        }
      })
      if (this.settings.licenses) {
        this.settings.licenses.forEach(lic => licenses.push({
          value: lic.value,
          label: lic.label ? this.$t(lic.label) : this.$t(lic.value)
        }))
      }
      return licenses
    },
    typeOptions () {
      return this.types.map(tp => {
        return {
          value: tp,
          label: this.$t('form.types.' + tp)
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
    },
    typeComponent () {
      switch (this.value.type) {
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
    },
    blitzarSchema () {
      const items = this.isRoot ? [...this.value.items] : [this.value]
      if (this.isRoot) {
        items.splice(0, 0, {
          name: '_id',
          type: 'text',
          label: this.value.idLabel ? this.value.idLabel : 'ID',
          description: this.value.idDescription,
          mask: this.value.idMask,
          validation: this.value.idValidation,
          validationMessage: this.value.idValidationMessage,
          required: true
        })
      }
      const schema = {
        items: items,
        i18n: this.i18n ? this.i18n : {}
      }
      return makeBlitzarQuasarSchemaForm(schema, { locale: this.locale, debug: true })
    }
  },
  watch: {
    modelValue: function (newValue, oldValue) {
      this.$emit('update:modelValue', this.modelValue)
      this.optionsCount = 5
    },
    'modelValue.type': function (newValue, oldValue) {
      if (!this.hasOptions) {
        delete this.modelValue.options
      }
      if (!this.hasImageMap) {
        delete this.modelValue.imageSrc
        delete this.modelValue.imageClass
        delete this.modelValue.showSelect
        delete this.modelValue.areas
      }
      if (!this.hasGeoMap) {
        delete this.modelValue.geometryType
        delete this.modelValue.center
        delete this.modelValue.zoom
        delete this.modelValue.geoLocation
        delete this.modelValue.mapHeight
      }
      if (!this.hasNumber) {
        delete this.modelValue.icon
        delete this.modelValue.size
        delete this.modelValue.color
        delete this.modelValue.min
        delete this.modelValue.max
      }
      if (!this.hasPlaceholder) {
        delete this.modelValue.placeholder
      }
      if (!this.hasHint) {
        delete this.modelValue.hint
      }
      if (!this.hasPopup) {
        delete this.modelValue.closeLabel
      }
      if (!this.hasMultiple) {
        delete this.modelValue.multiple
      }
      if (!this.isComputed) {
        delete this.modelValue.compute
      }
      if (!this.isVariable) {
        delete this.modelValue.required
        delete this.modelValue.validation
        delete this.modelValue.validationMessage
        delete this.modelValue.mask
        delete this.modelValue.default
        delete this.modelValue.options
        delete this.modelValue.newValue
      }
    },
    'modelValue.default': function (newValue, oldValue) {
      if (newValue === '') {
        delete this.modelValue.default
      }
      this.modelData = this.isArray ? (this.modelValue.default ? [this.modelValue.default] : []) : this.modelValue.default
    }
  },
  methods: {
    tr (key) {
      return makeSchemaFormTr({ i18n: this.i18n ? this.i18n : {} }, { locale: this.locale })(key)
    },
    md (text) {
      return text ? snarkdown(text) : text
    },
    onLocale (newLocale) {
      this.locale = newLocale
    },
    clearModelData () {
      this.modelData = {}
      this.remountCounter++
    }
  }
})
</script>
