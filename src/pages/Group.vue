<template>
  <q-page class="q-pa-sm bg-white">
   <q-button
        to="/groups"
        icon="chevron_left"
        label="back"
      />
    <div class="text-h6 q-ma-md">
      <q-btn 
        to="/groups"
        color="white"
        text-color="black"
        flat
        :title="$t('groups.title')"
        icon="arrow_back_ios"/>
       <q-icon name="groups" size="md" class="q-mr-md"/> {{ group.name }}
    </div>
    <q-separator/>

    <div class="row">
      <div class="col-12 col-md-6 q-pa-sm">
        <div class="row">
          <div class='col-12'>
            <q-input
              filled
              v-model='groupData.name'
              :label="$t('name')"
              lazy-rules
              class='q-mb-sm'
              @blur="v$.groupData.name.$touch"
                  :error="v$.groupData.name.$error"
                  :hint="$t('required')"
                >
              <template v-slot:error>
                <div v-for="error in v$.groupData.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
        </div>
        <div class="row">
          <div class='col-12'>
            <q-input
              filled
              v-model='groupData.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              class='q-mb-sm'
            />
          </div>
        </div>  
      </div>

      <div class="col-12 col-md-6 q-pa-sm">
        <div>
          {{ $t('members')}}
        </div>
        <q-select
          :label="$t('group.search_users')"
          :hint="$t('group.search_users_hint')"
          :options="userOptions"
          v-model="selectedUserOptions"
          @filter="filterUserOptions"
          @update:model-value="addUserOption"
          fill-input
          hide-selected
          use-input
          class="q-mb-sm"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{$t('no_results')}}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-list v-if="groupData.users && groupData.users.length>0" bordered separator class="q-mb-sm">
          <q-item clickable v-ripple :key="user.email" v-for="user in groupData.users">
            <q-item-section>
              <q-item-label>{{user.email}}</q-item-label>
              <q-item-label caption>{{user.firstname}} {{user.lastname}}</q-item-label>
            </q-item-section>
            <q-item-section side >
               <q-btn
                class="gt-xs text-grey-8"
                size="12px"
                flat
                dense
                round
                icon='delete'
                @click="removeUser(user)">
          </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      
    </div>

    <q-btn
      @click='saveGroup'
      :disable='disableSaveGroup'
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
import { mapState, mapActions } from 'vuex';
import { defineComponent, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength, email } from '../boot/vuelidate';


export default defineComponent({
  mounted: function() {
    this.initGoupData()
  },
  setup() {
    const userOptions = ref([]);
    return {
      v$: useVuelidate(),
      userOptions,
    }
  },
  data() {
    return {
      groupData: {
        name: '',
        description: '',
        users: []
      },
      selectedUserOptions: ''
    }
  },
  validations: {
    groupData: {
      name: {
        //alpha,
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    }
  },
  computed: {
    ...mapState({
      filteredUsers: state => state.admin.users,
      group: state => state.admin.group,
      groupUsers: state => state.admin.groupUsers,
    }),
    currentGroup() {
      return this.$store.state.admin.group;
    },
    disableSaveGroup() {
      return this.v$.groupData.$invalid;
    }
  },
  methods: {
    ...mapActions({
      getUsers: 'admin/getUsers',
      getGroup: 'admin/getGroup',
      getGroupUsers: 'admin/getGroupUsers',
      updateGroup: 'admin/updateGroup'
    }),
    async initGoupData() {
      await this.getGroup({ id: this.$route.params.id });
      this.groupData = {...this.group};
      await this.getGroupUsers({ group: this.group });
      this.groupData.users = [...this.groupUsers];
    },
    async saveGroup() {
      this.v$.$reset();
      const toSave = {...this.groupData};
      toSave.users = this.groupData.users.map(u => u._id);
      this.updateGroup({
        group: toSave
      });
    },
    filterUserOptions(val, update, abort) {
      const filter = val.trim();
      if (filter.length<2) {
        // not enough type ahead
        update(() => {
          this.userOptions = [];
        });
        return
      }
      this.getUsers({
        paginationOpts: {
          sortBy :'email',
          rowsPerPage: 5,
          page: 1,
          descending: -1
        },
        filter: filter
      }).then(() => {
        update(() => {
          this.userOptions = this.filteredUsers.map(u => { 
            return {
              label: u.email,
              value: u._id,
              object: u 
            }
          })
        })
      });
    },
    addUserOption(value) {
      // add value if not present
      if (this.groupData.users.filter(u => u.email === value.object.email).length === 0) {
        this.groupData.users.push(value.object);
      }
      // FIXME: does not clear the select
      this.selectedUserOptions = '';
    },
    removeUser(user) {
      this.groupData.users = this.groupData.users.filter(u => u.email !== user.email);
    }
  }
})
</script>