<template>
  <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
  <q-input class="q-mb-md" v-model="value.default" :label="$t('form.default')" :hint="$t('form.default_hint')" :disable="readOnly" />
  <q-input class="q-mb-md" v-model.number="value.max" type="number" :label="$t('form.max')" :hint="$t('form.max_hint')" :disable="readOnly" />

  <p class="text-weight-bold q-mb-sm">{{ $t('form.style') }}</p>
  <q-input class="q-mb-md" v-model="value.labelClass" :label="$t('form.label_class')" :hint="$t('form.label_class_hint')" :disable="readOnly" />
  <q-input class="q-mb-md" v-model="value.icon" :label="$t('form.icon')" :hint="$t('form.icon_hint')" :disable="readOnly" />
  <q-input class="q-mb-md" v-model="value.size" :label="$t('form.size')" :hint="$t('form.size_hint')" :disable="readOnly" />
  <q-input class="q-mb-md" v-model="value.color" :label="$t('form.color')" :hint="$t('form.color_hint')" :disable="readOnly" />
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'RatingItem',
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

    return {
      value
    }
  }
})
</script>
