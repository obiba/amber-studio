<template>
  <div>
    <div
      v-if="!hasParticipants"
      class="q-mt-md">
      <q-btn-dropdown
        icon="add"
        color="primary"
        :label="$t('interview.add_participants')">
        <q-list>
          <q-item clickable v-close-popup @click="onAddParticipant()">
            <q-item-section>
              <q-item-label>{{ $t('interview.add_participant_hint') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="onImport()">
            <q-item-section>
              <q-item-label>{{ $t('interview.import_participants') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <q-table
      v-if="hasParticipants"
      flat
      :rows="participants"
      :columns="columns"
      :filter="filter"
      row-key="code"
      :selection="isReadOnly ? 'none' : 'multiple'"
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
          <q-chip>{{ props.row.code }}</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            v-if="!isReadOnly"
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('interview.edit_participant_hint')"
            icon="edit"
            @click='onEdit(props.row)'>
          </q-btn>
          <q-btn
            v-if="!isReadOnly && props.row.activated"
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('interview.pause_participant_hint')"
            icon="pause"
            @click='pauseParticipant(props.row)'>
          </q-btn>
          <q-btn
            v-if="!isReadOnly && !props.row.activated"
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('interview.activate_participant_hint')"
            icon="play_arrow"
            @click='activateParticipant(props.row)'>
          </q-btn>
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
        <q-card-section>
          <p class="q-mb-sm q-mt-md">{{ $t('interview.participant_attributes') }}</p>
          <p class="text-grey">{{ $t('interview.participant_attributes_hint') }}</p>
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
                class="q-mt-md text-grey-8"
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
          <p class="text-grey">{{ $t('interview.participant_attributes_hint') }}</p>
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
                class="q-mt-md text-grey-8"
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
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='importParticipants'
            :disable="disableImportParticipants"
            :label="$t('import')"
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

    <q-dialog v-model='showConfirmDeleteParticipants' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_participants_confirm')}}
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
import { date, Notify } from 'quasar'
import AuthMixin from '../../mixins/AuthMixin'
import { participantService } from '../../services/interview'
import { getFileDelim, cleanToken } from '../forms/items/options'

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
      showEditParticipant: ref(false),
      showViewParticipant: ref(false),
      showImportParticipants: ref(false),
      participantsFile: ref(null),
      showAddParticipant: ref(false),
      showConfirmDeleteParticipant: ref(false),
      showConfirmDeleteParticipants: ref(false),
      participantData: ref({}),
      participants: ref([]),
      filter: ref(''),
      selected: ref([]),
      paginationOpts: {
        sortBy: 'createdAt',
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
    }
  },
  methods: {
    updateTableParticipants () {
      participantService.getParticipants(this.paginationOpts, this.campaign._id, this.filter).then(response => {
        this.participants = response.data
        this.paginationOpts.rowsNumber = response.total
      })
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
      participantService.createParticipant(this.participantData).then(response => {
        this.updateTableParticipants()
      })
    },
    editParticipant () {
      this.participantData.data = this.asParticipantData(this.participantData.attributes)
      delete this.participantData.data.attributes
      participantService.patchParticipant(this.participantData).then(response => {
        this.updateTableParticipants()
      })
    },
    doActivateParticipant (participant, activated) {
      this.participantData = {
        _id: participant._id,
        activated: activated
      }
      participantService.patchParticipant(this.participantData).then(response => {
        this.updateTableParticipants()
      })
    },
    activateParticipant (participant) {
      this.doActivateParticipant(participant, true)
    },
    pauseParticipant (participant) {
      this.doActivateParticipant(participant, false)
    },
    deleteParticipant () {
      participantService.deleteParticipant(this.participantData._id).then(response => {
        this.updateTableParticipants()
      })
    },
    deleteParticipants () {
      participantService.deleteParticipants(this.selected.map(p => p._id)).then(response => {
        this.updateTableParticipants()
      })
    },
    importParticipants () {
      const delim = getFileDelim(this.participantsFile)
      const reader = new FileReader()
      reader.readAsText(this.participantsFile, 'UTF-8')
      reader.onload = evt => {
        const headers = []
        const participants = []
        const knownHeaders = ['identifier', 'validFrom', 'validUntil', 'activated']
        evt.target.result.split(/\r\n|\n/)
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .forEach(line => {
            const tokens = line.split(delim).map(token => cleanToken(token))
            if (tokens.length > 0) {
              if (headers.length === 0) {
                tokens.forEach(token => headers.push(token))
              } else {
                try {
                  const pobj = {
                    identifier: null,
                    validFrom: null,
                    validUntil: null,
                    activated: true,
                    campaign: this.campaign._id,
                    data: {}
                  }
                  tokens.forEach((token, index) => {
                    const key = headers[index]
                    const value = token && token.length > 0 ? token : null
                    if (knownHeaders.includes(key)) {
                      pobj[key] = value
                    } else {
                      pobj.data[key] = value
                    }
                  })
                  participants.push(pobj)
                } catch (e) {
                  console.error(e)
                }
              }
            }
          })
        if (participants.length > 0) {
          participantService.createParticipant(participants).then(response => {
            this.updateTableParticipants()
          })
        }
      }
      reader.onerror = evt => {
        console.error(evt)
      }
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
      participantService.downloadParticipants(accept, this.campaign._id, this.filter, ids)
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
      // remove internal fields
      delete this.participantData._id
      delete this.participantData.campaign
      delete this.participantData.study
      delete this.participantData.createdBy
      delete this.participantData.createdAt
      delete this.participantData.updatedAt
      delete this.participantData.__v
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
