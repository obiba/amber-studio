<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.svg">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-subtitle ellipsis">
                {{$t('register.title')}} 
              </div>
            </div>
          </q-card-section>
          <q-card-section v-if="!registrationComplete">
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                filled
                v-model="formData.firstname"
                :label="$t('firstname')"
                @blur="v$.formData.firstname.$touch"
                :error="v$.formData.firstname.$error"
                lazy-rules>
                <template v-slot:prepend>
                  <q-icon name="fas fa-user" size="xs" />
                </template>
                <template v-slot:error>
                  <div v-for="error in v$.formData.firstname.$errors">
                    {{error.$message}}
                  </div>
                </template>
              </q-input>

              <q-input
                filled
                v-model="formData.lastname"
                :label="$t('lastname')"
                @blur="v$.formData.lastname.$touch"
                :error="v$.formData.lastname.$error"
                lazy-rules>
                <template v-slot:prepend>
                  <q-icon name="fas fa-user" size="xs" />
                </template>
                <template v-slot:error>
                  <div v-for="error in v$.formData.lastname.$errors">
                    {{error.$message}}
                  </div>
                </template>
              </q-input>

              <q-select
                v-model="locale"
                :options="localeOptions"
                :label="$t('preferred_language')"
                filled
                emit-value
                map-options
                options-dense
                style="min-width: 150px"
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-language" size="xs" />
                </template>
              </q-select>

              <q-input
                filled
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
                  <div v-for="error in v$.formData.email.$errors">
                    {{error.$message}}
                  </div>
                </template>
              </q-input>
              
              <q-input
                filled
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
                  <div v-for="error in v$.formData.password.$errors">
                    {{error.$message}}
                  </div>
                </template>
              </q-input>
              
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
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { mapState, mapActions } from "vuex";
import useVuelidate from '@vuelidate/core';
import { required, email, minLength, createI18nMessage } from "@vuelidate/validators";
import { useReCaptcha } from "vue-recaptcha-v3";

export default {
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()

    const recaptcha = async () => {
      // (optional) Wait until recaptcha has been loaded.
      await recaptchaLoaded()

      // Execute reCAPTCHA with action "login".
      const token = await executeRecaptcha('login')

      // Do stuff with the received token.
      return token;
    }

    return {
      locale,
      localeOptions: [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' }
      ],
      v$: useVuelidate(),
      recaptcha
    }
  },
  data() {
    return {
      formData: {
        firstname: "",
        lastname: "",
        language: "",
        email: "",
        password: ""
      }
    };
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
        minLength: minLength(8)
      }
    }
  },
  computed: {
    ...mapState({
      submitting: state => state.auth.showLoading,
      registrationComplete: state => state.auth.registrationComplete
    }),
    disableSubmit() {
      return this.v$.formData.$invalid;
    }
  },
  methods: {
    onSubmit() {
      // Execute reCAPTCHA with action "login".
      this.recaptcha().then((token) => {
          let data = this.formData;
          data.language = this.locale;
          data.token = token;
          this.$store.dispatch("account/registerUser", { formData: data });
      });
      
    }
  }
};
</script>

<style>

.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>