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
                Reset password
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="resetPassword" class="q-gutter-md">
              
              <q-input
                type="password"
                filled
                v-model="formData.password"
                label="Password"
                lazy-rules
                hint="Create a password. 8 character minimum.">
                <template v-slot:prepend>
                  <q-icon color="accent" name="fas fa-lock" size="xs" />
                </template>
              </q-input>

              <div>
                <q-btn label="Reset" type="submit" color="primary"/>
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
import { required, minLength, email, sameAs } from "@vuelidate/validators";
import userService from "../services/user";
import { Notify } from "quasar";

export default {
  data() {
    return {
      valid: false,
      success: false,
      formData: {
        password: "",
        confirmPassword: ""
      }
    };
  },
  validations: {
    formData: {
      password: {
        required,
        minLength: minLength(8)
      },
      confirmPassword: {
        sameAsPassword: sameAs(formData => {
          return formData.password;
        })
      }
    }
  },
  computed: {
    ...mapState({
      submitting: state => state.auth.showLoading
    }),
    resetValid() {
      return this.$v.formData.$invalid;
    }
  },
  methods: {
    async resetPassword() {
      let token = this.$route.query.token;
      let result;
      if (token) {
        result = await userService
          .resetPassword(token, this.formData.password)
          .catch(err => {
            if (err.response) {
              let code = err.response.data.code;
              Notify.create({
                message: "Unable to verify account. Please contact support.",
                color: "negative"
              });
            }
          });
      } else {
        Notify.create({
          message:
            "Unable to reset password. Please check your email for the password reset link and try again.",
          color: "negative",
          icon: "fas fa-cross"
        });
      }
      if (result && result.status === 201) {
        Notify.create({
          message: "Password successfully changed.",
          color: "positive",
          icon: "fas fa-check"
        });
        this.$router.push("/");
      }
    }
  }
};
</script>

<style>

.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>