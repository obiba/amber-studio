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
                    {{t('verify.title')}}
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="row justify-center items-center content-center">
                <div class="col-md-8 q-pa-lg text-center">
                  <span v-if="success">{{t('verify.success')}}</span>
                  <span v-else-if="success === undefined">{{t('verify.pending')}}</span>
                  <span v-else>{{t('verify.failure')}}</span>
                </div>
              </q-card-section>
              <q-card-section v-if="success !== undefined" class="row justify-center items-center content-center">
                <q-btn
                  :label="t('verify.login')"
                  to="/login"
                  color="primary"
                  class="text-bold"/>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import userService from '../services/user'
import { Notify } from 'quasar'
import { settings } from '../boot/settings'

import Banner from 'src/components/Banner.vue'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })

// data
const success = ref(undefined)

// methods
async function verifyAccount () {
  const token = route.query.token
  let result
  if (token) {
    result = await userService.verifyAccount(token)
      .catch(err => {
        if (err.response) {
          success.value = false
          Notify.create({
            message: t('verify.failure'),
            color: 'negative',
            icon: 'fas fa-times'
          })
        }
      })
    success.value = result && result.status === 201
    if (success.value) {
      Notify.create({
        message: t('verify.success'),
        color: 'positive',
        icon: 'fas fa-check'
      })
    } else {
      success.value = false
    }
  } else {
    success.value = false
    Notify.create({
      message: t('verify.bad_link'),
      color: 'negative',
      icon: 'fas fa-times'
    })
  }
}

// mounted
onMounted(() => {
  verifyAccount()
})
</script>
