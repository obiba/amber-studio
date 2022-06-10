<template>
  <div class="row q-col-gutter-lg">
    <div class="col-md-6 col-sm-12">
      <p class="text-weight-bold q-mb-sm">{{ $t('form.data') }}</p>
      <q-toggle class="q-mb-md" v-model.number="schema.required" :label="$t('form.required')" :hint="$t('form.required_hint')" dense :disable="readOnly" />
      <q-input class="q-mb-md" v-model="schema.validation" :label="$t('form.validation')" :hint="$t('form.validation_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="schema.validationMessage" :label="$t('form.validation_message')" :hint="$t('form.validation_message_hint')" :disable="readOnly" />
      <p class="text-weight-bold q-mb-sm">{{ $t('form.rendering') }}</p>
      <q-input class="q-mb-md" v-model="schema.condition" :label="$t('form.condition')" :hint="$t('form.condition_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="schema.labelClass" :label="$t('form.label_class')" :hint="$t('form.label_class_hint')" :disable="readOnly" />
    </div>
    <div class="col-md-6 col-sm-12">
      <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
      <q-input class="q-mb-md" v-model="schema.default" :label="$t('form.default')" :hint="$t('form.default_hint')" :disable="readOnly" />
      <options-item v-model="schema" :read-only="readOnly"/>
    </div>
  </div>
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
