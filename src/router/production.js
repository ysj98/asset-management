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
    path: '/disposalRegister',
    name: '处置登记',
    component: () => import('@/views/disposalManagement/disposalRegister/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/disposalRegister/create',
    name: '新增处置登记',
    component: () => import('@/views/disposalManagement/disposalRegister/createRegister')
  },
  {
    path: '/disposalRegister/edit',
    name: '编辑处置登记',
    component: () => import('@/views/disposalManagement/disposalRegister/editRegister')
  },
  {
    path: '/disposalRegister/detail',
    name: '详情处置登记',
    component: () => import('@/views/disposalManagement/disposalRegister/detailRegister')
  },
  {
    path: '/disposalRegister/approval',
    name: '审批处置登记',
    component: () => import('@/views/disposalManagement/disposalRegister/approvalRegister')
  },
  {
    path: '/disposalManagement/listDisposal',
    name: '资产处置一览表',
    component: () => import('@/views/disposalManagement/listDisposal/index')
  },
  {
    path: '/inventoryManagement/countingTask',
    name: '盘点任务',
    component: () => import('@/views/inventoryManagement/countingTask/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/inventoryManagement/countingTask/newEditor',
    name: '生成盘点单',
    component: () => import('@/views/inventoryManagement/countingTask/newEditor')
  },
  {
    path: '/inventoryManagement/countingTask/detail',
    name: '详情',
    meta: {
      keepAlive: true
    },
    component: () => import('@/views/inventoryManagement/countingTask/detail')
  },
  {
    path: '/inventoryManagement/countingTask/detail/report',
    name: '盘点报告详情',
    component: () => import('@/views/inventoryManagement/countingTask/report')
  },
  {
    path: '/inventoryManagement/countingTask/detail/inventoryDetails',
    name: '盘点单详情',
    component: () => import('@/views/inventoryManagement/countingTask/inventoryDetails')
  },
  {
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
    component: () => import('@/views/inventoryManagement/inventoryPlan/detailPlan'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/inventoryPlan/approval',
    name: '审批盘点计划',
    component: () => import('@/views/inventoryManagement/inventoryPlan/approvalPlan')
  },
  {
    path: '/inventoryPlan/detail/taskDetail',
    name: '盘点任务详情',
    component: () => import('@/views/inventoryManagement/inventoryPlan/taskDetail'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/inventoryPlan/detail/taskDetail/implementDetail',
    name: '盘点单详情',
    component: () => import('@/views/inventoryManagement/inventoryPlan/implementDetail')
  },
  {
    path: '/inventoryPlan/detail/taskDetail/reportDetail',
    name: '盘点报告详情',
    component: () => import('@/views/inventoryManagement/inventoryPlan/reportDetail')
  },
  {
    path: '/subsidiary',
    name: '附属配套管理',
    component: () => import('@/views/assetInformationManagement/assetSubsidiary/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/subsidiary/create',
    name: '新建附属配套',
    component: () => import('@/views/assetInformationManagement/assetSubsidiary/createSubsidiary')
  },
  {
    path: '/subsidiary/edit',
    name: '编辑附属配套',
    component: () => import('@/views/assetInformationManagement/assetSubsidiary/editSubsidiary')
  },
  {
    path: '/subsidiary/detail',
    name: '附属配套详情',
    component: () => import('@/views/assetInformationManagement/assetSubsidiary/detailSubsidiay')
  },
  {
    path: '/reportingManagement/submitForm',
    name: '呈报表单',
    component: () => import('@/views/reportingManagement/submitForm/index.vue')
  },
  {
    path: '/reportingManagement/submitForm/details',
    name: '详情',
    component: () => import('@/views/reportingManagement/submitForm/details.vue')
  },
  {
    path: '/reportingManagement/submitPlans',
    name: '呈报计划',
    component: () => import('@/views/reportingManagement/submitPlans/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/reportingManagement/submitPlans/newPlan',
    name: '新建',
    component: () => import('@/views/reportingManagement/submitPlans/newPlan.vue')
  },
  {
    path: '/reportingManagement/submitPlans/editPlan',
    name: '编辑',
    component: () => import('@/views/reportingManagement/submitPlans/editPlan.vue')
  },
  {
    path: '/reportingManagement/submitPlans/details',
    name: '详情',
    component: () => import('@/views/reportingManagement/submitPlans/details.vue')
  },
  {
    path: '/reportingRecord',
    name: '资产呈报记录',
    component: () => import('@/views/reportingManagement/reportingRecord/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/reportingRecord/details',
    name: '详情',
    component: () => import('@/views/reportingManagement/reportingRecord/details.vue')
  },
  {
    path: '/reportTask',
    name: '呈报任务',
    component: () => import('@/views/reportingManagement/reportTask'),
    meta: { keepAlive: true }
  },
  {
    path: '/reportTask/editTask',
    name: '填报数据',
    component: () => import('@/views/reportingManagement/reportTask/editTask/EditTask')
  },
  {
    path: '/reportTask/newTask',
    name: '新建任务',
    component: () => import('@/views/reportingManagement/reportTask/editTask/NewTask')
  },
  {
    path: '/reportTask/approveTask',
    name: '审核任务',
    component: () => import('@/views/reportingManagement/reportTask/approveTask/ApproveTask')
  },
  {
    path: '/reportTask/taskDetail',
    name: '任务详情',
    component: () => import('@/views/reportingManagement/reportTask/components/TaskDetail')
  },
  {
    path: '/taskQuery',
    name: '任务查询',
    component: () => import('@/views/reportingManagement/taskQuery/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/taskQuery/details',
    name: '详情',
    component: () => import('@/views/reportingManagement/taskQuery/details.vue')
  },
  {
    path: '/reportingList',
    name: '呈报记录一览表',
    component: () => import('@/views/reportingManagement/reportingRecordList'),
    meta: { keepAlive: true }
  },
  {
    path: '/reportingList/details',
    name: '详情',
    component: () => import('@/views/reportingManagement/reportingRecordList/details.vue')
  }, {
    path: '/houseAssetAnalysis',
    name: '房屋资产统计分析',
    component: () => import('@/views/tableManagement/houseAssetAnalysis'),
    meta: { keepAlive: true }
  }, {
    path: '/projectData',
    name: '资产项目数据查询',
    component: () => import('@/views/tableManagement/projectDataSearch'),
    meta: { keepAlive: true }
  }, {
    path: '/projectData/assetProjectDetail',
    name: '资产项目详情',
    component: () => import('@/views/assetInformationManagement/asset-project-manage/components/ProjectDetailPage')
  }, {
    path: '/houseAssetStatistics',
    name: '有证房屋资产统计表',
    component: () => import('@/views/tableManagement/houseAssetStatistics'),
    meta: { keepAlive: true }
  }, {
    path: '/warrantAmountStatistics',
    name: '权证数量统计表',
    component: () => import('@/views/tableManagement/warrantAmountStatistics'),
    meta: { keepAlive: true }
  }, {
    path: '/ownershipCardList',
    name: '权属证件一览表',
    component: () => import('@/views/tableManagement/ownershipCardList'),
    meta: { keepAlive: true }
  }, {
    path: '/assetWorthStatistics',
    name: '资产价值统计表',
    component: () => import('@/views/tableManagement/assetWorthStatistics'),
    meta: { keepAlive: true }
  }
]
export default proRouter
