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
                Verify email
              </div>
            </div>
          </q-card-section>
          <q-card-section class="row justify-center items-center content-center">
            <div class="col-md-8 q-pa-lg text-center">
              <span v-if="success">Thanks, your account is verified.</span>
              <span v-else-if="success === undefined">Verifying account... please wait...</span>
              <span v-else>Verifying account failed.</span>
            </div>
          </q-card-section>
          <q-card-section v-if="success" class="row justify-center items-center content-center">
            <q-btn
              to="/login"
              color="primary"
              class="text-bold q-ml-md">
              Login
            </q-btn>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import userService from "../services/user";
import { Notify } from "quasar";

export default {
  data() {
    return {
      success: undefined
    };
  },
  mounted() {
    this.verifyAccount();
  },
  methods: {
    async verifyAccount() {
      let token = this.$route.query.token;
      let result;
      if (token) {
        result = await userService.verifyAccount(token).catch(err => {
          if (err.response) {
            let code = err.response.data.code;
            Notify.create({
              message: "Unable to verify account. Please contact support.",
              color: "negative"
            });
          }
        });
      }
      if (result) {
        this.success = result.status === 201;
        //this.$router.push("/login");
      } else {
        this.success = false
        Notify.create({
          message: "Unable to verify account. Please contact support.",
          color: "negative"
        });
        //this.$router.push("/");
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