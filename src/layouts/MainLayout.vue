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
        <q-btn flat to="/" no-caps size="lg">
          {{t('main.brand')}}
        </q-btn>
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
                  <q-item-label class="text-uppercase" :title="localeOpt.label">{{localeOpt.value}}</q-item-label>
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
      <div v-if="userName" class="q-mt-none q-mb-none q-pa-md">
        <span class="text-bold text-grey-6">{{ userName }}</span>
      </div>
      <q-list>
        <q-item to="/account" v-if="userName">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('main.profile') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="onLogout" v-if="userName">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('main.logout') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator v-if="userName" />
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('main.dashboard')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label v-if="!isGuest" header class="text-weight-bolder">{{t('main.content')}}</q-item-label>

        <q-item v-if="!isGuest" to="/studies">
          <q-item-section avatar>
            <q-icon name="inventory_2"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('studies.title')}}</q-item-label>
          </q-item-section>
        </q-item>

        <!--q-item v-if="isAdministrator || isManager" to="/datasets">
          <q-item-section avatar>
            <q-icon name="storage"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('datasets.title')}}</q-item-label>
          </q-item-section>
        </q-item-->

        <q-item-label v-if="isAdministrator" header class="text-weight-bolder">{{t('main.administration')}}</q-item-label>

        <q-item v-if="isAdministrator" to="/users">
          <q-item-section avatar>
            <q-icon name="person"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('users.title')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="isAdministrator" to="/groups">
          <q-item-section avatar>
            <q-icon name="groups"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('groups.title')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="isAdministrator" to="/tasks">
          <q-item-section avatar>
            <q-icon name="tasks" class="q-ml-sm"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('tasks.title')}}</q-item-label>
          </q-item-section>
        </q-item>

        <!--q-item v-if="isAdministrator" to="/settings">
          <q-item-section avatar>
            <q-icon name="settings"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{t('main.settings')}}</q-item-label>
          </q-item-section>
        </q-item-->

        <q-item class="fixed-bottom text-caption">
          <div>
            {{t('main.powered_by')}} <a class="text-weight-bold" href="https://www.obiba.org" target="_blank">OBiBa Amber</a>
          </div>
        </q-item>

      </q-list>

    </q-drawer>

    <q-page-container :class="settings.theme.page">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'
import { useAuth } from '../composables/useAuth'

// Import Quasar language files statically
import langEnUS from 'quasar/lang/en-US'
import langFr from 'quasar/lang/fr'

const $q = useQuasar()
const { locale, t } = useI18n({ useScope: 'global' })
const { userEmail, isGuest, isAdministrator, logout } = useAuth()

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

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Computed properties
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

// Methods
function onLocaleSelection (opt) {
  locale.value = opt.value
}

function onLogout () {
  logout()
}
</script>
