<template>
  <div v-cloak>

    <q-card class="q-ma-md"
          v-if="hasStudyInterviewDesigns">
      <q-card-section>
        <q-table
          flat
          :rows="studyInterviewDesigns"
          :columns="columns"
          :filter="filter"
          row-key="_id"
          :selection="isReadOnly ? 'none' : 'multiple'"
          v-model:selected="selected"
          v-model:pagination='paginationOpts'
          @request='getTableStudyInterviewDesigns'
        >
          <template v-slot:top>
            <q-btn
              v-if="!isReadOnly"
              color="primary"
              icon="add"
              :title="$t('study.add_interview_design_hint')"
              @click="onAdd()"
              class="q-mr-md" />
            <q-btn
              v-if="!isReadOnly"
              class="q-mr-md"
              flat
              round
              color="negative"
              icon="delete_outline"
              :disable="selected.length === 0"
              :title="$t('study.delete_interview_designs_hint')"
              @click="onConfirmDeleteMultiple()" />
            <q-space />
            <q-input
              dense
              debounce="300"
              v-model="filter"
              :placeholder="$t('search')"
              :title="$t('study.search_interview_design_hint')">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-name='props'>
            <q-td :props='props'>
              <router-link :to="'/study/' + studyId + '/interview-design/' + props.row._id">{{ props.row.name }}</router-link>
            </q-td>
          </template>
          <template v-slot:body-cell-steps='props'>
            <q-td :props='props'>
              {{ props.row.steps ? props.row.steps.length : 0 }}
            </q-td>
          </template>
          <template v-slot:body-cell-permissions='props'>
            <q-td :props='props'>
              <div v-if="props.row.permissions">
                <q-chip v-for="id in props.row.permissions.users" icon="person" size="sm" :label="getSubject(id, 'user').name" :key="id"/>
                <q-chip v-for="id in props.row.permissions.groups" icon="people" size="sm" :label="getSubject(id, 'group').name" :key="id"/>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-repeatPolicy='props'>
            <q-td :props='props'>
              {{ props.row.repeatPolicy ? $t('study.interview_design_repeat_policy.' + props.row.repeatPolicy) : '?' }}
            </q-td>
          </template>
          <template v-slot:body-cell-state='props'>
            <q-td :props='props'>
              {{ $t('study.interview_design_state.' + props.row.state) }}
              <q-icon v-if="props.row.permissions" name="lock"/>
            </q-td>
          </template>
          <template v-slot:body-cell-action='props'>
            <q-td :props='props'>
              <q-btn
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="$t('study.edit_interview_design_hint')"
                icon="edit"
                @click='onEdit(props.row)'>
              </q-btn>
              <q-btn
                v-if="props.row.state === 'paused'"
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="$t('study.start_interview_design_hint')"
                icon="play_arrow"
                @click='start(props.row)'>
              </q-btn>
              <q-btn
                v-if="props.row.state === 'active'"
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="$t('study.pause_interview_design_hint')"
                icon="pause"
                @click='pause(props.row)'>
              </q-btn>
              <q-btn
                color="secondary"
                size="12px"
                flat
                dense
                round
                :title="$t('study.delete_interview_design_hint')"
                icon="delete"
                @click='onConfirmDelete(props.row)'>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-btn
      v-else-if="!isReadOnly"
      color="primary"
      icon="add"
      :label="$t('study.add_interview_design_hint')"
      @click="onAdd()"
      class="q-ma-md" />

    <q-dialog v-model='showCreateStudyInterviewDesign' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='newStudyInterviewDesignData.name'
            :label="$t('name')"
            lazy-rules
            @blur="v$.newStudyInterviewDesignData.name.$touch"
            :error="v$.newStudyInterviewDesignData.name.$error"
            :hint="$t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.newStudyInterviewDesignData.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='newStudyInterviewDesignData.description'
            :label="$t('description')"
            autogrow
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="newStudyInterviewDesignData.repeatPolicy"
            :options="repeatOptions"
            emit-value
            map-options
            :label="$t('study.interview_design_repeat_policy.title')"
            :hint="$t('study.interview_design_repeat_policy.hint')" />
        </q-card-section>
        <q-card-section>
          <q-toggle
            class="q-mt-md"
            v-model="newStudyInterviewDesignData.restrictedAccess"
            :label="$t('restricted_access')"
          />
          <q-select
            v-if="newStudyInterviewDesignData.restrictedAccess"
            v-model="newStudyInterviewDesignData.permissions.users"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="$t('study.interview_design_permitted_users')" />
          <q-select
            v-if="newStudyInterviewDesignData.restrictedAccess"
            v-model="newStudyInterviewDesignData.permissions.groups"
            :options="groupSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="$t('study.interview_design_permitted_groups')" />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveStudyInterviewDesign(true)'
            :disable='disableCreateStudyInterviewDesign'
            :label="$t('add')"
            type='submit'
            color='primary'
            v-close-popup
          >
           <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showEditStudyInterviewDesign' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='selectedStudyInterviewDesign.name'
            :label="$t('name')"
            lazy-rules
            @blur="v$.selectedStudyInterviewDesign.name.$touch"
            :error="v$.selectedStudyInterviewDesign.name.$error"
            :hint="$t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.selectedStudyInterviewDesign.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='selectedStudyInterviewDesign.description'
            :label="$t('description')"
            autogrow
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="selectedStudyInterviewDesign.repeatPolicy"
            :options="repeatOptions"
            emit-value
            map-options
            :label="$t('study.interview_design_repeat_policy.title')"
            :hint="$t('study.interview_design_repeat_policy.hint')" />
        </q-card-section>
        <q-card-section>
          <q-toggle
            class="q-mt-md"
            v-model="selectedStudyInterviewDesign.restrictedAccess"
            :label="$t('restricted_access')"
          />
          <q-select
            v-if="selectedStudyInterviewDesign.restrictedAccess"
            v-model="selectedStudyInterviewDesign.permissions.users"
            :options="userSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="$t('study.interview_design_permitted_users')" />
          <q-select
            v-if="selectedStudyInterviewDesign.restrictedAccess"
            v-model="selectedStudyInterviewDesign.permissions.groups"
            :options="groupSubjectOptions"
            emit-value
            map-options
            multiple
            use-chips
            :label="$t('study.interview_design_permitted_groups')" />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='saveStudyInterviewDesign(false)'
            :disable='disableEditStudyInterviewDesign'
            :label="$t('update')"
            type='submit'
            color='primary'
            v-close-popup
          >
           <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteStudyInterviewDesign' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_interview_design_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ selectedStudyInterviewDesign.name }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyInterviewDesign'
            :label="$t('delete')"
            type='submit'
            color='primary'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteStudyInterviewDesigns' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('study.delete_interview_designs_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{selected.map(g => g.name).join(', ')}}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStudyInterviewDesigns'
            :label="$t('delete')"
            type='submit'
            color='primary'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { t } from '../../boot/i18n'
import { date } from 'quasar'
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { subjectsService } from '../../services/utils'
import AuthMixin from '../../mixins/AuthMixin'

export default defineComponent({
  name: 'StudyInterviewDesigns',
  mixins: [AuthMixin],
  mounted: function () {
    this.setPagination()
    if (this.studyId) {
      this.getTableStudyInterviewDesigns()
    }
    subjectsService.getSubjects().then((result) => {
      this.subjects = result
    })
  },
  setup () {
    return {
      v$: useVuelidate(),
      tab: ref('definition'),
      selected: ref([]),
      filter: ref('')
    }
  },
  data () {
    return {
      newStudyInterviewDesignData: {
        name: '',
        description: '',
        repeatPolicy: 'multiple'
      },
      selectedStudyInterviewDesign: {},
      showCreateStudyInterviewDesign: false,
      showEditStudyInterviewDesign: false,
      showConfirmDeleteStudyInterviewDesign: false,
      showConfirmDeleteStudyInterviewDesigns: false,
      paginationOpts: {
        sortBy: 'updatedAt',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      subjects: []
    }
  },
  validations: {
    newStudyInterviewDesignData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    },
    selectedStudyInterviewDesign: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    }
  },
  computed: {
    ...mapState({
      study: state => state.study.study,
      studyInterviewDesigns: state => state.interview ? state.interview.interviewDesigns : []
    }),
    studyId () {
      return this.$route.params.id
    },
    columns () {
      const cols = [
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
          name: 'steps',
          align: 'left',
          label: this.$t('interview.steps'),
          field: 'steps',
          sortable: true
        },
        {
          name: 'repeatPolicy',
          align: 'left',
          label: this.$t('study.interview_design_repeat_policy.title'),
          field: 'repeatPolicy',
          sortable: true
        },
        {
          name: 'updatedAt',
          align: 'left',
          label: this.$t('updated_at'),
          field: 'updatedAt',
          sortable: true,
          format: val =>
            `${val ? date.formatDate(val, 'YYYY-MM-DD HH:mm:ss') : this.$t('unknown')}`
        }
      ]
      if (this.subjects && this.subjects.length > 0) {
        cols.push({
          name: 'permissions',
          align: 'left',
          label: this.$t('restricted_access'),
          field: 'permissions',
          sortable: false
        })
      }
      cols.push({
        name: 'state',
        align: 'left',
        label: this.$t('state'),
        field: 'state',
        sortable: true
      })
      if (!this.isReadOnly) {
        cols.push({
          name: 'action',
          align: 'left',
          label: this.$t('action')
        })
      }
      return cols
    },
    repeatOptions () {
      return [
        'multiple', 'single_reject', 'single_update'
      ].map(opt => {
        return {
          value: opt,
          label: this.$t('study.interview_design_repeat_policy.' + opt)
        }
      })
    },
    userSubjectOptions () {
      return this.getSubjectOptions('user')
    },
    groupSubjectOptions () {
      return this.getSubjectOptions('group')
    },
    disableCreateStudyInterviewDesign () {
      return this.v$.newStudyInterviewDesignData.$invalid
    },
    disableEditStudyInterviewDesign () {
      return this.v$.selectedStudyInterviewDesign.$invalid
    },
    hasStudyInterviewDesigns () {
      return this.studyInterviewDesigns && this.studyInterviewDesigns.length > 0
    }
  },
  watch: {
    study: function (newValue, oldValue) {
      this.getTableStudyInterviewDesigns()
    }
  },
  methods: {
    ...mapActions({
      getStudyInterviewDesigns: 'interview/getInterviewDesigns',
      createStudyInterviewDesign: 'interview/createInterviewDesign',
      updateStudyInterviewDesign: 'interview/updateInterviewDesign'
    }),
    onAdd () {
      this.newStudyInterviewDesignData = {
        name: '',
        description: '',
        repeatPolicy: 'multiple',
        restrictedAccess: false,
        permissions: {
          users: [],
          groups: []
        }
      }
      this.showCreateStudyInterviewDesign = true
      this.selectedStudyInterviewDesign = undefined
    },
    onEdit (studyInterviewDesign) {
      this.selectedStudyInterviewDesign = { ...studyInterviewDesign }
      this.selectedStudyInterviewDesign.permissions = {
        users: studyInterviewDesign.permissions && studyInterviewDesign.permissions.users ? studyInterviewDesign.permissions.users : [],
        groups: studyInterviewDesign.permissions && studyInterviewDesign.permissions.groups ? studyInterviewDesign.permissions.groups : []
      }
      this.selectedStudyInterviewDesign.restrictedAccess = this.selectedStudyInterviewDesign.permissions.users.length > 0 || this.selectedStudyInterviewDesign.permissions.groups.length > 0
      this.showEditStudyInterviewDesign = true
    },
    onConfirmDelete (studyInterviewDesign) {
      this.showConfirmDeleteStudyInterviewDesign = true
      this.selectedStudyInterviewDesign = studyInterviewDesign
    },
    onConfirmDeleteMultiple () {
      if (this.selected.length > 0) {
        this.showConfirmDeleteStudyInterviewDesigns = true
      }
    },
    getSubject (id, type) {
      if (this.subjects && this.subjects.length > 0) {
        return this.subjects.filter(s => s.type === type && s.id === id).pop()
      }
      return { id: id, type: type, name: '?' }
    },
    getSubjectOptions (type) {
      return this.subjects.filter(s => s.type === type).map(s => {
        return {
          value: s.id,
          label: s.name
        }
      })
    },
    async getTableStudyInterviewDesigns (requestProp) {
      if (requestProp) {
        this.paginationOpts = requestProp.pagination
        this.$store.commit('interview/setInterviewDesignPagination', {
          interviewDesignPaginationOpts: requestProp.pagination
        })
        await this.getStudyInterviewDesigns({ paginationOpts: requestProp.pagination, study: this.studyId, filter: requestProp.filter })
      } else {
        await this.getStudyInterviewDesigns({ paginationOpts: this.paginationOpts, study: this.studyId, filter: this.filter })
      }
      this.paginationOpts.rowsNumber = this.$store.state.interview.interviewDesignPaginationOpts.rowsNumber
    },
    setPagination () {
      this.paginationOpts = this.$store.state.interview.interviewDesignPaginationOpts
    },
    start (studyInterviewDesign) {
      this.setState(studyInterviewDesign, 'active')
    },
    pause (studyInterviewDesign) {
      this.setState(studyInterviewDesign, 'paused')
    },
    setState (studyInterviewDesign, state) {
      const toSave = { ...studyInterviewDesign }
      toSave.state = state
      this.updateStudyInterviewDesign({
        interviewDesign: toSave,
        paginationOpts: this.paginationOpts
      })
    },
    deleteStudyInterviewDesign () {
      this.$store.dispatch('interview/deleteInterviewDesign', {
        id: this.selectedStudyInterviewDesign._id,
        study: this.studyId,
        paginationOpts: this.paginationOpts
      })
    },
    deleteStudyInterviewDesigns () {
      const ids = this.selected.map(u => u._id)
      this.$store.dispatch('interview/deleteInterviewDesigns', {
        ids: ids,
        study: this.studyId,
        paginationOpts: this.paginationOpts
      })
      this.selected = []
    },
    async saveStudyInterviewDesign (create) {
      this.v$.$reset()
      if (create) {
        const toSave = { ...this.newStudyInterviewDesignData }
        toSave.study = this.studyId
        if (toSave.restrictedAccess) {
          // empty permissions means it is not a restricted access
          if (toSave.permissions.users.length === 0 && toSave.permissions.groups.length === 0) {
            toSave.permissions = null
          }
        } else {
          toSave.permissions = null
        }
        this.createStudyInterviewDesign({
          interviewDesign: toSave
        })
      } else {
        const toSave = { ...this.selectedStudyInterviewDesign }
        if (this.selectedStudyInterviewDesign.restrictedAccess) {
          // empty permissions means it is not a restricted access
          if (this.selectedStudyInterviewDesign.permissions.users.length === 0 && this.selectedStudyInterviewDesign.permissions.groups.length === 0) {
            toSave.permissions = null
          }
        } else {
          toSave.permissions = null
        }
        delete toSave.restrictedAccess
        if (toSave.revision === t('study.latest_revision')) {
          delete toSave.revision
        }
        this.updateStudyInterviewDesign({
          interviewDesign: toSave,
          paginationOpts: this.paginationOpts
        })
      }
    }
  }
})
</script>
