<template>
  <div v-cloak>
    <q-btn
      v-if="!isReadOnly"
      color="primary"
      icon="add"
      :label="$t('interview.add_campaign_hint')"
      @click="onAddCampaign()"
      class="q-mt-md q-mb-md" />

    <q-tabs
      v-if="campaigns"
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
        <div class="q-mt-md" style="max-width: 350px">
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
              <q-item-section>
                <q-item-label>{{ $t('interview.campaign_investigators') }}</q-item-label>
                <div>
                  <q-chip v-for="id in campaign.investigators" icon="person" size="sm" :label="getSubject(id, 'user').name" :key="id"/>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="q-mt-md">
          <div class="text-h6 text-capitalize">{{ $t('participants') }}</div>
          <participants :campaign="campaign"/>
        </div>
      </q-tab-panel>
    </q-tab-panels>

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

export default defineComponent({
  components: {
    Participants: defineAsyncComponent(() => import('src/components/interviews/Participants.vue'))
  },
  name: 'StudyCaseReportForms',
  mixins: [AuthMixin],
  mounted () {
    Promise.all([
      subjectsService.getSubjects().then((result) => {
        this.subjects = result
      }),
      this.initCampaigns()
    ])
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
      subjects: []
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
      await this.getCampaigns({ paginationOpts: this.paginationOpts, interviewDesign: this.interviewDesign })
      this.tab = this.campaigns[0].name
    },
    getSubject (id, type) {
      if (this.subjects && this.subjects.length > 0) {
        return this.subjects.filter(s => s.type === type && s.id === id).pop()
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
        campaign: toSave
      })
    },
    editCampaign () {
      const toSave = { ...this.campaignData }
      this.updateCampaign({
        campaign: toSave
      })
    },
    removeCampaign () {
      this.deleteCampaign({
        id: this.campaignData._id
      })
    }
  }
})
</script>
