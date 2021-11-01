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
            <q-select class="q-mb-md" v-model="schema.type" :options="typeOptions" :label="$t('formel.type')" :hint="$t('formel.type_hint')" emit-value map-options dense filled />
            <q-input class="q-mb-md" v-model="schema.name" :label="$t('formel.name')" :hint="$t(isVariable ? 'formel.name_hint': 'formel.static_hint')" dense filled />
            <q-input class="q-mb-md" v-model="schema.label" :label="$t('formel.label')" :hint="$t('formel.label_hint')" dense filled />
            <q-input class="q-mb-md" v-model="schema.description" :label="$t('formel.description')" :hint="$t('formel.description_hint')" dense filled />
            <q-input class="q-mb-md" v-model="schema.conditions" :label="$t('formel.conditions')" :hint="$t('formel.conditions_hint')" dense filled />
            <q-input v-if="isVariable" class="q-mb-md" v-model="schema.rules" :label="$t('formel.rules')" :hint="$t('formel.rules_hint')" dense filled />
          </div>
          <div class="col-md-6 col-sm-12">
            <div v-if="isVariable">
              <p class="text-weight-bold q-mb-sm">{{ $t('formel.settings') }}</p>
              <div v-if="hasPlaceholder">
                <q-input class="q-mb-md" v-model="schema.placeholder" :label="$t('formel.placeholder')" :hint="$t('formel.placeholder_hint')" dense filled />
              </div>
              <q-input class="q-mb-md" v-model="schema.default" :label="$t('formel.default')" :hint="$t('formel.default_hint')" dense filled />
              <div v-if="schema.type === 'slider'">
                <q-input class="q-mb-md" v-model.number="schema.min" type="number" :label="$t('formel.min')" :hint="$t('formel.min_hint')" dense filled />
                <q-input class="q-mb-md" v-model.number="schema.max" type="number" :label="$t('formel.max')" :hint="$t('formel.max_hint')" dense filled />
                <q-input class="q-mb-md" v-model="schema.format" :label="$t('formel.format')" :hint="$t('formel.format_hint')" dense filled />
              </div>
              <div v-if="hasOptions">
                <p class="q-mb-sm q-mt-md">{{ $t('formel.options') }}</p>
                <p class="text-grey">{{ $t('formel.options_hint') }}</p>
                <div v-for="option in schema.options" :key="option.value">
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
          <pre>{{ JSON.stringify(schema, null, '  ') }}</pre>
        </div>
      </q-tab-panel>

      <q-tab-panel name="preview">
        <q-card>
          <q-card-section>
            <div v-if="schema.type === 'text'">
              <q-input 
                v-model="model" 
                :label="schema.label"
                :placeholder="schema.placeholder"
                :hint="schema.description" />
            </div>

            <div v-if="schema.type === 'textarea'">
              <q-input 
                v-model="model" 
                type="textarea"
                :label="schema.label"
                :placeholder="schema.placeholder"
                :hint="schema.description" />
            </div>

            <div v-if="schema.type === 'number'">
              <q-input 
                v-model="model" 
                type="number"
                :label="schema.label"
                :placeholder="schema.placeholder"
                :hint="schema.description" />
            </div>

            <div v-if="schema.type === 'date'">
              <q-input v-model="model"
                :label="schema.label"
                :hint="schema.description">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="model" mask="YYYY-MM-DD" minimal>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div v-if="schema.type === 'datetime'">
              <q-input v-model="model"
                :label="schema.label"
                :hint="schema.description">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="model" mask="YYYY-MM-DD HH:mm" minimal>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="model" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div v-if="schema.type === 'time'">
              <q-input v-model="model"
                :label="schema.label"
                :hint="schema.description">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="model" mask="HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div v-if="schema.type === 'radiogroup'">
              <p class="text-body1 text-grey-8">{{schema.label}}</p>
              <q-option-group
                v-model="model"
                :options="schema.options" />
              <p class="q-mt-md text-grey">{{schema.description}}</p>
            </div>

            <div v-if="schema.type === 'checkboxgroup'">
              <p class="text-body1 text-grey-8">{{schema.label}}</p>
              <q-option-group
                v-model="model"
                :options="schema.options"
                type="checkbox" />
              <p class="q-mt-md text-grey">{{schema.description}}</p>
            </div>

            <div v-if="schema.type === 'select'">
              <q-select
                v-model="model"
                emit-value
                map-options
                clearable
                :options="schema.options"
                :label="schema.label"
                :hint="schema.description" />
            </div>

            <div v-if="schema.type === 'multiselect'">
              <q-select
                v-model="model"
                emit-value
                map-options
                clearable
                multiple
                :options="schema.options"
                :label="schema.label"
                :hint="schema.description" />
            </div>

            <div v-if="schema.type === 'toggle'">
              <q-toggle 
                v-model="model"
                :label="schema.label" />
              <p class="q-mt-xs text-grey">{{schema.description}}</p>
            </div>

            <div v-if="schema.type === 'slider'">
              <p class="text-body1 text-grey-8">{{schema.label}}</p>
              <q-slider 
                v-model="model"
                label
                label-always
                markers
                snap
                :min="schema.min"
                :max="schema.max" />
              <p class="q-mt-xs text-grey">{{schema.description}}</p>
            </div>

            <div v-if="schema.type === 'static'">
              <div class="text-center">
                <h6 class="text-grey-8">{{schema.label}}</h6>
                <p class="text-grey">{{schema.description}}</p>
              </div>
            </div>

          </q-card-section>
        </q-card>
        <q-card class="q-mt-md" v-if="schema.type !== 'static'">
          <q-card-section>
            <div class="bg-black text-white q-pa-md">
              <pre>{{ JSON.stringify(model, null, '  ') }}</pre>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import {defineComponent} from 'vue'
import {ref} from 'vue'

export default defineComponent({
  name: "FormItemBuilder",
  props: {
      schema: Object
  },
  setup() {
    return {
      tab: ref("builder"),
      types: [
        'text', 'textarea','number', 'date', 'datetime', 'time', 'radiogroup', 'checkboxgroup', 'select', 'multiselect', 'toggle', 'slider', 'static'
      ],
      model: ref(null)
    }
  },
  computed: {
      isVariable() {
        return this.schema.type !== 'static';
      },
      isArray() {
        return ['checkboxgroup', 'multiselect'].includes(this.schema.type);
      },
      hasPlaceholder() {
        return ['text', 'textarea'].includes(this.schema.type);
      },
      hasOptions() {
        return ['radiogroup', 'checkboxgroup', 'select', 'multiselect'].includes(this.schema.type);
      },
      typeOptions() {
      return this.types.map(tp => {
        return {
          value: tp,
          label: this.$t('formel.types.' + tp)
        }
      });
    }
  },
  watch: {
    'schema.type': function(newValue, oldValue) {
      if (!this.hasOptions) {
        delete this.schema.options;
      }
      if (!this.isVariable) {
        delete this.schema.rules;
        delete this.schema.min;
        delete this.schema.max;
        delete this.schema.format;
        delete this.schema.default;
      }
      this.model = this.isArray ? [] : null;
    },
    'schema.default': function(newValue, oldValue) {
      if (newValue === "")
        delete this.schema.default;
      this.model = this.isArray ? (this.schema.default ? [this.schema.default] : []) : this.schema.default;
    }
  },
  methods: {
    deleteOption(option) {
        this.schema.options = this.schema.options.filter(opt => opt.value !== option.value);
    },
    addOption() {
      if (!this.schema.options)
        this.schema.options = [];
      const val = "" + (this.schema.options.length + 1);
      this.schema.options.push({
          value: val,
          label: val
      });
    }
  }
  
})
</script>

<style scoped>

</style>
