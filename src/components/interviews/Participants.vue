<template>
  <div v-cloak>
    <q-table
      ref="tableRef"
      flat
      :rows="participants"
      :columns="columns"
      :filter="filter"
      row-key="code"
      :selection="isReadOnly ? 'none' : 'multiple'"
      :rows-per-page-options="[10, 25, 50, 100, 0]"
      v-model:selected="selected"
      v-model:pagination="paginationOpts"
      @request="getTableParticipants"
    >
      <template v-slot:top>
        <q-btn
          v-if="!isReadOnly"
          color="primary"
          icon="add"
          :title="$t('interview.add_participant_hint')"
          @click="onAddParticipant()"
          class="q-mr-md" />
        <q-btn
          v-if="!isReadOnly"
          flat
          round
          color="negative"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="$t('interview.delete_participants_hint')"
          @click="onConfirmDeleteMultiple()" />
        <q-btn
          v-if="!isReadOnly"
          @click='onImport'
          :title="$t('import')"
          icon="file_upload"
          flat
          round>
          <template v-slot:loading>
          <q-spinner-facebook />
          </template>
        </q-btn>
        <q-btn-dropdown
          flat
          icon="download"
          :disable="!hasParticipants"
          :title="$t('export')">
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
        <q-space />
        <q-select
          class="q-mr-md"
          v-model="eligibleFilter"
          :options="eligibleOptions"
          emit-value
          map-options
          :label="$t('interview.participant_eligibility')"
          style="min-width: 150px"
          @update:model-value="onFilter"/>
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
      <template v-slot:body-cell-code="props">
        <q-td :props="props">
          <q-chip v-if="campaign.visitUrl && props.row.activated">
            <a :href="`${campaign.visitUrl}${campaign.visitUrl.endsWith('/') ? '' : '/'}go/${props.row.code}`" target="_blank">{{ props.row.code }}</a>
          </q-chip>
          <q-chip v-else>{{ props.row.code }}</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-valid='props'>
        <q-td :props='props'>
          <q-icon v-if="props.row.valid" name="done"
            size="sm"
            color="secondary"/>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            v-if="campaign.withPassword"
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="$t('interview.reset_participant_password_hint')"
            icon='replay'
            @click='resetPassword(props.row)'>
          </q-btn>
          <q-btn
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="$t('interview.edit_participant_hint')"
            icon="edit"
            @click='onEdit(props.row)'>
          </q-btn>
          <q-btn
            v-if="props.row.activated"
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="$t('interview.pause_participant_hint')"
            icon="pause"
            @click='pauseParticipant(props.row)'>
          </q-btn>
          <q-btn
            v-if="!props.row.activated"
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="$t('interview.activate_participant_hint')"
            icon="play_arrow"
            @click='activateParticipant(props.row)'>
          </q-btn>
          <q-btn
            color="secondary"
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
            color="secondary"
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
          <q-option-group
            v-model="addMode"
            :options="addOptions"
            color="primary"
          />
          <q-input
            v-if="addMode === 'single'"
            v-model='participantData.identifier'
            :label="$t('interview.participant_identifier')"
            :hint="$t('interview.participant_identifier_hint')"
            lazy-rules
          />
          <div v-if="addMode === 'multiple'">
            <p class="q-mb-sm q-mt-md">{{ $t('interview.add_participants_count') }}</p>
            <q-slider
              v-model="addCount"
              :min="1"
              :max="100"
              :step="1"
              label
            />
            <div class="text-secondary text-caption">{{ $t('interview.add_participants_count_hint') }}</div>
          </div>
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
        <q-card-section>
          <p class="q-mb-sm q-mt-md">{{ $t('interview.participant_attributes') }}</p>
          <p class="text-secondary text-caption">{{ $t('interview.participant_attributes_hint') }}</p>
          <div class="row q-col-gutter-md" v-for="(attribute, key) in participantData.attributes" :key="participantData.attributes.indexOf(attribute)">
            <div class="col-4">
              <q-input class="q-mb-md" v-model="attribute.key" :label="$t('key')"/>
            </div>
            <div class="col-7">
              <q-input class="q-mb-md" v-model="attribute.value" :label="$t('value')"/>
            </div>
            <div class="col-1">
              <q-btn
                v-if="!readOnly"
                class="q-mt-md text-secondary"
                size="12px"
                flat
                dense
                round
                icon='delete'
                @click='deleteAttribute(key)'>
              </q-btn>
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-btn
                color="primary"
                icon="add"
                :title="$t('interview.add_participant_attribute_hint')"
                @click="addAttribute()"
                class="q-mr-sm"
              />
              <q-btn
                flat
                round
                color="negative"
                icon="delete_outline"
                :title="$t('interview.delete_participant_attributes_hint')"
                @click="deleteAttributes()"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='addParticipant'
            :disable="disableSaveParticipant"
            :label="$t('add')"
            type='submit'
            color='primary'
            v-close-popup
          >
           <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showEditParticipant' persistent>
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
        <q-card-section>
          <p class="q-mb-sm q-mt-md">{{ $t('interview.participant_attributes') }}</p>
          <p class="text-secondary text-caption">{{ $t('interview.participant_attributes_hint') }}</p>
          <div class="row q-col-gutter-md" v-for="(attribute, key) in participantData.attributes" :key="participantData.attributes.indexOf(attribute)">
            <div class="col-4">
              <q-input class="q-mb-md" v-model="attribute.key" :label="$t('key')"/>
            </div>
            <div class="col-7">
              <q-input class="q-mb-md" v-model="attribute.value" :label="$t('value')"/>
            </div>
            <div class="col-1">
              <q-btn
                v-if="!readOnly"
                class="q-mt-md text-secondary"
                size="12px"
                flat
                dense
                round
                icon='delete'
                @click='deleteAttribute(key)'>
              </q-btn>
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-btn
                color="primary"
                icon="add"
                :title="$t('interview.add_participant_attribute_hint')"
                @click="addAttribute()"
                class="q-mr-sm"
              />
              <q-btn
                flat
                round
                color="negative"
                icon="delete_outline"
                :title="$t('interview.delete_participant_attributes_hint')"
                @click="deleteAttributes()"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='editParticipant'
            :disable="disableSaveParticipant"
            :label="$t('save')"
            type='submit'
            color='primary'
            v-close-popup
          >
           <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showImportParticipants' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-file
            dense
            bottom-slots
            clearable
            v-model="participantsFile"
            accept=".txt,.csv,.tsv"
            :label="$t('interview.upload_participants')">
            <template v-slot:prepend>
              <q-icon name="add" @click.stop />
            </template>

            <template v-slot:hint>
              {{ $t('interview.upload_participants_hint') }}
            </template>
          </q-file>
          <q-select
            v-model="delimiter"
            :options="delimiters"
            emit-value
            map-options
            :label="$t('delimiter')"
            :hint="$t('delimiter_hint')" />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='importParticipants'
            :disable="disableImportParticipants"
            :label="$t('import')"
            type='submit'
            color='primary'
            v-close-popup
          >
           <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showViewParticipant' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <div class="bg-black text-white q-pa-md">
            <pre>{{ participantDataStr }}</pre>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('close')" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteParticipant' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('interview.delete_participant_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            <q-chip>{{ participantData.code }}</q-chip>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteParticipant'
            :label="$t('delete')"
            type='submit'
            color='primary'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteParticipants' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('interview.delete_participants_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            <q-chip v-for="p in selected" :key="p.code">{{ p.code }}</q-chip>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteParticipants'
            :label="$t('delete')"
            type='submit'
            color='primary'
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
import { date, Notify } from 'quasar'
import AuthMixin from '../../mixins/AuthMixin'
import { participantService } from '../../services/interview'
import { errorHandler } from '../../boot/errors'

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
      tableRef: ref(),
      showEditParticipant: ref(false),
      showViewParticipant: ref(false),
      showImportParticipants: ref(false),
      participantsFile: ref(null),
      showAddParticipant: ref(false),
      showConfirmDeleteParticipant: ref(false),
      showConfirmDeleteParticipants: ref(false),
      participantData: ref({}),
      participants: ref([]),
      delimiter: ref(','),
      eligibleFilter: ref('0'),
      filter: ref(''),
      selected: ref([]),
      paginationOpts: ref({
        sortBy: 'createdAt',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      }),
      addMode: ref('single'),
      addCount: ref(10),
      addOptions: [
        {
          value: 'single',
          label: t('interview.add_single_participant')
        },
        {
          value: 'multiple',
          label: t('interview.add_multiple_participants')
        }
      ],
      delimiters: [
        {
          value: ',',
          label: t('comma')
        },
        {
          value: ';',
          label: t('semicolon')
        },
        {
          value: '\t',
          label: t('tabulation')
        }
      ],
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
          name: 'initAt',
          align: 'left',
          label: t('interview.participant_initial_contact'),
          field: 'initAt',
          sortable: true,
          format: val =>
            `${val ? date.formatDate(val, 'YYYY-MM-DD HH:mm') : '-'}`
        },
        {
          name: 'reminders',
          align: 'left',
          label: t('interview.participant_reminders_count'),
          field: 'reminders',
          sortable: true,
          format: val =>
            `${val ? val.length : '0'}`
        },
        {
          name: 'valid',
          align: 'left',
          label: t('interview.eligibility'),
          field: 'valid',
          sortable: false
        },
        {
          name: 'lastSeen',
          align: 'left',
          label: t('users.last_seen'),
          field: 'lastSeen',
          sortable: true,
          format: val =>
            `${val ? date.formatDate(val, 'YYYY-MM-DD HH:mm:ss') : '-'}`
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
      return (this.participants && this.participants.length > 0) || (this.filter && this.filter.length > 1)
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
    },
    disableImportParticipants () {
      return this.participantsFile === null
    },
    participantDataStr () {
      return JSON.stringify(this.participantData, null, '  ')
    },
    eligibleOptions () {
      return [
        {
          value: '0',
          label: t('interview.any_eligibility')
        },
        {
          value: 'true',
          label: t('interview.eligible')
        },
        {
          value: 'false',
          label: t('interview.not_eligible')
        }
      ]
    }
  },
  methods: {
    onFilter () {
      this.tableRef.requestServerInteraction()
    },
    updateTableParticipants () {
      this.selected = []
      const valid = this.eligibleFilter === '0' ? undefined : this.eligibleFilter === 'true'
      participantService.getParticipants(this.paginationOpts, this.campaign._id, this.filter, valid)
        .then(response => {
          this.participants = response.data
          this.paginationOpts.rowsNumber = response.total
        })
        .catch(err => this.handleError(err))
    },
    async getTableParticipants (requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination
        await this.updateTableParticipants()
      } else {
        await this.updateTableParticipants()
      }
    },
    deleteAttribute (idx) {
      this.participantData.attributes.splice(idx, 1)
    },
    addAttribute () {
      this.participantData.attributes.push({
        key: '',
        value: ''
      })
    },
    deleteAttributes () {
      this.participantData.attributes = [
        {
          key: '',
          value: ''
        }
      ]
    },
    asParticipantData (attributes) {
      const data = {}
      attributes
        .filter(attribute => attribute.key !== undefined && attribute.key.trim() !== '')
        .forEach(attribute => {
          data[attribute.key] = attribute.value
        })
      return data
    },
    asParticipantAttributes (data) {
      const attributes = []
      for (const key in data) {
        attributes.push({
          key: key,
          value: data[key]
        })
      }
      return attributes
    },
    addParticipant () {
      this.participantData.data = this.asParticipantData(this.participantData.attributes)
      delete this.participantData.data.attributes
      if (this.addMode === 'single') {
        participantService.createParticipant(this.participantData)
          .then(() => {
            Notify.create({
              message: t('success.create_participant'),
              color: 'positive',
              icon: 'fas fa-check'
            })
            this.updateTableParticipants()
          })
          .catch(err => this.handleError(err))
      } else {
        const pTemplate = { ...this.participantData }
        delete pTemplate.identifier
        const participants = []
        for (let i = 0; i < this.addCount; i++) {
          participants.push(pTemplate)
        }
        participantService.createParticipant(participants)
          .then(() => {
            Notify.create({
              message: t('success.create_participants'),
              color: 'positive',
              icon: 'fas fa-check'
            })
            this.updateTableParticipants()
          })
          .catch(err => this.handleError(err))
      }
    },
    handleError (err) {
      if (err.code === 400) {
        errorHandler.onError(err, err.message)
      } else {
        errorHandler.onError(err, t('error.general'))
      }
    },
    editParticipant () {
      this.participantData.data = this.asParticipantData(this.participantData.attributes)
      delete this.participantData.data.attributes
      participantService.patchParticipant(this.participantData)
        .then(() => {
          Notify.create({
            message: t('success.update_participant'),
            color: 'positive',
            icon: 'fas fa-check'
          })
          this.updateTableParticipants()
        })
        .catch(err => this.handleError(err))
    },
    resetPassword (participant) {
      this.participantData = {
        _id: participant._id,
        password: null
      }
      participantService.patchParticipant(this.participantData)
        .then(() => {
          Notify.create({
            message: t('success.reset_participant_password'),
            color: 'positive',
            icon: 'fas fa-check'
          })
          this.updateTableParticipants()
        })
        .catch(err => this.handleError(err))
    },
    doActivateParticipant (participant, activated) {
      this.participantData = {
        _id: participant._id,
        activated: activated
      }
      participantService.patchParticipant(this.participantData)
        .then(() => {
          Notify.create({
            message: activated ? t('success.activate_participant') : t('success.pause_participant'),
            color: 'positive',
            icon: 'fas fa-check'
          })
          this.updateTableParticipants()
        })
        .catch(err => this.handleError(err))
    },
    activateParticipant (participant) {
      this.doActivateParticipant(participant, true)
    },
    pauseParticipant (participant) {
      this.doActivateParticipant(participant, false)
    },
    deleteParticipant () {
      participantService.deleteParticipant(this.participantData._id)
        .then(() => {
          Notify.create({
            message: t('success.delete_participant'),
            color: 'positive',
            icon: 'fas fa-check'
          })
          this.updateTableParticipants()
        })
        .catch(err => this.handleError(err))
    },
    deleteParticipants () {
      participantService.deleteParticipants(this.selected.map(p => p._id))
        .then(() => {
          Notify.create({
            message: t('success.delete_participants'),
            color: 'positive',
            icon: 'fas fa-check'
          })
          this.updateTableParticipants()
        })
        .catch(err => this.handleError(err))
    },
    importParticipants () {
      const knownHeaders = ['identifier', 'validFrom', 'validUntil', 'activated']
      const campaignId = this.campaign._id
      const that = this
      // const delim = this.participantsFile.name.endsWith('.tsv') ? '\t' : ','
      this.$papa.parse(this.participantsFile, {
        header: true,
        delimiter: this.delimiter,
        complete: function (results, file) {
          if (results.errors.length === 0) {
            console.error(results.error)
          }
          if (results.data.length > 0) {
            const participants = []
            // array of row objects
            results.data.forEach((row) => {
              const pobj = {
                identifier: null,
                validFrom: null,
                validUntil: null,
                activated: true,
                campaign: campaignId,
                data: {}
              }
              let valid = false // we need at least one not empty data entry
              Object.keys(row)
                .forEach((key) => {
                  if (key !== 'code' && row[key].length > 0) {
                    if (knownHeaders.includes(key)) {
                      pobj[key] = row[key]
                    } else {
                      pobj.data[key] = row[key]
                    }
                    valid = true
                  }
                })
              if (valid) {
                participants.push(pobj)
              }
            })
            if (participants.length > 0) {
              participantService.createParticipant(participants)
                .then(() => {
                  Notify.create({
                    message: t('success.create_participants'),
                    color: 'positive',
                    icon: 'fas fa-check'
                  })
                  that.updateTableParticipants()
                })
                .catch(err => {
                  that.updateTableParticipants() // some may have passed
                  that.handleError(err)
                })
            }
          }
        }
      })
    },
    onAddParticipant () {
      this.participantData = {
        identifier: null,
        validFrom: null,
        validUntil: null,
        campaign: this.campaign._id,
        attributes: [
          {
            key: '',
            value: ''
          }
        ]
      }
      this.addMode = 'single'
      this.addCount = 10
      this.showAddParticipant = true
    },
    onImport () {
      this.participantsFile = null
      this.showImportParticipants = true
    },
    onExport (format) {
      let accept = 'application/json'
      if (format === 'csv') {
        accept = 'text/csv'
      } else if (format === 'xlsx') {
        accept = 'application/vnd.ms-excel'
      }
      const ids = this.selected.map(u => u._id)
      const valid = this.eligibleFilter === '0' ? undefined : this.eligibleFilter === 'true'
      participantService.downloadParticipants(accept, this.campaign._id, this.filter, valid, ids)
        .then(response => {
          if (response.status === 200) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            const ext = format
            link.setAttribute('download', `participants-export.${ext}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
          } else {
            Notify.create({
              message: 'Participants export failed.',
              color: 'negative'
            })
          }
        })
    },
    toParticipantData (participant) {
      this.participantData = { ...participant }
      this.participantData.validFrom = this.participantData.validFrom ? date.formatDate(this.participantData.validFrom, 'YYYY-MM-DD') : null
      this.participantData.validUntil = this.participantData.validUntil ? date.formatDate(this.participantData.validUntil, 'YYYY-MM-DD') : null
      // remove internal fields or fields that are already in the columns
      delete this.participantData._id
      delete this.participantData.interviewDesign
      delete this.participantData.campaign
      delete this.participantData.study
      delete this.participantData.createdBy
      delete this.participantData.activated
      delete this.participantData.lastSeen
    },
    onEdit (participant) {
      this.toParticipantData(participant)
      this.participantData._id = participant._id
      this.participantData.attributes = this.asParticipantAttributes(this.participantData.data)
      delete this.participantData.data
      this.showEditParticipant = true
    },
    onView (participant) {
      this.toParticipantData(participant)
      // remove internal fields or fields that are already in the columns
      delete this.participantData.validFrom
      delete this.participantData.validUntil
      this.showViewParticipant = true
    },
    onConfirmDelete (participant) {
      this.participantData = { ...participant }
      this.showConfirmDeleteParticipant = true
    },
    onConfirmDeleteMultiple () {
      this.showConfirmDeleteParticipants = true
    }
  }
})
</script>
