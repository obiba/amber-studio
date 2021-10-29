<template>
  <q-page>
    <div class="text-h6 text-white bg-info q-pa-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="inventory_2" :title="$t('studies.title')" to="/studies" class="text-white"/>
        <q-breadcrumbs-el :label="study.name" />
      </q-breadcrumbs>
    </div>
    <q-separator/>

    <q-card class="q-ma-md">
      <q-card-section>
        <div class="text-h6">{{$t('study.definition')}}</div>
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <div class="row">
          <div class="col-12 col-md-6 q-pa-sm">
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

            <q-btn
              @click='saveStudy'
              :disable='disableSaveStudy'
              :label="$t('save')"
              type='submit'
              color='positive'
              class="q-mt-md"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-ma-md">
      <q-card-section>
        <div class="text-h6">{{$t('study.forms')}}</div>
      </q-card-section>
      <q-separator/>
      <div>
        <study-forms/>
      </div>
    </q-card>

  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { defineComponent, defineAsyncComponent, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength } from '../boot/vuelidate';

export default defineComponent({
  components: {
    StudyForms: defineAsyncComponent(() => import('components/forms/StudyForms.vue')),
  },
  mounted: function() {
    this.initStudyData()
  },
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  data() {
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
        //alpha,
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
    currentStudy() {
      return this.$store.state.study.study;
    },
    disableSaveStudy() {
      return this.v$.studyData.$invalid;
    }
  },
  methods: {
    ...mapActions({
      getStudy: 'study/getStudy',
      updateStudy: 'study/updateStudy',
    }),
    async initStudyData() {
      await this.getStudy({ id: this.$route.params.id });
      this.studyData = {...JSON.parse(JSON.stringify(this.study))};
    },
    async saveStudy() {
      this.v$.$reset();
      const toSave = {...this.studyData};
      this.updateStudy({
        study: toSave
      });
    }
  }
})
</script>
