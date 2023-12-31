/**
 * 描述：URL 接口地址配置
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */
import { exportExcel } from 'api/equipmentview';
export const User = {
  // 登录
  login: '/uhomecp-sso/v3/propertyUser/login',
  // 获取用户数据
  getUserData: '/uhomecp-sso/v3/propertyUser/profile',
  // 获取菜单数据
  menus: '/uhomecp-sso/v3/propertyUser/menus',
  // 获取权限数据
  popedomCode: '/uhomecp-sso/v3/propertyUser/popedomCode',
};

export const publicCode = {
  // 编码规则-资产登记获取生成字段值
  getCodingRulesByCode: '/ams/codingRules/getCodingRulesByCode',
  // 资项目获取生成字段
  getProjectCode: '/ams/project/getProjectCode',
  // 资产标签
  queryAssetLabelConfig: '/ams/assetOperationMode/queryAssetLabelConfig',
};
export const bpm = {
  // 根据分类KEY查询流程定义接口
  queryProcByType: '/eip-bpm-runtime/runtime/instance/v1/queryProcByType',
  // bpm文件上传
  bpmFileUpload: '/eip-portal/system/file/v1/upload',
  // bpm接口 获取 token
  getAuthorizeJwtToken: '/uhomecp-sso/auth2/authorizeJwtToken',
};
export const Global = {
  // 文件上传
  fileUpload: '/uhomecp-app/common/oneFileUpload.json',
  // 用户配置查询V2
  assetRolListV2: '/ams/assetShowConfig/assetRolListV2',
  // 新增配置V2
  addCustomShowV2: '/ams/assetShowConfig/addCustomShowV2',
};
export const dataCenter = {
  // 调用数据中心接口
  dataCenter: '/ams/admin/common/dataCenter',
};
// 基础数据接口
export const basics = {
  // 文件上传
  fileUpload: '/basic-data-batch-api/rest-api/v1/fileApi/fileUpload',
  // 文件下载
  fileDownLoad: '/basic-data-batch-api/rest-api/v1/fileApi/fileDownLoad',
  // 附件查询
  attachment: '/ams/attachment/list',
  // 文件下载
  // fileDownLoad: '/uis/fileApi/fileDownLoad',
  // 查询所有一级物业
  queryAllTopOrganByUser: '/basic-data-api/rest-api/v1/organInfo/queryAllTopOrganByUser',
  // 请求楼栋单元
  getOptions: '/basic-data-api/rest-api/v1/common/getOptions',
  // 资产查询房号
  getOptionsByAms: '/basic-data-api/rest-api/v1/common/getOptionsByAms',
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
  // 按照一级物业公司查询资源列表
  positionApiList: '/basic-data-api/rest-api/v1/ams/positionApi/list',
  // 请求楼层
  queryFloorListByPosId: '/basic-data-api/rest-api/v1/floorApi/queryFloorListByPosId',
  // 03_通过字典code和groupId(集团一级组织ID)查询字典列表信息
  queryDictDataList: '/basic-data-api/rest-api/v1/dictApi/queryDictDataList',
  // 业务字典查询 字典表接口 POST
  queryDictList: '/basic-data-api/rest-api/v1/dictApi/queryDictList',
  // 平台字典
  platformDict: '/ams/assetDict/platformDict',
  // 机构字典
  organDict: '/ams/assetDict/organDict',
  // 根据组织机构查询人
  queryUserPageList: '/basic-data-api/rest-api/v1/userApi/queryUserPageList',
  // 根据组织机构查询岗位
  queryPostNewPageList: '/basic-data-api/rest-api/v1/postmanageApi/queryPostNewPageList',
  // 组织机构请求项目
  queryCommunityListByOrganId: '/basic-data-api/rest-api/v1/community/queryCommunityListByOrganId',
  // 土地信息导入文档
  landImportExcel: '/basic-data-batch-api/rest-api/v1/ams/blankApi/importExcel',
  // 土地信息文档模板下载
  landDownLoadExcel: '/basic-data-batch-api/rest-api/v1/ams/blankApi/downLoadExcel',
  // 根据项目查询项目业态
  queryCommunityTypeInfo: '/basic-data-api/rest-api/v1/community/queryCommunityTypeInfo',
};

// 资产管理
export const assets = {
  project: {
    // 图片预览地址
    getProject: '/getProject',
    // 异步组织机构树 组织机构管理 POST
    queryAsynOrganByUserId: '/basic-data-api/rest-api/v1/organApi/queryAsynOrganByUserId',
    queryAsynOrganByKey: '/basic-data-api/rest-api/v1/organApi/queryTreeByKey',
    // --------项目下拉-------
    getObjectKeyValueByOrganId: '/ams/project/getObjectKeyValueByOrganId',
    // 机构字典
    organDict: '/ams/assetDict/organDict',
    // 平台字典
    platformDict: '/ams/assetDict/platformDict',
    // 查询资产分类列表
    getList: '/ams/categoryCfg/getList',
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
    // 资产变动-列表汇总
    getChangePageSum: '/ams/assetChange/getChangePageSum',
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
    // 资产项目查楼栋
    organBuild: '/ams/asset-house/organ/build',
    // 查楼栋下房屋
    buildPage: '/ams/asset-house/build/page',
    // 资产变动-明细
    getChangeInfo: '/ams/assetChange/getChangeInfo',
    // 资产变动-终止交付
    stopDelivery: '/ams/assetChange/stopDelivery',
    // 房屋资产分页查询
    assetHousePage: '/ams/asset-house/page',
    // 资产变动-变动明细分页
    getChangeDetailPage: '/ams/assetChange/getChangeDetailPage',
    // 资产列表
    assetListPage: '/ams/registerOrder/assetListPage',
  },
  // 资产登记
  assetRegister: {
    // 资产登记-下载批量导入模板
    downloadTemplateBatch: '/ams/registerOrder/downloadTemplateBatch',
    // 资产登记-批量导入
    uploadTemplateBatch: '/ams/registerOrder/uploadTemplateBatch',
    // 资产登记-删除
    deleteByRegisterOrderId: '/ams/registerOrder/deleteByRegisterOrderId',
    // 资产登记-列表统计
    pageListStatistics: '/ams/registerOrder/pageListStatistics',
    // 资产登记一览表-主列表
    findAssetRegListPage: '/ams/registerOrder/findAssetRegListPage',
    // 资产登记一览表-主列表导出
    assetRegListPageExport: '/ams/exportDynamicColumn/exportAssetRegList',
    // 资产登记一览表-列表统计
    assetRegSta: '/ams/registerOrder/assetRegSta',
    // 资产转运营一览表-列表统计
    getOperationScheduleStatistics: '/ams/operation/getOperationScheduleStatistics',
    // 资产转运营一览表-主列表导出
    exportOperationSchedulePage: '/ams/operation/exportOperationSchedulePage',
    // 资产登记-撤销核实
    registerOrderReAudit: '/ams/registerOrder/registerOrderReAudit',
    // 资产登记-核实
    registerOrderAudit: '/ams/registerOrder/registerOrderAudit',
    // 资产登记-新增保存
    saveRegisterOrder: '/ams/registerOrder/saveRegisterOrder',
    // 资产登记-编辑保存
    updateRegisterOrder: '/ams/registerOrder/updateRegisterOrder',
    // 更新附件独立接口
    updateAttachment: '/ams/attachment/updateAttachment',
    // 资产登记-编辑回显
    getRegisterOrderById: '/ams/registerOrder/getRegisterOrderById',
    // 资产登记-详情回显
    // getRegisterOrderById:/ams/registerOrder/getRegisterOrderById,
    // 资产登记列表-分页查询
    getRegisterOrderListPage: '/ams/registerOrder/getRegisterOrderListPage',
    // 资产登记新增-下载导入模板
    downloadTemplate: '/ams/registerOrder/downloadTemplate',
    // 资产登记新增（修改的批量导出）-再次下载导入模板
    downloadTemplateV2: '/ams/registerOrder/downloadTemplateV2',
    // 资产登记转运营信息-根据资产项目ID
    getTransferByProjectId: '/ams/registerOrder/getTransferByProjectId',
    // 资产转运营一览表
    getTransferOperationSchedule: '/ams/operation/getTransferOperationSchedule',
    // 资产登记明细列表-分页
    getRegisterOrderDetailsPageById: '/ams/registerOrder/getRegisterOrderDetailsPageById',
    // 资产登记明细列表-不分页
    getRegisterOrderDetailsById: '/ams/registerOrder/getRegisterOrderDetailsById',
    // 资产登记-详情明细统计
    getRegisterOrderDetailsStatistics: '/ams/registerOrder/getRegisterOrderDetailsStatistics',
    // 资产登记-读取excel模板文件
    readExcelModel: '/ams/registerOrder/readExcelModel',
    // 资产登记-再次导入读取excel模板文件
    readExcelModelV2: '/ams/registerOrder/readExcelModelV2',
    // 资产登记-再次导入
    updateRegisterOrderV2: '/ams/registerOrder/updateRegisterOrderV2',
    // 更新办证状态
    updateCertificateStatus: '/ams/disposeRegister/updateCertificateStatus',
    // 资产登记-读取excel模板文件
    checkBuildsObjectType: '/ams/registerOrder/checkBuildsObjectType',
    // 资产登记-附属配套-分页查询列表
    getListPageByRegisterOrderId: '/ams/subsidiaryMatching/getListPageByRegisterOrderId',
    // 资产登记一览表-附属配套-分页查询列表
    getMatchingListByAssetIdPage: '/ams/subsidiaryMatching/getMatchingListByAssetIdPage',
    // 附属配套-新增/修改保存(资产登记版)
    addModifySaveByRgId: '/ams/subsidiaryMatching/addModifySaveByRgId',
    // 资产登记-查询资产列表-根据资产登记Id
    findAssetListByRgId: '/ams/registerOrder/findAssetListByRgId',
    // 资产登记-附属配套-统计
    getMatchingStatisByRgId: '/ams/subsidiaryMatching/getMatchingStatisByRgId',
    // 资产登记一览表-附属配套-统计
    getMatchingSta: '/ams/subsidiaryMatching/getMatchingSta',
    // 下载附属配套模板
    downModle: '/ams/subsidiaryMatching/downModle',
    // 下载附属配套模板，带条件下载
    downBatchModle: '/ams/subsidiaryMatching/downBatchModle',
    // 批量导入-导入保存
    batchImportByRgId: '/ams/subsidiaryMatching/batchImportByRgId',
    // 资产登记-价值信息统计
    getValueStatistics: '/ams/registerOrder/getValueStatistics',
    // 资产登记-价值信息批量导出
    valueExport: '/ams/registerOrder/downloadValueTemplateByRgId',
    // 资产登记-价值信息批量导入
    valueImport: '/ams/registerOrder/importValueData',
    // 资产登记-价值信息分页列表
    queryValuePageListByRgId: '/ams/registerOrder/queryValuePageListByRgId',
    // 资产登记-价值信息详情
    // getValueDetail: '/ams/registerOrder/getValueDetail',
    // 资产登记-编辑价值信息
    updateAssetValue: '/ams/registerOrder/updateAssetValue',
    // 使用方向修改
    useForUpdate: '/ams/registerOrder/useFor/update',
    // 使用方向分页列表
    userForList: '/ams/registerOrder/useFor/page',
    // 使用方向详情
    useForDetail: '/ams/registerOrder/useFor/detail',
    // 使用方向面积统计
    useForSummary: '/ams/registerOrder/useFor/total',
    // 批量导出
    userForExport: '/ams/registerOrder/useFor/export',
    // 批量更新
    usrForImport: '/ams/registerOrder/useFor/import',
    // 相关费用下载导入模板
    correlationExpenseExport: '/ams/registerOrder/correlationExpense/export',
    // 相关费用导入
    correlationExpenseImport: '/ams/registerOrder/correlationExpense/import',
    // 相关费用分页列表
    correlationExpenseList: '/ams/registerOrder/correlationExpense/page',
    // 相关费用删除
    correlationExpenseDelete: '/ams/registerOrder/correlationExpense/delete',
    // 相关费用新增修改
    correlationExpenseUpdate: '/ams/registerOrder/correlationExpense/update',
    // 相关费用详情
    correlationExpenseDetail: '/ams/registerOrder/correlationExpense/detail',
    // 相关费用金额统计
    correlationExpenseTotal: '/ams/registerOrder/correlationExpense/total',
    // 根据登记单Id资产登记明细列表-分页
    getRegisterOrderDetailsPageByIdList: '/ams/registerOrder/getRegisterOrderDetailsPageByIdList',
    // 批量更新（导入）
    baseImport: '/ams/registerOrder/importBaseInfoData',
    // 资产登记-删除基础信息
    deleteBase: '/ams/registerOrder/deleteBase',
    // 资产登记-获取资产编码
    getAssetCode: '/ams/registerOrder/getAssetCode',
  },
  // 资产出库
  assetClear: {
    // 资产出库-分页列表
    getCleanupPage: '/ams/assetCleanup/getCleanupPage',
    // 资产出库-删除
    deleteCleanup: '/ams/assetCleanup/deleteCleanup',
    // 资产出库-审批
    approvalCleanup: '/ams/assetCleanup/approvalCleanup',
    // 资产出库-反审批
    reverseApproveCleanup: '/ams/assetCleanup/reverseApproveCleanup',
    // 资产出库-新增编辑保存
    submitCleanup: '/ams/assetCleanup/submitCleanup',
    // 资产出库-编辑查询明细
    getCleanupInfo: '/ams/assetCleanup/getCleanupInfo',
    // 资产出库-详情
    getCleanupDetail: '/ams/assetCleanup/getCleanupDetail',
    // 资产出库-资产明细分页列表
    getCleanupDetailPage: '/ams/assetCleanup/getCleanupDetailPage',
    // 资产出库-统计
    assetCleanupGetCount: '/ams/assetCleanup/getCount',
    // 资产出库一览表
    getGeneralSurvey: '/ams/assetCleanup/getGeneralSurvey',
    // 资产出库一览表-汇总统计
    assetCleanupListTotal: '/ams/assetCleanup/getGeneralSurveyTotal',
    // 资产出库一览表导出
    getGeneralSurveyExportOut: '/ams/exportDynamicColumn/exportAssetCleanupList',
  },
  // 资产分类设置
  assetClassSet: {
    // 资产分类设置-资产分类列表
    getPage: '/ams/categoryCfg/getPage',
    // 资产分类设置-导出资产分类列表
    exportList: '/ams/categoryCfg/export',
    /*
     * 资产分类设置-获取费用科目类列表(根据当前环境判断调用接口路径，招商环境和其他环境)
     * 其他环境  /ams/categoryCfg/getFeeTypeList
     * 招商环境  /charging-api/rest-api/v1/feeItemType/queryFeeItemTypeList
     * */
    getFeeTypeList: '/ams/categoryCfg/getFeeTypeList',
    getFeeTypeList2: '/charging-lease-api/rest-api/v1/feeItemType/queryFirstOrganFeeItemTypeList',
    // 资产分类设置-修改资产分类
    update: '/ams/categoryCfg/update',
    // 资产分类设置-修改资产分类状态
    updateStatus: '/ams/categoryCfg/updateStatus',
    // 资产分类设置-获取资产分类详情
    getDetail: '/ams/categoryCfg/getDetail',
    // 3.1.1查询设备分类编码列表
    getEquipmentCodeList: '/equipment-openapi/equipment/getEquipmentCodeList',
    // 3.1.2根据设备分类ID查询子级设备分类信息
    getEquipmentListByUpEquipmentId: '/equipment-openapi/equipment/getEquipmentListByUpEquipmentId',
    // 3.1.5根据设备分类ID查询设备分类台账属性(不分页)
    getInfoAttrListByEquipmentId: '/equipment-openapi/equipment/getInfoAttrListByEquipmentId',
    // 删除设施设备分类
    updateEquipmentStatus: '/ams/categoryCfg/updateEquipmentStatus',
    //  保存/更新设施设备分类
    updateEquipment: '/ams/categoryCfg/updateEquipment',
    // 3.2.7批量保存设备分类台账属性
    batchSaveInfoAttr: '/equipment-openapi/equipment/batchSaveInfoAttr',
    // 3.2.8删除设备分类台账属性
    deleteInfoAttr: '/equipment-openapi/equipment/deleteInfoAttr',
  },
  // 房屋台账-资产项目视图
  assetProjectView: {
    // 导出资产项目视图列表
    exportAssetProjectViewList: '/ams/project/exportProjectView',
    // 资产项目视图列表-查询房屋和楼栋信息分页查询
    viewGetAssetHouseList: '/ams/project/viewGetAssetHouseList',
    // 资产项目视图列表头-查询房屋和楼栋信息统计
    viewGetAssetHouseStatistics: '/ams/project/viewGetAssetHouseStatistics',
    // 资产项目视图详情-资产状况统计列表分页
    viewDetailsPage: '/ams/project/viewDetailsPage',
    // 资产项目视图（详情）-资产状况统计
    viewProjectHouseDetails: '/ams/project/viewProjectHouseDetails',
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
    getTransferByProjectId: '/ams/project/getTransferByProjectId',
    // 根据projectId查询资产项目视图详情权属信息
    queryAssetProjectOwnershipInfo: '/ams/ownerShip/owner/organViewShip',
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
    queryRoomArea: '/ams/asset-house/area/house',
  },
  // 房屋台账-组织机构视图
  organView: {
    // 组织机构视图分页查询
    queryOrganViewList: '/ams/asset-house/organ/houseView',
    // 组织机构视图面积概览查询
    queryOrganArea: '/ams/asset-house/organ/getTotal',
    // 详情查询
    // 组织机构视图详情权属 V2
    queryDetail: '/ams/asset-house/organ/houseViewShip',
    // 导出
    exportOrganView: '/ams/asset-house/export',
    // 组织机构详情
    viewGetAssetHouseListForOrgan: '/ams/asset-house/viewGetAssetHouseListForOrgan',
    // 组织机构视图详情表头统计
    viewGetAssetHouseStatisticsForOrgan: '/ams/asset-house/viewGetAssetHouseStatisticsForOrgan',
  },
  // 房屋台账 - 资产视图
  assetView: {
    // 添加备注
    insertDesc: '/ams/asset-house/insertDesc',
    // 更新房屋资产质押配置
    updateAssetPledgeConfig: '/ams/asset-house/house/updateAssetPledgeConfig',
    // 房屋资产信息查询
    queryHouseInfo: '/ams/asset-house',
    // 资产使用面积详情
    queryHouseArea: '/ams/asset-house/area',
    // 资产视图使用面积统计
    queryAssetArea: '/ams/asset-house/house/area',
    // 分页查询房屋资产信息
    queryAssetViewPage: '/ams/asset-house/house/page',
    // 不页查询房屋资产信息
    queryAssetViewPage2: '/ams/asset-house/house/pageV2',
    // 不分页查询车场资产信息
    carPage: '/ams/admin/common/query/carPage',
    // 导出房屋卡片
    exportHouseExcel: '/ams/asset-house/card',
    // 导出资产视图
    exportAssetExcel: '/ams/asset-house/house/excel',
    // 导出资产视图（校验）
    exportAssetExcelExam: '/ams/asset-house/house/isExcel',
    // 资产编辑保存
    saveHouseInfo: '/ams/asset-house',
    // 查询组织机构下的员工
    userList: '/ams/asset-house/organ/user',
    // 资产详情-其他信息Tab-查询权属信息
    queryOwnDetail: '/ams/ownerShip/asset/owner/detail',
    // 资产详情-其他信息Tab-接管信息（旧）
    //queryTakeOverDetail: '/ams/assetChange/assetTakeOverInfo',
    // 资产详情-其他信息Tab-接管信息(新)
    queryTakeOverDetail: '/ams/deliveryDetail/assetTakeOverInfo',
    // 资产详情-其他信息Tab-变动信息
    queryChangeDetail: '/ams/assetChange/assetChangeInfo',
    // 资产详情-其他信息Tab-账面信息
    queryBillDetail: '/ams/assetValueRegister/queryAssertValueListById',
    // 资产详情-其他信息Tab-资产处置
    queryDisposeDetail: '/ams/disposeRegister/getListByAssetId',
    // 资产详情-其他信息Tab-附属&配套
    queryAccessoryDetail: '/ams/subsidiaryMatching/getMatchingListByAssetId',
    // 资产详情-其他信息Tab-巡查记录
    getListPageByAssetId: '/ams/inspectionTaskRecord/getListPageByAssetId',
    // 资产详情-其他信息Tab-档案文件
    queryArchiveDetail: '/ams/asset/archive-info/page',
    // 资产视图费用相关
    assetExpenseInfo: '/ams/operationContract/assetExpenseInfo',
    // 资产登记一览表-相关费用统计
    assetExpenseTotal: '/ams/operationContract/assetExpenseTotal',
    // 资产视图-运营信息-合同信息（分页）
    assetOperationContractInfo: '/ams/operationContract/assetOperationContractInfo',
    // // 资产视图-运营信息-运营收入（分页）
    // assetOperationExpenseInfo: '/ams/operationContract/assetOperationExpenseInfo',
    // 资产视图-运营信息-运营收入（返回参数）
    assetOperationExpenseParam: '/ams/operationContract/assetOperationExpenseParam',
    // 资产视图-运营信息-运营收入(计费接口)（分页）
    getAcctItemPageList: '/charging-api/rest-api/v1/assets/getAcctItemPageList',
    // 导出房屋卡片
    exportHouseCard: '/ams/asset-house/exportById',
    // 资产入账分页查询汇总
    queryCardPageListSum: '/ams/assetCard/queryCardPageListSum',
    // 房屋台账资产视图汇总
    assetHousePageTotal: '/ams/asset-house/assetHousePageTotal',
  },
  // 资产项目管理
  projectManage: {
    // 更新资产标签
    updateAssetLabelConfig: '/ams/assetOperationMode/updateAssetLabelConfig',
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
    queryOwnInfo: '/ams/ownerShip/queryByProjectId',
    // 资产使用方向变更模板下载
    downLoadUseDirectionTemplate: '/ams/assetChange/downLoadUseDirectionTemplate',
    // 资产使用方向变更模板导入
    readUseDirectionTemplate: '/ams/assetChange/readUseDirectionTemplate',
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
    detail: '/ams/ownerShipUser/detail',
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
    queryCardDetail: '/ams/assetCard/queryCardDetail',
    // 卡片批量提交
    batchSubmission: '/ams/assetCard/batchSubmission',
  },
};
// 楼盘字典
export const building = {
  // 房屋列表
  queryHouseByPage: '/basic-data-api/rest-api/v1/ams/houseApi/queryHouseByPage',
  // 房屋资产&资源统计表 资产明细 房间详情
  queryHouseByPageV2: '/ams/houseApi/queryHouseByPageV2',
  // 房屋资产&资源统计表 资产明细 房间详情-房间拆分的
  queryHouseByPageV3: '/ams/houseApi/queryHouseByPageV3',
  // 修改房屋
  updateHouse: '/basic-data-api/rest-api/v1/ams/houseApi/updateHouse',
  // 新增房屋
  addHouse: '/basic-data-api/rest-api/v1/ams/houseApi/addHouse',
  // 查询房屋详情
  queryHouseDetailById: '/basic-data-api/rest-api/v1/ams/houseApi/queryHouseDetailById',
  // 修改房屋状态
  updateHouseStatus: '/basic-data-api/rest-api/v1/ams/houseApi/updateHouseStatus',
  // 房间列表合计
  queryHouseTotal: '/basic-data-api/rest-api/v1/ams/houseApi/queryHouseTotal',
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
  // 下载房屋资料批量导入模板-（房间信息导入）
  downLoadExcelV2: '/basic-data-batch-api/rest-api/v1/ams/houseFileApi/downLoadExcelV2',
  // 批量导入房间资料
  importExcelV2: '/basic-data-batch-api/rest-api/v1/ams/houseFileApi/importExcelV2',
  // 房间批量更新
  acctHouseCodeImport: '/basic-data-batch-api/rest-api/v1/ams/houseFileApi/acctHouseCodeImport',
  // 房屋导出
  exportHouse: '/basic-data-batch-api/rest-api/v1/ams/houseFileApi/exportHouse',
  // 下载楼栋导入模板
  buildingDownLoadExcel: '/basic-data-batch-api/rest-api/v1/ams/buildFileApi/downLoadExcel',
  // 楼栋导入
  buildImportExcel: '/basic-data-batch-api/rest-api/v1/ams/buildFileApi/importExcel/',
  // 下载楼栋批量导入模板
  buildingDownLoadExcelV2: '/basic-data-batch-api/rest-api/v1/ams/buildFileApi/downLoadExcelV2',
  // 楼栋批量导入
  buildImportExcelV2: '/basic-data-batch-api/rest-api/v1/ams/buildFileApi/importExcelV2/',
  // 土地分页列表
  blankApiPageList: '/basic-data-api/rest-api/v1/ams/blankApi/pageList',
  // 查询土地列表合计
  queryBlankLandTotal: '/basic-data-api/rest-api/v1/ams/blankApi/queryBlankLandTotal',
  // 土地修改
  blankApiUpdate: '/basic-data-api/rest-api/v1/ams/blankApi/update',
  // 土地删除
  blankApiDelete: '/basic-data-api/rest-api/v1/ams/blankApi/delete',
  // 土地导出
  blankApiExport: '/basic-data-batch-api/rest-api/v1/ams/blankApi/export',
  // 土地详情
  blankApiDetail: '/basic-data-api/rest-api/v1/ams/blankApi/detail',
  // 土地新增
  blankApiInsert: '/basic-data-api/rest-api/v1/ams/blankApi/insert',
  // 土地编码
  generatBlankCode: '/basic-data-api/rest-api/v1/ams/blankApi/generatBlankCode',
  // 车场 分页查询
  parkApiPageList: '/car-parking-api/rest-api/v1/parkingPlaceRestApiController/getParkingPlaceList.json',
  // 车场 新增
  parkApiInsert: '/car-parking-api/rest-api/v1/parkingPlaceRestApiController/addParkingPlace.json',
  // 车场 删除
  parkApiDelete: '/car-parking-api/rest-api/v1/parkingPlaceRestApiController/deleteParkingPlace.json',
  parkUploadPicFile: '/car-parking-api/rest-api/v1/parkingPlaceApiController/uploadPicFile',
  parkFileUpload: '/car-parking-api/car/uploadDocFile',
  // 区域 删除
  deleteParkingPlaceArea: '/car-parking-api/rest-api/v1/parkingPlaceRestApiController/deleteParkingPlaceArea.json',
  // 区域 新增
  addParkingPlaceArea: '/car-parking-api/rest-api/v1/parkingPlaceRestApiController/addParkingPlaceArea.json',
  // 区域 修改
  editParkingPlaceArea: '/car-parking-api/rest-api/v1/parkingPlaceRestApiController/updateParkingPlaceArea.json',
  // 区域 列表
  getParkingPlaceAreasByPlaceId: '/car-parking-api/rest-api/v1/parkingPlaceRestApiController/getParkingPlaceAreasByPlaceId.json',
  // 车场 编辑
  parkApiEdit: '/car-parking-api/rest-api/v1/parkingPlaceRestApiController/updateParkingPlace.json',
  // 车场 详情
  parkApiDetail: '/car-parking-api/rest-api/v1/parkingPlaceRestApiController/getParkingPlaceById.json',
  // 车位 分页查询
  stallApiPageList: '/car-parking-api/rest-api/v1/parkingPlaceApiController/parkingPlaceResult.json',
  // 车位 新增
  stallApiInsert: '/car-parking-api/rest-api/v1/parkingPlaceApiController/saveParkingPlace.json',
  // 车位 删除
  stallApiDelete: '/car-parking-api/rest-api/v1/parkingPlaceApiController/deleteParkingPlace.json',
  // 车位 编辑
  stallApiEdit: '/car-parking-api/rest-api/v1/parkingPlaceApiController/updateParkingPlace.json',
  // 车位 详情
  stallApiDetail: '/car-parking-api/rest-api/v1/parkingPlaceApiController/parkingPlaceDetail.json',
  // 车位 导出
  stallApiExport: '/car-batch/rest-api/v1/parkingBatchApiController/downloadParkingData',
  // 车位 导入
  saveParkingImport: '/car-batch/rest-api/v1/parkingBatchApiController/saveParkingImport',
  // 车位 导入模板名下载
  downloadParkingTemplateByCommunityId: '/car-batch/rest-api/v1/parkingBatchApiController/downloadParkingTemplateByCommunityId',
  // 车位 导入模板下载
  downloadParkingTemplate: '/car-parking/parkingMgr/dowload/excel/xlsx',
  // 设备 分页查询
  equipmentApiPageList: '/equipment-openapi/equipmentInst/pageEquipmentInst',
  // 设备 新增
  equipmentApiInsert: '/equipment-openapi/equipmentInst/addEquipmentInst',
  // 设备 删除
  equipmentApiDelete: '/equipment-openapi/equipmentInst/deleteEquipmentInst',
  // 设备 编辑
  equipmentApiEdit: '/equipment-openapi/equipmentInst/updateEquipmentInst',
  // 设备 详情
  equipmentApiDetail: '/equipment-openapi/equipmentInst/queryEquipmentInstById',
  equipmentFileUpload: '/equipment-openapi/common/uploadFile',
  // 根据组织机构ID查询供应商
  getEquipmentSupplierListByOrganId: '/equipment-openapi/equipmentSupplier/getEquipmentSupplierListByOrganId',
  // 根据组织机构id查询分类编码表
  getEquipmentCodeList: '/equipment-openapi/equipment/getEquipmentCodeList',
  // 根据组织机构id查询分类编码表
  getEquipmentListByUpEquipmentId: '/equipment-openapi/equipment/getEquipmentListByUpEquipmentId',
  // 根据organId和设备分类Id
  getInfoAttrListByEquipmentId: '/equipment-openapi/equipment/getInfoAttrListByEquipmentId',
  // 根据communityId查询位置
  getEquipmentInstListByTopOrganId: '/equipment-openapi/common/getPositionListByCommunityId',
  // 根据 communityId 查询 organId
  queryOrganIdByCommunityId: '/equipment-openapi/common/queryOrganIdByCommunityId',
  // 根据CommunityID查询位置列表
  positionSelectByCommunityID: '/basic-data-api/rest-api/v1/positionApi/positionSelectByID',
  // 根据communitId和positionType查询具体资源
  positionSelectAsynByOwnership: '/basic-data-api/rest-api/v1/positionApi/positionSelectAsynByOwnership',
  // 分页查询房屋信息统计V3
  queryHouseStatisV3: '/ams/houseApi/queryHouseStatisV3',
  // 分页查询房屋信息统计V2
  queryHouseStatisV2: '/ams/houseApi/queryHouseStatisV2',
  // 获取楼栋单元楼层顺序
  getObjectSeq: '/basic-data-api/rest-api/v1/ams/buildApi/getObjectSeq',
  // 查询宗地号下拉列表接口
  getLandTheNo: '/basic-data-api/rest-api/v1/ams/blankApi/getLandTheNo',
};

// 权属概况
export const ownershipSurvey = {
  // 资产项目权属列表查询
  ownerShipList: '/ams/ownerShip/list',
  // 资产项目权属导出
  projectExport: '/ams/ownerShip/owner/projectExport',
  // 资产项目权属详情列表信息
  attrList: '/ams/ownerShip/attr/list',
  // 资产项目权属详情基本信息
  attrBase: '/ams/ownerShip/attr/base',
  // 资产权属列表
  assetList: '/ams/ownerShip/attr/asset/list',
  // 资产权属导出
  assetExport: '/ams/ownerShip/owner/assetExport',
  // 资产权属详情
  assetDetail: '/ams/ownerShip/attr/asset/detail',
  // 权属登记
  attrSet: '/ams/ownerShip/attr/set',
  // 权属人下拉列表
  ownerShipUserSelect: '/ams/ownerShipUser/select',
  // 根据项目id查询权属情况
  queryByProjectId: '/ams/ownerShip/queryByProjectId',
  // 资产项目权属汇总
  statistics: '/ams/ownerShip/attr/asset/statistics',
  // 资产权属列表统计
  listStatis: '/ams/ownerShip/attr/asset/listStatis',
};

export const ownership = {
  // 权证变更日志管理
  ownershipChangeLog: {
    // 权证变更日志列表
    logList: '/ams/ownerShipUser/warrant/logList',
    // 权证变更日志详情
    logDetail: '/ams/ownerShipUser/warrant/logDetail',
  },
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
    // 批量导出
    shipAssetExport: '/ams/ownerShip/ship/assetExport',
    // 批量导入
    shipImportData: '/ams/ownerShip/importData',
    // 权属登记单查询汇总
    shipTotal: '/ams/ownerShip/ship/total',
  },
  // 权证管理
  authorityCardManagement: {
    // 权证导入
    warrantImport: '/ams/ownerShipUser/warrant/import',
    // 权证导入模板下载
    warrantDownload: '/ams/ownerShipUser/warrant/download',
    // 权证导出
    warrantExport: '/ams/exportDynamicColumn/exportOwnerShipList',
    // 权证新增或修改
    warrantSaveOrUpdate: '/ams/ownerShipUser/warrant/saveOrUpdate',
    // 权证查询
    warrantList: '/ams/ownerShipUser/warrant/list',
    // 权证注销
    warrantDelete: '/ams/ownerShipUser/warrant/delete',
    // 权证批量注销
    warrantDeleteBatch: '/ams/ownerShipUser/warrant/deleteBatch',
    // 查询权证详情
    warrantDetail: '/ams/ownerShipUser/warrant/detail',
    // 查询权证详情2
    detailByWarrantNbr: '/ams//ownerShipUser/warrant/detailByWarrantNbr',
    // 权证统计
    warrantTotal: '/ams/ownerShipUser/warrant/total',
    // 权证管理附件上传
    uploadAnnex: '/ams/attachment/uploadAnnex',
    // 权证管理附件下载
    downLoadAnnex: '/ams/attachment/downLoadAnnex2Path',
    // 文件预览
    reviewFile: '/ams/attachment/preview',
    // 打记标签接口
    updateWarrantTag: '/ams/ownerShipUser/warrant/updateWarrantTag',
  },
  // 组织机构权属
  organView: '/ams/ownerShip/owner/organView',
  // 组织机构权属导出
  organViewExport: '/ams/ownerShip/owner/export',
  // 组织机构权属统计
  organViewTotal: '/ams/ownerShip/owner/organViewTotal',
  // 权属登记单一览表导出
  registerExport: '/ams/ownerShip/ship/register/export',
  // 权属登记单一览表查询
  registerList: '/ams/ownerShip/ship/register/list',
  // 权属登记单一览表统计
  registerTotal: '/ams/ownerShip/ship/register/total',
};

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
  // 价值登记查询(汇总)
  queryValueRegisterPageListSum: '/ams/assetValueRegister/queryValueRegisterPageListSum',
  // 价值登记导入
  importValueTemplate: '/ams/assetValueRegister/importValueTemplate',
  // 下周模板
  downloadValueTemplate: '/ams/assetValueRegister/downloadValueTemplate',
};

// 处置管理
export const dispose = {
  // 资产处置一览表-主列表查询(分页)
  getDetailAndDisposeListPage: '/ams/disposeRegister/getDetailAndDisposeListPage',
  // 资产处置一览表-统计
  getDetailAndDisposeListStat: '/ams/disposeRegister/getDetailAndDisposeListStat',
  // 资产处置一览表-组织机构-主列表查询(分页)
  getDisposeOrganListPage: '/ams/disposeRegister/getDisposeOrganListPage',
  // 组织机构视图导出
  getDisposeOrganExport: '/ams/disposeRegister/getDisposeOrganExport',
  // 组织机构视图，统计
  getDisposeOrganStatistics: '/ams/disposeRegister/getDisposeOrganStatistics',
  // 资产处置一览表-组织机构-详情查询(分页)
  getDispOrgProDetListPage: '/ams/disposeRegister/getDispOrgProDetListPage',
  // 组织机构视图，详情统计
  getDispOrgStatProDetail: '/ams/disposeRegister/getDispOrgStatProDetail',
  //资产转让按钮
  detail: '/ams/basicSettings/detail',
  //资产转让列表
  getTransferList: '/ams/makeover/list',
  //根据处置单查询资产转让列表
  listByDisposeRegisterOrderId: '/ams/makeover/listByDisposeRegisterOrderId',
};

// 盘点管理
export const inventoryManagement = {
  // 盘点任务
  countingTask: {
    // 已选资产明细
    queryAssetByChcekId: '/ams/assetCheckInst/queryAssetByChcekId',
    // 新建/编辑盘点单
    updateCheckInst: '/ams/assetCheckInst/updateCheckInst',
    // 盘点任务查询(分页)
    queryCheckTaskPageList: '/ams/checktask/queryCheckTaskPageList',
    // 盘点任务详情
    queryCheckTaskDetail: '/ams/checktask/queryCheckTaskDetail',
    // 编辑盘点任务
    updateCheckTask: '/ams/checktask/updateCheckTask',
    // 盘点任务状态操作
    updateCheckTaskStatus: '/ams/checktask/updateCheckTaskStatus',
    // 删除盘点单
    deleteCheckInst: '/ams/assetCheckInst/deleteCheckInst',
    // 盘点任务查询(统计)
    queryCheckTaskStat: '/ams/checktask/queryCheckTaskStat',
  },
  // 盘点执行
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
    assetCheckInstAsseDetail: '/ams/assetCheckInst/assetDetail',
    // 盘盈资产删除
    assetCheckInstDeleteByCheckResult: '/ams/assetCheckInst/deleteByCheckResult',
    // 资产盘点提交
    assetCheckInstCheckExe: '/ams/assetCheckInst/checkExe',
    // 根据任务id查询盘点单
    queryListByTaskId: '/ams/assetCheckInst/queryListByTaskId',
    // 盘点资产清单导出
    downloadTemplate: '/ams/assetCheckInst/downloadTemplate',
    // 盘点清单导入
    importExcel: '/ams/assetCheckInst/importExcel',
  },
  // 盘点报告
  inventoryReport: {
    // 新建或编辑盘点报告
    saveOrUpdate: '/ams/assetCheckReport/saveOrUpdate',
    // 查询盘点报告列表(选择组织机构下的所有机构)
    checkReportList: '/ams/assetCheckReport/checkReportList',
    // 查询盘点报告详情
    detail: '/ams/assetCheckReport/detail',
    // 根据任务id查询盘点报告
    queryByTaskId: '/ams/assetCheckReport/queryByTaskId',
    // 盘点报告删除
    deleteReport: '/ams/assetCheckReport/delete',
  },
  // 盘点异常
  exceptionManagement: {
    // 异常处理登记信息查询
    getCheckResultHandle: '/ams/assetCheckResult/getCheckResultHandle',
    // 异常处理登记保存
    handleException: '/ams/assetCheckResult/handleException',
    // 异常管理列表查询
    exceptionList: '/ams/assetCheckResult/exceptionList',
  },
};
// 盘点计划
export const inventory = {
  getPlanList: '/ams/checkplan/queryCheckPlanPageList',
  // 执行记录
  getImplementRecord: '/ams/checktask/queryCheckTaskPageList',
  createInventoryPlan: '/ams/checkplan/insertCheckPlan',
  editInventoryPlan: '/ams/checkplan/updateCheckPlan',
  inventoryDetail: '/ams/checkplan/queryCheckPlanDetail',
  updateCheckPlanStatus: '/ams/checkplan/updateCheckPlanStatus',
};
// 处置登记
export const disposeRegister = {
  // 处置登记列表-分页查询 post
  getDisposeRegisterList: '/ams/disposeRegister/getListPage',
  // 处置登记-修改保存 post
  modifySave: '/ams/disposeRegister/modifySave',
  // 处置登记-分页查询处置清单列表 post
  getRegisterDetailListPage: '/ams/disposeRegister/getDetailListPage',
  // 处置登记-新增保存
  addRegisterSave: '/ams/disposeRegister/addSave',
  // 处置登记-查询处置清单列表
  getDisposeRegisterDetailList: '/ams/disposeRegister/getDetailList',
  // 处置登记-查询收付款计划列表
  getreceivecostPlanList: '/ams/disposeRegister/getreceivecostPlanList',
  // 处置登记-状态操作
  updateDisposeRegisterStatus: '/ams/disposeRegister/updateStatus',
  // 处置登记查询-根据处置登记单ID
  getDisposeRegisterById: '/ams/disposeRegister/getDisposeRegister',
};
// 资产附属配套
export const subsidiary = {
  // 附属配套-列表查询
  getListPage: '/ams/subsidiaryMatching/getListPage',
  // 附属配套-新增/修改保存
  modifySave: '/ams/subsidiaryMatching/addModifySave',
  // 附属配套-状态操作或删除
  updateStatusOrDelete: '/ams/subsidiaryMatching/updateStatusOrDelete',
  // 附属配套查询-根据附属配套ID
  getMatchingById: '/ams/subsidiaryMatching/getMatchingById',
  // 附属配套-根据资产信息ID查询列表
  getMatchingListByAssetId: '/ams/subsidiaryMatching/getMatchingListByAssetId',
  // 附属配套-下载批量导入模板
  downBatchModle: '/ams/subsidiaryMatching/downBatchModle',
  // 附属配套-列表导出
  exportData: '/ams/subsidiaryMatching/exportData',
  // 附属配套-导入
  batchImport: '/ams/subsidiaryMatching/batchImport',
  // 根据资产id 查询资产信息
  getAssetById: '/ams/asset/getAssetById',
  // 查询附属配套列表
  getMatchingListByAssetIdPage: '/ams/subsidiaryMatching/getMatchingListByAssetIdPage',
  // 附属配套统计
  getMatchingSta: '/ams/subsidiaryMatching/getMatchingSta',
};

// 呈报管理
export const reportManage = {
  // 呈报计划
  //呈报任务模板查询
  queryReportTaskTempPageList: '/ams/reportplan/queryReportTaskTempPageList',
  // 呈报计划报表查询
  queryReportPlanNum: '/ams/reportplan/queryReportPlanNum',
  // 呈报计划状态操作
  updateReportPlanStatus: '/ams/reportplan/updateReportPlanStatus',
  // 呈报计划查询(分页)
  queryReportPlanPageList: '/ams/reportplan/queryReportPlanPageList',
  // 呈报计划详情
  queryReportPlanDetail: '/ams/reportplan/queryReportPlanDetail',
  // 新建/修改呈报计划
  saveReportPlan: '/ams/reportplan/saveReportPlan',
  // 呈报表单
  // 查询全部呈报表单列表
  queryAllReportBill: '/ams/reportBill/queryAllReportBill',
  // 查询表单字段
  queryReportBillColumn: '/ams/reportBill/queryReportBillColumn',
  // 呈报任务
  //  [呈报任务]分页查询(我审核的、我填报的、机构下全部任务)
  taskPage: '/ams/reportTask/taskPage',
  //  [呈报任务]列表查询
  taskList: '/ams/reportTask/taskList',
  // [呈报任务]填报数据分页查询
  detailPage: '/ams/reportTask/detailPage',
  // [呈报任务]填报数据列表查询
  detailList: '/ams/reportTask/detailList',
  // [呈报任务]任务信息
  getTask: '/ams/reportTask/getTask',
  // [呈报任务]任务统计
  getTaskStat: '/ams/reportTask/getTaskStat',
  // [呈报任务]保存任务信息、填报数据
  saveTaskOrDetail: '/ams/reportTask/saveTaskOrDetail',
  // [呈报任务]填报数据批量导入
  detailDataImport: '/ams/reportTask/detailDataImport',
  // [呈报任务]填报模板导出
  detailTempExport: '/ams/reportTask/detailTempExport',
  // [呈报任务]审核任务
  auditTask: '/ams/reportTask/saveAuditTask',
  // 呈报记录
  // 呈报记录查询(分页)
  queryReportRecordPageList: '/ams/reportdata/queryReportRecordPageList',
  // 呈报记录详情
  queryReportRecordDetail: '/ams/reportdata/queryReportRecordDetail',
  // 查询资产折旧(分页)
  queryAssetDeprecitionPageList: '/ams/reportdata/queryAssetDeprecitionPageList',
  // 查询资产收入(分页)
  queryAssetIncomePageList: '/ams/reportdata/queryAssetIncomePageList',
  // 查询资产费用(分页)
  queryAssetExpensePageList: '/ams/reportdata/queryAssetExpensePageList',
  // 查询资产运营(分页)
  queryAssetOperationPageList: '/ams/reportdata/queryAssetOperationPageList',
  // 导出资产运营
  exportAssetOperationList: '/ams/reportdata/exportAssetOperationList',
  // 导出资产费用列表
  exportAssetExpenseList: '/ams/reportdata/exportAssetExpenseList',
  // 导出资产收入列表
  exportAssetIncomeList: '/ams/reportdata/exportAssetIncomeList',
  // 导出资产折旧列表
  exportAssetDeprecitionList: '/ams/reportdata/exportAssetDeprecitionList',
};

// v1.0.4需求，报表管理，其中也涉及多模块导出、导入
export const tableManage = {
  // 多模块导出
  // 价值登记列表导出
  exportRegisterExcel: '/ams/assetValueRegister/exportRegisterExcel',
  // 价值登记记录导出
  exportRecordExcel: '/ams/assetValueRegister/exportRecordExcel',
  // 处置登记列表导出
  exportDisposeExcel: '/ams/disposeRegister/exportDisposeExcel',
  // 异常管理导出
  exportExceptionExcel: '/ams/assetCheckResult/exportExceptionExcel',
  // 权属人列表导出
  exportObligeeExcel: '/ams/ownerShipUser/exportObligeeExcel',
  // 盘点报告列表导出
  exportReportExcel: '/ams/assetCheckReport/exportReportExcel',
  // 资产价值一览表导出
  exportValueExcel: '/ams/assetValueRegister/exportValueExcel',
  // 资产入账列表导出
  exportCardExcel: '/ams/assetCard/exportCardExcel',
  // 资产处置一览表导出
  exportDetailExcel: '/ams/disposeRegister/exportDetailExcel',
  // 资产项目数据查询
  // 资产项目数据查询汇总
  projectAssetTotal: '/ams/statistics/projectAssetTotal',
  // 资产价值导出
  exportAssetValue: '/ams/statistics/exportAssetValue',
  // 资产价值数据报表
  getAssetValue: '/ams/statistics/getAssetValue',
  // 资产价值查询统计
  getAssetValueCount: '/ams/statistics/getValueCount',
  // 资产价值数据报表合计
  getAssetValueStatistics: '/ams/statistics/getAssetValueStatistics',
  // 资产项目数据报表
  projectAsset: '/ams/statistics/projectAsset',
  // 资产项目数据查询统计
  getAssetCount: '/ams/statistics/getAssetCount',
  // 资产项目查询导出
  exportAssetProject: '/ams/statistics/exportAsset',
  // 查询资产分类统计明细
  queryAssetTypeDetailTotal: '/ams/statistics/queryAssetTypeDetailTotal',
  // 房屋资产统计分析-查询列表
  queryAssetHouseList: '/ams/statistics/asset-house/pageList',
  // 房屋资产统计分析-查询列表（导出）
  exportAssetHouseList: '/ams/statistics/asset-house/pageList/export',
  // 房屋资产统计分析-汇总分析
  queryAssetHouseTotal: '/ams/statistics/asset-house/total',
  // 房屋资产统计分析-查询列表-合计
  pageListStatistics: '/ams/statistics/asset-house/pageListStatistics',
  // 有证房屋资产统计表
  queryWarrantHouse: '/ams/statistics/asset/house/warrant',
  // 有证房屋资产统计表（导出）
  exportWarrantHouse: '/ams/statistics/asset/house/warrant/export',
  // 权属证件一览表
  queryWarrantList: '/ams/statistics/ownership/warrant',
  // 权属证件一览表（导出）
  exportOwnershipCardList: '/ams/exportDynamicColumn/exportWarrant',
  // 权证数量统计表
  queryWarrantStatistics: '/ams/statistics/warrant/number',
  // 权证数量统计表（导出）
  exportWarrantStatistics: '/ams/statistics/warrant/number/export',
  // 查询权证面积稽查列表
  checkShipArea: '/ams/yueXinReport/checkShipArea',
  // 权属人批量导入
  importOwnerData: '/ams/ownerShipUser/importData',
  // 权属证件批量导入
  importOwnCardData: '/ams/ownerShipUser/warrant/importData',
  // 模板下载
  downloadTemplate: '/ams/project/download',
  // 资产卡片批量导入
  importAssetCardData: '/ams/assetCard/importData',
  // 资产项目批量导入
  importAssetProjectData: '/ams/project/importData',
  // 权证数量统计表(汇总)
  queryWarrantSumInfo: '/ams/statistics/warrant/numberCount',
  // 有证房屋资产统计表(汇总)
  queryHouseAssetSumInfo: '/ams/statistics/asset/house/warrantCount',
  // 权属证件一览表(汇总)
  queryOwnershipCardSumInfo: '/ams/statistics/ownership/warrant/count',
  // 权属证件一览表-合计
  queryOwnershipCardTableTotal: '/ams/statistics/ownership/warrantCount',
  // 房屋资产&资源统计表-导出
  houseResourceExport: '/ams/statistics/houseResource/export',
  // 房屋资产&资源统计表-明细-导出
  detailExport: '/ams/statistics/houseResource/detail/export',
  // 房屋资产&资源统计表-明细-房屋列表
  detailPageList: '/ams/statistics/houseResource/detail/pageList',
  // 房屋资产&资源统计表-明细-房屋列表
  detailHousePage: '/ams/statistics/houseResource/detail/housePage',
  // 房屋资产&资源统计表-明细-汇总
  detailTotal: '/ams/statistics/houseResource/detail/total',
  // 房屋资产&资源统计表-查询列表
  houseResourcePageList: '/ams/statistics/houseResource/pageList',
  // 房屋资产&资源统计表-汇总
  houseResourceTotal: '/ams/statistics/houseResource/total',
};

// 资产入库
export const assetIn = {
  // 入库单统计
  getAssetStoreCount: '/ams/assetStore/getAssetStoreCount',
  // 入库登记单导出
  export: '/ams/assetStore/export',
  // 新增资产入库或修改
  addOrUpdateAssetStore: '/ams/assetStore/addOrUpdateAssetStore',
  // 新增资产入库或修改
  auditAssetStore: '/ams/assetStore/auditAssetStore',
  // 查询入库单详情
  queryAssetStoreDetail: '/ams/assetStore/queryAssetStoreDetail',
  // 资产入库列表查询
  queryAssetStoreList: '/ams/assetStore/queryAssetStoreList',
  // 资产入库一览表-列表
  getGeneralSurvey: '/ams/assetStore/getGeneralSurvey',
  // 资产入库一览表-列表统计
  getGeneralSurveyTotal: '/ams/assetStore/getGeneralSurveyTotal',
  // 资产入库一览表-列表导出
  getGeneralSurveyExport: '/ams/exportDynamicColumn/exportAssetStoreList',
};

// 资产入库
export const land = {
  // 土地台账--资产视图
  assetView: '/ams/assetLand/view/asset/assetView',
  // 土地资产视图 导出
  exportAssetLandViewList: '/ams/assetLand/view/asset/excel',
  // 土地台账--资产视图汇总
  assetViewTotal: '/ams/assetLand/view/asset/assetViewTotal',
  // 土地台账--资产视图详情
  assetViewDetail: '/ams/assetLand/view/asset/assetViewDetail',
  // 土地台账--组织机构视图
  organView: '/ams/assetLand/view/asset/organView',
  // 土地台账--组织机构视图汇总
  organViewTotal: '/ams/assetLand/view/asset/organViewTotal',
  // 土地台账--组织机构视图详情权属概况
  organViewShipDetail: '/ams/assetLand/view/asset/organViewShipDetail',
  // 土地台账--组织机构视图详情资产概况汇总
  organViewProjectDetailTotal: '/ams/assetLand/view/asset/organViewProjectDetailTotal',
  // 土地台账--组织机构视图详情资产概况列表
  organViewProjectDetail: '/ams/assetLand/view/asset/organViewProjectDetail',
  // 土地台账--组织机构视图导出
  organViewExport: '/ams/assetLand/view/asset/organViewExport',
  // 土地台账--资产项目视图
  viewGetAssetLandList: '/ams/project/viewGetAssetLandList',
  // 土地台账--资产项目视图汇总
  viewGetAssetLandStatistics: '/ams/project/viewGetAssetLandStatistics',
  // 土地台账--资产项目视图详情--资产状况
  viewLandDetailsPage: '/ams/project/viewLandDetailsPage',
  // 土地台账--资产项目视图详情导出
  viewGetAssetLandExport: '/ams/project/viewGetAssetLandExport',
  // 资产地图- 资产概况
  overview: '/ams/asset/map/overview',
  // 资产地图- 资产全量数据
  mapData: '/ams/asset/map/list',
  // 资产地图- 资产详情
  mapDetail: '/ams/asset/map/detail',
  // 土地台账资产视图汇总
  assetViewListTotal: '/ams/assetLand/view/asset/assetViewListTotal',
};

// 交付管理
export const delivery = {
  // 交付管理-修改状态
  updateStatus: '/ams/delivery/updateStatus',
  // 交付管理-分页列表
  getDeliveryPage: '/ams/delivery/getDeliveryPage',
  // 交付管理-列表汇总
  getDeliveryPageSum: '/ams/delivery/getDeliveryPageSum',
  // 交付管理-导出
  exportDeliveryList: '/ams/delivery/exportDeliveryList',
  // 交付管理-新增编辑保存
  saveOrUpdateDelivery: '/ams/delivery/saveOrUpdateDelivery',
  // 交付管理-分页查询交付明细列表
  getDeliveryDetailListPage: '/ams/delivery/getDeliveryDetailListPage',
  // 交付管理-查询交付信息
  getDeliveryById: '/ams/delivery/getDeliveryById',
  // 交付管理-查询交付明细列表
  getDeliveryDetailList: '/ams/delivery/getDeliveryDetailList',
  // 交付管理-查询明细列表汇总
  getDeliveryDetailListStatistics: '/ams/delivery/getDeliveryDetailListStatistics',
  // 资产交付记录
  deliveryGetChangeSchedulePage: '/ams/deliveryDetail/getChangeSchedulePage',
  // 资产交付记录导出
  deliveryExportChangeScheduleList: '/ams/deliveryDetail/exportChangeScheduleList',
  // 资产交付记录汇总
  getTotalDeliveryArea: '/ams/deliveryDetail/getTotalDeliveryArea',
};

// 使用管理
export const useManage = {
  // 资产领用-列表汇总
  getReceiveSum: '/ams/assetReceive/getReceiveSum',
  // 资产领用-列表汇总
  getReceivePage: '/ams/assetReceive/getReceivePage',
  // 资产领用-删除
  deleteReceive: '/ams/assetReceive/deleteReceive',
  // 资产领用-导出
  exportReceive: '/ams/assetReceive/exportReceive',
  // 资产领用-新增编辑保存
  submitReceive: '/ams/assetReceive/submitReceive',
  // 资产领用-详情
  getReceiveInfo: '/ams/assetReceive/getReceiveInfo',
  // 资产领用一览表-分页列表
  getReceiveDetailPage: '/ams/assetReceive/getReceiveDetailPage',
  // 资产领用一览表-列表汇总
  getReceiveDetailSum: '/ams/assetReceive/getReceiveDetailSum',
  // 资产领用一览表-导出
  exportReceiveDetail: '/ams/assetReceive/exportReceiveDetail',
  // 资产领用一览表-详情
  getReceiveDetailInfo: '/ams/assetReceive/getReceiveDetailInfo',
  // 资产领用-详情资产明细分页
  getReceiveAssetDetailPage: '/ams/assetReceive/getReceiveAssetDetailPage',
  // 资产归还-分页列表
  getReturnPage: '/ams/assetReturn/getReturnPage',
  // 资产归还-列表汇总
  getReturnSum: '/ams/assetReturn/getReturnSum',
  // 资产归还-删除
  deleteReturn: '/ams/assetReturn/deleteReturn',
  // 资产归还-导出
  exportReturn: '/ams/assetReturn/exportReturn',
  // 资产归还-新增编辑保存
  submitReturn: '/ams/assetReturn/submitReturn',
  // 资产归还-详情
  getReturnInfo: '/ams/assetReturn/getReturnInfo',
  // 资产归还-详情明细分页
  getReturnAssetDetailPage: '/ams/assetReturn/getReturnAssetDetailPage',
  // 资产归还一览表-分页列表
  getReturnDetailPage: '/ams/assetReturn/getReturnDetailPage',
  // 资产归还一览表-导出
  exportReturnDetail: '/ams/assetReturn/exportReturnDetail',
  // 资产归还一览表-详情
  getReturnDetailInfo: '/ams/assetReturn/getReturnDetailInfo',
  // 资产领用-资产归还选择领用记录分页列表
  getReceiveRecordPage: '/ams/assetReceive/getReceiveRecordPage',
  // 资产领用-审批
  approveReceive: '/ams/assetReceive/approveReceive',
  // 资产归还-审批
  approveReturn: '/ams/assetReturn/approveReturn',
  // 巡查记录-分页列表
  getListPage: '/ams/inspectionTaskRecord/getListPage',
  // 巡查记录-新增编辑保存
  addOrUpdateInspectionRecord: '/ams/inspectionTaskRecord/addOrUpdateInspectionRecord',
  // 巡查记录-导出详情
  exportDetail: '/ams/inspectionTaskRecord/exportDetail',
  // 巡查记录-导出记录列表
  exportList: '/ams/inspectionTaskRecord/exportList',
  // 巡查记录-详情
  getInspectionTaskRecord: '/ams/inspectionTaskRecord/getInspectionTaskRecord',
  // 巡查记录-分页查询检查项列表
  getInspectionCheckItemPageList: '/ams/inspectionCheckItem/getInspectionCheckItemPageList',
  // 巡查记录-不分页查询检查项列表
  getInspectionCheckItemList: '/ams/inspectionCheckItem/getInspectionCheckItemList',
  // 巡查记录-删除巡查记录
  updateStatusOrDelete: '/ams/inspectionTaskRecord/updateStatusOrDelete',
};

// 资产出租
export const assetRent = {
  // 出租登记-分页查询出租单列表
  getLeaseOrderPageList: '/ams/leaseOrder/getLeaseOrderPageList',
  // 出租登记-查询列表表头统计
  getLeaseOrderStatistics: '/ams/leaseOrder/getLeaseOrderStatistics',
  // 资产出租一览表-列表分页查询
  queryRentViewPage: '/ams/leaseDetail/getLeaseDetailGlancePageList',
  // 资产出租一览表-导出
  exportRentView: '/ams/leaseDetail/exportLeaseDetailGlanceList',
  // 资产出租一览表-查询列表表头统计
  queryRentViewTotal: '/ams/leaseDetail/getLeaseDetailGlanceStatistics',
  // 选客户
  queryCustUserInPageList: '/ams/customerApi/queryCustUserInPageList',
  // 出租登记-新增or修改保存出租单
  saveUpdateLeaseOrder: '/ams/leaseOrder/saveUpdateLeaseOrder',
  // 出租登记-查询出租单
  getLeaseOrder: '/ams/leaseOrder/getLeaseOrder',
  // 出租登记-查询出租明细列表
  getLeaseDetailList: '/ams/leaseDetail/getLeaseDetailList',
  // 出租登记-查询出租明细分页列表
  getLeaseDetailPageList: '/ams/leaseDetail/getLeaseDetailPageList',
  // 资产出租/投资收益登记-分页查询收益明细
  getIncomeDetailPageList: '/ams/income/getIncomeDetailPageList',
  // 资产出租/投资收益登记-查询收益明细合计
  getIncomeDetailStatistics: '/ams/income/getIncomeDetailStatistics',
  // 资产出租/投资收益登记-分页查询收益单列表
  getIncomePageList: '/ams/income/getIncomePageList',
  // 资产出租/投资收益登记-新增or修改保存收益单
  saveUpdateIncome: '/ams/income/saveUpdateIncome',
  // 资产出租/投资收益登记-查询收益
  getIncome: '/ams/income/getIncome',
  // 资产出租/投资收益登记-查询列表表头统计
  getIncomeStatistics: '/ams/income/getIncomeStatistics',
  // 出租登记-修改状态
  updateLeaseOrderStatus: '/ams/leaseOrder/updateLeaseOrderStatus',
  // 资产出租/投资收益登记-修改状态
  updateIncomeStatus: '/ams/income/updateIncomeStatus',
  // 资产出租/投资收益登记-导出
  exportIncome: '/ams/income/exportIncome',
  // 出租登记-导出
  exportLeaseOrder: '/ams/leaseOrder/exportLeaseOrder',
};

// 资产投资
export const assetInvest = {
  // 资产出租一览表-列表分页查询
  queryInvestViewPage: '/ams/investDetail/getInvestDetailGlancePageList',
  // 资产出租一览表-导出
  exportInvestView: '/ams/investDetail/exportInvestDetailGlanceList',
  // 资产出租一览表-查询列表表头统计
  queryInvestViewTotal: '/ams/investDetail/getInvestDetailGlanceStatistics',
  // 投资登记-修改状态
  updateInvestOrderStatus: '/ams/investOrder/updateInvestOrderStatus',
  // 投资登记-分页查询投资单列表
  getInvestOrderPageList: '/ams/investOrder/getInvestOrderPageList',
  // 投资登记-导出
  exportInvestOrder: '/ams/investOrder/exportInvestOrder',
  // 投资登记-新增or修改保存投资单
  saveUpdateInvestOrder: '/ams/investOrder/saveUpdateInvestOrder',
  // 投资登记-查询列表表头统计
  getInvestOrderStatistics: '/ams/investOrder/getInvestOrderStatistics',
  // 投资登记-查询投资单
  getInvestOrder: '/ams/investOrder/getInvestOrder',
  // 投资登记-查询投资明细分页列表
  getInvestDetailPageList: '/ams/investDetail/getInvestDetailPageList',
  // 投资登记-查询投资明细列表
  getInvestDetailList: '/ams/investDetail/getInvestDetailList',
};

// 资产维修
export const assetRepair = {
  // 资产维修-列表汇总(表头统计)
  getMaintainSum: '/ams/assetMaintain/getMaintainSum',
  // 资产维修-分页列表
  getMaintainPage: '/ams/assetMaintain/getMaintainPage',
  // 资产维修-新增编辑保存
  submitMaintain: '/ams/assetMaintain/submitMaintain',
  // 资产维修-审批
  approveMaintain: '/ams/assetMaintain/approveMaintain',
  // 资产维修-详情
  getMaintainInfo: '/ams/assetMaintain/getMaintainInfo',
  // 资产维修-反审核
  opposeApproveMaintain: '/ams/assetMaintain/opposeApproveMaintain',
  // 资产维修-删除
  deleteMaintain: '/ams/assetMaintain/deleteMaintain',
  // 资产维修-导出
  exportMaintain: '/ams/assetMaintain/exportMaintain',
};

// 参数配置
export const paramsConfig = {
  // 组织机构系统设置查询
  querySysSet: '/ams/basicSettings/querySysSet',
  // 组织机构系统设置查询
  paramsSave: '/ams/basicSettings/save',
  // 组织机构系统设置统一查询接口
  queryParamsConfigDetail: '/ams/basicSettings/detail',
  // 获取Bpm工作流公共接口
  getDataFromBpmWorkFlow: '/ams/approval/getDataFromBpmWorkFlow',
  // 项目信息设置 获取货币单位以及面积单位
  getResourceConfig: '/ams/publicApi/getResourceConfig',
};

// 资产编码规则
export const codeRule = {
  // 插入参数列表接口
  paramInit: '/ams/codeRule/paramInit',
  // 列表接口
  init: '/ams/codeRule/init',
  // 预览
  getPreview: '/ams/codeRule/getPreview',
  // 保存编码规则
  save: '/ams/codeRule/save',
  // 获取编码默认规则
  default: '/ams/codeRule/default',
};

// 条码管理
export const barCode = {
  // 主列表查询
  queryLabelCodeList: '/ams/labelCodeManager/queryLabelCodeList',
  // 编辑标签
  editLabel: '/ams/labelCodeManager/editLabel',
  // 下载模板/导出
  exportLabelData: '/ams/labelCodeManager/exportLabelData',
  // 批量更新标签-导入
  readExcelModel: '/ams/labelCodeManager/readExcelModel',
  // 查询资产条码
  findAssetLabel: '/ams/assetLabelCode/findAssetLabel',
  // 保存/编辑
  saveAssetLabel: '/ams/assetLabelCode/saveAssetLabel',
  // 条码打印
  barCodePrint: '/ams/labelCodeManager/barCodePrint',
};

export const attrConfig = {
  // 新增属性配置
  insertAssetAttrConfig: '/ams/assetAttr/insertAssetAttrConfig',
  // 查询属性
  queryAssetAttrConfig: '/ams/assetAttr/queryAssetAttrConfig',
  // 更新属性配置,状态
  updateAssetAttrConfig: '/ams/assetAttr/updateAssetAttrConfig',
  // updateAssetAttrConfig: "/ams/assetAttr/updateAssetAttrConfig",
};
export const assetOperationMode = {
  // 查询业务属性字段
  queryAssetAttrConfig: '/ams/assetOperationMode/queryAssetAttrConfig',
  updateAssetAttrConfig: '/ams/assetOperationMode/updateAssetAttrConfig',
};
// 资产业务信息
export const assetBussinessInformation = {
  // 用户配置查询
  assetRolList: '/ams/assetShowConfig/assetRolList',
  // 新增用户配置
  addCustomShow: '/ams/assetShowConfig/addCustomShow',
  // 查询土地台账列表
  queryAssetAttr: '/ams/assetAttr/queryAssetAttr',
  // 更新土地列表
  updateAssetAttr: '/ams/assetAttr/updateAssetAttr',
  // 土地视图面积统计
  queryAssetAttrViewTotal: '/ams/assetAttr/queryAssetAttrViewTotal',
  // 导入
  readExcelModel: '/ams/assetAttr/readExcelModel',
  // 导出
  exportTransferOperation: '/ams/assetAttr/exportTransferOperation',
  // 资产经营导出查询
  queryAssetToExport: '/ams/assetAttr/queryAssetToExport',
  // 导出全部数据
  exportOperationAttr: '/ams/assetAttr/exportOperationAttr',
};

// 土地地图绘制
export const drawMap = {
  // 上传图层图片
  uploadImage: '/ams/layerScheme/uploadImage',
  // 图层方案修改
  updateLayerScheme: '/ams/layerScheme/updateLayerScheme',
  // 图层方案删除
  deleteLayerScheme: '/ams/layerScheme/deleteLayerScheme',
  // 新增图层方案
  addLayerScheme: '/ams/layerScheme/addLayerScheme',
  // 查询图层方案(分页)
  queryLayerPageList: '/ams/layerScheme/queryLayerPageList',
  // 根据项目查询资产及经营方式
  queryAssetOpMode: '/ams/layerScheme/queryAssetOpMode',
  // 批量新增图层绘制详情
  addLayerDetails: '/ams/layerScheme/addLayerDetails',
  // 批量删除图层绘制详情
  deleteLayerDetails: '/ams/layerScheme/deleteLayerDetails',
  // 批量修改图层绘制详情
  updateLayerDetails: '/ams/layerScheme/updateLayerDetails',
  // 统计土地用途
  landUseStatistics: '/ams/layerScheme/landUseStatistics',
  // 资产地图-土地资产和业务详情
  landBusinessDetail: '/ams/asset/map/landBusinessDetail',
  // 资产地图-土地资产和业务详情
  queryLayerById: '/ams/layerScheme/queryLayerById',
  // 设置浮层需要的字段
  setLayerFields: '/ams/layerScheme/setLayerFields',
  // 查询浮层需要的字段
  queryLayerFields: '/ams/layerScheme/queryLayerFields',
  // 导出 已绘制图块
  exportLandDetails: '/ams/layerScheme/exportLandDetails',
};
export const operationParams = {
  // 分页查询转运营参数列表
  getPage: '/ams/operationParam/getPage',
  // 修改资产转运营参数状态
  updateStatus: '/ams/operationParam/updateStatus',
  // 资产转运营参数-新增保存
  saveTransferOperationParam: '/ams/operationParam/saveTransferOperationParam',
  // 资产转运营参数-编辑提交
  editTransferOperationParam: '/ams/operationParam/editTransferOperationParam',
  // 资产转运营参数-详情
  getDetail: '/ams/operationParam/getDetail',
};

export const toOperation = {
  // 主列表导出
  exportListPage: '/ams/operation/exportListPage',
  // 主列表查询
  getTransferOperationPage: '/ams/operation/getTransferOperationPage',
  // 主列表统计
  getOperationPageStatistics: '/ams/operation/getOperationPageStatistics',
  // 审核
  updateOperationApprovalStatus: '/ams/operation/updateOperationApprovalStatus',
  // 新增提交
  submitTransferOperation: '/ams/operation/submitTransferOperation',
  // 添加资产导出
  exportAsset: '/ams/operation/exportAsset',
  // 详情-基本信息
  getBasicMessage: '/ams/operation/getBasicMessage',
  // 详情-资产转运营明细列表
  getOperationDetailListPage: '/ams/operation/getOperationDetailListPage',
  // 调整转运营项位置
  adjustParamPosition: '/ams/operationParam/adjustParamPosition',
  // 批量导入
  readExcelModelV3: '/ams/operation/readExcelModelV3',
  // 删除
  deleteOperation: '/ams/operation/deleteOperation',
};

export const approve = {
  // 根据BPM流程实例id查询审批单详情
  getApprByServiceOrderId: '/ams/approval/getApprByServiceOrderId',
  // 根据业务类型和业务id查询审批轨迹接口
  queryApprovalRecordByBus: '/ams/approval/queryApprovalRecordByBus',
  // 统一审批接口
  uniformSubmit: '/ams/approval/uniformSubmit',
  //审批文件
  downloadFile: '/eip-portal/system/file/v1/downloadFile',
};

export const transfer = {
  // 资产转让
  getList: '/ams/makeover/list',
  // 资产转让新增和更新
  addOrUpdate: '/ams/makeover/addOrUpdate',
  // 资产转让详情查询
  detail: '/ams/makeover/detail',
  // 资产转让删除
  delete: '/ams/makeover/delete',
  // 资产转让反审核
  deApproval: '/ams/makeover/deApproval',
  // 资产转让拟转让标的历史租赁情况查询
  historicLease: '/ams/makeover/historicLease',
  // 资产转让编辑回显
  feedback: '/ams/makeover/feedback',
  // 查询单个资产信息，权证、评估
  assetDetail: '/ams/makeover/assetDetail',
  // 资产查询批量租赁信息
  leaseBatchQuery: '/ams/makeover/leaseBatchQuery',
};

export const allot = {
  // 资产调拨列表
  queryTransferList: '/ams/disposeRegister/queryTransferList',
  // 资产调拨单新增修改
  addOrUpdateTransfer: '/ams/disposeRegister/addOrUpdateTransfer',
  // 查询资产详情
  queryTransferDetail: '/ams/disposeRegister/queryTransferDetail',
  // 反审批接口
  deApproval: '/ams/disposeRegister/deApproval',
};

export const cartPark = {
  // 车位资产视图列表查询
  parkingPage: '/ams/asset-carPark/parking/page',
  // 资产视图使用面积统计
  parkingArea: '/ams/asset-carPark/parking/area',
  // 车场单个资产的面积
  cartParkArea: '/ams/asset-carPark/area',
  // 车场资产信息查询
  assetCarPark: '/ams/asset-carPark',
  // 导出车场资产视图
  parkingExcel: '/ams/asset-carPark/parking/excel',
  // 车场视图列表查询
  carParkViewPage: '/ams/asset-carPark/carParking/page',
  // 车场视图面积信息
  carParkViewArea: '/ams/asset-carPark/carParking/area',
  // 车场视图列表导出
  carParkViewExcel: '/ams/asset-carPark/place/excel',
  // 根据组织机构和项目查询车场列表
  organPlace: '/ams/asset-carPark/organ/place',
  // 车场视图详情
  carParkViewDetail: '/ams/asset-carPark/carParking',
  // 车场下车位列表信息
  carParkingList: '/ams/asset-carPark/parkingList',
  // 车场视图车位区域名称列表
  parkingAreaNames: '/ams/asset-carPark/parkingAreaName',
  // 组织机构视图汇总
  organGetTotal: '/ams/asset-carPark/organ/getTotal',
  // 车场组织机构视图列表查询
  carParkViewOrgan: '/ams/asset-carPark/organ/carParkView',
  // 单个车场的使用面积
  placeArea: '/ams/asset-carPark/placeArea',
  // 组织机构车场列表导出
  carParkExPortForOrgan: '/ams/asset-carPark/organ/carParkExPort',
  // 组织机构详情列表
  getCarParkListForOrgan: '/ams/asset-carPark/viewGetCarParkListForOrgan',
  // 组织机构视图详情表头统计
  getCarParkStatisticsForOrgan: '/ams/asset-carPark/viewGetCarParkStatisticsForOrgan',
  // 组织机构视图详情权属
  getCarParkViewShip: '/ams/asset-carPark/organ/carParkViewShip',
  // 资产项目视图列表-查询信息分页查询
  viewGetCarParkList: '/ams/project/viewGetCarParkList',
  // 资产项目视图列表头-查询车场信息统计
  getAssetCarParkStatistics: '/ams/project/viewGetAssetCarParkStatistics',
  // 查询资产项目详情查询
  projectDetailsById: '/ams/project/projectDetailsById',
  // 资产项目视图列表-导出
  carParkProjectExPort: '/ams/project/carParkProjectExPort',
  // 资产项目视图详情-资产状况统计列表分页
  viewCarParkDetailsPage: '/ams/project/viewCarParkDetailsPage',
  // 资产项目视图（详情）-车场资产状况统计
  viewProjectCarParkDetails: '/ams/project/viewProjectCarParkDetails',
};
// 设备设施台帐
export const equipmentview = {
  // 列表页面查询
  getPage: '/ams/equipment/view/page',
  // 列表页面统计
  getTotal: '/ams/equipment/view/total',
  // 设备资产视图基本信息
  getDetail: '/ams/equipment/view/detail',
  // 更新设备资产标签
  updateLabel: '/ams/equipment/view/updateLabel',
  // 列表页面动态列导出
  exportExcel: '/ams/equipment/view/export',

  // 设备设施项目视图列表
  viewProject: '/ams/asset-equipment/viewProject',
  // 设备设施项目导出
  exportExcelProject: '/ams/asset-equipment/export',
  // 项目视图列表统计
  equipmentStatistics: '/ams/asset-equipment/equipmentStatistics',
  // 资产项目详情
  detailProject: '/ams/asset-equipment/detailProject',
  // 查询单个设备的巡检、保养记录
  getEquipmentRecordTask: '/equipment-openapi/equipmentDtInst/getEquipmentRecordTask',
  // 查询单个设备某条任务的检查结果详情
  pageEquipmentDtInstAttr: '/equipment-openapi/equipmentDtInstAttr/pageEquipmentDtInstAttr',
  // 查询单个设备的报障记录
  getEquipmentInstRecordOrder: '/equipment-openapi/equipmentDtInst/getEquipmentInstRecordOrder',
};
// 保险管理
export const assetInsurance = {
  /**
   * 资产保险单
   */
  // 新增
  addOrUpdateAssetInsurance: '/ams/assetInsurance/addOrUpdateAssetInsurance',
  // 首页列表
  queryAssetInsuranceList: '/ams/assetInsurance/queryAssetInsuranceList',
  // 首页统计
  getAssetInsuranceCount: '/ams/assetInsurance/getAssetInsuranceCount',
  // 详情
  getDetailBaseInfo: '/ams/assetInsurance/getDetailBaseInfo',
  // 详情-资产信息
  getDetailAssetInfo: '/ams/assetInsurance/getDetailAssetInfo',
  /**
   * 即将到期保险
   */
  // 主列表查询
  queryExpiringInsuranceList: '/ams/assetInsurance/queryExpiringInsuranceList',
  // 统计
  getExpiringInsuranceCount: '/ams/assetInsurance/getExpiringInsuranceCount',
  /**
   * 资产保险一览表
   */
  findAssetRegInsuranceList: '/ams/assetInsurance/findAssetRegInsuranceList',
  // 资产保险一览表--统计
  getAssetRegInsuranceTotal: '/ams/assetInsurance/getAssetRegInsuranceTotal',
  //
  deleteInsurance: '/ams/assetInsurance/deleteInsurance',
  //导出
  exportValueExcel: '/ams/assetInsurance/exportValueExcel',
};
// 房屋状态配置
export const houseStatusConfig = {
  //查询房屋状态
  querySettingByOrganId: '/ams/houseStatusSetting/querySettingByOrganId',
  //房屋状态插入
  insertSetting: '/ams/houseStatusSetting/insertSetting',
  //房屋状态更新
  updateSetting: '/ams/houseStatusSetting/updateSetting',
};

export const projectManager = {
  // 查询资产项目责任人列表
  getProjectResponsibility: '/ams/project/getProjectResponsibility',
  // 查询资产项目责任人详情
  queryProjectResponsibilityDetail: '/ams/project/queryProjectResponsibilityDetail',
  // 新增项目资产责任人
  addProjectResponsibility: '/ams/project/addProjectResponsibility',
  // 删除资产项目责任人
  deleteProjectResponsibility: '/ams/project/deleteProjectResponsibility',
  // 资产项目责任人导入
  importProjectResponsibility: '/ams/project/importProjectResponsibility',
  // 资产项目责任人导出
  exportProjectResponsibility: '/ams/project/exportProjectResponsibility',
  // 模板导出
  downExport: '/ams/project/downExport',
};

export const debt = {
  //债务登记-分页列表
  getDebtPage: '/ams/debt/getDebtPage',
  //新增
  submitDebt: '/ams/debt/submitDebt',
  //详情
  getDebtInfo: '/ams/debt/getDebtInfo',
  //资产明细
  getDebtInfoDetailLis: '/ams/debt/getDebtInfoDetailList',
  //删除
  deleteDebt: '/ams/debt/deleteDebt',
  //导出
  exportDebt: '/ams/debt/exportDebt',
  //明细分页列表
  getDebtDetailPage: '/ams/debt/getDebtDetailPage',
};
