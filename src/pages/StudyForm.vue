<template>
  <q-page>

    <div class="q-ml-md q-mr-md q-mt-sm q-mb-md">
      <div class="row">
        <div class="col-12">
          <q-breadcrumbs class="q-mt-sm q-mr-md text-h5" :class="isReadOnly ? '' : 'float-left'">
            <q-breadcrumbs-el :label="$t('study.forms')" :to="'/study/' + studyId + '/forms'"/>
            <q-breadcrumbs-el :label="studyForm.name" />
          </q-breadcrumbs>
          <div class="text-grey-7 q-mt-sm">
            <q-btn
              v-if="!isReadOnly"
              @click='onEdit'
              :title="$t('edit_settings')"
              icon="settings"
              flat
              dense
              round>
            </q-btn>
            <q-btn
              v-if="!isReadOnly"
              @click='save'
              :title="$t(changeDetected === 0 ? 'save_done' : (changeDetected < 0 ? 'saving' : 'save'))"
              :icon="saveIcon"
              :disable="changeDetected < 0"
              flat
              dense
              round>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="text-caption text-secondary col-12">
          {{ studyForm.description }}
        </div>
      </div>
      <div class="row">
        <div class="text-body2 text-secondary col-12">
          <div class="note note-info">
            <span v-html="$t('study.form_hint')"/>
          </div>
        </div>
      </div>
    </div>

    <q-card class="q-ma-md">
      <q-card-section>

        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="schema" :label="$t('form.schema')" />
          <q-tab name="revisions" :label="$t('form.revisions')" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab">

          <q-tab-panel name="schema" class="q-pa-none">

            <div class="q-ma-sm">
              <q-btn
                @click='onExport'
                :label="$t('export')"
                icon="file_download"
                flat
                size="sm">
                <template v-slot:loading>
                <q-spinner-facebook />
                </template>
              </q-btn>
              <q-btn
                v-if="!isReadOnly"
                @click='onImport'
                :label="$t('import')"
                icon="file_upload"
                flat
                size="sm">
                <template v-slot:loading>
                <q-spinner-facebook />
                </template>
              </q-btn>
              <q-btn
                v-if="!isReadOnly"
                @click='onTag'
                :label="$t('tag')"
                :disable="disableTag"
                icon="sell"
                flat
                size="sm"
                >
                <template v-slot:loading>
                <q-spinner-facebook />
                </template>
              </q-btn>
            </div>

            <q-separator/>

            <q-splitter
              v-model="splitterModel"
            >

              <template v-slot:before>
                <q-tabs
                  v-model="innerTab"
                  vertical
                  class="text-teal"
                >
                  <q-tab name="items" icon="category" :label="$t('form.items')" />
                  <q-tab name="translations" icon="translate" :label="$t('form.translations')" />
                </q-tabs>
              </template>

              <template v-slot:after>
                <q-tab-panels
                  v-model="innerTab"
                >
                  <q-tab-panel name="items" class="q-pa-none">
                    <form-items :key="reload" v-model="studyFormData" />
                  </q-tab-panel>

                  <q-tab-panel name="translations">
                    <form-translations :key="reload" v-model="studyFormData" />
                  </q-tab-panel>
                </q-tab-panels>
              </template>

            </q-splitter>
          </q-tab-panel>

          <q-tab-panel name="revisions">
            <form-revisions :form="studyFormData" @reinstate="onReinstate"/>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
    <q-dialog v-model='showEditDefinition' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section class="row items-center">
          <div class="col-12">
            <q-input
              v-model='studyFormData.name'
              :label="$t('name')"
              lazy-rules
              class='q-mb-sm'
              @blur="v$.studyFormData.name.$touch"
              :error="v$.studyFormData.name.$error"
              :hint="$t('required')">
              <template v-slot:error>
              <div v-for="error in v$.studyFormData.name.$errors">
                  {{error.$message}}
              </div>
              </template>
            </q-input>
            <q-input
              v-model='studyFormData.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              class='q-mb-sm'/>
           </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='save(true)'
            :disable='disableSave'
            :label="$t('save')"
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

    <q-dialog v-model='showImportSchema' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section class="row items-center">
          <div class="col-12">
            <q-file
              v-model="importSchemaFile"
              :label="$t('form.import_schema')"
              :hint="$t('form.import_schema_hint')"
              class="q-ma-sm"
              accept=".json"
            />
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='importSchema'
            :disable='disableImportSchema'
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

    <q-dialog v-model='showTag' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section class="row items-center">
           <div class="col-12">
            <q-input
              v-model='publicationComment'
              :label="$t('comment')"
              :hint="$t('form.tag_comment_hint')"
              lazy-rules
              class="q-ma-sm"
            />
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='tag'
            :label="$t('tag')"
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

  </q-page>
</template>

<script setup>
import { ref, computed, toRaw, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'
import { useFormStore } from 'src/stores/form'
import { useStudyStore } from 'src/stores/study'
import { useAuth } from 'src/composables/useAuth'
import { useFormMixin } from '../composables/useFormMixin'
import FormItems from 'src/components/forms/FormItems.vue'
import FormTranslations from 'src/components/forms/FormTranslations.vue'
import FormRevisions from 'src/components/forms/FormRevisions.vue'

const route = useRoute()
const formStore = useFormStore()
const studyStore = useStudyStore()
const { isReadOnly } = useAuth()
const { generateIds, deleteIds } = useFormMixin()

// data
const tab = ref('schema')
const innerTab = ref('items')
const splitterModel = ref(15)
const importSchemaFile = ref(null)
const reload = ref(0)
const saveIntervalId = ref(null)
const changeDetected = ref(0)
const showEditDefinition = ref(false)
const showImportSchema = ref(false)
const showTag = ref(false)
const publicationComment = ref(null)
const studyFormData = ref({})
const originalSchemaStr = ref(null)

// Store refs
const studyForm = computed(() => formStore.form)

// validations
const rules = {
  studyFormData: {
    name: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    }
  }
}
const v$ = useVuelidate(rules, { studyFormData })

// computed
const studyId = computed(() => route.params.id)
const disableImportSchema = computed(() => importSchemaFile.value === null)
const disableTag = computed(() => changeDetected.value !== 0)
const disableSave = computed(() => v$.value.studyFormData.$invalid)
const saveIcon = computed(() => {
  if (changeDetected.value < 0) {
    return 'cloud_sync'
  }
  if (changeDetected.value === 0) {
    return 'cloud_done'
  }
  return 'cloud_upload'
})

// methods
async function initStudyFormData() {
  await formStore.getForm(route.params.fid)
  studyFormData.value = JSON.parse(JSON.stringify(studyForm.value))
  generateIds(studyFormData.value.schema.items)
  originalSchemaStr.value = JSON.stringify(studyFormData.value.schema)
  await studyStore.getStudy(studyForm.value.study)
}

async function save(notification) {
  v$.value.$reset()
  changeDetected.value = -1
  originalSchemaStr.value = JSON.stringify(studyFormData.value.schema)
  const toSave = toRaw(studyFormData.value)
  return formStore.updateForm(toSave, undefined, notification).then(() => {
    changeDetected.value = 0
  })
}

function onExport() {
  const data = JSON.parse(JSON.stringify(studyFormData.value.schema))
  delete data._id
  delete data.name
  deleteIds(data.items)
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const a = document.createElement('a')
  a.download = studyFormData.value.name + '-schema.json'
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = ['application/json', a.download, a.href].join(':')
  a.click()
  a.remove()
}

function onImport() {
  showImportSchema.value = true
  importSchemaFile.value = null
}

function onEdit() {
  showEditDefinition.value = true
}

function onTag() {
  showTag.value = true
  publicationComment.value = null
}

function onReinstate() {
  studyFormData.value = JSON.parse(JSON.stringify(studyForm.value))
  originalSchemaStr.value = JSON.stringify(studyFormData.value.schema)
  reload.value++
}

function importSchema() {
  if (importSchemaFile.value) {
    const reader = new FileReader()
    reader.readAsText(importSchemaFile.value, 'UTF-8')
    reader.onload = evt => {
      const schema = JSON.parse(evt.target.result)
      studyFormData.value.schema = schema
      if (studyFormData.value.schema.items) {
        generateIds(studyFormData.value.schema.items)
      }
      save(true).then(() => onReinstate())
    }
    reader.onerror = evt => {
      console.error(evt)
    }
  }
}

function tag() {
  const toSave = {
    form: studyFormData.value._id,
    study: studyFormData.value.study
  }
  if (publicationComment.value) {
    toSave.comment = publicationComment.value
  }
  formStore.createFormRevision(toSave)
}

// mounted
onMounted(() => {
  // check for changes every 2 seconds
  saveIntervalId.value = setInterval(() => {
    if (!isReadOnly.value) {
      if (changeDetected.value >= 0 && originalSchemaStr.value !== JSON.stringify(studyFormData.value.schema)) {
        changeDetected.value++
        // auto save every 4s
        if (changeDetected.value > 2) {
          save(false)
        }
      }
    }
  }, 2000)
  initStudyFormData()
})

onBeforeUnmount(() => {
  if (saveIntervalId.value) {
    clearInterval(saveIntervalId.value)
  }
})
</script>
