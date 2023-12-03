<template>
    <div>
        <div class="col text-center">
            <img :src="settings.theme.logo"/>
        </div>
        <div class="colcol text-center q-mb-lg">
            <div class="text-h6">
                {{$t('main.brand')}}
            </div>
            <div v-if="$t('main.brand_caption')" class="text-subtitle1">
                {{$t('main.brand_caption')}}
            </div>
        </div>
    </div>
</template>
<script>
import { settings } from '../boot/settings'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Banner',
  setup () {
    return {
      settings
    }
  }
})
</script>
