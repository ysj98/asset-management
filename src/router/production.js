/*
 * @Date: 2019-11-01 09:42:51
 * @Author: chen han
 * @Description:
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
    path: '/ownershipRegistration/registrationParticulars',
    name: '权属登记详情',
    component: () => import('@/views/ownershipManagement/ownershipRegistration/registrationParticulars.vue')
  },
  {
    path: '/authorityCardManagement',
    name: '权证管理',
    component: () => import('@/views/ownershipManagement/authorityCardManagement/index.vue'),
    meta: {
      keepAlive: true
    }
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
    path: '/assetEntry/new',
    name: '新建',
    component: () => import('@/views/financialManagement/assetEntry/newAssetEntry.vue')
  },
  {
    path: '/assetEntry/edit',
    name: '编辑',
    component: () => import('@/views/financialManagement/assetEntry/editAssetEntry.vue')
  },
  {
    path: '/assetEntry/audit',
    name: '审核',
    component: () => import('@/views/financialManagement/assetEntry/auditAssetEntry.vue')
  },
  {
    path: '/assetEntry/detail',
    name: '详情',
    component: () => import('@/views/financialManagement/assetEntry/checkAssetEntry.vue')
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
    path: '/ownershipSurvey/projectDetail',
    name: '资产项目权属详情',
    component: () => import('@/views/ownershipManagement/ownershipSurvey/projectOwnershipDetail.vue')
  },
  {
    path: '/ownershipSurvey/projectSet',
    name: '资产项目权属设置',
    component: () => import('@/views/ownershipManagement/ownershipSurvey/projectOwnershipSet.vue')
  },
  {
    path: '/ownershipSurvey/assetOwnershipDetail',
    name: '资产权属详情',
    component: () => import('@/views/ownershipManagement/ownershipSurvey/assetOwnershipDetail.vue')
  },
  {
    path: '/worthRegister',
    name: '价值登记',
    component: () => import('@/views/financialManagement/worth-register'),
    meta: { keepAlive: true }
  },
  {
    path: '/worthRegister/detailRegister',
    name: '价值登记详情',
    component: () => import('@/views/financialManagement/worth-register/asset-worth-register/components/DetailPage')
  },
  {
    path: '/worthRegister/editRegister',
    name: '价值登记编辑',
    component: () => import('@/views/financialManagement/worth-register/asset-worth-register/components/DetailPage')
  },
  {
    path: '/worthRegister/addRegister',
    name: '价值登记新增',
    component: () => import('@/views/financialManagement/worth-register/asset-worth-register/components/DetailPage')
  },
  {
    path: '/worthRegister/approvalRegister',
    name: '价值登记审批',
    component: () => import('@/views/financialManagement/worth-register/asset-worth-register/components/DetailPage')
  },
  {
    path: '/disposalManagement/listDisposal',
    name: '资产处置一览表',
    component: () => import('@/views/disposalManagement/listDisposal/index')
  },
  {
    path: '/inventoryManagement/countingTask',
    name: '盘点任务',
    component: () => import('@/views/inventoryManagement/countingTask/index')
  },
  {
    path: '/inventoryManagement/countingTask',
    name: '盘点任务',
    component: () => import('@/views/inventoryManagement/countingTask/index')
  },
  {
    path: '/inventoryManagement/countingTask/newEditor',
    name: '生成盘点单',
    component: () => import('@/views/inventoryManagement/countingTask/newEditor')
  },
  {
    path: '/inventoryManagement/countingTask/detail',
    name: '详情',
    component: () => import('@/views/inventoryManagement/countingTask/detail')
  }, {
    path: '/inventoryManagement/inventoryReport',
    name: '盘点报告',
    component: () => import('@/views/inventoryManagement/inventoryReport/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/inventoryManagement/inventoryReport/new',
    name: '新建',
    component: () => import('@/views/inventoryManagement/inventoryReport/newInventoryReport')
  },
  {
    path: '/inventoryManagement/inventoryReport/edit',
    name: '编辑',
    component: () => import('@/views/inventoryManagement/inventoryReport/editInventoryReport')
  },
  {
    path: '/inventoryManagement/inventoryReport/audit',
    name: '审核',
    component: () => import('@/views/inventoryManagement/inventoryReport/auditInventoryReport')
  },
  {
    path: '/inventoryManagement/inventoryReport/detail',
    name: '详情',
    component: () => import('@/views/inventoryManagement/inventoryReport/checkInventoryReport')
  },
  {
    path: '/inventoryManagement/exceptionManagement',
    name: '异常管理',
    component: () => import('@/views/inventoryManagement/exceptionManagement/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/inventoryManagement/exceptionManagement/handle',
    name: '处理',
    component: () => import('@/views/inventoryManagement/exceptionManagement/handleException')
  },
  {
    path: '/inventoryManagement/exceptionManagement/detail',
    name: '详情',
    component: () => import('@/views/inventoryManagement/exceptionManagement/checkException')
  },
  {
    path: '/inventoryManagement/inventoryPerform',
    name: '盘点执行',
    component: () => import('@/views/inventoryManagement/inventoryPerform/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/inventoryManagement/inventoryPerform/detail',
    name: '盘点执行详情',
    component: () => import('@/views/inventoryManagement/inventoryPerform/detail')
  },
  {
    path: '/inventoryManagement/inventoryPerform/register',
    name: '盘点结果登记',
    component: () => import('@/views/inventoryManagement/inventoryPerform/register')
  },
  {
    path: '/inventoryPlan',
    name: '盘点计划',
    component: () => import('@/views/inventoryManagement/inventoryPlan/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/inventoryPlan/create',
    name: '新建盘点计划',
    component: () => import('@/views/inventoryManagement/inventoryPlan/createPlan')
  },
  {
    path: '/inventoryPlan/edit',
    name: '编辑盘点计划',
    component: () => import('@/views/inventoryManagement/inventoryPlan/editPlan')
  },
  {
    path: '/inventoryPlan/detail',
    name: '详情盘点计划',
    component: () => import('@/views/inventoryManagement/inventoryPlan/detailPlan')
  },
]
export default proRouter
