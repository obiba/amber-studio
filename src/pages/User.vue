<template>
  <q-page>
    <div class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs class="q-mt-sm">
        <q-breadcrumbs-el icon="person" :title="$t('users.title')" to="/users"/>
        <q-breadcrumbs-el :label="user.email" />
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
      <div class='col-12 col-md-6'>
        <q-select
          class='q-ma-sm text-capitalize'
          v-model='profileData.role'
          :options='rolesOptions'
          :label="$t('role')"
          emit-value
          map-options
          options-dense
        >
        </q-select>
      </div>
      <div class='col-12 col-md-6'>
        <q-toggle
          v-model="profileData.totp2faRequired"
          :label="$t('users.required_2fa')"
        />
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

    <q-btn
      v-show="currentUser.totp2faRequired"
      @click='resetTotp2FA'
      :disable='disableTotp2FA'
      :label="$t('users.reset_2fa')"
      type='submit'
      color='primary'
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
import { settings } from '../boot/settings'

export default defineComponent({
  mounted: function () {
    this.initData()
  },
  setup () {
    const userOptions = ref([])
    return {
      v$: useVuelidate(),
      userOptions,
      settings
    }
  },
  data () {
    return {
      roles: ['guest', 'interviewer', 'manager', 'administrator', 'inactive'],
      profileData: {
        firstname: '',
        lastname: '',
        institution: '',
        city: '',
        title: '',
        phone: '',
        language: '',
        role: ''
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
      },
      role: {
        required
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.admin.user
    }),
    currentUser () {
      return this.$store.state.admin.user
    },
    disableSaveUser () {
      return this.v$.profileData.$invalid
    },
    disableTotp2FA () {
      return this.currentUser.totp2faEnabled === false
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
    },
    rolesOptions () {
      return this.roles.map(rl => {
        return {
          value: rl,
          label: this.$t('roles.' + rl)
        }
      })
    }
  },
  methods: {
    ...mapActions({
      getUser: 'admin/getUser',
      updateUser: 'admin/updateUser'
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
        role: user.role,
        totp2faRequired: user.totp2faRequired
      }
    },
    async initData () {
      await this.getUser({ id: this.$route.params.id })
      this.profileData = this.copyUserProfile(this.user)
    },
    async saveUser () {
      this.v$.$reset()
      const toSave = { ...this.profileData }
      this.updateUser({
        user: toSave,
        id: this.user._id
      })
    },
    async resetTotp2FA () {
      this.profileData.totp2faEnabled = false
      this.saveUser()
    }
  }
})
</script>
