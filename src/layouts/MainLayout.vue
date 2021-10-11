<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white text-grey-8">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title>
          {{$t('main.brand')}}
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()"
                 v-if="$q.screen.gt.sm">
          </q-btn>
          <q-btn round dense flat icon="fab fa-github" type="a" href="https://github.com/obiba/amber-studio" target="_blank">
          </q-btn>
          <q-btn-dropdown
            v-show="hasLocales" 
            flat
            :label="locale">
            <q-list>
              <q-item clickable v-close-popup @click="onLocaleSelection(localeOpt)" v-for="localeOpt in localeOptions">
                <q-item-section>
                  <q-item-label class="text-uppercase">{{localeOpt.value}}</q-item-label>
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
      class="bg-grey-9 text-grey-4"
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
  
        <q-item-label header class="text-weight-bolder text-white">Content</q-item-label>

        <q-item to="/studies" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="inventory_2"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('studies.title')}}</q-item-label>
          </q-item-section>
        </q-item>
      
        <q-item v-if="isAdministrator || isManager" to="/datasets" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="storage"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('datasets.title')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label v-if="isAdministrator" header class="text-weight-bolder text-white">Administration</q-item-label>

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

        <q-item v-if="isAdministrator" to="/settings" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="settings"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.settings')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="fixed-bottom text-caption">
          <div>
            {{$t('main.powered_by')}} <a class="text-weight-bold" href="https://www.obiba.org">OBiBa Amber</a>
          </div>
        </q-item>

      </q-list>


    </q-drawer>

    <q-page-container class="bg-white">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { defineComponent, ref } from 'vue';
import { locales } from '../boot/i18n'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const { locale } = useI18n({ useScope: 'global' })
    const leftDrawerOpen = ref(false)

    return {
      locale,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  computed: {
    localeOptions() {
      return locales.map(loc => {
        return {
          value: loc,
          label: this.$t('locales.' + loc)
        }
      });
    },
    hasLocales() {
      return locales.length>1;
    },
    user() {
      return this.$store.state.auth.payload ? this.$store.state.auth.payload.user : undefined;
    },
    userName() {
      return this.userEmail.split('@')[0]
    },
    userEmail() {
      if (this.user) {
        return this.user.email;
      }
      return '?';
    },
    isAdministrator() {
      if (this.user) {
        return this.user.role === "administrator";
      }
      return false;
    },
    isManager() {
      if (this.user) {
        return this.user.role === "manager";
      }
      return false;
    },
    isInterviewer() {
      if (this.user) {
        return this.user.role === "interviewer";
      }
      return false;
    }
  },
  methods: {
    onLocaleSelection(opt) {
      this.locale = opt.value;
    },
    onLogout() {
      this.$store.dispatch("auth/logout");
    }
  }
})
</script>
