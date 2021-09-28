<template>
  <q-page class='q-pa-sm bg-white'>
    <div class='text-h6 q-ma-md'>{{$t('users.title')}}</div>
    <q-separator/>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="users" :label="$t('users.users')" />
      <q-tab name="groups" :label="$t('users.groups')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="users">

        <q-table
            flat
            :rows='users'
            :columns='columns'
            :filter='filter'
            row-key='email'
            selection="multiple"
            v-model:selected="selected"
            v-model:pagination='paginationOpts'
            @request='getTableUsers'
          >
           <template v-slot:top>
            <q-btn color="primary" :label="$t('users.add_user')" :title="$t('users.add_user_hint')" @click="createUser()" class="q-mr-md" />
            <q-btn color="primary" :disable="selected.length === 0" :label="$t('users.delete_users')" :title="$t('users.delete_users_hint')" @click="confirmDeleteUsers()" />
            <q-space />
            <q-select
              flat
              dense
              v-model="rolesFilter"
              multiple
              emit-value
              :options="rolesOptions"
              use-chips
              clearable
              :label="$t('users.roles_filter')"
              style="min-width: 250px"
              class="q-mr-md"
              @change="getTableUsers"
            />
            <q-input filled borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-name='props'>
            <q-td :props='props'>
              {{ props.row.firstname }} {{ props.row.lastname }}
            </q-td>
          </template>
          <template v-slot:body-cell-role='props'>
            <q-td>
              {{ $t('roles.' + props.row.role) }}
            </q-td>
          </template>
          <template v-slot:body-cell-action='props'>
            <q-td :props='props'>
              <q-btn
                size='sm'
                class='q-pa-xs q-mx-xs'
                color='primary'
                :title="$t('users.edit_user_hint')"
                icon='edit'
                @click='updateUser(props.row)'>
              </q-btn>
              <q-btn
                v-if='!props.row.isVerified'
                size='sm'
                class='q-pa-xs q-mx-xs'
                :title="$t('users.resend_email_hint')"
                color='secondary'
                icon='send'
                @click='resendEmailVerification(props.row.email)'>
              </q-btn>
              <q-btn
                v-if='props.row.isVerified'
                size='sm'
                class='q-pa-xs q-mx-xs'
                color='purple'
                :title="$t('users.reset_password_hint')"
                icon='replay'
                @click='resetPassword(props.row.email)'>
              </q-btn>
              <q-btn
                v-if='props.row.role === "inactive"'
                size='sm'
                class='q-pa-xs q-mx-xs'
                color='green'
                :title="$t('users.activate_user_hint')"
                icon='do_not_disturb_off'
                @click='activeateUser(props.row)'>
              </q-btn>
              <q-btn
                v-if='!(props.row.role === "inactive")'
                size='sm'
                class='q-pa-xs q-mx-xs'
                color='orange'
                :title="$t('users.deactivate_user_hint')"
                icon='do_not_disturb_on'
                @click='deactiveateUser(props.row)'>
              </q-btn>
              <q-btn
                size='sm'
                class='q-pa-xs q-mx-xs'
                color='red'
                :title="$t('users.delete_user_hint')"
                icon='delete_outline'
                @click='confirmDeleteUser(props.row)'>
              </q-btn>
            </q-td>
          </template>
        </q-table>       
      </q-tab-panel>

      <q-tab-panel name="groups">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model='showEditUser' persistent>
      <q-card>
        <q-card-section class='row items-center'>
           
          <div class='col-12 col-md-6'>
            <q-input
              filled
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
              filled
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
              filled
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
              filled
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
              filled
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
              filled
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
                filled
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
              filled
              emit-value
              map-options
              options-dense
            >
            </q-select>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveUser'
            :disable='disableUpdateProfile'
            :label="$t('update')"
            type='submit'
            color='positive'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showCreateUser' persistent>
      <q-card>
        <q-card-section class='row items-center'>
           
          <div class='col-12 col-md-6'>
            <q-input
              filled
              v-model='newProfileData.firstname'
              :label="$t('firstname')"
              lazy-rules
              class='q-ma-sm'
              @blur="v$.newProfileData.firstname.$touch"
              :error="v$.newProfileData.firstname.$error"
              :hint="$t('required')"
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-user' size='xs' />
              </template>
              <template v-slot:error>
                <div v-for="error in v$.newProfileData.firstname.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              filled
              v-model='newProfileData.lastname'
              :label="$t('lastname')"
              lazy-rules
              class='q-ma-sm'
              @blur="v$.newProfileData.lastname.$touch"
              :error="v$.newProfileData.lastname.$error"
              :hint="$t('required')"
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-user' size='xs' />
              </template>
              <template v-slot:error>
                <div v-for="error in v$.newProfileData.lastname.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              filled
              v-model='newProfileData.email'
              :label="$t('email')"
              lazy-rules
              class='q-ma-sm'
              v-if='!selectedUser'
              @blur="v$.newProfileData.email.$touch"
              :error="v$.newProfileData.email.$error"
              :hint="$t('email_hint')"
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-envelope' size='xs' />
              </template>
              <template v-slot:error>
                <div v-for="error in v$.newProfileData.email.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              filled
              v-model='newProfileData.password'
              :label="$t('password')"
              lazy-rules
              class='q-ma-sm'
              type='password'
              v-if='!selectedUser'
              @blur="v$.newProfileData.password.$touch"
              :error="v$.newProfileData.password.$error"
              :hint="$t('password_hint')"
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-lock' size='xs' />
              </template>
              <template v-slot:error>
                <div v-for="error in v$.newProfileData.password.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              filled
              v-model='newProfileData.institution'
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
              filled
              v-model='newProfileData.city'
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
              filled
              v-model='newProfileData.title'
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
              filled
              v-model='newProfileData.phone'
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
                v-model="newProfileData.language"
                :options="localeOptions"
                :label="$t('preferred_language')"
                filled
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
              class='q-ma-sm'
              v-model='newProfileData.role'
              :options='rolesOptions'
              :label="$t('role')"
              filled
              emit-value
              map-options
              options-dense
            >
            </q-select>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveUser'
            :disable='disableCreateProfile'
            :label="$t('add')"
            type='submit'
            color='positive'
            v-close-popup
          >
           <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteUser' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('users.delete_user_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedUser.email}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteUser'
            :label="$t('delete')"
            type='submit'
            color='positive'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteUsers' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('users.delete_users_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(u => u.email).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteUsers'
            :label="$t('delete')"
            type='submit'
            color='positive'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {ref} from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength, email } from '../boot/vuelidate';
import { date } from 'quasar';
import { locales } from '../boot/i18n';

export default {
  mounted: function() {
    this.getTableUsers();
    this.setPagination();
  },
  setup() {
    return {
      v$: useVuelidate(),
      selected: ref([]),
      tab: ref('users'),
      filter: ref(''),
      rolesFilter: ref([])
    }
  },
  data() {
    return {
      roles: ['guest', 'interviewer', 'manager', 'administrator', 'inactive'],
      columns: [
        {
          name: 'name',
          required: true,
          label: this.$t('name'),
          align: 'left'
        },
        {
          name: 'email',
          align: 'left',
          label: this.$t('email'),
          field: 'email',
          sortable: true
        },
        {
          name: 'institution',
          align: 'left',
          label: this.$t('institution'),
          field: 'institution',
          sortable: true
        },
        {
          name: 'status',
          align: 'left',
          label: this.$t('status'),
          field: 'isVerified',
          format: val => {
            if (val) {
              return this.$t('confirmed');
            } else return this.$t('pending');
          },
          sortable: false
        },
        {
          name: 'role',
          align: 'left',
          label: this.$t('role'),
          field: 'role',
          sortable: false
        },
        {
          name: 'lastLoggedIn',
          align: 'left',
          label: this.$t('users.last_seen'),
          field: 'lastLoggedIn',
          sortable: true,
          format: val =>
            `${val ? date.formatDate(val, 'DD MMM YY HH:mm A') : this.$t('unknown')}`
        },
        {
          name: 'action',
          align: 'left',
          label: this.$t('action'),
        }
      ],
      selectedUser: {},
      showEditUser: false,
      showCreateUser: false,
      showConfirmDeleteUser: false,
      showConfirmDeleteUsers: false,
      paginationOpts: {
        sortBy: 'lastLoggedIn',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10
      },
      profileData: {
        firstname: '',
        lastname: '',
        institution: '',
        city: '',
        title:'',
        phone: '',
        language: '',
        role: ''
      },
      newProfileData: {
        firstname: '',
        lastname: '',
        institution: '',
        city: '',
        title:'',
        phone: '',
        language: '',
        role: ''
      }
    };
  },
  watch: {
    rolesFilter: function(newFilter, oldFilter) {
      this.getTableUsers();
    }
  },
  validations: {
    profileData: {
      firstname: {
        //alpha,
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      lastname: {
        //alpha,
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      institution: {
        //alpha,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      city: {
        //alpha,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      language: {
        required
      },
      role: {
        required
      }
    },
    newProfileData: {
      firstname: {
        //alpha,
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      lastname: {
        //alpha,
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      email: {
        email,
        required
      },
      password: {
        required,
        minLength: minLength(8)
      },
      institution: {
        //alpha,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      city: {
        //alpha,
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
      users: state => state.admin.users
    }),
    disableUpdateProfile() {
      return this.v$.profileData.$invalid;
    },
    disableCreateProfile() {
      return this.v$.newProfileData.$invalid;
    },
    localeOptions() {
      return locales.map(loc => {
        return {
          value: loc,
          label: this.$t('locales.' + loc)
        }
      });
    },
    hasLocales() {
      return locales.length>1;
    },
    rolesOptions() {
      return this.roles.map(rl => {
        return {
          value: rl,
          label: this.$t('roles.' + rl)
        }
      });
    }
  },
  methods: {
    setPagination() {
      this.paginationOpts = this.$store.state.admin.userPaginationOpts;
    },
    async getTableUsers(requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination;
        this.$store.commit('admin/setUserPagination', {
          userPaginationOpts: requestProp.pagination
        });
        await this.getUsers({ paginationOpts: requestProp.pagination, filter: requestProp.filter, roles: this.rolesFilter });
      } else {
        await this.getUsers({ paginationOpts: this.paginationOpts, filter: this.filter, roles: this.rolesFilter });
      }
      this.paginationOpts.rowsNumber = this.$store.state.admin.userPaginationOpts.rowsNumber;
    },
    ...mapActions({
      getUsers: 'admin/getUsers'
    }),
    createUser() {
      this.newProfileData = {
        language: locales[0],
        role: 'guest'
      };
      this.showCreateUser = true;
      this.selectedUser = undefined;
    },
    updateUser(user) {
      this.profileData.firstname = user.firstname;
      this.profileData.lastname = user.lastname;
      this.profileData.city = user.city;
      this.profileData.institution = user.institution;
      this.profileData.title = user.title;
      this.profileData.phone = user.phone;
      this.profileData.language = user.language;
      this.profileData.role = user.role;
      this.showEditUser = true;
      this.selectedUser = user;
    },
    confirmDeleteUser(user) {
      this.showConfirmDeleteUser = true;
      this.selectedUser = user;
    },
    confirmDeleteUsers() {
      if (this.selected.length>0) {
        this.showConfirmDeleteUsers = true;
      }
    },
    resendEmailVerification(email) {
      this.$store.dispatch('account/resendVerification', {
        email: email
      });
    },
    async saveUser() {
      this.v$.$reset();
      if (this.selectedUser) {
        // update
        let userData = { ...this.profileData };
        this.$store.dispatch('account/updateUser', {
          user: userData,
          id: this.selectedUser._id,
          paginationOpts: this.paginationOpts
        });
      } else {
        // create
        let userData = { ...this.newProfileData };
        this.$store.dispatch('account/createUser', {
          user: userData,
          paginationOpts: this.paginationOpts
        });
      }
    },
    resetPassword(email) {
      this.$store
        .dispatch('account/forgotPassword', {
          emailAddress: email
        });
    },
    deleteUser() {
      this.$store.dispatch('account/deleteUser', {
        id: this.selectedUser._id,
        paginationOpts: this.paginationOpts
      });
    },
    deleteUsers() {
      const ids = this.selected.map(u => u._id);
      this.$store.dispatch('account/deleteUsers', {
        ids: ids,
        paginationOpts: this.paginationOpts
      });
      this.selected = [];
    },
    async activeateUser(user) {
      this.profileData.firstname = user.firstname;
      this.profileData.lastname = user.lastname;
      this.profileData.city = user.city;
      this.profileData.institution = user.institution;
      this.profileData.title = user.title;
      this.profileData.phone = user.phone;
      this.profileData.language = user.language;
      this.profileData.role = 'guest';
      let userData = { ...this.profileData };
      this.$store.dispatch('account/updateUser', {
        user: userData,
        id: user._id,
        paginationOpts: this.paginationOpts
      });
    },
    async deactiveateUser(user) {
      this.profileData.firstname = user.firstname;
      this.profileData.lastname = user.lastname;
      this.profileData.city = user.city;
      this.profileData.institution = user.institution;
      this.profileData.title = user.title;
      this.profileData.phone = user.phone;
      this.profileData.language = user.language;
      this.profileData.role = 'inactive';
      let userData = { ...this.profileData };
      this.$store.dispatch('account/updateUser', {
        user: userData,
        id: user._id,
        paginationOpts: this.paginationOpts
      });
    }
  }
};
</script>

<style scoped>

</style>
