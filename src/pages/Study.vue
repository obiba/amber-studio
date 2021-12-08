<template>
  <q-page>
    <div class="bg-blue-grey-1 q-pa-md">
      <q-breadcrumbs class="float-left q-mt-sm q-mr-md">
        <q-breadcrumbs-el icon="inventory_2" :title="$t('studies.title')" to="/studies"/>
        <q-breadcrumbs-el :label="study.name" />
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
    <q-separator/>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="definition" :label="$t('study.definition')" />
      <q-tab name="forms" :label="$t('study.forms')" />
      <q-tab name="caseReports" :label="$t('study.case_reports')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">

      <q-tab-panel name="definition">
        <div class="row">
          <div class="col-12 col-md-6">
            <q-input
              filled
              v-model='studyData.name'
              :label="$t('name')"
              lazy-rules
              class='q-mb-sm'
              @blur="v$.studyData.name.$touch"
                  :error="v$.studyData.name.$error"
                  :hint="$t('required')"
                >
              <template v-slot:error>
                <div v-for="error in v$.studyData.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
            <q-input
              filled
              v-model='studyData.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              class='q-mb-sm'
            />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="forms">
        <study-forms/>
      </q-tab-panel>

      <q-tab-panel name="caseReports">
      </q-tab-panel>

    </q-tab-panels>

  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'

export default defineComponent({
  components: {
    StudyForms: defineAsyncComponent(() => import('components/forms/StudyForms.vue'))
  },
  mounted: function () {
    this.initStudyData()
  },
  setup () {
    return {
      tab: ref('forms'),
      v$: useVuelidate()
    }
  },
  data () {
    return {
      studyData: {
        name: '',
        description: ''
      },
      selectedUserOptions: '',
      userOptionsLoading: false
    }
  },
  validations: {
    studyData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    }
  },
  computed: {
    ...mapState({
      study: state => state.study.study
    }),
    currentStudy () {
      return this.$store.state.study.study
    },
    disableSave () {
      return this.v$.studyData.$invalid
    },
    showSaveDone () {
      return this.studyData.name === this.study.name && this.studyData.description === this.study.description
    }
  },
  methods: {
    ...mapActions({
      getStudy: 'study/getStudy',
      updateStudy: 'study/updateStudy'
    }),
    async initStudyData () {
      await this.getStudy({ id: this.$route.params.id })
      this.studyData = { ...JSON.parse(JSON.stringify(this.study)) }
    },
    async save () {
      this.v$.$reset()
      const toSave = { ...this.studyData }
      this.updateStudy({
        study: toSave
      })
    }
  }
})
</script>
