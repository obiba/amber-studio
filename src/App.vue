<template>
  <router-view />
</template>
<script>
import { useI18n } from 'vue-i18n';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  watch: {
    currentUser(newUser, oldUser) {
      if (newUser === null) {
        this.$router.push('/login');
      } else {
        this.locale = this.$store.state.auth.payload.user.language;
        this.$router.push('/');
      }
    }
  },
  setup() {
    const { locale } = useI18n({ useScope: 'global' });
    return {
      locale
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  }
})
</script>
