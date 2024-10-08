<template>
  <div class="row q-col-gutter-lg">
    <div class="col-md-6 col-sm-12">
      <p class="text-weight-bold q-mb-sm">{{ $t('form.data') }}</p>
      <q-toggle class="q-mb-md" v-model.number="schema.required" :label="$t('form.required')" :hint="$t('form.required_hint')" dense :disable="readOnly" />
      <q-input class="q-mb-md" v-model="schema.validation" type="textarea" autogrow :label="$t('form.validation')" :hint="$t('form.validation_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="schema.validationMessage" :label="$t('form.validation_message')" :hint="$t('form.validation_message_hint')" :disable="readOnly" />
      <p class="text-weight-bold q-mb-sm">{{ $t('form.rendering') }}</p>
      <q-input class="q-mb-md" v-model="schema.condition" type="textarea" autogrow :label="$t('form.condition')" :hint="$t('form.condition_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="schema.labelClass" :label="$t('form.label_class')" :hint="$t('form.label_class_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="schema.imageClass" :label="$t('form.image_class')" :hint="$t('form.image_class_hint')" :disable="readOnly" />
    </div>
    <div class="col-md-6 col-sm-12">
      <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
      <q-input class="q-mb-md" v-model="schema.hint" :label="$t('form.hint')" :hint="$t('form.hint_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="schema.default" :label="$t('form.default')" :hint="$t('form.default_hint')" :disable="readOnly" />
      <q-toggle class="q-mb-md" v-model.number="schema.multiple" :label="$t('form.multiple')" dense :disable="readOnly" />

      <options-item v-model="schema" :read-only="readOnly"/>
      <q-toggle class="q-mt-md q-mb-md" v-model.number="schema.showSelect" :label="$t('form.show_area_select')" dense :disable="readOnly" />

      <p class="text-weight-bold q-mb-sm q-mt-md">{{ $t('form.image') }}</p>
      <p class="text-grey">{{ $t('form.image_hint') }}</p>
      <q-input class="q-mb-md" v-model="schema.imageSrc" :label="$t('form.image_src')" :hint="$t('form.image_src_hint')" :disable="readOnly" />
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
          <q-input class="q-mb-md" v-model="area.value" :label="$t('form.area_value')" :disable="readOnly" />
        </div>
        <div class="col-3">
          <q-input class="q-mb-md" v-model="area.fill" :label="$t('form.area_fill')" :disable="readOnly">
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="area.fill" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div :class="readOnly ? 'col-7' : 'col-6'">
          <q-input class="q-mb-md" v-model="area.points" :label="$t('form.area_points')" :disable="readOnly" />
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
      <div class="row q-col-gutter-lg" v-if="!readOnly">
        <div class="col-4">
          <q-btn
            color="primary"
            icon="add"
            :title="$t('form.add_area_hint')"
            @click="addArea()"
            class="q-mr-sm"
          />
          <q-btn
            flat
            round
            color="negative"
            icon="delete_outline"
            :title="$t('form.delete_areas_hint')"
            @click="deleteAreas()"
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
</template>

<script>
import { ref, computed, watch, defineComponent } from 'vue'
import OptionsItem from './OptionsItem.vue'
import * as Papa from 'papaparse'

export default defineComponent({
  name: 'ImageSelectItem',
  props: ['modelValue', 'readOnly'],
  emits: ['update:modelValue'],
  components: { OptionsItem },
  setup (props, { emit }) {
    const areasCount = ref(5)
    const imageFile = ref(null)
    const areasFile = ref(null)

    const schema = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const areasList = computed(() => {
      return props.modelValue.areas ? props.modelValue.areas.slice(0, areasCount.value) : []
    })

    const hasMoreAreas = computed(() => {
      return props.modelValue.areas && props.modelValue.areas.length > areasCount.value
    })

    function showMoreAreas () {
      areasCount.value = areasCount.value + 5
    }

    function deleteArea (area) {
      schema.value.areas = props.modelValue.areas.filter(ar => `${ar.value}-${ar.points}` !== `${area.value}-${area.points}`)
      if (areasCount.value > 5) {
        areasCount.value = areasCount.value - 1
      }
    }
    function addArea () {
      if (!props.modelValue.areas) {
        schema.value.areas = []
      }
      const val = '' + (props.modelValue.areas.length + 1)
      schema.value.areas.push({
        value: val,
        fill: '#cccccc',
        points: '0,0 10,0 10,10 0,10'
      })
    }

    function deleteAreas (area) {
      schema.value.areas = []
    }

    watch(imageFile, async (newValue) => {
      if (newValue !== null) {
        const reader = new FileReader()
        reader.onload = evt => {
          schema.value.imageSrc = evt.target.result
        }
        reader.onerror = evt => {
          console.error(evt)
        }
        reader.readAsDataURL(newValue)
      }
    })

    watch(areasFile, async (newValue) => {
      if (newValue !== null) {
        Papa.parse(newValue, {
          header: false,
          delimiter: newValue.name.endsWith('.tsv') ? '\t' : ',',
          complete: function (results, file) {
            if (results.errors.length === 0) {
              console.error(results.error)
            }
            if (results.data.length > 0) {
              if (!schema.value.areas) {
                schema.value.areas = []
              }
              results.data
                .filter((row) => row.length > 2 && row[0].trim().length > 0)
                .forEach((row) => {
                  const val = row[0]
                  const fill = row[1]
                  row.splice(0, 2)
                  schema.value.areas.push({
                    value: val,
                    fill: fill,
                    points: row.join(',')
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
      areasCount,
      imageFile,
      areasFile,
      schema,
      areasList,
      hasMoreAreas,
      showMoreAreas,
      deleteArea,
      addArea,
      deleteAreas
    }
  }
})
</script>
