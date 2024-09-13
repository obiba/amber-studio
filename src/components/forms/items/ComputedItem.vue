<template>
  <div class="row q-col-gutter-lg">
    <div class="col-md-6 col-sm-12">
      <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
      <q-input
        class="q-mb-md"
        v-model="schema.compute"
        type="textarea"
        autogrow
        :label="$t('form.compute')"
        :hint="$t('form.compute_hint')"
        :disable="readOnly" />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'ComputedItem',
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

    return {
      schema
    }
  }
})
</script>
