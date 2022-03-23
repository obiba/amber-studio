<template>
  <q-page>
    <div class="q-pa-md" :class="settings.theme.header2">
      <q-breadcrumbs class="q-mt-sm">
        <q-breadcrumbs-el icon="groups" :label="$t('groups.title')" />
      </q-breadcrumbs>
    </div>
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
        <q-btn
          color="primary"
          icon="add"
          :title="$t('groups.add_group_hint')"
          @click="createGroup()"
          class="q-mr-md" />
        <q-btn
          class="q-mr-md"
          flat
          round
          color="negative"
          icon="delete_outline"
          :disable="selected.length === 0"
          :title="$t('groups.delete_groups_hint')"
          @click="confirmDeleteGroups()" />
        <q-space />
        <q-input
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
      <template v-slot:body-cell-name='props'>
        <q-td :props='props'>
          <router-link :to="'/group/' + props.row._id">{{ props.row.name }}</router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-description='props'>
        <q-td :props='props'>
          <div style="white-space: normal">
            {{ makeEllipsis(props.row.description, 100) }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-members='props'>
        <q-td :props='props'>
          <q-badge v-if="props.row.users.length>0" color="info">
            {{ props.row.users.length }}
          </q-badge>
          <span v-else>0</span>
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
            :title="$t('groups.edit_group_hint')"
            icon='edit'
            :to="'/group/' + props.row._id">
          </q-btn>
          <q-btn
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('groups.delete_group_hint')"
            icon='delete'
            @click='confirmDeleteGroup(props.row)'>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model='showCreateGroup' persistent>
      <q-card>
        <q-card-section class='row items-center'>
           <div class='col-12'>
            <q-input
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
import { mapState, mapActions } from 'vuex'
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../boot/vuelidate'
import { settings } from '../boot/settings'

export default {
  mounted: function () {
    this.getTableGroups()
    this.setPagination()
  },
  setup () {
    return {
      v$: useVuelidate(),
      selected: ref([]),
      filter: ref(''),
      settings
    }
  },
  data () {
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
          name: 'members',
          align: 'left',
          label: this.$t('members'),
          field: 'users',
          format: val => {
            return val ? val.length : 0
          },
          sortable: false
        },
        {
          name: 'action',
          align: 'left',
          label: this.$t('action')
        }
      ],
      selectedGroup: {},
      showCreateGroup: false,
      showConfirmDeleteGroup: false,
      showConfirmDeleteGroups: false,
      paginationOpts: {
        sortBy: 'name',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      groupData: {
        name: '',
        description: ''
      },
      newGroupData: {
        name: '',
        description: ''
      }
    }
  },
  validations: {
    newGroupData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      description: {
        minLength: minLength(2),
        maxLength: maxLength(500)
      }
    }
  },
  computed: {
    ...mapState({
      groups: state => state.admin.groups
    }),
    disableCreateGroup () {
      return this.v$.newGroupData.$invalid
    }
  },
  methods: {
    makeEllipsis (text, length) {
      if (text && text.length > length) {
        return text.substring(0, length) + ' ...'
      }
      return text
    },
    setPagination () {
      this.paginationOpts = this.$store.state.admin.groupPaginationOpts
    },
    async getTableGroups (requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination
        this.$store.commit('admin/setGroupPagination', {
          groupPaginationOpts: requestProp.pagination
        })
        await this.getGroups({ paginationOpts: requestProp.pagination, filter: requestProp.filter })
      } else {
        await this.getGroups({ paginationOpts: this.paginationOpts, filter: this.filter })
      }
      this.paginationOpts.rowsNumber = this.$store.state.admin.groupPaginationOpts.rowsNumber
    },
    ...mapActions({
      getGroups: 'admin/getGroups'
    }),
    createGroup () {
      this.newGroupData = {}
      this.showCreateGroup = true
      this.selectedGroup = undefined
    },
    confirmDeleteGroup (group) {
      this.showConfirmDeleteGroup = true
      this.selectedGroup = group
    },
    confirmDeleteGroups () {
      if (this.selected.length > 0) {
        this.showConfirmDeleteGroups = true
      }
    },
    async saveGroup () {
      this.v$.$reset()
      // create
      const createdData = { ...this.newGroupData }
      this.$store.dispatch('admin/createGroup', {
        group: createdData,
        paginationOpts: this.paginationOpts
      })
    },
    deleteGroup () {
      this.$store.dispatch('admin/deleteGroup', {
        id: this.selectedGroup._id,
        paginationOpts: this.paginationOpts
      })
    },
    deleteGroups () {
      const ids = this.selected.map(u => u._id)
      this.$store.dispatch('admin/deleteGroups', {
        ids: ids,
        paginationOpts: this.paginationOpts
      })
      this.selected = []
    }
  }
}
</script>
