<template>
  <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
  <q-input class="q-mb-md" v-model="value.placeholder" :label="$t('form.placeholder')" :hint="$t('form.placeholder_hint')" :disable="readOnly" />
  <q-input class="q-mb-md" v-model="value.hint" :label="$t('form.hint')" :hint="$t('form.hint_hint')" :disable="isReadOnly" />
  <q-input class="q-mb-md" v-model="value.default" :label="$t('form.default')" :hint="$t('form.default_hint')" :disable="readOnly" />
  <q-input class="q-mb-md" v-model.number="value.mask" :label="$t('form.mask')" :hint="$t('form.mask_hint')" :disable="readOnly" />

  <p class="text-weight-bold q-mb-sm">{{ $t('form.style') }}</p>
  <q-input class="q-mb-md" v-model="value.labelClass" :label="$t('form.label_class')" :hint="$t('form.label_class_hint')" :disable="readOnly" />
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'TextItem',
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
