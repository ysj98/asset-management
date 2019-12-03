
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
  return axiosGet(ownership.authorityCardManagement.warrantExport, data)
}
// 权证新增或修改
export function warrantSaveOrUpdate (data) {
  return axiosPost(ownership.authorityCardManagement.warrantSaveOrUpdate, data)
}
// 权证查询
export function warrantList (data) {
  return axiosPost(ownership.authorityCardManagement.warrantList, data)
}
// 权证注销
export function warrantDelete (data) {
  return axiosGet(ownership.authorityCardManagement.warrantDelete, data)
}
// 查询权证详情
export function warrantDetail (data) {
  return axiosGet(ownership.authorityCardManagement.warrantDetail, data)
}
