import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
const url = window.location.href.split('#')[0]
let apiUrl = ''
if (url.indexOf('taoyuan.ydxxtech.com') !== -1) {
  apiUrl = 'http://taoyuan.ydxxtech.com/admin'
} else if (url.indexOf('tytsg.cn') !== -1) {
  if (url.indexOf('www') !== -1) {
    apiUrl = 'https://www.tytsg.cn/admin'
  } else {
    apiUrl = 'https://tytsg.cn/admin'
  }
} else {
  apiUrl = '/api'
}
if (apiUrl === '/api') {
  store.dispatch('setUrl', 'http://taoyuan.ydxxtech.com/admin')
} else {
  store.dispatch('setUrl', apiUrl)
}
// create an axios instance
const service = axios.create({
  baseURL: apiUrl, // api 的 base_url
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      } else if (error.response.status === 500) {
        Message.error('服务器错误')
      }
    }
    return Promise.reject(error)
  }
)

export default service