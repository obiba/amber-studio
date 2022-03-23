<template>
    <div v-if="$q.screen.lt.sm || $q.screen.lt.md">
        <div class="col text-center">
            <img src="icons/apple-icon-60x60.png"/>
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
    <div v-else class="row justify-center q-mb-md">
        <div class="col-md-2 col-sm-12">
            <img src="icons/apple-icon-60x60.png"/>
        </div>
        <div class="col-md-8 col-sm-12 q-ml-md">
            <div class="text-h5">
                {{$t('main.brand')}}
            </div>
            <div v-if="$t('main.brand_caption')" class="text-subtitle1">
                {{$t('main.brand_caption')}}
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Banner'
})
</script>
