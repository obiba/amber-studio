import { boot } from 'quasar/wrappers'
import Vuelidate from "@vuelidate/core";

export default boot(({ app }) => {
    // Set instance on app
    app.use(Vuelidate)
  })
