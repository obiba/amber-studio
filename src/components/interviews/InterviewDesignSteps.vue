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
            :title="t('interview.add_step_hint')"
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
              :title="t('interview.move_up_step_hint')"
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
              :title="t('interview.move_down_step_hint')"
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
              :title="t('interview.delete_step_hint')"
              icon="delete_outline"
              @click='onConfirmDeleteStep'>
            </q-btn>
          </div>
        </div>
        <q-separator/>
        <div v-if="selected" class="row q-ml-md q-mt-sm">
          <div class="col-12">
            <div class="text-weight-bold">{{ t('interview.definition') }}</div>
          </div>
        </div>
        <div v-if="selected" class="row q-pa-md q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <q-input
              v-model='selected.name'
              :label="t('name')"
              lazy-rules
              :hint="t('interview.step_name_hint')"
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
              :label="t('study.form')"
              :disable="isReadOnly" />
            <q-select
              v-model="selected.revision"
              :options="revisionOptions"
              emit-value
              map-options
              :label="t('study.form_revision')"
              :disable="isReadOnly || !selected.form" />
              <q-btn
                v-if="selected.form"
                color="secondary"
                icon="article"
                no-caps
                size="sm"
                class="q-mt-md"
                :to="'/study/' + studyId + '/form/' + selected.form">
                  {{ t('interview.go_to_form') }}
              </q-btn>
          </div>
        </div>
        <div v-if="selected" class="row q-pa-md q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <q-input
              v-model='selected.label'
              :label="t('title')"
              lazy-rules
              :hint="t('required')"
              class="q-mb-md"
              :disable="isReadOnly"
            >
            </q-input>
            <q-input
              v-model='selected.description'
              :label="t('description')"
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
              :label="t('interview.step_time_estimate')"
              :hint="t('interview.step_time_estimate_hint')"
              :disable="isReadOnly" />
            <q-input
              v-model.number="selected.time_estimate_max"
              class="q-mb-md"
              type="number"
              :label="t('interview.step_time_estimate_max')"
              :hint="t('interview.step_time_estimate_max_hint')"
              :disable="isReadOnly" />
          </div>
        </div>
        <q-separator/>
        <div v-if="selected" class="row q-ml-md q-mt-sm">
          <div class="col-12">
            <div class="text-weight-bold">{{ t('interview.step_rendering') }}</div>
          </div>
        </div>
        <div v-if="selected" class="row q-pa-md q-col-gutter-lg">
          <div class="col-md-6 col-sm-12">
            <q-input
              class="q-mb-md"
              v-model="selected.condition"
              type="textarea"
              autogrow
              lazy-rules
              :label="t('interview.step_condition')"
              :hint="t('interview.step_condition_hint')"
              :disable="isReadOnly" />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              class="q-mb-md"
              v-model="selected.disable"
              type="textarea"
              autogrow
              lazy-rules
              :label="t('interview.step_disable')"
              :hint="t('interview.step_disable_hint')"
              :disable="isReadOnly" />
          </div>
        </div>
        <div v-else class="q-ma-md text-grey-6">
          {{t('interview.no_step_selected')}}
        </div>
      </template>

    </q-splitter>

    <q-btn
      v-else-if="!isReadOnly"
      color="primary"
      icon="add"
      :label="t('interview.add_step_hint')"
      @click="onAddStep()"
      class="q-ma-md" />

    <q-dialog v-model='showAddStep' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-input
            v-model='stepData.name'
            :label="t('name')"
            lazy-rules
            @blur="v$.stepData.name.$touch"
            :error="v$.stepData.name.$error"
            :hint="t('interview.step_name_hint')"
          >
            <template v-slot:error>
              <div v-for="error in v$.stepData.name.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='stepData.label'
            :label="t('title')"
            lazy-rules
            @blur="v$.stepData.label.$touch"
            :error="v$.stepData.label.$error"
            :hint="t('required')"
          >
            <template v-slot:error>
              <div v-for="error in v$.stepData.label.$errors">
                {{error.$message}}
              </div>
            </template>
          </q-input>
          <q-input
            v-model='stepData.description'
            :label="t('description')"
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
            :label="t('study.form')" />
          <q-select
            v-model="stepData.revision"
            :options="revisionOptions"
            emit-value
            map-options
            :label="t('study.form_revision')"
            :disable="!stepData.form" />
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='addStep'
            :disable="disableSaveStep"
            :label="t('add')"
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
            {{t('interview.delete_step_confirm')}}
          </div>
          <div class="text-weight-bold text-center q-mt-md">
            {{ selected.name }}
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteStep'
            :label="t('delete')"
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

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../../boot/vuelidate'
import { formRevisionService } from '../../services/form'
import { useFormStore } from 'src/stores/form'
import { useAuth } from 'src/composables/useAuth'

const { t } = useI18n()

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const route = useRoute()
const formStore = useFormStore()
const { isReadOnly } = useAuth()

// Refs
const splitterModel = ref(20)
const selected = ref(null)
const showConfirmDeleteStep = ref(false)
const showAddStep = ref(false)
const stepData = ref({})
const revisionOptions = ref([])

// Computed
const forms = computed(() => formStore.forms)

const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const studyId = computed(() => route.params.id)

const formOptions = computed(() => {
  return forms.value.map(form => {
    return {
      value: form._id,
      label: form.name
    }
  })
})

const steps = computed(() => {
  if (value.value && value.value.steps) {
    return value.value.steps
  }
  return []
})

const disableSaveStep = computed(() => {
  return v$.value.stepData.$invalid || !stepData.value.form || revisionOptions.value.length === 0
})

// Vuelidate rules
const rules = computed(() => ({
  stepData: {
    name: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30),
      nameUnique(val) {
        if (steps.value) {
          return !steps.value.find(step => step.name === val)
        }
        return true
      },
      nameReserved(val) {
        return val !== 'participant'
      }
    },
    label: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30)
    }
  }
}))

const v$ = useVuelidate(rules, { stepData })

// Methods
function updateRevisionOptions(form) {
  formRevisionService.getFormRevisionsDigest(studyId.value, form)
    .then((response) => {
      revisionOptions.value = response.data ? response.data.map(rev => {
        return { value: rev.revision, label: rev.revision }
      }) : []
      if (revisionOptions.value.length > 0) {
        revisionOptions.value.splice(0, 0, { value: null, label: t('study.latest_revision') })
      }
    })
}

function isStepActive(step) {
  return selected.value?._id === step._id
}

function onStepSelection(step) {
  if (selected.value?._id === step._id) {
    selected.value = null
  } else {
    selected.value = step
  }
}

function onConfirmDeleteStep() {
  showConfirmDeleteStep.value = true
}

function onAddStep() {
  stepData.value = {
    name: '',
    description: ''
  }
  showAddStep.value = true
}

function addStep() {
  value.value.steps.push(stepData.value)
}

function moveUpStep() {
  const idx = value.value.steps.indexOf(selected.value)
  if (idx > 0) {
    value.value.steps.splice(idx, 1)
    value.value.steps.splice(idx - 1, 0, selected.value)
  }
}

function moveDownStep() {
  const idx = value.value.steps.indexOf(selected.value)
  if (idx < value.value.steps.length) {
    value.value.steps.splice(idx, 1)
    value.value.steps.splice(idx + 1, 0, selected.value)
  }
}

function deleteStep() {
  const idx = value.value.steps.indexOf(selected.value)
  value.value.steps = value.value.steps.filter(step => step._id !== selected.value._id)
  selected.value = value.value.steps.length === 0 ? null : (idx === value.value.steps.length ? value.value.steps[idx - 1] : value.value.steps[idx])
}

// Watchers
watch(() => stepData.value.form, () => {
  if (stepData.value.form) {
    updateRevisionOptions(stepData.value.form)
  } else {
    revisionOptions.value = []
  }
})

watch(() => selected.value?.form, () => {
  if (selected.value?.form) {
    updateRevisionOptions(selected.value.form)
  } else {
    revisionOptions.value = []
  }
})

// Lifecycle
onMounted(() => {
  if (studyId.value) {
    formStore.getForms(undefined, studyId.value)
  }
})
</script>
