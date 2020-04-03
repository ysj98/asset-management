// v1.0.4需求，报表管理，其中也涉及多模块导出、导入
import { axiosPost, axiosGet  } from '../utils/axios'
import { tableManage } from '../config/config.url'

// 价值登记列表导出
export function exportRegisterExcel (data) {
  return axiosPost(tableManage.exportRegisterExcel, data, false, false, {responseType: 'blob'})
}
// 价值登记记录导出
export function exportRecordExcel (data) {
  return axiosPost(tableManage.exportRecordExcel, data, false, false, {responseType: 'blob'})
}
// 处置登记列表导出
export function exportDisposeExcel (data) {
  return axiosPost(tableManage.exportDisposeExcel, data, false, false, {responseType: 'blob'})
}
// 异常管理导出
export function exportExceptionExcel (data) {
  return axiosPost(tableManage.exportExceptionExcel, data, false, false, {responseType: 'blob'})
}
// 权属人列表导出
export function exportObligeeExcel (data) {
  return axiosPost(tableManage.exportObligeeExcel, data, false, false, {responseType: 'blob'})
}
// 盘点报告列表导出
export function exportReportExcel (data) {
  return axiosPost(tableManage.exportReportExcel, data, false, false, {responseType: 'blob'})
}
// 资产价值一览表导出
export function exportValueExcel (data) {
  return axiosPost(tableManage.exportValueExcel, data, false, false, {responseType: 'blob'})
}
// 资产入账列表导出
export function exportCardExcel (data) {
  return axiosPost(tableManage.exportCardExcel, data, false, false, {responseType: 'blob'})
}
// 资产处置一览表导出
export function exportDetailExcel (data) {
  return axiosPost(tableManage.exportDetailExcel, data, false, false, {responseType: 'blob'})
}

// 资产项目数据查询
// 资产项目导出
export function exportAssetProject (data) {
  return axiosPost(tableManage.exportAssetProject, data)
}
// 资产价值统计导出
export function exportAssetValue (data) {
  return axiosPost(tableManage.exportAssetValue, data)
}
// 资产价值数据报表
export function getAssetValue (data) {
  return axiosPost(tableManage.getAssetValue, data)
}
// 资产价值查询统计
export function getAssetValueCount (data) {
  return axiosPost(tableManage.getAssetValueCount, data)
}
// 资产项目数据报表
export function projectAsset (data) {
  return axiosPost(tableManage.projectAsset, data)
}
// 资产项目数据查询统计
export function getAssetCount (data) {
  return axiosPost(tableManage.getAssetCount, data)
}
// 资产项目查询导出
export function exportAsset (data) {
  return axiosPost(tableManage.exportAsset, data)
}
// 房屋资产统计分析-查询列表
export function queryAssetHouseList (data) {
  return axiosPost(tableManage.queryAssetHouseList, data)
}
// 房屋资产统计分析-查询列表（导出）
export function exportAssetHouseList (data) {
  return axiosPost(tableManage.exportAssetHouseList, data)
}
// 房屋资产统计分析-汇总分析
export function queryAssetHouseTotal (data) {
  return axiosPost(tableManage.queryAssetHouseTotal, data)
}
// 有证房屋资产统计表
export function queryWarrantHouse (data) {
  return axiosPost(tableManage.queryWarrantHouse, data)
}
// 有证房屋资产统计表（导出）
export function exportWarrantHouse (data) {
  return axiosPost(tableManage.exportWarrantHouse, data)
}
// 权属证件一览表
export function queryWarrantList (data) {
  return axiosPost(tableManage.queryWarrantList, data)
}
// 权属证件一览表（导出）
export function exportOwnershipCardList (data) {
  return axiosPost(tableManage.exportOwnershipCardList, data)
}
// 权证数量统计表
export function queryWarrantStatistics (data) {
  return axiosPost(tableManage.queryWarrantStatistics, data)
}
// 权证数量统计表（导出）
export function exportWarrantStatistics (data) {
  return axiosPost(tableManage.exportWarrantStatistics, data)
}
