/*
 * @fileName: Do not edit
 * @Author: han
 * @createTime: Do not edit
 * @desc: Do not Edit
 */
/**
 * 描述：URL 接口地址配置
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */
import host from './config.base.js'

let mock = process.env.NODE_ENV === 'production' ? '' : ''
mock = ''
export const User = {
  // 登录
  login: '/uhomecp-sso/v3/propertyUser/login',
  // 获取用户数据
  getUserData: '/uhomecp-sso/v3/propertyUser/profile',
  // 获取菜单数据
  menus: '/uhomecp-sso/v3/propertyUser/menus',
  // 获取权限数据
  popedomCode: '/uhomecp-sso/v3/propertyUser/popedomCode',
}

export const Global = {
  // 文件上传
  fileUpload: '/uhomecp-app/common/oneFileUpload.json'
}

// 基础数据接口
export const basics = {
  common: {
    // 图片预览地址
    imgStr: host.hostImg,
  },
  // 文件上传
  fileUpload: '/basic-data-batch-api/rest-api/v1/fileApi/fileUpload',
  // 文件下载
  fileDownLoad: '/basic-data-batch-api/rest-api/v1/fileApi/fileDownLoad',
  // 文件下载
  // fileDownLoad: '/uis/fileApi/fileDownLoad',
  // 查询所有一级物业
  queryAllTopOrganByUser: '/basic-data-api/rest-api/v1/organInfo/queryAllTopOrganByUser',
  // 请求楼栋单元
  getOptions: '/basic-data-api/rest-api/v1/common/getOptions',
  // 请求业态类型
  queryNodesByRootCode: '/basic-data-api/rest-api/v1/professionType/queryNodesByRootCode',
  // 建筑形态
  queryChildNodesById: '/basic-data-api/rest-api/v1/professionType/queryChildNodesById',
  // 查询省列表
  queryProvinceList: '/basic-data-api/rest-api/v1/regionApi/queryProvinceList',
  /* 查询市、区、街道办 */
  queryCityAndAreaList: '/basic-data-api/rest-api/v1/regionApi/queryRegionByPId',
  // 按照一级物业公司查询楼栋列表
  queryBuildList: '/basic-data-api/rest-api/v1/ams/buildApi/queryBuildList',
  // 请求楼层
  queryFloorListByPosId: '/basic-data-api/rest-api/v1/floorApi/queryFloorListByPosId',
  // 03_通过字典code和groupId(集团一级组织ID)查询字典列表信息
  queryDictDataList: '/basic-data-api/rest-api/v1/dictApi/queryDictDataList',
  // 平台字典
  platformDict: '/ams/assetDict/platformDict',
  // 机构字典
  organDict: '/ams/assetDict/organDict'
}

// 资产管理
export const assets = {
  project: {
    // 图片预览地址
    getProject: '/getProject',
    // 异步组织机构树 组织机构管理 POST
    queryAsynOrganByUserId: '/basic-data-api/rest-api/v1/organApi/queryAsynOrganByUserId',
    // --------项目下拉-------
    getObjectKeyValueByOrganId: '/ams/project/getObjectKeyValueByOrganId',
    // 机构字典
    organDict: '/ams/assetDict/organDict',
    // 平台字典
    platformDict: '/ams/assetDict/platformDict',
    // 查询资产分类列表
    getList: '/ams/categoryCfg/getList'
  },
  // 资产变动
  management: {
    // 资产变动-一览表-分页列表
    getChangeSchedulePage: '/ams/assetChange/getChangeSchedulePage',
    // 资产变动-详情
    getChangeDetail: '/ams/assetChange/getChangeDetail',
    // 资产变动-一览表-导出
    exportChangeScheduleList: '/ams/assetChange/exportChangeScheduleList',
    // 资产变动-分页列表
    getChangePage: '/ams/assetChange/getChangePage',
    // 资产变动-删除
    deleteChange: '/ams/assetChange/deleteChange',
    // 资产变动-审批
    approveChange: '/ams/assetChange/approveChange',
    // 资产变动-导入
    importChange: '/ams/assetChange/importChange',
    // 资产变动-导出
    exportChange: '/ams/assetChange/exportChange',
    // 资产变动-新增编辑
    submitChange: '/ams/assetChange/submitChange',
    // 资产变动-明细
    getChangeInfo: '/ams/assetChange/getChangeInfo',
    // 资产变动-终止交付
    stopDelivery: '/ams/assetChange/stopDelivery',
    // 房屋资产分页查询
    assetHousePage: '/ams/asset-house/page',
    // 资产变动-变动明细分页
    getChangeDetailPage: '/ams/assetChange/getChangeDetailPage',
    // 资产列表
    assetListPage: '/ams/registerOrder/assetListPage'
  },
  // 资产登记
  assetRegister: {
    // 资产登记-删除
    deleteByRegisterOrderId: '/ams/registerOrder/deleteByRegisterOrderId',
    // 资产登记-反审核
    registerOrderReAudit: '/ams/registerOrder/registerOrderReAudit',
    // 资产登记-审核
    registerOrderAudit: '/ams/registerOrder/registerOrderAudit',
    // 资产登记-新增保存
    saveRegisterOrder: '/ams/registerOrder/saveRegisterOrder',
    // 资产登记-编辑保存
    updateRegisterOrder: '/ams/registerOrder/updateRegisterOrder',
    // 资产登记-编辑回显
    getRegisterOrderById: '/ams/registerOrder/getRegisterOrderById',
    // 资产登记-详情回显
    // getRegisterOrderById:/ams/registerOrder/getRegisterOrderById,
    // 资产登记列表-分页查询
    getRegisterOrderListPage: '/ams/registerOrder/getRegisterOrderListPage',
    // 资产登记新增-下载导入模板
    downloadTemplate: '/ams/registerOrder/downloadTemplate',
    // 资产登记转运营信息-根据资产项目ID
    getTransferByProjectId: '/ams/registerOrder/getTransferByProjectId',
    // 资产登记明细列表-分页
    getRegisterOrderDetailsPageById: '/ams/registerOrder/getRegisterOrderDetailsPageById',
    // 资产登记明细列表-不分页
    getRegisterOrderDetailsById: '/ams/registerOrder/getRegisterOrderDetailsById',
    // 资产登记-详情明细统计
    getRegisterOrderDetailsStatistics: '/ams/registerOrder/getRegisterOrderDetailsStatistics',
    // 资产登记-读取excel模板文件
    readExcelModel: '/ams/registerOrder/readExcelModel',
    // 资产登记-读取excel模板文件
    checkBuildsObjectType: '/ams/registerOrder/checkBuildsObjectType'
  },
  // 资产清理
  assetClear: {
    // 资产清理-分页列表
    getCleanupPage: '/ams/assetCleanup/getCleanupPage',
    // 资产清理-删除
    deleteCleanup: '/ams/assetCleanup/deleteCleanup',
    // 资产清理-审批
    approvalCleanup: '/ams/assetCleanup/approvalCleanup',
    // 资产清理-反审批
    reverseApproveCleanup: '/ams/assetCleanup/reverseApproveCleanup',
    // 资产清理-新增编辑保存
    submitCleanup: '/ams/assetCleanup/submitCleanup',
    // 资产清理-编辑查询明细
    getCleanupInfo: '/ams/assetCleanup/getCleanupInfo',
    // 资产清理-详情
    getCleanupDetail: '/ams/assetCleanup/getCleanupDetail',
    // 资产清理-资产明细分页列表
    getCleanupDetailPage: '/ams/assetCleanup/getCleanupDetailPage'
  },
  // 资产分类设置
  assetClassSet: {
    // 资产分类设置-资产分类列表
    getPage: '/ams/categoryCfg/getPage',
    // 资产分类设置-导出资产分类列表
    exportList: '/ams/categoryCfg/export',
    // 资产分类设置-获取费用科目类列表
    getFeeTypeList: '/ams/categoryCfg/getFeeTypeList',
    // 资产分类设置-修改资产分类
    update: '/ams/categoryCfg/update',
    // 资产分类设置-修改资产分类状态
    updateStatus: '/ams/categoryCfg/updateStatus',
    // 资产分类设置-获取资产分类详情
    getDetail: '/ams/categoryCfg/getDetail'
  },
  // 房屋台账-资产项目视图
  assetProjectView: {
    // 资产项目视图列表-查询房屋和楼栋信息分页查询
    viewGetAssetHouseList: '/ams/project/viewGetAssetHouseList',
    // 资产项目视图列表头-查询房屋和楼栋信息统计
    viewGetAssetHouseStatistics: '/ams/project/viewGetAssetHouseStatistics',
    // 资产项目视图详情-资产状况统计列表分页
    viewDetailsPage: '/ams/project/viewDetailsPage',
    // 资产项目视图（详情）-资产状况统计
    viewProjectHouseDetails: '/ams/project/viewProjectHouseDetails'
  },
  // 房屋台账-资产项目
  assetProject: {
    // 分页查询资产项目列表-根据组织ID
    getProjectListPage: '/ams/project/getProjectListPage',
    // 查询资产项目列表-根据组织ID(统计)
    getProjectListStatistics: '/ams/project/getProjectListStatistics',
    // 查询资产项目编辑-根据资产项目ID
    projectDetailsForModifyById: '/ams/project/projectDetailsForModifyById',
    // 查询资产项目详情-根据资产项目ID
    projectDetailsById: '/ams/project/projectDetailsById',
    // 资产项目-下拉框查询
    getObjectKeyValueByOrganId: '/ams/project/getObjectKeyValueByOrganId',
    // 资产项目-删除
    deleteProjectById: '/ams/project/deleteProjectById',
    // 资产项目-反审核
    projectReAudit: '/ams/project/projectReAudit',
    // 资产项目-导入保存
    importProject: '/ams/project/importProject',
    // 资产项目-提交审核
    projectAudit: '/ams/project/projectAudit',
    // 资产项目-新增保存
    saveProject: '/ams/project/saveProject',
    // 资产项目-编辑保存
    modifyProject: '/ams/project/modifyProject',
    // 资产项目-转运营信息统计
    getTransferByProjectId: '/ams/project/getTransferByProjectId'
  },
  // 房屋台账 - 楼栋视图
  buildingView: {
    // 导出楼栋视图excel
    exportExcel: '/ams/asset-house/build/excel',
    // 楼层信息查询
    queryFloorInfo: '/ams/asset-house/build/floor',
    // 楼栋视图分页查询
    queryViewPage: '/ams/asset-house/build/page',
    // 楼栋视图面积使用统计
    queryFloorArea: '/ams/asset-house/build/area',
    // 查询当前组织机构下所有的楼栋
    queryBuildingByOrganId: '/ams/asset-house/organ/build',
    // 查询楼栋下的单元-楼层关系
    queryUnitByHouseId: '/ams/asset-house/build/unit',
    // 楼栋信息查询
    queryBuildInfo: '/ams/asset-house/build',
    // 查询楼栋详情面积占比--详情页里
    queryDetailArea: '/ams/asset-house/area/build',
    // 查询楼栋楼层下房间面积
    queryRoomArea: '/ams/asset-house/area/house'
  },
  // 房屋台账 - 资产视图
  assetView: {
    // 房屋资产信息查询
    queryHouseInfo: '/ams/asset-house',
    // 资产使用面积详情
    queryHouseArea: '/ams/asset-house/area',
    // 资产视图使用面积统计
    queryAssetArea: '/ams/asset-house/house/area',
    // 分页查询房屋资产信息
    queryAssetViewPage: '/ams/asset-house/house/page',
    // 导出房屋卡片
    exportHouseExcel: '/ams/asset-house/card',
    // 导出房屋卡片
    exportAssetExcel: '/ams/asset-house/house/excel',
    // 资产编辑保存
    saveHouseInfo: '/ams/asset-house',
    // 查询组织机构下的员工
    userList: '/ams/asset-house/organ/user',
    // 资产详情-其他信息Tab-查询权属信息
    queryOwnDetail: '/ams/ownerShip/asset/owner/detail',
    // 资产详情-其他信息Tab-接管信息
    queryTakeOverDetail: '/ams/assetChange/assetTakeOverInfo',
    // 资产详情-其他信息Tab-变动信息
    queryChangeDetail: '/ams/assetChange/assetChangeInfo',
    // 资产详情-其他信息Tab-账面信息
    queryBillDetail: '/ams/assetValueRegister/queryAssertValueListById'
  },
  // 资产项目管理
  projectManage: {
    // 分页查询资产项目列表-根据组织ID
    queryProjectListPage: '/ams/project/getProjectListPage',
    // 查询资产项目列表-根据组织ID(统计)
    queryProjectStatistics: '/ams/project/getProjectListStatistics',
    // 资产项目-删除
    deleteProjectById: '/ams/project/deleteProjectById',
    // 查询资产项目详情-根据资产项目ID
    queryDetailById: '/ams/project/projectDetailsById',
    // 查询资产项目编辑-根据资产项目ID
    queryEditDetailById: '/ams/project/projectDetailsForModifyById',
    // 根据组织Id查资产项目
    queryProjectByOrganId: '/ams/project/getObjectKeyValueByOrganId',
    // 资产项目-反审核
    reauditAction: '/ams/project/projectReAudit',
    // 资产项目-导入保存
    importProject: '/ams/project/importProject',
    // 资产项目-提交审核
    AuditAction: '/ams/project/projectAudit',
    // 资产项目-新增保存
    saveNewProject: '/ams/project/saveProject',
    // 资产项目-编辑保存
    saveEditProject: '/ams/project/modifyProject',
    // 资产项目-转运营信息统计
    queryTransferStatistics: '/ams/project/getTransferByProjectId',
    // 资产项目-资产项目详情-资产概况
    queryGeneralInfo: '/ams/project/getProjectGeneralSituation',
    // 详情查权属情况
    queryOwnInfo: '/ams/ownerShip/queryByProjectId'
  },
  // 权属人管理
  propertyOwnerManagement: {
    // 新建或编辑权属人
    saveOrUpdate: '/ams/ownerShipUser/saveOrUpdate',
    // 权属人下拉列表
    select: '/ams/ownerShipUser/select',
    // 权属人列表查询
    list: '/ams/ownerShipUser/list',
    // 权属人删除
    ownerDelete: '/ams/ownerShipUser/delete',
    // 权属人导入
    ownerExport: '/ams/ownerShipUser/export',
    // 权属人导入模板下载
    download: '/ams/ownerShipUser/download',
    // 权属人详情查询
    detail: '/ams/ownerShipUser/detail'
  },
  // 资产入账
  assetEntry: {
    // 新建资产入账
    insertCard: '/ams/assetCard/insertCard',
    // 更新资产入账
    updateCard: '/ams/assetCard/updateCard',
    // 资产入账分页查询
    queryCardPageList: '/ams/assetCard/queryCardPageList',
    // 资产入账状态操作
    updateCardStatus: '/ams/assetCard/updateCardStatus',
    // 资产入账详情
    queryCardDetail: '/ams/assetCard/queryCardDetail'
  }
}
// 楼盘字典
export const building = {
  // 房屋列表
  queryHouseByPage: '/basic-data-api/rest-api/v1/ams/houseApi/queryHouseByPage',
  // 修改房屋
  updateHouse: '/basic-data-api/rest-api/v1/ams/houseApi/updateHouse',
  // 新增房屋
  addHouse: '/basic-data-api/rest-api/v1/ams/houseApi/addHouse',
  // 查询房屋详情
  queryHouseDetailById: '/basic-data-api/rest-api/v1/ams/houseApi/queryHouseDetailById',
  // 修改房屋状态
  updateHouseStatus: '/basic-data-api/rest-api/v1/ams/houseApi/updateHouseStatus',
  // 修改楼栋
  updateBuild: '/basic-data-api/rest-api/v1/ams/buildApi/updateBuild',
  // 删除楼栋
  deleteBuild: '/basic-data-api/rest-api/v1/ams/buildApi/deleteBuild',
  // 新增楼栋
  addBuild: '/basic-data-api/rest-api/v1/ams/buildApi/addBuild',
  // 查询楼栋详情
  queryBuildDetail: '/basic-data-api/rest-api/v1/ams/buildApi/queryBuildDetail',
  // 修改楼层
  updateFloor: '/basic-data-api/rest-api/v1/ams/floorApi/updateFloor',
  // 删除楼层
  deleteFloor: '/basic-data-api/rest-api/v1/ams/floorApi/deleteFloor',
  // 新增楼层
  addFloor: '/basic-data-api/rest-api/v1/ams/floorApi/addFloor',
  // 查询楼层详情
  queryFloorDetail: '/basic-data-api/rest-api/v1/ams/floorApi/queryFloorDetail',
  // 修改单元
  updateUnit: '/basic-data-api/rest-api/v1/ams/unitApi/updateUnit',
  // 删除单元
  deleteUnit: '/basic-data-api/rest-api/v1/ams/unitApi/deleteUnit',
  // 新增单元
  addUnit: '/basic-data-api/rest-api/v1/ams/unitApi/addUnit',
  // 查询单元详情
  queryUnitDetail: '/basic-data-api/rest-api/v1/ams/unitApi/queryUnitDetail',
  // 位置分类Position（异步） 位置管理-位置树查询 POST
  positionSelectAsyn: '/basic-data-api/rest-api/v1/ams/positionApi/positionSelectAsyn',
  // 查询楼栋下可挂位置类型 位置管理-位置树查询 GET
  queryBellowPositionType: '/basic-data-api/rest-api/v1/positionApi/queryBellowPositionType',
  // 下载房屋资料模板-（房间信息导入）
  downLoadExcel: '/basic-data-batch-api/rest-api/v1/ams/houseFileApi/downLoadExcel',
  // 导入房间资料
  importExcel: '/basic-data-batch-api/rest-api/v1/ams/houseFileApi/importExcel',
  // 房间批量更新
  acctHouseCodeImport: '/basic-data-batch-api/rest-api/v1/ams/houseFileApi/acctHouseCodeImport',
  // 房屋导出
  exportHouse: '/basic-data-batch-api/rest-api/v1/ams/houseFileApi/exportHouse'
}

// 权属概况
export const ownershipSurvey = {
  // 资产项目权属列表查询
  ownerShipList: '/ams/ownerShip/list',
  // 资产项目权属详情列表信息
  attrList: '/ams/ownerShip/attr/list',
  // 资产项目权属详情基本信息
  attrBase: '/ams/ownerShip/attr/base',
  // 资产权属列表
  assetList: '/ams/ownerShip/attr/asset/list',
  // 资产权属详情
  assetDetail: '/ams/ownerShip/attr/asset/detail',
  // 权属登记
  attrSet: '/ams/ownerShip/attr/set',
  // 权属人下拉列表
  ownerShipUserSelect: '/ams/ownerShipUser/select',
  // 根据项目id查询权属情况
  queryByProjectId: '/ams/ownerShip/queryByProjectId'
}


export const ownership = {
  // 权属登记
  ownershipRegistration: {
    // 权属登记删除
    shipDelete: '/ams/ownerShip/ship/delete',
    // 权属登记单查询
    shipList: '/ams/ownerShip/ship/list',
    // 权属登记详情查询
    shipDetail: '/ams/ownerShip/ship/detail',
    // 权属登记删除
    saveOrUpdate: '/ams/ownerShip/ship/saveOrUpdate',
  },
  // 权证管理
  authorityCardManagement: {
    // 权证导入
    warrantImport: '/ams/ownerShipUser/warrant/import',
    // 权证导入模板下载
    warrantDownload: '/ams/ownerShipUser/warrant/download',
    // 权证导出
    warrantExport: '/ams/ownerShipUser/warrant/export',
    // 权证新增或修改
    warrantSaveOrUpdate: '/ams/ownerShipUser/warrant/saveOrUpdate',
    // 权证查询
    warrantList: '/ams/ownerShipUser/warrant/list',
    // 权证注销
    warrantDelete: '/ams/ownerShipUser/warrant/delete',
    // 查询权证详情
    warrantDetail: '/ams/ownerShipUser/warrant/detail',
  }
}

// 价值登记
export const worthRegister = {
  // 价值登记查询(分页)
  queryValueRegisterPageList: '/ams/assetValueRegister/queryValueRegisterPageList',
  // 价值登记状态操作
  updateRegisterStatus: '/ams/assetValueRegister/updateRegisterStatus',
  // 价值登记记录查询(分页)
  queryValueRegisterRecordList: '/ams/assetValueRegister/queryValueRegisterRecordList',
  // 价值登记详情
  queryValueRegisterDetail: '/ams/assetValueRegister/queryValueRegisterDetail',
  // 价值登记资产查询
  queryValueRegisterRelList: '/ams/assetValueRegister/queryValueRegisterRelList',
  // 价值登记资产查询(分页)
  queryValueRegisterRelPageList: '/ams/assetValueRegister/queryValueRegisterRelPageList',
  // 新增价值登记
  insertValueRegister: '/ams/assetValueRegister/insertValueRegister',
  // 价值登记资产查询汇总
  queryListSum: '/ams/assetValueRegister/queryValueRegisterRelListSum',
  // 更新价值登记
  updateValueRegister: '/ams/assetValueRegister/updateValueRegister',
  // 资产价值一览表查询(分页)
  queryAssertValuePageList: '/ams/assetValueRegister/queryAssertValuePageList',
  // 资产价值趋势图
  queryAssertValueTrend: '/ams/assetValueRegister/queryAssertValueTrend',
  // 资产价值一览表查询汇总
  queryPageListSum: '/ams/assetValueRegister/queryAssertValuePageListSum',
}


// 处置管理
export const dispose = {
  // 资产处置一览表-主列表查询(分页)
  getDetailAndDisposeListPage: '/ams/disposeRegister/getDetailAndDisposeListPage'
}


// 盘点管理
export const inventoryManagement = {
  inventoryPerform: {
    // 查询盘点列表（查询执行人为当前用户的数据）
    assetCheckInstList: '/ams/assetCheckInst/list',
    // 盘点单详情查询
    assetCheckInstDetail: '/ams/assetCheckInst/detail',
    // 盘点异常详情查询
    assetCheckInstFailDetail: '/ams/assetCheckInst/failDetail',
    // 盘点结果登记或编辑
    assetCheckInstCheckResult: '/ams/assetCheckInst/checkResult',
    // 盘点资产清单列表
    assetCheckInstAsseDetail: '/ams/assetCheckInst/asseDetail',
    // 盘盈资产删除
    assetCheckInstDeleteByCheckResult: '/ams/assetCheckInst/deleteByCheckResult',
    // 资产信息查询
    assetCheckInstAsset: '/ams/assetCheckInst/asset',
  }
}