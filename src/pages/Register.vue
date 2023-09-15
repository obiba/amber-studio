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

<script>
import { useI18n } from 'vue-i18n'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { required, minLength, maxLength, email, strongPassword } from '../boot/vuelidate'
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'

import Banner from 'components/Banner'

export default defineComponent({
  components: { Banner },
  setup () {
    const { locale } = useI18n({ useScope: 'global' })
    const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()

    const recaptcha = async () => {
      // (optional) Wait until recaptcha has been loaded.
      await recaptchaLoaded()

      // Execute reCAPTCHA with action "login".
      const token = await executeRecaptcha('login')

      // Do stuff with the received token.
      return token
    }

    return {
      locale,
      v$: useVuelidate(),
      recaptcha,
      settings
    }
  },
  data () {
    return {
      formData: {
        firstname: '',
        lastname: '',
        language: '',
        email: '',
        password: ''
      }
    }
  },
  validations: {
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
  },
  mounted () {
    if (!this.settings.register_enabled) {
      this.$router.push('/')
    }
  },
  computed: {
    ...mapState({
      submitting: state => state.auth.showLoading,
      registrationComplete: state => state.auth.registrationComplete
    }),
    disableSubmit () {
      return this.v$.formData.$invalid
    },
    localeOptions () {
      return locales.map(loc => {
        return {
          value: loc,
          label: this.$t('locales.' + loc)
        }
      })
    },
    hasLocales () {
      return locales.length > 1
    }
  },
  methods: {
    onSubmit () {
      // Execute reCAPTCHA with action "login".
      this.recaptcha().then((token) => {
        const data = this.formData
        data.language = this.locale
        data.token = token
        this.$store.dispatch('account/registerUser', { formData: data })
      })
    }
  }
})
</script>
