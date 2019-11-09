/*
 * @Date: 2019-11-01 09:42:51
 * @Author: chen han
 * @Description: 
 */
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
    path: '/buildingDict/createHouse',
    name: '新建房间',
    component: () => import('@/views/buildingDict/createHouse.vue')
  },
  {
    path: '/buildingDict/editHouse',
    name: '编辑房间',
    component: () => import('@/views/buildingDict/editHouse.vue')
  },
  {
    path: '/buildingDict/detailHouse',
    name: '房间详情',
    component: () => import('@/views/buildingDict/detailHouse.vue')
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
