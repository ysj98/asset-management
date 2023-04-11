/*
 * @Date: 2019-11-01 09:42:51
 * @Author: chen han
 * @Description:
 */
let proRouter = [
  {
    path: '/barcodeManagement',
    title: '条码管理',
    component: () => import('@/views/barcodeManagement/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetBarcode',
    title: '资产条码',
    component: () => import('@/views/assetBarcode/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/barcodePrint',
    title: '资产条码打印',
    component: () => import('@/views/barcodeManagement/barcodePrint.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/buildingDict',
    title: '楼盘字典',
    component: () => import('@/views/buildingDict/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/createBuildDetail',
    title: '楼栋详情',
    component: () => import('@/views/buildingDict/createBuild'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/buildingDict/createHouse',
    title: '新建房间',
    component: () => import('@/views/buildingDict/createHouse.vue'),
  },
  {
    path: '/buildingDict/editHouse',
    title: '编辑房间',
    component: () => import('@/views/buildingDict/editHouse.vue'),
  },
  {
    path: '/buildingDict/detailHouse',
    title: '房间详情',
    component: () => import('@/views/buildingDict/detailHouse.vue'),
  },
  {
    path: '/buildingDict/createLand',
    title: '新建土地',
    component: () => import('@/views/buildingDict/land/createLand.vue'),
  },
  {
    path: '/buildingDict/editLand',
    title: '编辑土地',
    component: () => import('@/views/buildingDict/land/editLand.vue'),
  },
  {
    path: '/buildingDict/detailLand',
    title: '土地详情',
    component: () => import('@/views/buildingDict/land/detailLand.vue'),
  },
  {
    path: '/buildingDict/createPark',
    title: '新建车场',
    component: () => import('@/views/buildingDict/park/createPark.vue'),
  },
  {
    path: '/buildingDict/editPark',
    title: '编辑车场',
    component: () => import('@/views/buildingDict/park/editPark.vue'),
  },
  {
    path: '/buildingDict/detailViewPark',
    title: '查看车场',
    component: () => import('@/views/buildingDict/park/detailViewPark.vue'),
  },
  {
    path: '/buildingDict/createStall',
    title: '新建车位',
    component: () => import('@/views/buildingDict/stall/createStall.vue'),
  },
  {
    path: '/buildingDict/editStall',
    title: '编辑车位',
    component: () => import('@/views/buildingDict/stall/editStall.vue'),
  },
  {
    path: '/buildingDict/detailViewStall',
    title: '查看车位',
    component: () => import('@/views/buildingDict/stall/detailViewStall.vue'),
  },
  {
    path: '/buildingDict/createEquipment',
    title: '新建设备',
    component: () => import('@/views/buildingDict/equipment/createEquipment.vue'),
  },
  {
    path: '/buildingDict/editEquipment',
    title: '编辑设备',
    component: () => import('@/views/buildingDict/equipment/editEquipment.vue'),
  },
  {
    path: '/buildingDict/detailViewEquipment',
    title: '查看设备',
    component: () => import('@/views/buildingDict/equipment/detailViewEquipment.vue'),
  },
  {
    path: '/assetCodingRule',
    title: '资产编码规则',
    component: () => import('@/views/assetCodingRule/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/mapDrawLand',
    title: '土地地图绘制',
    component: () => import('@/views/mapDrawLand/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/landAssetMap',
    title: '土地地图',
    component: () => import('@/views/landParameter/landAssetMap/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetOperationParameters',
    title: '资产转运营参数',
    component: () => import('@/views/assetOperationParameters/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetOperating',
    title: '资产转运营',
    component: () => import('@/views/assetOperating/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/listOfTransferCamps',
    title: '资产转运营一览表',
    component: () => import('@/views/assetOperating/assetOperatingView.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetOperating/edit',
    title: '资产转运营单编辑',
    component: () => import('@/views/assetOperating/addAndEditOperation.vue'),
    meta: {
      keepAlive: false,
    },
  },
  {
    path: '/assetOperating/add',
    title: '资产转运营单新增',
    component: () => import('@/views/assetOperating/addAndEditOperation.vue'),
    meta: {
      keepAlive: false,
    },
  },
  {
    path: '/assetOperating/detail',
    title: '资产转运营详情',
    component: () => import('@/views/assetOperating/operationDetail.vue'),
  },
  {
    path: '/assetManagementMode',
    title: '资产经营方式',
    component: () => import('@/views/assetManagementMode/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/anyAttrConfig',
    title: '资产业务属性配置',
    component: () => import('@/views/anyAttrConfig/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetBussinessInformation',
    title: '资产业务信息',
    component: () => import('@/views/assetBussinessInformation/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetChangeRegister',
    title: '资产变更单',
    component: () => import('@/views/assetInformationManagement/assetChange/assetsRegistration.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetChangeRegister/editSingle',
    title: '编辑变更单',
    component: () => import('@/views/assetInformationManagement/assetChange/editSingle.vue'),
  },
  {
    path: '/assetChangeRegister/newEditSingle',
    title: '新建变更单',
    component: () => import('@/views/assetInformationManagement/assetChange/newEditSingle.vue'),
  },
  {
    path: '/assetChangeRegister/particulars',
    title: '变更单详情',
    component: () => import('@/views/assetInformationManagement/assetChange/particulars.vue'),
  },
  {
    path: '/assetChangeView',
    title: '资产变更一览表',
    component: () => import('@/views/assetInformationManagement/assetChange/scheduleChanges.vue'),
  },
  {
    path: '/assetRegister',
    title: '资产登记',
    component: () => import('@/views/assetInformationManagement/assetRegister/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetCheckInView',
    title: '资产登记一览表',
    component: () => import('@/views/assetInformationManagement/assetRegister/assetRegisterView.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetCheckInView/detail',
    title: '资产登记一览表详情',
    component: () => import('@/views/assetInformationManagement/assetRegister/assetRegisterViewDetail/index.vue'),
  },
  {
    path: '/assetRegister/newEditSingle',
    title: '新建登记单',
    component: () => import('@/views/assetInformationManagement/assetRegister/child/newEditSingle.vue'),
  },
  {
    path: '/assetRegister/registerEdit',
    title: '编辑登记单',
    component: () => import('@/views/assetInformationManagement/assetRegister/child/registerEdit.vue'),
  },
  {
    path: '/assetRegister/particulars',
    title: '登记单详情',
    component: () => import('@/views/assetInformationManagement/assetRegister/particulars.vue'),
  },
  {
    path: '/assetClear',
    title: '资产出库',
    component: () => import('@/views/assetInformationManagement/assetClear/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetClear/new',
    title: '新建出库单',
    component: () => import('@/views/assetInformationManagement/assetClear/newClearForm.vue'),
  },
  {
    path: '/assetClear/edit',
    title: '编辑出库单',
    component: () => import('@/views/assetInformationManagement/assetClear/editClearForm.vue'),
  },
  {
    path: '/assetClear/audit',
    title: '出库单审核',
    component: () => import('@/views/assetInformationManagement/assetClear/auditClearForm.vue'),
  },
  {
    path: '/assetClear/detail',
    title: '出库单详情',
    component: () => import('@/views/assetInformationManagement/assetClear/checkClearForm.vue'),
  },
  {
    path: '/assetClear/H5',
    title: '出库单审核',
    component: () => import('@/views/assetInformationManagement/assetClear/clearH5.vue'),
  },
  {
    path: '/assetClassSet',
    title: '资产分类',
    component: () => import('@/views/assetInformationManagement/assetClassSet/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/paramsConfig',
    title: '资产参数配置',
    component: () => import('@/views/assetInformationManagement/paramsConfig/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetProjectManage',
    title: '资产项目管理',
    component: () => import('@/views/assetInformationManagement/asset-project-manage'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetProjectManage/assetProjectDetail',
    title: '资产项目管理详情',
    component: () => import('@/views/assetInformationManagement/asset-project-manage/components/ProjectDetailPage'),
  },
  {
    path: '/organView',
    title: '房屋机构视图',
    component: () => import('@/views/assetInformationManagement/house-account/organ-view/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/organView/detail',
    title: '详情',
    component: () => import('@/views/assetInformationManagement/house-account/organ-view/organViewDetail.vue'),
  },
  {
    path: '/assetProjectView',
    title: '房屋项目视图',
    component: () => import('@/views/assetInformationManagement/houseStandingBook/assetProjectViewList.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/houseStandingBook/assetProjectViewDetail',
    title: '房屋项目视图详情',
    component: () => import('@/views/assetInformationManagement/houseStandingBook/assetProjectViewDetail'),
  },
  {
    path: '/assetView',
    title: '房屋资产视图',
    component: () => import('@/views/assetInformationManagement/house-account/asset-view/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetView/assetViewDetail',
    title: '房屋资产视图详情',
    component: () => import('@/views/assetInformationManagement/house-account/asset-view/components/AssetDetailPage'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/buildingView',
    title: '楼栋视图',
    component: () => import('@/views/assetInformationManagement/house-account/building-view/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/buildingView/buildingViewDetail',
    title: '楼栋视图详情',
    component: () => import('@/views/assetInformationManagement/house-account/building-view/components/BuildingDetailPage'),
  },
  {
    path: '/propertyOwnerManagement',
    title: '权属人管理',
    component: () => import('@/views/ownershipManagement/propertyOwnerManagement/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/ownershipChangeLog',
    title: '权证变更日志管理',
    component: () => import('@/views/ownershipManagement/ownershipChangeLog/index.vue'),
  },
  {
    path: '/ownershipChangeLog/detail',
    title: '权证变更日志详情',
    component: () => import('@/views/ownershipManagement/ownershipChangeLog/detail.vue'),
  },
  {
    path: '/houseStatusConfig',
    title: '房屋状态设置',
    component: () => import('@/views/houseStatusConfig/index.vue'),
  },
  {
    path: '/ownershipRegistration',
    title: '权属登记',
    component: () => import('@/views/ownershipManagement/ownershipRegistration/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/ownershipRegistration/registrationNew',
    title: '新建登记申请',
    component: () => import('@/views/ownershipManagement/ownershipRegistration/registrationNew.vue'),
  },
  {
    path: '/ownershipRegistration/registrationParticulars',
    title: '权属登记详情',
    component: () => import('@/views/ownershipManagement/ownershipRegistration/registrationParticulars.vue'),
  },
  {
    path: '/ownershipRegisterView',
    title: '权属登记一览表',
    component: () => import('@/views/ownershipManagement/ownershipRegisterView/index'),
  },
  {
    path: '/authorityCardManagement',
    title: '权证管理',
    component: () => import('@/views/ownershipManagement/authorityCardManagement/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/authorityCardInfo',
    title: '权证详情',
    component: () => import('@/views/ownershipManagement/authorityCardManagement/cardDetails.vue'),
    meta: {
      keepAlive: false,
    },
  },
  {
    path: '/assetEntry',
    title: '资产入账',
    component: () => import('@/views/financialManagement/assetEntry/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetEntry/new',
    title: '新建',
    component: () => import('@/views/financialManagement/assetEntry/newAssetEntry.vue'),
  },
  {
    path: '/assetEntry/edit',
    title: '编辑',
    component: () => import('@/views/financialManagement/assetEntry/editAssetEntry.vue'),
  },
  {
    path: '/assetEntry/audit',
    title: '审核',
    component: () => import('@/views/financialManagement/assetEntry/auditAssetEntry.vue'),
  },
  {
    path: '/assetEntry/detail',
    title: '详情',
    component: () => import('@/views/financialManagement/assetEntry/checkAssetEntry.vue'),
  },
  {
    path: '/ownershipSurvey',
    title: '权属概况',
    component: () => import('@/views/ownershipManagement/ownershipSurvey/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/ownershipSurvey/projectDetail',
    title: '资产项目权属详情',
    component: () => import('@/views/ownershipManagement/ownershipSurvey/projectOwnershipDetail.vue'),
  },
  {
    path: '/ownershipSurvey/projectSet',
    title: '资产项目权属设置',
    component: () => import('@/views/ownershipManagement/ownershipSurvey/projectOwnershipSet.vue'),
  },
  {
    path: '/ownershipSurvey/assetOwnershipDetail',
    title: '资产权属详情',
    component: () => import('@/views/ownershipManagement/ownershipSurvey/assetOwnershipDetail.vue'),
  },
  {
    path: '/assetAssessRecord',
    title: '资产估值记录',
    component: () => import('@/views/financialManagement/worth-register/components/WorthRegisterRecord.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetWorthList',
    title: '资产价值一览表',
    component: () => import('@/views/financialManagement/worth-register/asset-worth-list/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/worthRegister',
    title: '价值登记',
    name: '价值登记',
    component: () => import('@/views/financialManagement/worth-register/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetView/assetViewDetail/detailRegister',
    title: '资产价值详情',
    name: '资产价值详情',
    component: () => import('@/views/financialManagement/worth-register/asset-worth-register/components/DetailPage'),
  },
  {
    path: '/worthRegister/detailRegister',
    title: '价值登记详情',
    name: '价值登记详情',
    component: () => import('@/views/financialManagement/worth-register/asset-worth-register/components/DetailPage'),
  },
  {
    path: '/worthRegister/editRegister',
    title: '价值登记编辑',
    name: '价值登记编辑',
    component: () => import('@/views/financialManagement/worth-register/asset-worth-register/components/DetailPage'),
  },
  {
    path: '/worthRegister/addRegister',
    title: '价值登记新增',
    name: '价值登记新增',
    component: () => import('@/views/financialManagement/worth-register/asset-worth-register/components/DetailPage'),
  },
  {
    path: '/worthRegister/approvalRegister',
    title: '价值登记审批',
    name: '价值登记审批',
    component: () => import('@/views/financialManagement/worth-register/asset-worth-register/components/DetailPage'),
  },
  {
    path: '/transfer',
    title: '资产转让',
    component: () => import('@/views/disposalManagement/transfer/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/transfer/add',
    title: '新增资产转让',
    component: () => import('@/views/disposalManagement/transfer/createTransfer.vue'),
  },
  {
    path: '/transfer/edit',
    title: '编辑资产转让',
    component: () => import('@/views/disposalManagement/transfer/editTransfer.vue'),
  },
  {
    path: '/transfer/detail',
    title: '资产转让详情',
    component: () => import('@/views/disposalManagement/transfer/detailTransfer.vue'),
  },
  {
    path: '/transfer/approve',
    title: '资产转让审批',
    component: () => import('@/views/disposalManagement/transfer/approveTransfer.vue'),
  },
  {
    path: '/approvalTransferProject',
    title: '资产转让立项',
    component: () => import('@/views/disposalManagement/approvalTransferProject/index.vue'),
  },
  {
    path: '/approvalTransferProject/add',
    title: '新增资产转让立项',
    component: () => import('@/views/disposalManagement/approvalTransferProject/createTransfer.vue'),
  },
  {
    path: '/approvalTransferProject/edit',
    title: '编辑资产转让立项',
    component: () => import('@/views/disposalManagement/approvalTransferProject/editTransfer.vue'),
  },
  {
    path: '/approvalTransferProject/detail',
    title: '资产转让立项详情',
    component: () => import('@/views/disposalManagement/approvalTransferProject/detailTransfer.vue'),
  },
  {
    path: '/approvalTransferProject/approve',
    title: '资产转让立项审批',
    component: () => import('@/views/disposalManagement/approvalTransferProject/approveTransfer.vue'),
  },
  {
    path: '/allot',
    title: '资产调拨',
    component: () => import('@/views/disposalManagement/allot/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/allot/add',
    title: '新增资产调拨',
    component: () => import('@/views/disposalManagement/allot/create.vue'),
  },
  {
    path: '/allot/edit',
    title: '编辑资产调拨',
    component: () => import('@/views/disposalManagement/allot/edit.vue'),
  },
  {
    path: '/allot/detail',
    title: '资产调拨详情',
    component: () => import('@/views/disposalManagement/allot/detail.vue'),
  },
  {
    path: '/allot/approve',
    title: '资产调拨审批',
    component: () => import('@/views/disposalManagement/allot/approve.vue'),
  },
  {
    path: '/disposalRegister',
    title: '处置登记',
    component: () => import('@/views/disposalManagement/disposalRegister/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/disposalRegister/create',
    title: '新增处置登记',
    component: () => import('@/views/disposalManagement/disposalRegister/createRegister'),
  },
  {
    path: '/disposalRegister/edit',
    title: '编辑处置登记',
    component: () => import('@/views/disposalManagement/disposalRegister/editRegister'),
  },
  {
    path: '/disposalRegister/detail',
    title: '详情处置登记',
    component: () => import('@/views/disposalManagement/disposalRegister/detailRegister'),
  },
  {
    path: '/disposalRegister/approval',
    title: '审批处置登记',
    component: () => import('@/views/disposalManagement/disposalRegister/approvalRegister'),
  },
  {
    path: '/disposalRegister/detailH5',
    title: '详情处置登记',
    component: () => import('@/views/disposalManagement/disposalRegister/disposalH5'),
  },
  {
    path: '/disposalManagement/listDisposal',
    title: '资产处置一览表',
    component: () => import('@/views/disposalManagement/listDisposal/index'),
  },
  {
    path: '/disposalManagement/listDisposal/detail',
    title: '详情',
    component: () => import('@/views/disposalManagement/listDisposal/organContent/detail'),
  },
  {
    path: '/inventoryManagement/countingTask',
    title: '盘点任务',
    component: () => import('@/views/inventoryManagement/countingTask/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/inventoryManagement/countingTask/newEditor',
    title: '生成盘点单',
    component: () => import('@/views/inventoryManagement/countingTask/newEditor'),
  },
  {
    path: '/inventoryManagement/countingTask/detail',
    title: '详情',
    meta: {
      keepAlive: true,
    },
    component: () => import('@/views/inventoryManagement/countingTask/detail'),
  },
  {
    path: '/inventoryManagement/countingTask/detail/report',
    title: '盘点报告详情',
    component: () => import('@/views/inventoryManagement/countingTask/report'),
  },
  {
    path: '/inventoryManagement/countingTask/detail/inventoryDetails',
    title: '盘点单详情',
    component: () => import('@/views/inventoryManagement/countingTask/inventoryDetails'),
  },
  {
    path: '/inventoryManagement/inventoryReport',
    title: '盘点报告',
    component: () => import('@/views/inventoryManagement/inventoryReport/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/inventoryManagement/inventoryReport/new',
    title: '新建',
    component: () => import('@/views/inventoryManagement/inventoryReport/newInventoryReport'),
  },
  {
    path: '/inventoryManagement/inventoryReport/edit',
    title: '编辑',
    component: () => import('@/views/inventoryManagement/inventoryReport/editInventoryReport'),
  },
  {
    path: '/inventoryManagement/inventoryReport/audit',
    title: '审核',
    component: () => import('@/views/inventoryManagement/inventoryReport/auditInventoryReport'),
  },
  {
    path: '/inventoryManagement/inventoryReport/detail',
    title: '详情',
    component: () => import('@/views/inventoryManagement/inventoryReport/checkInventoryReport'),
  },
  {
    path: '/inventoryManagement/exceptionManagement',
    title: '异常管理',
    component: () => import('@/views/inventoryManagement/exceptionManagement/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/inventoryManagement/exceptionManagement/handle',
    title: '处理',
    component: () => import('@/views/inventoryManagement/exceptionManagement/handleException'),
  },
  {
    path: '/inventoryManagement/exceptionManagement/detail',
    title: '详情',
    component: () => import('@/views/inventoryManagement/exceptionManagement/checkException'),
  },
  {
    path: '/inventoryManagement/inventoryPerform',
    title: '盘点执行',
    component: () => import('@/views/inventoryManagement/inventoryPerform/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/inventoryManagement/inventoryPerform/detail',
    title: '盘点执行详情',
    component: () => import('@/views/inventoryManagement/inventoryPerform/detail'),
  },
  {
    path: '/inventoryManagement/inventoryPerform/register',
    title: '盘点结果登记',
    component: () => import('@/views/inventoryManagement/inventoryPerform/register'),
  },
  {
    path: '/inventoryPlan',
    title: '盘点计划',
    component: () => import('@/views/inventoryManagement/inventoryPlan/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/inventoryPlan/create',
    title: '新建盘点计划',
    component: () => import('@/views/inventoryManagement/inventoryPlan/createPlan'),
  },
  {
    path: '/inventoryPlan/edit',
    title: '编辑盘点计划',
    component: () => import('@/views/inventoryManagement/inventoryPlan/editPlan'),
  },
  {
    path: '/inventoryPlan/detail',
    title: '详情盘点计划',
    component: () => import('@/views/inventoryManagement/inventoryPlan/detailPlan'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/inventoryPlan/approval',
    title: '审批盘点计划',
    component: () => import('@/views/inventoryManagement/inventoryPlan/approvalPlan'),
  },
  {
    path: '/inventoryPlan/detail/taskDetail',
    title: '盘点任务详情',
    component: () => import('@/views/inventoryManagement/inventoryPlan/taskDetail'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/inventoryPlan/detail/taskDetail/implementDetail',
    title: '盘点单详情',
    component: () => import('@/views/inventoryManagement/inventoryPlan/implementDetail'),
  },
  {
    path: '/inventoryPlan/detail/taskDetail/reportDetail',
    title: '盘点报告详情',
    component: () => import('@/views/inventoryManagement/inventoryPlan/reportDetail'),
  },
  {
    path: '/subsidiary',
    title: '附属配套管理',
    component: () => import('@/views/assetInformationManagement/assetSubsidiary/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/subsidiary/create',
    title: '新建附属配套',
    component: () => import('@/views/assetInformationManagement/assetSubsidiary/createSubsidiary'),
  },
  {
    path: '/subsidiary/edit',
    title: '编辑附属配套',
    component: () => import('@/views/assetInformationManagement/assetSubsidiary/editSubsidiary'),
  },
  {
    path: '/subsidiary/detail',
    title: '附属配套详情',
    component: () => import('@/views/assetInformationManagement/assetSubsidiary/detailSubsidiay'),
  },
  {
    path: '/reportingManagement/submitForm',
    title: '呈报表单',
    component: () => import('@/views/reportingManagement/submitForm/index.vue'),
  },
  {
    path: '/reportingManagement/submitForm/details',
    title: '详情',
    component: () => import('@/views/reportingManagement/submitForm/details.vue'),
  },
  {
    path: '/reportingManagement/submitPlans',
    title: '呈报计划',
    component: () => import('@/views/reportingManagement/submitPlans/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/reportingManagement/submitPlans/newPlan',
    title: '新建',
    component: () => import('@/views/reportingManagement/submitPlans/newPlan.vue'),
  },
  {
    path: '/reportingManagement/submitPlans/editPlan',
    title: '编辑',
    component: () => import('@/views/reportingManagement/submitPlans/editPlan.vue'),
  },
  {
    path: '/reportingManagement/submitPlans/details',
    title: '详情',
    component: () => import('@/views/reportingManagement/submitPlans/details.vue'),
  },
  {
    path: '/reportingRecord',
    title: '资产呈报记录',
    component: () => import('@/views/reportingManagement/reportingRecord/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/reportingRecord/details',
    title: '详情',
    component: () => import('@/views/reportingManagement/reportingRecord/details.vue'),
  },
  {
    path: '/reportTask',
    title: '呈报任务',
    name: '呈报任务',
    component: () => import('@/views/reportingManagement/reportTask'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/reportTask/editTask',
    title: '填报数据',
    component: () => import('@/views/reportingManagement/reportTask/editTask/EditTask'),
  },
  {
    path: '/reportTask/newTask',
    title: '新建任务',
    component: () => import('@/views/reportingManagement/reportTask/editTask/NewTask'),
  },
  {
    path: '/reportTask/approveTask',
    title: '审核任务',
    component: () => import('@/views/reportingManagement/reportTask/approveTask/ApproveTask'),
  },
  {
    path: '/reportTask/taskDetail',
    title: '任务详情',
    component: () => import('@/views/reportingManagement/reportTask/components/TaskDetail'),
  },
  {
    path: '/taskQuery',
    title: '任务查询',
    component: () => import('@/views/reportingManagement/taskQuery/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/taskQuery/details',
    title: '详情',
    component: () => import('@/views/reportingManagement/taskQuery/details.vue'),
  },
  {
    path: '/reportingList',
    title: '呈报记录一览表',
    component: () => import('@/views/reportingManagement/reportingRecordList'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/reportingList/details',
    title: '详情',
    component: () => import('@/views/reportingManagement/reportingRecordList/details.vue'),
  },
  {
    path: '/houseAssetAnalysis',
    title: '房屋资产统计分析',
    component: () => import('@/views/tableManagement/houseAssetAnalysis'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/projectData',
    title: '资产项目数据查询',
    component: () => import('@/views/tableManagement/projectDataSearch'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/projectData/assetProjectDetail',
    title: '资产项目详情',
    component: () => import('@/views/assetInformationManagement/asset-project-manage/components/ProjectDetailPage'),
  },
  {
    path: '/houseAssetStatistics',
    title: '有证房屋资产统计表',
    component: () => import('@/views/tableManagement/houseAssetStatistics'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/warrantAmountStatistics',
    title: '权证数量统计表',
    component: () => import('@/views/tableManagement/warrantAmountStatistics'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/ownershipCardList',
    title: '权属证件一览表',
    component: () => import('@/views/tableManagement/ownershipCardList'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetWorthStatistics',
    title: '资产价值统计表',
    component: () => import('@/views/tableManagement/assetWorthStatistics'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/credentialsCheck',
    title: '有证面积不匹对核查报表',
    component: () => import('@/views/tableManagement/credentialsCheck'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetIn',
    title: '资产入库',
    component: () => import('@/views/assetInformationManagement/assetIn/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetIn/detail',
    title: '详情', // 资产入库详情
    component: () => import('@/views/assetInformationManagement/assetIn/DetailPage'),
  },
  {
    path: '/assetIn/printDetail',
    title: '详情', // 资产入库详情打印页面
    component: () => import('@/views/assetInformationManagement/assetIn/DetailPrintPage'),
    meta: {
      noShowProBreadNav: true,
    },
  },
  {
    path: '/assetIn/approve',
    title: '审核', // 资产入库审核
    component: () => import('@/views/assetInformationManagement/assetIn/DetailPage'),
  },
  {
    path: '/assetIn/approveH5',
    title: 'h5审核', // 资产入库审核
    component: () => import('@/views/assetInformationManagement/assetIn/DetailH5'),
  },
  {
    path: '/assetIn/edit',
    title: '编辑', // 资产入库编辑
    component: () => import('@/views/assetInformationManagement/assetIn/EditPage'),
  },
  {
    path: '/assetIn/new',
    title: '新建', // 资产入库新建
    component: () => import('@/views/assetInformationManagement/assetIn/EditPage'),
  },
  {
    path: '/assetStorageView',
    title: '资产入库一览表',
    component: () => import('@/views/assetInformationManagement/assetIn/assetInView.vue'),
    meta: { keepAlive: true },
  },
  {
    path: '/assetStorageView/detail',
    title: '详情', // 资产入库一览表详情
    component: () => import('@/views/assetInformationManagement/assetIn/assetInViewDetail/index'),
  },
  {
    path: '/landAssetsView',
    title: '土地资产视图',
    component: () => import('@/views/landParameter/landAssetsView/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/landAssetsView/detail',
    title: '详情',
    component: () => import('@/views/landParameter/landAssetsView/components/landDetailPage.vue'),
  },
  {
    path: '/landOrganView',
    title: '土地机构视图',
    component: () => import('@/views/landParameter/landOrganView/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/landOrganView/detail',
    title: '详情',
    component: () => import('@/views/landParameter/landOrganView/landOrganViewDetail.vue'),
  },
  {
    path: '/landProjectView',
    title: '土地项目视图',
    component: () => import('@/views/landParameter/landProjectView/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/landProjectView/detail',
    title: '详情',
    component: () => import('@/views/landParameter/landProjectView/landProjectViewDetail.vue'),
  },
  {
    path: '/assetMap',
    title: '资产地图',
    component: () => import('@/views/landParameter/assetMap/index'),
  },
  {
    path: '/assetTable',
    title: '资产出库一览表',
    component: () => import('@/views/assetInformationManagement/assetsTable/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetTable/detail',
    title: '资产出库一览表详情',
    component: () => import('@/views/assetInformationManagement/assetsTable/detail'),
  },
  {
    path: '/resourcesReport',
    title: '房屋资产&资源统计表',
    component: () => import('@/views/tableManagement/resourcesReport/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/resourcesReport/assetDetails',
    title: '资产明细',
    component: () => import('@/views/tableManagement/resourcesReport/child/assetDetails'),
  },
  {
    path: '/assetDelivery',
    title: '资产交付管理',
    component: () => import('@/views/usePlanning/assetDelivery/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetDelivery/newEditor',
    title: '新增',
    component: () => import('@/views/usePlanning/assetDelivery/child/newEditor'),
  },
  {
    path: '/assetDelivery/editDelivery',
    title: '编辑',
    component: () => import('@/views/usePlanning/assetDelivery/child/editDelivery'),
  },
  {
    path: '/assetDelivery/details',
    title: '详情',
    component: () => import('@/views/usePlanning/assetDelivery/child/details'),
  },
  {
    path: '/assetDeliveryRecord',
    title: '资产交付记录',
    component: () => import('@/views/usePlanning/assetDeliveryRecord/index'),
  },
  {
    path: '/patrolRecord',
    title: '巡查记录',
    component: () => import('@/views/usePlanning/patrol/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/patrolRecord/newEditor',
    title: '新增',
    component: () => import('@/views/usePlanning/patrol/child/newEditor'),
  },
  {
    path: '/patrolRecord/edit',
    title: '编辑',
    component: () => import('@/views/usePlanning/patrol/child/edit'),
  },
  {
    path: '/patrolRecord/details',
    title: '详情',
    component: () => import('@/views/usePlanning/patrol/child/details'),
  },
  // {
  //   path: '/assetApply',
  //   title: '资产领用',
  //   component: () => import('@/views/assetApply/applyRegister/index')
  // },
  {
    path: '/applyRegister',
    title: '领用登记',
    name: '领用登记',
    component: () => import('@/views/assetApply/applyRegister/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetApplyView',
    title: '资产领用一览表',
    component: () => import('@/views/assetApply/assetApplyView/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/returnRegister',
    title: '归还登记',
    name: '归还登记',
    component: () => import('@/views/assetApply/returnRegister/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetReturnView',
    title: '资产归还一览表',
    component: () => import('@/views/assetApply/assetReturnView/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetRentView',
    title: '资产出租一览表',
    component: () => import('@/views/assetRent/assetRentView'),
  },
  {
    path: '/rentRegister',
    title: '出租登记',
    component: () => import('@/views/assetRent/rentRegister/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/rentRegister/rentAdd',
    title: '出租单新建',
    component: () => import('@/views/assetRent/rentRegister/child/rentAdd'),
  },
  {
    path: '/rentRegister/rentEdit',
    title: '出租单编辑',
    component: () => import('@/views/assetRent/rentRegister/child/rentEdit'),
  },
  {
    path: '/rentRegister/rentApproval',
    title: '出租单审批',
    component: () => import('@/views/assetRent/rentRegister/child/rentApproval'),
  },
  {
    path: '/rentRegister/rentDetail',
    title: '出租单详情',
    component: () => import('@/views/assetRent/rentRegister/child/rentDetail'),
  },
  {
    path: '/rentGainsRegister',
    title: '出租收益登记',
    component: () => import('@/views/assetRent/rentGainsRegister/index'),
  },
  {
    path: '/assetInvestmentView',
    title: '资产投资一览表',
    component: () => import('@/views/assetInvest/assetInvestmentView'),
  },
  {
    path: '/investRegister',
    title: '投资登记',
    name: '投资登记',
    component: () => import('@/views/assetInvest/investRegister/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/investGainsRegister',
    title: '投资收益登记',
    component: () => import('@/views/assetInvest/investGainsRegister/index'),
  },
  {
    path: '/repairRegister',
    title: '维修登记',
    component: () => import('@/views/assetRepair/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/repairRegister/repairAdd',
    title: '维修新建',
    component: () => import('@/views/assetRepair/child/repairAdd'),
  },
  {
    path: '/repairRegister/repairEdit',
    title: '维修编辑',
    component: () => import('@/views/assetRepair/child/repairEdit'),
  },
  {
    path: '/repairRegister/repairDetail',
    title: '维修详情',
    component: () => import('@/views/assetRepair/child/repairDetail'),
  },
  {
    path: '/repairRegister/repairApproval',
    title: '维修单审批',
    component: () => import('@/views/assetRepair/child/repairApproval'),
  },
  {
    path: '/applyRegister/new',
    title: '领用登记新增',
    name: '领用登记新增',
    component: () => import('@/views/assetApply/applyRegister/DetailPage'),
  },
  {
    path: '/applyRegister/detail',
    title: '领用登记详情',
    name: '领用登记详情',
    component: () => import('@/views/assetApply/applyRegister/DetailPage'),
  },
  {
    path: '/applyRegister/edit',
    title: '领用登记编辑',
    name: '领用登记编辑',
    component: () => import('@/views/assetApply/applyRegister/DetailPage'),
  },
  {
    path: '/assetApplyView/detail',
    title: '资产领用一览表详情',
    component: () => import('@/views/assetApply/assetApplyView/DetailPage'),
  },
  {
    path: '/assetReturnView/detail',
    title: '资产归还一览表详情',
    component: () => import('@/views/assetApply/assetReturnView/DetailPage'),
  },
  {
    path: '/returnRegister/detail',
    title: '归还登记详情',
    name: '归还登记详情',
    component: () => import('@/views/assetApply/returnRegister/DetailPage'),
  },
  {
    path: '/returnRegister/new',
    title: '归还登记新增',
    name: '归还登记新增',
    component: () => import('@/views/assetApply/returnRegister/DetailPage'),
  },
  {
    path: '/investRegister/new',
    title: '投资登记新增',
    name: '投资登记新增',
    component: () => import('@/views/assetInvest/investRegister/DetailPage'),
  },
  {
    path: '/investRegister/detail',
    title: '投资登记详情',
    name: '投资登记详情',
    component: () => import('@/views/assetInvest/investRegister/DetailPage'),
  },
  {
    path: '/investRegister/edit',
    title: '投资登记编辑',
    name: '投资登记编辑',
    component: () => import('@/views/assetInvest/investRegister/DetailPage'),
  },
  {
    path: '/returnRegister/edit',
    title: '归还登记编辑',
    name: '归还登记编辑',
    component: () => import('@/views/assetApply/returnRegister/DetailPage'),
  },
  {
    path: '/investRegister/approval',
    title: '投资登记审批',
    name: '投资登记审批',
    component: () => import('@/views/assetInvest/investRegister/DetailPage'),
  },
  {
    path: '/returnRegister/approval',
    title: '归还登记审批',
    name: '归还登记审批',
    component: () => import('@/views/assetApply/returnRegister/DetailPage'),
  },
  {
    path: '/applyRegister/approval',
    title: '领用登记审批',
    name: '领用登记审批',
    component: () => import('@/views/assetApply/applyRegister/DetailPage'),
  },
  {
    path: '/organCarPrakView',
    title: '组织机构视图',
    component: () => import('@/views/assetInformationManagement/carPark/OrganCarPrakView'),
  },
  {
    path: '/equipmentprojectview',
    title: '设备设施项目视图',
    component: () => import('@/views/equipmentview/projectview/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/equipmentprojectview/detail',
    title: '设备设施项目视图详情',
    component: () => import('@/views/equipmentview/projectview/detail.vue'),
  },
  {
    path: '/equipmentview',
    title: '设备设施资产视图',
    component: () => import('@/views/equipmentview/assetview/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/equipmentview/detail',
    title: '设备设施资产视图详情',
    component: () => import('@/views/equipmentview/assetview/detail.vue'),
  },
  {
    path: '/organCarPrakView/detail',
    title: '组织机构视图详情',
    component: () => import('@/views/assetInformationManagement/carPark/OrganCarPrakDetail'),
  },
  {
    path: '/carPrakProjectView',
    title: '车场项目视图',
    component: () => import('@/views/assetInformationManagement/carPark/CarParkProjectView'),
  },
  {
    path: '/carPrakProjectView/detail',
    title: '车场项目视图详情',
    component: () => import('@/views/assetInformationManagement/carPark/CarParkProjectDetail'),
  },
  {
    path: '/assetCarPrakView',
    title: '车场资产视图',
    component: () => import('@/views/assetInformationManagement/carPark/AssetCarPrakView'),
  },
  {
    path: '/assetCarPrakView/detail',
    title: '车场资产视图详情',
    component: () => import('@/views/assetInformationManagement/carPark/AssetCarPrakDetail'),
  },
  {
    path: '/carPrakView',
    title: '车场视图',
    component: () => import('@/views/assetInformationManagement/carPark/CarPrakView'),
  },
  {
    path: '/carPrakView/detail',
    title: '车场视图详情',
    component: () => import('@/views/assetInformationManagement/carPark/CarPrakDetail'),
  },
  {
    path: '/insuranceManagement',
    title: '保险管理',
    component: () => import('@/views/insuranceManagement'),
  },
  {
    path: '/insuranceManagement/insurancePolicy',
    title: '资产保险单',
    component: () => import('@/views/insuranceManagement'),
    meta: {
      comtitle: 'AssetInsurancePolicy',
    },
  },
  {
    path: '/insuranceManagement/insurancePolicy/addInsurancePolicy',
    title: '新增',
    component: () => import('@/views/insuranceManagement/assetInsurancePolicy/AddAssetInsurancePolicy'),
  },
  {
    path: '/insuranceManagement/insurancePolicy/deit',
    title: '编辑',
    component: () => import('@/views/insuranceManagement/assetInsurancePolicy/EditAssetInsurancePolicy'),
  },
  {
    path: '/insuranceManagement/insurancePolicy/insurancePolicyDetail',
    title: '详情',
    component: () => import('@/views/insuranceManagement/assetInsurancePolicy/AssetInsurancePolicyDetail'),
  },
  {
    path: '/assetView/assetViewDetail/insurancePolicyDetail',
    title: '资产保险详情',
    component: () => import('@/views/insuranceManagement/assetInsurancePolicy/AssetInsurancePolicyDetail'),
  },
  {
    path: '/insuranceManagement/insuranceSchedule',
    title: '资产保险一览表',
    component: () => import('@/views/insuranceManagement'),
    meta: {
      comtitle: 'AssetInsuranceSchedule',
    },
  },
  {
    path: '/insuranceManagement/insuranceSchedule/detail',
    title: '详情',
    component: () => import('@/views/insuranceManagement/assetInsuranceSchedule/AssetInsuranceScheduleDetail'),
  },
  {
    path: '/approve',
    title: '通用审批',
    component: () => import('@/views/approve/index.vue'),
    meta: {
      noShowProBreadNav: true,
    },
  },
  {
    path: '/projectManager',
    title: '资产项目责任人管理',
    component: () => import('@/views/projectManager/index.vue'),
  },
  {
    path: '/assetUsageList',
    title: '资产使用一览表',
    component: () => import('@/views/assetUsageList/index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/assetUsageList/UsageListOrganViewDetail',
    title: '房屋机构视图详情',
    component: () => import('@/views/assetInformationManagement/house-account/organ-view/organViewDetail.vue'),
  },
  {
    path: '/assetUsageList/landViewUsageList',
    title: '土地机构视图详情',
    component: () => import('@/views/landParameter/landOrganView/landOrganViewDetail.vue'),
  },
  {
    path: '/assetUsageList/projectViewDetail',
    title: '房屋项目视图详情',
    component: () => import('@/views/assetInformationManagement/houseStandingBook/assetProjectViewDetail'),
  },
  {
    path: '/assetUsageList/landProjectUsageList',
    title: '土地项目视图',
    component: () => import('@/views/landParameter/landProjectView/landProjectViewDetail.vue'),
  },
  {
    path: '/assetUsageList/usageListAssetView',
    title: '房屋资产视图详情',
    component: () => import('@/views/assetInformationManagement/house-account/asset-view/components/AssetDetailPage'),
  },
  {
    path: '/assetUsageList/usageListViewDetail',
    title: '土地资产视图',
    component: () => import('@/views/landParameter/landAssetsView/components/landDetailPage.vue'),
  },
  {
    path: '/assetUsageList/scheduleOf',
    title: '明细表',
    component: () => import('@/views/assetUsageList/scheduleOf.vue'),
  },
  {
    path: '/debt',
    title: '资产债务登记',
    component: () => import('@/views/assetDebtRegistration/index.vue'),
  },
  {
    path: '/debt/creatDebt',
    title: '新增资产债务登记',
    component: () => import('@/views/assetDebtRegistration/creatDebt.vue'),
  },
  {
    path: '/debt/editDebt',
    title: '编辑资产债务登记',
    component: () => import('@/views/assetDebtRegistration/creatDebt.vue'),
  },
  {
    path: '/debt/detailDebt',
    title: '资产债务登记详情',
    component: () => import('@/views/assetDebtRegistration/detailDebt.vue'),
  },
];
export default proRouter;
