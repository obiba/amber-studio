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
      <q-tab name="builder" :label="$t('form.builder')" />
      <q-tab name="schema" :label="$t('form.schema')" />
      <q-tab name="preview" :label="$t('form.preview')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
      <q-tab-panel name="builder">
        <div v-if="isRoot" class="row q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <p class="text-weight-bold q-mb-sm">{{ $t('form.definition') }}</p>
            <q-input class="q-mb-md" v-model="value.label" :label="$t('form.title')" :hint="$t('form.form_title_hint')" dense filled />
            <q-input class="q-mb-md" v-model="value.description" :label="$t('form.description')" :hint="$t('form.form_description_hint')" dense filled autogrow />
          </div>
        </div>
        <div v-else class="row q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <p class="text-weight-bold q-mb-sm">{{ $t('form.definition') }}</p>
            <q-select class="q-mb-md" v-model="value.type" :options="typeOptions" :label="$t('form.type')" :hint="$t('form.type_hint')" emit-value map-options dense filled />
            <q-input class="q-mb-md" v-model="value.name" :label="$t('form.name')" :hint="$t(isVariable ? 'form.name_hint': 'form.section_hint')" dense filled />
            <q-input class="q-mb-md" v-model="value.label" :label="$t('form.label')" :hint="$t('form.label_hint')" dense filled />
            <q-input class="q-mb-md" v-model="value.description" :label="$t('form.description')" :hint="$t('form.description_hint')" dense filled autogrow />
            <q-input class="q-mb-md" v-model="value.condition" :label="$t('form.condition')" :hint="$t('form.condition_hint')" dense filled />
            <q-input v-if="isVariable" class="q-mb-md" v-model="value.validation" :label="$t('form.validation')" :hint="$t('form.validation_hint')" dense filled />
            <q-input v-if="isVariable" class="q-mb-md" v-model="value.validationMessage" :label="$t('form.validation_message')" :hint="$t('form.validation_message_hint')" dense filled />
          </div>
          <div class="col-md-6 col-sm-12">
            <div v-if="isVariable">
              <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
              <div v-if="hasPlaceholder">
                <q-input class="q-mb-md" v-model="value.placeholder" :label="$t('form.placeholder')" :hint="$t('form.placeholder_hint')" dense filled />
              </div>
              <div v-if="hasHint">
                <q-input class="q-mb-md" v-model="value.hint" :label="$t('form.hint')" :hint="$t('form.hint_hint')" dense filled />
              </div>
              <q-input class="q-mb-md" v-model="value.default" :label="$t('form.default')" :hint="$t('form.default_hint')" dense filled />
              <div v-if="value.type === 'slider'">
                <q-input class="q-mb-md" v-model.number="value.min" type="number" :label="$t('form.min')" :hint="$t('form.min_hint')" dense filled />
                <q-input class="q-mb-md" v-model.number="value.max" type="number" :label="$t('form.max')" :hint="$t('form.max_hint')" dense filled />
                <q-input class="q-mb-md" v-model="value.format" :label="$t('form.format')" :hint="$t('form.format_hint')" dense filled />
              </div>
              <div v-if="value.type === 'rating'">
                <q-input class="q-mb-md" v-model.number="value.max" type="number" :label="$t('form.max')" :hint="$t('form.max_hint')" dense filled />
                <q-input class="q-mb-md" v-model="value.icon" :label="$t('form.icon')" :hint="$t('form.icon_hint')" dense filled />
                <q-input class="q-mb-md" v-model="value.size" :label="$t('form.size')" :hint="$t('form.size_hint')" dense filled />
                <q-input class="q-mb-md" v-model="value.color" :label="$t('form.color')" :hint="$t('form.color_hint')" dense filled />
              </div>
              <div v-if="hasMultiple">
                <q-toggle class="q-mb-md" v-model.number="value.multiple" :label="$t('form.multiple')" :hint="$t('form.multiple_hint')" dense />
              </div>
              <div v-if="hasOptions">
                <p class="q-mb-sm q-mt-md">{{ $t('form.options') }}</p>
                <p class="text-grey">{{ $t('form.options_hint') }}</p>
                <div class="row q-col-gutter-lg" v-for="option in modelValue.options" :key="option.value">
                  <div class="col-4">
                    <q-input class="q-mb-md" v-model="option.value" :label="$t('form.option_value')" dense filled />
                  </div>
                  <div class="col-6">
                    <q-input class="q-mb-md" v-model="option.label" :label="$t('form.option_label')" dense filled />
                  </div>
                  <div class="col-2">
                    <q-btn
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
                <div class="row q-col-gutter-lg">
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
                      filled
                      bottom-slots
                      clearable
                      v-model="optionsFile"
                      accept=".txt,.csv"
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
          <q-card-section v-if="isRoot">
            <div class="text-h6">{{ modelValue.label }}</div>
            <div class="text-subtitle2">{{ modelValue.description }}</div>
          </q-card-section>
          <q-separator v-if="isRoot" />
          <q-card-section>
            <div>
              <BlitzForm :key='remountCounter' :schema='blitzarSchema' v-model='modelData' :columnCount='1' gridGap='32px'/>
            </div>
          </q-card-section>
        </q-card>
        <q-card class="q-mt-md" v-if="isVariable">
          <q-card-section>
            <q-btn
              icon="backspace"
              :label="$t('form.preview_data_clear')"
              @click="clearModelData()"
              class="q-mb-md" />
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
import { BlitzForm } from '@blitzar/form'
import { makeBlitzarQuasarSchemaForm } from '@obiba/quasar-ui-amber'

export default defineComponent({
  name: 'FormItem',
  components: { BlitzForm },
  props: ['modelValue', 'i18n'],
  emits: ['update:modelValue'],
  setup () {
    return {
      remountCounter: 0,
      tab: ref('builder'),
      types: [
        'text', 'textarea', 'number',
        'date', 'datetime', 'time',
        'radiogroup', 'checkboxgroup',
        'select', 'autocomplete',
        'slider', 'rating',
        'toggle',
        'section', 'group'
      ],
      modelData: ref({}),
      optionsFile: ref(null)
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
      return ['section'].includes(this.modelValue.type) !== true
    },
    isArray () {
      return this.modelValue.type === 'checkbox' || this.modelValue.multiple
    },
    hasPlaceholder () {
      return ['text', 'textarea'].includes(this.modelValue.type)
    },
    hasHint () {
      return ['text', 'textarea', 'number', 'date', 'datetime', 'time', 'select', 'autocomplete'].includes(this.modelValue.type)
    },
    hasMultiple () {
      return ['select', 'autocomplete'].includes(this.modelValue.type)
    },
    hasOptions () {
      return ['radiogroup', 'checkboxgroup', 'select', 'autocomplete'].includes(this.modelValue.type)
    },
    typeOptions () {
      return this.types.map(tp => {
        return {
          value: tp,
          label: this.$t('form.types.' + tp)
        }
      })
    },
    blitzarSchema () {
      const items = this.isRoot ? this.value.items : [this.value]
      const schema = {
        items: items,
        i18n: this.i18n ? this.i18n : {}
      }
      return makeBlitzarQuasarSchemaForm(schema, { locale: 'en' })
    }
  },
  watch: {
    modelValue: function (newValue, oldValue) {
      this.$emit('update:modelValue', this.modelValue)
    },
    'modelValue.type': function (newValue, oldValue) {
      if (!this.hasOptions) {
        delete this.modelValue.options
      }
      if (!this.isVariable) {
        delete this.modelValue.validation
        delete this.modelValue.min
        delete this.modelValue.max
        delete this.modelValue.format
        delete this.modelValue.default
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
        const reader = new FileReader()
        reader.readAsText(newValue, 'UTF-8')
        reader.onload = evt => {
          const cleanToken = (token) => {
            if (token.startsWith('"') && token.endsWith('"')) {
              return token.substring(1, token.length - 1).trim()
            }
            return token
          }
          evt.target.result.split(/\r\n|\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .forEach(line => {
              const tokens = line.split(',').map(token => cleanToken(token))
              if (tokens.length > 0 && tokens[0].length > 0) {
                this.value.options.push({
                  value: tokens[0],
                  label: tokens.length > 1 && tokens[1].length > 0 ? tokens[1] : tokens[0]
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
    deleteOption (option) {
      this.value.options = this.modelValue.options.filter(opt => opt.value !== option.value)
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
    clearModelData () {
      this.modelData = {}
      this.remountCounter++
    }
  }
})
</script>
