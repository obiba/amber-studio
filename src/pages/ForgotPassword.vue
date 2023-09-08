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
                  <div class="col text-subtitle ellipsis">
                    {{$t('forgot_password.title')}}
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-form @submit="forgotPassword">
                  <q-input
                    autofocus
                    v-model="resetEmail"
                    :label="$t('email')"
                    type="email"
                    :hint="$t('forgot_password.hint')"
                    @blur="v$.resetEmail.$touch"
                    :error="v$.resetEmail.$error"
                    lazy-rules>
                    <template v-slot:prepend>
                      <q-icon name="fas fa-envelope" size="xs" />
                    </template>
                    <template v-slot:error>
                      <div v-for="error in v$.resetEmail.$errors">
                        {{error.$message}}
                      </div>
                    </template>
                  </q-input>
                  <div class="q-pt-md">
                    <q-btn
                      :label="$t('forgot_password.submit')"
                      type="submit"
                      color="primary"/>
                    <q-btn
                      :label="$t('forgot_password.login')"
                      flat
                      to="/login"
                      stretch
                      class="text-bold q-ml-md"/>
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { required, email } from '../boot/vuelidate'
import { settings } from '../boot/settings'
import useVuelidate from '@vuelidate/core'

import Banner from 'components/Banner'

export default defineComponent({
  components: { Banner },
  setup () {
    return {
      settings
    }
  },
  data () {
    return {
      v$: useVuelidate(),
      resetEmail: ''
    }
  },
  validations: {
    resetEmail: {
      required,
      email
    }
  },
  computed: {
    ...mapState({
      submitting: state => state.auth.showLoading
    }),
    disableSubmit () {
      return this.v$.formData.$invalid
    }
  },
  methods: {
    forgotPassword () {
      this.$store
        .dispatch('account/forgotPassword', {
          emailAddress: this.resetEmail
        })
        .then(() => {
          this.$router.push('/login')
        })
    }
  }
})
</script>
