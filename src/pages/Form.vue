<template>
  <q-page>
    <div class="bg-blue-grey-1 q-pa-md">
      <q-breadcrumbs class="float-left q-mt-sm q-mr-md">
        <q-breadcrumbs-el icon="inventory_2" :title="$t('studies.title')" to="/studies"/>
        <q-breadcrumbs-el :label="study ? study.name : '...'" :to="'/study/' + (study ? study._id : '?')"/>
        <q-breadcrumbs-el icon="article" :label="studyForm.name" />
      </q-breadcrumbs>
      <q-btn
        @click='onEdit'
        :title="$t('edit_settings')"
        icon="settings"
        class="text-grey-7"
        flat
        dense
        round>
      </q-btn>
      <q-btn
        @click='save'
        :title="$t(changeDetected === 0 ? 'save_done' : (changeDetected < 0 ? 'saving' : 'save'))"
        :icon="saveIcon"
        :disable="changeDetected < 0"
        class="text-grey-7"
        flat
        dense
        round>
      </q-btn>
      <div class="text-caption text-grey-8">
        {{ studyForm.description }}
      </div>
    </div>

    <q-separator/>

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
            @click='onPublish'
            :label="$t('publish')"
            :disable="disablePublish"
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
                <form-items v-model="studyFormData" />
              </q-tab-panel>

              <q-tab-panel name="translations">
                <form-translations v-model="studyFormData" />
              </q-tab-panel>
            </q-tab-panels>
          </template>

        </q-splitter>
      </q-tab-panel>

      <q-tab-panel name="revisions">
        <form-revisions :form="studyFormData" />
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

    <q-dialog v-model='showPublish' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section class="row items-center">
           <div class="col-12">
            <q-input
              v-model='publicationComment'
              :label="$t('comment')"
              :hint="$t('form.publish_comment_hint')"
              lazy-rules
              class="q-ma-sm"
            />
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='publish'
            :label="$t('publish')"
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
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'

export default defineComponent({
  components: {
    FormItems: defineAsyncComponent(() => import('src/components/forms/FormItems.vue')),
    FormTranslations: defineAsyncComponent(() => import('src/components/forms/FormTranslations.vue')),
    FormRevisions: defineAsyncComponent(() => import('src/components/forms/FormRevisions.vue'))
  },
  mounted () {
    // check for changes every 2 seconds
    this.saveIntervalId = setInterval(() => {
      if (this.changeDetected >= 0 && this.originalSchemaStr !== JSON.stringify(this.studyFormData.schema)) {
        this.changeDetected++
        // auto save every 4s
        if (this.changeDetected > 2) {
          this.save(false)
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
      splitterModel: ref(15)
    }
  },
  data () {
    return {
      saveIntervalId: null,
      changeDetected: 0,
      showEditDefinition: false,
      showPublish: false,
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
    disablePublish () {
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
      await this.getStudyForm({ id: this.$route.params.id })
      this.studyFormData = JSON.parse(JSON.stringify(this.studyForm))
      this.originalSchemaStr = JSON.stringify(this.studyFormData.schema)
      await this.getStudy({ id: this.studyForm.study })
    },
    async save (notification) {
      this.v$.$reset()
      this.changeDetected = -1
      this.originalSchemaStr = JSON.stringify(this.studyFormData.schema)
      const toSave = { ...this.studyFormData }
      this.updateStudyForm({ form: toSave, notification: notification }).then(() => {
        this.changeDetected = 0
      })
    },
    onExport () {
      const data = { ...this.studyFormData.schema }
      delete data._id
      delete data.name
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const a = document.createElement('a')
      a.download = this.studyFormData.name + '-schema.json'
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['application/json', a.download, a.href].join(':')
      a.click()
      a.remove()
    },
    onEdit () {
      this.showEditDefinition = true
    },
    onPublish () {
      this.showPublish = true
      this.publicationComment = null
    },
    publish () {
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
