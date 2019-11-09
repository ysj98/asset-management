import { axiosPost, axiosGet  } from '../utils/axios'
import { basics } from '../config/config.url'
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
export function queryAllTopOrganByUser (data) {
  return axiosGet(basics.queryAllTopOrganByUser, data)
}
// 请求房屋楼栋单元
export function getOptions (data) {
  return axiosPost(basics.getOptions, data)
}
// 根据根节点业态code获取下面的业态类型
export function queryNodesByRootCode (data) {
  return axiosGet(basics.queryNodesByRootCode, data)
}
// 根据业态Id 获取下面的子节点
export function queryChildNodesById (data) {
  return axiosGet(basics.queryChildNodesById, data)
}