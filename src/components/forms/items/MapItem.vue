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
      <q-input class="q-mb-md" v-model="schema.mapHeight" :label="$t('form.geo.map_height')" :hint="$t('form.geo.map_height_hint')" placeholder="400px" :disable="readOnly" />
    </div>
    <div class="col-md-6 col-sm-12">
      <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
      <q-input class="q-mb-md" v-model="schema.default" :label="$t('form.default')" :hint="$t('form.default_hint')" :disable="readOnly" />
      <q-select class="q-mb-md" v-model="schema.geometryType" :options="geoTypeOptions" :label="$t('form.geo.type')" :hint="$t('form.geo.type_hint')" emit-value map-options :disable="readOnly" />
      <q-input class="q-mb-md" v-model.number="schema.center" :label="$t('form.geo.center')" :hint="$t('form.geo.center_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model.number="schema.zoom" type="number" :label="$t('form.geo.zoom')" :hint="$t('form.geo.zoom_hint')" :disable="readOnly" />
      <q-toggle class="q-mb-md" v-model.number="schema.geoLocation" :label="$t('form.geo.geo_location')" dense :disable="readOnly" />
      <br/>
      <q-toggle class="q-mb-md" v-model.number="schema.multiple" :label="$t('form.multiple')" dense :disable="readOnly" />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { t } from '../../../boot/i18n'

export default defineComponent({
  name: 'MapItem',
  props: ['modelValue', 'readOnly'],
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const schema = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const geoTypes = ['Point', 'Polygon']

    const geoTypeOptions = computed(() => {
      return geoTypes.map(tp => {
        return {
          value: tp,
          label: t('form.geo.types.' + tp)
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
    })

    return {
      schema,
      geoTypeOptions
    }
  }
})
</script>
