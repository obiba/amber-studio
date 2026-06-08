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
                      color="primary"
                      :disable="disableSubmit"/>
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

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { required, email } from '../boot/vuelidate'
import { settings } from '../boot/settings'
import useVuelidate from '@vuelidate/core'
import { useAccountStore } from 'src/stores/account'

import Banner from 'components/Banner'

const router = useRouter()
const accountStore = useAccountStore()

// data
const resetEmail = ref('')

// validations
const rules = {
  resetEmail: {
    required,
    email
  }
}
const v$ = useVuelidate(rules, { resetEmail })

// computed
const disableSubmit = computed(() => {
  return v$.value.resetEmail.$invalid
})

// methods
async function forgotPassword() {
  try {
    await accountStore.forgotPassword(resetEmail.value)
    router.push('/login')
  } catch (err) {
    // Error handled by store
  }
}
</script>
