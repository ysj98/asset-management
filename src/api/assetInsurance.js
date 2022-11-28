import {  axiosPost, axiosGet } from '../utils/axios'
import {assetInsurance} from '../config/config.url'

// 新增保险单
export function addOrUpdateAssetInsurance (data) {
  return axiosPost(assetInsurance.addOrUpdateAssetInsurance, data)
}
// 资产保险单首页列表
export function queryAssetInsuranceList (data) {
  return axiosPost(assetInsurance.queryAssetInsuranceList, data)
}
// 首页统计
export function getAssetInsuranceCount (data) {
  return axiosPost(assetInsurance.getAssetInsuranceCount, data)
}
// 保险单详情
export function getDetailBaseInfo (data) {
  return axiosPost(assetInsurance.getDetailBaseInfo, data)
}
// 删除
export function deleteInsurance (data) {
  return axiosGet(assetInsurance.deleteInsurance, data)
}
// 即将到期保险，主列表
export function queryExpiringInsuranceList (data) {
  return axiosPost(assetInsurance.queryExpiringInsuranceList, data)
}
// 即将到期保险，统计
export function getExpiringInsuranceCount (data) {
  return axiosPost(assetInsurance.getExpiringInsuranceCount, data)
}
// 保险单详情-资产信息
export function getDetailAssetInfo (data) {
  return axiosPost(assetInsurance.getDetailAssetInfo, data)
}
// 资产保险一览表
export function findAssetRegInsuranceList (data) {
  return axiosPost(assetInsurance.findAssetRegInsuranceList, data)
}
// 资产保险一览表统计
export function getAssetRegInsuranceTotal (data) {
  return axiosPost(assetInsurance.getAssetRegInsuranceTotal, data)
}
 // 资产保险一览表导出
export function exportValueExcel (data) {
  return axiosPost(assetInsurance.exportValueExcel, data, false, false, {responseType: 'blob'})
}
