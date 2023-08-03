<template>
  <div>
    <div class="q-mt-md">
      <q-btn
        v-if="!isReadOnly"
        color="primary"
        icon="add"
        :label="$t('interview.add_participant_hint')"
        @click="onAddParticipant()" />
      <q-btn
        v-if="!isReadOnly"
        @click='onImport'
        :title="$t('import')"
        icon="file_upload"
        flat
        class="q-ml-sm">
        <template v-slot:loading>
        <q-spinner-facebook />
        </template>
      </q-btn>
      <q-btn-dropdown
        flat
        icon="download"
        :title="$t('export')"
        :disable="!hasParticipants">
        <q-list>
          <q-item clickable v-close-popup @click="onExport('csv')">
            <q-item-section>
              <q-item-label>CSV</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="onExport('xlsx')">
            <q-item-section>
              <q-item-label>Excel</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="onExport('json')">
            <q-item-section>
              <q-item-label>JSON</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <q-table
      flat
      :rows="participants"
      :columns="columns"
      row-key="code"
      :selection="isReadOnly ? 'none' : 'multiple'"
      v-model:selected="selected"
      v-model:pagination='paginationOpts'
    >
      <template v-slot:top>
        <q-btn
          v-if="!isReadOnly"
          class="q-mr-md"
          flat
          round
          color="negative"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="$t('interview.delete_participants_hint')"
          @click="onConfirmDeleteMultiple()" />
        <q-space />
        <q-input
          dense
          debounce="300"
          v-model="filter"
          :placeholder="$t('search')"
          :title="$t('interview.search_participants_hint')">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-action='props'>
        <q-td :props='props'>
          <q-btn
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('interview.view_participant_hint')"
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
            :title="$t('interview.delete_participant_hint')"
            icon="delete"
            @click='onConfirmDelete(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model='showAddParticipant' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='participantData.identifier'
            :label="$t('interview.participant_identifier')"
            :hint="$t('interview.participant_identifier_hint')"
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-input
            filled
            v-model="participantData.validFrom"
            :label="$t('interview.participant_valid_from')"
            :hint="$t('interview.participant_valid_from_hint')">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="participantData.validFrom" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <q-input
            filled
            v-model="participantData.validUntil"
            :label="$t('interview.participant_valid_until')"
            :hint="$t('interview.participant_valid_until_hint')">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="participantData.validUntil" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='addParticipant'
            :disable="disableSaveParticipant"
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

  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { t } from '../../boot/i18n'
import { date } from 'quasar'
import AuthMixin from '../../mixins/AuthMixin'
import { participantService } from '../../services/interview'

export default defineComponent({
  name: 'Participants',
  mixins: [AuthMixin],
  props: {
    campaign: {
      type: Object,
      required: true
    }
  },
  setup () {
    return {
      showAddParticipant: ref(false),
      participantData: ref({}),
      participants: ref([]),
      filter: ref(''),
      selected: ref([]),
      paginationOpts: {
        sortBy: 'code',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        {
          name: 'code',
          required: true,
          label: t('interview.participant_code'),
          align: 'left',
          field: 'code',
          sortable: true
        },
        {
          name: 'identifier',
          required: false,
          label: t('id'),
          align: 'left',
          field: 'identifier',
          sortable: true
        },
        {
          name: 'validFrom',
          align: 'left',
          label: t('interview.participant_valid_from'),
          field: 'validFrom',
          sortable: true,
          format: val =>
            `${val ? date.formatDate(val, 'YYYY-MM-DD') : '-'}`
        },
        {
          name: 'validUntil',
          align: 'left',
          label: t('interview.participant_valid_until'),
          field: 'validUntil',
          sortable: true,
          format: val =>
            `${val ? date.formatDate(val, 'YYYY-MM-DD') : '-'}`
        },
        {
          name: 'activated',
          align: 'left',
          label: t('active'),
          field: 'activated',
          sortable: true
        },
        {
          name: 'action',
          align: 'left',
          label: t('action')
        }
      ]
    }
  },
  mounted () {
    this.updateTableParticipants()
  },
  computed: {
    hasParticipants () {
      return this.participants && this.participants.length > 0
    },
    disableSaveParticipant () {
      if (this.participantData.validFrom && this.participantData.validUntil) {
        try {
          const from = new Date(this.participantData.validFrom)
          const until = new Date(this.participantData.validUntil)
          return from > until
        } catch (e) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    updateTableParticipants () {
      participantService.getParticipants(this.paginationOpts, this.campaign._id, this.filter).then(response => {
        this.participants = response.data
      })
    },
    addParticipant () {
      participantService.createParticipant(this.participantData).then(response => {
        this.updateTableParticipants()
      })
    },
    onAddParticipant () {
      this.participantData = {
        identifier: null,
        validFrom: null,
        validUntil: null,
        campaign: this.campaign._id
      }
      this.showAddParticipant = true
    },
    onExport (type) {

    }
  }
})
</script>
