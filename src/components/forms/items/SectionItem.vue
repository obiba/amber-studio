<template>
  <p class="text-weight-bold q-mb-sm">{{ $t('form.style') }}</p>
  <q-input class="q-mb-md" v-model="value.labelClass" :label="$t('form.label_class')" :hint="$t('form.label_class_hint')" :disable="readOnly" />
  <q-input class="q-mb-md" v-model="value.descriptionClass" :label="$t('form.description_class')" :hint="$t('form.description_class_hint')" autogrow :disable="readOnly" />
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'SectionItem',
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
