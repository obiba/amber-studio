<template>
  <div>
    <q-table
      v-if="rows && rows.length > 0"
      flat
      :rows="rows"
      :columns="columns"
      :filter="filter"
      binary-state-sort
      row-key="key"
      :selection="isReadOnly ? 'none' : 'multiple'"
      v-model:selected="selected"
      v-model:pagination="paginationOpts"
    >

      <template v-slot:top>
        <q-btn
          v-if="!isReadOnly"
          color="primary"
          icon="add"
          :title="t('form.tr_add_key')"
          @click="onAddTranslation()"
          class="q-mr-md" />
        <q-btn
          v-if="!isReadOnly"
          class="q-mr-md"
          flat
          round
          color="black"
          icon="merge"
          :title="t('form.tr_merge_items')"
          @click="onConfirmMergeObservedKeys()" />
        <q-btn
          v-if="false"
          class="q-mr-md"
          flat
          round
          color="black"
          icon="cleaning_services"
          :title="t('form.tr_clean')"
          @click="onConfirmClean()" />
        <q-btn
          v-if="!isReadOnly"
          class="q-mr-md"
          flat
          round
          color="negative"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="t('form.tr_delete_selected')"
          @click="onConfirmDeleteMultiple()" />
        <q-btn-dropdown
          flat
          icon="translate"
          :title="t('form.tr_locales_hint')">
          <q-list>
            <q-item v-for="loc in allLocales" :key="loc">
              <q-item-section>
                <q-checkbox @click="onToggleFormLocale(loc)" v-model="itwdLocales" :val="loc"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-uppercase">{{loc}}</q-item-label>
                <q-item-label caption>{{t('locales.' + loc) === 'locales.' + loc ? '' : t('locales.' + loc)}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          v-if="!isReadOnly"
          flat
          icon="file_upload"
          :title="t('form.tr_import_hint')"
          @click="onImportTranslations()"
          class="q-mr-md" />
        <q-btn-dropdown
          flat
          icon="download"
          :title="t('form.tr_export_hint')">
          <q-list>
            <q-item clickable v-close-popup @click="onExport('csv')">
              <q-item-section>
                <q-item-label>CSV</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onExport('xlsx')">
              <q-item-section>
                <q-item-label>Excel</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onExport('json')">
              <q-item-section>
                <q-item-label>JSON</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-space />
        <q-input
          dense
          debounce="300"
          v-model="filter"
          :placeholder="t('search')"
          :title="t('form.tr_search_hint')">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell='props' style="min-width: 200px; max-width: 300px; text-wrap: wrap;">
        <q-td :props="props">
          {{ props.value }}
          <q-popup-edit v-model="props.row[props.col.name]" @hide="onRowEdit">
            <q-input type="textarea" v-model="props.row[props.col.name]" dense autofocus />
          </q-popup-edit>
        </q-td>
      </template>
    </q-table>

    <div v-else>

      <q-btn
        v-if="!isReadOnly"
        color="primary"
        icon="add"
        :label="t('form.tr_add')">
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section @click="onAddTranslation()">{{ t('form.tr_add_key') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="mergeObservedKeys()">{{ t('form.tr_merge_items') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="onImportTranslations()">{{ t('form.tr_import') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <q-dialog v-model='showAddTranslation' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section class="row items-center">
           <div class="col-12">
            <q-input
              v-model='newTranslationData.key'
              :label="t('form.tr_key')"
              lazy-rules
              class="q-ma-sm"
              @blur="v$.newTranslationData.key.$touch"
              :error="v$.newTranslationData.key.$error"
              :hint="t('required')"
            >
              <template v-slot:error>
                <div v-for="error in v$.newTranslationData.key.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='addTranslation'
            :disable='disableAddTranslation'
            :label="t('add')"
            type='submit'
            color='primary'
            v-close-popup
          >
           <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showConfirmMerge" persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('form.tr_merge_confirm')}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='mergeObservedKeys'
            :label="t('merge')"
            type='submit'
            color='primary'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showConfirmClean" persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('form.tr_clean_confirm')}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='cleanKeys'
            :label="t('clean')"
            type='submit'
            color='primary'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showConfirmDelete" persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('form.tr_delete_selected_confirm')}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteSelected'
            :label="t('delete')"
            type='submit'
            color='primary'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showConfirmDeleteLocale" persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('form.tr_delete_locale_confirm')}}
          </div>
          <div class="q-mt-md">
            <span class="text-weight-bold text-uppercase">{{localeToDelete}}</span>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteLocale'
            :label="t('delete')"
            type='submit'
            color='primary'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showImportTranslations' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-file
            dense
            bottom-slots
            clearable
            v-model="translationsFile"
            accept=".txt,.csv,.tsv"
            :label="t('form.tr_import_file')">
            <template v-slot:prepend>
              <q-icon name="add" @click.stop />
            </template>

            <template v-slot:hint>
              {{ t('form.tr_import_hint') }}
            </template>
          </q-file>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='importTranslations'
            :disable="disableImportTranslations"
            :label="t('import')"
            type='submit'
            color='primary'
            v-close-popup
          >
           <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { interviewDesignI18nService } from '../../services/interview'
import { locales } from '../../boot/i18n'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { Notify } from 'quasar'
import { useAuth } from 'src/composables/useAuth'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const { isReadOnly } = useAuth()
const { proxy } = getCurrentInstance()

// Refs
const selected = ref([])
const filter = ref('')
const showImportTranslations = ref(false)
const translationsFile = ref(null)
const showAddTranslation = ref(false)
const showConfirmDelete = ref(false)
const showConfirmDeleteLocale = ref(false)
const showConfirmClean = ref(false)
const showConfirmMerge = ref(false)
const localeToDelete = ref(null)
const paginationOpts = ref({
  sortBy: 'key',
  descending: false,
  rowsPerPage: 10
})
const rows = ref([])
const newTranslationData = ref({
  key: ''
})

// Vuelidate
const rules = {
  newTranslationData: {
    key: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    }
  }
}

const v$ = useVuelidate(rules, { newTranslationData })

// Computed
const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const columns = computed(() => {
  const cols = [
    {
      name: 'key',
      required: true,
      label: t('form.tr_key'),
      align: 'left',
      field: 'key',
      sortable: true
    }
  ]

  itwdLocales.value.forEach(loc => {
    cols.push({
      name: loc,
      label: loc.toUpperCase(),
      align: 'left',
      field: loc,
      sortable: true
    })
  })

  return cols
})

const disableAddTranslation = computed(() => v$.value.newTranslationData.$invalid)
const disableImportTranslations = computed(() => translationsFile.value === null)

const itwdLocales = computed(() => {
  return value.value.i18n && Object.keys(value.value.i18n).length > 0 ? Object.keys(value.value.i18n).sort() : ['en']
})

const allLocales = computed(() => {
  const all = [...locales]
  itwdLocales.value.forEach((loc) => {
    if (!all.includes(loc)) {
      all.push(loc)
    }
  })
  return all
})

// Methods
function initRows() {
  // read i18n object and make rows
  if (value.value && value.value) {
    if (value.value.i18n) {
      itwdLocales.value.forEach(loc => {
        if (value.value.i18n[loc]) {
          Object.entries(value.value.i18n[loc]).forEach(([key, val]) => {
            let found = false
            for (let i = 0; i < rows.value.length; i++) {
              if (!found && rows.value[i].key === key) {
                found = true
                rows.value[i][loc] = val
              }
            }
            if (!found) {
              const row = { key: key }
              row[loc] = val
              rows.value.push(row)
            }
          })
        }
      })
    }
  }
}

function mergeObservedKeys() {
  // read items texts and merge/append to rows
  if (value.value) {
    let obsKeys = []
    if (rows.value && rows.value.length > 0) {
      rows.value.forEach(row => {
        if (!obsKeys.includes(row.key)) {
          obsKeys.push(row.key)
        }
      })
    } else if (value.value.i18n && value.value.i18n.en) {
      obsKeys = Object.keys(value.value.i18n.en)
    }
    obsKeys = appendObservedKeys([value.value], obsKeys)
    appendObservedKeys(value.value.steps, obsKeys)
  }
  onRowEdit()
}

function appendObservedKeys(steps, keys) {
  const obsKeys = keys
  const addObsKey = (key) => {
    if (key && key.trim().length > 0 && !key.includes('.') && !obsKeys.includes(key)) {
      const row = { key: key }
      itwdLocales.value.forEach(loc => { row[loc] = key })
      rows.value.push(row)
      obsKeys.push(key)
    }
  }
  if (steps) {
    steps.forEach(step => {
      ['label', 'description', 'interviewer_instructions', 'participant_instructions'].forEach(field => addObsKey(step[field]))
    })
  }
  return obsKeys
}

function onExport(format) {
  let accept = 'application/json'
  if (format === 'csv') {
    accept = 'text/csv'
  } else if (format === 'xlsx') {
    accept = 'application/vnd.ms-excel'
  } else if (format === 'zip') {
    accept = 'application/zip'
  }
  interviewDesignI18nService.downloadTranslations(accept, value.value._id)
    .then(response => {
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        const ext = format
        link.setAttribute('download', `${value.value.name}-i18n.${ext}`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } else {
        Notify.create({
          message: 'Interview design translations export failed.',
          color: 'negative'
        })
      }
    })
}

function keyExists(key) {
  return rows.value.map(row => row.key).includes(key)
}

function onRowEdit() {
  // do not know whether there was a change but update i18n anyway
  const toSave = { ...value.value }
  if (!toSave.i18n) {
    toSave.i18n = {}
  }
  if (Object.keys(toSave.i18n).length === 0) {
    toSave.i18n.en = {}
  }
  Object.keys(toSave.i18n).forEach(loc => {
    toSave.i18n[loc] = {}
    rows.value.forEach(row => {
      if (row.key && row.key.trim().length > 0 && row[loc]) {
        toSave.i18n[loc][row.key] = row[loc]
      }
    })
  })
  value.value = toSave
}

function onAddTranslation() {
  newTranslationData.value = {}
  showAddTranslation.value = true
}

function onToggleFormLocale(locale) {
  if (value.value.i18n[locale]) {
    localeToDelete.value = locale
    showConfirmDeleteLocale.value = true
  } else {
    rows.value.forEach(row => {
      row[locale] = row.en ? row.en : row.key
    })
    value.value.i18n[locale] = {}
    onRowEdit()
  }
}

function addTranslation() {
  if (!keyExists(newTranslationData.value.key)) {
    rows.value.push({ key: newTranslationData.value.key })
    onRowEdit()
  } else {
    Notify.create({
      message: 'Translation key already exists.',
      color: 'negative'
    })
  }
}

function onImportTranslations() {
  translationsFile.value = null
  showImportTranslations.value = true
}

function importTranslations() {
  const toSave = value.value
  const delim = translationsFile.value.name.endsWith('.tsv') ? '\t' : ','
  proxy.$papa.parse(translationsFile.value, {
    header: true,
    delimiter: delim,
    complete: function (results, file) {
      if (results.errors.length === 0) {
        console.error(results.error)
      }
      if (results.data.length > 0 && results.meta.fields.includes('key')) {
        const localesArr = results.meta.fields.filter((f) => f !== 'key')
        if (!toSave.i18n) {
          toSave.i18n = {}
        }
        // array of row objects
        results.data
          .filter((row) => row.key.trim().length > 0)
          .forEach((row) => {
            localesArr.forEach((locale) => {
              if (!toSave.i18n[locale]) {
                toSave.i18n[locale] = {}
              }
              toSave.i18n[locale][row.key] = row[locale]
            })
          })
        initRows()
      } else {
        console.error(results.error)
      }
    }
  })
}

function onConfirmClean() {
  showConfirmClean.value = true
}

function cleanKeys() {
  // TODO
}

function onConfirmMergeObservedKeys() {
  showConfirmMerge.value = true
}

function onConfirmDeleteMultiple() {
  if (selected.value.length > 0) {
    showConfirmDelete.value = true
  }
}

function deleteSelected() {
  const selectedKeys = selected.value.map(row => row.key)
  rows.value = rows.value.filter(row => !selectedKeys.includes(row.key))
  selected.value = []
  onRowEdit()
}

function deleteLocale() {
  if (localeToDelete.value) {
    delete value.value.i18n[localeToDelete.value]
    rows.value.forEach(row => {
      delete row[localeToDelete.value]
    })
    onRowEdit()
  }
}

// Watchers
watch(() => props.modelValue, () => {
  initRows()
})

// Lifecycle
onMounted(() => {
  if (value.value) {
    initRows()
  }
})
</script>
