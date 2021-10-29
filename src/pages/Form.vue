<template>
  <q-page>
    <div class="bg-info q-pa-md">
      <div class="row">
        <div class="col">
          <q-breadcrumbs class="text-h6 text-white">
            <q-breadcrumbs-el icon="inventory_2" :title="$t('studies.title')" to="/studies" class="text-white"/>
            <q-breadcrumbs-el :label="study ? study.name : '...'" :to="'/study/' + (study ? study._id : '?')" class="text-white"/>
            <q-breadcrumbs-el icon="article" :label="studyForm.name" />
          </q-breadcrumbs>
        </div>
        <div class="col-1">
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
        <form-element :form="studyFormData" />
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
    FormElement: defineAsyncComponent(() => import('components/forms/FormElement.vue')),
  },
  mounted: function() {
    this.initStudyFormData()
  },
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  data() {
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
        //alpha,
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    }
  },
  computed: {
    ...mapState({
      study: state => state.study.study,
      studyForm: state => state.studyForm.studyForm
    }),
    disableSave() {
      return this.v$.studyFormData.$invalid;
    }
  },
  methods: {
    ...mapActions({
      getStudy: 'study/getStudy',
      getStudyForm: 'studyForm/getStudyForm',
      updateStudyForm: 'studyForm/updateStudyForm',
    }),
    async initStudyFormData() {
      await this.getStudyForm({ id: this.$route.params.id });
      this.studyFormData = JSON.parse(JSON.stringify(this.studyForm));
      await this.getStudy({ id: this.studyForm.study }); 
    },
    async save() {
      this.v$.$reset();
      const toSave = {...this.studyFormData};
      this.updateStudyForm({
          studyForm: toSave
      });
    }
  }
})

</script>