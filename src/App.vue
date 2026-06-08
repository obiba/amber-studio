<template>
  <router-view />
</template>
<script setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { locale } = useI18n({ useScope: 'global' })

watch(() => authStore.user, (newUser) => {
  if (newUser === null) {
    router.push('/login')
  } else if (newUser?.language) {
    locale.value = newUser.language
  }
})
</script>
