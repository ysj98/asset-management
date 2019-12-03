/**
 * 描述：认证服务状态
 * 作者：猪不乐意
 * 日期：2019年6月26日
 * 修改：2019年7月16日
 */

import * as Auth from './../../api/auth'
import router from './../../router'
import cookie from 'js-cookie'
import SG_UI from 'segi-ant'
import { win } from './../../utils/utils'

// 引入消息提醒实例
const SG_Message = SG_UI.SG_Message.Message

const state = {
  power: [],
  userinfo: null
}

const mutations = {
  // 设置按钮权限数据
  setPower (state, parms) {
    let Power = []
    parms.forEach(item => {
      if (item.popeCode) Power.push(item.popeCode)
    })
    Power = `,${Power.join(',')},`
    state.power = Power
  },
  // 设置用户信息
  setUserInfo (state, parms) {
    state.userinfo = parms
  }
}

const actions = {
  // 登录
  login ({ dispatch }, parms) {
    Auth.login(parms.username, parms.password).then((res) => {
      if (res.data.code === '0') {
        SG_Message.success('登录成功')
        dispatch('getPower')
        dispatch('getUserInfo')
        router.replace('/home')
      } else {
        SG_Message.error(res.data.message)
      }
    })
  },
  // 登出，清除所有数据
  logout ({ commit }) {
    Object.keys(cookie.get()).forEach(el => {
      cookie.remove(el)
    })
    localStorage.clear()
    sessionStorage.clear()
    commit('setPower', [])
    // 生产环境，处于 iframe 中刷新父级页面，否则直接跳转到根地址
    if (process.env.NODE_ENV === 'production') {
      if (!win.isParent) {
        window.location.href = window.location.origin
      } else {
        window.parent.location.reload()
      }
    // 开发环境跳转到登录路由.
    } else {
      router.replace('/dev/login')
    }
  },
  // 页面按钮权限
  getPower ({ commit }) {
    Auth.popedomCode().then(res => {
      if (res.data.code === '0') {
        let powerArray = Array.isArray(res.data.data) ? res.data.data : []
        let powerCode = JSON.stringify(powerArray)
        window.sessionStorage.setItem('b083aa5461ace946', powerCode)
        commit('setPower', powerArray)
      }
    })
  },
  // 获取用户信息
  getUserInfo ({ commit }) {
    Auth.getUserData().then(res => {
      commit('setUserInfo', res.data.data)
    })
  }
}

// 初始化权限数据
let PowerCode = JSON.parse(window.sessionStorage.getItem('b083aa5461ace946') || window.sessionStorage.getItem('ab007d4296ed321a') || '[]')
mutations.setPower(state, PowerCode)


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
