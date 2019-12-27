/*
 * @Author: LW
 * @Date: 2019-12-25 09:48:20
 * @LastEditTime : 2019-12-25 09:54:02
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \asset-management\src\api\disposalManagement.js
 */

import { axiosPost, axiosGet  } from '../utils/axios'
import { dispose } from '../config/config.url'
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

// 处置管理
// 资产处置一览表-主列表查询(分页)
export function getDetailAndDisposeListPage (data) {
  return axiosPost(dispose.getDetailAndDisposeListPage, data)
}
