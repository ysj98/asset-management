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
  }
]
export default proRouter
