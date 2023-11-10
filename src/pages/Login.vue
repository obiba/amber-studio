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
                    {{$t('login.title')}}
                  </div>
                </div>
              </q-card-section>
              <q-card-section v-if="!withToken">
                <q-form @submit="onSubmit" class="q-gutter-md">

                  <q-input
                    autofocus
                    v-model="email"
                    :label="$t('email')"
                    lazy-rules>
                  <template v-slot:prepend>
                    <q-icon name="fas fa-envelope" size="xs" />
                  </template>
                  </q-input>

                  <q-input
                    type="password"
                    v-model="password"
                    :label="$t('password')"
                    lazy-rules>
                    <template v-slot:prepend>
                    <q-icon name="fas fa-lock" size="xs" />
                  </template>
                  </q-input>

                  <div>
                    <q-btn
                      :label="$t('login.submit')"
                      type="submit"
                      color="primary"
                      :disable="disableSubmit"/>
                    <q-btn
                      v-if="settings.register_enabled"
                      :label="$t('login.register')"
                      flat
                      to="/register"
                      stretch
                      class="text-bold q-ml-md"/>
                  </div>
                </q-form>
              </q-card-section>
              <q-card-section v-if="secret">
                <div class="col text-subtitle">
                  {{$t('login.totp')}}
                </div>
                <div class="text-center q-mt-md">
                  <img :src="qr"/>
                </div>
                <div class="col text-subtitle q-mt-md">
                  {{$t('login.totp_secret')}}
                </div>
                <q-input
                  dense
                  v-model="secret"
                  readonly>
                  <template v-slot:after>
                    <q-btn round dense flat icon="content_copy" @click="onCopySecret"/>
                  </template>
                </q-input>
                <div class="col text-subtitle q-mt-md">
                  {{$t('login.email_otp')}}
                </div>
                <div class="q-mt-md">
                <q-btn
                  :label="$t('login.send_email_token')"
                  @click="onEmailToken"
                  color="info"
                  stretch
                  class="text-bold"/>
                </div>
              </q-card-section>
              <q-card-section v-if="withToken">
                <q-form @submit="onSubmit" class="q-gutter-md">

                  <q-input
                    autofocus
                    type="number"
                    v-model="token"
                    :label="$t('login.token')"
                    lazy-rules
                    class="no-spinner">
                    <template v-slot:prepend>
                    <q-icon name="fas fa-mobile" size="xs" />
                  </template>
                  </q-input>

                  <div>
                    <q-btn
                      :label="$t('login.validate')"
                      type="submit"
                      color="primary"
                      :disable="disableValidate"/>
                    <q-btn
                      :label="$t('cancel')"
                      @click="onCancelToken"
                      flat
                      stretch
                      class="text-bold q-ml-md"/>
                  </div>
                </q-form>

              </q-card-section>
              <q-card-section>
                <q-btn
                  flat
                  to="/forgot-password"
                  dense
                  no-caps
                  class="text-bold">
                  {{$t('login.forgot_password')}}
                </q-btn>
                <q-btn-dropdown
                  v-show="hasLocales"
                  flat
                  :label="locale"
                  class="float-right">
                <q-list>
                  <q-item clickable v-close-popup @click="onLocaleSelection(localeOpt)" v-for="localeOpt in localeOptions" :key="localeOpt.value">
                    <q-item-section>
                      <q-item-label class="text-uppercase">{{localeOpt.value}}</q-item-label>
                      <q-item-label caption>{{localeOpt.label}}</q-item-label>
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

<script>
import { useI18n } from 'vue-i18n'
import { defineComponent, watch } from 'vue'
import { mapState } from 'vuex'
import { LocalStorage, Notify, useQuasar, copyToClipboard } from 'quasar'
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'

import Banner from 'components/Banner'

export default defineComponent({
  components: { Banner },
  setup () {
    const $q = useQuasar()
    const { locale } = useI18n({ useScope: 'global' })

    watch(locale, val => {
      // dynamic import, so loading on demand only
      const langIso = val === 'en' ? 'en-US' : val
      import('quasar/lang/' + langIso)
        .then(lang => {
          $q.lang.set(lang.default)
        })
    })

    return {
      locale: locale,
      settings
    }
  },
  data () {
    return {
      email: '',
      password: '',
      token: '',
      secret: '',
      qr: '',
      withToken: false,
      method: ''
    }
  },
  mounted () {
    LocalStorage.remove('feathers-jwt')
  },
  watch: {
    user (newUser, oldUser) {
      if (newUser !== null) {
        this.$router.push('/')
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.payload ? state.auth.payload.user : null,
      submitting: state => state.auth.isAuthenticatePending
    }),
    disableSubmit () {
      return this.email.length === 0 || this.password.length === 0
    },
    disableValidate () {
      return this.token.length < 6
    },
    localeOptions () {
      return locales.map(loc => {
        return {
          value: loc,
          label: this.$t('locales.' + loc)
        }
      })
        .sort((loc1, loc2) => {
          if (loc1.label > loc2.label) return 1
          if (loc1.label < loc2.label) return -1
          return 0
        })
    },
    hasLocales () {
      return locales.length > 1
    }
  },
  methods: {
    onLocaleSelection (opt) {
      this.locale = opt.value
    },
    makePayload () {
      const payload = {
        strategy: 'local',
        email: this.email,
        password: this.password,
        method: this.method || undefined
      }
      if (this.token) {
        payload.token = this.token
      }
      if (!this.method && this.secret) {
        payload.secret = this.secret
      }
      return payload
    },
    onCopySecret () {
      copyToClipboard(this.secret).then(() => {
        Notify.create({
          message: this.$t('login.secret_copied'),
          color: 'positive'
        })
      })
    },
    onSubmit () {
      this.$store
        .dispatch('auth/authenticate', this.makePayload())
        .then(response => {
          if (response.data && response.data.qr && response.data.secret) {
            // 2FA is enabled for that user
            this.qr = response.data.qr
            this.secret = response.data.secret
            this.withToken = true
          }
        })
        // Just use the returned error instead of mapping it from the store.
        .catch(err => {
          // Convert the error to a plain object and add a message.
          const type = err.className
          err = Object.assign({}, err)
          if (type === 'bad-request' && err.message === 'Token required.') {
            this.withToken = true
          } else if (type === 'bad-request' && err.message === 'Invalid token.') {
            Notify.create({
              message: this.$t('login.failed_token'),
              color: 'negative'
            })
            this.token = ''
          } else {
            Notify.create({
              message: this.$t('login.failed'),
              color: 'negative'
            })
          }
        })
    },
    onEmailToken () {
      this.method = 'otp'
      this.onSubmit()
    },
    onCancelToken () {
      this.secret = ''
      this.qr = ''
      this.withToken = ''
      this.token = ''
      this.password = ''
      this.method = ''
    }
  }
})
</script>
