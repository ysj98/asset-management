/*
 * @fileName: Do not edit
 * @Author: han
 * @createTime: Do not edit
 * @desc: Do not Edit
 */
import { axiosPost, axiosGet  } from '../utils/axios'
import { assets } from '../config/config.url'
// post请求示例
// export function seachInspectionInstByItems (data) {
//   return axiosPost(assets.project.getproject, data)
// }
// get请求示例
// export function inspectionObjectInstDetail (data) {
//   return axiosGet(assets.project.getproject, data)
// }
// 文件下载请求示例
// export function exportInspectionInstByMaterial (data) {
//   return axiosPost(assets.project.getproject, data, false, false, {
//     responseType: 'blob'
//   })
// }

// 组织机构树
export function queryAsynOrganByUserId (data) {
  return axiosPost(assets.project.queryAsynOrganByUserId, data)
}

// 机构字典
export function organDict (data) {
  return axiosGet(assets.project.organDict, data)
}
// 平台字典
export function platformDict (data) {
  return axiosGet(assets.project.platformDict, data)
}
// 查询资产分类列表
export function getList (data) {
  return axiosGet(assets.project.getList, data)
}

// 资产变动
// 资产变动-一览表-分页列表
export function getChangeSchedulePage (data) {
  return axiosPost(assets.management.getChangeSchedulePage, data)
}
// 资产变动-详情
export function getChangeDetail (data) {
  return axiosGet(assets.management.getChangeDetail, data)
}
// 资产变动-一览表-导出
export function exportChangeScheduleList (data) {
  return axiosPost(assets.management.exportChangeScheduleList, data, false, false, {responseType: 'blob'})
}
// 资产变动-分页列表
export function getChangePage (data) {
  return axiosPost(assets.management.getChangePage, data)
}
// 资产变动-删除
export function deleteChange (data) {
  return axiosPost(assets.management.deleteChange, data)
}
// 资产变动-审批
export function approveChange (data) {
  return axiosPost(assets.management.approveChange, data)
}
// 资产变动-导入
export function importChange (data) {
  return axiosPost(assets.management.importChange, data)
}
// 资产变动-导出
export function exportChange (data) {
  return axiosGet(assets.management.exportChange, data)
}
// 资产变动-新增编辑
export function submitChange (data) {
  return axiosPost(assets.management.submitChange, data)
}
// 资产变动-编辑明细
export function getChangeInfo (data) {
  return axiosGet(assets.management.getChangeInfo, data)
}
// 资产变动-终止交付
export function stopDelivery (data) {
  return axiosPost(assets.management.stopDelivery, data)
}
// 房屋资产分页查询
export function assetHousePage (data) {
  return axiosPost(assets.management.assetHousePage, data)
}
// 资产变动-变动明细分页
export function getChangeDetailPage (data) {
  return axiosGet(assets.management.getChangeDetailPage, data)
}
// 资产列表
export function assetListPage (data) {
  return axiosPost(assets.management.assetListPage, data)
}

// 资产登记
// 资产登记-删除
export function deleteByRegisterOrderId (data) {
  return axiosPost(assets.assetRegister.deleteByRegisterOrderId, data)
}
// 资产登记-反审核
export function registerOrderReAudit (data) {
  return axiosPost(assets.assetRegister.registerOrderReAudit, data)
}
// 资产登记-审核
export function registerOrderAudit (data) {
  return axiosPost(assets.assetRegister.registerOrderAudit, data)
}
// 资产登记-新增保存
export function saveRegisterOrder (data) {
  return axiosPost(assets.assetRegister.saveRegisterOrder, data)
}
// 资产登记-编辑保存
export function updateRegisterOrder (data) {
  return axiosPost(assets.assetRegister.updateRegisterOrder, data)
}
// 资产登记-编辑回显
export function getRegisterOrderById (data) {
  return axiosGet(assets.assetRegister.getRegisterOrderById, data)
}
// 资产登记明细列表-分页
export function getRegisterOrderDetailsPageById (data) {
  return axiosPost(assets.assetRegister.getRegisterOrderDetailsPageById, data)
}
//资产登记列表-分页查询
export function getRegisterOrderListPage (data) {
  return axiosPost(assets.assetRegister.getRegisterOrderListPage, data)
}
// 资产登记新增-下载导入模板
export function downloadTemplate (data) {
  return axiosPost(assets.assetRegister.downloadTemplate, data, false, false, {responseType: 'blob'})
}
// 资产登记转运营信息-根据资产项目ID
export function getTransferByProjectId (data) {
  return axiosPost(assets.assetRegister.getTransferByProjectId, data)
}
// 资产登记明细列表-不分页
export function getRegisterOrderDetailsById (data) {
  return axiosPost(assets.assetRegister.getRegisterOrderDetailsById, data)
}
// 资产登记-详情明细统计
export function getRegisterOrderDetailsStatistics (data) {
  return axiosGet(assets.assetRegister.getRegisterOrderDetailsStatistics, data)
}
// 资产登记-读取excel模板文件
export function readExcelModel (data) {
  return axiosPost(assets.assetRegister.readExcelModel, data)
}
// 资产登记-导出数据校验
export function checkBuildsObjectType (data) {
  return axiosPost(assets.assetRegister.checkBuildsObjectType, data)
}

// 资产清理
// 资产清理-分页列表
export function getCleanupPage (data) {
  return axiosPost(assets.assetClear.getCleanupPage, data, true, false)
}
// 资产清理-删除
export function deleteCleanup (data) {
  return axiosPost(assets.assetClear.deleteCleanup, data, false, false)
}
// 资产清理-审批
export function approvalCleanup (data) {
  return axiosPost(assets.assetClear.approvalCleanup, data, false, false)
}
// 资产清理-审批
export function reverseApproveCleanup (data) {
  return axiosPost(assets.assetClear.reverseApproveCleanup, data, false, false)
}
// 资产清理-新增编辑保存
export function submitCleanup (data) {
  return axiosPost(assets.assetClear.submitCleanup, data, false, false)
}
// 资产清理-编辑查询明细
export function getCleanupInfo (data) {
  return axiosGet(assets.assetClear.getCleanupInfo, data)
}
// 资产清理-详情
export function getCleanupDetail (data) {
  return axiosGet(assets.assetClear.getCleanupDetail, data)
}
// 资产清理-资产明细分页列表
export function getCleanupDetailPage (data) {
  return axiosGet(assets.assetClear.getCleanupDetailPage, data)
}

//资产分类设置
// 资产分类设置-资产分类列表
export function getPage (data) {
  return axiosPost(assets.assetClassSet.getPage, data, true, false)
}
// 资产分类设置-导出资产分类列表
export function exportList (data) {
  return axiosPost(assets.assetClassSet.exportList, data, false, false, {responseType: 'blob'})
}
// 资产分类设置-获取费用科目类列表
export function getFeeTypeList (data) {
  return axiosGet(assets.assetClassSet.getFeeTypeList, data)
}
// 资产分类设置-修改资产分类
export function update (data) {
  return axiosPost(assets.assetClassSet.update, data, false, false)
}
// 资产分类设置-修改资产分类状态
export function updateStatus (data) {
  return axiosPost(assets.assetClassSet.updateStatus, data, false, false)
}
// 资产分类设置-获取资产分类详情
export function getDetail (data) {
  return axiosPost(assets.assetClassSet.getDetail, data, false, false)
}

// 房屋台账-资产项目视图
// 资产项目视图列表-查询房屋和楼栋信息分页查询
export function viewGetAssetHouseList (data) {
  return axiosPost(assets.assetProjectView.viewGetAssetHouseList, data, true, false)
}
// 资产项目视图列表头-查询房屋和楼栋信息统计
export function viewGetAssetHouseStatistics (data) {
  return axiosPost(assets.assetProjectView.viewGetAssetHouseStatistics, data, false, false)
}
// 资产项目视图详情-资产状况统计列表分页
export function viewDetailsPage (data) {
  return axiosPost(assets.assetProjectView.viewDetailsPage, data, false, false)
}
// 资产项目视图（详情）-资产状况统计
export function viewProjectHouseDetails (data) {
  return axiosPost(assets.assetProjectView.viewProjectHouseDetails, data, false, false)
}
// 房屋台账-楼栋视图
// 查询楼栋视图面积使用统计
export function queryBuildingViewFloorArea (data) {
  return axiosPost(assets.buildingView.queryFloorArea, data, false, false)
}

// 楼栋视图分页查询
export function queryBuildingViewPage (data) {
  return axiosPost(assets.buildingView.queryViewPage, data, false, false)
}
// 导出楼栋视图excel
export function exportBuildingViewExcel (data) {
  return axiosPost(assets.buildingView.exportExcel, data, false, false, {responseType: 'blob'})
}
// 楼层信息查询
export function queryBuildingViewFloorInfo (data) {
  return axiosGet(assets.buildingView.queryFloorInfo, data)
}
// 查询当前组织机构下所有的楼栋
export function queryBuildingByOrganId (data) {
  return axiosGet(assets.buildingView.queryBuildingByOrganId, data)
}

// 查询楼栋下的单元-楼层关系
export function queryBuildingViewUnitByHouseId (data) {
  return axiosGet(assets.buildingView.queryUnitByHouseId, data)
}
// 查询楼栋详情
export function queryBuildingViewBuildInfo (data) {
  return axiosGet(assets.buildingView.queryBuildInfo, data)
}
// 楼层信息查询
export function queryBuildingViewDetailArea (data) {
  return axiosGet(assets.buildingView.queryDetailArea, data)
}
// 查询楼层下房间的面积
export function queryBuildingViewRoomArea (data) {
  return axiosGet(assets.buildingView.queryRoomArea, data)
}

// 房屋台账 - 资产视图
// 房屋资产基本信息查询
export function queryAssetViewBaseInfo (data) {
  return axiosGet(assets.assetView.queryHouseInfo, data)
}

// 资产使用面积详情
export function queryAssetViewHouseArea (data) {
  return axiosGet(assets.assetView.queryHouseArea, data)
}

// 分页查询房屋资产信息
export function queryAssetViewPage (data) {
  return axiosPost(assets.assetView.queryAssetViewPage, data)
}

// 资产视图使用面积统计
export function queryAssetViewArea (data) {
  return axiosPost(assets.assetView.queryAssetArea, data)
}

// 导出房屋卡片
export function exportAssetViewHouseExcel (data) {
  return axiosGet(assets.assetView.exportHouseExcel, data, false, {responseType: 'blob'})
}
// 导出资产信息
export function exportAssetViewExcel (data) {
  return axiosPost(assets.assetView.exportAssetExcel, data, false, false, {responseType: 'blob'})
}
// 资产编辑保存
export function saveAssetViewHouseInfo (data) {
  return axiosPost(assets.assetView.saveHouseInfo, data)
}
// 资产视图-其他信息Tab-查询权属信息
export function queryAssetViewOwnDetail (data) {
  return axiosGet(assets.assetView.queryOwnDetail, data)
}
// 资产视图-其他信息Tab-查询接管信息
export function queryAssetViewTakeOverDetail (data) {
  return axiosGet(assets.assetView.queryTakeOverDetail, data)
}
// 资产视图-其他信息Tab-查询账面信息
export function queryAssetViewBillDetail (data) {
  return axiosPost(assets.assetView.queryBillDetail, data)
}
// 资产视图-其他信息Tab-查询变动信息
export function queryAssetViewChangeDetail (data) {
  return axiosGet(assets.assetView.queryChangeDetail, data)
}
// 资产视图-其他信息Tab-查询资产处置信息
export function queryAssetViewDisposeDetail (data) {
  return axiosPost(assets.assetView.queryDisposeDetail, data)
}
// 资产视图-其他信息Tab-查询附属&配套信息
export function queryAssetViewAccessoryDetail (data) {
  return axiosPost(assets.assetView.queryAccessoryDetail, data)
}
// 查询组织机构下的员工
export function queryUserListByOrganId (data) {
  return axiosGet(assets.assetView.userList, data)
}

// 资产项目管理
// 分页查询资产项目列表-根据组织ID
export function queryProjectManageListPage (data) {
  return axiosPost(assets.projectManage.queryProjectListPage, data)
}

// 查询资产项目列表-根据组织ID(统计)
export function queryProjectManageProjectStatistics (data) {
  return axiosPost(assets.projectManage.queryProjectStatistics, data)
}

// 资产项目-删除
export function deleteProjectManageById (data) {
  return axiosPost(assets.projectManage.deleteProjectById, data)
}
// 查询资产项目详情-根据资产项目ID
export function queryProjectManageDetailById (data) {
  return axiosPost(assets.projectManage.queryDetailById, data)
}

// 查询资产项目编辑-根据资产项目ID
export function queryProjectManageEditDetailById (data) {
  return axiosPost(assets.projectManage.queryEditDetailById, data)
}

// 根据组织Id查资产项目
export function queryProjectManageProjectByOrganId (data) {
  return axiosGet(assets.assetView.queryProjectByOrganId, data)
}

// 资产项目-反审核
export function doProjectManageReaudit (data) {
  return axiosPost(assets.projectManage.reauditAction, data)
}
// 资产项目-导入保存
export function importProjectManageData (data) {
  return axiosPost(assets.projectManage.importProject, data)
}

// 资产项目-提交审核
export function doProjectManageAudit (data) {
  return axiosPost(assets.projectManage.AuditAction, data)
}

// 资产项目-新增保存
export function saveProjectManageNewProject (data) {
  return axiosPost(assets.projectManage.saveNewProject, data)
}

// 资产项目-编辑保存
export function saveProjectManageEditProject (data) {
  return axiosPost(assets.projectManage.saveEditProject, data)
}

// 资产项目-转运营信息统计
export function queryProjectManageTransferStatistics (data) {
  return axiosPost(assets.projectManage.queryTransferStatistics, data)
}

// 房屋台账-资产项目
// 分页查询资产项目列表-根据组织ID
export function getAssetProjectListPage (data) {
  return axiosPost(assets.assetProject.getProjectListPage, data, true, false)
}
// 查询资产项目列表-根据组织ID(统计)
export function getProjectListStatistics (data) {
  return axiosPost(assets.assetProject.getProjectListStatistics, data, false, false)
}
// 查询资产项目编辑-根据资产项目ID
export function projectDetailsForModifyById (data) {
  return axiosPost(assets.assetProject.projectDetailsForModifyById, data, false, false)
}
// 查询资产项目详情-根据资产项目ID
export function projectDetailsById (data) {
  return axiosPost(assets.assetProject.projectDetailsById, data, false, false)
}
// 资产项目-下拉框查询
export function getObjectKeyValueByOrganId (data) {
  return axiosGet(assets.assetProject.getObjectKeyValueByOrganId, data)
}
// 资产项目-删除
export function shipDrojectById (data) {
  return axiosPost(assets.assetProject.shipDrojectById, data, false, false)
}
// 资产项目-反审核
export function projectReAudit (data) {
  return axiosPost(assets.assetProject.projectReAudit, data, false, false)
}
// 资产项目-导入保存
export function importProject (data) {
  return axiosPost(assets.assetProject.importProject, data, false, false)
}
// 资产项目-提交审核
export function projectAudit (data) {
  return axiosPost(assets.assetProject.projectAudit, data, false, false)
}
// 资产项目-新增保存
export function saveProject (data) {
  return axiosPost(assets.assetProject.saveProject, data, false, false)
}
// 资产项目-编辑保存
export function modifyProject (data) {
  return axiosPost(assets.assetProject.modifyProject, data, false, false)
}
// 资产项目-转运营信息统计
export function getProjectTransferByProjectId (data) {
  return axiosPost(assets.projectManage.queryTransferStatistics, data, false, false)
}

// 资产项目-资产项目详情-资产概况
export function queryProjectManageGeneralInfo (data) {
  return axiosGet(assets.projectManage.queryGeneralInfo, data)
}

// 资产项目-资产项目详情-权属概况
export function queryProjectManageOwnInfo (data) {
  return axiosGet(assets.projectManage.queryOwnInfo, data)
}

// 权属人管理
// 权属人管理-新建或编辑权属人
export function saveOrUpdateOwner (data) {
  return axiosPost(assets.propertyOwnerManagement.saveOrUpdate, data, false, false)
}
// 权属人管理-权属人下拉列表
export function select (data) {
  return axiosGet(assets.propertyOwnerManagement.select, data)
}
// 权属人管理-权属人列表查询
export function list (data) {
  return axiosPost(assets.propertyOwnerManagement.list, data, true, false)
}
// 权属人管理-权属人删除
export function ownerDelete (data) {
  return axiosGet(assets.propertyOwnerManagement.ownerDelete, data)
}
// 权属人管理-权属人导入
export function ownerExport (data) {
  return axiosPost(assets.propertyOwnerManagement.ownerExport, data, false, false)
}
// 权属人管理-权属人导入模板下载
export function download (data) {
  return axiosGet(assets.propertyOwnerManagement.download, data)
}
// 权属人管理-权属人详情查询
export function detail (data) {
  return axiosGet(assets.propertyOwnerManagement.detail, data)
}

// 资产入账
// 资产入账-新建资产入账
export function insertCard (data) {
  return axiosPost(assets.assetEntry.insertCard, data, false, false)
}
// 资产入账-更新资产入账
export function updateCard (data) {
  return axiosPost(assets.assetEntry.updateCard, data, false, false)
}
// 资产入账-资产入账分页查询
export function queryCardPageList (data) {
  return axiosPost(assets.assetEntry.queryCardPageList, data, true, false)
}
// 资产入账-资产入账状态操作
export function updateCardStatus (data) {
  return axiosPost(assets.assetEntry.updateCardStatus, data, false, false)
}
// 资产入账-资产入账详情
export function queryCardDetail (data) {
  return axiosPost(assets.assetEntry.queryCardDetail, data, false, false)
}
