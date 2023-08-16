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
          :title="$t('form.tr_add_key')"
          @click="onAddTranslation()"
          class="q-mr-md" />
        <q-btn
          v-if="!isReadOnly"
          class="q-mr-md"
          flat
          round
          color="black"
          icon="merge"
          :title="$t('form.tr_merge_items')"
          @click="onConfirmMergeObservedKeys()" />
        <q-btn
          v-if="false"
          class="q-mr-md"
          flat
          round
          color="black"
          icon="cleaning_services"
          :title="$t('form.tr_clean')"
          @click="onConfirmClean()" />
        <q-btn
          v-if="!isReadOnly"
          class="q-mr-md"
          flat
          round
          color="negative"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="$t('form.tr_delete_selected')"
          @click="onConfirmDeleteMultiple()" />
        <q-btn-dropdown
          flat
          icon="translate"
          :title="$t('form.tr_locales_hint')">
          <q-list>
            <q-item v-for="loc in allLocales" :key="loc">
              <q-item-section>
                <q-checkbox @click="onToggleFormLocale(loc)" v-model="formLocales" :val="loc"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-uppercase">{{loc}}</q-item-label>
                <q-item-label caption>{{$t('locales.' + loc) === 'locales.' + loc ? '' : $t('locales.' + loc)}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          v-if="!isReadOnly"
          flat
          icon="file_upload"
          :title="$t('form.tr_import_hint')"
          @click="onImportTranslations()"
          class="q-mr-md" />
        <q-btn-dropdown
          flat
          icon="download"
          :title="$t('form.tr_export_hint')">
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
          :placeholder="$t('search')"
          :title="$t('form.tr_search_hint')">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell='props'>
        <q-td :props="props">
          {{ props.value }}
          <q-popup-edit v-model="props.row[props.col.name]" @hide="onRowEdit">
            <q-input v-model="props.row[props.col.name]" dense autofocus />
          </q-popup-edit>
        </q-td>
      </template>
    </q-table>

    <div v-else>

      <q-btn
        v-if="!isReadOnly"
        color="primary"
        icon="add"
        :label="$t('form.tr_add')">
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section @click="onAddTranslation()">{{ $t('form.tr_add_key') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="mergeObservedKeys()">{{ $t('form.tr_merge_items') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="onImportTranslations()">{{ $t('form.tr_import') }}</q-item-section>
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
              :label="$t('form.tr_key')"
              lazy-rules
              class="q-ma-sm"
              @blur="v$.newTranslationData.key.$touch"
              :error="v$.newTranslationData.key.$error"
              :hint="$t('required')"
            >
              <template v-slot:error>
                <div v-for="error in v$.newTranslationData.key.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='addTranslation'
            :disable='disableAddTranslation'
            :label="$t('add')"
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
            {{$t('form.tr_merge_confirm')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='mergeObservedKeys'
            :label="$t('merge')"
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
            {{$t('form.tr_clean_confirm')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='cleanKeys'
            :label="$t('clean')"
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
            {{$t('form.tr_delete_selected_confirm')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteSelected'
            :label="$t('delete')"
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
            {{$t('form.tr_delete_locale_confirm')}}
          </div>
          <div class="q-mt-md">
            <span class="text-weight-bold text-uppercase">{{localeToDelete}}</span>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteLocale'
            :label="$t('delete')"
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
            :label="$t('form.tr_import_file')">
            <template v-slot:prepend>
              <q-icon name="add" @click.stop />
            </template>

            <template v-slot:hint>
              {{ $t('form.tr_import_hint') }}
            </template>
          </q-file>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='importTranslations'
            :disable="disableImportTranslations"
            :label="$t('import')"
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

<script>
import { defineComponent, ref } from 'vue'
import { formI18nService } from '../../services/form'
import { locales } from '../../boot/i18n'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { Notify } from 'quasar'
import AuthMixin from '../../mixins/AuthMixin'

export default defineComponent({
  name: 'FormTranslations',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  mixins: [AuthMixin],
  setup () {
    return {
      locales: locales,
      v$: useVuelidate(),
      selected: ref([]),
      filter: ref(''),
      showImportTranslations: ref(false),
      translationsFile: ref(null)
    }
  },
  data () {
    return {
      showAddTranslation: false,
      showConfirmDelete: false,
      showConfirmDeleteLocale: false,
      showConfirmClean: false,
      showConfirmMerge: false,
      localeToDelete: ref(null),
      paginationOpts: {
        sortBy: 'key',
        descending: false,
        rowsPerPage: 10
      },
      rows: ref([]),
      newTranslationData: {
        key: ''
      }
    }
  },
  validations: {
    newTranslationData: {
      key: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    }
  },
  watch: {
    modelValue: function (newValue, oldValue) {
      this.initRows()
    }
  },
  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    },
    columns () {
      const cols = [
        {
          name: 'key',
          required: true,
          label: this.$t('form.tr_key'),
          align: 'left',
          field: 'key',
          sortable: true
        }
      ]

      this.formLocales.forEach(loc => {
        cols.push({
          name: loc,
          label: loc.toUpperCase(),
          align: 'left',
          field: loc,
          sortable: true
        })
      })

      return cols
    },
    disableAddTranslation () {
      return this.v$.newTranslationData.$invalid
    },
    disableImportTranslations () {
      return this.translationsFile === null
    },
    formLocales () {
      return this.value.schema.i18n && Object.keys(this.value.schema.i18n).length > 0 ? Object.keys(this.value.schema.i18n).sort() : ['en']
    },
    allLocales () {
      const allLocales = [...this.locales]
      this.formLocales.forEach((loc) => {
        if (!allLocales.includes(loc)) {
          allLocales.push(loc)
        }
      })
      return allLocales
    }
  },
  mounted () {
    if (this.value) {
      this.initRows()
    }
  },
  methods: {
    initRows () {
      // read i18n object and make rows
      if (this.value && this.value.schema) {
        if (this.value.schema.i18n) {
          this.formLocales.forEach(loc => {
            if (this.value.schema.i18n[loc]) {
              Object.entries(this.value.schema.i18n[loc]).forEach(([key, value]) => {
                let found = false
                for (let i = 0; i < this.rows.length; i++) {
                  if (!found && this.rows[i].key === key) {
                    found = true
                    this.rows[i][loc] = value
                  }
                }
                if (!found) {
                  const row = { key: key }
                  row[loc] = value
                  this.rows.push(row)
                }
              })
            }
          })
        }
      }
    },
    mergeObservedKeys () {
      // read items texts and merge/append to rows
      if (this.value && this.value.schema) {
        let obsKeys = []
        if (this.rows && this.rows.length > 0) {
          this.rows.forEach(row => {
            if (!obsKeys.includes(row.key)) {
              obsKeys.push(row.key)
            }
          })
        } else if (this.value.schema.i18n && this.value.schema.i18n.en) {
          obsKeys = Object.keys(this.value.schema.i18n.en)
        }
        this.appendObservedKeys([this.value.schema], obsKeys)
      }
      this.onRowEdit()
    },
    appendObservedKeys (items, keys) {
      let obsKeys = keys
      const addObsKey = (key) => {
        if (key && key.trim().length > 0 && !key.includes('.') && !obsKeys.includes(key)) {
          const row = { key: key }
          this.formLocales.forEach(loc => { row[loc] = key })
          this.rows.push(row)
          obsKeys.push(key)
        }
      }
      if (items) {
        items.forEach(item => {
          ['label', 'description', 'placeholder', 'hint', 'validationMessage', 'closeLabel', 'idLabel', 'idDescription', 'idValidationMessage'].forEach(field => addObsKey(item[field]))
          if (!item.type || item.type === 'group') {
            obsKeys = this.appendObservedKeys(item.items, obsKeys)
          } else if (item.options) {
            item.options.forEach(option => addObsKey(option.label))
          }
        })
      }
      return obsKeys
    },
    onExport (format) {
      let accept = 'application/json'
      if (format === 'csv') {
        accept = 'text/csv'
      } else if (format === 'xlsx') {
        accept = 'application/vnd.ms-excel'
      } else if (format === 'zip') {
        accept = 'application/zip'
      }
      formI18nService.downloadTranslations(accept, this.value._id)
        .then(response => {
          if (response.status === 200) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            const ext = format
            link.setAttribute('download', `${this.value.name}-i18n.${ext}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
          } else {
            Notify.create({
              message: 'Form translations export failed.',
              color: 'negative'
            })
          }
        })
    },
    keyExists (key) {
      return this.rows.map(row => row.key).includes(key)
    },
    onRowEdit () {
      // do not know whether there was a change but update i18n anyway
      const toSave = this.value
      if (!toSave.schema.i18n) {
        toSave.schema.i18n = {}
      }
      if (Object.keys(toSave.schema.i18n).length === 0) {
        toSave.schema.i18n.en = {}
      }
      Object.keys(toSave.schema.i18n).forEach(loc => {
        toSave.schema.i18n[loc] = {}
        this.rows.forEach(row => {
          if (row.key && row.key.trim().length > 0 && row[loc]) {
            toSave.schema.i18n[loc][row.key] = row[loc]
          }
        })
      })
      this.value = toSave
    },
    onAddTranslation () {
      this.newTranslationData = {}
      this.showAddTranslation = true
    },
    onToggleFormLocale (locale) {
      if (this.value.schema.i18n[locale]) {
        this.localeToDelete = locale
        this.showConfirmDeleteLocale = true
      } else {
        this.value.schema.i18n[locale] = {}
        this.onRowEdit()
      }
    },
    addTranslation () {
      if (!this.keyExists(this.newTranslationData.key)) {
        this.rows.push({ key: this.newTranslationData.key })
        this.onRowEdit()
      } else {
        Notify.create({
          message: 'Translation key already exists.',
          color: 'negative'
        })
      }
    },
    onImportTranslations () {
      this.translationsFile = null
      this.showImportTranslations = true
    },
    importTranslations () {
      const that = this
      const toSave = this.value
      this.$papa.parse(this.translationsFile, {
        header: true,
        complete: function (results, file) {
          if (results.errors.length === 0 && results.meta.fields.includes('key')) {
            const locales = results.meta.fields.filter((f) => f !== 'key')
            if (!toSave.schema.i18n) {
              toSave.schema.i18n = {}
            }
            // array of row objects
            results.data.forEach((row) => {
              locales.forEach((locale) => {
                if (!toSave.schema.i18n[locale]) {
                  toSave.schema.i18n[locale] = {}
                }
                toSave.schema.i18n[locale][row.key] = row[locale]
              })
            })
            that.initRows()
          }
        }
      })
    },
    onConfirmClean () {
      this.showConfirmClean = true
    },
    cleanKeys () {
      // TODO
    },
    onConfirmMergeObservedKeys () {
      this.showConfirmMerge = true
    },
    onConfirmDeleteMultiple () {
      if (this.selected.length > 0) {
        this.showConfirmDelete = true
      }
    },
    deleteSelected () {
      const selectedKeys = this.selected.map(row => row.key)
      this.rows = this.rows.filter(row => !selectedKeys.includes(row.key))
      this.selected = []
      this.onRowEdit()
    },
    deleteLocale () {
      if (this.localeToDelete) {
        delete this.value.schema.i18n[this.localeToDelete]
        this.rows.forEach(row => {
          delete row[this.localeToDelete]
        })
        this.onRowEdit()
      }
    }
  }
})
</script>
