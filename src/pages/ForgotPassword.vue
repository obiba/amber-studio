<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.svg">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                {{$t('forgot_password.title')}}
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="forgotPassword">
              
              <q-input
                filled
                v-model="resetEmail"
                :label="$t('email')"
                type="email"
                :hint="$t('forgot_password.hint')"
                lazy-rules>
                <template v-slot:prepend>
                  <q-icon color="accent" name="fas fa-envelope" size="xs" />
                </template>
              </q-input>
          
              <div class="q-mt-md">
                <q-btn 
                  :label="$t('forgot_password.submit')"
                  type="submit"
                  color="primary"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { required, minLength, email } from "@vuelidate/validators";

export default {
  data() {
    return {
      valid: false,
      resetEmail: ""
    };
  },
  validations: {
    resetEmail: {
      required,
      email
    }
  },
  computed: {
    ...mapState({
      submitting: state => state.auth.showLoading
    }),
    resetValid() {
      return true//this.$v.resetEmail.$invalid;
    }
  },
  methods: {
    forgotPassword() {
      this.$store
        .dispatch("account/forgotPassword", {
          emailAddress: this.resetEmail
        })
        .then(() => {
          this.$router.push("/login");
        });
    }
  }
};
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>