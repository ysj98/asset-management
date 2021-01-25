/*
 * @Author: LW
 * @Date: 2020-07-24 17:33:50
 * @LastEditTime: 2021-01-25 18:15:46
 * @Description: 土地
 */ 
import { axiosPost, axiosGet } from '../utils/axios'
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
  return axiosGet(land.organViewShipDetail, data)
}
// 土地台账--组织机构视图详情资产概况汇总
export function organViewProjectDetailTotal(data) {
  return axiosGet(land.organViewProjectDetailTotal, data)
}
// 土地台账--组织机构视图详情资产概况列表
export function organViewProjectDetail(data) {
  return axiosGet(land.organViewProjectDetail, data)
}
// 土地台账--组织机构视图导出
export function organViewExport(data) {
  return axiosPost(land.organViewExport, data, false, false, {
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
// 土地台账--资产项目视图详情-资产状况
export function viewLandDetailsPage(data) {
  return axiosPost(land.viewLandDetailsPage, data)
}
// 土地台账--资产项目视图导出
export function viewGetAssetLandExport(data) {
  return axiosPost(land.viewGetAssetLandExport, data, false, false, {
    responseType: 'blob'
  })
}
// 资产地图- 资产概况
export function overview (data) {
  return axiosPost(land.overview, data)
}
 // 资产地图- 资产全量数据
export function mapData (data) {
  return axiosPost(land.mapData, data)
}
// 资产地图- 资产详情
export function mapDetail (data) {
  return axiosGet(land.mapDetail, data)
}

// 土地台账资产视图汇总
export function assetViewListTotal (data) {
  return axiosPost(land.assetViewListTotal, data)
}
