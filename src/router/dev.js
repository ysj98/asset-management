/*
 * @Date: 2019-11-01 09:42:51
 * @Description: 
 */ 
/**
 * 描述：开发环境路由，生产环境清空该路由。
 * 注意：请不要在此添加业务路由！！！！！！！！
 * 作者：猪不乐意
 * 日期：2019年7月25日
 */

let devRouter = [
  {
    path: '/dev/login',
    name: 'devLogin',
    component: () => import('../views/dev/login.vue')
  },
  {
    path: '/dev/empty',
    name: 'devEmpty',
    component: () => import('../views/dev/empty.vue')
  },
  // {
  //   path: '/home',
  //   name: 'devHome',
  //   component: () => import('../views/dev/home.vue')
  // },
  {
    path: '/dev/power',
    name: 'devPower',
    component: () => import('../views/dev/power.vue')
  },
  // {
  //   path: '/dev/upload',
  //   name: 'devUpLoad',
  //   component: () => import('../views/dev/upLoad.vue')
  // },
  // {
  //   path: '/dev/editer',
  //   name: 'devEditer',
  //   component: () => import('../views/dev/editer.vue')
  // },
  // {
  //   path: '/dev/utils',
  //   name: 'utils',
  //   component: () => import('../views/dev/utils.vue')
  // },
]

if (process.env.NODE_ENV === 'production') {
  devRouter = []
}

export default devRouter
