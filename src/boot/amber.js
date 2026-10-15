import { defineBoot } from '#q-app'
import VuePlugin from '@obiba/quasar-ui-amber'
import '@obiba/quasar-ui-json-form/dist/index.css'

export default defineBoot(({ app }) => {
  app.use(VuePlugin)
})
