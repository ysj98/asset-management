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
