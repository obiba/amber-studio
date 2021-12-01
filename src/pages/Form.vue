<template>
  <q-page>
    <div class="bg-info q-pa-md">
      <div class="row">
        <div class="col-8">
          <q-breadcrumbs class="text-h6 text-white">
            <q-breadcrumbs-el icon="inventory_2" :title="$t('studies.title')" to="/studies" class="text-white"/>
            <q-breadcrumbs-el :label="study ? study.name : '...'" :to="'/study/' + (study ? study._id : '?')" class="text-white"/>
            <q-breadcrumbs-el icon="article" :label="studyForm.name" />
          </q-breadcrumbs>
        </div>
        <div class="col-4">
          <q-btn
            @click='save'
            :disable='disableSave'
            :label="$t('save')"
            type="submit"
            color="positive"
            class="float-right">
            <template v-slot:loading>
            <q-spinner-facebook />
            </template>
          </q-btn>
          <q-btn
            @click='onExport'
            :label="$t('export')"
            icon="file_download"
            color="grey"
            class="float-right q-mr-md">
            <template v-slot:loading>
            <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </div>
    </div>

    <q-separator/>
    <q-card class="q-ma-md">
      <q-card-section>
        <div class="text-h6">{{$t('studyForm.definition')}}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
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

      </q-card-section>
    </q-card>

    <q-card class="q-ma-md">
      <q-card-section>
        <div class="text-h6">{{$t('studyForm.items')}}</div>
      </q-card-section>
      <q-separator />
      <div>
        <form-items v-model="studyFormData" />
      </div>
    </q-card>

    <q-card class="q-ma-md">
      <q-card-section>
        <div class="text-h6">{{$t('studyForm.translations')}}</div>
      </q-card-section>
      <q-separator />
      <div>
        <form-translations v-model="studyFormData" />
      </div>
    </q-card>

  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { defineComponent, defineAsyncComponent } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'

export default defineComponent({
  components: {
    FormItems: defineAsyncComponent(() => import('src/components/forms/FormItems.vue')),
    FormTranslations: defineAsyncComponent(() => import('src/components/forms/FormTranslations.vue'))
  },
  mounted: function () {
    this.initStudyFormData()
  },
  setup () {
    return {
      v$: useVuelidate()
    }
  },
  data () {
    return {
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
    }
  },
  methods: {
    ...mapActions({
      getStudy: 'study/getStudy',
      getStudyForm: 'form/getForm',
      updateStudyForm: 'form/updateForm'
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
    }
  }
})

</script>
