<template>
  <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
  <q-input class="q-mb-md" v-model="value.default" :label="$t('form.default')" :hint="$t('form.default_hint')" :disable="readOnly" />

  <options-item v-model="value" :read-only="readOnly"/>

  <p class="text-weight-bold q-mb-sm">{{ $t('form.style') }}</p>
  <q-input class="q-mb-md" v-model="value.labelClass" :label="$t('form.label_class')" :hint="$t('form.label_class_hint')" :disable="readOnly" />
</template>

<script>
import { computed, defineComponent } from 'vue'
import OptionsItem from './OptionsItem.vue'

export default defineComponent({
  name: 'RadioGroupItem',
  props: ['modelValue', 'readOnly'],
  emits: ['update:modelValue'],
  components: { OptionsItem },
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
