<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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
          Amber Studio
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()"
                 v-if="$q.screen.gt.sm">
          </q-btn>
          <q-btn round dense flat color="white" icon="fab fa-github" type="a" href="https://github.com/obiba/amber-studio" target="_blank">
          </q-btn>
          <q-btn
            v-if="!$store.state.auth.user"
            flat
            to="/register"
            stretch
            class="text-bold">
            <q-icon
              name="fas fa-user-plus"
              class="q-mr-sm text-white"
              size="xs"></q-icon>
              Register
          </q-btn>
          <q-btn
            v-if="!$store.state.auth.user"
            to="/login"
            flat
            stretch
            class="text-bold">
            <q-icon
              name="fas fa-sign-in-alt"
              class="q-mr-sm text-white"
              size="xs"></q-icon>
            Login
          </q-btn>
          <q-btn
            v-if="$store.state.auth.user"
            @click="logout"
            flat
            stretch
            class="text-bold">
            <q-icon
              name="fas fa-sign-out-alt"
              class="q-mr-sm text-white"
              size="xs"></q-icon>
              Logout
          </q-btn>
          <q-btn round flat to="/account">
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary text-white"
    >
      <q-list>
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
  
        <q-item-label header class="text-weight-bolder text-white">Content</q-item-label>

        <q-item to="/studies" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="inventory_2"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Studies</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item to="/forms" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dynamic_form"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Forms</q-item-label>
          </q-item-section>
        </q-item>
      
        <q-item v-if="isAdministrator || isManager" to="/datasets" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="storage"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Datasets</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="isAdministrator || isManager" to="/metrics" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="query_stats"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Metrics</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label v-if="isAdministrator" header class="text-weight-bolder text-white">Administration</q-item-label>

        <q-item v-if="isAdministrator" to="/users" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="person"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Users</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="isAdministrator" to="/groups" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="group"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Groups</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="isAdministrator" to="/maintenance" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="settings"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import Messages from "./Messages";

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  computed: {
    isAdministrator() {
      let user = this.$store.state.auth.user;
      if (user && user.permissions) {
        return user.permissions.includes("administrator");
      }
      return false;
    },
    isManager() {
      let user = this.$store.state.auth.user;
      if (user && user.permissions) {
        return user.permissions.includes("manager");
      }
      return false;
    },
    isInterviewer() {
      let user = this.$store.state.auth.user;
      if (user && user.permissions) {
        return user.permissions.includes("interviewer");
      }
      return false;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
    }
  }
})
</script>
