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
            <q-input v-if="isVariable" class="q-mb-md" v-model="schema.name" :label="$t('formel.name')" :hint="$t('formel.name_hint')" dense filled />
            <q-input class="q-mb-md" v-model="schema.label" :label="$t('formel.label')" :hint="$t('formel.label_hint')" dense filled />
            <q-input class="q-mb-md" v-model="schema.description" type="textarea" autogrow :label="$t('formel.description')" :hint="$t('formel.description_hint')" dense filled />
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
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import {defineComponent} from 'vue'
import {ref} from 'vue'

export default defineComponent({
  name: "FormItem",
  props: {
      schema: Object
  },
  setup() {
    return {
      tab: ref("builder"),
      types: [
        'text', 'textarea', 'radiogroup', 'checkboxgroup', 'select', 'toggle', 'slider', 'static'
      ]
    }
  },
  computed: {
      isVariable() {
        return this.schema.type !== 'static';
      },
      hasPlaceholder() {
        return ['text', 'textarea', 'select'].includes(this.schema.type);
      },
      hasOptions() {
        return ['radiogroup', 'checkboxgroup', 'select'].includes(this.schema.type);
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
        delete this.schema.default;
        delete this.schema.min;
        delete this.schema.max;
        delete this.schema.format;
      }
    }
  },
  methods: {
    deleteOption(option) {
        this.schema.options = this.schema.options.filter(opt => opt.value !== option.value);
    },
    addOption() {
      if (!this.schema.options)
        this.schema.options = [];
      this.schema.options.push({
          value: "" + (this.schema.options.length + 1)
      });
    }
  }
  
})
</script>

<style scoped>

</style>
