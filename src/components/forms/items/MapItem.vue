<template>
  <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
  <q-input class="q-mb-md" v-model="value.default" :label="$t('form.default')" :hint="$t('form.default_hint')" :disable="readOnly" />
  <q-select class="q-mb-md" v-model="value.geometryType" :options="geoTypeOptions" :label="$t('form.geo.type')" :hint="$t('form.geo.type_hint')" emit-value map-options :disable="readOnly" />
  <q-input class="q-mb-md" v-model.number="value.center" :label="$t('form.geo.center')" :hint="$t('form.geo.center_hint')" :disable="readOnly" />
  <q-input class="q-mb-md" v-model.number="value.zoom" type="number" :label="$t('form.geo.zoom')" :hint="$t('form.geo.zoom_hint')" :disable="readOnly" />
  <q-toggle class="q-mb-md" v-model.number="value.geoLocation" :label="$t('form.geo.geo_location')" dense :disable="readOnly" />
  <q-toggle class="q-mb-md" v-model.number="value.multiple" :label="$t('form.multiple')" dense :disable="readOnly" />

  <p class="text-weight-bold q-mb-sm">{{ $t('form.style') }}</p>
  <q-input class="q-mb-md" v-model="value.labelClass" :label="$t('form.label_class')" :hint="$t('form.label_class_hint')" :disable="readOnly" />
  <q-input class="q-mb-md" v-model="value.mapHeight" :label="$t('form.geo.map_height')" :hint="$t('form.geo.map_height_hint')" placeholder="400px" :disable="readOnly" />
</template>

<script>
import { computed, defineComponent } from 'vue'
import { t } from '../../../boot/i18n'

export default defineComponent({
  name: 'MapItem',
  props: ['modelValue', 'readOnly'],
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const value = computed({
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
      value,
      geoTypeOptions
    }
  }
})
</script>
