import {  axiosPost } from '../utils/axios'
import { cartPark } from '../config/config.url'
// 车场台账--资产视图列表
export function parkingPage (data) {
  return axiosPost(cartPark.parkingPage, data)
}
// 资产视图使用面积统计
export function parkingArea (data) {
  return axiosPost(cartPark.parkingArea, data)
}
