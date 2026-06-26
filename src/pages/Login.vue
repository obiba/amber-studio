<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center" :class="settings.theme.front.bg">
        <div class="column"
          v-bind:style="$q.screen.lt.sm ? { 'width': '80%' } : $q.screen.lt.md ? { 'width': '50%' } : { 'width': '30%' }">
          <div class="col">
            <banner />
          </div>
          <div class="col">
            <q-card :class="settings.theme.front.card">
              <q-card-section>
                <div class="text-center q-pt-sm">
                  <div class="col text-subtitle">
                    {{ t('login.title') }}
                  </div>
                </div>
              </q-card-section>
              <q-card-section v-if="!withToken">
                <q-form @submit="onSubmit" class="q-gutter-md">

                  <q-input autofocus v-model="email" :label="t('email')" lazy-rules>
                    <template v-slot:prepend>
                      <q-icon name="fas fa-envelope" size="xs" />
                    </template>
                  </q-input>

                  <q-input :type="showPassword ? 'text' : 'password'" v-model="password" :label="t('password')"
                    lazy-rules>
                    <template v-slot:prepend>
                      <q-icon name="fas fa-lock" size="xs" />
                    </template>
                    <template v-slot:append>
                      <q-btn round dense flat :icon="showPassword ? 'visibility_off' : 'visibility'"
                        @click="showPassword = !showPassword" />
                    </template>
                  </q-input>

                  <div>
                    <q-btn :label="t('login.submit')" type="submit" color="primary" :disable="disableSubmit" />
                    <q-btn v-if="settings.register_enabled" :label="t('login.register')" flat to="/register" stretch
                      class="text-bold q-ml-md" />
                  </div>
                </q-form>
              </q-card-section>
              <q-card-section v-if="secret">
                <div class="col text-subtitle">
                  {{ t('login.totp') }}
                </div>
                <div class="text-center q-mt-md">
                  <img :src="qr" />
                </div>
                <div class="col text-subtitle q-mt-md">
                  {{ t('login.totp_secret') }}
                </div>
                <q-input dense v-model="secret" readonly>
                  <template v-slot:after>
                    <q-btn round dense flat icon="content_copy" @click="onCopySecret" />
                  </template>
                </q-input>
                <div class="col text-subtitle q-mt-md">
                  {{ t('login.email_otp') }}
                </div>
                <div class="q-mt-md">
                  <q-btn :label="t('login.send_email_token')" @click="onEmailToken" color="info" stretch
                    class="text-bold" />
                </div>
              </q-card-section>
              <q-card-section v-if="withToken">
                <q-form @submit="onSubmit" class="q-gutter-md">

                  <q-input autofocus type="number" v-model="token" :label="t('login.token')" lazy-rules
                    class="no-spinner">
                    <template v-slot:prepend>
                      <q-icon name="fas fa-mobile" size="xs" />
                    </template>
                  </q-input>

                  <div>
                    <q-btn :label="t('login.validate')" type="submit" color="primary" :disable="disableValidate" />
                    <q-btn :label="t('cancel')" @click="onCancelToken" flat stretch class="text-bold q-ml-md" />
                  </div>
                </q-form>
              </q-card-section>
              <q-card-section v-if="authProviders.length > 0" class="text-center q-pt-none">
                <div class="text-subtitle q-mb-md">{{ t('login.continue_with') }}</div>
                <template v-for="provider in authProviders" :key="provider">
                  <q-btn :label="t(provider)" no-caps :href="`${baseURL}/oauth/${provider}?redirect=/login`" color="primary" class="q-mr-md">
                  </q-btn>
                </template>
              </q-card-section>
              <q-card-section>
                <q-btn flat to="/forgot-password" dense no-caps class="text-bold">
                  {{ t('login.forgot_password') }}
                </q-btn>
                <q-btn-dropdown v-show="hasLocales" flat :label="locale" class="float-right">
                  <q-list>
                    <q-item clickable v-close-popup @click="onLocaleSelection(localeOpt)"
                      v-for="localeOpt in localeOptions" :key="localeOpt.value">
                      <q-item-section>
                        <q-item-label class="text-uppercase" :title="localeOpt.label">{{ localeOpt.value }}</q-item-label>
                      </q-item-section>
                      <q-item-section avatar v-if="locale === localeOpt.value">
                        <q-icon color="primary" name="check" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>

              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { LocalStorage, Notify, useQuasar, copyToClipboard } from 'quasar'
import { useRouter } from 'vue-router'
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'
import { baseURL } from '../boot/axios'
import { useAuthStore } from 'src/stores/auth'

import Banner from 'src/components/Banner.vue'

// Import Quasar language files statically
import langEnUS from 'quasar/lang/en-US'
import langFr from 'quasar/lang/fr'

const $q = useQuasar()
const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()

// data
const email = ref('')
const password = ref('')
const token = ref('')
const secret = ref('')
const qr = ref('')
const withToken = ref(false)
const method = ref('')
const showPassword = ref(false)
const authProviders = ref([])

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

// watch authStore.user
watch(() => authStore.user, (newUser) => {
  if (newUser !== null) {
    router.push('/')
  }
  showPassword.value = false
})

// mounted
onMounted(async () => {
  const hash = new URLSearchParams(window.location.hash.substring(1))
  const oauthToken = hash.get('access_token')
  const oauthError = hash.get('error')

  if (oauthToken || oauthError) {
    window.history.replaceState(null, '', window.location.pathname)
  }

  if (oauthToken) {
    try {
      await authStore.authenticate({ strategy: 'jwt', accessToken: oauthToken })
      return // watcher on authStore.user will redirect to '/'
    } catch (err) {
      Notify.create({ message: t('login.failed'), color: 'negative' })
    }
  } else if (oauthError) {
    Notify.create({ message: t('login.failed'), color: 'negative' })
  }

  LocalStorage.remove('feathers-jwt')
  authStore.getOAuthProviders().then(resp => {
    authProviders.value = resp.providers || []
  })
})

// computed
const disableSubmit = computed(() => {
  return email.value.length === 0 || password.value.length === 0
})

const disableValidate = computed(() => {
  return token.value.length < 6
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
function onLocaleSelection (opt) {
  locale.value = opt.value
}

function makePayload () {
  const payload = {
    strategy: 'local',
    email: email.value,
    password: password.value,
    method: method.value || undefined
  }
  if (token.value) {
    payload.token = token.value
  }
  if (!method.value && secret.value) {
    payload.secret = secret.value
  }
  return payload
}

function onCopySecret () {
  copyToClipboard(secret.value).then(() => {
    Notify.create({
      message: t('login.secret_copied'),
      color: 'positive'
    })
  })
}

function onSubmit () {
  authStore
    .authenticate(makePayload())
    .then(response => {
      if (response.data && response.data.qr && response.data.secret) {
        // 2FA is enabled for that user
        qr.value = response.data.qr
        secret.value = response.data.secret
        withToken.value = true
      }
    })
    .catch(err => {
      const type = err.className
      err = Object.assign({}, err)
      if (type === 'bad-request' && err.message === 'Token required.') {
        withToken.value = true
      } else if (type === 'bad-request' && err.message === 'Invalid token.') {
        Notify.create({
          message: t('login.failed_token'),
          color: 'negative'
        })
        token.value = ''
      } else {
        Notify.create({
          message: t('login.failed'),
          color: 'negative'
        })
      }
    })
}

function onEmailToken () {
  method.value = 'otp'
  onSubmit()
}

function onCancelToken () {
  secret.value = ''
  qr.value = ''
  withToken.value = false
  token.value = ''
  password.value = ''
  method.value = ''
}
</script>
