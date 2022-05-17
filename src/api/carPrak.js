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