<template>
  <div>
    <q-table
      flat
      :rows="formRevisions"
      :columns="columns"
      :filter="filter"
      row-key="revision"
      selection="multiple"
      v-model:selected="selected"
      v-model:pagination='paginationOpts'
      @request='getTableFormRevisions'
    >
      <template v-slot:top>
        <q-btn
          class="q-mr-md"
          flat
          round
          color="red"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="$t('form.delete_form_revisions_hint')"
          @click="onConfirmDeleteMultiple()" />
        <q-space />
        <q-input
          filled
          borderless
          dense
          debounce="300"
          v-model="filter"
          :placeholder="$t('search')"
          :title="$t('form.search_form_revision_hint')">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-createdAt='props'>
        <q-td :props='props'>
          {{ formatDate(props.row.createdAt) }}
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
            :title="$t('form.view_form_revision_hint')"
            icon="visibility"
            @click='onView(props.row)'>
          </q-btn>
          <q-btn
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('form.delete_form_revision_hint')"
            icon="delete"
            @click='onConfirmDelete(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model='showViewRevision' persistent>
      <q-card>
        <q-card-section>
          <div>
            <BlitzForm :key='remountCounter' :schema='blitzarSchema' v-model='modelData' :columnCount='1' gridGap='32px'/>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="bg-black text-white q-pa-md">
            <pre>{{ modelDataStr }}</pre>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('ok')" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteRevision' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('form.delete_form_revision_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedRevision.revision}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteFormRevision'
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

    <q-dialog v-model='showConfirmDeleteRevisions' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('form.delete_form_revisions_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => g.revision).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteFormRevisions'
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
import { mapActions, mapState } from 'vuex'
import { defineComponent, ref } from 'vue'
import { date } from 'quasar'
import { BlitzForm } from '@blitzar/form'
import { makeBlitzarQuasarSchemaForm } from '@obiba/quasar-ui-amber'

export default defineComponent({
  name: 'FormRevisions',
  props: ['form'],
  components: { BlitzForm },
  mounted: function () {
    this.setPagination()
    this.getTableFormRevisions()
  },
  setup () {
    return {
      remountCounter: 0,
      modelData: ref({}),
      selected: ref([]),
      filter: ref('')
    }
  },
  data () {
    return {
      selectedRevision: {},
      showViewRevision: false,
      showConfirmDeleteRevision: false,
      showConfirmDeleteRevisions: false,
      paginationOpts: {
        sortBy: 'revision',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        {
          name: 'revision',
          required: true,
          label: this.$t('revision'),
          align: 'left',
          field: 'revision',
          sortable: true
        },
        {
          name: 'comment',
          required: true,
          label: this.$t('comment'),
          align: 'left',
          field: 'comment',
          sortable: true
        },
        {
          name: 'createdAt',
          required: true,
          label: this.$t('date'),
          align: 'left',
          field: 'createdAt',
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
  computed: {
    ...mapState({
      formRevisions: state => state.form.formRevisions
    }),
    blitzarSchema () {
      return makeBlitzarQuasarSchemaForm(this.selectedRevision.schema, { locale: 'en', debug: true })
    },
    modelDataStr () {
      return JSON.stringify(this.modelData, null, '  ')
    }
  },
  methods: {
    ...mapActions({
      getFormRevisions: 'form/getFormRevisions'
    }),
    formatDate (dateStr) {
      return date.formatDate(date.extractDate(dateStr, 'YYYY-MM-DDTHH:mm:ss.SSSZ'), 'YYYY-MM-DD HH:mm:ss')
    },
    onView (formRevision) {
      this.showViewRevision = true
      this.selectedRevision = formRevision
      this.modelData = {}
      this.remountCounter++
    },
    onConfirmDelete (formRevision) {
      this.showConfirmDeleteRevision = true
      this.selectedRevision = formRevision
    },
    onConfirmDeleteMultiple () {
      if (this.selected.length > 0) {
        this.showConfirmDeleteRevisions = true
      }
    },
    async getTableFormRevisions (requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination
        this.$store.commit('form/setFormRevisionPagination', {
          formRevisionPaginationOpts: requestProp.pagination
        })
        await this.getFormRevisions({ paginationOpts: requestProp.pagination, form: this.form._id, filter: requestProp.filter })
      } else {
        await this.getFormRevisions({ paginationOpts: this.paginationOpts, form: this.form._id, filter: this.filter })
      }
      this.paginationOpts.rowsNumber = this.$store.state.form.formRevisionPaginationOpts.rowsNumber
    },
    setPagination () {
      this.paginationOpts = this.$store.state.form.formRevisionPaginationOpts
    },
    deleteFormRevision () {
      this.$store.dispatch('form/deleteFormRevision', {
        id: this.selectedRevision._id,
        form: this.form._id,
        paginationOpts: this.paginationOpts
      })
    },
    deleteFormRevisions () {
      const ids = this.selected.map(u => u._id)
      this.$store.dispatch('form/deleteFormRevisions', {
        ids: ids,
        form: this.form._id,
        paginationOpts: this.paginationOpts
      })
      this.selected = []
    }
  }
})
</script>
