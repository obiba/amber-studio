<template>
  <q-page>

    <div class="q-pl-md q-pr-md q-pt-sm q-pb-md">
      <div class="row q-mb-md">
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
        <div class="text-caption text-grey-8 col-12">
          {{ studyForm.description }}
        </div>
      </div>
    </div>

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

  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { defineComponent, defineAsyncComponent, ref, toRaw } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'
import AuthMixin from '../mixins/AuthMixin'
import FormMixin from '../mixins/FormMixin'

export default defineComponent({
  components: {
    FormItems: defineAsyncComponent(() => import('src/components/forms/FormItems.vue')),
    FormTranslations: defineAsyncComponent(() => import('src/components/forms/FormTranslations.vue')),
    FormRevisions: defineAsyncComponent(() => import('src/components/forms/FormRevisions.vue'))
  },
  mixins: [AuthMixin, FormMixin],
  mounted () {
    // check for changes every 2 seconds
    this.saveIntervalId = setInterval(() => {
      if (!this.isReadOnly) {
        if (this.changeDetected >= 0 && this.originalSchemaStr !== JSON.stringify(this.studyFormData.schema)) {
          this.changeDetected++
          // auto save every 4s
          if (this.changeDetected > 2) {
            this.save(false)
          }
        }
      }
    }, 2000)
    this.initStudyFormData()
  },
  beforeUnmount () {
    if (this.saveIntervalId) {
      clearInterval(this.saveIntervalId)
    }
  },
  setup () {
    return {
      v$: useVuelidate(),
      tab: ref('schema'),
      innerTab: ref('items'),
      splitterModel: ref(15),
      importSchemaFile: ref(null),
      reload: ref(0)
    }
  },
  data () {
    return {
      saveIntervalId: null,
      changeDetected: 0,
      showEditDefinition: false,
      showImportSchema: false,
      showTag: false,
      publicationComment: null,
      studyFormData: {},
      originalSchemaStr: null
    }
  },
  validations: {
    studyFormData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    }
  },
  computed: {
    ...mapState({
      study: state => state.study.study,
      studyForm: state => state.form.form
    }),
    studyId () {
      return this.$route.params.id
    },
    disableImportSchema () {
      return this.importSchemaFile === null
    },
    disableTag () {
      return this.changeDetected !== 0
    },
    disableSave () {
      return this.v$.studyFormData.$invalid
    },
    saveIcon () {
      if (this.changeDetected < 0) {
        return 'cloud_sync'
      }
      if (this.changeDetected === 0) {
        return 'cloud_done'
      }
      return 'cloud_upload'
    }
  },
  methods: {
    ...mapActions({
      getStudy: 'study/getStudy',
      getStudyForm: 'form/getForm',
      updateStudyForm: 'form/updateForm',
      createStudyFormRevision: 'form/createFormRevision'
    }),
    async initStudyFormData () {
      await this.getStudyForm({ id: this.$route.params.fid })
      this.studyFormData = JSON.parse(JSON.stringify(this.studyForm))
      this.generateIds(this.studyFormData.schema.items)
      this.originalSchemaStr = JSON.stringify(this.studyFormData.schema)
      await this.getStudy({ id: this.studyForm.study })
    },
    async save (notification) {
      this.v$.$reset()
      this.changeDetected = -1
      this.originalSchemaStr = JSON.stringify(this.studyFormData.schema)
      const toSave = toRaw(this.studyFormData)
      return this.updateStudyForm({ form: toSave, notification: notification }).then(() => {
        this.changeDetected = 0
      })
    },
    onExport () {
      const data = toRaw(this.studyFormData.schema)
      delete data._id
      delete data.name
      this.deleteIds(data.items)
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const a = document.createElement('a')
      a.download = this.studyFormData.name + '-schema.json'
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['application/json', a.download, a.href].join(':')
      a.click()
      a.remove()
    },
    onImport () {
      this.showImportSchema = true
      this.importSchemaFile = null
    },
    onEdit () {
      this.showEditDefinition = true
    },
    onTag () {
      this.showTag = true
      this.publicationComment = null
    },
    onReinstate () {
      this.studyFormData = JSON.parse(JSON.stringify(this.studyForm))
      this.originalSchemaStr = JSON.stringify(this.studyFormData.schema)
      this.reload++
    },
    importSchema () {
      if (this.importSchemaFile) {
        const reader = new FileReader()
        reader.readAsText(this.importSchemaFile, 'UTF-8')
        reader.onload = evt => {
          const schema = JSON.parse(evt.target.result)
          this.studyFormData.schema = schema
          if (this.studyFormData.schema.items) {
            this.generateIds(this.studyFormData.schema.items)
          }
          this.save(true).then(() => this.onReinstate())
        }
        reader.onerror = evt => {
          console.error(evt)
        }
      }
    },
    tag () {
      const toSave = {
        form: this.studyFormData._id,
        study: this.studyFormData.study
      }
      if (this.publicationComment) {
        toSave.comment = this.publicationComment
      }
      this.createStudyFormRevision({
        formRevision: toSave
      })
    }
  }
})

</script>
