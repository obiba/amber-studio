<template>
  <q-page>
    <div class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="t('users.title')" />
      </q-breadcrumbs>
    </div>
    <q-separator/>

    <q-table
        class="q-ma-md"
        flat
        :rows='users'
        :columns='columns'
        :filter='filter'
        row-key='email'
        selection="multiple"
        v-model:selected="selected"
        v-model:pagination='paginationOpts'
        @request='getTableUsers'
      >
        <template v-slot:top>
        <q-btn
          color="primary"
          icon="add"
          :title="t('users.add_user_hint')"
          @click="createUser()"
          size="sm"
          class="q-mr-md" />
        <q-btn
          class="q-mr-md"
          flat
          round
          color="black"
          icon="groups"
          :disable="selected.length === 0"
          :title="t('users.group_users_hint')"
          size="sm"
          @click="confirmGroupUsers()" />
        <q-btn
          class="q-mr-md"
          flat
          round
          color="negative"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="t('users.delete_users_hint')"
          size="sm"
          @click="confirmDeleteUsers()" />
        <q-space />
        <q-select
          flat
          dense
          v-model="rolesFilter"
          multiple
          emit-value
          :options="rolesOptions"
          use-chips
          clearable
          :label="t('users.roles_filter')"
          style="min-width: 250px"
          class="q-mr-md"
          @change="getTableUsers"
        />
        <q-input
          dense
          debounce="300"
          v-model="filter"
          :placeholder="t('search')"
          :title="t('users.search_hint')">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-name='props'>
        <q-td :props='props'>
          {{ props.row.firstname }} {{ props.row.lastname }}
        </q-td>
      </template>
      <template v-slot:body-cell-email='props'>
        <q-td :props='props'>
          <router-link :to="'/user/' + props.row._id">{{ props.row.email }}</router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-role='props'>
        <q-td>
          {{ t('roles.' + props.row.role) }}
        </q-td>
      </template>
      <template v-slot:body-cell-action='props'>
        <q-td :props='props'>
          <q-btn
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('users.edit_user_hint')"
            icon='edit'
            :to="'/user/' + props.row._id">
          </q-btn>
          <q-btn
            v-if='!props.row.isVerified'
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('users.resend_email_hint')"
            icon='send'
            @click='resendEmailVerification(props.row.email)'>
          </q-btn>
          <q-btn
            v-if='props.row.isVerified'
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('users.reset_password_hint')"
            icon='replay'
            @click='resetPassword(props.row.email)'>
          </q-btn>
          <q-btn
            v-if='props.row.role === "inactive"'
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('users.activate_user_hint')"
            icon='play_arrow'
            @click='activeateUser(props.row)'>
          </q-btn>
          <q-btn
            v-if='!(props.row.role === "inactive")'
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('users.deactivate_user_hint')"
            icon='pause'
            @click='deactiveateUser(props.row)'>
          </q-btn>
          <q-btn
            color="secondary"
            size="12px"
            flat
            dense
            round
            :title="t('users.delete_user_hint')"
            icon='delete'
            @click='confirmDeleteUser(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model='showCreateUser' persistent>
      <q-card>
        <q-card-section class='row items-center'>

          <div class='col-12 col-md-6'>
            <q-input
              v-model='newProfileData.firstname'
              :label="t('firstname')"
              lazy-rules
              class='q-ma-sm'
              @blur="v$.firstname.$touch"
              :error="v$.firstname.$error"
              :hint="t('required')"
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-user' size='xs' />
              </template>
              <template v-slot:error>
                <div v-for="error in v$.firstname.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              v-model='newProfileData.lastname'
              :label="t('lastname')"
              lazy-rules
              class='q-ma-sm'
              @blur="v$.lastname.$touch"
              :error="v$.lastname.$error"
              :hint="t('required')"
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-user' size='xs' />
              </template>
              <template v-slot:error>
                <div v-for="error in v$.lastname.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              v-model='newProfileData.email'
              :label="t('email')"
              lazy-rules
              class='q-ma-sm'
              v-if='!selectedUser'
              @blur="v$.email.$touch"
              :error="v$.email.$error"
              :hint="t('email_hint')"
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-envelope' size='xs' />
              </template>
              <template v-slot:error>
                <div v-for="error in v$.email.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              v-model='newProfileData.password'
              :label="t('password')"
              lazy-rules
              class='q-ma-sm'
              type='password'
              v-if='!selectedUser'
              @blur="v$.password.$touch"
              :error="v$.password.$error"
              :hint="t('password_hint')"
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-lock' size='xs' />
              </template>
              <template v-slot:error>
                <div v-for="error in v$.password.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              v-model='newProfileData.institution'
              :label="t('institution')"
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-building' size='xs' />
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              v-model='newProfileData.city'
              :label="t('city')"
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-city' size='xs' />
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              v-model='newProfileData.title'
              :label="t('title')"
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-user-tie' size='xs' />
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              v-model='newProfileData.phone'
              :label="t('phone')"
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-phone' size='xs' />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
              <q-select
                class='q-ma-sm'
                v-show="hasLocales"
                v-model="newProfileData.language"
                :options="localeOptions"
                :label="t('preferred_language')"
                emit-value
                map-options
                options-dense
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-language" size="xs" />
                </template>
              </q-select>
          </div>
          <div class='col-12 col-md-6'>
            <q-select
              class='q-ma-sm'
              v-model='newProfileData.role'
              :options='rolesOptions'
              :label="t('role')"
              emit-value
              map-options
              options-dense
            >
            </q-select>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveUser'
            :disable='disableCreateProfile'
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

    <q-dialog v-model='showConfirmDeleteUser' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('users.delete_user_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedUser.email}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteUser'
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

    <q-dialog v-model='showConfirmGroupUsers' persistent>
      <q-card>
        <q-card-section>
          <div>
            <q-select
              class='q-ma-sm'
              v-model='selectedGroup'
              :options='groupsOptions'
              :label="t('group.title')"
              :hint="t('users.group_add_hint')"
              use-input
              map-options
              options-dense
              @filter="filterGroupsOptions"
              style="min-width: 350px"
            >
            </q-select>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='groupUsers'
            :label="t('apply')"
            :disable='disableGroupUsers'
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

    <q-dialog v-model='showConfirmDeleteUsers' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{t('users.delete_users_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(u => u.email).join(', ')}}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteUsers'
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

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, email } from '../boot/vuelidate'
import { date } from 'quasar'
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'
import { useAdminStore } from 'src/stores/admin'
import { useAccountStore } from 'src/stores/account'

const { t } = useI18n()
const adminStore = useAdminStore()
const accountStore = useAccountStore()

// Reactive state
const selected = ref([])
const filter = ref('')
const rolesFilter = ref([])
const selectedGroup = ref(null)
const roles = ['guest', 'interviewer', 'manager', 'administrator', 'inactive']
const allGroupsOptions = ref([])
const groupsOptions = ref([])
const selectedUser = ref({})
const showEditUser = ref(false)
const showCreateUser = ref(false)
const showConfirmDeleteUser = ref(false)
const showConfirmDeleteUsers = ref(false)
const showConfirmGroupUsers = ref(false)
const paginationOpts = ref({
  sortBy: 'lastSeen',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const newProfileData = ref({
  firstname: '',
  lastname: '',
  institution: '',
  city: '',
  title: '',
  phone: '',
  language: '',
  role: ''
})

// Columns definition
const columns = [
  {
    name: 'name',
    required: true,
    label: t('name'),
    align: 'left'
  },
  {
    name: 'email',
    align: 'left',
    label: t('email'),
    field: 'email',
    sortable: true
  },
  {
    name: 'institution',
    align: 'left',
    label: t('institution'),
    field: 'institution',
    sortable: true
  },
  {
    name: 'status',
    align: 'left',
    label: t('status'),
    field: 'isVerified',
    format: val => {
      if (val) {
        return t('confirmed')
      } else return t('pending')
    },
    sortable: false
  },
  {
    name: 'role',
    align: 'left',
    label: t('role'),
    field: 'role',
    sortable: false
  },
  {
    name: 'lastSeen',
    align: 'left',
    label: t('users.last_seen'),
    field: 'lastSeen',
    sortable: true,
    format: val =>
      `${val ? date.formatDate(val, 'YYYY-MM-DD HH:mm:ss') : t('unknown')}`
  },
  {
    name: 'action',
    align: 'left',
    label: t('action')
  }
]

// Validation rules
const rules = {
  firstname: {
    required,
    minLength: minLength(2),
    maxLength: maxLength(30)
  },
  lastname: {
    required,
    minLength: minLength(2),
    maxLength: maxLength(30)
  },
  email: {
    email,
    required
  },
  password: {
    required,
    minLength: minLength(8)
  },
  institution: {
    minLength: minLength(2),
    maxLength: maxLength(30)
  },
  city: {
    minLength: minLength(2),
    maxLength: maxLength(30)
  },
  language: {
    required
  },
  role: {
    required
  }
}

const v$ = useVuelidate(rules, newProfileData)

// Watch rolesFilter
import { watch } from 'vue'
watch(rolesFilter, () => {
  getTableUsers()
})

// Computed
const users = computed(() => adminStore.users)
const groups = computed(() => adminStore.groups)
const disableCreateProfile = computed(() => v$.value.$invalid)
const disableGroupUsers = computed(() => selectedGroup.value === null)
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
const rolesOptions = computed(() => {
  return roles.map(rl => {
    return {
      value: rl,
      label: t('roles.' + rl)
    }
  })
})

// Methods
async function initGroups() {
  await adminStore.getGroups({
    rowsPerPage: 0,
    page: 1,
    sortBy: 'name',
    descending: -1
  })
  allGroupsOptions.value = groups.value ? groups.value.map(g => {
    return {
      value: g._id,
      label: g.name,
      object: g
    }
  }) : []
  groupsOptions.value = allGroupsOptions.value
}

function setPagination() {
  paginationOpts.value = adminStore.userPaginationOpts
}

async function getTableUsers(requestProp) {
  if (requestProp) {
    paginationOpts.value = requestProp.pagination
    adminStore.setUserPagination(requestProp.pagination)
    await adminStore.getUsers(requestProp.pagination, requestProp.filter, rolesFilter.value)
  } else {
    await adminStore.getUsers(paginationOpts.value, filter.value, rolesFilter.value)
  }
  paginationOpts.value.rowsNumber = adminStore.userPaginationOpts.rowsNumber
}

function createUser() {
  newProfileData.value = {
    language: locales[0],
    role: 'guest'
  }
  showCreateUser.value = true
  selectedUser.value = undefined
}

function confirmDeleteUser(user) {
  showConfirmDeleteUser.value = true
  selectedUser.value = user
}

function confirmDeleteUsers() {
  if (selected.value.length > 0) {
    showConfirmDeleteUsers.value = true
  }
}

function confirmGroupUsers() {
  selectedGroup.value = null
  if (selected.value.length > 0) {
    showConfirmGroupUsers.value = true
  }
}

function resendEmailVerification(emailAddr) {
  accountStore.resendVerification(emailAddr)
}

async function saveUser() {
  v$.value.$reset()
  // create
  const userData = { ...newProfileData.value }
  await adminStore.createUser(userData, paginationOpts.value)
}

function resetPassword(emailAddr) {
  accountStore.forgotPassword(emailAddr)
}

function deleteUser() {
  adminStore.deleteUser(selectedUser.value._id, paginationOpts.value)
}

function deleteUsers() {
  const ids = selected.value.map(u => u._id)
  adminStore.deleteUsers(ids, paginationOpts.value)
  selected.value = []
}

function groupUsers() {
  const toSave = { ...selectedGroup.value.object }
  toSave.users = [...selectedGroup.value.object.users]
  if (!toSave.users || toSave.users.length === 0) {
    toSave.users = selected.value.map(u => u._id)
  } else {
    selected.value.filter(u => !toSave.users.includes(u._id)).forEach(u => toSave.users.push(u._id))
  }
  adminStore.updateGroup(toSave)
}

function copyUserProfile(user) {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
    city: user.city,
    institution: user.institution,
    title: user.title,
    phone: user.phone,
    language: user.language,
    role: user.role
  }
}

async function activeateUser(user) {
  const profileData = copyUserProfile(user)
  profileData.role = 'guest'
  await adminStore.updateUser(profileData, user._id, paginationOpts.value)
}

async function deactiveateUser(user) {
  const profileData = copyUserProfile(user)
  profileData.role = 'inactive'
  await adminStore.updateUser(profileData, user._id, paginationOpts.value)
}

function filterGroupsOptions(val, update) {
  update(() => {
    if (val === '') {
      groupsOptions.value = allGroupsOptions.value
    } else {
      const needle = val.toLowerCase()
      groupsOptions.value = allGroupsOptions.value.filter(
        g => g.label.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

// Lifecycle
onMounted(() => {
  getTableUsers()
  setPagination()
  initGroups()
})
</script>

<style scoped>

</style>
