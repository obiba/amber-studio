<template>
    <div>
        <div class="col text-center">
            <img :src="settings.theme.logo"/>
        </div>
        <div class="col text-center q-mb-lg">
            <div v-if="t('login.brand')" class="text-h6">
                {{ t("login.brand") }}
            </div>
            <div v-if="t('login.brand_caption')" class="text-subtitle1">
                {{ t("login.brand_caption") }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { settings } from '../boot/settings'

const { t } = useI18n()
</script>
