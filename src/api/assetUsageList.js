/*
 * @Author: L
 * @Date: 2022-07-20 14:54:22
 * @LastEditTime: 2022-07-20 15:02:45
 * @Description: file content
 */
import { axiosPost, axiosGet  } from '../utils/axios'
// 资产使用一览表
// 资产使用一览表(机构维度，项目维度)
export function queryYueXinReport(data) {
  return axiosPost('/ams/yueXinReport/queryYueXinReport', data)
}
// 资产一览表资产维度
export function queryYueXinReportByAsset(data) {
  return axiosPost('/ams/yueXinReport/queryYueXinReportByAsset', data)
}
// 下钻查新列表接口
export function queryYueXinReportByAssetDetail(data) {
  return axiosPost('/ams/yueXinReport/queryYueXinReportByAssetDetail', data)
}
// 导出机构维度，项目维度
export function exportQueryYueXinReport (data) {
  return axiosPost('/ams/yueXinReport/exportQueryYueXinReport', data, false, false, { responseType: 'blob'})
}
// 导出资产维度
export function exportQueryYueXinReportByAsset (data) {
  return axiosPost('/ams/yueXinReport/exportQueryYueXinReportByAsset', data, false, false, { responseType: 'blob'})
}
// 导出下钻
export function exportQueryYueXinReportByAssetDetail (data) {
  return axiosPost('/ams/yueXinReport/exportQueryYueXinReportByAssetDetail', data, false, false, { responseType: 'blob'})
}