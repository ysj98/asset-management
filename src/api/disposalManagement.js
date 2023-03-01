/*
 * @Author: LW
 * @Date: 2019-12-25 09:48:20
 * @LastEditTime : 2019-12-25 09:54:02
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \asset-management\src\api\disposalManagement.js
 */

import { axiosPost, axiosGet } from '../utils/axios';
import { dispose } from '../config/config.url';
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
// 资产处置一览表-资产视图-主列表查询(分页)
export function getDetailAndDisposeListPage(data) {
  return axiosPost(dispose.getDetailAndDisposeListPage, data);
}

// 资产处置一览表-资产视图-统计数据
export function getDetailAndDisposeListStat(data) {
  return axiosPost(dispose.getDetailAndDisposeListStat, data);
}

// 资产处置一览表-组织机构视图-主列表
export function getDisposeOrganListPage(data) {
  return axiosPost(dispose.getDisposeOrganListPage, data);
}

// 资产处置一览表-组织机构视图-导出
export function getDisposeOrganExport(data) {
  return axiosPost(dispose.getDisposeOrganExport, data, false, false, { responseType: 'blob' });
}

// 资产处置一览表-组织机构视图-统计数据
export function getDisposeOrganStatistics(data) {
  return axiosPost(dispose.getDisposeOrganStatistics, data);
}

// 资产处置一览表-组织机构视图-详情列表
export function getDispOrgProDetListPage(data) {
  return axiosPost(dispose.getDispOrgProDetListPage, data);
}

// 资产处置一览表-组织机构视图-详情统计数据
export function getDispOrgStatProDetail(data) {
  return axiosPost(dispose.getDispOrgStatProDetail, data);
}
// 资产转让按钮
export function transferButton(data) {
  return axiosPost(dispose.detail, data);
}
// 资产转让按钮
export function getTransferList(data) {
  return axiosPost(dispose.getTransferList, data);
}
// 根据处置单查询资产转让列表
export function listByDisposeRegisterOrderId(data) {
  return axiosPost(dispose.listByDisposeRegisterOrderId, data);
}
