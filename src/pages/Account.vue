<template>
  <q-page>
    <div class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el icon="person" :label="t('account.title') + ' [' + t('roles.' + user.role) + ']'" />
      </q-breadcrumbs>
    </div>
    <q-separator/>

    <div class="q-ma-sm">
      <div class="row">
        <div class='col-12 col-md-6'>
          <q-input
            v-model='profileData.firstname'
            :label="t('firstname')"
            lazy-rules
            class='q-ma-sm'
            @blur="v$.profileData.firstname.$touch"
            :error="v$.profileData.firstname.$error"
            :hint="t('required')"
          >
            <template v-slot:prepend>
              <q-icon name='fas fa-user' size='xs' />
            </template>
            <template v-slot:error>
              <div v-for="error in v$.profileData.firstname.$errors">
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
            @blur="v$.profileData.lastname.$touch"
            :error="v$.profileData.lastname.$error"
            :hint="t('required')"
          >
            <template v-slot:prepend>
              <q-icon name='fas fa-user' size='xs' />
            </template>
            <template v-slot:error>
              <div v-for="error in v$.profileData.lastname.$errors">
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
      </div>

      <q-btn
        @click='saveUser'
        :disable='disableSaveUser'
        :label="t('save')"
        type='submit'
        color='primary'
        class="q-mt-md"
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
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'
import { useAuthStore } from 'src/stores/auth'
import { useAccountStore } from 'src/stores/account'
import { useAdminStore } from 'src/stores/admin'

const { t } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()
const accountStore = useAccountStore()
const adminStore = useAdminStore()

// data
const profileData = ref({
  firstname: '',
  lastname: '',
  institution: '',
  city: '',
  title: '',
  phone: '',
  language: ''
})

// validations
const rules = {
  profileData: {
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
      maxLength: maxLength(100)
    },
    city: {
      minLength: minLength(2),
      maxLength: maxLength(30)
    },
    language: {
      required
    }
  }
}
const v$ = useVuelidate(rules, { profileData })

// computed
const currentUser = computed(() => {
  return adminStore.user
})

const user = computed(() => {
  return authStore.user
})

const disableSaveUser = computed(() => {
  return v$.value.profileData.$invalid
})

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

const hasLocales = computed(() => {
  return locales.length > 1
})

// methods
function copyUserProfile(userObj) {
  return {
    firstname: userObj.firstname,
    lastname: userObj.lastname,
    city: userObj.city,
    institution: userObj.institution,
    title: userObj.title,
    phone: userObj.phone,
    language: userObj.language,
    role: userObj.role
  }
}

async function initData() {
  await adminStore.getUser(user.value._id)
  profileData.value = copyUserProfile(currentUser.value)
}

async function saveUser() {
  v$.value.$reset()
  const toSave = { ...profileData.value }
  await accountStore.updateProfile(user.value._id, toSave)
}

// mounted
onMounted(() => {
  initData()
})
</script>
