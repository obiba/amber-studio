<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center" :class="settings.theme.front.bg">
        <div class="column" v-bind:style="$q.screen.lt.sm?{'width': '80%'}:$q.screen.lt.md?{'width':'50%'}:{'width':'30%'}">
          <div class="col">
            <banner/>
          </div>
          <div class="col">
            <q-card :class="settings.theme.front.card">
              <q-card-section>
                <div class="text-center q-pt-sm">
                  <div class="col text-subtitle">
                    {{$t('register.title')}}
                  </div>
                </div>
              </q-card-section>
              <q-card-section v-if="!registrationComplete">
                <q-form @submit="onSubmit" class="q-gutter-md">

                  <q-input
                    autofocus
                    v-model="formData.email"
                    :label="$t('email')"
                    :hint="$t('email_hint')"
                    type="email"
                    @blur="v$.formData.email.$touch"
                    :error="v$.formData.email.$error"
                    lazy-rules>
                    <template v-slot:prepend>
                      <q-icon name="fas fa-envelope" size="xs" />
                    </template>
                    <template v-slot:error>
                      <div v-for="error in v$.formData.email.$errors" :key="error">
                        {{error.$message}}
                      </div>
                    </template>
                  </q-input>

                  <q-input
                    v-model="formData.password"
                    :label="$t('password')"
                    :hint="$t('password_hint')"
                    type="password"
                    lazy-rules
                    @blur="v$.formData.password.$touch"
                    :error="v$.formData.password.$error">
                    <template v-slot:prepend>
                      <q-icon name="fas fa-lock" size="xs" />
                    </template>
                    <template v-slot:error>
                      <div v-for="error in v$.formData.password.$errors" :key="error">
                        {{error.$message}}
                      </div>
                    </template>
                  </q-input>

                  <q-input
                    v-model="formData.firstname"
                    :label="$t('firstname')"
                    :hint="$t('required')"
                    @blur="v$.formData.firstname.$touch"
                    :error="v$.formData.firstname.$error"
                    lazy-rules>
                    <template v-slot:prepend>
                      <q-icon name="fas fa-user" size="xs" />
                    </template>
                    <template v-slot:error>
                      <div v-for="error in v$.formData.firstname.$errors" :key="error">
                        {{error.$message}}
                      </div>
                    </template>
                  </q-input>

                  <q-input
                    v-model="formData.lastname"
                    :label="$t('lastname')"
                    :hint="$t('required')"
                    @blur="v$.formData.lastname.$touch"
                    :error="v$.formData.lastname.$error"
                    lazy-rules>
                    <template v-slot:prepend>
                      <q-icon name="fas fa-user" size="xs" />
                    </template>
                    <template v-slot:error>
                      <div v-for="error in v$.formData.lastname.$errors" :key="error">
                        {{error.$message}}
                      </div>
                    </template>
                  </q-input>

                  <q-select
                    v-show="hasLocales"
                    v-model="locale"
                    :options="localeOptions"
                    :label="$t('preferred_language')"
                    emit-value
                    map-options
                    options-dense
                    style="min-width: 150px"
                  >
                    <template v-slot:prepend>
                      <q-icon name="fas fa-language" size="xs" />
                    </template>
                  </q-select>
                  <div>
                    <q-btn
                      :label="$t('register.submit')"
                      type="submit"
                      color="primary"
                      :disable='disableSubmit'/>
                    <q-btn
                      :label="$t('register.login')"
                      flat
                      to="/login"
                      stretch
                      class="text-bold q-ml-md"/>
                  </div>
                </q-form>
              </q-card-section>
              <q-card-section v-if="!registrationComplete">
                <span class="text-caption text-grey" v-html="$t('register.google_policy')">
                </span>
              </q-card-section>
              <q-card-section v-if="registrationComplete">
                <div class="text-center q-pt-lg">
                  <div class="col text-h6 ellipsis">
                    {{$t('register.success')}}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { required, minLength, maxLength, email, strongPassword } from '../boot/vuelidate'
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'
import { useAccountStore } from 'src/stores/account'

import Banner from 'components/Banner'

const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()
const accountStore = useAccountStore()

// data
const formData = reactive({
  firstname: '',
  lastname: '',
  language: '',
  email: '',
  password: ''
})
const registrationComplete = ref(false)

// validations
const rules = {
  formData: {
    firstname: {
      required,
      minLength: minLength(2)
    },
    lastname: {
      required,
      minLength: minLength(2)
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(64),
      strongPassword
    }
  }
}
const v$ = useVuelidate(rules, { formData })

// recaptcha helper
async function recaptcha() {
  await recaptchaLoaded()
  const token = await executeRecaptcha('login')
  return token
}

// mounted
onMounted(() => {
  if (!settings.register_enabled) {
    router.push('/')
  }
})

// computed
const disableSubmit = computed(() => {
  return v$.value.formData.$invalid
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
async function onSubmit() {
  try {
    const token = await recaptcha()
    const data = { ...formData }
    data.language = locale.value
    data.token = token
    await accountStore.registerUser(data)
    registrationComplete.value = true
  } catch (err) {
    // Error handled by store
  }
}
</script>
