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
// 资产项目数据查询汇总
export function projectAssetTotal (data) {
  return axiosPost(tableManage.projectAssetTotal, data)
}
// 资产项目导出
export function exportAssetProject (data) {
  return axiosPost(tableManage.exportAssetProject, data, false, false, {responseType: 'blob'})
}
// 资产价值统计导出
export function exportAssetValue (data) {
  return axiosPost(tableManage.exportAssetValue, data, false, false, {responseType: 'blob'})
}
// 资产价值数据报表
export function getAssetValue (data) {
  return axiosPost(tableManage.getAssetValue, data)
}
// 资产价值查询统计
export function getAssetValueCount (data) {
  return axiosPost(tableManage.getAssetValueCount, data)
}
// 资产价值数据报表合计
export function getAssetValueStatistics (data) {
  return axiosPost(tableManage.getAssetValueStatistics, data)
}
// 资产项目数据报表
export function projectAsset (data) {
  return axiosPost(tableManage.projectAsset, data)
}
// 资产项目数据查询统计
export function getAssetCount (data) {
  return axiosPost(tableManage.getAssetCount, data)
}
// 房屋资产统计分析-查询列表
export function queryAssetHouseList (data) {
  return axiosPost(tableManage.queryAssetHouseList, data)
}
// 房屋资产统计分析-查询列表（导出）
export function exportAssetHouseList (data) {
  return axiosPost(tableManage.exportAssetHouseList, data, false, false, {responseType: 'blob'})
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
  return axiosPost(tableManage.exportWarrantHouse, data, false, false, {responseType: 'blob'})
}
// 权属证件一览表
export function queryWarrantList (data) {
  return axiosPost(tableManage.queryWarrantList, data)
}
// 权属证件一览表（导出）
export function exportOwnershipCardList (data) {
  return axiosPost(tableManage.exportOwnershipCardList, data, false, false, {responseType: 'blob'})
}
// 权证数量统计表
export function queryWarrantStatistics (data) {
  return axiosPost(tableManage.queryWarrantStatistics, data)
}
// 权证数量统计表（导出）
export function exportWarrantStatistics (data) {
  return axiosPost(tableManage.exportWarrantStatistics, data, false, false, {responseType: 'blob'})
}
// 多模块导入
// 权属人批量导入
export function importOwnerData (query, data) {
  return axiosPost(`${tableManage.importOwnerData}${query}`, data)
}
// 权属证件批量导入
export function importOwnCardData (query, data) {
  return axiosPost(`${tableManage.importOwnCardData}${query}`, data)
}
// 模板下载
export function downloadTemplate (fileName) {
  return axiosGet(`${tableManage.downloadTemplate}/${fileName}`, {}, false, {responseType: 'blob'})
}
// 资产卡片批量导入
export function importAssetCardData (query, data) {
  return axiosPost(`${tableManage.importAssetCardData}${query}`, data)
}
// 资产项目批量导入
export function importAssetProjectData (query, data) {
  return axiosPost(`${tableManage.importAssetProjectData}${query}`, data)
}
// 权证数量统计表(汇总)
export function queryWarrantSumInfo (data) {
  return axiosPost(tableManage.queryWarrantSumInfo, data)
}
// 有证房屋资产统计表(汇总)
export function queryHouseAssetSumInfo (data) {
  return axiosPost(tableManage.queryHouseAssetSumInfo, data)
}
// 权属证件一览表(汇总)
export function queryOwnershipCardSumInfo (data) {
  return axiosPost(tableManage.queryOwnershipCardSumInfo, data)
}
// 权属证件一览表(汇总)
export function queryOwnershipCardTableTotal (data) {
  return axiosPost(tableManage.queryOwnershipCardTableTotal, data)
}
//  --------------------------------------房屋资产&资源统计表-------------------------------------------------------------
// 房屋资产&资源统计表-导出
export function houseResourceExport (data) {
  return axiosPost(tableManage.houseResourceExport, data, false, false, {responseType: 'blob'})
}
// 房屋资产&资源统计表-明细-导出
export function detailExport (data) {
  return axiosPost(tableManage.detailExport, data, false, false, {responseType: 'blob'})
}
// 房屋资产&资源统计表-明细-房屋列表
export function detailPageList (data) {
  return axiosPost(tableManage.detailPageList, data)
}
// 房屋资产&资源统计表-明细-房屋列表
export function detailHousePage (data) {
  return axiosPost(tableManage.detailHousePage, data)
}
// 房屋资产&资源统计表-明细-汇总
export function detailTotal (data) {
  return axiosPost(tableManage.detailTotal, data)
}
// 房屋资产&资源统计表-查询列表
export function houseResourcePageList (data) {
  return axiosPost(tableManage.houseResourcePageList, data)
}
// 房屋资产&资源统计表-汇总
export function houseResourceTotal (data) {
  return axiosPost(tableManage.houseResourceTotal, data)
}