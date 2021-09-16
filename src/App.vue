<template>
  <router-view />
</template>
<script>
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'App',
  watch: {
    currentUser(newUser, oldUser) {
      if (newUser === null) {
        this.$router.push('/login');
      } else {
        this.$router.push('/');
      }
    }
  },
  setup() {
    // Attempt jwt auth when the app mounts.
    onMounted(() => {
      // FIXME this is undefined
      /*this.$store.dispatch('auth/authenticate').catch(error => {
        if (!error.message.includes('Could not find stored JWT')) {
          console.error(error);
        }
      });*/
    })
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  }
})
</script>
