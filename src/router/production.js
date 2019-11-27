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
    component: () => import('@/views/assetInformationManagement/assetChange/index.vue'),
    meta: {
      keepAlive: true
    }
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
    component: () => import('@/views/assetInformationManagement/assetRegister/index.vue'),
    meta: {
      keepAlive: true
    }
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
    component: () => import('@/views/assetInformationManagement/assetClear/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetClear/new',
    name: '新建清理单',
    component: () => import('@/views/assetInformationManagement/assetClear/newClearForm.vue')
  },
  {
    path: '/assetClear/edit',
    name: '编辑清理单',
    component: () => import('@/views/assetInformationManagement/assetClear/editClearForm.vue')
  },
  {
    path: '/assetClear/audit',
    name: '清理单审核',
    component: () => import('@/views/assetInformationManagement/assetClear/auditClearForm.vue')
  },
  {
    path: '/assetClear/detail',
    name: '清理单详情',
    component: () => import('@/views/assetInformationManagement/assetClear/checkClearForm.vue')
  },
  {
    path: '/assetClassSet',
    name: '资产分类设置',
    component: () => import('@/views/assetInformationManagement/assetClassSet/index.vue'),
    meta: {
      keepAlive: true
    }
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
  },
  {
    path: '/assetProjectManage',
    name: '资产项目管理',
    component: () => import('@/views/assetInformationManagement/asset-project-manage'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetProjectManage/assetProjectDetail',
    name: '资产项目管理详情',
    component: () => import('@/views/assetInformationManagement/asset-project-manage/components/ProjectDetailPage')
  },
  {
    path: '/houseStandingBook',
    name: '房屋台账',
    component: () => import('@/views/assetInformationManagement/houseStandingBook/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/houseStandingBook/assetProjectViewDetail',
    name: '资产项目视图详情',
    component: () => import('@/views/assetInformationManagement/houseStandingBook/assetProjectViewDetail.vue')
  },
  // {
  //   path: '/assetView',
  //   name: '资产视图',
  //   component: () => import('@/views/assetInformationManagement/house-account/asset-view')
  // },
  {
    path: '/houseStandingBook/assetViewDetail',
    name: '资产视图详情',
    component: () => import('@/views/assetInformationManagement/house-account/asset-view/components/AssetDetailPage')
  },
  // {
  //   path: '/buildingView',
  //   name: '楼栋视图',
  //   component: () => import('@/views/assetInformationManagement/house-account/building-view')
  // },
  {
    path: '/houseStandingBook/buildingViewDetail',
    name: '楼栋视图详情',
    component: () => import('@/views/assetInformationManagement/house-account/building-view/components/BuildingDetailPage')
  },
  {
    path: '/propertyOwnerManagement',
    name: '权属人管理',
    component: () => import('@/views/ownershipManagement/propertyOwnerManagement/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/ownershipRegistration',
    name: '权属登记',
    component: () => import('@/views/ownershipManagement/ownershipRegistration/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/ownershipRegistration/registrationNew',
    name: '新建登记申请',
    component: () => import('@/views/ownershipManagement/ownershipRegistration/registrationNew.vue')
  },
  {
    path: '/assetEntry',
    name: '资产入账',
    component: () => import('@/views/financialManagement/assetEntry/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/ownershipSurvey',
    name: '权属概况',
    component: () => import('@/views/ownershipManagement/ownershipSurvey/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/worthRegister',
    name: '价值登记',
    component: () => import('@/views/financialManagement/worth-register'),
    meta: {
      keepAlive: true
    }
  }
]
export default proRouter
