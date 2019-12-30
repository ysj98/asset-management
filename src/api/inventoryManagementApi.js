/*
 * @Author: LW
 * @Date: 2019-12-25 09:48:20
 * @LastEditTime : 2019-12-30 10:04:06
 * @LastEditors  : Please set LastEditors
 * @Description: 盘点管理
 * @FilePath: \asset-management\src\api\disposalManagement.js
 */

import { axiosPost, axiosGet  } from '../utils/axios'
import { inventoryManagement } from '../config/config.url'
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

// 盘点任务
// 已选资产明细
export function queryAssetByChcekId (data) {
  return axiosPost(inventoryManagement.countingTask.queryAssetByChcekId, data)
}
// 新建/编辑盘点单
export function updateCheckInst (data) {
  return axiosPost(inventoryManagement.countingTask.updateCheckInst, data)
}
// 盘点任务查询(分页)
export function queryCheckTaskPageList (data) {
  return axiosPost(inventoryManagement.countingTask.queryCheckTaskPageList, data)
}
// 盘点任务详情
export function queryCheckTaskDetail (data) {
  return axiosGet(inventoryManagement.countingTask.queryCheckTaskDetail, data)
}
// 编辑盘点任务
export function updateCheckTask (data) {
  return axiosPost(inventoryManagement.countingTask.updateCheckTask, data)
}

// 盘点执行
// 查询盘点列表（查询执行人为当前用户的数据）
export function assetCheckInstList (data) {
  return axiosPost(inventoryManagement.inventoryPerform.assetCheckInstList, data)
}
// 盘点单详情查询
export function assetCheckInstDetail (data) {
  return axiosGet(inventoryManagement.inventoryPerform.assetCheckInstDetail, data)
}
// 盘点异常详情查询
export function assetCheckInstFailDetail (data) {
  return axiosGet(inventoryManagement.inventoryPerform.assetCheckInstFailDetail, data)
}
// 盘点结果登记或编辑
export function assetCheckInstCheckResult (data) {
  return axiosPost(inventoryManagement.inventoryPerform.assetCheckInstCheckResult, data)
}
// 盘点资产清单列表
export function assetCheckInstAsseDetail (data) {
  return axiosPost(inventoryManagement.inventoryPerform.assetCheckInstAsseDetail, data)
}
// 盘盈资产删除
export function assetCheckInstDeleteByCheckResult (data) {
  return axiosGet(inventoryManagement.inventoryPerform.assetCheckInstDeleteByCheckResult, data)
}
// 资产盘点提交
export function assetCheckInstCheckExe (data) {
  return axiosPost(inventoryManagement.inventoryPerform.assetCheckInstCheckExe, data)
}


// 盘点管理 - 盘点报告
// 新建或编辑盘点报告
export function saveOrUpdate (data) {
  return axiosPost(inventoryManagement.inventoryReport.saveOrUpdate, data, false, false)
}
// 查询盘点报告列表(选择组织机构下的所有机构)
export function checkReportList (data) {
  return axiosPost(inventoryManagement.inventoryReport.checkReportList, data, true, false)
}
// 查询盘点报告详情
export function detail (data) {
  return axiosGet(inventoryManagement.inventoryReport.detail, data)
}
// 根据任务id查询盘点报告
export function queryByTaskId (data) {
  return axiosGet(inventoryManagement.inventoryReport.queryByTaskId, data)
}
// 盘点报告删除
export function deleteReport (data) {
  return axiosPost(inventoryManagement.inventoryReport.deleteReport, data)
}

// 盘点管理 - 盘点异常
// 异常处理
export function handleException (data) {
  return axiosPost(inventoryManagement.exceptionManagement.handleException, data, false, false)
}
// 异常管理列表查询
export function exceptionList (data) {
  return axiosPost(inventoryManagement.exceptionManagement.exceptionList, data, true, false)
}