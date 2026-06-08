import axios from 'axios'
import { LoadingBar } from 'quasar'

const api = axios.create({ baseURL: process.env.API })

api.defaults.withCredentials = true

LoadingBar.setDefaults({
  color: 'secondary',
  size: '15px',
  position: 'top'
})

api.interceptors.request.use(
  function (config) {
    LoadingBar.start()
    return config
  },
  function (error) {
    LoadingBar.stop()
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  function (response) {
    LoadingBar.stop()
    return response
  },
  function (error) {
    LoadingBar.stop()
    return Promise.reject(error)
  }
)

export { api, axios }
