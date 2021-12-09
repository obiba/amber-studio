<template>
  <q-page>
    <div class="bg-blue-grey-1 q-pa-md">
      <q-breadcrumbs class="q-mt-sm">
        <q-breadcrumbs-el icon="person" :label="$t('account.title') + ' [' + $t('roles.' + user.role) + ']'" />
      </q-breadcrumbs>
    </div>
    <q-separator/>

    <div class="row">
      <div class='col-12 col-md-6'>
        <q-input
          v-model='profileData.firstname'
          :label="$t('firstname')"
          lazy-rules
          class='q-ma-sm'
          @blur="v$.profileData.firstname.$touch"
          :error="v$.profileData.firstname.$error"
          :hint="$t('required')"
        >
          <template v-slot:prepend>
            <q-icon name='fas fa-user' size='xs' />
          </template>
          <template v-slot:error>
            <div v-for="error in v$.profileData.firstname.$errors">
              {{error.$message}}
            </div>
          </template>
        </q-input>
      </div>
      <div class='col-12 col-md-6'>
        <q-input
          v-model='profileData.lastname'
          :label="$t('lastname')"
          lazy-rules
          class='q-ma-sm'
          @blur="v$.profileData.lastname.$touch"
          :error="v$.profileData.lastname.$error"
          :hint="$t('required')"
        >
          <template v-slot:prepend>
            <q-icon name='fas fa-user' size='xs' />
          </template>
          <template v-slot:error>
            <div v-for="error in v$.profileData.lastname.$errors">
              {{error.$message}}
            </div>
          </template>
        </q-input>
      </div>
      <div class='col-12 col-md-6'>
        <q-input
          v-model='profileData.institution'
          :label="$t('institution')"
          lazy-rules
          class='q-ma-sm'
        >
          <template v-slot:prepend>
            <q-icon name='fas fa-building' size='xs' />
          </template>
        </q-input>
      </div>
      <div class='col-12 col-md-6'>
        <q-input
          v-model='profileData.city'
          :label="$t('city')"
          lazy-rules
          class='q-ma-sm'
        >
          <template v-slot:prepend>
            <q-icon name='fas fa-city' size='xs' />
          </template>
        </q-input>
      </div>
      <div class='col-12 col-md-6'>
        <q-input
          v-model='profileData.title'
          :label="$t('title')"
          lazy-rules
          class='q-ma-sm'
        >
          <template v-slot:prepend>
            <q-icon name='fas fa-user-tie' size='xs' />
          </template>
        </q-input>
      </div>
      <div class='col-12 col-md-6'>
        <q-input
          v-model='profileData.phone'
          :label="$t('phone')"
          lazy-rules
          class='q-ma-sm'
        >
          <template v-slot:prepend>
            <q-icon name='fas fa-phone' size='xs' />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-6">
          <q-select
            class='q-ma-sm'
            v-show="hasLocales"
            v-model="profileData.language"
            :options="localeOptions"
            :label="$t('preferred_language')"
            emit-value
            map-options
            options-dense
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-language" size="xs" />
            </template>
          </q-select>
      </div>
    </div>

    <q-btn
      @click='saveUser'
      :disable='disableSaveUser'
      :label="$t('save')"
      type='submit'
      color='positive'
      class="q-ml-sm q-mt-md"
    >
      <template v-slot:loading>
        <q-spinner-facebook />
      </template>
    </q-btn>

  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'
import { locales } from '../boot/i18n'

export default defineComponent({
  mounted: function () {
    this.initData()
  },
  setup () {
    const userOptions = ref([])
    return {
      v$: useVuelidate(),
      userOptions
    }
  },
  data () {
    return {
      profileData: {
        firstname: '',
        lastname: '',
        institution: '',
        city: '',
        title: '',
        phone: '',
        language: ''
      }
    }
  },
  validations: {
    profileData: {
      firstname: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      lastname: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      institution: {
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      city: {
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      language: {
        required
      }
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.admin.user,
      user: state => state.auth.payload.user
    }),
    disableSaveUser () {
      return this.v$.profileData.$invalid
    },
    localeOptions () {
      return locales.map(loc => {
        return {
          value: loc,
          label: this.$t('locales.' + loc)
        }
      })
    },
    hasLocales () {
      return locales.length > 1
    }
  },
  methods: {
    ...mapActions({
      getUser: 'admin/getUser',
      updateProfile: 'account/updateProfile'
    }),
    copyUserProfile (user) {
      return {
        firstname: user.firstname,
        lastname: user.lastname,
        city: user.city,
        institution: user.institution,
        title: user.title,
        phone: user.phone,
        language: user.language,
        role: user.role
      }
    },
    async initData () {
      await this.getUser({ id: this.user._id })
      this.profileData = this.copyUserProfile(this.currentUser)
    },
    async saveUser () {
      this.v$.$reset()
      const toSave = { ...this.profileData }
      this.updateProfile({
        profileData: toSave,
        id: this.user._id
      })
    }
  }
})
</script>
