/**
 * 描述：路由入口
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

import Vue from 'vue'
import Router from 'vue-router'

import dev from './dev'
import pro from './production'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    ...dev,
    ...pro
  ]
})
// 拦截路由处理生产环境自动生产面包屑
const breadNavList = [{name: '资产管理', path: ''}]
const getLink = (toPath) => pro.filter(item => toPath.indexOf(item.path) !== -1)
router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    store.commit('pro/updateNav', [...breadNavList, ...getLink(to.path)])
  }
  next()
})
export default router
