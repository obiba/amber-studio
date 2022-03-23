<template>
  <q-layout :class="settings.theme.front.bg" v-cloak>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="bg-transparent no-border no-shadow">
          <div class="row q-col-gutter-lg">
            <q-circular-progress
              indeterminate
              size="100px"
              :thickness="0.22"
              color="lime"
              track-color="grey"
              class="q-ma-xl"
            />
          </div>
          <div class="row full-width">
            <div class="col-lg-12 col-md-12 cl-sm-12 col-xs-12">
              <div>
                <div class="text-h3 text-center">
                  {{$t('loading.title')}}
                </div>
                <div class="text-h6 text-center">
                  {{$t('loading.caption')}}
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { settings } from '../boot/settings'

export default defineComponent({
  name: 'Loading',
  setup () {
    return {
      settings: settings
    }
  }
})
</script>

<style>
[v-cloak] {
  display: none !important;
}
</style>
