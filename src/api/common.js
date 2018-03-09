import * as config from '../config'
import axios from 'axios'
// import router from '../router'
export const HTTP = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    Authorization: localStorage.getItem('access_token')
  }
})

HTTP.interceptors.response.use(response => {
  return response
}, error => {
  if (!axios.isCancel(error)) {
    if (error.response.status === 401) {
      console.log('error 401')
      // router.push('project')
      window.location = config.SIGNIN_PATH
    }
  }
  throw error
})

export default {
  get (url, cb, errorCb) {
    let CancelToken = axios.CancelToken
    let source = CancelToken.source()
    let request = HTTP.get(url, {
      cancelToken: source.token
    }).then((response) => {
      cb(response)
    }).catch((err) => {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message)
      } else {
        console.log('error: ', err.message)
        errorCb(err.response)
      }
    })

    return { request, source }
  },

  delete (url, cb, errorCb) {
    let CancelToken = axios.CancelToken
    let source = CancelToken.source()
    let request = HTTP.delete(url, {
      cancelToken: source.token
    }).then((response) => {
      cb(response)
    }).catch((err) => {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message)
      } else {
        console.log('error: ', err.message)
        errorCb(err.response)
      }
    })

    return { request, source }
  },

  post (url, param, cb, errorCb) {
    let CancelToken = axios.CancelToken
    let source = CancelToken.source()
    let request = HTTP.post(url, {
      cancelToken: source.token,
      ...param
    }).then((response) => {
      cb(response)
    }).catch((err) => {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message)
      } else {
        console.log('error: ', err.message)
        errorCb(err.response)
      }
    })

    return { request, source }
  },

  put (url, param, cb, errorCb) {
    let CancelToken = axios.CancelToken
    let source = CancelToken.source()
    let request = HTTP.put(url, {
      cancelToken: source.token,
      ...param
    }).then((response) => {
      cb(response)
    }).catch((err) => {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message)
      } else {
        console.log('error: ', err.message)
        errorCb(err.response)
      }
    })

    return { request, source }
  },

  upload (url, param, config, cb, errorCb) {
    let CancelToken = axios.CancelToken
    let source = CancelToken.source()
    let request = HTTP.post(url, {
      cancelToken: source.token,
      ...param
    }, config).then((response) => {
      cb(response)
    }).catch((err) => {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message)
      } else {
        console.log('error: ', err.message)
        errorCb(err.response)
      }
    })

    return { request, source }
  },

  cancel (source) {
    // cancel the request (the message parameter is optional)
    source.cancel('Operation canceled by the user.')
  },

  isCancel (error) {
    // cancel the request (the message parameter is optional)
    return axios.isCancel(error)
  }
}
