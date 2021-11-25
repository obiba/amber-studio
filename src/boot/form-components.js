import { boot } from 'quasar/wrappers'
// All components that are used in the form need to be globally registered.
import { QInput, QSlider, QSelect, QOptionGroup, QToggle, QRating } from 'quasar'

export default boot(async ({ app }) => {
  app.component('QInput', QInput)
  app.component('QSlider', QSlider)
  app.component('QSelect', QSelect)
  app.component('QOptionGroup', QOptionGroup)
  app.component('QToggle', QToggle)
  app.component('QRating', QRating)
})
