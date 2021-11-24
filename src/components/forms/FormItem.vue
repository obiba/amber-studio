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
        <div class="row q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <p class="text-weight-bold q-mb-sm">{{ $t('form.definition') }}</p>
            <q-select class="q-mb-md" v-model="value.type" :options="typeOptions" :label="$t('form.type')" :hint="$t('form.type_hint')" emit-value map-options dense filled />
            <q-input class="q-mb-md" v-model="value.name" :label="$t('form.name')" :hint="$t(isVariable ? 'form.name_hint': 'form.static_hint')" dense filled />
            <q-input class="q-mb-md" v-model="value.label" :label="$t('form.label')" :hint="$t('form.label_hint')" dense filled />
            <q-input class="q-mb-md" v-model="value.description" :label="$t('form.description')" :hint="$t('form.description_hint')" dense filled />
            <q-input class="q-mb-md" v-model="value.conditions" :label="$t('form.conditions')" :hint="$t('form.conditions_hint')" dense filled />
            <q-input v-if="isVariable" class="q-mb-md" v-model="value.validation" :label="$t('form.validation')" :hint="$t('form.validation_hint')" dense filled />
          </div>
          <div class="col-md-6 col-sm-12">
            <div v-if="isVariable">
              <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
              <div v-if="hasPlaceholder">
                <q-input class="q-mb-md" v-model="value.placeholder" :label="$t('form.placeholder')" :hint="$t('form.placeholder_hint')" dense filled />
              </div>
              <q-input class="q-mb-md" v-model="value.default" :label="$t('form.default')" :hint="$t('form.default_hint')" dense filled />
              <div v-if="value.type === 'slider'">
                <q-input class="q-mb-md" v-model.number="value.min" type="number" :label="$t('form.min')" :hint="$t('form.min_hint')" dense filled />
                <q-input class="q-mb-md" v-model.number="value.max" type="number" :label="$t('form.max')" :hint="$t('form.max_hint')" dense filled />
                <q-input class="q-mb-md" v-model="value.format" :label="$t('form.format')" :hint="$t('form.format_hint')" dense filled />
              </div>
              <div v-if="hasOptions">
                <p class="q-mb-sm q-mt-md">{{ $t('form.options') }}</p>
                <p class="text-grey">{{ $t('form.options_hint') }}</p>
                <div v-for="option in modelValue.options" :key="option.value">
                  <div class="row q-col-gutter-lg">
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
                </div>
                <q-btn
                color="primary"
                icon="add"
                :title="$t('fomerl.add_option_hint')"
                @click="addOption()"
                class="q-mr-md" />
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="schema">
        <div class="bg-black text-white q-pa-md">
          <pre>{{ JSON.stringify(modelValue, null, '  ') }}</pre>
        </div>
      </q-tab-panel>

      <q-tab-panel name="preview">
        <q-card>
          <q-card-section>
            <div>
              <BlitzForm :key='remountCounter' :schema='blitzarSchema' v-model='modelData' :columnCount='1' gridGap='32px'/>
            </div>
          </q-card-section>
        </q-card>
        <q-card class="q-mt-md" v-if="isVariable">
          <q-card-section>
            <div class="bg-black text-white q-pa-md">
              <pre>{{ JSON.stringify(modelData, null, '  ') }}</pre>
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
        'select', 'multiselect',
        'toggle', 'slider', 'static', 'group'
      ],
      modelData: ref(null)
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
    isVariable () {
      return ['static'].includes(this.modelValue.type) !== true
    },
    isArray () {
      return ['checkboxgroup', 'multiselect'].includes(this.modelValue.type)
    },
    hasPlaceholder () {
      return ['text', 'textarea'].includes(this.modelValue.type)
    },
    hasOptions () {
      return ['radiogroup', 'checkboxgroup', 'select', 'multiselect'].includes(this.modelValue.type)
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
      console.log(this.i18n)
      return makeBlitzarQuasarSchemaForm({
        items: [
          this.modelValue
        ],
        i18n: this.i18n
      }, { locale: 'en' })
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
      this.modelData = this.isArray ? [] : null
    },
    'modelValue.default': function (newValue, oldValue) {
      if (newValue === '') {
        delete this.modelValue.default
      }
      this.modelData = this.isArray ? (this.modelValue.default ? [this.modelValue.default] : []) : this.modelValue.default
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
    }
  }
})
</script>
