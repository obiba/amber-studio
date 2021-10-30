<template>
  <q-page>
    <div class="text-h6 text-white bg-info q-pa-md">{{$t('users.title')}}</div>
    <q-separator/>
     
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
        <q-btn
          color="primary"
          icon="add"
          :title="$t('users.add_user_hint')"
          @click="createUser()"
          class="q-mr-md" />
        <q-btn
          class="q-mr-md"
          flat
          round
          color="black"
          icon="groups"
          :disable="selected.length === 0"
          :title="$t('users.group_users_hint')"
          @click="confirmGroupUsers()" />
        <q-btn
          class="q-mr-md"
          flat
          round
          color="red"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="$t('users.delete_users_hint')"
          @click="confirmDeleteUsers()" />
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
        <q-input 
          filled 
          borderless 
          dense 
          debounce="300" 
          v-model="filter" 
          :placeholder="$t('search')"
          :title="$t('users.search_hint')">
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
      <template v-slot:body-cell-email='props'>
        <q-td :props='props'>
          <router-link :to="'/user/' + props.row._id">{{ props.row.email }}</router-link>
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
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('users.edit_user_hint')"
            icon='edit'
            :to="'/user/' + props.row._id">
          </q-btn>
          <q-btn
            v-if='!props.row.isVerified'
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('users.resend_email_hint')"
            icon='send'
            @click='resendEmailVerification(props.row.email)'>
          </q-btn>
          <q-btn
            v-if='props.row.isVerified'
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('users.reset_password_hint')"
            icon='replay'
            @click='resetPassword(props.row.email)'>
          </q-btn>
          <q-btn
            v-if='props.row.role === "inactive"'
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('users.activate_user_hint')"
            icon='do_not_disturb_off'
            @click='activeateUser(props.row)'>
          </q-btn>
          <q-btn
            v-if='!(props.row.role === "inactive")'
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('users.deactivate_user_hint')"
            icon='do_not_disturb_on'
            @click='deactiveateUser(props.row)'>
          </q-btn>
          <q-btn
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('users.delete_user_hint')"
            icon='delete'
            @click='confirmDeleteUser(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

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

    <q-dialog v-model='showConfirmGroupUsers' persistent>
      <q-card>
        <q-card-section>
          <div>
            <q-select
              class='q-ma-sm'
              v-model='selectedGroup'
              :options='groupsOptions'
              :label="$t('group.title')"
              :hint="$t('users.group_add_hint')"
              filled
              use-input
              map-options
              options-dense
              @filter="filterGroupsOptions"
              style="min-width: 350px"
            >
            </q-select>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='groupUsers'
            :label="$t('apply')"
            :disable='disableGroupUsers'
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
    this.initGroups();
  },
  setup() {
    return {
      v$: useVuelidate(),
      selected: ref([]),
      filter: ref(''),
      rolesFilter: ref([]),
      selectedGroup: ref(null),
    }
  },
  data() {
    return {
      roles: ['guest', 'interviewer', 'manager', 'administrator', 'inactive'],
      allGroupsOptions: [],
      groupsOptions: [],
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
      showConfirmGroupUsers: false,
      paginationOpts: {
        sortBy: 'lastLoggedIn',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
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
      users: state => state.admin.users,
      groups: state => state.admin.groups
    }),
    disableCreateProfile() {
      return this.v$.newProfileData.$invalid;
    },
    disableGroupUsers() {
      return this.selectedGroup === null;
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
    async initGroups() {
      await this.getGroups({paginationOpts: {
        rowsPerPage: 0,
        page: 1,
        sortBy: 'name',
        descending: -1
      }});
      this.allGroupsOptions = this.groups ? this.groups.map(g => {
        return {
          value: g._id,
          label: g.name,
          object: g
        }
      }) : [];
      this.groupsOptions = this.allGroupsOptions;
    },
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
      getUsers: 'admin/getUsers',
      getGroups: 'admin/getGroups',
      updateGroup: 'admin/updateGroup'
    }),
    createUser() {
      this.newProfileData = {
        language: locales[0],
        role: 'guest'
      };
      this.showCreateUser = true;
      this.selectedUser = undefined;
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
    confirmGroupUsers() {
      this.selectedGroup = null;
      if (this.selected.length>0) {
        this.showConfirmGroupUsers = true;
      }
    },
    resendEmailVerification(email) {
      this.$store.dispatch('account/resendVerification', {
        email: email
      });
    },
    async saveUser() {
      this.v$.$reset();
      // create
      let userData = { ...this.newProfileData };
      this.$store.dispatch('admin/createUser', {
        user: userData,
        paginationOpts: this.paginationOpts
      });
    },
    resetPassword(email) {
      this.$store
        .dispatch('account/forgotPassword', {
          emailAddress: email
        });
    },
    deleteUser() {
      this.$store.dispatch('admin/deleteUser', {
        id: this.selectedUser._id,
        paginationOpts: this.paginationOpts
      });
    },
    deleteUsers() {
      const ids = this.selected.map(u => u._id);
      this.$store.dispatch('admin/deleteUsers', {
        ids: ids,
        paginationOpts: this.paginationOpts
      });
      this.selected = [];
    },
    groupUsers() {
      const toSave = {...this.selectedGroup.object};
      toSave.users = [...this.selectedGroup.object.users];
      if (!toSave.users || toSave.users.length === 0) {
        toSave.users = this.selected.map(u => u._id);
      } else {
        this.selected.filter(u => !toSave.users.includes(u._id)).forEach(u => toSave.users.push(u._id));
      }
      this.updateGroup({
        group: toSave
      });
    },
    copyUserProfile(user) {
      return {
        firstname: user.firstname,
        lastname: user.lastname,
        city: user.city,
        institution: user.institution,
        title: user.title,
        phone: user.phone,
        language: user.language,
        role: user.role
      };
    },
    async activeateUser(user) {
      const profileData = this.copyUserProfile(user);
      profileData.role = 'guest';
      this.$store.dispatch('admin/updateUser', {
        user: profileData,
        id: user._id,
        paginationOpts: this.paginationOpts
      });
    },
    async deactiveateUser(user) {
      const profileData = this.copyUserProfile(user);
      profileData.role = 'inactive';
      this.$store.dispatch('admin/updateUser', {
        user: profileData,
        id: user._id,
        paginationOpts: this.paginationOpts
      });
    },
    filterGroupsOptions (val, update) {
      update(() => {
        if (val === '') {
          this.groupsOptions = this.allGroupsOptions;
        }
        else {
          const needle = val.toLowerCase()
          this.groupsOptions = this.allGroupsOptions.filter(
            g => g.label.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    }
  }
};
</script>

<style scoped>

</style>
