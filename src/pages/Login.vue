<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-base flex-center">
        <div class="column"  v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <div class="col">
            <div class="text-center text-h4 text-grey-8 q-pb-lg">
              {{$t('main.brand')}}
            </div>
          </div>
          <div class="col">
            <q-card>
              <q-card-section>
                <div class="text-center q-pt-sm">
                  <div class="col text-subtitle text-grey-7">
                    {{$t('login.title')}}
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-form @submit="onSubmit" class="q-gutter-md">
                  <q-input
                    filled
                    v-model="email"
                    :label="$t('email')"
                    lazy-rules>
                  <template v-slot:prepend>
                    <q-icon name="fas fa-envelope" size="xs" />
                  </template>
                  </q-input>

                  <q-input
                    type="password"
                    filled
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
                  <q-item clickable v-close-popup @click="onLocaleSelection(localeOpt)" v-for="localeOpt in localeOptions">
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
import { useI18n } from 'vue-i18n';
import {defineComponent} from 'vue'
import { mapState } from 'vuex';
import { Notify } from 'quasar';
import { locales } from '../boot/i18n';

export default defineComponent({
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    return { 
      locale: locale
    }
  },
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {
    ...mapState({
      submitting: state => state.auth.isAuthenticatePending
    }),
    disableSubmit() {
      return this.email.length === 0 || this.password.length === 0;
    },
    localeOptions() {
      return locales.map(loc => {
        return {
          value: loc,
          label: this.$t('locales.' + loc)
        }
      });
    },
    hasLocales() {
      return locales.length>1;
    }
  },
  methods: {
    onLocaleSelection(opt) {
      this.locale = opt.value;
    },
    onSubmit() {
      this.$store
        .dispatch("auth/authenticate", {
          strategy: "local",
          email: this.email,
          password: this.password
        })
        // Just use the returned error instead of mapping it from the store.
        .catch(err => {
          // Convert the error to a plain object and add a message.
          let type = err.className;
          err = Object.assign({}, err);
          err.message =
            type === "not-authenticated"
              ? "Incorrect email or password."
              : "An error prevented login.";
          this.error = err;
          Notify.create({
            message: "Incorrect email/password combination.",
            color: "negative"
          });
        });
    }
  }
});
</script>
