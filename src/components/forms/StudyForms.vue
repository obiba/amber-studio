<template>
  <div>
    <q-table
      v-if="hasStudyForms"
      flat
      :rows="studyForms"
      :columns="columns"
      :filter="filter"
      row-key="name"
      :selection="isReadOnly ? 'none' : 'multiple'"
      v-model:selected="selected"
      v-model:pagination='paginationOpts'
      @request='getTableStudyForms'
    >
      <template v-slot:top>
        <q-btn
          v-if="!isReadOnly"
          color="primary"
          icon="add"
          :title="$t('study.add_study_form_hint')"
          @click="onAdd()"
          class="q-mr-md" />
        <q-btn
          v-if="!isReadOnly"
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
            icon="edit"
            :to="'/form/' + props.row._id">
          </q-btn>
          <q-btn
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('study.delete_study_form_hint')"
            icon="delete"
            @click='onConfirmDelete(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-btn
      v-else
      color="primary"
      icon="add"
      :label="$t('study.add_study_form_hint')"
      @click="onAdd()"/>

    <q-dialog v-model='showCreateStudyForm' persistent>
      <q-card>
        <q-card-section class="row items-center">
           <div class="col-12">
            <q-input
              v-model='newStudyFormData.name'
              :label="$t('name')"
              lazy-rules
              class="q-ma-sm"
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
          <div class="col-12">
            <q-input
              v-model='newStudyFormData.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              class="q-ma-sm"
            />
          </div>
          <div class="col-12">
            <q-file
              v-model="newStudyFormData.importSchema"
              :label="$t('study.import_schema')"
              :hint="$t('study.import_schema_hint')"
              class="q-ma-sm"
              accept=".json"
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
import AuthMixin from '../../mixins/AuthMixin'

export default defineComponent({
  name: 'StudyForms',
  mixins: [AuthMixin],
  mounted: function () {
    this.setPagination()
    if (this.study) {
      this.getTableStudyForms()
    }
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
      }
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
    columns () {
      const cols = [
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
        }
      ]
      if (!this.isReadOnly) {
        cols.push({
          name: 'action',
          align: 'left',
          label: this.$t('action')
        })
      }
      return cols
    },
    disableCreateStudyForm () {
      return this.v$.newStudyFormData.$invalid
    },
    hasStudyForms () {
      return this.studyForms && this.studyForms.length > 0
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

      if (this.newStudyFormData.importSchema) {
        delete toSave.importSchema
        const reader = new FileReader()
        reader.readAsText(this.newStudyFormData.importSchema, 'UTF-8')
        reader.onload = evt => {
          const schema = JSON.parse(evt.target.result)
          toSave.schema = schema
          toSave.schema.name = '.'
          if (!toSave.schema.label) {
            toSave.schema.label = toSave.name
          }
          if (!toSave.schema.description) {
            toSave.schema.description = toSave.description
          }
          this.createStudyForm({
            form: toSave
          })
        }
        reader.onerror = evt => {
          console.error(evt)
        }
      } else {
        toSave.schema = {
          label: toSave.name,
          description: toSave.description
        }
        this.createStudyForm({
          form: toSave
        })
      }
    }
  }
})
</script>
