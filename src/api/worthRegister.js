import { axiosPost, axiosGet  } from '../utils/axios'
import { worthRegister } from '../config/config.url'
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
// 价值登记查询(分页)
export function queryRegisterList (data) {
  return axiosPost(worthRegister.queryValueRegisterPageList, data, false, false)
}
// 价值登记状态操作
export function updateStatus (data) {
  return axiosPost(worthRegister.updateRegisterStatus, data)
}
// 价值登记记录查询(分页)
export function queryRecordList (data) {
  return axiosPost(worthRegister.queryValueRegisterRecordList, data)
}
// 价值登记详情
export function queryDetail (data) {
  return axiosPost(worthRegister.queryValueRegisterDetail, data)
}
// 价值登记资产查询
export function queryRelList (data) {
  return axiosPost(worthRegister.queryValueRegisterRelList, data)
}
// 价值登记资产查询(分页)
export function queryRelPageList (data) {
  return axiosPost(worthRegister.queryValueRegisterRelPageList, data)
}
// 新增价值登记
export function insertRegister (data) {
  return axiosPost(worthRegister.insertValueRegister, data,true)
}
// 更新价值登记
export function updateRegister (data) {
  return axiosPost(worthRegister.updateValueRegister, data, true)
}
// 资产价值一览表查询(分页)
export function queryAssetValuePageList (data) {
  return axiosPost(worthRegister.queryAssertValuePageList, data)
}
// 资产价值趋势图
export function queryAssetValueTrend (data) {
  return axiosPost(worthRegister.queryAssertValueTrend, data)
}
// 价值登记资产查询汇总
export function queryListSum (data) {
  return axiosPost(worthRegister.queryListSum, data)
}
// 资产价值一览表查询汇总
export function queryPageListSum (data) {
  return axiosPost(worthRegister.queryPageListSum, data)
}
// 价值登记查询(汇总)
export function queryValueRegisterPageListSum (data) {
  return axiosPost(worthRegister.queryValueRegisterPageListSum, data)
}
// 导入价值模板
export function importValueTemplate (data) {
  return axiosPost(worthRegister.importValueTemplate, data)
}
// 下载模板
export function downloadValueTemplate (data) {
  return axiosPost(worthRegister.downloadValueTemplate, data, false, false, {
    responseType: 'blob'
  })
}

