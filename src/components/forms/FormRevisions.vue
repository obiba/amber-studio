<template>
  <div>
    <q-table
      v-if="formRevisions && formRevisions.length > 0"
      flat
      :rows="formRevisions"
      :columns="columns"
      :filter="filter"
      row-key="revision"
      :selection="isReadOnly ? 'none' : 'multiple'"
      v-model:selected="selected"
      v-model:pagination='paginationOpts'
      @request='getTableFormRevisions'
    >
      <template v-slot:top>
        <q-btn
          v-if="!isReadOnly"
          class="q-mr-md"
          flat
          round
          color="negative"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="t('form.delete_form_revisions_hint')"
          @click="onConfirmDeleteMultiple()" />
        <q-space />
        <q-input
          dense
          debounce="300"
          v-model="filter"
          :placeholder="t('search')"
          :title="t('form.search_form_revision_hint')">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-createdAt='props'>
        <q-td :props='props'>
          {{ formatDate(props.row.createdAt) }}
        </q-td>
      </template>
      <template v-slot:body-cell-action='props'>
        <q-td :props='props'>
          <q-btn
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('form.export_form_revision_hint')"
            icon="file_download"
            @click='onExport(props.row)'>
          </q-btn>
          <q-btn
            v-if="!isReadOnly"
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('form.reinstate_form_revision_hint')"
            icon="undo"
            @click='onReinstate(props.row)'>
          </q-btn>
          <q-btn
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('form.view_form_revision_hint')"
            icon="visibility"
            @click='onView(props.row)'>
          </q-btn>
          <q-btn
            v-if="!isReadOnly"
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('form.delete_form_revision_hint')"
            icon="delete"
            @click='onConfirmDelete(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <div v-else class="text-grey-6">
      {{ t('form.no_revision') }}
    </div>

    <q-dialog v-model='showViewRevision' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-tabs
            v-model="viewTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="form" label="form" />
            <q-tab name="data" label="data" />
          </q-tabs>

          <q-separator/>

          <q-tab-panels v-model="viewTab">
            <q-tab-panel name="form" class="q-pl-none q-pr-none">
              <q-btn-dropdown icon="translate" flat size="sm" :label="locale">
                <q-list>
                  <q-item @click="onLocale(loc)" clickable v-close-popup v-for="loc in locales" :key="loc">
                    <q-item-section class="text-uppercase">{{ loc }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-separator  class="q-mt-md"/>
              <q-scroll-area style="height: 400px" class="q-pt-md">
                <BlitzForm :key='remountCounter' :schema='blitzarSchema' v-model='modelData' :columnCount='1' gridGap='32px'/>
              </q-scroll-area>
            </q-tab-panel>

            <q-tab-panel name="data" class="q-pl-none q-pr-none">
              <q-scroll-area style="height: 400px">
                <div class="bg-black text-white q-pa-md">
                  <pre>{{ modelDataStr }}</pre>
                </div>
              </q-scroll-area>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('close')" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmReinstateRevision' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('form.reinstate_form_revision_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedRevision.revision}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='reinstateFormRevision'
            :label="t('reinstate')"
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

    <q-dialog v-model='showConfirmDeleteRevision' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('form.delete_form_revision_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedRevision.revision}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteFormRevision'
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

    <q-dialog v-model='showConfirmDeleteRevisions' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('form.delete_form_revisions_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => g.revision).join(', ')}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteFormRevisions'
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { date } from 'quasar'
import { BlitzForm } from '@blitzar/form'
import { makeBlitzarQuasarSchemaForm } from '@obiba/quasar-ui-amber'
import { useFormStore } from 'src/stores/form'
import { useAuth } from 'src/composables/useAuth'
import { useI18n } from 'vue-i18n'

const props = defineProps(['form'])
const emit = defineEmits(['reinstate'])

const formStore = useFormStore()
const { isReadOnly } = useAuth()
const { t } = useI18n()

// Refs
const remountCounter = ref(0)
const modelData = ref({})
const selected = ref([])
const filter = ref('')
const locale = ref('en')
const viewTab = ref('form')
const selectedRevision = ref({})
const showViewRevision = ref(false)
const showConfirmReinstateRevision = ref(false)
const showConfirmDeleteRevision = ref(false)
const showConfirmDeleteRevisions = ref(false)
const paginationOpts = ref({
  sortBy: 'revision',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})

const columns = [
  {
    name: 'revision',
    required: true,
    label: t('revision'),
    align: 'left',
    field: 'revision',
    sortable: true
  },
  {
    name: 'comment',
    required: true,
    label: t('comment'),
    align: 'left',
    field: 'comment',
    sortable: true
  },
  {
    name: 'createdAt',
    required: true,
    label: t('date'),
    align: 'left',
    field: 'createdAt',
    sortable: true
  },
  {
    name: 'action',
    align: 'left',
    label: t('action')
  }
]

// Computed
const formRevisions = computed(() => formStore.formRevisions)

const locales = computed(() => {
  return Object.keys(selectedRevision.value.schema.i18n).filter(loc => locale.value !== loc)
})

const blitzarSchema = computed(() => {
  return makeBlitzarQuasarSchemaForm(selectedRevision.value.schema, { locale: locale.value, debug: true })
})

const modelDataStr = computed(() => {
  return JSON.stringify(modelData.value, null, '  ')
})

// Methods
function formatDate (dateStr) {
  return date.formatDate(date.extractDate(dateStr, 'YYYY-MM-DDTHH:mm:ss.SSSZ'), 'YYYY-MM-DD HH:mm:ss')
}

function onLocale (newLocale) {
  locale.value = newLocale
}

function onExport (formRevision) {
  const data = { ...formRevision.schema }
  delete data._id
  delete data.name
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const a = document.createElement('a')
  a.download = `${props.form.name}-${formRevision.revision}-schema.json`
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = ['application/json', a.download, a.href].join(':')
  a.click()
  a.remove()
}

function onReinstate (formRevision) {
  showConfirmReinstateRevision.value = true
  selectedRevision.value = formRevision
}

function onView (formRevision) {
  showViewRevision.value = true
  selectedRevision.value = formRevision
  modelData.value = {}
  remountCounter.value++
  viewTab.value = 'form'
}

function onConfirmDelete (formRevision) {
  showConfirmDeleteRevision.value = true
  selectedRevision.value = formRevision
}

function onConfirmDeleteMultiple () {
  if (selected.value.length > 0) {
    showConfirmDeleteRevisions.value = true
  }
}

async function getTableFormRevisions (requestProp) {
  if (requestProp) {
    paginationOpts.value = requestProp.pagination
    formStore.setFormRevisionPagination(requestProp.pagination)
    await formStore.getFormRevisions(requestProp.pagination, props.form._id, requestProp.filter)
  } else {
    await formStore.getFormRevisions(paginationOpts.value, props.form._id, filter.value)
  }
  paginationOpts.value.rowsNumber = formStore.formRevisionPaginationOpts.rowsNumber
}

function setPagination () {
  paginationOpts.value = { ...formStore.formRevisionPaginationOpts }
}

async function reinstateFormRevision () {
  const toSave = { ...props.form }
  toSave.schema = selectedRevision.value.schema
  await formStore.updateForm(toSave, undefined, true)
  emit('reinstate')
}

function deleteFormRevision () {
  formStore.deleteFormRevision(selectedRevision.value._id, paginationOpts.value, props.form._id)
}

function deleteFormRevisions () {
  const ids = selected.value.map(u => u._id)
  formStore.deleteFormRevisions(ids, paginationOpts.value, props.form._id)
  selected.value = []
}

// Lifecycle
onMounted(() => {
  setPagination()
  getTableFormRevisions()
})
</script>
