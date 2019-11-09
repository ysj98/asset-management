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
    path: '/assetClear',
    name: '资产清理',
    component: () => import('@/views/assetInformationManagement/assetClear/index.vue')
  },
  {
    path: '/assetClear/newClearForm',
    name: '新增清理单',
    component: () => import('@/views/assetInformationManagement/assetClear/newClearForm.vue')
  },
  {
    path: '/assetClassSet',
    name: '资产分类设置',
    component: () => import('@/views/assetInformationManagement/assetClassSet/index.vue')
  }
]
export default proRouter
