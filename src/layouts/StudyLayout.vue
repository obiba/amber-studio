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
            {{$t('main.brand')}}
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
                  <q-item-label>{{$t('main.profile')}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="onLogout">
                <q-item-section>
                  <q-item-label>{{$t('main.logout')}}</q-item-label>
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
            <q-item-label>{{$t('studies.title')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label v-if="!isGuest" header class="text-weight-bolder text-white">{{$t('study.design')}}</q-item-label>

        <q-item v-if="!isGuest" :to="'/study/' + studyId + '/forms'" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="file_copy"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('study.forms')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label v-if="!isGuest" header class="text-weight-bolder text-white">{{$t('study.data_collection')}}</q-item-label>

        <q-expansion-item
          v-if="!isGuest"
          icon="help_center"
          :label="$t('study.case_reports')"
          :content-inset-level="1"
        >

          <q-item :to="'/study/' + studyId + '/case-report-forms'" active-class="q-item-no-link-highlighting">
            <q-item-section>
              <q-item-label>{{$t('study.forms')}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item :to="'/study/' + studyId + '/case-reports'" active-class="q-item-no-link-highlighting">
            <q-item-section>
              <q-item-label>{{$t('study.records')}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item
          v-if="!isGuest"
          icon="contact_support"
          :label="$t('study.interviews')"
          :content-inset-level="1"
        >

          <q-item :to="'/study/' + studyId + '/interview-designs'" active-class="q-item-no-link-highlighting">
            <q-item-section>
              <q-item-label>{{$t('study.designs')}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item :to="'/study/' + studyId + '/interviews'" active-class="q-item-no-link-highlighting">
            <q-item-section>
              <q-item-label>{{$t('study.records')}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item class="fixed-bottom text-caption">
          <div>
            {{$t('main.powered_by')}} <a class="text-weight-bold" href="https://www.obiba.org" target="_blank">OBiBa Amber</a>
          </div>
        </q-item>

      </q-list>

    </q-drawer>

    <q-page-container :class="settings.theme.page">
      <div class="q-pa-md" :class="settings.theme.header2">
        <q-breadcrumbs class="float-left q-mt-sm q-mr-md">
          <q-breadcrumbs-el icon="inventory_2" :title="$t('studies.title')" to="/studies"/>
          <q-breadcrumbs-el :label="study.name" />
        </q-breadcrumbs>
        <q-btn
          @click='onEdit'
          :title="$t('edit_settings')"
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
              :label="$t('name')"
              lazy-rules
              class='q-mb-sm'
              @blur="v$.studyData.name.$touch"
                  :error="v$.studyData.name.$error"
                  :hint="$t('required')"
                >
              <template v-slot:error>
                <div v-for="error in v$.studyData.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
            <q-input
              v-model='studyData.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              class='q-mb-sm'
            />
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='save'
            :disable='disableSave'
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

  </q-layout>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'
import { defineComponent, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import AuthMixin from '../mixins/AuthMixin'
import { mapState, mapActions } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'

export default defineComponent({
  name: 'MainLayout',
  mixins: [AuthMixin],
  mounted: function () {
    this.initStudyData()
  },
  setup () {
    const $q = useQuasar()
    const { locale } = useI18n({ useScope: 'global' })

    watch(locale, val => {
      // dynamic import, so loading on demand only
      const langIso = val === 'en' ? 'en-US' : val
      import('quasar/lang/' + langIso)
        .then(lang => {
          $q.lang.set(lang.default)
        })
    })

    const leftDrawerOpen = ref(false)

    return {
      locale,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      v$: useVuelidate(),
      settings
    }
  },
  data () {
    return {
      showEditDefinition: false,
      studyData: {
        name: '',
        description: ''
      },
      selectedUserOptions: '',
      userOptionsLoading: false
    }
  },
  validations: {
    studyData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    }
  },
  computed: {
    ...mapState({
      study: state => state.study.study
    }),
    localeOptions () {
      return locales.map(loc => {
        return {
          value: loc,
          label: this.$t('locales.' + loc)
        }
      })
        .sort((loc1, loc2) => {
          if (loc1.label > loc2.label) return 1
          if (loc1.label < loc2.label) return -1
          return 0
        })
    },
    hasLocales () {
      return locales.length > 1
    },
    userName () {
      return this.userEmail.split('@')[0]
    },
    studyId () {
      return this.$route.params.id
    },
    currentStudy () {
      return this.$store.state.study.study
    },
    disableSave () {
      return this.v$.studyData.$invalid
    }
  },
  methods: {
    ...mapActions({
      getStudy: 'study/getStudy',
      updateStudy: 'study/updateStudy'
    }),
    async initStudyData () {
      await this.getStudy({ id: this.$route.params.id })
      this.studyData = { ...JSON.parse(JSON.stringify(this.study)) }
    },
    onEdit () {
      this.showEditDefinition = true
    },
    async save () {
      this.v$.$reset()
      const toSave = { ...this.studyData }
      this.updateStudy({
        study: toSave
      })
    },
    onLocaleSelection (opt) {
      this.locale = opt.value
    },
    onLogout () {
      this.$store.dispatch('auth/logout')
    }
  }
})
</script>
