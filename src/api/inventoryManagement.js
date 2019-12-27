
import { axiosPost, axiosGet  } from '../utils/axios'
import {inventoryManagement} from '../config/config.url'
// post请求示例
// export function seachInspectionInstByItems (data) {
//   return axiosPost(ownership.project.getproject, data)
// }
// get请求示例
// export function inspectionObjectInstDetail (data) {
//   return axiosGet(ownership.project.getproject, data)
// }
// 文件下载请求示例
// export function exportInspectionInstByMaterial (data) {
//   return axiosPost(ownership.project.getproject, data, false, false, {
//     responseType: 'blob'
//   })
// }

// 盘点管理 - 盘点报告
// 新建或编辑盘点报告
export function saveOrUpdate (data) {
  return axiosPost(inventoryManagement.saveOrUpdate, data, false, false)
}
// 查询盘点报告列表(选择组织机构下的所有机构)
export function checkReportList (data) {
  return axiosPost(inventoryManagement.checkReportList, data, true, false)
}
// 查询盘点报告详情
export function detail (data) {
  return axiosGet(inventoryManagement.detail, data)
}
// 盘点报告删除
export function deleteReport (data) {
  return axiosPost(inventoryManagement.deleteReport, data)
}

// 盘点管理 - 盘点异常
// 异常处理
export function handleException (data) {
  return axiosPost(inventoryManagement.handleException, data, false, false)
}
// 异常管理列表查询
export function exceptionList (data) {
  return axiosPost(inventoryManagement.exceptionList, data, true, false)
}
