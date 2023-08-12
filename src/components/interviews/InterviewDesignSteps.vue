<template>
  <div>
    <q-splitter
      v-if="steps.length>0"
      v-model="splitterModel">

      <template v-slot:before>
        <div class="q-ma-sm">
          <q-btn
            v-if="!isReadOnly"
            color="primary"
            size="10px"
            dense
            icon='add'
            :title="$t('interview.add_step_hint')"
            @click='onAddStep()'>
          </q-btn>
        </div>
        <q-separator/>
        <div>
          <q-list v-if="steps.length>0" separator>
            <template v-for="step in steps" :key="step._id">
              <q-item clickable :active="isStepActive(step)" active-class="bg-grey-4" @click="onStepSelection(step)">
                <q-item-section>
                  <q-item-label>{{ step.name }}</q-item-label>
                  <q-item-label caption>{{ step.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </div>
      </template>

      <template v-slot:after>
        <div v-if="selected" class="row">
          <div class="float-left text-h6 q-mt-sm q-ml-md">
            {{ selected?.name }}
          </div>
          <div class="q-mt-sm q-ml-md">
            <q-btn
              v-if="!isReadOnly"
              color="secondary"
              size="12px"
              flat
              dense
              round
              :title="$t('interview.move_up_step_hint')"
              icon="arrow_upward"
              @click='moveUpStep'>
            </q-btn>
            <q-btn
              v-if="!isReadOnly"
              color="secondary"
              size="12px"
              flat
              dense
              round
              :title="$t('interview.move_down_step_hint')"
              icon="arrow_downward"
              @click='moveDownStep'>
            </q-btn>
            <q-btn
              v-if="!isReadOnly"
              color="negative"
              size="12px"
              flat
              dense
              round
              :title="$t('interview.delete_step_hint')"
              icon="delete_outline"
              @click='onConfirmDeleteStep'>
            </q-btn>
          </div>
        </div>
        <q-separator/>
        <div v-if="selected" class="row q-ml-md q-mt-sm">
          <div class="col-12">
            <div class="text-weight-bold">{{ $t('interview.definition') }}</div>
          </div>
        </div>
        <div v-if="selected" class="row q-pa-md q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <q-input
              v-model='selected.name'
              :label="$t('name')"
              lazy-rules
              :hint="$t('interview.step_name_hint')"
              class="q-mb-md"
              :disable="isReadOnly"
            >
            </q-input>
          </div>
          <div class="col-md-6 col-sm-12">
            <q-select
              v-model="selected.form"
              :options="formOptions"
              emit-value
              map-options
              :label="$t('study.form')"
              :disable="isReadOnly" />
            <q-select
              v-model="selected.revision"
              :options="revisionOptions"
              emit-value
              map-options
              :label="$t('study.form_revision')"
              :disable="isReadOnly || !selected.form" />
          </div>
        </div>
        <div v-if="selected" class="row q-pa-md q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <q-input
              v-model='selected.label'
              :label="$t('title')"
              lazy-rules
              :hint="$t('required')"
              class="q-mb-md"
              :disable="isReadOnly"
            >
            </q-input>
            <q-input
              v-model='selected.description'
              :label="$t('description')"
              autogrow
              lazy-rules
              :disable="isReadOnly"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              v-model.number="selected.time_estimate"
              class="q-mb-md"
              type="number"
              :label="$t('interview.step_time_estimate')"
              :hint="$t('interview.step_time_estimate_hint')"
              :disable="isReadOnly" />
          </div>
        </div>
        <q-separator/>
        <div v-if="selected" class="row q-ml-md q-mt-sm">
          <div class="col-12">
            <div class="text-weight-bold">{{ $t('interview.step_rendering') }}</div>
          </div>
        </div>
        <div v-if="selected" class="row q-pa-md q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <q-input
              class="q-mb-md"
              v-model="selected.condition"
              lazy-rules
              :label="$t('interview.step_condition')"
              :hint="$t('interview.step_condition_hint')"
              :disable="isReadOnly" />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              class="q-mb-md"
              v-model="selected.disable"
              lazy-rules
              :label="$t('interview.step_disable')"
              :hint="$t('interview.step_disable_hint')"
              :disable="isReadOnly" />
          </div>
        </div>
        <div v-else class="q-ma-md text-grey-6">
          {{$t('interview.no_step_selected')}}
        </div>
      </template>

    </q-splitter>

    <q-btn
      v-else-if="!isReadOnly"
      color="primary"
      icon="add"
      :label="$t('interview.add_step_hint')"
      @click="onAddStep()"
      class="q-ma-md" />

    <q-dialog v-model='showAddStep' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='stepData.name'
            :label="$t('name')"
            lazy-rules
            @blur="v$.stepData.name.$touch"
            :error="v$.stepData.name.$error"
            :hint="$t('interview.step_name_hint')"
          >
            <template v-slot:error>
              <div v-for="error in v$.stepData.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='stepData.label'
            :label="$t('title')"
            lazy-rules
            @blur="v$.stepData.label.$touch"
            :error="v$.stepData.label.$error"
            :hint="$t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.stepData.label.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='stepData.description'
            :label="$t('description')"
            autogrow
            lazy-rules
          />
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="stepData.form"
            :options="formOptions"
            emit-value
            map-options
            :label="$t('study.form')" />
          <q-select
            v-model="stepData.revision"
            :options="revisionOptions"
            emit-value
            map-options
            :label="$t('study.form_revision')"
            :disable="!stepData.form" />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='addStep'
            :disable="disableSaveStep"
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

    <q-dialog v-model='showConfirmDeleteStep' persistent>
      <q-card>
        <q-card-section>
          <div>
            {{$t('interview.delete_step_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ selected.name }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStep'
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
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { t } from '../../boot/i18n'
import { formRevisionService } from '../../services/form'
import AuthMixin from '../../mixins/AuthMixin'

export default defineComponent({
  name: 'Steps',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  mixins: [AuthMixin],
  setup () {
    return {
      v$: useVuelidate(),
      splitterModel: ref(20),
      selected: ref(null),
      showConfirmDeleteStep: ref(false),
      showAddStep: ref(false),
      stepData: ref({}),
      revisionOptions: ref([])
    }
  },
  validations: {
    stepData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      },
      label: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    }
  },
  watch: {
    'stepData.form': function () {
      if (this.stepData.form) {
        this.updateRevisionOptions(this.stepData.form)
      } else {
        this.revisionOptions = []
      }
    },
    'selected.form': function () {
      if (this.selected?.form) {
        this.updateRevisionOptions(this.selected.form)
      } else {
        this.revisionOptions = []
      }
    }
  },
  mounted () {
    if (this.studyId) {
      this.getStudyForms({ study: this.studyId })
    }
  },
  computed: {
    ...mapState({
      forms: state => state.form.forms
    }),
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    },
    studyId () {
      return this.$route.params.id
    },
    formOptions () {
      return this.forms.map(form => {
        return {
          value: form._id,
          label: form.name
        }
      })
    },
    steps () {
      if (this.value && this.value.steps) {
        return this.value.steps
      }
      return []
    },
    disableSaveStep () {
      return this.v$.stepData.$invalid || !this.stepData.form || this.revisionOptions.length === 0
    }
  },
  methods: {
    ...mapActions({
      getStudyForms: 'form/getForms'
    }),
    updateRevisionOptions (form) {
      formRevisionService.getFormRevisionsDigest(this.studyId, form)
        .then((response) => {
          this.revisionOptions = response.data ? response.data.map(rev => {
            return { value: rev.revision, label: rev.revision }
          }) : []
          if (this.revisionOptions.length > 0) {
            this.revisionOptions.splice(0, 0, { value: null, label: t('study.latest_revision') })
          }
        })
    },
    isStepActive (step) {
      return this.selected?._id === step._id
    },
    onStepSelection (step) {
      if (this.selected?._id === step._id) {
        this.selected = null
      } else {
        this.selected = step
      }
    },
    onConfirmDeleteStep () {
      this.showConfirmDeleteStep = true
    },
    onAddStep () {
      this.stepData = {
        name: '',
        description: ''
      }
      this.showAddStep = true
    },
    addStep () {
      this.value.steps.push(this.stepData)
    },
    moveUpStep () {
      const idx = this.value.steps.indexOf(this.selected)
      if (idx > 0) {
        this.value.steps.splice(idx, 1)
        this.value.steps.splice(idx - 1, 0, this.selected)
      }
    },
    moveDownStep () {
      const idx = this.value.steps.indexOf(this.selected)
      if (idx < this.value.steps.length) {
        this.value.steps.splice(idx, 1)
        this.value.steps.splice(idx + 1, 0, this.selected)
      }
    },
    deleteStep () {
      const idx = this.value.steps.indexOf(this.selected)
      this.value.steps = this.value.steps.filter(step => step._id !== this.selected._id)
      this.selected = this.value.steps.length === 0 ? null : (idx === this.value.steps.length ? this.value.steps[idx - 1] : this.value.steps[idx])
    }
  }
})
</script>
