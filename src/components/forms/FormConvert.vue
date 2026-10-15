<template>
  <q-dialog v-model="show" persistent maximized>
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">{{ t('form.convert.title') }}</div>
        <q-space />
        <q-select v-if="locales.length > 1" v-model="locale" :options="locales" dense options-dense class="q-mr-md" style="min-width: 80px" />
        <q-btn :label="t('cancel')" flat v-close-popup />
        <q-btn :label="t('form.convert.apply')" color="primary" :disable="!result" @click="onApply" />
      </q-card-section>
      <q-separator />
      <q-card-section v-if="result">
        <div class="text-body2 text-secondary q-mb-sm" v-html="t('form.convert.hint')" />
        <q-banner v-if="result.diagnostics.length === 0" dense class="bg-green-1 text-positive">
          {{ t('form.convert.no_diagnostics') }}
        </q-banner>
        <q-list v-else dense bordered separator>
          <q-item v-for="(diag, index) in result.diagnostics" :key="index">
            <q-item-section avatar>
              <q-icon :name="diag.level === 'warn' ? 'warning' : 'info'" :color="diag.level === 'warn' ? 'warning' : 'grey'" />
            </q-item-section>
            <q-item-section>
              <q-item-label><code v-if="diag.key" class="q-mr-sm">{{ diag.key }}</code>{{ diag.message }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section v-if="result" class="row q-col-gutter-lg">
        <div class="col-md-6 col-xs-12">
          <div class="row items-center q-mb-sm">
            <div class="text-subtitle1">{{ t('form.convert.legacy') }}</div>
            <q-space />
            <q-btn :label="t('form.convert.copy_data')" icon="content_copy" flat size="sm" @click="onCopyData" />
          </div>
          <q-card bordered flat class="q-pa-md">
            <AmberForm :key="'legacy' + remountCounter" :schema="schema" v-model="legacyData" :locale="locale" apply-defaults debug />
          </q-card>
        </div>
        <div class="col-md-6 col-xs-12">
          <div class="row items-center q-mb-sm">
            <div class="text-subtitle1">{{ t('form.convert.converted') }}</div>
          </div>
          <q-card bordered flat class="q-pa-md">
            <AmberForm :key="'json' + remountCounter" :schema="result.form" v-model="jsonData" :locale="locale" apply-defaults />
          </q-card>
        </div>
        <div class="col-12">
          <q-banner dense :class="sameData ? 'bg-green-1 text-positive' : 'bg-orange-1 text-warning'">
            {{ t(sameData ? 'form.convert.same_data' : 'form.convert.different_data') }}
          </q-banner>
        </div>
        <div class="col-md-6 col-xs-12">
          <div class="bg-black text-white q-pa-md"><pre>{{ legacyDataStr }}</pre></div>
        </div>
        <div class="col-md-6 col-xs-12">
          <div class="bg-black text-white q-pa-md"><pre>{{ jsonDataStr }}</pre></div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AmberForm } from '@obiba/quasar-ui-amber'
import { convertForm } from '../../utils/convertForm'

// converts a legacy form schema, previewing both forms side by side on the same data
const props = defineProps(['modelValue', 'schema'])
const emit = defineEmits(['update:modelValue', 'convert'])

const { t, locale: appLocale } = useI18n({ useScope: 'global' })

const result = ref(null)
const legacyData = ref({})
const jsonData = ref({})
const remountCounter = ref(0)
const locale = ref(appLocale.value)

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const locales = computed(() => Object.keys(props.schema?.i18n || {}))

// the same data whatever the order of the keys
const stable = (value) => JSON.stringify(value, (key, val) => val && typeof val === 'object' && !Array.isArray(val)
  ? Object.keys(val).sort().reduce((obj, k) => { obj[k] = val[k]; return obj }, {})
  : val, '  ')
const legacyDataStr = computed(() => stable(legacyData.value))
const jsonDataStr = computed(() => stable(jsonData.value))
const sameData = computed(() => legacyDataStr.value === jsonDataStr.value)

watch(show, (value) => {
  if (!value) return
  result.value = convertForm(JSON.parse(JSON.stringify(props.schema)))
  legacyData.value = {}
  jsonData.value = {}
  if (!locales.value.includes(locale.value) && locales.value.length > 0) locale.value = locales.value[0]
  remountCounter.value++
}, { immediate: true })

function onCopyData () {
  jsonData.value = JSON.parse(JSON.stringify(legacyData.value))
  remountCounter.value++
}

function onApply () {
  emit('convert', result.value.form)
  show.value = false
}
</script>
