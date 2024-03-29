<template>
  <p class="q-mb-sm q-mt-md">{{ $t('form.options') }}</p>
  <p class="text-grey">{{ $t('form.options_hint') }}</p>
  <div class="row q-col-gutter-lg" v-for="option in optionsList" :key="option.value">
    <div class="col-4">
      <q-input class="q-mb-md" v-model="option.value" :label="$t('form.option_value')" :disable="readOnly" />
    </div>
    <div :class="readOnly ? 'col-8' : 'col-7'">
      <q-input class="q-mb-md" v-model="option.label" :label="$t('form.option_label')" :disable="readOnly" />
    </div>
    <div class="col-1">
      <q-btn
        v-if="!readOnly"
        class="q-mt-sm text-secondary"
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
  <div class="row q-col-gutter-sm" v-if="!readOnly">
    <div class="col-4">
      <q-btn
        color="primary"
        icon="add"
        :title="$t('form.add_option_hint')"
        @click="addOption()"
        class="q-mr-sm"
      />
      <q-btn
        flat
        round
        color="negative"
        icon="delete_outline"
        :title="$t('form.delete_options_hint')"
        @click="deleteOptions()"
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
</template>

<script>
import { ref, computed, watch, defineComponent } from 'vue'
import * as Papa from 'papaparse'

export default defineComponent({
  name: 'Options',
  props: ['modelValue', 'readOnly'],
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const optionsCount = ref(5)
    const optionsFile = ref(null)

    const schema = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const optionsList = computed(() => {
      return props.modelValue.options ? props.modelValue.options.slice(0, optionsCount.value) : []
    })

    const hasMoreOptions = computed(() => {
      return props.modelValue.options && props.modelValue.options.length > optionsCount.value
    })

    function showMoreOptions () {
      optionsCount.value = optionsCount.value + 5
    }

    function deleteOption (option) {
      schema.value.options = props.modelValue.options.filter(opt => opt.value !== option.value)
      if (optionsCount.value > 5) {
        optionsCount.value = optionsCount.value - 1
      }
    }

    function addOption () {
      if (!props.modelValue.options) {
        schema.value.options = []
      }
      const val = '' + (props.modelValue.options.length + 1)
      schema.value.options.push({
        value: val,
        label: val
      })
    }

    function deleteOptions () {
      schema.value.options = []
    }

    watch(optionsFile, async (newValue) => {
      if (newValue !== null) {
        Papa.parse(newValue, {
          header: false,
          delimiter: newValue.name.endsWith('.tsv') ? '\t' : ',',
          complete: function (results, file) {
            if (results.errors.length === 0) {
              console.error(results.error)
            }
            if (results.data.length > 0) {
              if (!schema.value.options) {
                schema.value.options = []
              }
              results.data
                .filter((row) => row.length > 0 && row[0].trim().length > 0)
                .forEach((row) => {
                  const val = row.shift().trim()
                  schema.value.options.push({
                    value: val,
                    label: row.length > 0 ? row.join(results.meta.delimiter) : val
                  })
                })
            } else {
              console.error(results.error)
            }
          }
        })
      }
    })

    return {
      optionsCount,
      optionsFile,
      schema,
      optionsList,
      hasMoreOptions,
      showMoreOptions,
      deleteOption,
      addOption,
      deleteOptions
    }
  }
})
</script>
