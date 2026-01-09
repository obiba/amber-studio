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
        @update:model-value="getCampaignMetrics"
      >
        <q-tab v-for="campaign in campaigns" :key="campaign._id" :name="campaign.name" :label="campaign.name" no-caps />
      </q-tabs>

      <q-separator />

      <div v-if="counts.interviews && counts.interviews.total > 0" class="q-mt-md">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <records-chart
              chartId="interviews"
              :title="$t('chart.cumulated_interviews')"
              :aggregations="counts.interviews_agg"
              height="300px"/>
          </div>
          <div class="col-12 col-md-6">
            <pie-chart
              chartId="interviewsState"
              :title="$t('chart.interview_states')"
              :frequencies="interviewStateFrequencies"
              height="250px"/>
          </div>
        </div>
      </div>

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
              <div class="col-12 col-md-6">
                <p class="text-weight-bold q-mb-sm">{{ $t('interview.definition') }}</p>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label>{{ $t('name') }}</q-item-label>
                      <q-item-label caption>{{ campaign.name }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $t('description') }}</q-item-label>
                      <q-item-label caption>{{ campaign.description || '-' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_investigators_hint')">
                      <q-item-label>{{ $t('interview.campaign_investigators') }}</q-item-label>
                      <div>
                        <q-chip v-for="sub in investigatorSubjects" icon="person" size="sm" :label="sub.name" :key="sub._id"/>
                      </div>
                      <div v-if="!isReadOnly" class="q-mt-sm">
                        <q-btn-dropdown
                          color="primary"
                          split
                          icon="send"
                          :label="$t('interview.campaign_notifications')"
                          size="sm">
                          <q-list>
                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-info-activate')">
                              <q-item-section>
                                <q-item-label>{{$t('tasks.types.participants-info-activate')}}</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-activate')">
                              <q-item-section>
                                <q-item-label>{{$t('tasks.types.participants-activate')}}</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-reminder')">
                              <q-item-section>
                                <q-item-label>{{$t('tasks.types.participants-reminder')}}</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-info-expire')">
                              <q-item-section>
                                <q-item-label>{{$t('tasks.types.participants-info-expire')}}</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-summary')">
                              <q-item-section>
                                <q-item-label>{{$t('tasks.types.participants-summary')}}</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-deactivate')">
                              <q-item-section>
                                <q-item-label>{{$t('tasks.types.participants-deactivate')}}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-btn-dropdown>
                      </div>
                    </q-item-section>
                    <q-item-section :title="$t('interview.campaign_supporters_hint')">
                      <q-item-label>{{ $t('interview.campaign_supporters') }}</q-item-label>
                      <div>
                        <q-chip v-for="sub in supporterSubjects" icon="person" size="sm" :label="sub.name" :key="sub._id"/>
                        <span v-if="supporterSubjects.length === 0">-</span>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_notify_on_interview_completion_hint')">
                      <q-item-label>{{ $t('interview.campaign_notify_on_interview_completion') }}</q-item-label>
                      <q-toggle v-model="campaign.notifyOnInterviewCompletion" disable />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_visit_hint')">
                      <q-item-label>{{ $t('interview.campaign_visit') }}</q-item-label>
                      <q-item-label caption>
                        <a v-if="campaign.visitUrl" :href="campaign.visitUrl" target="_blank">{{ campaign.visitUrl }}</a>
                        <span v-else>-</span>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section :title="$t('interview.campaign_completion_hint')">
                      <q-item-label>{{ $t('interview.campaign_completion') }}</q-item-label>
                      <q-item-label caption>
                        <a v-if="campaign.completionUrl" :href="campaign.completionUrl" target="_blank">{{ campaign.completionUrl }}</a>
                        <span v-else>-</span>
                      </q-item-label>
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
              <div class="col-12 col-md-6">
                <p class="text-weight-bold q-mb-sm">{{ $t('interview.schedule') }}</p>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_valid_from_hint')">
                      <q-item-label>{{ $t('interview.campaign_valid_from') }}</q-item-label>
                      <q-item-label caption>{{ campaign.validFrom ? date.formatDate(campaign.validFrom, 'YYYY-MM-DD') : '-' }}</q-item-label>
                    </q-item-section>
                    <q-item-section :title="$t('interview.campaign_valid_until_hint')">
                      <q-item-label>{{ $t('interview.campaign_valid_until') }}</q-item-label>
                      <q-item-label caption>{{ campaign.validUntil ? date.formatDate(campaign.validUntil, 'YYYY-MM-DD') : '-' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_weeks_info_before_activate_hint')">
                      <q-item-label>{{ $t('interview.campaign_weeks_info_before_activate') }}</q-item-label>
                      <q-item-label caption>{{ campaign.weeksInfoBeforeActivation }}</q-item-label>
                    </q-item-section>
                    <q-item-section :title="$t('interview.campaign_weeks_reminder_hint')">
                      <q-item-label>{{ $t('interview.campaign_weeks_reminder') }}</q-item-label>
                      <q-item-label caption>{{ campaign.weeksBetweenReminders }}</q-item-label>
                    </q-item-section>
                    <q-item-section :title="$t('interview.campaign_reminders_count_hint')">
                      <q-item-label>{{ $t('interview.campaign_reminders_count') }}</q-item-label>
                      <q-item-label caption>{{ campaign.numberOfReminders }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_weeks_info_before_expire_hint')">
                      <q-item-label>{{ $t('interview.campaign_weeks_info_before_expire') }}</q-item-label>
                      <q-item-label caption>{{ campaign.weeksInfoBeforeDeactivation }}</q-item-label>
                    </q-item-section>
                    <q-item-section :title="$t('interview.campaign_weeks_deactivate_hint')">
                      <q-item-label>{{ $t('interview.campaign_weeks_deactivate') }}</q-item-label>
                      <q-item-label caption>{{ campaign.weeksToDeactivate }}</q-item-label>
                    </q-item-section>
                    <q-item-section />
                  </q-item>
                </q-list>
                <p class="text-weight-bold q-mt-md q-mb-sm">{{ $t('interview.campaign_walkin_participants') }}</p>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section :title="$t('interview.campaign_with_walkin_participants_hint')">
                      <q-item-label>{{ $t('interview.campaign_with_walkin_participants') }}</q-item-label>
                      <q-toggle v-model="campaign.walkInEnabled" disable />
                    </q-item-section>
                  </q-item>
                  <q-item v-if="campaign.walkInEnabled && campaign.walkInData">
                    <q-item-section :title="$t('interview.campaign_walkin_url_parameters_hint')">
                      <q-item-label>{{ $t('interview.campaign_walkin_url_parameters') }}</q-item-label>
                      <q-item-label caption>{{ getWalkInParameters(campaign).join(', ') || '-' }}</q-item-label>
                    </q-item-section>
                    <q-item-section :title="$t('interview.campaign_walkin_participant_attributes_hint')">
                      <q-item-label>{{ $t('interview.campaign_walkin_participant_attributes') }}</q-item-label>
                      <q-item-label caption>{{ getWalkInAttributesArray(campaign).map((entry) => `${entry.key}=${entry.value}`).join('; ') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="campaign.walkInEnabled">
                    <q-item-section :title="$t('interview.campaign_walkin_visit_hint')">
                      <q-item-label v-if="hasWalkInParameters(campaign)">{{ $t('interview.campaign_external_visit') }}</q-item-label>
                      <q-item-label v-else>{{ $t('interview.campaign_walkin_visit') }}</q-item-label>
                      <q-item-label caption>
                        <span v-if="campaign.visitUrl && hasWalkInParameters(campaign)">{{ makeWalkInUrl(campaign) }}</span>
                        <a v-else-if="campaign.visitUrl" :href="makeWalkInUrl(campaign)" target="_blank" >{{ makeWalkInUrl(campaign) }}</a>
                        <span v-else>-</span>
                      </q-item-label>
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
          <q-select
            v-model="campaignData.supporters"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="$t('interview.campaign_supporters')"
            :hint="$t('interview.campaign_supporters_hint')" />
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
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'width: 1000px; max-width: 80vw'">
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
          <q-input
            v-model='campaignData.visitUrl'
            :label="$t('interview.campaign_visit')"
            :hint="$t('interview.campaign_visit_hint')"
            placeholder="https://"
            @blur="v$.campaignData.name.$touch"
            :error="v$.campaignData.name.$error"
            lazy-rules
          >
            <template v-slot:error>
              <div v-for="error in v$.campaignData.visitUrl.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='campaignData.completionUrl'
            :label="$t('interview.campaign_completion')"
            :hint="$t('interview.campaign_completion_hint')"
            placeholder="https://"
            @blur="v$.campaignData.name.$touch"
            :error="v$.campaignData.name.$error"
            lazy-rules
          >
            <template v-slot:error>
              <div v-for="error in v$.campaignData.completionUrl.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <div class="row q-mt-md q-col-gutter-sm">
            <div class="col-6">
              <q-select
                v-model="campaignData.investigators"
                :options="userSubjectOptions"
                emit-value
                map-options
                multiple
                use-chips
                :label="$t('interview.campaign_investigators')"
                :hint="$t('interview.campaign_investigators_hint')" />
            </div>
            <div class="col-6">
              <q-select
                v-model="campaignData.supporters"
                :options="userSubjectOptions"
                emit-value
                map-options
                multiple
                use-chips
                :label="$t('interview.campaign_supporters')"
                :hint="$t('interview.campaign_supporters_hint')" />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-toggle
            v-model="campaignData.notifyOnInterviewCompletion"
            :label="$t('interview.campaign_notify_on_interview_completion')" />
          <div class="text-caption text-grey-7">{{ $t('interview.campaign_notify_on_interview_completion_hint') }}</div>
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
                v-model.number="campaignData.weeksInfoBeforeActivation"
                type="number"
                :label="$t('interview.campaign_weeks_info_before_activate')"
                :hint="$t('interview.campaign_weeks_info_before_activate_hint')"
                lazy-rules
              />
            </div>
            <div class="col-6">
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mt-md q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model.number="campaignData.weeksBetweenReminders"
                type="number"
                :label="$t('interview.campaign_weeks_reminder')"
                :hint="$t('interview.campaign_weeks_reminder_hint')"
                lazy-rules
              />
            </div>
            <div class="col-6">
              <q-input
                v-model.number="campaignData.numberOfReminders"
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
                v-model.number="campaignData.weeksInfoBeforeDeactivation"
                type="number"
                :label="$t('interview.campaign_weeks_info_before_expire')"
                :hint="$t('interview.campaign_weeks_info_before_expire_hint')"
                lazy-rules
              />
            </div>
            <div class="col-6">
              <q-input
                v-model.number="campaignData.weeksToDeactivate"
                type="number"
                :label="$t('interview.campaign_weeks_deactivate')"
                :hint="$t('interview.campaign_weeks_deactivate_hint')"
                lazy-rules
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mt-md q-col-gutter-sm">
            <div class="col-6">
              <q-toggle
                v-model="campaignData.withPassword"
                :label="$t('interview.campaign_with_password')" />
              <div class="text-caption text-grey-7">{{ $t('interview.campaign_with_password_hint') }}</div>
            </div>
            <div class="col-6">
              <q-toggle
                v-model="campaignData.walkInEnabled"
                :label="$t('interview.campaign_with_walkin_participants')" />
              <div class="text-caption text-grey-7">{{ $t('interview.campaign_with_walkin_participants_hint') }}</div>
              <div v-if="campaignData.walkInEnabled">
                <q-input
                  v-model="campaignData.walkinParamsStr"
                  :label="$t('interview.campaign_walkin_url_parameters')"
                  :hint="$t('interview.campaign_walkin_url_parameters_hint')"
                />
                <p class="q-mb-xs q-mt-md">{{ $t('interview.campaign_walkin_participant_attributes') }}</p>
                <p class="text-secondary text-caption">{{ $t('interview.campaign_walkin_participant_attributes_hint') }}</p>
                <div class="row q-col-gutter-md" v-for="(attribute, key) in campaignData.walkinAttributes" :key="campaignData.walkinAttributes.indexOf(attribute)">
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
                      @click='deleteWalkInAttribute(key)'>
                    </q-btn>
                  </div>
                </div>
                <div class="row q-col-gutter-sm">
                  <div class="col-4">
                    <q-btn
                      color="primary"
                      icon="add"
                      :title="$t('interview.add_participant_attribute_hint')"
                      @click="addWalkInAttribute()"
                      class="q-mr-sm"
                    />
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete_outline"
                      :title="$t('interview.delete_participant_attributes_hint')"
                      @click="deleteWalkInAttributes()"
                    />
                  </div>
                </div>
              </div>
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
import { subjectsService, metricsService } from '../../services/utils'
import AuthMixin from '../../mixins/AuthMixin'
import { date } from 'quasar'

export default defineComponent({
  components: {
    Participants: defineAsyncComponent(() => import('src/components/interviews/Participants.vue')),
    RecordsChart: defineAsyncComponent(() => import('components/dashboard/RecordsChart')),
    PieChart: defineAsyncComponent(() => import('components/charts/PieChart'))
  },
  name: 'StudyCaseReportForms',
  mixins: [AuthMixin],
  mounted () {
    subjectsService.getSubjects().then((result) => {
      this.subjects = result
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
        rowsPerPage: 100,
        sortBy: 'name'
      },
      showAddCampaign: ref(false),
      showEditCampaign: ref(false),
      showDeleteCampaign: ref(false),
      campaignData: ref({}),
      subjects: [],
      date,
      counts: ref({})
    }
  },
  validations: {
    campaignData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      visitUrl: {
        url: (value) => !value || /^https?:\/\/.*/.test(value)
      },
      completionUrl: {
        url: (value) => !value || /^https?:\/\/.*/.test(value)
      }
    }
  },
  watch: {
    study () {
      this.initCampaigns()
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
        const rval = this.campaigns
          .find((cmp) => cmp.name === this.tab).investigators
          .map((id) => this.getSubject(id, 'user'))
          .filter((sub) => sub !== undefined)
        return rval
      }
      return []
    },
    supporterSubjects () {
      if (this.tab !== '') {
        const supporters = this.campaigns
          .find((cmp) => cmp.name === this.tab).supporters
        if (supporters) {
          const rval = supporters
            .map((id) => this.getSubject(id, 'user'))
            .filter((sub) => sub !== undefined)
          return rval
        }
      }
      return []
    },
    interviewStateFrequencies () {
      let itwFreqs = []
      if (this.counts.interviews_freq) {
        itwFreqs = this.counts.interviews_freq.map((f) => {
          return {
            name: this.$t(`study.interview_state.${f._id}`),
            value: f.count
          }
        })
      }
      if (this.counts.participants_freq) {
        const totalItw = this.counts.interviews_freq
          ? this.counts.interviews_freq.map((f) => f.count).reduce((a, b) => a + b, 0)
          : 0
        const totalPart = this.counts.participants_freq.map((f) => f.count).reduce((a, b) => a + b, 0)
        itwFreqs.push({
          name: this.$t('study.interview_state.not_started'),
          value: totalPart - totalItw
        })
      }
      return itwFreqs
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
        this.tab = this.$route.query.c
          ? (this.campaigns.find(c => c._id === this.$route.query.c) || this.campaigns[0]).name
          : this.campaigns[0].name
        this.getCampaignMetrics()
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
    getCampaignMetrics () {
      const name = this.tab
      const campaign = this.campaigns.find((cmp) => cmp.name === name)
      if (campaign) {
        metricsService.getMetrics({
          type: 'interview',
          query: {
            interview: {
              interviewDesign: this.interviewDesign._id,
              campaign: campaign._id
            },
            participant: {
              interviewDesign: this.interviewDesign._id,
              campaign: campaign._id
            }
          }
        }).then((result) => {
          this.counts = result.counts ? result.counts : {}
        })
      } else {
        this.counts = {}
      }
    },
    onAddCampaign () {
      this.campaignData = {
        name: '',
        investigators: [],
        walkinParamsStr: '',
        walkinAttributes: [],
      }
      this.showAddCampaign = true
    },
    onEditCampaign (campaign) {
      this.campaignData = { ...campaign, walkinParamsStr: '', walkinAttributes: {} }
      this.campaignData.validFrom = this.campaignData.validFrom ? date.formatDate(this.campaignData.validFrom, 'YYYY-MM-DD') : null
      this.campaignData.validUntil = this.campaignData.validUntil ? date.formatDate(this.campaignData.validUntil, 'YYYY-MM-DD') : null
      this.campaignData.walkinParamsStr = this.getWalkInParameters(campaign).join(', ')
      this.campaignData.walkinAttributes = this.getWalkInAttributesArray(campaign)
      this.campaignData.notifyOnInterviewCompletion = !!this.campaignData.notifyOnInterviewCompletion
      this.showEditCampaign = true
    },
    deleteWalkInAttribute (idx) {
      this.campaignData.walkinAttributes.splice(idx, 1)
    },
    addWalkInAttribute () {
      this.campaignData.walkinAttributes.push({
        key: '',
        value: ''
      })
    },
    deleteWalkInAttributes () {
      this.campaignData.walkinAttributes = [
        {
          key: '',
          value: ''
        }
      ]
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
      }).then(() => {
        this.tab = this.campaignData.name
        this.getCampaignMetrics()
      })
    },
    editCampaign () {
      const toSave = { ...this.campaignData }
      toSave.walkInData = {}
      if (toSave.walkInEnabled) {
        toSave.walkinParamsStr.replaceAll(',', ' ').split(' ').forEach((param) => {
          const key = param.trim()
          if (key && key.length > 0) {
            toSave.walkInData[key] = null // null means it will be replaced by the walk-in participant
          }
        })
        toSave.walkinAttributes.forEach((attr) => {
          if (attr.key && attr.key.trim().length > 0 && attr.value) {
            toSave.walkInData[attr.key.replaceAll(' ', '_')] = attr.value
          }
        })
      }
      delete toSave.walkinParamsStr
      delete toSave.walkinAttributes
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
      }).then(() => {
        this.tab = nexttab
        this.getCampaignMetrics()
      })
    },
    makeWalkInUrl (campaign) {
      if (campaign.visitUrl && campaign.walkInEnabled) {
        const baseUrl = campaign.visitUrl.replace(/\/$/, '')
        let queryParams = `campaign=${campaign._id}`
        if (campaign.walkInData) {
          Object.entries(campaign.walkInData).forEach(([key, value]) => {
            if (value === null) {
              const val = `{{%${key}%}}`
              queryParams = `${queryParams}&${key}=${val}`
            }
          })
        }
        return `${baseUrl}/go?${queryParams}`
      }
      return campaign.visitUrl
    },
    hasWalkInParameters (campaign) {
      // has any walk-in data with null values
      if (!campaign || !campaign.walkInData) return false
      if (Object.keys(campaign.walkInData).length === 0) return false
      for (const key in campaign.walkInData) {
        if (campaign.walkInData[key] === null) {
          return true
        }
      }
      // if all values are not null, return false
      return false
    },
    getWalkInParameters (campaign) {
      if (!campaign || !campaign.walkInData) return []
      if (Object.keys(campaign.walkInData).length === 0) return []
      const params = []
      for (const key in campaign.walkInData) {
        if (campaign.walkInData[key] === null) {
          params.push(key)
        }
      }
      return params
    },
    getWalkInAttributesArray (campaign) {
      if (!campaign || !campaign.walkInData) return []
      if (Object.keys(campaign.walkInData).length === 0) return []
      const attributes = []
      for (const key in campaign.walkInData) {
        if (campaign.walkInData[key] !== null) {
          attributes.push({ key: key, value: campaign.walkInData[key] })
        }
      }
      return attributes
    },
    onParticipantsTask (type) {
      const campaign = this.campaigns.find((cmp) => cmp.name === this.tab)
      this.$store.dispatch('admin/createTask', {
        task: {
          type: type,
          arguments: {
            interviewDesign: {
              _id: this.interviewDesign._id
            },
            campaign: {
              _id: campaign._id
            }
          }
        }
      })
    }
  }
})
</script>
