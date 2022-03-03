<template>
  <div>
    <q-table
      v-if="formRevisions && formRevisions.length > 0"
      flat
      :rows="formRevisions"
      :columns="columns"
      :filter="filter"
      row-key="revision"
      :selection="isReadOnly ? 'none' : 'multiple'"
      v-model:selected="selected"
      v-model:pagination='paginationOpts'
      @request='getTableFormRevisions'
    >
      <template v-slot:top>
        <q-btn
          v-if="!isReadOnly"
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
            :title="$t('form.export_form_revision_hint')"
            icon="file_download"
            @click='onExport(props.row)'>
          </q-btn>
          <q-btn
            v-if="!isReadOnly"
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('form.reinstate_form_revision_hint')"
            icon="undo"
            @click='onReinstate(props.row)'>
          </q-btn>
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
            v-if="!isReadOnly"
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

    <div v-else class="text-grey-6">
      {{ $t('form.no_revision') }}
    </div>

    <q-dialog v-model='showViewRevision' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-tabs
            v-model="viewTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="form" label="form" />
            <q-tab name="data" label="data" />
          </q-tabs>

          <q-separator/>

          <q-tab-panels v-model="viewTab">
            <q-tab-panel name="form" class="q-pl-none q-pr-none">
              <q-btn-dropdown icon="translate" flat size="sm" :label="locale">
                <q-list>
                  <q-item @click="onLocale(loc)" clickable v-close-popup v-for="loc in locales" :key="loc">
                    <q-item-section class="text-uppercase">{{ loc }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-separator  class="q-mt-md"/>
              <q-scroll-area style="height: 400px" class="q-pt-md">
                <BlitzForm :key='remountCounter' :schema='blitzarSchema' v-model='modelData' :columnCount='1' gridGap='32px'/>
              </q-scroll-area>
            </q-tab-panel>

            <q-tab-panel name="data" class="q-pl-none q-pr-none">
              <q-scroll-area style="height: 400px">
                <div class="bg-black text-white q-pa-md">
                  <pre>{{ modelDataStr }}</pre>
                </div>
              </q-scroll-area>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('close')" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmReinstateRevision' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('form.reinstate_form_revision_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedRevision.revision}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='reinstateFormRevision'
            :label="$t('reinstate')"
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
import AuthMixin from '../../mixins/AuthMixin'

export default defineComponent({
  name: 'FormRevisions',
  props: ['form'],
  emits: ['reinstate'],
  components: { BlitzForm },
  mixins: [AuthMixin],
  mounted: function () {
    this.setPagination()
    this.getTableFormRevisions()
  },
  setup () {
    return {
      remountCounter: 0,
      modelData: ref({}),
      selected: ref([]),
      filter: ref(''),
      locale: ref('en')
    }
  },
  data () {
    return {
      viewTab: 'form',
      selectedRevision: {},
      showViewRevision: false,
      showConfirmReinstateRevision: false,
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
    locales () {
      return Object.keys(this.selectedRevision.schema.i18n).filter(loc => this.locale !== loc)
    },
    blitzarSchema () {
      return makeBlitzarQuasarSchemaForm(this.selectedRevision.schema, { locale: this.locale, debug: true })
    },
    modelDataStr () {
      return JSON.stringify(this.modelData, null, '  ')
    }
  },
  methods: {
    ...mapActions({
      updateStudyForm: 'form/updateForm',
      getFormRevisions: 'form/getFormRevisions'
    }),
    formatDate (dateStr) {
      return date.formatDate(date.extractDate(dateStr, 'YYYY-MM-DDTHH:mm:ss.SSSZ'), 'YYYY-MM-DD HH:mm:ss')
    },
    onLocale (newLocale) {
      this.locale = newLocale
    },
    onExport (formRevision) {
      const data = { ...formRevision.schema }
      delete data._id
      delete data.name
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const a = document.createElement('a')
      a.download = `${this.form.name}-${formRevision.revision}-schema.json`
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['application/json', a.download, a.href].join(':')
      a.click()
      a.remove()
    },
    onReinstate (formRevision) {
      this.showConfirmReinstateRevision = true
      this.selectedRevision = formRevision
    },
    onView (formRevision) {
      this.showViewRevision = true
      this.selectedRevision = formRevision
      this.modelData = {}
      this.remountCounter++
      this.viewTab = 'form'
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
    async reinstateFormRevision () {
      const toSave = { ...this.form }
      toSave.schema = this.selectedRevision.schema
      this.updateStudyForm({ form: toSave, notification: true }).then(() => this.$emit('reinstate'))
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
