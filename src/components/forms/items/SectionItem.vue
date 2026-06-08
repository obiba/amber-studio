<template>
  <div class="row q-col-gutter-lg">
    <div class="col-md-6 col-sm-12">
      <p class="text-weight-bold q-mb-sm">{{ t('form.rendering') }}</p>
      <q-input class="q-mb-md" v-model="schema.condition" type="textarea" autogrow :label="t('form.condition')" :hint="t('form.condition_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="schema.labelClass" :label="t('form.label_class')" :hint="t('form.label_class_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="schema.descriptionClass" :label="t('form.description_class')" :hint="t('form.description_class_hint')" autogrow :disable="readOnly" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps(['modelValue', 'readOnly'])
const emit = defineEmits(['update:modelValue'])

const schema = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
</script>
