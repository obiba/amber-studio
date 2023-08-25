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
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.dashboard')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label v-if="!isGuest" header class="text-weight-bolder text-white">{{$t('main.content')}}</q-item-label>

        <q-item v-if="!isGuest" to="/studies" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="inventory_2"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('studies.title')}}</q-item-label>
          </q-item-section>
        </q-item>

        <!--q-item v-if="isAdministrator || isManager" to="/datasets" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="storage"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('datasets.title')}}</q-item-label>
          </q-item-section>
        </q-item-->

        <q-item-label v-if="isAdministrator" header class="text-weight-bolder text-white">{{$t('main.administration')}}</q-item-label>

        <q-item v-if="isAdministrator" to="/users" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="person"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('users.title')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="isAdministrator" to="/groups" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="groups"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('groups.title')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="isAdministrator" to="/tasks" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="tasks" class="q-ml-sm"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('tasks.title')}}</q-item-label>
          </q-item-section>
        </q-item>

        <!--q-item v-if="isAdministrator" to="/settings" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="settings"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.settings')}}</q-item-label>
          </q-item-section>
        </q-item-->

        <q-item class="fixed-bottom text-caption">
          <div>
            {{$t('main.powered_by')}} <a class="text-weight-bold" href="https://www.obiba.org" target="_blank">OBiBa Amber</a>
          </div>
        </q-item>

      </q-list>

    </q-drawer>

    <q-page-container :class="settings.theme.page">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'
import { defineComponent, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import AuthMixin from '../mixins/AuthMixin'

export default defineComponent({
  name: 'MainLayout',
  mixins: [AuthMixin],
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
      settings
    }
  },
  computed: {
    localeOptions () {
      return locales.map(loc => {
        return {
          value: loc,
          label: this.$t('locales.' + loc)
        }
      })
    },
    hasLocales () {
      return locales.length > 1
    },
    userName () {
      return this.userEmail.split('@')[0]
    }
  },
  methods: {
    onLocaleSelection (opt) {
      this.locale = opt.value
    },
    onLogout () {
      this.$store.dispatch('auth/logout')
    }
  }
})
</script>
