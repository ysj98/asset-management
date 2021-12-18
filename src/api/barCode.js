import {axiosGet, axiosPost} from "../utils/axios";
import {barCode} from "../config/config.url";

// 主列表查询
export function queryLabelCodeList (data) {
  return axiosPost(barCode.queryLabelCodeList, data)
}
// 编辑标签
export function editLabel (data) {
  return axiosPost(barCode.editLabel, data)
}
// 下载模板/导出
export function exportLabelData (data) {
  return axiosPost(barCode.exportLabelData, data, false, false, {responseType: 'blob'})
}
// 批量更新标签-导入
export function readExcelModel (data) {
  return axiosPost(barCode.readExcelModel, data)
}
// 查询资产条码
export function findAssetLabel (data) {
  return axiosGet(barCode.findAssetLabel, data)
}
// 保存/编辑
export function saveAssetLabel (data) {
  return axiosPost(barCode.saveAssetLabel, data)
}
// 条码打印
export function barCodePrint (data) {
  return axiosPost(barCode.barCodePrint, data)
}
