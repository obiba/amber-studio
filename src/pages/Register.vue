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
                Register 
              </div>
            </div>
          </q-card-section>
          <q-card-section v-if="!registrationComplete">
            <q-form @submit="onSubmit" class="q-gutter-md">
                <q-input
              filled
              v-model="formData.firstname"
              label="First Name"
              label-color="accent"
              hint="Given Name"
              lazy-rules>
              <template v-slot:prepend>
                <q-icon color="accent" name="fas fa-user" size="xs" />
              </template>
            </q-input>

              <q-input
              filled
              v-model="formData.lastname"
              label="Family Name"
              label-color="accent"
              hint="Surname"
              lazy-rules>
              <template v-slot:prepend>
                <q-icon color="accent" name="fas fa-user" size="xs" />
              </template>
            </q-input>

<q-input
              filled
              v-model="formData.email"
              label-color="accent"
              label="Email"
              type="email"
              hint="Verifiable Email Address"
              lazy-rules>
              <template v-slot:prepend>
                <q-icon color="accent" name="fas fa-envelope" size="xs" />
              </template>
            </q-input>
<q-input
              filled
              v-model="formData.password"
              label-color="accent"
              label="Password"
              type="password"
              lazy-rules
              hint="Create a password. 8 character minimum.">
              <template v-slot:prepend>
                <q-icon color="accent" name="fas fa-lock" size="xs" />
              </template>
            </q-input>

              <div>
                <q-btn label="Register" type="submit" color="primary"/>
                <q-btn
                  flat
                  to="/login"
                  stretch
                  class="text-bold q-ml-md">
                  Login
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
          <q-card-section v-else>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Registration complete! Please check your email to confirm your registration.
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { required, email, minLength, sameAs } from "@vuelidate/validators";

export default {
  data() {
    return {
      formData: {
        firstname: "",
        lastname: "",
        email: "",
        password: ""
      }
    };
  },
  validations: {
    formData: {
      firstname: {
        required,
        minLength: minLength(2)
      },
      lastname: {
        required,
        minLength: minLength(2)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8)
      }
    }
  },
  computed: {
    ...mapState({
      submitting: state => state.auth.showLoading,
      registrationComplete: state => state.auth.registrationComplete
    }),
    disableSubmit() {
      return false;
    }
  },
  methods: {
    onSubmit() {
      this.$store.dispatch("account/registerUser", { formData: this.formData });
    }
  }
};
</script>

<style>

.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>