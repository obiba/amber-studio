<template>
  <q-page>
    <div class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="t('users.title')" to="/users"/>
        <q-breadcrumbs-el :label="user.email" />
      </q-breadcrumbs>
    </div>
    <q-separator/>
    <div class="text-h5 q-ma-md">{{ user.email}}</div>
    <div class="q-ma-md">
      <div class="row">
        <div class='col-12 col-md-6'>
          <q-input
            v-model='profileData.firstname'
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
            v-model='profileData.lastname'
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
            v-model='profileData.institution'
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
            v-model='profileData.city'
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
            v-model='profileData.title'
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
            v-model='profileData.phone'
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
            v-model="profileData.language"
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
            class='q-ma-sm text-capitalize'
            v-model='profileData.role'
            :options='rolesOptions'
            :label="t('role')"
            emit-value
            map-options
            options-dense
          >
          </q-select>
        </div>
        <div class='col-12 col-md-12'>
          <q-toggle
            v-model="profileData.with2fa"
            :label="t('users.with_2fa')"
          />
        </div>
        <div v-if="profileData.with2fa" class='col-12 col-md-12'>
          <q-toggle
            v-model="profileData.totp2faRequired"
            :label="t('users.required_2fa')"
          />
        </div>
      </div>

      <q-btn
        @click='saveUser'
        :disable='disableSaveUser'
        :label="t('save')"
        type='submit'
        color='primary'
        class="q-ml-sm q-mt-md"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>

      <q-btn
        v-show="profileData.with2fa && currentUser.totp2faRequired"
        @click='resetTotp2FA'
        :disable='disableTotp2FA'
        :label="t('users.reset_2fa')"
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
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'
import { useAdminStore } from 'src/stores/admin'

const route = useRoute()
const { t } = useI18n()
const adminStore = useAdminStore()

// Reactive state
const roles = ['guest', 'interviewer', 'manager', 'administrator', 'inactive']
const profileData = ref({
  firstname: '',
  lastname: '',
  institution: '',
  city: '',
  title: '',
  phone: '',
  language: '',
  role: ''
})

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

const v$ = useVuelidate(rules, profileData)

// Computed
const user = computed(() => adminStore.user)
const currentUser = computed(() => adminStore.user)
const disableSaveUser = computed(() => v$.value.$invalid)
const disableTotp2FA = computed(() => currentUser.value.totp2faEnabled === false)
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
function copyUserProfile(user) {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
    city: user.city,
    institution: user.institution,
    title: user.title,
    phone: user.phone,
    language: user.language,
    role: user.role,
    totp2faRequired: user.totp2faRequired,
    with2fa: user.with2fa !== false, // default to true if not set
  }
}

async function initData() {
  await adminStore.getUser(route.params.id)
  profileData.value = copyUserProfile(user.value)
}

async function saveUser() {
  v$.value.$reset()
  const toSave = { ...profileData.value }
  await adminStore.updateUser(toSave, user.value._id)
}

async function resetTotp2FA() {
  profileData.value.totp2faEnabled = false
  saveUser()
}

// Lifecycle
onMounted(() => {
  initData()
})
</script>
