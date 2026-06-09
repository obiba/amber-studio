<template>
  <div v-cloak>
    <q-btn
      v-if="!isReadOnly"
      color="primary"
      icon="add"
      size="sm"
      :label="t('interview.add_campaign_hint')"
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
              :title="t('chart.cumulated_interviews')"
              :aggregations="counts.interviews_agg"
              height="300px"/>
          </div>
          <div class="col-12 col-md-6">
            <pie-chart
              chartId="interviewsState"
              :title="t('chart.interview_states')"
              :frequencies="interviewStateFrequencies"
              height="250px"/>
          </div>
        </div>
      </div>

      <q-tab-panels v-model="tab">

        <q-tab-panel v-for="campaign in campaigns" :key="campaign._id" :name="campaign.name" class="q-pa-none">
          <div class="row q-my-md">
            <div class="text-h6">{{ campaign.name }}</div>
            <div v-if="!isReadOnly" class="on-right">
              <q-btn
                color="secondary"
                size="12px"
                flat
                dense
                round
                icon="edit"
                :title="t('interview.edit_campaign_hint')"
                @click='onEditCampaign(campaign)'>
              </q-btn>
              <q-btn
                size="12px"
                flat
                dense
                round
                color="negative"
                icon="delete_outline"
                :title="t('interview.delete_campaign_hint')"
                @click='onConfirmDeleteCampaign(campaign)'>
              </q-btn>
            </div>
          </div>
          <div class="q-mt-md">
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <div class="text-weight-bold q-mb-sm">{{ t('interview.definition') }}</div>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label>{{ t('name') }}</q-item-label>
                      <q-item-label caption>{{ campaign.name }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ t('description') }}</q-item-label>
                      <q-item-label caption>{{ campaign.description || '-' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="t('interview.campaign_investigators_hint')">
                      <q-item-label>{{ t('interview.campaign_investigators') }}</q-item-label>
                      <div>
                        <q-chip v-for="sub in investigatorSubjects" icon="person" size="sm" :label="sub.name" :key="sub._id"/>
                      </div>
                      <div v-if="!isReadOnly" class="q-mt-sm">
                        <q-btn-dropdown
                          color="primary"
                          split
                          icon="send"
                          :label="t('interview.campaign_notifications')"
                          size="sm">
                          <q-list>
                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-info-activate')">
                              <q-item-section>
                                <q-item-label>{{t('tasks.types.participants-info-activate')}}</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-activate')">
                              <q-item-section>
                                <q-item-label>{{t('tasks.types.participants-activate')}}</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-reminder')">
                              <q-item-section>
                                <q-item-label>{{t('tasks.types.participants-reminder')}}</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-info-expire')">
                              <q-item-section>
                                <q-item-label>{{t('tasks.types.participants-info-expire')}}</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-summary')">
                              <q-item-section>
                                <q-item-label>{{t('tasks.types.participants-summary')}}</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="onParticipantsTask('participants-deactivate')">
                              <q-item-section>
                                <q-item-label>{{t('tasks.types.participants-deactivate')}}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-btn-dropdown>
                      </div>
                    </q-item-section>
                    <q-item-section :title="t('interview.campaign_supporters_hint')">
                      <q-item-label>{{ t('interview.campaign_supporters') }}</q-item-label>
                      <div>
                        <q-chip v-for="sub in supporterSubjects" icon="person" size="sm" :label="sub.name" :key="sub._id"/>
                        <span v-if="supporterSubjects.length === 0">-</span>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="t('interview.campaign_notify_on_interview_completion_hint')">
                      <q-item-label>{{ t('interview.campaign_notify_on_interview_completion') }}</q-item-label>
                      <q-toggle v-model="campaign.notifyOnInterviewCompletion" disable />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="t('interview.campaign_visit_hint')">
                      <q-item-label>{{ t('interview.campaign_visit') }}</q-item-label>
                      <q-item-label caption>
                        <a v-if="campaign.visitUrl" :href="campaign.visitUrl" target="_blank">{{ campaign.visitUrl }}</a>
                        <span v-else>-</span>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section :title="t('interview.campaign_completion_hint')">
                      <q-item-label>{{ t('interview.campaign_completion') }}</q-item-label>
                      <q-item-label caption>
                        <a v-if="campaign.completionUrl" :href="campaign.completionUrl" target="_blank">{{ campaign.completionUrl }}</a>
                        <span v-else>-</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div class="text-weight-bold q-mt-md q-mb-sm">{{ t('interview.campaign_security') }}</div>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section :title="t('interview.campaign_with_password_hint')">
                      <q-item-label>{{ t('interview.campaign_with_password') }}</q-item-label>
                      <q-toggle v-model="campaign.withPassword" disable />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-weight-bold q-mb-sm">{{ t('interview.schedule') }}</div>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section :title="t('interview.campaign_valid_from_hint')">
                      <q-item-label>{{ t('interview.campaign_valid_from') }}</q-item-label>
                      <q-item-label caption>{{ campaign.validFrom ? date.formatDate(campaign.validFrom, 'YYYY-MM-DD') : '-' }}</q-item-label>
                    </q-item-section>
                    <q-item-section :title="t('interview.campaign_valid_until_hint')">
                      <q-item-label>{{ t('interview.campaign_valid_until') }}</q-item-label>
                      <q-item-label caption>{{ campaign.validUntil ? date.formatDate(campaign.validUntil, 'YYYY-MM-DD') : '-' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="t('interview.campaign_weeks_info_before_activate_hint')">
                      <q-item-label>{{ t('interview.campaign_weeks_info_before_activate') }}</q-item-label>
                      <q-item-label caption>{{ campaign.weeksInfoBeforeActivation }}</q-item-label>
                    </q-item-section>
                    <q-item-section :title="t('interview.campaign_weeks_reminder_hint')">
                      <q-item-label>{{ t('interview.campaign_weeks_reminder') }}</q-item-label>
                      <q-item-label caption>{{ campaign.weeksBetweenReminders }}</q-item-label>
                    </q-item-section>
                    <q-item-section :title="t('interview.campaign_reminders_count_hint')">
                      <q-item-label>{{ t('interview.campaign_reminders_count') }}</q-item-label>
                      <q-item-label caption>{{ campaign.numberOfReminders }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section :title="t('interview.campaign_weeks_info_before_expire_hint')">
                      <q-item-label>{{ t('interview.campaign_weeks_info_before_expire') }}</q-item-label>
                      <q-item-label caption>{{ campaign.weeksInfoBeforeDeactivation }}</q-item-label>
                    </q-item-section>
                    <q-item-section :title="t('interview.campaign_weeks_deactivate_hint')">
                      <q-item-label>{{ t('interview.campaign_weeks_deactivate') }}</q-item-label>
                      <q-item-label caption>{{ campaign.weeksToDeactivate }}</q-item-label>
                    </q-item-section>
                    <q-item-section />
                  </q-item>
                </q-list>
                <div class="text-weight-bold q-mt-md q-mb-sm">{{ t('interview.campaign_walkin_participants') }}</div>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section :title="t('interview.campaign_with_walkin_participants_hint')">
                      <q-item-label>{{ t('interview.campaign_with_walkin_participants') }}</q-item-label>
                      <q-toggle v-model="campaign.walkInEnabled" disable />
                    </q-item-section>
                  </q-item>
                  <q-item v-if="campaign.walkInEnabled && campaign.walkInData">
                    <q-item-section :title="t('interview.campaign_walkin_url_parameters_hint')">
                      <q-item-label>{{ t('interview.campaign_walkin_url_parameters') }}</q-item-label>
                      <q-item-label caption>{{ getWalkInParameters(campaign).join(', ') || '-' }}</q-item-label>
                    </q-item-section>
                    <q-item-section :title="t('interview.campaign_walkin_participant_attributes_hint')">
                      <q-item-label>{{ t('interview.campaign_walkin_participant_attributes') }}</q-item-label>
                      <q-item-label caption>{{ getWalkInAttributesArray(campaign).map((entry) => `${entry.key}=${entry.value}`).join('; ') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="campaign.walkInEnabled">
                    <q-item-section :title="t('interview.campaign_walkin_visit_hint')">
                      <q-item-label v-if="hasWalkInParameters(campaign)">{{ t('interview.campaign_external_visit') }}</q-item-label>
                      <q-item-label v-else>{{ t('interview.campaign_walkin_visit') }}</q-item-label>
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
            <div class="text-bold text-capitalize">{{ t('participants') }}</div>
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
            :label="t('name')"
            lazy-rules
            @blur="v$.campaignData.name.$touch"
            :error="v$.campaignData.name.$error"
            :hint="t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.campaignData.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='campaignData.description'
            :label="t('description')"
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
            :label="t('interview.campaign_investigators')"
            :hint="t('interview.campaign_investigators_hint')" />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="campaignData.supporters"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="t('interview.campaign_supporters')"
            :hint="t('interview.campaign_supporters_hint')" />
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md q-col-gutter-md">
            <div class="col-6">
              <q-input
                filled
                v-model="campaignData.validFrom"
                :label="t('interview.campaign_valid_from')"
                :hint="t('interview.campaign_valid_from_hint')">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="campaignData.validFrom" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="t('close')" color="primary" flat />
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
                :label="t('interview.campaign_valid_until')"
                :hint="t('interview.campaign_valid_until_hint')">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="campaignData.validUntil" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="t('close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='addCampaign'
            :disable="disableSaveCampaign"
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

    <q-dialog v-model='showEditCampaign' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'width: 1000px; max-width: 80vw'">
        <q-card-section>
          <q-input
            v-model='campaignData.name'
            :label="t('name')"
            lazy-rules
            @blur="v$.campaignData.name.$touch"
            :error="v$.campaignData.name.$error"
            :hint="t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.campaignData.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='campaignData.description'
            :label="t('description')"
            autogrow
            lazy-rules
          />
          <q-input
            v-model='campaignData.visitUrl'
            :label="t('interview.campaign_visit')"
            :hint="t('interview.campaign_visit_hint')"
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
            :label="t('interview.campaign_completion')"
            :hint="t('interview.campaign_completion_hint')"
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
                :label="t('interview.campaign_investigators')"
                :hint="t('interview.campaign_investigators_hint')" />
            </div>
            <div class="col-6">
              <q-select
                v-model="campaignData.supporters"
                :options="userSubjectOptions"
                emit-value
                map-options
                multiple
                use-chips
                :label="t('interview.campaign_supporters')"
                :hint="t('interview.campaign_supporters_hint')" />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-toggle
            v-model="campaignData.notifyOnInterviewCompletion"
            :label="t('interview.campaign_notify_on_interview_completion')" />
          <div class="text-caption text-grey-7">{{ t('interview.campaign_notify_on_interview_completion_hint') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input
                filled
                v-model="campaignData.validFrom"
                :label="t('interview.campaign_valid_from')"
                :hint="t('interview.campaign_valid_from_hint')">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="campaignData.validFrom" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="t('close')" color="primary" flat />
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
                :label="t('interview.campaign_valid_until')"
                :hint="t('interview.campaign_valid_until_hint')">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="campaignData.validUntil" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="t('close')" color="primary" flat />
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
                :label="t('interview.campaign_weeks_info_before_activate')"
                :hint="t('interview.campaign_weeks_info_before_activate_hint')"
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
                :label="t('interview.campaign_weeks_reminder')"
                :hint="t('interview.campaign_weeks_reminder_hint')"
                lazy-rules
              />
            </div>
            <div class="col-6">
              <q-input
                v-model.number="campaignData.numberOfReminders"
                type="number"
                :label="t('interview.campaign_reminders_count')"
                :hint="t('interview.campaign_reminders_count_hint')"
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
                :label="t('interview.campaign_weeks_info_before_expire')"
                :hint="t('interview.campaign_weeks_info_before_expire_hint')"
                lazy-rules
              />
            </div>
            <div class="col-6">
              <q-input
                v-model.number="campaignData.weeksToDeactivate"
                type="number"
                :label="t('interview.campaign_weeks_deactivate')"
                :hint="t('interview.campaign_weeks_deactivate_hint')"
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
                :label="t('interview.campaign_with_password')" />
              <div class="text-caption text-grey-7">{{ t('interview.campaign_with_password_hint') }}</div>
            </div>
            <div class="col-6">
              <q-toggle
                v-model="campaignData.walkInEnabled"
                :label="t('interview.campaign_with_walkin_participants')" />
              <div class="text-caption text-grey-7">{{ t('interview.campaign_with_walkin_participants_hint') }}</div>
              <div v-if="campaignData.walkInEnabled">
                <q-input
                  v-model="campaignData.walkinParamsStr"
                  :label="t('interview.campaign_walkin_url_parameters')"
                  :hint="t('interview.campaign_walkin_url_parameters_hint')"
                />
                <p class="q-mb-xs q-mt-md">{{ t('interview.campaign_walkin_participant_attributes') }}</p>
                <p class="text-secondary text-caption">{{ t('interview.campaign_walkin_participant_attributes_hint') }}</p>
                <div class="row q-col-gutter-md" v-for="(attribute, key) in campaignData.walkinAttributes" :key="campaignData.walkinAttributes.indexOf(attribute)">
                  <div class="col-4">
                    <q-input class="q-mb-md" v-model="attribute.key" :label="t('key')"/>
                  </div>
                  <div class="col-7">
                    <q-input class="q-mb-md" v-model="attribute.value" :label="t('value')"/>
                  </div>
                  <div class="col-1">
                    <q-btn
                      v-if="!isReadOnly"
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
                      :title="t('interview.add_participant_attribute_hint')"
                      @click="addWalkInAttribute()"
                      class="q-mr-sm"
                    />
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete_outline"
                      :title="t('interview.delete_participant_attributes_hint')"
                      @click="deleteWalkInAttributes()"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='editCampaign'
            :disable="disableSaveCampaign"
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

    <q-dialog v-model='showDeleteCampaign' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('interview.delete_campaign_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ campaignData.name }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='removeCampaign'
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { subjectsService, metricsService } from '../../services/utils'
import { date } from 'quasar'
import Participants from 'src/components/interviews/Participants.vue'
import RecordsChart from 'src/components/dashboard/RecordsChart.vue'
import PieChart from 'src/components/charts/PieChart.vue'
import { useInterviewStore } from 'src/stores/interview'
import { useStudyStore } from 'src/stores/study'
import { useAdminStore } from 'src/stores/admin'
import { useAuth } from 'src/composables/useAuth'

const { t } = useI18n()
const route = useRoute()
const interviewStore = useInterviewStore()
const studyStore = useStudyStore()
const adminStore = useAdminStore()
const { isReadOnly } = useAuth()

// Refs
const tab = ref('')
const selected = ref([])
const paginationOpts = ref({
  descending: true,
  page: 1,
  rowsPerPage: 100,
  sortBy: 'name'
})
const showAddCampaign = ref(false)
const showEditCampaign = ref(false)
const showDeleteCampaign = ref(false)
const campaignData = ref({})
const subjects = ref([])
const counts = ref({})

// Vuelidate
const rules = {
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
}

const v$ = useVuelidate(rules, { campaignData })

// Computed
const study = computed(() => studyStore.study)
const interviewDesign = computed(() => interviewStore.interviewDesign)
const campaigns = computed(() => interviewStore.campaigns)

const disableSaveCampaign = computed(() => v$.value.campaignData.$invalid || campaignData.value.investigators.length === 0)

const userSubjectOptions = computed(() => getSubjectOptions('user'))

const investigatorSubjects = computed(() => {
  if (tab.value !== '') {
    const rval = campaigns.value
      .find((cmp) => cmp.name === tab.value).investigators
      .map((id) => getSubject(id, 'user'))
      .filter((sub) => sub !== undefined)
    return rval
  }
  return []
})

const supporterSubjects = computed(() => {
  if (tab.value !== '') {
    const supporters = campaigns.value
      .find((cmp) => cmp.name === tab.value).supporters
    if (supporters) {
      const rval = supporters
        .map((id) => getSubject(id, 'user'))
        .filter((sub) => sub !== undefined)
      return rval
    }
  }
  return []
})

const interviewStateFrequencies = computed(() => {
  let itwFreqs = []
  if (counts.value.interviews_freq) {
    itwFreqs = counts.value.interviews_freq.map((f) => {
      return {
        name: t(`study.interview_state.${f._id}`),
        value: f.count
      }
    })
  }
  if (counts.value.participants_freq) {
    const totalItw = counts.value.interviews_freq
      ? counts.value.interviews_freq.map((f) => f.count).reduce((a, b) => a + b, 0)
      : 0
    const totalPart = counts.value.participants_freq.map((f) => f.count).reduce((a, b) => a + b, 0)
    itwFreqs.push({
      name: t('study.interview_state.not_started'),
      value: totalPart - totalItw
    })
  }
  return itwFreqs
})

// Methods
async function initCampaigns() {
  await interviewStore.getCampaigns(paginationOpts.value, interviewDesign.value._id)
  if (campaigns.value.length > 0) {
    tab.value = route.query.c
      ? (campaigns.value.find(c => c._id === route.query.c) || campaigns.value[0]).name
      : campaigns.value[0].name
    getCampaignMetrics()
  }
}

function getSubject(id, type) {
  if (subjects.value && subjects.value.length > 0) {
    return subjects.value.find(s => s.type === type && s.id === id)
  }
  return { id: id, type: type, name: '?' }
}

function getSubjectOptions(type) {
  return subjects.value.filter(s => s.type === type).map(s => {
    return {
      value: s.id,
      label: s.name
    }
  })
}

function getCampaignMetrics() {
  const name = tab.value
  const campaign = campaigns.value.find((cmp) => cmp.name === name)
  if (campaign) {
    metricsService.getMetrics({
      type: 'interview',
      query: {
        interview: {
          interviewDesign: interviewDesign.value._id,
          campaign: campaign._id
        },
        participant: {
          interviewDesign: interviewDesign.value._id,
          campaign: campaign._id
        }
      }
    }).then((result) => {
      counts.value = result.counts ? result.counts : {}
    })
  } else {
    counts.value = {}
  }
}

function onAddCampaign() {
  campaignData.value = {
    name: '',
    investigators: [],
    walkinParamsStr: '',
    walkinAttributes: [],
  }
  showAddCampaign.value = true
}

function onEditCampaign(campaign) {
  campaignData.value = { ...campaign, walkinParamsStr: '', walkinAttributes: {} }
  campaignData.value.validFrom = campaignData.value.validFrom ? date.formatDate(campaignData.value.validFrom, 'YYYY-MM-DD') : null
  campaignData.value.validUntil = campaignData.value.validUntil ? date.formatDate(campaignData.value.validUntil, 'YYYY-MM-DD') : null
  campaignData.value.walkinParamsStr = getWalkInParameters(campaign).join(', ')
  campaignData.value.walkinAttributes = getWalkInAttributesArray(campaign)
  campaignData.value.notifyOnInterviewCompletion = !!campaignData.value.notifyOnInterviewCompletion
  showEditCampaign.value = true
}

function deleteWalkInAttribute(idx) {
  campaignData.value.walkinAttributes.splice(idx, 1)
}

function addWalkInAttribute() {
  campaignData.value.walkinAttributes.push({
    key: '',
    value: ''
  })
}

function deleteWalkInAttributes() {
  campaignData.value.walkinAttributes = [
    {
      key: '',
      value: ''
    }
  ]
}

function onConfirmDeleteCampaign(campaign) {
  campaignData.value = { ...campaign }
  showDeleteCampaign.value = true
}

function addCampaign() {
  const toSave = { ...campaignData.value }
  toSave.interviewDesign = interviewDesign.value._id
  interviewStore.createCampaign(
    toSave,
    paginationOpts.value,
    interviewDesign.value._id
  ).then(() => {
    tab.value = campaignData.value.name
    getCampaignMetrics()
  })
}

function editCampaign() {
  const toSave = { ...campaignData.value }
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
  interviewStore.updateCampaign(
    toSave,
    undefined,
    paginationOpts.value,
    interviewDesign.value._id
  ).then(() => { tab.value = campaignData.value.name })
}

function removeCampaign() {
  const idx = campaigns.value.map(campaign => campaign.name).indexOf(campaignData.value.name)
  const nextidx = idx === campaigns.value.length - 1 ? idx - 1 : idx + 1
  const nexttab = nextidx < 0 ? undefined : campaigns.value[nextidx].name
  interviewStore.deleteCampaign(
    campaignData.value._id,
    paginationOpts.value,
    interviewDesign.value._id
  ).then(() => {
    tab.value = nexttab
    getCampaignMetrics()
  })
}

function makeWalkInUrl(campaign) {
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
}

function hasWalkInParameters(campaign) {
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
}

function getWalkInParameters(campaign) {
  if (!campaign || !campaign.walkInData) return []
  if (Object.keys(campaign.walkInData).length === 0) return []
  const params = []
  for (const key in campaign.walkInData) {
    if (campaign.walkInData[key] === null) {
      params.push(key)
    }
  }
  return params
}

function getWalkInAttributesArray(campaign) {
  if (!campaign || !campaign.walkInData) return []
  if (Object.keys(campaign.walkInData).length === 0) return []
  const attributes = []
  for (const key in campaign.walkInData) {
    if (campaign.walkInData[key] !== null) {
      attributes.push({ key: key, value: campaign.walkInData[key] })
    }
  }
  return attributes
}

function onParticipantsTask(type) {
  const campaign = campaigns.value.find((cmp) => cmp.name === tab.value)
  adminStore.createTask({
    type: type,
    arguments: {
      interviewDesign: {
        _id: interviewDesign.value._id
      },
      campaign: {
        _id: campaign._id
      }
    }
  })
}

// Watchers
watch(study, () => {
  initCampaigns()
})

// Lifecycle
onMounted(() => {
  subjectsService.getSubjects().then((result) => {
    subjects.value = result
  })
})
</script>
