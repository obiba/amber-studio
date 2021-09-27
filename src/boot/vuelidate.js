import { boot } from 'quasar/wrappers'
import Vuelidate from "@vuelidate/core";
import { t } from './i18n';
import * as validators from '@vuelidate/validators';

const { createI18nMessage } = validators;
const withI18nMessage = createI18nMessage({ t });
// wrap each validator.
const required = withI18nMessage(validators.required)
const minLength = withI18nMessage(validators.minLength, { withArguments: true })
const maxLength = withI18nMessage(validators.maxLength, { withArguments: true })
const email = withI18nMessage(validators.email)

export default boot(({ app }) => {
    // Set instance on app
    app.use(Vuelidate)
  })

  export { required, minLength, maxLength, email };