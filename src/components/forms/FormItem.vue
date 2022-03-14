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
      <!--q-tab name="schema" :label="$t('form.schema')" /-->
      <q-tab name="preview" :label="$t('form.preview')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
      <q-tab-panel name="design">
        <div v-if="isRoot" class="row q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <p class="text-weight-bold q-mb-sm">{{ $t('form.definition') }}</p>
            <q-input class="q-mb-md" v-model="value.label" :label="$t('form.title')" :hint="$t('form.form_title_hint')" :disable="isReadOnly" />
            <q-input class="q-mb-md" v-model="value.description" :label="$t('form.description')" :hint="$t('form.form_description_hint')" autogrow :disable="isReadOnly" />
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
        <div v-else class="row q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <p class="text-weight-bold q-mb-sm">{{ $t('form.definition') }}</p>
            <q-select class="q-mb-md" v-model="value.type" :options="typeOptions" :label="$t('form.type')" :hint="$t('form.type_hint')" emit-value map-options :disable="isReadOnly" />
            <q-input class="q-mb-md" v-model="value.name" :label="$t('form.name')" :hint="$t(isVariable ? 'form.name_hint': 'form.section_hint')" :disable="isReadOnly" />
            <q-input class="q-mb-md" v-model="value.label" :label="$t('form.label')" :hint="$t('form.label_hint')" :disable="isReadOnly" />
            <q-input class="q-mb-md" v-model="value.description" :label="$t('form.description')" :hint="$t('form.description_hint')" autogrow :disable="isReadOnly" />
            <q-input v-if="!isComputed" class="q-mb-md" v-model="value.condition" :label="$t('form.condition')" :hint="$t('form.condition_hint')" :disable="isReadOnly" />
            <q-toggle v-if="isVariable && !isComputed" class="q-mb-md" v-model.number="value.required" :label="$t('form.required')" :hint="$t('form.required_hint')" dense :disable="isReadOnly" />
            <q-input v-if="isVariable && !isComputed" class="q-mb-md" v-model="value.validation" :label="$t('form.validation')" :hint="$t('form.validation_hint')" :disable="isReadOnly" />
            <q-input v-if="isVariable && !isComputed" class="q-mb-md" v-model="value.validationMessage" :label="$t('form.validation_message')" :hint="$t('form.validation_message_hint')" :disable="isReadOnly" />
          </div>
          <div class="col-md-6 col-sm-12">
            <div v-if="isVariable">
              <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
              <div v-if="hasPlaceholder">
                <q-input class="q-mb-md" v-model="value.placeholder" :label="$t('form.placeholder')" :hint="$t('form.placeholder_hint')" :disable="isReadOnly" />
              </div>
              <div v-if="hasHint">
                <q-input class="q-mb-md" v-model="value.hint" :label="$t('form.hint')" :hint="$t('form.hint_hint')" :disable="isReadOnly" />
              </div>
              <div v-if="hasPopup">
                <q-input class="q-mb-md" v-model="value.closeLabel" :label="$t('form.close_label')" :hint="$t('form.close_label_hint')" :disable="isReadOnly" />
              </div>
              <q-input v-if="isComputed" class="q-mb-md" v-model="value.compute" :label="$t('form.compute')" :hint="$t('form.compute_hint')" />
              <q-input class="q-mb-md" v-model="value.default" :label="$t('form.default')" :hint="$t('form.default_hint')" :disable="isReadOnly" />
              <div v-if="value.type === 'text'">
                <q-input class="q-mb-md" v-model.number="value.mask" :label="$t('form.mask')" :hint="$t('form.mask_hint')" :disable="isReadOnly" />
              </div>
              <div v-if="value.type === 'slider'">
                <q-input class="q-mb-md" v-model.number="value.min" type="number" :label="$t('form.min')" :hint="$t('form.min_hint')" :disable="isReadOnly" />
                <q-input class="q-mb-md" v-model.number="value.max" type="number" :label="$t('form.max')" :hint="$t('form.max_hint')" :disable="isReadOnly" />
              </div>
              <div v-if="value.type === 'rating'">
                <q-input class="q-mb-md" v-model.number="value.max" type="number" :label="$t('form.max')" :hint="$t('form.max_hint')" :disable="isReadOnly" />
              </div>
              <div v-if="hasGeoMap">
                <q-select class="q-mb-md" v-model="value.geometryType" :options="geoTypeOptions" :label="$t('form.geo.type')" :hint="$t('form.geo.type_hint')" emit-value map-options :disable="isReadOnly" />
                <q-input class="q-mb-md" v-model.number="value.center" :label="$t('form.geo.center')" :hint="$t('form.geo.center_hint')" :disable="isReadOnly" />
                <q-input class="q-mb-md" v-model.number="value.zoom" type="number" :label="$t('form.geo.zoom')" :hint="$t('form.geo.zoom_hint')" :disable="isReadOnly" />
                <q-toggle class="q-mb-md" v-model.number="value.geoLocation" :label="$t('form.geo.geo_location')" dense :disable="isReadOnly" />
              </div>
              <div v-if="hasMultiple">
                <q-toggle class="q-mb-md" v-model.number="value.multiple" :label="$t('form.multiple')" dense :disable="isReadOnly" />
              </div>
              <div v-if="hasOptions">
                <p class="q-mb-sm q-mt-md">{{ $t('form.options') }}</p>
                <p class="text-grey">{{ $t('form.options_hint') }}</p>
                <div class="row q-col-gutter-lg" v-for="option in optionsList" :key="option.value">
                  <div class="col-4">
                    <q-input class="q-mb-md" v-model="option.value" :label="$t('form.option_value')" :disable="isReadOnly" />
                  </div>
                  <div :class="isReadOnly ? 'col-8' : 'col-7'">
                    <q-input class="q-mb-md" v-model="option.label" :label="$t('form.option_label')" :disable="isReadOnly" />
                  </div>
                  <div class="col-1">
                    <q-btn
                      v-if="!isReadOnly"
                      class="q-mt-sm text-grey-8"
                      size="12px"
                      flat
                      dense
                      round
                      icon='delete'
                      @click='deleteOption(option)'>
                    </q-btn>
                  </div>
                </div>
                <q-btn
                  v-if="hasMoreOptions"
                  class="q-pa-none q-mb-sm"
                  size="sm"
                  flat
                  @click="showMoreOptions"
                  :label="$t('form.show_more_options')"/>
                <div class="row q-col-gutter-lg" v-if="!isReadOnly">
                  <div class="col-4">
                    <q-btn
                      color="primary"
                      icon="add"
                      :title="$t('form.add_option_hint')"
                      @click="addOption()"
                      class="q-mr-md"
                    />
                  </div>
                  <div class="col-8">
                    <q-file
                      dense
                      bottom-slots
                      clearable
                      v-model="optionsFile"
                      accept=".txt,.csv,.tsv"
                      :label="$t('form.upload_options')">
                      <template v-slot:prepend>
                        <q-icon name="add" @click.stop />
                      </template>

                      <template v-slot:hint>
                        {{ $t('form.upload_options_hint') }}
                      </template>
                    </q-file>
                  </div>
                </div>
              </div>
              <div v-if="value.type === 'autocomplete'">
                <q-toggle class="q-mt-md q-mb-md" v-model.number="value.newValue" :label="$t('form.new_value')" dense :disable="isReadOnly" />
              </div>
              <div v-if="hasImageMap">
                <q-toggle class="q-mt-md q-mb-md" v-model.number="value.showSelect" :label="$t('form.show_area_select')" dense :disable="isReadOnly" />
                <p class="text-weight-bold q-mb-sm q-mt-md">{{ $t('form.image') }}</p>
                <p class="text-grey">{{ $t('form.image_hint') }}</p>
                <q-input class="q-mb-md" v-model="value.imageSrc" :label="$t('form.image_src')" :hint="$t('form.image_src_hint')" :disable="isReadOnly" />
                <q-file
                  dense
                  bottom-slots
                  clearable
                  v-model="imageFile"
                  accept=".jpg,.jpeg,.png"
                  :label="$t('form.upload_image')">
                  <template v-slot:prepend>
                    <q-icon name="add" @click.stop />
                  </template>

                  <template v-slot:hint>
                    {{ $t('form.upload_image_hint') }}
                  </template>
                </q-file>
                <p class="q-mb-sm q-mt-md">{{ $t('form.image_areas') }}</p>
                <p class="text-grey">{{ $t('form.image_areas_hint') }}</p>
                <div class="row q-col-gutter-lg" v-for="area in areasList" :key="area.value + '-' + area.points">
                  <div class="col-2">
                    <q-input class="q-mb-md" v-model="area.value" :label="$t('form.area_value')" :disable="isReadOnly" />
                  </div>
                  <div class="col-3">
                    <q-input class="q-mb-md" v-model="area.fill" :label="$t('form.area_fill')" :disable="isReadOnly">
                      <template v-slot:append>
                        <q-icon name="colorize" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-color v-model="area.fill" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div :class="isReadOnly ? 'col-7' : 'col-6'">
                    <q-input class="q-mb-md" v-model="area.points" :label="$t('form.area_points')" :disable="isReadOnly" />
                  </div>
                  <div class="col-1">
                    <q-btn
                      v-if="!isReadOnly"
                      class="q-mt-sm text-grey-8"
                      size="12px"
                      flat
                      dense
                      round
                      icon='delete'
                      @click='deleteArea(area)'>
                    </q-btn>
                  </div>
                </div>
                <q-btn
                  v-if="hasMoreAreas"
                  class="q-pa-none q-mb-sm"
                  size="sm"
                  flat
                  @click="showMoreAreas"
                  :label="$t('form.show_more_areas')"/>
                <div class="row q-col-gutter-lg" v-if="!isReadOnly">
                  <div class="col-4">
                    <q-btn
                      color="primary"
                      icon="add"
                      :title="$t('form.add_area_hint')"
                      @click="addArea()"
                      class="q-mr-md"
                    />
                  </div>
                  <div class="col-8">
                    <q-file
                      dense
                      bottom-slots
                      clearable
                      v-model="areasFile"
                      accept=".txt,.csv,.tsv"
                      :label="$t('form.upload_areas')">
                      <template v-slot:prepend>
                        <q-icon name="add" @click.stop />
                      </template>

                      <template v-slot:hint>
                        {{ $t('form.upload_areas_hint') }}
                      </template>
                    </q-file>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!isComputed">
              <p class="text-weight-bold q-mb-sm">{{ $t('form.style') }}</p>
              <q-input class="q-mb-md" v-model="value.labelClass" :label="$t('form.label_class')" :hint="$t('form.label_class_hint')" :disable="isReadOnly" />
              <q-input v-if="!hasDescriptionClass" class="q-mb-md" v-model="value.descriptionClass" :label="$t('form.description_class')" :hint="$t('form.description_class_hint')" autogrow :disable="isReadOnly" />
              <q-input v-if="hasImageMap" class="q-mb-md" v-model="value.imageClass" :label="$t('form.image_class')" :hint="$t('form.image_class_hint')" :disable="isReadOnly" />
              <div v-if="value.type === 'rating'">
                <q-input class="q-mb-md" v-model="value.icon" :label="$t('form.icon')" :hint="$t('form.icon_hint')" :disable="isReadOnly" />
                <q-input class="q-mb-md" v-model="value.size" :label="$t('form.size')" :hint="$t('form.size_hint')" :disable="isReadOnly" />
                <q-input class="q-mb-md" v-model="value.color" :label="$t('form.color')" :hint="$t('form.color_hint')" :disable="isReadOnly" />
              </div>
              <div v-if="hasGeoMap">
                <q-input class="q-mb-md" v-model="value.mapHeight" :label="$t('form.geo.map_height')" :hint="$t('form.geo.map_height_hint')" placeholder="400px" :disable="isReadOnly" />
              </div>
            </div>
          </div>
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
                <q-item @click="onLocale(loc)" clickable v-close-popup v-for="loc in locales" :key="loc">
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
import { locales } from '../../boot/i18n'
import AuthMixin from '../../mixins/AuthMixin'

export default defineComponent({
  name: 'FormItem',
  components: { BlitzForm },
  props: ['modelValue', 'i18n'],
  emits: ['update:modelValue'],
  mixins: [AuthMixin],
  setup () {
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
      geoTypes: [
        'Point', 'Polygon'
      ],
      modelData: ref({}),
      optionsFile: ref(null),
      optionsCount: ref(5),
      imageFile: ref(null),
      areasFile: ref(null),
      areasCount: ref(5),
      locale: ref('en')
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
    locales () {
      return locales.filter(loc => this.locale !== loc)
    },
    schemaStr () {
      const valueToShow = { ...this.modelValue }
      delete valueToShow._id
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
    typeOptions () {
      return this.types.map(tp => {
        return {
          value: tp,
          label: this.$t('form.types.' + tp)
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
    },
    geoTypeOptions () {
      return this.geoTypes.map(tp => {
        return {
          value: tp,
          label: this.$t('form.geo.types.' + tp)
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
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
    },
    optionsList () {
      return this.modelValue.options ? this.modelValue.options.slice(0, this.optionsCount) : []
    },
    hasMoreOptions () {
      return this.modelValue.options && this.modelValue.options.length > this.optionsCount
    },
    areasList () {
      return this.modelValue.areas ? this.modelValue.areas.slice(0, this.areasCount) : []
    },
    hasMoreAreas () {
      return this.modelValue.areas && this.modelValue.areas.length > this.areasCount
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
      if (!this.hasPopup) {
        delete this.modelValue.closeLabel
      }
      if (!this.hasMultiple) {
        delete this.modelValue.multiple
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
    },
    optionsFile: function (newValue) {
      if (newValue !== null) {
        const delim = this.getFileDelim(newValue)
        const reader = new FileReader()
        reader.readAsText(newValue, 'UTF-8')
        reader.onload = evt => {
          evt.target.result.split(/\r\n|\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .forEach(line => {
              const tokens = line.split(delim).map(token => this.cleanToken(token))
              if (tokens.length > 0 && tokens[0].length > 0) {
                if (!this.value.options) {
                  this.value.options = []
                }
                const value = tokens[0]
                tokens.splice(0, 1)
                this.value.options.push({
                  value: value,
                  label: tokens.length > 0 ? tokens.join(delim) : value
                })
              }
            })
        }
        reader.onerror = evt => {
          console.error(evt)
        }
      }
    },
    imageFile: function (newValue) {
      if (newValue !== null) {
        const reader = new FileReader()
        reader.onload = evt => {
          this.value.imageSrc = evt.target.result
        }
        reader.onerror = evt => {
          console.error(evt)
        }
        reader.readAsDataURL(newValue)
      }
    },
    areasFile: function (newValue) {
      if (newValue !== null) {
        const delim = this.getFileDelim(newValue)
        const reader = new FileReader()
        reader.readAsText(newValue, 'UTF-8')
        reader.onload = evt => {
          evt.target.result.split(/\r\n|\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .forEach(line => {
              const tokens = line.split(delim).map(token => this.cleanToken(token))
              if (tokens.length > 0 && tokens[0].length > 0) {
                if (!this.value.areas) {
                  this.value.areas = []
                }
                const value = tokens[0]
                const fill = tokens[1]
                tokens.splice(0, 2)
                this.value.areas.push({
                  value: value,
                  fill: fill,
                  points: tokens.join(delim)
                })
              }
            })
        }
        reader.onerror = evt => {
          console.error(evt)
        }
      }
    }
  },
  methods: {
    tr (key) {
      return makeSchemaFormTr({ i18n: this.i18n ? this.i18n : {} }, { locale: this.locale })(key)
    },
    md (text) {
      return text ? snarkdown(text) : text
    },
    cleanToken (token) {
      if (token.startsWith('"') && token.endsWith('"')) {
        return token.substring(1, token.length - 1)
      }
      return token
    },
    getFileDelim (file) {
      return file.name.endsWith('.tsv') ? '\t' : ','
    },
    showMoreOptions () {
      this.optionsCount = this.optionsCount + 5
    },
    deleteOption (option) {
      this.value.options = this.modelValue.options.filter(opt => opt.value !== option.value)
      if (this.optionsCount > 5) {
        this.optionsCount = this.optionsCount - 1
      }
    },
    addOption () {
      if (!this.modelValue.options) {
        this.value.options = []
      }
      const val = '' + (this.modelValue.options.length + 1)
      this.value.options.push({
        value: val,
        label: val
      })
    },
    showMoreAreas () {
      this.areasCount = this.areasCount + 5
    },
    deleteArea (area) {
      this.value.areas = this.modelValue.areas.filter(ar => `${ar.value}-${ar.points}` !== `${area.value}-${area.points}`)
      if (this.areasCount > 5) {
        this.areasCount = this.areasCount - 1
      }
    },
    addArea () {
      if (!this.modelValue.areas) {
        this.value.areas = []
      }
      const val = '' + (this.modelValue.areas.length + 1)
      this.value.areas.push({
        value: val,
        fill: '#cccccc',
        points: '0,0 10,0 0,10 10,10'
      })
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
