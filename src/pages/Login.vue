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
                Log in
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              
              <q-input
                filled
                v-model="email"
                label="Email"
                lazy-rules>
              <template v-slot:prepend>
                <q-icon name="fas fa-envelope" size="xs" />
              </template>
              </q-input>

              <q-input
                type="password"
                filled
                v-model="password"
                label="Password"
                lazy-rules>
                <template v-slot:prepend>
                <q-icon name="fas fa-lock" size="xs" />
              </template>
            </q-input>

              <div>
                <q-btn 
                  label="Login" 
                  type="submit" 
                  color="primary"
                  :disable="disableSubmit"
                  />
                <q-btn
                  flat
                  to="/register"
                  stretch
                  class="text-bold q-ml-md">
                  Register
                </q-btn>
              </div>
            </q-form>
            <q-btn
              flat
              to="/forgot-password"
              dense
              no-caps
              class="text-bold q-mt-md">
              Forgot passsword?
            </q-btn>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import {defineComponent} from 'vue'
import { mapState } from 'vuex';
import {ref} from 'vue'
import { Notify } from "quasar";

export default defineComponent({
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {
    ...mapState({
      submitting: state => state.auth.showLoading
    }),
    disableSubmit() {
      return this.email.length === 0 || this.password.length === 0;
    }
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch("auth/authenticate", {
          strategy: "local",
          email: this.email,
          password: this.password
        })
        // Just use the returned error instead of mapping it from the store.
        .catch(err => {
          // Convert the error to a plain object and add a message.
          let type = err.className;
          err = Object.assign({}, err);
          err.message =
            type === "not-authenticated"
              ? "Incorrect email or password."
              : "An error prevented login.";
          this.error = err;
          Notify.create({
            message: "Incorrect email/password combination.",
            color: "negative"
          });
        });
    }
  }
});
</script>

<style>

.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
