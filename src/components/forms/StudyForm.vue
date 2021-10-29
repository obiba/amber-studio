<template>


</template>

<script>
import { mapActions } from 'vuex';
import { defineComponent, defineAsyncComponent } from 'vue'
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength } from '../../boot/vuelidate';

export default defineComponent({
  name: "StudyForm",
  props: {
      form: Object
  },
  validations: {
    form: {
      name: {
        //alpha,
        required,
        minLength: minLength(2),
        maxLength: maxLength(30)
      }
    }
  },
  components: {
    FormElement: defineAsyncComponent(() => import('components/forms/FormElement.vue')),
  },
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  computed: {
      disableSave() {
        return this.v$.form.$invalid;
     }
   },
   methods: {
    ...mapActions({
      updateStudyForm: 'studyForm/updateStudyForm',
    }),
    async save() {
      this.v$.$reset();
      const toSave = {...this.form};
      this.updateStudyForm({
          studyForm: toSave
      });
    }
  }
});
</script>