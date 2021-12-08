<template>
  <q-page>
    <div class="bg-blue-grey-1 q-pa-md">
      <div class="row">
        <div class="col-8">
          <q-breadcrumbs class="float-left q-mt-sm q-mr-md">
            <q-breadcrumbs-el icon="inventory_2" :title="$t('studies.title')" to="/studies"/>
            <q-breadcrumbs-el :label="study ? study.name : '...'" :to="'/study/' + (study ? study._id : '?')"/>
            <q-breadcrumbs-el icon="article" :label="studyForm.name" />
          </q-breadcrumbs>
          <q-btn
            @click='save'
            :title="$t(showSaveDone ? 'save_done' : 'save')"
            :icon="showSaveDone ? 'cloud_done' : 'cloud_upload'"
            flat
            dense
            round>
          </q-btn>
        </div>
        <div class="col-4">
        </div>
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
      <q-tab name="definition" :label="$t('form.definition')" />
      <q-tab name="schema" :label="$t('form.schema')" />
      <q-tab name="revisions" :label="$t('form.revisions')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">

      <q-tab-panel name="definition">
        <div class="row">
          <div class="col-12 col-md-6">
            <q-input
              filled
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
              filled
              v-model='studyFormData.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              class='q-mb-sm'/>
          </div>
        </div>
      </q-tab-panel>

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
              <q-tab-panel name="items" class="q-pt-none q-pb-none">
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

    <q-dialog v-model='showPublish' persistent>
      <q-card>
        <q-card-section class="row items-center">
           <div class="col-12">
            <q-input
              filled
              v-model='publicationComment'
              :label="$t('comment')"
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
  mounted: function () {
    this.initStudyFormData()
  },
  setup () {
    return {
      v$: useVuelidate(),
      tab: ref('schema'),
      innerTab: ref('items'),
      splitterModel: ref(10)
    }
  },
  data () {
    return {
      showPublish: false,
      publicationComment: null,
      studyFormData: {
        name: '',
        description: ''
      }
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
    disableSave () {
      return this.v$.studyFormData.$invalid
    },
    showSaveDone () {
      return this.studyFormData.name === this.studyForm.name &&
        this.studyFormData.description === this.studyForm.description
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
      await this.getStudy({ id: this.studyForm.study })
    },
    async save () {
      this.v$.$reset()
      const toSave = { ...this.studyFormData }
      this.updateStudyForm({
        form: toSave
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
