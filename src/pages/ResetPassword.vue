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
                    {{$t('reset.title')}}
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-form @submit="resetPassword" class="q-gutter-md">
                  <q-input
                    type="password"
                    v-model="formData.password"
                    :label="$t('password')"
                    lazy-rules
                    :hint="$t('password_hint')">
                    <template v-slot:prepend>
                      <q-icon name="fas fa-lock" size="xs" />
                    </template>
                  </q-input>
                  <div>
                    <q-btn
                      :label="$t('reset.submit')"
                      type="submit"
                      color="primary"/>
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
import { mapState } from 'vuex'
import { required, minLength } from '../boot/vuelidate'
import userService from '../services/user'
import { Notify } from 'quasar'

export default {
  data () {
    return {
      valid: false,
      success: false,
      formData: {
        password: ''
      }
    }
  },
  validations: {
    formData: {
      password: {
        required,
        minLength: minLength(8)
      }
    }
  },
  computed: {
    ...mapState({
      submitting: state => state.auth.showLoading
    }),
    resetValid () {
      return this.$v.formData.$invalid
    }
  },
  methods: {
    async resetPassword () {
      const token = this.$route.query.token
      let result
      if (token) {
        result = await userService
          .resetPassword(token, this.formData.password)
          .catch(err => {
            if (err.response) {
              Notify.create({
                message: this.$t('reset.failure'),
                color: 'negative',
                icon: 'fas fa-times'
              })
            }
          })
      } else {
        Notify.create({
          message: this.$t('reset.bad_link'),
          color: 'negative',
          icon: 'fas fa-times'
        })
      }
      if (result && result.status === 201) {
        Notify.create({
          message: this.$t('reset.success'),
          color: 'positive',
          icon: 'fas fa-check'
        })
        this.$router.push('/')
      }
    }
  }
}
</script>
