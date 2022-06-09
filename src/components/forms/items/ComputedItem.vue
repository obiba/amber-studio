<template>
  <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
  <q-input class="q-mb-md" v-model="value.compute" :label="$t('form.compute')" :hint="$t('form.compute_hint')" :disable="readOnly" />
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'ComputedItem',
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
