/**
 * 描述：开发者功能入口
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

import Dev from './Dev.vue'
import router from './../router'
import store from './../store'

export default function (Vue) {
  if (process.env.NODE_ENV !== 'production') {
    document.body.classList.add('dev')
    const DevProfile = Vue.extend({
      router,
      store,
      render: h => h(Dev)
    })
    new DevProfile().$mount('#dev')
  }
}
