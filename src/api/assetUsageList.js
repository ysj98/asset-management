/*
 * @Author: L
 * @Date: 2022-07-20 14:54:22
 * @LastEditTime: 2022-07-23 14:17:51
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
// 导出机构维度，项目维度
export function exportQueryYueXinReport (data) {
  return axiosPost('/ams/yueXinReport/exportQueryYueXinReport', data, false, false, { responseType: 'blob'})
}
// 导出资产维度
export function exportQueryYueXinReportByAsset (data) {
  return axiosPost('/ams/yueXinReport/exportQueryYueXinReportByAsset', data, false, false, { responseType: 'blob'})
}
// 粤新报表资产维度查询汇总
export function queryYueXinReportByAssetTotal(data) {
  return axiosPost('/ams/yueXinReport/queryYueXinReportByAssetTotal', data)
}
// 粤新报表，组织机构，资产项目维度汇总
export function queryYueXinReportTotal(data) {
  return axiosPost('/ams/yueXinReport/queryYueXinReportTotal', data)
}

//----------明细表---------------
// 下钻查新列表接口
export function queryYueXinReportByAssetDetail(data) {
  return axiosPost('/ams/yueXinReport/queryYueXinReportByAssetDetail', data)
}
// 导出下钻
export function exportQueryYueXinReportByAssetDetail (data) {
  return axiosPost('/ams/yueXinReport/exportQueryYueXinReportByAssetDetail', data, false, false, { responseType: 'blob'})
}
// 粤新报表下钻汇总
export function queryYueXinReportByAssetDetailTotal(data) {
  return axiosPost('/ams/yueXinReport/queryYueXinReportByAssetDetailTotal', data)
}
