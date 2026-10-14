import { defineBoot } from '#q-app'
import VuePlugin from '@obiba/quasar-ui-amber'

export default defineBoot(({ app }) => {
  app.use(VuePlugin)
})
