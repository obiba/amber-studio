<template>
  <router-view />
</template>
<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const { locale } = useI18n({ useScope: 'global' })

const currentUser = computed(() => store.state.auth.user)

watch(currentUser, (newUser) => {
  if (newUser === null) {
    router.push('/login')
  } else {
    locale.value = store.state.auth.payload.user.language
  }
})
</script>
