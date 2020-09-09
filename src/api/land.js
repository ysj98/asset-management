/*
 * @Author: LW
 * @Date: 2020-07-24 17:33:50
 * @LastEditTime: 2020-09-08 18:07:00
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
