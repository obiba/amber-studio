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
          <q-card-section>
            <div class="row justify-center items-center content-center">
              <div v-if="success" class="col-md-8 q-pa-lg text-center">
                Thanks for verifying your account.
              </div>
              <div v-else class="col-md-8 q-pa-lg text-center">
                Verifying account...please wait...
              </div>
            </div>
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
      success: false
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
      if (result && result.status === 201) {
        this.success = true;
        this.$router.push("/login");
      } else {
        Notify.create({
          message: "Unable to verify account. Please contact support.",
          color: "negative"
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