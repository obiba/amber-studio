<template>
  <q-page class='q-pa-sm bg-white'>
    <div class='text-h6 q-ma-md'>{{$t('groups.title')}}</div>
    <q-separator/>
     
    <q-table
        flat
        :rows='groups'
        :columns='columns'
        :filter='filter'
        row-key='name'
        selection="multiple"
        v-model:selected="selected"
        v-model:pagination='paginationOpts'
        @request='getTableGroups'
      >
      <template v-slot:top>
        <q-btn color="primary" :label="$t('groups.add_group')" :title="$t('groups.add_group_hint')" @click="createGroup()" class="q-mr-md" />
        <q-btn color="primary" :disable="selected.length === 0" :label="$t('groups.delete_groups')" :title="$t('groups.delete_groups_hint')" @click="confirmDeleteGroups()" />
        <q-space />
        <q-input 
          filled 
          borderless 
          dense 
          debounce="300" 
          v-model="filter" 
          :placeholder="$t('search')"
          :title="$t('groups.search_hint')">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-description='props'>
        <q-td :props='props'>
          <div style="white-space: normal">
            {{ props.row.description }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-action='props'>
        <q-td :props='props'>
          <q-btn
            size='sm'
            class='q-pa-xs q-mx-xs'
            color='primary'
            :title="$t('groups.edit_group_hint')"
            icon='edit'
            @click='updateGroup(props.row)'>
          </q-btn>
          <q-btn
            size='sm'
            class='q-pa-xs q-mx-xs'
            color='red'
            :title="$t('groups.delete_group_hint')"
            icon='delete_outline'
            @click='confirmDeleteGroup(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model='showEditGroup' persistent>
      <q-card>
        <q-card-section class='row items-center'>
          <div class='col-12'>
            <q-input
              filled
              v-model='groupData.name'
              :label="$t('name')"
              lazy-rules
              class='q-ma-sm'
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
          <div class='col-12'>
            <q-input
              filled
              v-model='groupData.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              class='q-ma-sm'
            />
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveGroup'
            :disable='disableUpdateGroup'
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

    <q-dialog v-model='showCreateGroup' persistent>
      <q-card>
        <q-card-section class='row items-center'>
           <div class='col-12'>
            <q-input
              filled
              v-model='newGroupData.name'
              :label="$t('name')"
              lazy-rules
              class='q-ma-sm'
              @blur="v$.newGroupData.name.$touch"
              :error="v$.newGroupData.name.$error"
              :hint="$t('required')"
            >
              <template v-slot:error>
                <div v-for="error in v$.newGroupData.name.$errors">
                  {{error.$message}}
                </div>
              </template>
            </q-input>
          </div>
          <div class='col-12'>
            <q-input
              filled
              v-model='newGroupData.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              class='q-ma-sm'
            />
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveGroup'
            :disable='disableCreateGroup'
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

    <q-dialog v-model='showConfirmDeleteGroup' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('groups.delete_group_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selectedGroup.name}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteGroup'
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

    <q-dialog v-model='showConfirmDeleteGroups' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('groups.delete_groups_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => g.name).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteGroups'
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

export default {
  mounted: function() {
    this.getTableGroups();
    this.setPagination();
  },
  setup() {
    return {
      v$: useVuelidate(),
      selected: ref([]),
      filter: ref('')
    }
  },
  data() {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          label: this.$t('name'),
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'description',
          align: 'left',
          label: this.$t('description'),
          field: 'description',
          sortable: true
        },
        {
          name: 'action',
          align: 'left',
          label: this.$t('action'),
        }
      ],
      selectedGroup: {},
      showEditGroup: false,
      showCreateGroup: false,
      showConfirmDeleteGroup: false,
      showConfirmDeleteGroups: false,
      paginationOpts: {
        sortBy: 'name',
        descending: true,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10
      },
      groupData: {
        name: '',
        description: '',
      },
      newGroupData: {
        name: '',
        description: '',
      }
    };
  },
  validations: {
    groupData: {
      name: {
        //alpha,
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      description: {
        //alpha,
        minLength: minLength(2),
        maxLength: maxLength(500)
      }
    },
    newGroupData: {
      name: {
        //alpha,
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      description: {
        //alpha,
        minLength: minLength(2),
        maxLength: maxLength(500)
      }
    }
  },
  computed: {
    ...mapState({
      groups: state => state.admin.groups
    }),
    disableUpdateGroup() {
      return this.v$.groupData.$invalid;
    },
    disableCreateGroup() {
      return this.v$.newGroupData.$invalid;
    }
  },
  methods: {
    setPagination() {
      this.paginationOpts = this.$store.state.admin.groupPaginationOpts;
    },
    async getTableGroups(requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination;
        this.$store.commit('admin/setGroupPagination', {
          groupPaginationOpts: requestProp.pagination
        });
        await this.getGroups({ paginationOpts: requestProp.pagination, filter: requestProp.filter });
      } else {
        await this.getGroups({ paginationOpts: this.paginationOpts, filter: this.filter });
      }
      this.paginationOpts.rowsNumber = this.$store.state.admin.groupPaginationOpts.rowsNumber;
    },
    ...mapActions({
      getGroups: 'admin/getGroups'
    }),
    createGroup() {
      this.newGroupData = {};
      this.showCreateGroup = true;
      this.selectedGroup = undefined;
    },
    updateGroup(group) {
      this.groupData.name = group.name;
      this.groupData.description = group.description;
      this.showEditGroup = true;
      this.selectedGroup = group;
    },
    confirmDeleteGroup(group) {
      this.showConfirmDeleteGroup = true;
      this.selectedGroup = group;
    },
    confirmDeleteGroups() {
      if (this.selected.length>0) {
        this.showConfirmDeleteGroups = true;
      }
    },
    async saveGroup() {
      this.v$.$reset();
      if (this.selectedGroup) {
        // update
        let updatedData = { ...this.groupData };
        this.$store.dispatch('admin/updateGroup', {
          group: updatedData,
          id: this.selectedGroup._id,
          paginationOpts: this.paginationOpts
        });
      } else {
        // create
        let createdData = { ...this.newGroupData };
        this.$store.dispatch('admin/createGroup', {
          group: createdData,
          paginationOpts: this.paginationOpts
        });
      }
    },
    deleteGroup() {
      this.$store.dispatch('admin/deleteGroup', {
        id: this.selectedGroup._id,
        paginationOpts: this.paginationOpts
      });
    },
    deleteGroups() {
      const ids = this.selected.map(u => u._id);
      this.$store.dispatch('admin/deleteGroups', {
        ids: ids,
        paginationOpts: this.paginationOpts
      });
      this.selected = [];
    }
  }
};
</script>

<style scoped>

</style>
