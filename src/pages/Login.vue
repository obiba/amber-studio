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
              <q-card-section>
                <q-form v-show="!withToken" @submit="onSubmit" class="q-gutter-md">

                  <q-input
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
                      :label="$t('login.register')"
                      flat
                      to="/register"
                      stretch
                      class="text-bold q-ml-md"/>
                  </div>
                </q-form>

                <div v-show="secret">
                  <div class="col text-subtitle">
                    {{$t('login.totp')}}
                  </div>
                  <div class="text-center">
                    <img :src="qr"/>
                  </div>
                </div>

                <q-form v-show="withToken" @submit="onSubmit" class="q-gutter-md">

                  <q-input
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
import { LocalStorage, Notify, useQuasar } from 'quasar'
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
      withToken: false
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
        password: this.password
      }
      if (this.token && this.token.length > 0) {
        payload.token = this.token
      }
      if (this.secret && this.secret.length > 0) {
        payload.secret = this.secret
      }
      return payload
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
    onCancelToken () {
      this.secret = ''
      this.qr = ''
      this.withToken = ''
      this.token = ''
      this.password = ''
    }
  }
})
</script>
