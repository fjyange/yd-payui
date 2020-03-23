import axios from 'axios';
import config from './config';
import Cookies from "js-cookie";
import router from '@/router'
// @ == src
import { Message } from 'element-ui'

// 使用vuex做全局loading时使用
// import store from '@/store'

export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials
    })

    // request 拦截器
    instance.interceptors.request.use(
      config => {
        let token = Cookies.get('token')
        // 1. 请求开始的时候可以结合 vuex 开启全屏 loading 动画
        // console.log(store.state.loading)
        // console.log('准备发送请求...')
        // 2. 带上token
        if (token) {
          config.headers['Authorization'] = 'YUNXINPAYBasic ' + token
          // config.headers['Authorization'] = 'YUNDUANPAYBasic ' + token
          // config.headers['Authorization'] = 'JUNPAYBasic ' + token
        } else {
          // 重定向到登录页面
          router.push('/login')
        }
        // 3. 根据请求方法，序列化传来的参数，根据后端需求是否序列化
        if (config.method === 'post') {
          // if (config.data.__proto__ === FormData.prototype
          //   || config.url.endsWith('path')
          //   || config.url.endsWith('mark')
          //   || config.url.endsWith('patchs')
          // ) {

          // } else {
            // config.data = qs.stringify(config.data)
          // }
        }

        return config
      },

      error => {
        // 请求错误时
        console.log('request:', error)
        // 1. 判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          console.log('timeout请求超时')
          // return service.request(originalRequest);// 再重复请求一次
        }
        // 2. 需要重定向到错误页面
        const errorInfo = error.response
        console.log(errorInfo)
        if (errorInfo) {
          error = errorInfo.data  // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          const errorStatus = errorInfo.status; // 404 403 500 ...
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        if (response.request.responseType === 'blob') {
          return response
        } else if (response.data.success) {
          return response.data
        } else if (!response.data.success) {
          Message({
            showClose: true,
            type: 'error',
            message: response.data.errorDesc?response.data.errorDesc:response.data.result
          })
          return response.data
        } else {
          return Promise.reject(response.data)
        }
      },
      err => {
        if (err && err.response) {
          if (err.response.data.errorCode === 'R-0006' ||err.response.data.errorCode === 'R-0007'||err.response.data.errorCode === 'R-0003'){
            Message({
              showClose: true,
              type: 'error',
              message: err.response.data.errorDesc
            })
            sessionStorage.removeItem("user")
            Cookies.remove("token")
            router.push('/login')
            return false;
          }else {
            switch (err.response.status) {
              case 400:
                err.message = '请求错误'
                break
              case 401:
                err.message = '未授权，请登录'
                break
              case 403:
                err.message = '拒绝访问'
                break
              case 404:
                err.message = `请求地址出错: ${err.response.config.url}`
                break
              case 408:
                err.message = '请求超时'
                break
              case 500:
                err.message = '服务器内部错误'
                break
              case 501:
                err.message = '服务未实现'
                break
              case 502:
                err.message = '网关错误'
                break
              case 503:
                err.message = '服务不可用'
                break
              case 504:
                err.message = '网关超时'
                break
              case 505:
                err.message = 'HTTP版本不受支持'
                break
              default:
            }
          }
          
        }
        console.error(err)
        return Promise.reject(err) // 返回接口返回的错误信息
      }
    )

    // 请求处理
    instance(options).then(res => {
      resolve(res)
      return false
    }).catch(error => {
      reject(error)
    })
  })
}