/**
 *  生产环境路由
 */

let proRouter = [
  {
    path: '/user',
    name: '用户列表',
    component: () => import('@/views/user/index.vue')
  },

]
export default proRouter
