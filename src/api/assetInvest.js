// 资产投资相关接口
import { axiosPost, axiosGet } from '../utils/axios'
import { assetInvest } from '../config/config.url'
// 资产投资一览表-列表分页查询
export function queryInvestViewPage (data) {
  return axiosPost(assetInvest.queryInvestViewPage, data)
}

// 资产投资一览表-查询列表表头统计
export function queryInvestViewTotal (data) {
  return axiosPost(assetInvest.queryInvestViewTotal, data)
}

// 资产投资一览表-导出
export function exportInvestView (data) {
  return axiosPost(assetInvest.exportInvestView, data, false, false, { responseType: 'blob'})
}

// 投资登记-修改状态
export function updateInvestOrderStatus (data) {
  return axiosPost(assetInvest.updateInvestOrderStatus, data)
}

// 投资登记-分页查询投资单列表
export function getInvestOrderPageList (data) {
  return axiosPost(assetInvest.getInvestOrderPageList, data)
}

// 投资登记-导出
export function exportInvestOrder (data) {
  return axiosPost(assetInvest.exportInvestOrder, data, false, false, { responseType: 'blob'})
}

// 投资登记-新增or修改保存投资单
export function saveUpdateInvestOrder (data) {
  return axiosPost(assetInvest.saveUpdateInvestOrder, data)
}

// 投资登记-查询列表表头统计
export function getInvestOrderStatistics (data) {
  return axiosPost(assetInvest.getInvestOrderStatistics, data)
}

// 投资登记-查询投资单
export function getInvestOrder (data) {
  return axiosGet(assetInvest.getInvestOrder, data)
}

// 投资登记-查询投资明细列表
export function getInvestDetailList (data) {
  return axiosGet(assetInvest.getInvestDetailList, data)
}

// 投资登记-查询投资明细分页列表
export function getInvestDetailPageList (data) {
  return axiosPost(assetInvest.getInvestDetailPageList, data)
}
