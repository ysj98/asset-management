import { axiosPost, axiosGet  } from '../utils/axios'
import { assetRent, assetRepair } from '../config/config.url'
// 资产出租相关
// 出租登记-分页查询出租单列表
export function getLeaseOrderPageList(data) {
  return axiosPost(assetRent.getLeaseOrderPageList, data)
}

// 出租登记-查询列表表头统计
export function getLeaseOrderStatistics(data) {
  return axiosPost(assetRent.getLeaseOrderStatistics, data)
}
// 资产出租一览表-列表分页查询
export function queryRentViewPage (data) {
  return axiosPost(assetRent.queryRentViewPage, data)
}

// 资产出租一览表-查询列表表头统计
export function queryRentViewTotal (data) {
  return axiosPost(assetRent.queryRentViewTotal, data)
}

// 资产出租一览表-导出
export function exportRentView (data) {
  return axiosPost(assetRent.exportRentView, data, false, false, { responseType: 'blob'})
}

// 资产出租-选客户
export function queryCustUserInPageList(data) {
  return axiosPost(assetRent.queryCustUserInPageList, data)
}

// 出租登记-新增or修改保存出租单
export function saveUpdateLeaseOrder(data) {
  return axiosPost(assetRent.saveUpdateLeaseOrder, data)
}

// 出租登记-查询出租单
export function getLeaseOrder(data) {
  return axiosGet(assetRent.getLeaseOrder, data)
}

// 出租登记-查询出租明细列表
export function getLeaseDetailList(data) {
  return axiosGet(assetRent.getLeaseDetailList, data)
}

// 出租登记-查询出租明细分页列表
export function getLeaseDetailPageList(data) {
  return axiosPost(assetRent.getLeaseDetailPageList, data)
}

// 资产出租/投资收益登记-分页查询收益明细
export function getIncomeDetailPageList(data) {
  return axiosPost(assetRent.getIncomeDetailPageList, data)
}

// 资产出租/投资收益登记-查询收益明细合计
export function getIncomeDetailStatistics(data) {
  return axiosPost(assetRent.getIncomeDetailStatistics, data)
}

// 资产出租/投资收益登记-分页查询收益单列表
export function getIncomePageList(data) {
  return axiosPost(assetRent.getIncomePageList, data)
}

// 资产出租/投资收益登记-新增or修改保存收益单
export function saveUpdateIncome(data) {
  return axiosPost(assetRent.saveUpdateIncome, data)
}

// 资产出租/投资收益登记-查询收益
export function getIncome(data) {
  return axiosGet(assetRent.getIncome, data)
}

// 资产出租/投资收益登记-查询列表表头统计
export function getIncomeStatistics(data) {
  return axiosPost(assetRent.getIncomeStatistics, data)
}

// 出租登记-修改状态
export function updateLeaseOrderStatus(data) {
  return axiosPost(assetRent.updateLeaseOrderStatus, data)
}

// 资产出租/投资收益登记-修改状态
export function updateIncomeStatus(data) {
  return axiosPost(assetRent.updateIncomeStatus, data)
}

// 资产维修-列表汇总
export function getMaintainSum (data) {
  return axiosPost(assetRepair.getMaintainSum, data)
}

// 资产维修-分页列表
export function getMaintainPage (data) {
  return axiosPost(assetRepair.getMaintainPage, data)
}