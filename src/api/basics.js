/*
 * @Date: 2019-11-06 10:17:50
 * @Author: chen han
 * @Description: 
 */
import { axiosPost, axiosGet  } from '../utils/axios'
import { basics, ownershipSurvey } from '../config/config.url'
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
// 资产权属详情
export function assetDetail (data) {
  return axiosGet(ownershipSurvey.assetDetail, data)
}
