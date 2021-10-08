<template>
  <q-page>
    <div class="text-h6 text-white bg-info q-pa-md">{{$t('studies.title')}}</div>
    <q-separator/>
     
    <q-table
        flat
        :rows='studies'
        :columns='columns'
        :filter='filter'
        row-key='name'
        selection="multiple"
        v-model:selected="selected"
        v-model:pagination='paginationOpts'
        @request='getTableStudies'
      >
      <template v-slot:top>
        <q-btn
          color="primary"
          icon="add"
          :title="$t('studies.add_study_hint')"
          @click="createStudy()"
          class="q-mr-md" />
        <q-btn
          class="gt-xs q-mr-md"
          flat
          round
          color="red"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="$t('studies.delete_studies_hint')"
          @click="confirmDeleteStudies()" />
        <q-space />
        <q-input 
          filled 
          borderless 
          dense 
          debounce="300" 
          v-model="filter" 
          :placeholder="$t('search')"
          :title="$t('studies.search_hint')">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-name='props'>
        <q-td :props='props'>
          <router-link :to="'/study/' + props.row._id">{{ props.row.name }}</router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-description='props'>
        <q-td :props='props'>
          <div style="white-space: normal">
            {{ makeEllipsis(props.row.description, 100) }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-action='props'>
        <q-td :props='props'>
          <q-btn
            class="gt-xs text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('studies.edit_study_hint')"
            icon='edit'
            :to="'/study/' + props.row._id">
          </q-btn>
          <q-btn
            class="gt-xs text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('studies.delete_study_hint')"
            icon='delete'
            @click='confirmDeleteStudy(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model='showCreateStudy' persistent>
      <q-card>
        <q-card-section class='row items-center'>
           <div class='col-12'>
            <q-input
              filled
              v-model='newStudyData.name'
              :label="$t('name')"
              lazy-rules
              class='q-ma-sm'
              @blur="v$.newStudyData.name.$touch"
              :error="v$.newStudyData.name.$error"
              :hint="$t('required')"
            >
              <template v-slot:error>
                <div v-for="error in v$.newStudyData.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12'>
            <q-input
              filled
              v-model='newStudyData.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              class='q-ma-sm'
            />
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveStudy'
            :disable='disableCreateStudy'
            :label="$t('add')"
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

    <q-dialog v-model='showConfirmDeleteStudy' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('studies.delete_study_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedStudy.name}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudy'
            :label="$t('delete')"
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

    <q-dialog v-model='showConfirmDeleteStudies' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('studies.delete_studies_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => g.name).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudies'
            :label="$t('delete')"
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
import { mapState, mapActions } from 'vuex';
import {ref} from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength, email } from '../boot/vuelidate';

export default {
  mounted: function() {
    this.getTableStudies();
    this.setPagination();
  },
  setup() {
    return {
      v$: useVuelidate(),
      selected: ref([]),
      filter: ref('')
    }
  },
  data() {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          label: this.$t('name'),
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'description',
          align: 'left',
          label: this.$t('description'),
          field: 'description',
          sortable: true
        },
        {
          name: 'action',
          align: 'left',
          label: this.$t('action'),
        }
      ],
      selectedStudy: {},
      showCreateStudy: false,
      showConfirmDeleteStudy: false,
      showConfirmDeleteStudies: false,
      paginationOpts: {
        sortBy: 'name',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      studyData: {
        name: '',
        description: '',
      },
      newStudyData: {
        name: '',
        description: '',
      }
    };
  },
  validations: {
    newStudyData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      description: {
        minLength: minLength(2),
        maxLength: maxLength(500)
      }
    }
  },
  computed: {
    ...mapState({
      studies: state => state.study.studies
    }),
    disableCreateStudy() {
      return this.v$.newStudyData.$invalid;
    }
  },
  methods: {
    makeEllipsis(text, length) {
      if (text && text.length>length) {
        return text.substring(0, length) + ' ...';
      }
      return text;
    },
    setPagination() {
      this.paginationOpts = this.$store.state.study.studyPaginationOpts;
    },
    async getTableStudies(requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination;
        this.$store.commit('study/setStudyPagination', {
          studyPaginationOpts: requestProp.pagination
        });
        await this.getStudies({ paginationOpts: requestProp.pagination, filter: requestProp.filter });
      } else {
        await this.getStudies({ paginationOpts: this.paginationOpts, filter: this.filter });
      }
      this.paginationOpts.rowsNumber = this.$store.state.study.studyPaginationOpts.rowsNumber;
    },
    ...mapActions({
      getStudies: 'study/getStudies'
    }),
    createStudy() {
      this.newStudyData = {};
      this.showCreateStudy = true;
      this.selectedStudy = undefined;
    },
    confirmDeleteStudy(study) {
      this.showConfirmDeleteStudy = true;
      this.selectedStudy = study;
    },
    confirmDeleteStudies() {
      if (this.selected.length>0) {
        this.showConfirmDeleteStudies = true;
      }
    },
    async saveStudy() {
      this.v$.$reset();
      // create
      let createdData = { ...this.newStudyData };
      this.$store.dispatch('study/createStudy', {
        study: createdData,
        paginationOpts: this.paginationOpts
      });
    },
    deleteStudy() {
      this.$store.dispatch('study/deleteStudy', {
        id: this.selectedStudy._id,
        paginationOpts: this.paginationOpts
      });
    },
    deleteStudies() {
      const ids = this.selected.map(u => u._id);
      this.$store.dispatch('study/deleteStudies', {
        ids: ids,
        paginationOpts: this.paginationOpts
      });
      this.selected = [];
    }
  }
};
</script>

<style scoped>

</style>
