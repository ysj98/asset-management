/**
 * 描述：全局状态入口
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

import Vue from 'vue'
import Vuex from 'vuex'
import dev from './modules/dev'
import auth from './modules/auth'
import pro from './modules/pro'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    auth,
    dev,
    pro
  }
})
