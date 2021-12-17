/*
 * @Date: 2019-11-01 09:42:51
 * @Author: chen han
 * @Description:
 */
let proRouter = [{
    path: '/barcodeManagement',
    name: '条码管理',
    component: () => import('@/views/barcodeManagement/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetBarcode',
    name: '资产条码',
    component: () => import('@/views/assetBarcode/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/buildingDict',
    name: '楼盘字典',
    component: () => import('@/views/buildingDict/index.vue'),
    meta: {
      keepAlive: true
    }
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
    path: '/buildingDict/createLand',
    name: '新建土地',
    component: () => import('@/views/buildingDict/land/createLand.vue')
  },
  {
    path: '/buildingDict/editLand',
    name: '编辑土地',
    component: () => import('@/views/buildingDict/land/editLand.vue')
  },
  {
    path: '/buildingDict/detailLand',
    name: '土地详情',
    component: () => import('@/views/buildingDict/land/detailLand.vue')
  },
  {
    path: '/buildingDict/createPark',
    name: '新建车场',
    component: () => import('@/views/buildingDict/park/createPark.vue')
  },
  {
    path: '/buildingDict/editPark',
    name: '编辑车场',
    component: () => import('@/views/buildingDict/park/editPark.vue')
  },
  {
    path: '/buildingDict/detailViewPark',
    name: '查看车场',
    component: () => import('@/views/buildingDict/park/detailViewPark.vue')
  },
  {
    path: '/buildingDict/createStall',
    name: '新建车位',
    component: () => import('@/views/buildingDict/stall/createStall.vue')
  },
  {
    path: '/buildingDict/editStall',
    name: '编辑车位',
    component: () => import('@/views/buildingDict/stall/editStall.vue')
  },
  {
    path: '/buildingDict/detailViewStall',
    name: '查看车位',
    component: () => import('@/views/buildingDict/stall/detailViewStall.vue')
  },
  {
    path: '/buildingDict/createEquipment',
    name: '新建设备',
    component: () => import('@/views/buildingDict/equipment/createEquipment.vue')
  },
  {
    path: '/buildingDict/editEquipment',
    name: '编辑设备',
    component: () => import('@/views/buildingDict/equipment/editEquipment.vue')
  },
  {
    path: '/buildingDict/detailViewEquipment',
    name: '查看设备',
    component: () => import('@/views/buildingDict/equipment/detailViewEquipment.vue')
  },
  {
    path: '/assetCodingRule',
    name: '资产编码规则',
    component: () => import('@/views/assetCodingRule/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mapDrawLand',
    name: '土地地图绘制',
    component: () => import('@/views/mapDrawLand/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetOperatingParameters',
    name: '资产转运营参数',
    component: () => import('@/views/assetOperatingParameters/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetOperating',
    name: '资产转运营',
    component: () => import('@/views/assetOperating/index.vue'),
  },
  {
    path: '/assetManagementMode',
    name: '资产经营方式',
    component: () => import('@/views/assetManagementMode/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/anyAttrConfig',
    name: '自定义编码设置',
    component: () => import('@/views/anyAttrConfig/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetBussinessInformation',
    name: '资产业务信息',
    component: () => import('@/views/assetBussinessInformation/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetChangeRegister',
    name: '资产变更单',
    component: () => import('@/views/assetInformationManagement/assetChange/assetsRegistration.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetChangeRegister/editSingle',
    name: '编辑变更单',
    component: () => import('@/views/assetInformationManagement/assetChange/editSingle.vue')
  },
  {
    path: '/assetChangeRegister/newEditSingle',
    name: '新建变更单',
    component: () => import('@/views/assetInformationManagement/assetChange/newEditSingle.vue')
  },
  {
    path: '/assetChangeRegister/particulars',
    name: '变更单详情',
    component: () => import('@/views/assetInformationManagement/assetChange/particulars.vue')
  },
  {
    path: '/assetChangeView',
    name: '资产变更一览表',
    component: () => import('@/views/assetInformationManagement/assetChange/scheduleChanges.vue'),
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
    path: '/assetCheckInView',
    name: '资产登记一览表',
    component: () => import('@/views/assetInformationManagement/assetRegister/assetRegisterView.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetCheckInView/detail',
    name: '资产登记一览表详情',
    component: () => import('@/views/assetInformationManagement/assetRegister/assetRegisterViewDetail/index.vue')
  },
  {
    path: '/assetRegister/newEditSingle',
    name: '新建登记单',
    component: () => import('@/views/assetInformationManagement/assetRegister/child/newEditSingle.vue')
  },
  {
    path: '/assetRegister/registerEdit',
    name: '编辑登记单',
    component: () => import('@/views/assetInformationManagement/assetRegister/child/registerEdit.vue')
  },
  {
    path: '/assetRegister/particulars',
    name: '登记单详情',
    component: () => import('@/views/assetInformationManagement/assetRegister/particulars.vue')
  },
  {
    path: '/assetClear',
    name: '资产出库',
    component: () => import('@/views/assetInformationManagement/assetClear/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetClear/new',
    name: '新建出库单',
    component: () => import('@/views/assetInformationManagement/assetClear/newClearForm.vue')
  },
  {
    path: '/assetClear/edit',
    name: '编辑出库单',
    component: () => import('@/views/assetInformationManagement/assetClear/editClearForm.vue')
  },
  {
    path: '/assetClear/audit',
    name: '出库单审核',
    component: () => import('@/views/assetInformationManagement/assetClear/auditClearForm.vue')
  },
  {
    path: '/assetClear/detail',
    name: '出库单详情',
    component: () => import('@/views/assetInformationManagement/assetClear/checkClearForm.vue')
  },
  {
    path: '/assetClassSet',
    name: '资产分类',
    component: () => import('@/views/assetInformationManagement/assetClassSet/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/paramsConfig',
    name: '其他参数',
    component: () => import('@/views/assetInformationManagement/paramsConfig/index.vue'),
    meta: {
      keepAlive: true
    }
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
    path: '/organView',
    name: '房屋机构视图',
    component: () => import('@/views/assetInformationManagement/house-account/organ-view/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/organView/detail',
    name: '详情',
    component: () => import('@/views/assetInformationManagement/house-account/organ-view/organViewDetail.vue')
  },
  {
    path: '/assetProjectView',
    name: '房屋项目视图',
    component: () => import('@/views/assetInformationManagement/houseStandingBook/assetProjectViewList.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/houseStandingBook/assetProjectViewDetail',
    name: '房屋项目视图详情',
    component: () => import('@/views/assetInformationManagement/houseStandingBook/assetProjectViewDetail')
  },
  {
    path: '/assetView',
    name: '房屋资产视图',
    component: () => import('@/views/assetInformationManagement/house-account/asset-view/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetView/assetViewDetail',
    name: '房屋资产视图详情',
    component: () => import('@/views/assetInformationManagement/house-account/asset-view/components/AssetDetailPage')
  },
  {
    path: '/buildingView',
    name: '楼栋视图',
    component: () => import('@/views/assetInformationManagement/house-account/building-view/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/buildingView/buildingViewDetail',
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
    path: '/ownershipRegisterView',
    name: '权属登记一览表',
    component: () => import('@/views/ownershipManagement/ownershipRegisterView/index')
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
  }, {
    path: '/assetAssessRecord',
    name: '资产估值记录',
    component: () => import('@/views/financialManagement/worth-register/components/WorthRegisterRecord.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetWorthList',
    name: '资产价值一览表',
    component: () => import('@/views/financialManagement/worth-register/asset-worth-list/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/worthRegister',
    name: '价值登记',
    component: () => import('@/views/financialManagement/worth-register/index.vue'),
    meta: {
      keepAlive: true
    }
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
    path: '/disposalManagement/listDisposal/detail',
    name: '详情',
    component: () => import('@/views/disposalManagement/listDisposal/organContent/detail')
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
    meta: {
      keepAlive: true
    }
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
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/reportingList/details',
    name: '详情',
    component: () => import('@/views/reportingManagement/reportingRecordList/details.vue')
  }, {
    path: '/houseAssetAnalysis',
    name: '房屋资产统计分析',
    component: () => import('@/views/tableManagement/houseAssetAnalysis'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/projectData',
    name: '资产项目数据查询',
    component: () => import('@/views/tableManagement/projectDataSearch'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/projectData/assetProjectDetail',
    name: '资产项目详情',
    component: () => import('@/views/assetInformationManagement/asset-project-manage/components/ProjectDetailPage')
  }, {
    path: '/houseAssetStatistics',
    name: '有证房屋资产统计表',
    component: () => import('@/views/tableManagement/houseAssetStatistics'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/warrantAmountStatistics',
    name: '权证数量统计表',
    component: () => import('@/views/tableManagement/warrantAmountStatistics'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/ownershipCardList',
    name: '权属证件一览表',
    component: () => import('@/views/tableManagement/ownershipCardList'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/assetWorthStatistics',
    name: '资产价值统计表',
    component: () => import('@/views/tableManagement/assetWorthStatistics'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/assetIn',
    name: '资产入库',
    component: () => import('@/views/assetInformationManagement/assetIn/index.vue'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/assetIn/detail',
    name: '详情', // 资产入库详情
    component: () => import('@/views/assetInformationManagement/assetIn/DetailPage')
  }, {
    path: '/assetIn/approve',
    name: '审核', // 资产入库审核
    component: () => import('@/views/assetInformationManagement/assetIn/DetailPage')
  }, {
    path: '/assetIn/edit',
    name: '编辑', // 资产入库编辑
    component: () => import('@/views/assetInformationManagement/assetIn/EditPage')
  }, {
    path: '/assetIn/new',
    name: '新建', // 资产入库新建
    component: () => import('@/views/assetInformationManagement/assetIn/EditPage')
  },
  {
    path: '/assetStorageView',
    name: '资产入库一览表',
    component: () => import('@/views/assetInformationManagement/assetIn/assetInView.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/assetStorageView/detail',
    name: '详情', // 资产入库一览表详情
    component: () => import('@/views/assetInformationManagement/assetIn/assetInViewDetail/index')
  },
  {
    path: '/landAssetsView',
    name: '土地资产视图',
    component: () => import('@/views/landParameter/landAssetsView/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/landAssetsView/detail',
    name: '详情',
    component: () => import('@/views/landParameter/landAssetsView/components/landDetailPage.vue')
  },
  {
    path: '/landOrganView',
    name: '土地机构视图',
    component: () => import('@/views/landParameter/landOrganView/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/landOrganView/detail',
    name: '详情',
    component: () => import('@/views/landParameter/landOrganView/landOrganViewDetail.vue')
  },
  {
    path: '/landProjectView',
    name: '土地项目视图',
    component: () => import('@/views/landParameter/landProjectView/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/landProjectView/detail',
    name: '详情',
    component: () => import('@/views/landParameter/landProjectView/landProjectViewDetail.vue')
  },
  {
    path: '/assetMap',
    name: '资产地图',
    component: () => import('@/views/landParameter/assetMap/index')
  }, {
    path: '/assetTable',
    name: '资产出库一览表',
    component: () => import('@/views/assetInformationManagement/assetsTable/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetTable/detail',
    name: '资产出库一览表详情',
    component: () => import('@/views/assetInformationManagement/assetsTable/detail')
  },
  {
    path: '/resourcesReport',
    name: '房屋资产&资源统计表',
    component: () => import('@/views/tableManagement/resourcesReport/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/resourcesReport/assetDetails',
    name: '资产明细',
    component: () => import('@/views/tableManagement/resourcesReport/child/assetDetails')
  },
  {
    path: '/assetDelivery',
    name: '资产交付管理',
    component: () => import('@/views/usePlanning/assetDelivery/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetDelivery/newEditor',
    name: '新增',
    component: () => import('@/views/usePlanning/assetDelivery/child/newEditor')
  },
  {
    path: '/assetDelivery/editDelivery',
    name: '编辑',
    component: () => import('@/views/usePlanning/assetDelivery/child/editDelivery')
  },
  {
    path: '/assetDelivery/details',
    name: '详情',
    component: () => import('@/views/usePlanning/assetDelivery/child/details')
  },
  {
    path: '/assetDeliveryRecord',
    name: '资产交付记录',
    component: () => import('@/views/usePlanning/assetDeliveryRecord/index')
  },
  {
    path: '/patrolRecord',
    name: '巡查记录',
    component: () => import('@/views/usePlanning/patrol/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/patrolRecord/newEditor',
    name: '新增',
    component: () => import('@/views/usePlanning/patrol/child/newEditor')
  },
  {
    path: '/patrolRecord/edit',
    name: '编辑',
    component: () => import('@/views/usePlanning/patrol/child/edit')
  },
  {
    path: '/patrolRecord/details',
    name: '详情',
    component: () => import('@/views/usePlanning/patrol/child/details')
  },
  // {
  //   path: '/assetApply',
  //   name: '资产领用',
  //   component: () => import('@/views/assetApply/applyRegister/index')
  // },
  {
    path: '/applyRegister',
    name: '领用登记',
    component: () => import('@/views/assetApply/applyRegister/index'),
    meta: {
      keepAlive: true
    }

  },
  {
    path: '/assetApplyView',
    name: '资产领用一览表',
    component: () => import('@/views/assetApply/assetApplyView/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/returnRegister',
    name: '归还登记',
    component: () => import('@/views/assetApply/returnRegister/index'),
    meta: {
      keepAlive: true
    }

  },
  {
    path: '/assetReturnView',
    name: '资产归还一览表',
    component: () => import('@/views/assetApply/assetReturnView/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/assetRentView',
    name: '资产出租一览表',
    component: () => import('@/views/assetRent/assetRentView')
  },
  {
    path: '/rentRegister',
    name: '出租登记',
    component: () => import('@/views/assetRent/rentRegister/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/rentRegister/rentAdd',
    name: '出租单新建',
    component: () => import('@/views/assetRent/rentRegister/child/rentAdd')
  },
  {
    path: '/rentRegister/rentEdit',
    name: '出租单编辑',
    component: () => import('@/views/assetRent/rentRegister/child/rentEdit')
  },
  {
    path: '/rentRegister/rentApproval',
    name: '出租单审批',
    component: () => import('@/views/assetRent/rentRegister/child/rentApproval')
  },
  {
    path: '/rentRegister/rentDetail',
    name: '出租单详情',
    component: () => import('@/views/assetRent/rentRegister/child/rentDetail')
  },
  {
    path: '/rentGainsRegister',
    name: '出租收益登记',
    component: () => import('@/views/assetRent/rentGainsRegister/index')
  },
  {
    path: '/assetInvestmentView',
    name: '资产投资一览表',
    component: () => import('@/views/assetInvest/assetInvestmentView')
  },
  {
    path: '/investRegister',
    name: '投资登记',
    component: () => import('@/views/assetInvest/investRegister/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/investGainsRegister',
    name: '投资收益登记',
    component: () => import('@/views/assetInvest/investGainsRegister/index')
  },
  {
    path: '/repairRegister',
    name: '维修登记',
    component: () => import('@/views/assetRepair/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/repairRegister/repairAdd',
    name: '维修新建',
    component: () => import('@/views/assetRepair/child/repairAdd')
  },
  {
    path: '/repairRegister/repairEdit',
    name: '维修编辑',
    component: () => import('@/views/assetRepair/child/repairEdit')
  },
  {
    path: '/repairRegister/repairDetail',
    name: '维修详情',
    component: () => import('@/views/assetRepair/child/repairDetail')
  },
  {
    path: '/repairRegister/repairApproval',
    name: '维修单审批',
    component: () => import('@/views/assetRepair/child/repairApproval')
  },
  {
    path: '/applyRegister/new',
    name: '领用登记新增',
    component: () => import('@/views/assetApply/applyRegister/DetailPage')
  },
  {
    path: '/applyRegister/detail',
    name: '领用登记详情',
    component: () => import('@/views/assetApply/applyRegister/DetailPage')
  },
  {
    path: '/applyRegister/edit',
    name: '领用登记编辑',
    component: () => import('@/views/assetApply/applyRegister/DetailPage')
  },
  // {
  //   path: '/applyRegister/approval',
  //   name: '领用登记审批',
  //   component: () => import('@/views/assetApply/applyRegister/DetailPage')
  // },
  {
    path: '/assetApplyView/detail',
    name: '资产领用一览表详情',
    component: () => import('@/views/assetApply/assetApplyView/DetailPage')
  },
  {
    path: '/assetReturnView/detail',
    name: '资产归还一览表详情',
    component: () => import('@/views/assetApply/assetReturnView/DetailPage')
  },
  {
    path: '/returnRegister/detail',
    name: '归还登记详情',
    component: () => import('@/views/assetApply/returnRegister/DetailPage')
  },
  {
    path: '/returnRegister/new',
    name: '归还登记新增',
    component: () => import('@/views/assetApply/returnRegister/DetailPage')
  },
  {
    path: '/investRegister/new',
    name: '投资登记新增',
    component: () => import('@/views/assetInvest/investRegister/DetailPage')
  },
  {
    path: '/investRegister/detail',
    name: '投资登记详情',
    component: () => import('@/views/assetInvest/investRegister/DetailPage')
  },
  {
    path: '/investRegister/edit',
    name: '投资登记编辑',
    component: () => import('@/views/assetInvest/investRegister/DetailPage')
  },
  {
    path: '/returnRegister/edit',
    name: '归还登记编辑',
    component: () => import('@/views/assetApply/returnRegister/DetailPage')
  },
  {
    path: '/investRegister/approval',
    name: '投资登记审批',
    component: () => import('@/views/assetInvest/investRegister/DetailPage')
  },
  {
    path: '/returnRegister/approval',
    name: '归还登记审批',
    component: () => import('@/views/assetApply/returnRegister/DetailPage')
  },
  {
    path: '/applyRegister/approval',
    name: '领用登记审批',
    component: () => import('@/views/assetApply/applyRegister/DetailPage')
  },
  {
    path: '/applyRegister/approval',
    name: '领用登记审批',
    component: () => import('@/views/assetApply/applyRegister/DetailPage')
  },
]
export default proRouter
