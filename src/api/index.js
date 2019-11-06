/**
 * 描述：API服务入口
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

import * as auth from './auth'
import * as global from './global'
import * as assets from './assets'
import * as basics from './basics'
const API = {
  auth,
  global,
  assets,
  basics
}

export default {
  install (Vue) {
    Vue.prototype.$api = API
  },
  ...API
}