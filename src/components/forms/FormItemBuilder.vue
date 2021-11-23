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
      <q-tab name="builder" :label="$t('formel.builder')" />
      <q-tab name="schema" :label="$t('formel.schema')" />
      <q-tab name="preview" :label="$t('formel.preview')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
      <q-tab-panel name="builder">
        <div class="row q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <p class="text-weight-bold q-mb-sm">{{ $t('formel.definition') }}</p>
            <q-select class="q-mb-md" v-model="value.type" :options="typeOptions" :label="$t('formel.type')" :hint="$t('formel.type_hint')" emit-value map-options dense filled />
            <q-input class="q-mb-md" v-model="value.name" :label="$t('formel.name')" :hint="$t(isVariable ? 'formel.name_hint': 'formel.static_hint')" dense filled />
            <q-input class="q-mb-md" v-model="value.label" :label="$t('formel.label')" :hint="$t('formel.label_hint')" dense filled />
            <q-input class="q-mb-md" v-model="value.description" :label="$t('formel.description')" :hint="$t('formel.description_hint')" dense filled />
            <q-input class="q-mb-md" v-model="value.conditions" :label="$t('formel.conditions')" :hint="$t('formel.conditions_hint')" dense filled />
            <q-input v-if="isVariable" class="q-mb-md" v-model="value.validation" :label="$t('formel.validation')" :hint="$t('formel.validation_hint')" dense filled />
          </div>
          <div class="col-md-6 col-sm-12">
            <div v-if="isVariable">
              <p class="text-weight-bold q-mb-sm">{{ $t('formel.settings') }}</p>
              <div v-if="hasPlaceholder">
                <q-input class="q-mb-md" v-model="value.placeholder" :label="$t('formel.placeholder')" :hint="$t('formel.placeholder_hint')" dense filled />
              </div>
              <q-input class="q-mb-md" v-model="value.default" :label="$t('formel.default')" :hint="$t('formel.default_hint')" dense filled />
              <div v-if="value.type === 'slider'">
                <q-input class="q-mb-md" v-model.number="value.min" type="number" :label="$t('formel.min')" :hint="$t('formel.min_hint')" dense filled />
                <q-input class="q-mb-md" v-model.number="value.max" type="number" :label="$t('formel.max')" :hint="$t('formel.max_hint')" dense filled />
                <q-input class="q-mb-md" v-model="value.format" :label="$t('formel.format')" :hint="$t('formel.format_hint')" dense filled />
              </div>
              <div v-if="hasOptions">
                <p class="q-mb-sm q-mt-md">{{ $t('formel.options') }}</p>
                <p class="text-grey">{{ $t('formel.options_hint') }}</p>
                <div v-for="option in modelValue.options" :key="option.value">
                  <div class="row q-col-gutter-lg">
                    <div class="col-4">
                      <q-input class="q-mb-md" v-model="option.value" :label="$t('formel.option_value')" dense filled />
                    </div>
                    <div class="col-6">
                      <q-input class="q-mb-md" v-model="option.label" :label="$t('formel.option_label')" dense filled />
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
  name: 'FormItemBuilder',
  components: { BlitzForm },
  props: ['modelValue'],
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
          label: this.$t('formel.types.' + tp)
        }
      })
    },
    blitzarSchema () {
      return makeBlitzarQuasarSchemaForm({
        items: [
          this.modelValue
        ],
        i18n: {}
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

<style scoped>

</style>
