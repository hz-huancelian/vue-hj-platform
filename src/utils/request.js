import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})

const service2 = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 6000
})

service2.interceptors

service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    config.headers['Cache-Control'] = 'no-cache' // 解决 类似360浏览器Ajax缓存问题
    config.headers['Pragma'] = 'no-cache'
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      if (res.code === 401 || res.code === 403) {
        Message({
          message: '您的登录超时!',
          type: 'error',
          duration: 5 * 1000
        })
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      } else if (res.code === 406) {
        Message({
          message: '您的账号在其他地方访登录!',
          type: 'error',
          duration: 3 * 1000
        })
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.message || 'Error'))
      }
    } else {
      return res
    }
  },
  error => {
    const errObj = error.response.data
    Message({
      message: '服务器请求异常!',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(errObj)
  }
)

export default service
