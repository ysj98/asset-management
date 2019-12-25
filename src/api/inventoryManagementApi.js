/*
 * @Author: LW
 * @Date: 2019-12-25 09:48:20
 * @LastEditTime : 2019-12-25 14:44:23
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
// 资产信息查询
export function assetCheckInstAsset (data) {
  return axiosGet(inventoryManagement.inventoryPerform.assetCheckInstAsset, data)
}
