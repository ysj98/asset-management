/*
 * @Date: 2019-11-06 10:17:50
 * @Author: chen han
 * @Description: 
 */
import { axiosPost, axiosGet  } from '../utils/axios'
import { basics, ownershipSurvey, disposeRegister,  } from '../config/config.url'
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
// 文件下载
export function fileDownLoad (data) {
  return axiosGet(basics.fileDownLoad, data, false, {
    responseType: 'blob'
  })
}
// 附件下载
export function attachment (data) {
  return axiosGet(basics.attachment, data)
}
// 文件上传
export function fileUpload (data) {
  return axiosPost(basics.fileUpload, data)
}
export function queryAllTopOrganByUser (data) {
  return axiosGet(basics.queryAllTopOrganByUser, data)
}
// 请求房屋楼栋单元
export function getOptions (data) {
  return axiosPost(basics.getOptions, data)
}
// 根据根节点业态code获取下面的业态类型
export function queryNodesByRootCode (data) {
  return axiosGet(basics.queryNodesByRootCode, data)
}
// 根据业态Id 获取下面的子节点
export function queryChildNodesById (data) {
  return axiosGet(basics.queryChildNodesById, data)
}
// 查询省列表 省市区域接口 POST
export function queryProvinceList (data) {
  return axiosPost(basics.queryProvinceList, data)
}
// 查询省列表 省市区域接口 POST
export function queryCityAndAreaList (data) {
  return axiosPost(basics.queryCityAndAreaList, data)
}
// 按照一级物业公司查询楼栋列表
export function queryBuildList (data) {
  return axiosPost(basics.queryBuildList, data)
}
// 按照一级物业公司查询资源列表
export function positionApiList (data) {
  return axiosPost(basics.positionApiList, data)
}
//  请求楼层
export function queryFloorListByPosId (data) {
  return axiosGet(basics.queryFloorListByPosId, data)
}
// 查询组织机构字典
export function queryDictDataList (data) {
  return axiosPost(basics.queryDictDataList, data)
}
// 平台字典
export function platformDict (data) {
  return axiosGet(basics.platformDict, data)
}
// 机构字典
export function organDict (data) {
  return axiosGet(basics.organDict, data)
}
// 资产项目权属列表查询
export function ownerShipList (data) {
  return axiosPost(ownershipSurvey.ownerShipList, data)
}
// 资产项目权属导出
export function projectExport (data) {
  return axiosPost(ownershipSurvey.projectExport, data, false, false, {responseType: 'blob'})
}
// 资产项目权属详情列表信息
export function attrList (data) {
  return axiosPost(ownershipSurvey.attrList, data)
}
// 资产项目权属详情基本信息
export function attrBase (data) {
  return axiosGet(ownershipSurvey.attrBase, data)
}
// 权属登记
export function attrSet (data) {
  return axiosPost(ownershipSurvey.attrSet, data)
}
// 资产权属列表
export function assetList (data) {
  return axiosPost(ownershipSurvey.assetList, data)
}
// 资产权属导出
export function assetExport (data) {
  return axiosPost(ownershipSurvey.assetExport, data, false, false, {responseType: 'blob'})
}
// 资产权属详情
export function assetDetail (data) {
  return axiosGet(ownershipSurvey.assetDetail, data)
}
// 权属人下拉列表
export function ownerShipUserSelect (data) {
  return axiosGet(ownershipSurvey.ownerShipUserSelect, data)
}
// 根据项目id查询权属情况
export function queryByProjectId (data) {
  return axiosGet(ownershipSurvey.queryByProjectId, data)
}
// 根据组织机构查询人
export function queryUserPageList (data) {
  return axiosPost(basics.queryUserPageList, data)
}
// 根据组织机构查询岗位
export function queryPostNewPageList (data) {
  return axiosPost(basics.queryPostNewPageList, data)
}
// 处置登记列表-分页查询
export function getDisposeRegisterList (data) {
  return axiosPost(disposeRegister.getDisposeRegisterList, data)
}
// -修改保存 post
export function modifySave (data) {
  return axiosPost(disposeRegister.modifySave, data)
}
// -分页查询处置清单列表
export function getRegisterDetailListPage (data) {
  return axiosPost(disposeRegister.getRegisterDetailListPage, data)
}
// -新增保存
export function addRegisterSave (data) {
  return axiosPost(disposeRegister.addRegisterSave, data)
}
// -查询处置清单列表
export function getDisposeRegisterDetailList (data) {
  return axiosPost(disposeRegister.getDisposeRegisterDetailList, data)
}
// -查询收付款计划列表
export function getreceivecostPlanList (data) {
  return axiosPost(disposeRegister.getreceivecostPlanList, data)
}
// -处置登记-状态操作
export function updateDisposeRegisterStatus (data) {
  return axiosPost(disposeRegister.updateDisposeRegisterStatus, data)
}
// 处置登记查询-根据处置登记单ID
export function getDisposeRegisterById (data) {
  return axiosPost(disposeRegister.getDisposeRegisterById, data)
}
// 组织机构请求项目
export function queryCommunityListByOrganId (data) {
  return axiosGet(basics.queryCommunityListByOrganId, data)
}
// 业务字典查询 字典表接口 POST
export function queryDictList (data) {
  return axiosPost(basics.queryDictList, data)
}

// 土地信息导入文档
export function landImportExcel (organId, data) {
  return axiosPost(basics.landImportExcel + '/' + organId, data)
}
// 土地信息模板下载
export function landDownLoadExcel (data) {
  return axiosGet(basics.landDownLoadExcel, data, false, {responseType: 'blob'})
}
