<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-sign flex-center">
        <div class="column"  v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <div class="col">
            <div class="text-center text-h4 text-grey-8 q-pb-lg">
              {{$t('main.brand')}}
            </div>
          </div>
          <div class="col">
            <q-card>
              <q-card-section>
                <div class="text-center q-pt-sm text-grey-7">
                  <div class="col text-subtitle ellipsis">
                    {{$t('verify.title')}}
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="row justify-center items-center content-center">
                <div class="col-md-8 q-pa-lg text-center">
                  <span v-if="success">{{$t('verify.success')}}</span>
                  <span v-else-if="success === undefined">{{$t('verify.pending')}}</span>
                  <span v-else>{{$t('verify.failure')}}</span>
                </div>
              </q-card-section>
              <q-card-section v-if="success !== undefined" class="row justify-center items-center content-center">
                <q-btn
                  :label="$t('verify.login')"
                  to="/login"
                  color="primary"
                  class="text-bold"/>
              </q-card-section>
            </q-card>
          </div>
        </div>
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
        result = await userService.verifyAccount(token)
        .catch(err => {
          if (err.response) {
            this.success = false;
            Notify.create({
              message: this.$t('verify.failure'),
              color: "negative",
              icon: "fas fa-times"
            });
          }
        });
        this.success = result && result.status === 201;
        if (this.success) {
          Notify.create({
            message: this.$t('verify.success'),
            color: "positive",
            icon: "fas fa-check"
          });
        } else {
          this.success = false;
        }
      } else {
        this.success = false
        Notify.create({
          message: this.$t('verify.bad_link'),
          color: "negative",
          icon: "fas fa-times"
        });
        //this.$router.push("/");
      }
    }
  }
};
</script>
