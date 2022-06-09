<template>
  <div class="row q-col-gutter-lg">
    <div class="col-md-6 col-sm-12">
      <p class="text-weight-bold q-mb-sm">{{ $t('form.data') }}</p>
      <q-toggle class="q-mb-md" v-model.number="value.required" :label="$t('form.required')" :hint="$t('form.required_hint')" dense :disable="readOnly" />
      <q-input class="q-mb-md" v-model="value.validation" :label="$t('form.validation')" :hint="$t('form.validation_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="value.validationMessage" :label="$t('form.validation_message')" :hint="$t('form.validation_message_hint')" :disable="readOnly" />

      <p class="text-weight-bold q-mb-sm">{{ $t('form.rendering') }}</p>
      <q-input class="q-mb-md" v-model="value.condition" :label="$t('form.condition')" :hint="$t('form.condition_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="value.labelClass" :label="$t('form.label_class')" :hint="$t('form.label_class_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="value.icon" :label="$t('form.icon')" :hint="$t('form.icon_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="value.size" :label="$t('form.size')" :hint="$t('form.size_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model="value.color" :label="$t('form.color')" :hint="$t('form.color_hint')" :disable="readOnly" />
    </div>
    <div class="col-md-6 col-sm-12">
      <p class="text-weight-bold q-mb-sm">{{ $t('form.settings') }}</p>
      <q-input class="q-mb-md" v-model="value.default" :label="$t('form.default')" :hint="$t('form.default_hint')" :disable="readOnly" />
      <q-input class="q-mb-md" v-model.number="value.max" type="number" :label="$t('form.max')" :hint="$t('form.max_hint')" :disable="readOnly" />
    </div>
  </div>
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
