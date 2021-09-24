<template>
  <q-page class='q-pa-sm bg-white'>
    <div class='text-h6 q-ma-md'>Users & Groups</div>
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
      <q-tab name="users" label="Users" />
      <q-tab name="groups" label="Groups" />
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
            <q-btn color="primary" label="Add User" title="Add a new user" @click="createUser()" class="q-mr-md" />
            <q-btn color="primary" :disable="selected.length === 0" label="Delete Users" title="Delete selected users" @click="confirmDeleteUsers()" />
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
              label="Roles"
              style="min-width: 250px"
              class="q-mr-md"
              @change="getTableUsers"
            />
            <q-input filled borderless dense debounce="300" v-model="filter" placeholder="Search">
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
            <q-td class='text-capitalize'>
              {{ props.row.role }}
            </q-td>
          </template>
          <template v-slot:body-cell-action='props'>
            <q-td :props='props'>
              <q-btn
                size='sm'
                class='q-pa-xs q-mx-xs'
                color='primary'
                title='Edit User'
                icon='edit'
                @click='updateUser(props.row)'>
              </q-btn>
              <q-btn
                v-if='!props.row.isVerified'
                size='sm'
                class='q-pa-xs q-mx-xs'
                title='Resend Email Verification'
                color='secondary'
                icon='send'
                @click='resendEmailVerification(props.row.email)'>
              </q-btn>
              <q-btn
                v-if='props.row.isVerified'
                size='sm'
                class='q-pa-xs q-mx-xs'
                color='purple'
                title='Reset Password'
                icon='replay'
                @click='resetPassword(props.row.email)'>
              </q-btn>
              <q-btn
                v-if='props.row.role === "inactive"'
                size='sm'
                class='q-pa-xs q-mx-xs'
                color='green'
                title='Activate User'
                icon='do_not_disturb_off'
                @click='activeateUser(props.row)'>
              </q-btn>
              <q-btn
                v-if='!(props.row.role === "inactive")'
                size='sm'
                class='q-pa-xs q-mx-xs'
                color='orange'
                title='Deactivate User'
                icon='do_not_disturb_on'
                @click='deactiveateUser(props.row)'>
              </q-btn>
              <q-btn
                size='sm'
                class='q-pa-xs q-mx-xs'
                color='red'
                title='Delete User'
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
              label='First Name'
              lazy-rules
              class='q-ma-sm'
              @blur="v$.profileData.firstname.$touch"
              :error="v$.profileData.firstname.$error"
              hint="Required"
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
              label='Family Name'
              lazy-rules
              class='q-ma-sm'
              @blur="v$.profileData.lastname.$touch"
              :error="v$.profileData.lastname.$error"
              hint="Required"
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
              label='Institution'
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
              label='City'
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
              label='Title'
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
              label='Phone'
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-phone' size='xs' />
              </template>
            </q-input>
          </div>
          <div class='col-12'>
            <q-select
              class='q-ma-sm text-capitalize'
              filled
              v-model='profileData.role'
              :options='roles'
              label='User Role'
              popup-content-class='text-capitalize'
              options-selected-class='primary'
            >
            </q-select>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn label='Cancel' flat v-close-popup />
          <q-btn
            @click='saveUser'
            :disable='disableUpdateProfile'
            label='Update User'
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
              label='First Name'
              lazy-rules
              class='q-ma-sm'
              @blur="v$.newProfileData.firstname.$touch"
              :error="v$.newProfileData.firstname.$error"
              hint="Required"
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
              label='Family Name'
              lazy-rules
              class='q-ma-sm'
              @blur="v$.newProfileData.lastname.$touch"
              :error="v$.newProfileData.lastname.$error"
              hint="Required"
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
              label='Email'
              lazy-rules
              class='q-ma-sm'
              v-if='!selectedUser'
              @blur="v$.newProfileData.email.$touch"
              :error="v$.newProfileData.email.$error"
              hint="Required"
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
              label='Password'
              lazy-rules
              class='q-ma-sm'
              type='password'
              v-if='!selectedUser'
              @blur="v$.newProfileData.password.$touch"
              :error="v$.newProfileData.password.$error"
              hint="Required"
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
              label='Institution'
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
              label='City'
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
              label='Title'
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
              label='Phone'
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon name='fas fa-phone' size='xs' />
              </template>
            </q-input>
          </div>
          <div class='col-12'>
            <q-select
              class='q-ma-sm text-capitalize'
              filled
              v-model='newProfileData.role'
              :options='roles'
              label='User Role'
              popup-content-class='text-capitalize'
              options-selected-class='primary'
            >
            </q-select>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn label='Cancel' flat v-close-popup />
          <q-btn
            @click='saveUser'
            :disable='disableCreateProfile'
            label='Add User'
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
          Please confirm that you want to remove user:
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedUser.email}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn label='Cancel' flat v-close-popup />
          <q-btn
            @click='deleteUser'
            label='Delete User'
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
          Please confirm that you want to remove all the selected users:
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(u => u.email).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn label='Cancel' flat v-close-popup />
          <q-btn
            @click='deleteUsers'
            label='Delete Users'
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
import {
  required,
  email,
  minLength,
  maxLength,
  helpers
} from '@vuelidate/validators';
const alpha = helpers.regex('alpha', /^[a-zA-Z0-9 ]*$/);
import { date } from 'quasar';

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
      rolesFilter: ref([]),
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left'
        },
        {
          name: 'email',
          align: 'left',
          label: 'Email',
          field: 'email',
          sortable: true
        },
        {
          name: 'institution',
          align: 'left',
          label: 'Institution',
          field: 'institution',
          sortable: true
        },
        {
          name: 'status',
          align: 'left',
          label: 'Status',
          field: 'isVerified',
          format: val => {
            if (val) {
              return `Confirmed`;
            } else return `Pending`;
          },
          sortable: false
        },
        {
          name: 'role',
          align: 'left',
          label: 'Role',
          field: 'role',
          sortable: false
        },
        {
          name: 'lastLoggedIn',
          align: 'left',
          label: 'Last Seen',
          field: 'lastLoggedIn',
          sortable: true,
          format: val =>
            `${val ? date.formatDate(val, 'DD MMM YY HH:mm A') : 'Unknown'}`
        },
        {
          name: 'action',
          align: 'left',
          label: 'Action'
        }
      ]
    }
  },
  data() {
    return {
      roles: ['guest', 'interviewer', 'manager', 'administrator', 'inactive'],
      rolesOptions: [
        {label: 'Guest', value: 'guest'}, 
        {label: 'Interviewer', value: 'interviewer'}, 
        {label: 'Manager', value: 'manager'}, 
        {label: 'Administrator', value: 'administrator'}, 
        {label: 'Inactive', value: 'inactive'}],
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
        role: ''
      },
      newProfileData: {
        firstname: '',
        lastname: '',
        institution: '',
        city: '',
        title:'',
        phone: '',
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
        role : 'guest'
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
