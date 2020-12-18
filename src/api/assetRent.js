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