import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'

class ErrorHandler {
  init (router) {
    this.router = router
  }

  onError (error, message) {
    // console.error(error)
    if (error.name === 'NotAuthenticated') {
      this.router.push('/login')
    } else {
      Notify.create({
        message: message || (error.data && error.data.message ? error.data.message : 'Unknown error'),
        color: 'negative'
      })
    }
  }
}

const errorHandler = new ErrorHandler()

export default boot(async ({ router }) => {
  errorHandler.init(router)
})

export { errorHandler }
