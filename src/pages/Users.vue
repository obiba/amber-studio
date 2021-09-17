<template>
  <q-page class='q-pa-sm bg-white'>
    <div class='text-h6 q-ma-md'>Users</div>
    <q-separator/>

  <q-table
      flat
      :rows='users'
      :columns='columns'
      :filter='filter'
      row-key='name'
      v-model:pagination='paginationOpts'
      @request='getTableUsers'
    >
      <template v-slot:top-right>
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
          {{ props.row.permissions ? props.row.permissions[0] : '' }}
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
            v-if='props.row.permissions.includes("inactive")'
            size='sm'
            class='q-pa-xs q-mx-xs'
            color='green'
            title='Activate User'
            icon='do_not_disturb_off'
            @click='activeateUser(props.row)'>
          </q-btn>
          <q-btn
            v-if='!props.row.permissions.includes("inactive")'
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
            @click='deactiveateUser(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model='showEditUser' persistent>
      <q-card>
        <q-card-section class='row items-center'>
          <div class='col-12 col-md-6'>
            <q-input
              filled
              v-model='profileData.firstname'
              label='First Name'
              label-color='accent'
              hint='Given Name'
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon color='accent' name='fas fa-user' size='xs' />
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              filled
              v-model='profileData.lastname'
              label='Family Name'
              label-color='accent'
              hint='Surname'
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon color='accent' name='fas fa-user' size='xs' />
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              filled
              v-model='profileData.institution'
              label='Institution'
              label-color='accent'
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon color='accent' name='fas fa-building' size='xs' />
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              filled
              v-model='profileData.city'
              label='City'
              label-color='accent'
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon color='accent' name='fas fa-city' size='xs' />
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              filled
              v-model='profileData.title'
              label='Title'
              label-color='accent'
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon color='accent' name='fas fa-user-tie' size='xs' />
              </template>
            </q-input>
          </div>
          <div class='col-12 col-md-6'>
            <q-input
              filled
              v-model='profileData.phone'
              label='Phone'
              label-color='accent'
              lazy-rules
              class='q-ma-sm'
            >
              <template v-slot:prepend>
                <q-icon color='accent' name='fas fa-phone' size='xs' />
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
            @click='saveUpdatedUser'
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

  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {ref} from 'vue';
import {
  required,
  email,
  minLength,
  maxLength,
  sameAs,
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
      filter: ref(''),
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
          field: 'permissions',
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
      selectedUser: {},
      showEditUser: false,
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
      }
    };
  },
  validations: {
    profileData: {
      firstname: {
        alpha,
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      lastname: {
        alpha,
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      institution: {
        alpha,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      city: {
        alpha,
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
      return false//this.$v.profileData.$invalid;
    }
  },
  methods: {
    setPagination() {
      this.paginationOpts = this.$store.state.admin.userPaginationOpts;
    },
    filterRows(rows, terms) {
      return rows.filter(row => row.email.toLowerCase().includes(terms.toLowerCase()))
    },
    async getTableUsers(requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination;
        this.$store.commit('admin/setUserPagination', {
          userPaginationOpts: requestProp.pagination
        });
        await this.getUsers({ paginationOpts: requestProp.pagination, filter: requestProp.filter });
      } else {
        await this.getUsers({ paginationOpts: this.paginationOpts });
      }
      this.paginationOpts.rowsNumber = this.$store.state.admin.userPaginationOpts.rowsNumber;
    },
    ...mapActions({
      getUsers: 'admin/getUsers'
    }),
    updateUser(user) {
      this.profileData.firstname = user.firstname;
      this.profileData.lastname = user.lastname;
      this.profileData.city = user.city;
      this.profileData.institution = user.institution;
      this.profileData.title = user.title;
      this.profileData.phone = user.phone;
      this.profileData.role = user.permissions ? user.permissions[0] : '';
      this.showEditUser = true;
      this.selectedUser = user;
    },
    resendEmailVerification(email) {
      this.$store.dispatch('account/resendVerification', {
        email: email
      });
    },
    async saveUpdatedUser() {
      this.profileData.permissions = [this.profileData.role];
      let userData = { ...this.profileData };
      delete userData.role;
      this.$store.dispatch('account/updateUser', {
        user: userData,
        id: this.selectedUser._id,
        paginationOpts: this.paginationOpts
      });
    },
    resetPassword(email) {
      this.$store
        .dispatch('account/forgotPassword', {
          emailAddress: email
        });
    },
    async activeateUser(user) {
      this.profileData.firstname = user.firstname;
      this.profileData.lastname = user.lastname;
      this.profileData.city = user.city;
      this.profileData.institution = user.institution;
      this.profileData.title = user.title;
      this.profileData.phone = user.phone;
      this.profileData.permissions = ['guest'];
      let userData = { ...this.profileData };
      delete userData.role;
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
      this.profileData.permissions = ['inactive'];
      let userData = { ...this.profileData };
      delete userData.role;
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
