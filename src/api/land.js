/*
 * @Author: LW
 * @Date: 2020-07-24 17:33:50
 * @LastEditTime: 2020-07-25 14:21:33
 * @Description: 土地
 */ 
import { axiosPost } from '../utils/axios'
import { land } from '../config/config.url'

// post请求示例
export function assetView (data) {
  return axiosPost(land.assetView, data)
}
// 土地台账--资产视图汇总
export function assetViewTotal (data) {
  return axiosPost(land.assetViewTotal, data)
}
// 土地台账--资产视图详情
export function assetViewDetail(data) {
  return axiosPost(land.assetViewDetail, data)
}
// 土地台账--组织机构视图
export function organView(data) {
  return axiosPost(land.organView, data)
}
// 土地台账--组织机构视图汇总
export function organViewTotal(data) {
  return axiosPost(land.organViewTotal, data)
}
// 土地台账--组织机构视图详情权属概况
export function organViewShipDetail(data) {
  return axiosPost(land.organViewShipDetail, data)
}
// 土地台账--组织机构视图详情资产概况汇总
export function organViewProjectDetailTotal(data) {
  return axiosPost(land.organViewProjectDetailTotal, data)
}
// 土地台账--组织机构视图详情资产概况列表
export function organViewProjectDetail(data) {
  return axiosPost(land.organViewProjectDetail, data)
}
// 土地台账--组织机构视图导出
export function organViewExport(data) {
  return axiosPost(land.organViewExport, data, false, true, {
    responseType: 'blob'
  })
}
// 土地台账--资产项目视图
export function viewGetAssetLandList(data) {
  return axiosPost(land.viewGetAssetLandList, data)
}
// 土地台账--资产项目视图汇总
export function viewGetAssetLandStatistics(data) {
  return axiosPost(land.viewGetAssetLandStatistics, data)
}
// 土地台账--资产项目视图详情
export function viewLandDetailsPage(data) {
  return axiosPost(land.viewLandDetailsPage, data)
}
// 土地台账--资产项目视图导出
export function viewGetAssetLandExport(data) {
  return axiosPost(land.viewGetAssetLandExport, data, false, true, {
    responseType: 'blob'
  })
}