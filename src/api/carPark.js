import {  axiosPost, axiosGet } from '../utils/axios'
import { cartPark } from '../config/config.url'
// 车场台账--资产视图列表
export function parkingPage (data) {
  return axiosPost(cartPark.parkingPage, data)
}
// 资产视图使用面积统计
export function parkingArea (data) {
  return axiosPost(cartPark.parkingArea, data)
}
// 车场单个资产的面积
export function cartParkArea (data) {
  return axiosGet(cartPark.cartParkArea, data)
}
// 车场资产信息查询
export function assetCarPark (data) {
  return axiosGet(cartPark.assetCarPark, data)
}
// 导出车场资产视图
export function parkingExcel (data) {
  return axiosPost(cartPark.parkingExcel, data, false, false, {responseType: 'blob'})
}
export function carParkViewPage (data) {
  return axiosPost(cartPark.carParkViewPage, data)
}
// 车场视图面积信息
export function carParkViewArea (data) {
  return axiosPost(cartPark.carParkViewArea, data)
}
// 车场视图面积信息
export function carParkViewExcel (data) {
  return axiosPost(cartPark.carParkViewExcel, data, false, false, { responseType: 'blob' })
}
// 根据组织机构和项目查询车场列表
export function organPlace (data) {
  return axiosGet(cartPark.organPlace, data)
}
// 车场视图详情
export function carParkViewDetail (data) {
  return axiosGet(cartPark.carParkViewDetail, data)
}
// 车场下车位列表信息
export function carParkingList (data) {
  return axiosGet(cartPark.carParkingList, data)
}
// 车场视图车位区域名称列表
export function parkingAreaNames (data) {
  return axiosGet(cartPark.parkingAreaNames, data)
}
// 组织机构视图汇总
export function organGetTotal (data) {
  return axiosPost(cartPark.organGetTotal, data)
}
// 车场组织机构视图列表查询
export function carParkViewOrgan (data) {
  return axiosPost(cartPark.carParkViewOrgan, data)
}
// 单个车场面积汇总
export function placeArea (data) {
  return axiosGet(cartPark.placeArea, data)
}
// 组织机构车场列表导出
export function carParkExPortForOrgan (data) {
  return axiosPost(cartPark.carParkExPortForOrgan, data, false, false, { responseType:'blob' })
} 
// 组织机构详情列表
export function getCarParkListForOrgan (data) {
  return axiosPost(cartPark.getCarParkListForOrgan, data)
}
// 组织机构视图详情表头统计
export function getCarParkStatisticsForOrgan (data) {
  return axiosPost(cartPark.getCarParkStatisticsForOrgan, data)
}
// 组织机构视图详情权属
export function getCarParkViewShip (data) {
  return axiosPost(cartPark.getCarParkViewShip, data)
}