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
          <q-btn-dropdown color="primary" icon="person" no-caps>
            <template v-slot:label>
              <div class="text-center q-pl-sm">
                {{userName}}
              </div>
            </template>
            <q-list>
              <q-item v-close-popup to="/account">
                <q-item-section>
                  <q-item-label>Profile</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="onLogout">
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
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
      
        <q-item v-if="isAdministrator || isManager" to="/datasets" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="storage"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Datasets</q-item-label>
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
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

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
    user() {
      return this.$store.state.auth.payload.user
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
        return this.user.permissions && this.user.permissions.includes("administrator");
      }
      return false;
    },
    isManager() {
      if (this.user) {
        return this.user.permissions && this.user.permissions.includes("manager");
      }
      return false;
    },
    isInterviewer() {
      if (this.user) {
        return this.user.permissions && this.user.permissions.includes("interviewer");
      }
      return false;
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch("auth/logout");
    }
  }
})
</script>
