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
              <div class="col text-subtitle ellipsis">
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
                @blur="v$.resetEmail.$touch"
                :error="v$.resetEmail.$error"
                lazy-rules>
                <template v-slot:prepend>
                  <q-icon name="fas fa-envelope" size="xs" />
                </template>
                <template v-slot:error>
                  <div v-for="error in v$.resetEmail.$errors">
                    {{error.$message}}
                  </div>
                </template>
              </q-input>
          
              <div class="q-mt-lg">
                <q-btn 
                  :label="$t('forgot_password.submit')"
                  type="submit"
                  color="primary"/>
                <q-btn
                  :label="$t('forgot_password.login')"
                  flat
                  to="/login"
                  stretch
                  class="text-bold q-ml-md"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
import { required,  email } from '../boot/vuelidate';
import useVuelidate from '@vuelidate/core';

export default {
  data() {
    return {
      v$: useVuelidate(),
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
    disableSubmit() {
      return this.v$.formData.$invalid;
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