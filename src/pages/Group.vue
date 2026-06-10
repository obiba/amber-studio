<template>
  <q-page>
    <div class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="t('groups.title')" to="/groups"/>
        <q-breadcrumbs-el :label="group.name" />
      </q-breadcrumbs>
    </div>
    <q-separator/>

    <div class="q-ma-md">
      <div class="row">
        <div class="col-12 col-md-6 q-pa-sm">
          <div class="row">
            <div class='col-12'>
              <q-input
                v-model='groupData.name'
                :label="t('name')"
                lazy-rules
                class='q-mb-sm'
                @blur="v$.name.$touch"
                    :error="v$.name.$error"
                    :hint="t('required')"
                  >
                <template v-slot:error>
                  <div v-for="error in v$.name.$errors">
                    {{error.$message}}
                  </div>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class='col-12'>
              <q-input
                v-model='groupData.description'
                :label="t('description')"
                autogrow
                lazy-rules
                class='q-mb-sm'
              />
            </div>
          </div>  
        </div>

        <div class="col-12 col-md-6 q-pa-sm">
          <div>
            {{ t('members')}}
          </div>
          <q-select
            :label="t('group.search_users')"
            :hint="t('group.search_users_hint')"
            :options="userOptions"
            :loading="userOptionsLoading"
            v-model="selectedUserOptions"
            @filter="filterUserOptions"
            @update:model-value="addUserOption"
            fill-input
            hide-selected
            use-input
            class="q-mb-sm"
          >
          </q-select>
          <q-list v-if="groupData.users && groupData.users.length>0" bordered separator class="q-mb-sm q-mt-md">
            <q-item clickable v-ripple :key="user.email" v-for="user in groupData.users">
              <q-item-section>
                <q-item-label>{{user.email}}</q-item-label>
                <q-item-label caption>{{user.firstname}} {{user.lastname}}</q-item-label>
              </q-item-section>
              <q-item-section side >
                <q-btn
                  color="secondary"
                  size="12px"
                  flat
                  dense
                  round
                  icon='delete'
                  @click="removeUser(user)">
            </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

      </div>

      <q-btn
        @click='saveGroup'
        :disable='disableSaveGroup'
        :label="t('save')"
        type='submit'
        color='primary'
        class="q-ml-sm q-mt-md"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'
import { settings } from '../boot/settings'
import { useAdminStore } from 'src/stores/admin'

const { t } = useI18n()

const route = useRoute()
const adminStore = useAdminStore()

// Reactive state
const userOptions = ref([])
const groupData = ref({
  name: '',
  description: '',
  users: []
})
const selectedUserOptions = ref('')
const userOptionsLoading = ref(false)

// Validation rules
const rules = {
  name: {
    required,
    minLength: minLength(2),
    maxLength: maxLength(30)
  }
}

const v$ = useVuelidate(rules, groupData)

// Computed
const filteredUsers = computed(() => adminStore.users)
const group = computed(() => adminStore.group)
const groupUsers = computed(() => adminStore.groupUsers)
const currentGroup = computed(() => adminStore.group)
const disableSaveGroup = computed(() => v$.value.$invalid)

// Methods
async function initData() {
  await adminStore.getGroup(route.params.id)
  groupData.value = { ...group.value }
  await adminStore.getGroupUsers(group.value)
  groupData.value.users = [...groupUsers.value]
}

async function saveGroup() {
  v$.value.$reset()
  const toSave = { ...groupData.value }
  toSave.users = groupData.value.users.map(u => u._id)
  await adminStore.updateGroup(toSave)
}

function filterUserOptions(val, update, abort) {
  const filter = val.trim()
  if (filter.length < 2) {
    // not enough type ahead
    update(() => {
      userOptions.value = []
    })
    return
  }
  userOptionsLoading.value = true
  adminStore.getUsers({
    sortBy: 'email',
    rowsPerPage: 5,
    page: 1,
    descending: -1
  }, filter).then(() => {
    update(() => {
      userOptions.value = filteredUsers.value.map(u => {
        return {
          label: u.email,
          value: u._id,
          object: u
        }
      })
      userOptionsLoading.value = false
    })
  })
}

function addUserOption(value) {
  // add value if not present
  if (groupData.value.users.filter(u => u.email === value.object.email).length === 0) {
    groupData.value.users.push(value.object)
  }
  // FIXME: does not clear the select
  selectedUserOptions.value = ''
}

function removeUser(user) {
  groupData.value.users = groupData.value.users.filter(u => u.email !== user.email)
}

// Lifecycle
onMounted(() => {
  initData()
})
</script>
