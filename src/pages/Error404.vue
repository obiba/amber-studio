<template>
  <div :class="settings.theme.front.bg" class="fullscreen text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        {{ $t('nothing_here') }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        :label="$t('go_home')"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { settings } from '../boot/settings'

export default defineComponent({
  name: 'Error404',
  setup () {
    return {
      settings: settings
    }
  }
})
</script>
