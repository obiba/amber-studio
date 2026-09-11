import { defineBoot } from '#q-app'
import VuePapaParse from 'vue-papa-parse'

export default defineBoot(({ app }) => {
  // Set instance on app
  app.use(VuePapaParse)
})
