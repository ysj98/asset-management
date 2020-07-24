/*
 * @Author: LW
 * @Date: 2020-07-24 17:33:50
 * @LastEditTime: 2020-07-24 17:41:52
 * @Description: 土地
 */ 
import { axiosPost } from '../utils/axios'
import { land } from '../config/config.url'

// post请求示例
export function seachInspectionInstByItems (data) {
  return axiosPost(land.assetView, data)
}
// 土地台账--资产视图汇总
export function assetViewTotal (data) {
  return axiosPost(land.assetViewTotal, data)
}
