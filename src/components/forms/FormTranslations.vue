<template>
  <div>
    <q-table
      flat
      :rows="rows"
      :columns="columns"
      :filter="filter"
      binary-state-sort
      row-key="key"
      selection="multiple"
      v-model:selected="selected"
      v-model:pagination="paginationOpts"
    >

      <template v-slot:top>
        <q-btn
          color="primary"
          icon="add"
          :title="$t('form.tr_add')"
          @click="onAddTranslation()"
          class="q-mr-md" />
        <q-btn
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
          class="q-mr-md"
          flat
          round
          color="red"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="$t('form.tr_delete_selected')"
          @click="onConfirmDeleteMultiple()" />
        <q-space />
        <q-input
          filled
          borderless
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

    <q-dialog v-model='showAddTranslation' persistent>
      <q-card>
        <q-card-section class="row items-center">
           <div class="col-12">
            <q-input
              filled
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
            color='positive'
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
            color='positive'
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
            color='positive'
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
            color='positive'
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
import { locales } from '../../boot/i18n'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'FormTranslations',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup () {
    return {
      v$: useVuelidate(),
      selected: ref([]),
      filter: ref('')
    }
  },
  data () {
    return {
      showAddTranslation: false,
      showConfirmDelete: false,
      showConfirmClean: false,
      showConfirmMerge: false,
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

      locales.forEach(loc => {
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
          locales.forEach(loc => {
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
          locales.forEach(loc => { row[loc] = key })
          this.rows.push(row)
          obsKeys.push(key)
        }
      }
      if (items) {
        items.forEach(item => {
          ['label', 'description', 'placeholder', 'hint', 'validationMessage'].forEach(field => addObsKey(item[field]))
          if (!item.type || item.type === 'group') {
            obsKeys = this.appendObservedKeys(item.items, obsKeys)
          } else if (item.options) {
            item.options.forEach(option => addObsKey(option.label))
          }
        })
      }
      return obsKeys
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
      locales.forEach(loc => {
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
    }
  }
})
</script>
