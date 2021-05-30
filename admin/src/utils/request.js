import axios from 'axios'
import { Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
let loadingInstance = null
// create an axios instance
const service = axios.create({
  // baseURL: '//laowaitong.gzspiral.com', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    loadingInstance = Loading.service({ fullscreen: true });

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    loadingInstance.close();
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    loadingInstance.close();
    
    if (res.code !== '00000' && res?.result?.code != '00') {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    loadingInstance.close();
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
