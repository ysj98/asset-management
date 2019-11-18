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
  return axiosPost(assets.management.exportChangeScheduleList, data)
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
export function getProjectListPage (data) {
  return axiosPost(assets.assetRegister.getProjectListPage, data)
}
// 资产登记新增-下载导入模板
export function downloadTemplate (data) {
  return axiosPost(assets.assetRegister.downloadTemplate, data)
}
// 资产登记转运营信息-根据资产项目ID
export function getTransferByProjectId (data) {
  return axiosPost(assets.assetRegister.getTransferByProjectId, data)
}
// 资产登记明细列表-不分页
export function getRegisterOrderDetailsById (data) {
  return axiosGet(assets.assetRegister.getRegisterOrderDetailsById, data)
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

//资产分类设置
// 资产分类设置-资产分类列表
export function getPage (data) {
  return axiosPost(assets.assetClassSet.getPage, data, true, false)
}
// 资产分类设置-导出资产分类列表
export function exportList (data) {
  return axiosPost(assets.assetClassSet.exportList, data, false, false)
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
  return axiosGet(assets.assetClassSet.getDetail, data)
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
export function deleteProjectById (data) {
  return axiosPost(assets.assetProject.deleteProjectById, data, false, false)
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
  return axiosPost(assets.assetProject.getTransferByProjectId, data, false, false)
}