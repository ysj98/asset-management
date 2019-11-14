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
    name: '变动申请',
    component: () => import('@/views/assetInformationManagement/assetChange/newEditSingle.vue')
  },
  {
    path: '/assetChange/particulars',
    name: '变动单详情',
    component: () => import('@/views/assetInformationManagement/assetChange/particulars.vue')
  },
  {
    path: '/assetRegister',
    name: '资产登记',
    component: () => import('@/views/assetInformationManagement/assetRegister/index.vue')
  },
  {
    path: '/assetRegister/newEditSingle',
    name: '新建登记单',
    component: () => import('@/views/assetInformationManagement/assetRegister/newEditSingle.vue')
  },
  {
    path: '/assetRegister/particulars',
    name: '登记单详情',
    component: () => import('@/views/assetInformationManagement/assetRegister/particulars.vue')
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
  },
  {
    path: '/assetView',
    name: '资产视图',
    component: () => import('@/views/assetInformationManagement/house-account/asset-view')
  },
  {
    path: '/assetViewDetail',
    name: '资产视图详情',
    component: () => import('@/views/assetInformationManagement/house-account/asset-view/components/AssetDetailPage')
  },
  {
    path: '/buildingView',
    name: '楼栋视图',
    component: () => import('@/views/assetInformationManagement/house-account/building-view')
  },
  {
    path: '/buildingViewDetail',
    name: '楼栋视图详情',
    component: () => import('@/views/assetInformationManagement/house-account/building-view/components/BuildingDetailPage')
  },
  {
    path: '/assetProjectManage',
    name: '资产项目管理',
    component: () => import('@/views/assetInformationManagement/asset-project-manage')
  },
  {
    path: '/assetProjectDetail',
    name: '资产项目管理详情',
    component: () => import('@/views/assetInformationManagement/asset-project-manage/components/ProjectDetailPage')
  },
  {
    path: '/assetClassSet/edit',
    name: '编辑',
    component: () => import('@/views/assetInformationManagement/assetClassSet/editClassSet.vue')
  },
  {
    path: '/assetClassSet/detail',
    name: '详情',
    component: () => import('@/views/assetInformationManagement/assetClassSet/checkClassSet.vue')
  }
]
export default proRouter
