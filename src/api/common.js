import axios from 'axios'
// import router from '../router'
export const HTTP = axios.create({
  baseURL: 'http://45.76.192.53:8090/',
  headers: {
    Authorization: localStorage.getItem('access_token')
  }
})

HTTP.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response.status === 401) {
    console.log('error 401')
    // router.push('project')
    window.location = '/sign-in.html'
  }
  return error
})

export default {
  get (url, cb, errorCb) {
    HTTP.get(url, {
      headers: {'Authorization': localStorage.getItem('access_token')}
    }).then((response) => {
      cb(response)
    }).catch((err) => {
      errorCb(err.response)
    })
  },

  post (url, param, cb, errorCb) {
    HTTP.post(url, param).then((response) => {
      cb(response)
    }).catch((err) => {
      errorCb(err)
    })
  }
}
