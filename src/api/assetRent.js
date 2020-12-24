import { axiosPost, axiosGet  } from '../utils/axios'
import { assetRent } from '../config/config.url'
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
  return axiosPost(assetRent.getLeaseOrder, data)
}