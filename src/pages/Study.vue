<template>
  <q-page>
    <div class="text-h6 text-white bg-info q-pa-md">
      <q-btn 
        to="/studies"
        color="white"
        text-color="white"
        flat
        :title="$t('studies.title')"
        icon="arrow_back_ios"/>
       <q-icon name="inventory_2" size="md" class="q-mr-md"/> {{ study.name }}
    </div>
    <q-separator/>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="definition" :label="$t('study.definition')" />
      <q-tab name="forms" :label="$t('study.forms')" />
      <q-tab name="events" :label="$t('study.events')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="definition">
        <div class="row">
          <div class="col-12 col-md-6 q-pa-sm">
            <div class="row">
              <div class='col-12'>
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
              </div>
            </div>
            <div class="row">
              <div class='col-12'>
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
          </div>

          <div class="col-12 col-md-6 q-pa-sm">
            
          </div>
          
        </div>

        <q-btn
          @click='saveStudy'
          :disable='disableSaveStudy'
          :label="$t('save')"
          type='submit'
          color='positive'
          class="q-ml-sm q-mt-md"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-tab-panel>

      <q-tab-panel name="forms">
        <div class="text-h6">{{$t('study.forms')}}</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        <div class="note note-info">
          <p class="note-title">TIP</p>
          <p>Also check out the published <router-link to="/crf">Case Report Forms</router-link>.</p>
        </div>
      </q-tab-panel>

      <q-tab-panel name="events">
        <div class="text-h6">{{$t('study.events')}}</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>


  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { defineComponent, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength } from '../boot/vuelidate';

export default defineComponent({
  mounted: function() {
    this.initStudyData()
  },
  setup() {
    return {
      v$: useVuelidate(),
      tab: ref("definition")
    }
  },
  data() {
    return {
      studyData: {
        name: '',
        description: '',
        users: []
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
      study: state => state.study.study,
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
      updateStudy: 'study/updateStudy'
    }),
    async initStudyData() {
      await this.getStudy({ id: this.$route.params.id });
      this.studyData = {...this.study};
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
