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
