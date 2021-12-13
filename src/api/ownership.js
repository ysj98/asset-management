/*
 * @Date: 2019-11-28 17:24:01
 * @Description: 
 */ 

import { axiosPost, axiosGet  } from '../utils/axios'
import { ownership } from '../config/config.url'
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

// 权属管理 - 权属登记
// 权属登记删除
export function shipDelete (data) {
  return axiosGet(ownership.ownershipRegistration.shipDelete, data)
}
// 权属登记单查询
export function shipList (data) {
  return axiosPost(ownership.ownershipRegistration.shipList, data)
}
// 权属登记详情查询
export function shipDetail (data) {
  return axiosGet(ownership.ownershipRegistration.shipDetail, data)
}
// 资产权属登记单新建或编辑
export function saveOrUpdate (data) {
  return axiosPost(ownership.ownershipRegistration.saveOrUpdate, data)
}
// 批量导出
export function shipAssetExport (data) {
  return axiosPost(ownership.ownershipRegistration.shipAssetExport, data, false, false, { responseType: 'blob'})
}
// 批量导入
export function shipImportData (data) {
  return axiosPost(ownership.ownershipRegistration.shipImportData, data)
}


// 权属管理 - 权证管理
// 权证导入
export function warrantImport (data) {
  return axiosGet(ownership.authorityCardManagement.warrantImport, data)
}
// 权证导入模板下载
export function warrantDownload (data) {
  return axiosGet(ownership.authorityCardManagement.warrantDownload, data)
}
// 权证导出
export function warrantExport (data) {
  return axiosPost(ownership.authorityCardManagement.warrantExport, data, false, false, {
    responseType: 'blob'
  })
}
// 权证统计
export function warrantTotal (data) {
  return axiosPost(ownership.authorityCardManagement.warrantTotal, data)
}
// 权证新增或修改
export function warrantSaveOrUpdate (data) {
  return axiosPost(ownership.authorityCardManagement.warrantSaveOrUpdate, data)
}
// 权证查询warrantDeleteBatch
export function warrantList (data) {
  return axiosPost(ownership.authorityCardManagement.warrantList, data)
}
// 权证注销
export function warrantDelete (data) {
  return axiosGet(ownership.authorityCardManagement.warrantDelete, data)
}
// 权证批量注销
export function warrantDeleteBatch (data) {
  return axiosPost(ownership.authorityCardManagement.warrantDeleteBatch, data)
}
// 查询权证详情
export function warrantDetail (data) {
  return axiosGet(ownership.authorityCardManagement.warrantDetail, data)
}
// 组织机构视图
export function organView (data) {
  return axiosGet(ownership.organView, data)
}
// 组织机构视图导出
export function organViewExport (data) {
  return axiosGet(ownership.organViewExport, data, false, {responseType: 'blob'})
}
// 组织机构视图导出
export function organViewTotal (data) {
  return axiosGet(ownership.organViewTotal, data)
}
// 权属登记单一览表查询
export function registerList (data) {
  return axiosPost(ownership.registerList, data)
}
// 权属登记单一览表统计
export function registerTotal (data) {
  return axiosPost(ownership.registerTotal, data)
}
// 权属登记单一览表导出
export function registerExport (data) {
  return axiosPost(ownership.registerExport, data, false, false, {responseType: 'blob'})
}
// 权属登记单查询汇总
export function shipTotal (data) {
  return axiosPost(ownership.ownershipRegistration.shipTotal, data)
}

// 权证管理附件上传
export function uploadAnnex (data) {
  return axiosPost(ownership.authorityCardManagement.uploadAnnex, data)
}
// 权证管理附件下载
export function downLoadAnnex (data) {
  return axiosPost(ownership.authorityCardManagement.downLoadAnnex, data)
}
