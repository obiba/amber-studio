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
          :title="t('interview.add_participant_hint')"
          size="sm"
          @click="onAddParticipant()"
          class="q-mr-md" />
        <q-btn
          v-if="!isReadOnly"
          flat
          round
          color="negative"
          icon="delete_outline"
          size="sm"
          :disable="selected.length === 0"
          :title="t('interview.delete_participants_hint')"
          @click="onConfirmDeleteMultiple()" />
        <q-btn
          v-if="!isReadOnly"
          @click='onImport'
          :title="t('import')"
          icon="file_upload"
          flat
          round
          size="sm">
          <template v-slot:loading>
          <q-spinner-facebook />
          </template>
        </q-btn>
        <q-btn-dropdown
          flat
          icon="download"
          size="sm"
          :disable="!hasParticipants"
          :title="t('export')">
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
          :label="t('interview.participant_eligibility')"
          style="min-width: 150px"
          @update:model-value="onFilter"/>
        <q-input
          dense
          debounce="300"
          v-model="filter"
          :placeholder="t('search')"
          :title="t('interview.search_participants_hint')">
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
      <template v-slot:body-cell-walkin='props'>
        <q-td :props='props'>
          <q-icon v-if="!props.row.createdBy" name="done"
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
            :title="t('interview.reset_participant_password_hint')"
            icon='replay'
            @click='resetPassword(props.row)'>
          </q-btn>
          <q-btn
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('interview.edit_participant_hint')"
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
            :title="t('interview.pause_participant_hint')"
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
            :title="t('interview.activate_participant_hint')"
            icon="play_arrow"
            @click='activateParticipant(props.row)'>
          </q-btn>
          <q-btn
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('interview.view_participant_hint')"
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
            :title="t('interview.delete_participant_hint')"
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
            :label="t('interview.participant_identifier')"
            :hint="t('interview.participant_identifier_hint')"
            lazy-rules
          />
          <div v-if="addMode === 'multiple'">
            <p class="q-mb-sm q-mt-md">{{ t('interview.add_participants_count') }}</p>
            <q-slider
              v-model="addCount"
              :min="1"
              :max="100"
              :step="1"
              label
            />
            <div class="text-secondary text-caption">{{ t('interview.add_participants_count_hint') }}</div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            filled
            v-model="participantData.validFrom"
            :label="t('interview.participant_valid_from')"
            :hint="t('interview.participant_valid_from_hint')">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="participantData.validFrom" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="t('close')" color="primary" flat />
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
            :label="t('interview.participant_valid_until')"
            :hint="t('interview.participant_valid_until_hint')">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="participantData.validUntil" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="t('close')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <p class="q-mb-sm q-mt-md">{{ t('interview.participant_attributes') }}</p>
          <p class="text-secondary text-caption">{{ t('interview.participant_attributes_hint') }}</p>
          <div class="row q-col-gutter-md" v-for="(attribute, key) in participantData.attributes" :key="participantData.attributes.indexOf(attribute)">
            <div class="col-4">
              <q-input class="q-mb-md" v-model="attribute.key" :label="t('key')"/>
            </div>
            <div class="col-7">
              <q-input class="q-mb-md" v-model="attribute.value" :label="t('value')"/>
            </div>
            <div class="col-1">
              <q-btn
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
                :title="t('interview.add_participant_attribute_hint')"
                @click="addAttribute()"
                class="q-mr-sm"
              />
              <q-btn
                flat
                round
                color="negative"
                icon="delete_outline"
                :title="t('interview.delete_participant_attributes_hint')"
                @click="deleteAttributes()"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='addParticipant'
            :disable="disableSaveParticipant"
            :label="t('add')"
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
            :label="t('interview.participant_identifier')"
            :hint="t('interview.participant_identifier_hint')"
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-input
            filled
            v-model="participantData.validFrom"
            :label="t('interview.participant_valid_from')"
            :hint="t('interview.participant_valid_from_hint')">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="participantData.validFrom" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="t('close')" color="primary" flat />
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
            :label="t('interview.participant_valid_until')"
            :hint="t('interview.participant_valid_until_hint')">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="participantData.validUntil" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="t('close')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <p class="q-mb-xs q-mt-md">{{ t('interview.participant_attributes') }}</p>
          <p class="text-secondary text-caption">{{ t('interview.participant_attributes_hint') }}</p>
          <div class="row q-col-gutter-md" v-for="(attribute, key) in participantData.attributes" :key="participantData.attributes.indexOf(attribute)">
            <div class="col-4">
              <q-input class="q-mb-md" v-model="attribute.key" :label="t('key')"/>
            </div>
            <div class="col-7">
              <q-input class="q-mb-md" v-model="attribute.value" :label="t('value')"/>
            </div>
            <div class="col-1">
              <q-btn
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
                :title="t('interview.add_participant_attribute_hint')"
                @click="addAttribute()"
                class="q-mr-sm"
              />
              <q-btn
                flat
                round
                color="negative"
                icon="delete_outline"
                :title="t('interview.delete_participant_attributes_hint')"
                @click="deleteAttributes()"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='editParticipant'
            :disable="disableSaveParticipant"
            :label="t('save')"
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
            :label="t('interview.upload_participants')">
            <template v-slot:prepend>
              <q-icon name="add" @click.stop />
            </template>

            <template v-slot:hint>
              {{ t('interview.upload_participants_hint') }}
            </template>
          </q-file>
          <q-select
            v-model="delimiter"
            :options="delimiters"
            emit-value
            map-options
            :label="t('delimiter')"
            :hint="t('delimiter_hint')" />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='importParticipants'
            :disable="disableImportParticipants"
            :label="t('import')"
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
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('close')" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteParticipant' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('interview.delete_participant_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            <q-chip>{{ participantData.code }}</q-chip>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteParticipant'
            :label="t('delete')"
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
            {{t('interview.delete_participants_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            <q-chip v-for="p in selected" :key="p.code">{{ p.code }}</q-chip>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteParticipants'
            :label="t('delete')"
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

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { date, Notify } from 'quasar'
import { useAuth } from 'src/composables/useAuth'
import { participantService } from '../../services/interview'
import { errorHandler } from '../../boot/errors'

const { t } = useI18n()

const props = defineProps({
  campaign: {
    type: Object,
    required: true
  }
})

const { isReadOnly } = useAuth()
const { proxy } = getCurrentInstance()

// Refs
const tableRef = ref()
const showEditParticipant = ref(false)
const showViewParticipant = ref(false)
const showImportParticipants = ref(false)
const participantsFile = ref(null)
const showAddParticipant = ref(false)
const showConfirmDeleteParticipant = ref(false)
const showConfirmDeleteParticipants = ref(false)
const participantData = ref({})
const participants = ref([])
const delimiter = ref(',')
const eligibleFilter = ref('0')
const filter = ref('')
const selected = ref([])
const paginationOpts = ref({
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const addMode = ref('single')
const addCount = ref(10)

const addOptions = [
  {
    value: 'single',
    label: t('interview.add_single_participant')
  },
  {
    value: 'multiple',
    label: t('interview.add_multiple_participants')
  }
]

const delimiters = [
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
]

const columns = [
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
    name: 'walkin',
    align: 'left',
    label: t('interview.participant_walkin'),
    field: 'createdBy',
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

// Computed
const hasParticipants = computed(() => {
  return (participants.value && participants.value.length > 0) || (filter.value && filter.value.length > 1)
})

const disableSaveParticipant = computed(() => {
  if (participantData.value.validFrom && participantData.value.validUntil) {
    try {
      const from = new Date(participantData.value.validFrom)
      const until = new Date(participantData.value.validUntil)
      return from > until
    } catch (e) {
      return true
    }
  }
  return false
})

const disableImportParticipants = computed(() => participantsFile.value === null)

const participantDataStr = computed(() => JSON.stringify(participantData.value, null, '  '))

const eligibleOptions = computed(() => [
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
])

// Methods
function onFilter() {
  tableRef.value.requestServerInteraction()
}

function updateTableParticipants() {
  selected.value = []
  const valid = eligibleFilter.value === '0' ? undefined : eligibleFilter.value === 'true'
  participantService.getParticipants(paginationOpts.value, props.campaign._id, filter.value, valid)
    .then(response => {
      participants.value = response.data
      paginationOpts.value.rowsNumber = response.total
    })
    .catch(err => handleError(err))
}

async function getTableParticipants(requestProp) {
  if (requestProp) {
    paginationOpts.value = requestProp.pagination
    await updateTableParticipants()
  } else {
    await updateTableParticipants()
  }
}

function deleteAttribute(idx) {
  participantData.value.attributes.splice(idx, 1)
}

function addAttribute() {
  participantData.value.attributes.push({
    key: '',
    value: ''
  })
}

function deleteAttributes() {
  participantData.value.attributes = [
    {
      key: '',
      value: ''
    }
  ]
}

function asParticipantData(attributes) {
  const data = {}
  attributes
    .filter(attribute => attribute.key !== undefined && attribute.key.trim() !== '')
    .forEach(attribute => {
      data[attribute.key.replaceAll(' ', '_')] = attribute.value
    })
  return data
}

function asParticipantAttributes(data) {
  const attributes = []
  for (const key in data) {
    attributes.push({
      key: key,
      value: data[key]
    })
  }
  return attributes
}

function addParticipant() {
  participantData.value.data = asParticipantData(participantData.value.attributes)
  delete participantData.value.data.attributes
  if (addMode.value === 'single') {
    participantService.createParticipant(participantData.value)
      .then(() => {
        Notify.create({
          message: t('success.create_participant'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        updateTableParticipants()
      })
      .catch(err => handleError(err))
  } else {
    const pTemplate = { ...participantData.value }
    delete pTemplate.identifier
    const participantsArr = []
    for (let i = 0; i < addCount.value; i++) {
      participantsArr.push(pTemplate)
    }
    participantService.createParticipant(participantsArr)
      .then(() => {
        Notify.create({
          message: t('success.create_participants'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        updateTableParticipants()
      })
      .catch(err => handleError(err))
  }
}

function handleError(err) {
  if (err.code === 400) {
    errorHandler.onError(err, err.message)
  } else {
    errorHandler.onError(err, t('error.general'))
  }
}

function editParticipant() {
  participantData.value.data = asParticipantData(participantData.value.attributes)
  delete participantData.value.data.attributes
  participantService.patchParticipant(participantData.value)
    .then(() => {
      Notify.create({
        message: t('success.update_participant'),
        color: 'positive',
        icon: 'fas fa-check'
      })
      updateTableParticipants()
    })
    .catch(err => handleError(err))
}

function resetPassword(participant) {
  participantData.value = {
    _id: participant._id,
    password: null
  }
  participantService.patchParticipant(participantData.value)
    .then(() => {
      Notify.create({
        message: t('success.reset_participant_password'),
        color: 'positive',
        icon: 'fas fa-check'
      })
      updateTableParticipants()
    })
    .catch(err => handleError(err))
}

function doActivateParticipant(participant, activated) {
  participantData.value = {
    _id: participant._id,
    activated: activated
  }
  participantService.patchParticipant(participantData.value)
    .then(() => {
      Notify.create({
        message: activated ? t('success.activate_participant') : t('success.pause_participant'),
        color: 'positive',
        icon: 'fas fa-check'
      })
      updateTableParticipants()
    })
    .catch(err => handleError(err))
}

function activateParticipant(participant) {
  doActivateParticipant(participant, true)
}

function pauseParticipant(participant) {
  doActivateParticipant(participant, false)
}

function deleteParticipant() {
  participantService.deleteParticipant(participantData.value._id)
    .then(() => {
      Notify.create({
        message: t('success.delete_participant'),
        color: 'positive',
        icon: 'fas fa-check'
      })
      updateTableParticipants()
    })
    .catch(err => handleError(err))
}

function deleteParticipants() {
  participantService.deleteParticipants(selected.value.map(p => p._id))
    .then(() => {
      Notify.create({
        message: t('success.delete_participants'),
        color: 'positive',
        icon: 'fas fa-check'
      })
      updateTableParticipants()
    })
    .catch(err => handleError(err))
}

function importParticipants() {
  const knownHeaders = ['identifier', 'validFrom', 'validUntil', 'activated']
  const campaignId = props.campaign._id
  // const delim = participantsFile.value.name.endsWith('.tsv') ? '\t' : ','
  proxy.$papa.parse(participantsFile.value, {
    header: true,
    delimiter: delimiter.value,
    complete: function (results, file) {
      if (results.errors.length === 0) {
        console.error(results.error)
      }
      if (results.data.length > 0) {
        const participantsArr = []
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
            participantsArr.push(pobj)
          }
        })
        if (participantsArr.length > 0) {
          participantService.createParticipant(participantsArr)
            .then(() => {
              Notify.create({
                message: t('success.create_participants'),
                color: 'positive',
                icon: 'fas fa-check'
              })
              updateTableParticipants()
            })
            .catch(err => {
              updateTableParticipants() // some may have passed
              handleError(err)
            })
        }
      }
    }
  })
}

function onAddParticipant() {
  participantData.value = {
    identifier: null,
    validFrom: null,
    validUntil: null,
    campaign: props.campaign._id,
    attributes: [
      {
        key: '',
        value: ''
      }
    ]
  }
  addMode.value = 'single'
  addCount.value = 10
  showAddParticipant.value = true
}

function onImport() {
  participantsFile.value = null
  showImportParticipants.value = true
}

function onExport(format) {
  let accept = 'application/json'
  if (format === 'csv') {
    accept = 'text/csv'
  } else if (format === 'xlsx') {
    accept = 'application/vnd.ms-excel'
  }
  const ids = selected.value.map(u => u._id)
  const valid = eligibleFilter.value === '0' ? undefined : eligibleFilter.value === 'true'
  participantService.downloadParticipants(accept, props.campaign._id, filter.value, valid, ids)
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
}

function toParticipantData(participant) {
  participantData.value = { ...participant }
  participantData.value.validFrom = participantData.value.validFrom ? date.formatDate(participantData.value.validFrom, 'YYYY-MM-DD') : null
  participantData.value.validUntil = participantData.value.validUntil ? date.formatDate(participantData.value.validUntil, 'YYYY-MM-DD') : null
  // remove internal fields or fields that are already in the columns
  delete participantData.value._id
  delete participantData.value.interviewDesign
  delete participantData.value.campaign
  delete participantData.value.study
  delete participantData.value.createdBy
  delete participantData.value.activated
  delete participantData.value.lastSeen
}

function onEdit(participant) {
  toParticipantData(participant)
  participantData.value._id = participant._id
  participantData.value.attributes = asParticipantAttributes(participantData.value.data)
  delete participantData.value.data
  showEditParticipant.value = true
}

function onView(participant) {
  toParticipantData(participant)
  // remove internal fields or fields that are already in the columns
  delete participantData.value.validFrom
  delete participantData.value.validUntil
  showViewParticipant.value = true
}

function onConfirmDelete(participant) {
  participantData.value = { ...participant }
  showConfirmDeleteParticipant.value = true
}

function onConfirmDeleteMultiple() {
  showConfirmDeleteParticipants.value = true
}

// Lifecycle
onMounted(() => {
  updateTableParticipants()
})
</script>
