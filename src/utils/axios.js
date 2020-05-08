/**
 * 描述：请求封装
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

import axios from 'axios'
import qs from 'qs'
import store from './../store'
import SG_UI from 'segi-ant'
import {uuid} from './utils'
import localStore from '@/utils/localStore'
// 引入配置文件
import baseConfig from '@/config/config.base'

// 引入消息提醒实例
const SG_Message = SG_UI.SG_Message.Message

// 创建一个请求对象
let axiosX = axios.create({
  baseURL: baseConfig.DEV_API_URL || ''
})

// request 拦截
axiosX.interceptors.request.use(
  config => {
    config.headers['Trace-Log-Id'] = uuid(32)
    config.headers['AUTHORIZATION'] = localStore.getToken() ?'Bearer ' + localStore.getToken() : ''
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
let errCodeArr = ['0000002', '0000001', '-0000003']
// response 拦截
axiosX.interceptors.response.use(
  response => {
    const code = response.data.code
    // 如果未返回 body 体
    if (!response.data) {
      SG_Message.error('系统繁忙！请稍后再试！')
    }
    // 如果登录信息失效
    if (errCodeArr.includes(code)) {
      store.dispatch('auth/logout')
    }
    // 错误处理
    // if (code !== '0') {
    //   SG_Message.error()
    // }
    // 成功则直接返回数据
    return response
  },
  error => {
    // 如果服务器返回500错误
    try {
      if (error.response) {
        if (error.response.data && errCodeArr.includes(error.response.data.code)) {
          store.dispatch('auth/logout')
          SG_Message.error(error.response.data.message)
        } else {
          // console.log('接口全局报错=>', error.response)
          // 特殊接口拦截
          if (error.response.status === 404 && error.response.config.url === '/charging-api/rest-api/v1/assets/getAcctItemPageList') {
            return
          }
          SG_Message.error()
        }
      }
    } catch {
      SG_Message.error()
    }
    if (error.response) {
      console.log('错误=>' + error.response.status)
    }
    return Promise.reject(error)
  }
)

/**
 * @param {string}  method   请求方法
 * @param {string}  url      请求地址
 * @param {Object}  params    请求参数
 * @param {Boolean} loading  loading 状态
 * @param {Boolean} stringify 是否格式化参数
 */
function XHR (url, { method = 'get', params = {}, loading = false, stringify = true,  options = {} }) {
  // 格式化参数
  let fromData = method === 'get' ? { params, ...options } : params
  // 如果开启格式参数，且请求为 post
  if (method === 'post' && stringify) {
    fromData = qs.stringify(fromData)
  }
  // 启用loading
  let loadingName
  if (loading) loadingName = SG_Message.loading()
  // 返回结果
  return new Promise((resolve, reject) => {
    axiosX[method](url, fromData, options).then(res => {
      if (loadingName) SG_Message.destroy(loadingName)
      resolve(res)
    }).catch(error => {
      if (loadingName) SG_Message.destroy(loadingName)
      reject(error)
    })
  })
}

/**
 * GET 请求
 * @param {String} url 地址
 * @param {Object} params 参数
 * @param {Boolean} loading 加载状态，默认开启
 * @param {Object} options 请求头设置
 */
export function axiosGet (url, params, loading = false, options) {
  return XHR(url, { method: 'get', params, loading, options })
}

/**
 * POST 请求
 * @param {String} url 地址
 * @param {Object} params 参数
 * @param {Boolean} loading 加载状态，默认开启
 * @param {Boolean} stringify 是否格式化参数
 * @param {Object} options 请求头设置
 */
export function axiosPost (url, params, loading = false, stringify = false, options) {
  return XHR(url, { method: 'post', params, loading, options, stringify })
}

export default function (Vue) {
  // 注入未封装的原始请求
  Vue.prototype.$axios = axiosX
  // 注入封装好的请求
  Vue.prototype.$http = {
    get: axiosGet,
    post: axiosPost
  }
}