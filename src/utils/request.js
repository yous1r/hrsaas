import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getTime } from '@/utils/auth'
import router from '@/router'
const timeout = 1000 * 60 * 60 * 2
// 创建了一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 配置响应拦截器，处理错误消息提示
service.interceptors.request.use(function(config) {
  /*
    1. 去vuex中获取token
    2. 判断是否有token
    3. 如果有，把token放到请求头中 Authorization ,注意格式
    4. 如果没有token, 不携带
  */
  // 在发送请求之前做些什么
  // console.log(config)
  // 存入的时间戳
  const token = store.getters.token
  if (token) {
    const oldTime = getTime()
    if (Date.now() - oldTime >= timeout) {
      // 过期了
      store.dispatch('user/logout')
      // 提示消息
      Message.error('登录信息过期')
      router.push('/login')
    } else {
      config.headers.Authorization = 'Bearer ' + token
    }
  }

  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  // console.log(response.data)
  const { data, success, message } = response.data
  if (success) {
    // 如果请求正常处理成功
    return data
  } else {
    // 提示错误消息
    Message.error(message)
    return Promise.reject(message)
  }
}, function(error) {
  // 对响应错误做点什么
  console.dir(error)
  const { code } = error.response.data
  if (code === 10002) {
    // token过期了
    // 跳转到登录页
    store.dispatch('user/logout')
    // 提示消息
    Message.error('登录信息过期')
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})
export default service
