import { axiosPost, axiosGet  } from '../utils/axios'
import { assets } from '../config/config.url'
// post请求示例
// export function seachInspectionInstByItems (data) {
//   return axiosPost(assets.project.getproject, data)
// }
// get请求示例
// export function inspectionObjectInstDetail (data) {
//   return axiosGet(assets.project.getproject, data)
// }
// 文件下载请求示例
// export function exportInspectionInstByMaterial (data) {
//   return axiosPost(assets.project.getproject, data, false, false, {
//     responseType: 'blob'
//   })
// }

// 组织机构树
export function queryAsynOrganByUserId (data) {
  return axiosPost(assets.project.queryAsynOrganByUserId, data, false, false)
}

// 资产变动
// 资产变动-一览表-分页列表
export function getChangeSchedulePage (data) {
  return axiosGet(assets.management.getChangeSchedulePage, data)
}
// 资产变动-详情
export function getChangeDetail (data) {
  return axiosGet(assets.management.getChangeDetail, data)
}
// 资产变动-一览表-导出
export function exportChangeScheduleList (data) {
  return axiosGet(assets.management.exportChangeScheduleList, data)
}
// 资产变动-分页列表
export function getChangePage (data) {
  return axiosGet(assets.management.getChangePage, data)
}
// 资产变动-删除
export function deleteChange (data) {
  return axiosPost(assets.management.deleteChange, data, false, false)
}
// 资产变动-审批
export function approveChange (data) {
  return axiosPost(assets.management.approveChange, data, false, false)
}
// 资产变动-导入
export function importChange (data) {
  return axiosPost(assets.management.importChange, data, false, false)
}
// 资产变动-导出
export function exportChange (data) {
  return axiosGet(assets.management.exportChange, data)
}
// 资产变动-新增编辑
export function updateInsertChange (data) {
  return axiosPost(assets.management.updateInsertChange, data, false, false)
}
// 资产变动-明细
export function getChangeInfo (data) {
  return axiosGet(assets.management.getChangeInfo, data)
}
// 资产变动-终止交付
export function stopDelivery (data) {
  return axiosPost(assets.management.stopDelivery, data, false, false)
}
