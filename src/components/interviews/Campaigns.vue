<template>
  <div v-cloak>
    <q-btn
      v-if="!isReadOnly"
      color="primary"
      icon="add"
      :label="$t('interview.add_campaign_hint')"
      @click="onAddCampaign()"/>

    <div v-if="campaigns && campaigns.length>0" class="q-mt-md">

      <q-tabs
        v-model="tab"
        align="left"
        inline-label
        outside-arrows
        mobile-arrows
        dense
        class="text-grey"
        active-color="info"
        indicator-color="info"
      >
        <q-tab v-for="campaign in campaigns" :key="campaign._id" :name="campaign.name" :label="campaign.name" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab">

        <q-tab-panel v-for="campaign in campaigns" :key="campaign._id" :name="campaign.name" class="q-pa-none">
          <div v-if="!isReadOnly" class="q-mt-md q-mb-md">
            <q-btn
              color="secondary"
              size="12px"
              flat
              dense
              round
              icon="edit"
              :title="$t('interview.edit_campaign_hint')"
              @click='onEditCampaign(campaign)'>
            </q-btn>
            <q-btn
              size="12px"
              flat
              dense
              round
              color="negative"
              icon="delete_outline"
              :title="$t('interview.delete_campaign_hint')"
              @click='onConfirmDeleteCampaign(campaign)'>
            </q-btn>
          </div>
          <div class="q-mt-md">
            <div class="row q-col-gutter-lg">
              <div class="col-6">
                <p class="text-weight-bold q-mb-sm">{{ $t('interview.definition') }}</p>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label>{{ $t('name') }}</q-item-label>
                      <q-item-label caption>{{ campaign.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>{{ $t('description') }}</q-item-label>
                      <q-item-label caption>{{ campaign.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_investigators_hint')">
                      <q-item-label>{{ $t('interview.campaign_investigators') }}</q-item-label>
                      <div>
                        <q-chip v-for="sub in investigatorSubjects" icon="person" size="sm" :label="sub.name" :key="sub._id"/>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
                <p class="text-weight-bold q-mt-md q-mb-sm">{{ $t('interview.campaign_security') }}</p>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_with_password_hint')">
                      <q-item-label>{{ $t('interview.campaign_with_password') }}</q-item-label>
                      <q-toggle v-model="campaign.withPassword" disable />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div class="col-6">
                <p class="text-weight-bold q-mb-sm">{{ $t('interview.schedule') }}</p>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_valid_from_hint')">
                      <q-item-label>{{ $t('interview.campaign_valid_from') }}</q-item-label>
                      <q-item-label caption>{{ campaign.validFrom ? date.formatDate(campaign.validFrom, 'YYYY-MM-DD') : '-' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_valid_until_hint')">
                      <q-item-label>{{ $t('interview.campaign_valid_until') }}</q-item-label>
                      <q-item-label caption>{{ campaign.validUntil ? date.formatDate(campaign.validUntil, 'YYYY-MM-DD') : '-' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_weeks_reminder_hint')">
                      <q-item-label>{{ $t('interview.campaign_weeks_reminder') }}</q-item-label>
                      <q-item-label caption>{{ campaign.weeksBetweenReminders }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_reminders_count_hint')">
                      <q-item-label>{{ $t('interview.campaign_reminders_count') }}</q-item-label>
                      <q-item-label caption>{{ campaign.numberOfReminders }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_weeks_deactivate_hint')">
                      <q-item-label>{{ $t('interview.campaign_weeks_deactivate') }}</q-item-label>
                      <q-item-label caption>{{ campaign.weeksToDeactivate }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
          <div class="q-mt-md">
            <div class="text-h6 text-capitalize">{{ $t('participants') }}</div>
            <participants :campaign="campaign"/>
          </div>
        </q-tab-panel>
      </q-tab-panels>

    </div>

    <q-dialog v-model='showAddCampaign' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='campaignData.name'
            :label="$t('name')"
            lazy-rules
            @blur="v$.campaignData.name.$touch"
            :error="v$.campaignData.name.$error"
            :hint="$t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.campaignData.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='campaignData.description'
            :label="$t('description')"
            autogrow
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="campaignData.investigators"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="$t('interview.campaign_investigators')"
            :hint="$t('interview.campaign_investigators_hint')" />
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md q-col-gutter-md">
            <div class="col-6">
              <q-input
                filled
                v-model="campaignData.validFrom"
                :label="$t('interview.campaign_valid_from')"
                :hint="$t('interview.campaign_valid_from_hint')">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="campaignData.validFrom" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input
                filled
                v-model="campaignData.validUntil"
                :label="$t('interview.campaign_valid_until')"
                :hint="$t('interview.campaign_valid_until_hint')">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="campaignData.validUntil" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='addCampaign'
            :disable="disableSaveCampaign"
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

    <q-dialog v-model='showEditCampaign' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='campaignData.name'
            :label="$t('name')"
            lazy-rules
            @blur="v$.campaignData.name.$touch"
            :error="v$.campaignData.name.$error"
            :hint="$t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.campaignData.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='campaignData.description'
            :label="$t('description')"
            autogrow
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="campaignData.investigators"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="$t('interview.campaign_investigators')"
            :hint="$t('interview.campaign_investigators_hint')" />
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input
                filled
                v-model="campaignData.validFrom"
                :label="$t('interview.campaign_valid_from')"
                :hint="$t('interview.campaign_valid_from_hint')">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="campaignData.validFrom" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input
                filled
                v-model="campaignData.validUntil"
                :label="$t('interview.campaign_valid_until')"
                :hint="$t('interview.campaign_valid_until_hint')">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="campaignData.validUntil" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mt-md q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model.number='campaignData.weeksBetweenReminders'
                type="number"
                :label="$t('interview.campaign_weeks_reminder')"
                :hint="$t('interview.campaign_weeks_reminder_hint')"
                lazy-rules
              />
            </div>
            <div class="col-6">
              <q-input
                v-model.number='campaignData.numberOfReminders'
                type="number"
                :label="$t('interview.campaign_reminders_count')"
                :hint="$t('interview.campaign_reminders_count_hint')"
                lazy-rules
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mt-md q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model.number='campaignData.weeksToDeactivate'
                type="number"
                :label="$t('interview.campaign_weeks_deactivate')"
                :hint="$t('interview.campaign_weeks_deactivate_hint')"
                lazy-rules
              />
            </div>
            <div class="col-6">
              <q-toggle
                v-model="campaignData.withPassword"
                :label="$t('interview.campaign_with_password')" />
              <div class="text-caption text-grey-7">{{ $t('interview.campaign_with_password_hint') }}</div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='editCampaign'
            :disable="disableSaveCampaign"
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

    <q-dialog v-model='showDeleteCampaign' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('interview.delete_campaign_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ campaignData.name }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='removeCampaign'
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
import { mapState, mapActions } from 'vuex'
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { subjectsService } from '../../services/utils'
import AuthMixin from '../../mixins/AuthMixin'
import { date } from 'quasar'

export default defineComponent({
  components: {
    Participants: defineAsyncComponent(() => import('src/components/interviews/Participants.vue'))
  },
  name: 'StudyCaseReportForms',
  mixins: [AuthMixin],
  mounted () {
    subjectsService.getSubjects().then((result) => {
      this.subjects = result
      this.initCampaigns()
    })
  },
  setup () {
    return {
      v$: useVuelidate(),
      tab: ref(''),
      selected: ref([]),
      paginationOpts: {
        descending: true,
        page: 1,
        rowsPerPage: 10
      },
      showAddCampaign: ref(false),
      showEditCampaign: ref(false),
      showDeleteCampaign: ref(false),
      campaignData: ref({}),
      subjects: [],
      date
    }
  },
  validations: {
    campaignData: {
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
      interviewDesign: state => state.interview.interviewDesign,
      campaigns: state => state.interview.campaigns
    }),
    disableSaveCampaign () {
      return this.v$.campaignData.$invalid || this.campaignData.investigators.length === 0
    },
    userSubjectOptions () {
      return this.getSubjectOptions('user')
    },
    investigatorSubjects () {
      if (this.tab !== '') {
        const rval = this.campaigns.find((cmp) => cmp.name === this.tab).investigators.map((id) => this.getSubject(id, 'user'))
        return rval
      }
      return []
    }
  },
  methods: {
    ...mapActions({
      getCampaigns: 'interview/getCampaigns',
      createCampaign: 'interview/createCampaign',
      updateCampaign: 'interview/updateCampaign',
      deleteCampaign: 'interview/deleteCampaign'
    }),
    async initCampaigns () {
      await this.getCampaigns({ paginationOpts: this.paginationOpts, interviewDesign: this.interviewDesign._id })
      if (this.campaigns.length > 0) {
        this.tab = this.campaigns[0].name
      }
    },
    getSubject (id, type) {
      if (this.subjects && this.subjects.length > 0) {
        return this.subjects.find(s => s.type === type && s.id === id)
      }
      return { id: id, type: type, name: '?' }
    },
    getSubjectOptions (type) {
      return this.subjects.filter(s => s.type === type).map(s => {
        return {
          value: s.id,
          label: s.name
        }
      })
    },
    onAddCampaign () {
      this.campaignData = {
        name: '',
        investigators: []
      }
      this.showAddCampaign = true
    },
    onEditCampaign (campaign) {
      this.campaignData = { ...campaign }
      this.campaignData.validFrom = this.campaignData.validFrom ? date.formatDate(this.campaignData.validFrom, 'YYYY-MM-DD') : null
      this.campaignData.validUntil = this.campaignData.validUntil ? date.formatDate(this.campaignData.validUntil, 'YYYY-MM-DD') : null
      this.showEditCampaign = true
    },
    onConfirmDeleteCampaign (campaign) {
      this.campaignData = { ...campaign }
      this.showDeleteCampaign = true
    },
    addCampaign () {
      const toSave = { ...this.campaignData }
      toSave.interviewDesign = this.interviewDesign._id
      this.createCampaign({
        campaign: toSave,
        interviewDesign: this.interviewDesign
      }).then(() => { this.tab = this.campaignData.name })
    },
    editCampaign () {
      const toSave = { ...this.campaignData }
      this.updateCampaign({
        campaign: toSave,
        interviewDesign: this.interviewDesign
      }).then(() => { this.tab = this.campaignData.name })
    },
    removeCampaign () {
      const idx = this.campaigns.map(campaign => campaign.name).indexOf(this.campaignData.name)
      const nextidx = idx === this.campaigns.length - 1 ? idx - 1 : idx + 1
      const nexttab = nextidx < 0 ? undefined : this.campaigns[nextidx].name
      this.deleteCampaign({
        id: this.campaignData._id,
        interviewDesign: this.interviewDesign
      }).then(() => { this.tab = nexttab })
    }
  }
})
</script>
