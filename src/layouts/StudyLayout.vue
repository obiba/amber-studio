<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="settings.theme.header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title>
          <q-btn flat to="/" no-caps size="lg">
            {{t('main.brand')}}
          </q-btn>
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()"
                 v-if="$q.screen.gt.sm">
          </q-btn>
          <q-btn round dense flat icon="help" type="a" href="https://amberdoc.obiba.org/en/latest/studio-user-guide/" target="_blank">
          </q-btn>
          <q-btn-dropdown
            v-show="hasLocales"
            flat
            :label="locale">
            <q-list>
              <q-item clickable v-close-popup @click="onLocaleSelection(localeOpt)" v-for="localeOpt in localeOptions" :key="localeOpt.value">
                <q-item-section>
                  <q-item-label class="text-uppercase">{{localeOpt.value}}</q-item-label>
                  <q-item-label caption>{{localeOpt.label}}</q-item-label>
                </q-item-section>
                <q-item-section avatar v-if="locale === localeOpt.value">
                  <q-icon color="primary" name="check" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown flat icon="person" no-caps>
            <template v-slot:label>
              <div class="text-center q-pl-sm">
                {{userName}}
              </div>
            </template>
            <q-list>
              <q-item v-close-popup to="/account">
                <q-item-section>
                  <q-item-label>{{t('main.profile')}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="onLogout">
                <q-item-section>
                  <q-item-label>{{t('main.logout')}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :class="settings.theme.drawer"
    >
      <q-list>
        <q-item to="/studies" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="arrow_back"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('studies.title')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item :to="'/study/' + studyId" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('main.dashboard')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label v-if="!isGuest" header class="text-weight-bolder text-white">{{t('study.design')}}</q-item-label>

        <q-item v-if="!isGuest" :to="'/study/' + studyId + '/forms'" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="list_alt"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('study.forms')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="!isGuest && hasCaseReportService" :to="'/study/' + studyId + '/case-report-forms'" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="insert_drive_file" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('study.case_report_forms')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="!isGuest && hasInterviewService"
          :to="'/study/' + studyId + '/interview-designs'" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="file_copy" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('study.interview_designs')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label v-if="!isGuest" header class="text-weight-bolder text-white">{{t('study.data_collection')}}</q-item-label>

        <q-item
          v-if="!isGuest && hasCaseReportService"
          :to="'/study/' + studyId + '/case-reports'" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="help_center" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('study.case_reports')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="!isGuest && hasInterviewService"
          :to="'/study/' + studyId + '/interviews'" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="quiz" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('study.interviews')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="fixed-bottom text-caption">
          <div>
            {{t('main.powered_by')}} <a class="text-weight-bold" href="https://www.obiba.org" target="_blank">OBiBa Amber</a>
          </div>
        </q-item>

      </q-list>

    </q-drawer>

    <q-page-container :class="settings.theme.page">
      <div class="q-pa-md" :class="settings.theme.header2">
        <q-breadcrumbs class="float-left q-mt-sm q-mr-md">
          <q-breadcrumbs-el icon="inventory_2" :title="t('studies.title')" to="/studies"/>
          <q-breadcrumbs-el :label="study.name" />
        </q-breadcrumbs>
        <q-btn
          @click='onEdit'
          :title="t('edit_settings')"
          icon="settings"
          class="text-grey-7"
          flat
          dense
          round>
        </q-btn>
        <div class="text-caption text-secondary">
          {{ study.description }}
        </div>
      </div>
      <q-separator/>

      <router-view />

    </q-page-container>

    <q-dialog v-model='showEditDefinition' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section class="row items-center">
           <div class="col-12">
            <q-input
              v-model='studyData.name'
              :label="t('name')"
              lazy-rules
              class='q-mb-sm'
              @blur="v$.studyData.name.$touch"
                  :error="v$.studyData.name.$error"
                  :hint="t('required')"
                >
              <template v-slot:error>
                <div v-for="error in v$.studyData.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
            <q-input
              v-model='studyData.description'
              :label="t('description')"
              autogrow
              lazy-rules
              class='q-mb-sm'
            />
            <q-select
              v-model="studyData.services"
              :label="t('study.services')"
              :hint="t('study.services_hint')"
              :options="servicesOptions"
              multiple
              emit-value
              map-options
              clearable
            />
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='save'
            :disable='disableSave'
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

  </q-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'
import { useStudyStore } from 'src/stores/study'
import { useAuth } from 'src/composables/useAuth'
import { required, minLength, maxLength } from '../boot/vuelidate'

// Import Quasar language files statically
import langEnUS from 'quasar/lang/en-US'
import langFr from 'quasar/lang/fr'

const route = useRoute()
const $q = useQuasar()
const { locale, t } = useI18n({ useScope: 'global' })
const studyStore = useStudyStore()
const { userEmail, isGuest, logout } = useAuth()

// Map locale codes to Quasar language objects
const quasarLangMap = {
  en: langEnUS,
  fr: langFr
}

// Watch locale changes
watch(locale, val => {
  // Set Quasar language based on locale
  const lang = quasarLangMap[val] || quasarLangMap.en
  $q.lang.set(lang)
})

// Drawer state
const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Data (formerly from data())
const showEditDefinition = ref(false)
const studyData = ref({
  name: '',
  description: '',
  services: []
})
const selectedUserOptions = ref('')
const userOptionsLoading = ref(false)

// Validation rules
const rules = {
  studyData: {
    name: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    }
  }
}

const v$ = useVuelidate(rules, { studyData })

// Computed properties
const study = computed(() => studyStore.study)

const localeOptions = computed(() => {
  return locales.map(loc => {
    return {
      value: loc,
      label: t('locales.' + loc)
    }
  })
    .sort((loc1, loc2) => {
      if (loc1.label > loc2.label) return 1
      if (loc1.label < loc2.label) return -1
      return 0
    })
})

const hasLocales = computed(() => locales.length > 1)

const userName = computed(() => userEmail.value.split('@')[0])

const studyId = computed(() => route.params.id)

const currentStudy = computed(() => studyStore.study)

const disableSave = computed(() => v$.value.studyData.$invalid)

const servicesOptions = computed(() => [
  { label: t('study.case_reports'), value: 'case-reports' },
  { label: t('study.interviews'), value: 'interviews' }
])

const hasCaseReportService = computed(() => 
  !study.value.services || study.value.services.length === 0 || study.value.services?.includes('case-reports')
)

const hasInterviewService = computed(() => 
  !study.value.services || study.value.services.length === 0 || study.value.services?.includes('interviews')
)

// Methods
async function initStudyData() {
  await studyStore.getStudy(route.params.id)
  studyData.value = JSON.parse(JSON.stringify(study.value))
}

function onEdit() {
  showEditDefinition.value = true
}

async function save() {
  v$.value.$reset()
  const toSave = { ...studyData.value }
  studyStore.updateStudy(toSave)
}

function onLocaleSelection(opt) {
  locale.value = opt.value
}

function onLogout() {
  logout()
}

// Lifecycle
onMounted(() => {
  initStudyData()
})
</script>
