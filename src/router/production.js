/**
 *  生产环境路由
 */

let proRouter = [
  {
    path: '/user',
    name: '用户列表',
    component: () => import('@/views/user/index.vue')
  },
  {
    path: '/assetChange',
    name: '资产变动',
    component: () => import('@/views/assetInformationManagement/assetChange/index.vue')
  }
]
export default proRouter
