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
                    {{ $t('reset.title') }}
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-form @submit="resetPassword" class="q-gutter-md">
                  <q-input :type="showPassword ? 'text' : 'password'" v-model="formData.password"
                    :label="$t('password')" lazy-rules :hint="$t('password_hint')" @blur="v$.formData.password.$touch"
                    :error="v$.formData.password.$error">
                    <template v-slot:prepend>
                      <q-icon name="fas fa-lock" size="xs" />
                    </template>
                    <template v-slot:append>
                      <q-btn round dense flat :icon="showPassword ? 'visibility_off' : 'visibility'"
                        @click="showPassword = !showPassword" />
                    </template>
                    <template v-slot:error>
                      <div v-for="error in v$.formData.password.$errors" :key="error">
                        {{ error.$message }}
                      </div>
                    </template>
                  </q-input>
                  <div class="q-pt-md">
                    <q-btn :label="$t('reset.submit')" type="submit" color="primary" :disable="disableSubmit" />
                    <q-btn :label="$t('cancel')" flat to="/login" stretch class="text-bold q-ml-md" />
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
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, strongPassword } from '../boot/vuelidate'
import { Notify } from 'quasar'
import { settings } from '../boot/settings'
import { useAccountStore } from 'src/stores/account'

import Banner from 'components/Banner'

export default defineComponent({
  components: { Banner },
  setup() {
    const accountStore = useAccountStore()
    
    return {
      v$: useVuelidate(),
      settings,
      accountStore
    }
  },
  data() {
    return {
      valid: false,
      success: false,
      showPassword: false,
      formData: {
        password: ''
      }
    }
  },
  validations: {
    formData: {
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(64),
        strongPassword
      }
    }
  },
  computed: {
    disableSubmit() {
      return this.v$.formData.$invalid
    }
  },
  methods: {
    async resetPassword() {
      const token = this.$route.query.token
      if (!token) {
        Notify.create({
          message: this.$t('reset.bad_link'),
          color: 'negative',
          icon: 'fas fa-times'
        })
        return
      }
      
      try {
        const result = await this.accountStore.resetPassword(token, this.formData.password)
        if (result && result.status === 201) {
          Notify.create({
            message: this.$t('reset.success'),
            color: 'positive',
            icon: 'fas fa-check'
          })
          this.$router.push('/')
        }
      } catch (err) {
        Notify.create({
          message: this.$t('reset.failure'),
          color: 'negative',
          icon: 'fas fa-times'
        })
      }
    }
  }
})
</script>
