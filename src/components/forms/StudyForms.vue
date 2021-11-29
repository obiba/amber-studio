<template>
  <div>
    <q-table
      flat
      :rows="studyForms"
      :columns="columns"
      :filter="filter"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      v-model:pagination='paginationOpts'
      @request='getTableStudyForms'
    >
      <template v-slot:top>
        <q-btn
          color="primary"
          icon="add"
          :title="$t('study.add_study_form_hint')"
          @click="onAdd()"
          class="q-mr-md" />
        <q-btn
          class="q-mr-md"
          flat
          round
          color="red"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="$t('study.delete_study_forms_hint')"
          @click="onConfirmDeleteMultiple()" />
        <q-space />
        <q-input
          filled
          borderless
          dense
          debounce="300"
          v-model="filter"
          :placeholder="$t('search')"
          :title="$t('study.search_study_form_hint')">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-name='props'>
        <q-td :props='props'>
          <router-link :to="'/form/' + props.row._id">{{ props.row.name }}</router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-action='props'>
        <q-td :props='props'>
          <q-btn
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('study.edit_study_form_hint')"
            icon='edit'
            :to="'/study/' + props.row._id">
          </q-btn>
          <q-btn
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('study.delete_study_form_hint')"
            icon='delete'
            @click='onConfirmDelete(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model='showCreateStudyForm' persistent>
      <q-card>
        <q-card-section class='row items-center'>
           <div class='col-12'>
            <q-input
              filled
              v-model='newStudyFormData.name'
              :label="$t('name')"
              lazy-rules
              class='q-ma-sm'
              @blur="v$.newStudyFormData.name.$touch"
              :error="v$.newStudyFormData.name.$error"
              :hint="$t('required')"
            >
              <template v-slot:error>
                <div v-for="error in v$.newStudyFormData.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12'>
            <q-input
              filled
              v-model='newStudyFormData.description'
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
            @click='saveStudyForm'
            :disable='disableCreateStudyForm'
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

    <q-dialog v-model='showConfirmDeleteStudyForm' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_study_form_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedStudyForm.name}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyForm'
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

    <q-dialog v-model='showConfirmDeleteStudyForms' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_study_forms_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => g.name).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyForms'
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

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../../boot/vuelidate'

export default defineComponent({
  name: 'StudyForms',
  mounted: function () {
    this.setPagination()
  },
  setup () {
    return {
      v$: useVuelidate(),
      tab: ref('definition'),
      selected: ref([]),
      filter: ref('')
    }
  },
  data () {
    return {
      newStudyFormData: {
        name: '',
        description: ''
      },
      selectedStudyForm: {},
      showCreateStudyForm: false,
      showConfirmDeleteStudyForm: false,
      showConfirmDeleteStudyForms: false,
      paginationOpts: {
        sortBy: 'name',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
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
          label: this.$t('action')
        }
      ]
    }
  },
  validations: {
    newStudyFormData: {
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
      studyForms: state => state.form.forms
    }),
    disableCreateStudyForm () {
      return this.v$.newStudyFormData.$invalid
    }
  },
  watch: {
    study: function (newValue, oldValue) {
      this.getTableStudyForms()
    }
  },
  methods: {
    ...mapActions({
      getStudyForms: 'form/getForms',
      createStudyForm: 'form/createForm'
    }),
    onAdd () {
      this.newStudyFormData = {}
      this.showCreateStudyForm = true
      this.selectedStudyForm = undefined
    },
    onConfirmDelete (studyForm) {
      this.showConfirmDeleteStudyForm = true
      this.selectedStudyForm = studyForm
    },
    onConfirmDeleteMultiple () {
      if (this.selected.length > 0) {
        this.showConfirmDeleteStudyForms = true
      }
    },
    async getTableStudyForms (requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination
        this.$store.commit('form/setFormPagination', {
          formPaginationOpts: requestProp.pagination
        })
        await this.getStudyForms({ paginationOpts: requestProp.pagination, study: this.study._id, filter: requestProp.filter })
      } else {
        await this.getStudyForms({ paginationOpts: this.paginationOpts, study: this.study._id, filter: this.filter })
      }
      this.paginationOpts.rowsNumber = this.$store.state.form.formPaginationOpts.rowsNumber
    },
    setPagination () {
      this.paginationOpts = this.$store.state.form.formPaginationOpts
    },
    deleteStudyForm () {
      this.$store.dispatch('form/deleteForm', {
        id: this.selectedStudyForm._id,
        study: this.study._id,
        paginationOpts: this.paginationOpts
      })
    },
    deleteStudyForms () {
      const ids = this.selected.map(u => u._id)
      this.$store.dispatch('form/deleteForms', {
        ids: ids,
        study: this.study._id,
        paginationOpts: this.paginationOpts
      })
      this.selected = []
    },
    async saveStudyForm () {
      this.v$.$reset()
      const toSave = { ...this.newStudyFormData }
      toSave.study = this.study._id
      toSave.schema = {
        label: toSave.name,
        description: toSave.description
      }
      this.createStudyForm({
        form: toSave
      })
    }
  }
})
</script>
