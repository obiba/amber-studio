import { boot } from 'quasar/wrappers'
import VuePapaParse from 'vue-papa-parse'

export default boot(({ app }) => {
  // Set instance on app
  app.use(VuePapaParse)
})
