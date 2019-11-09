/**
 *  生产环境路由
 */

let proRouter = [
  {
    path: '/buildingDict',
    name: '楼盘字典',
    component: () => import('@/views/buildingDict/index.vue')
  },
  {
    path: '/assetChange',
    name: '资产变动',
    component: () => import('@/views/assetInformationManagement/assetChange/index.vue')
  },
  {
    path: '/assetChange/newEditSingle',
    name: '变动单申请',
    component: () => import('@/views/assetInformationManagement/assetChange/newEditSingle.vue')
  }
]
export default proRouter
