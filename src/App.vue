<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  watch: {
    currentUser(newUser, oldUser) {
      console.log('coucou')
      console.log(newUser)
      if (newUser === null) {
        this.$router.push('/Login');
      } else {
        if (this.$route.path === '/Login') {
          this.$router.push('/Profile');
        }
      }
    }
  },
  setup() {
    // Attempt jwt auth when the app mounts.
    /*onMounted(() => {
      this.$store.dispatch('auth/authenticate').catch(error => {
        if (!error.message.includes('Could not find stored JWT')) {
          console.error(error);
        }
      });
    })*/
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  }
})
</script>
