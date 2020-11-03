/*
 * @Date: 2019-11-06 11:20:55
 * @Author: l
 * @Description: 使用规则
 */

import { axiosPost, axiosGet  } from '../utils/axios'
import { delivery } from '../config/config.url'
/**
 * 使用规则
 * 
*/
// 交付管理
// 交付管理-修改状态
// /ams/delivery/updateStatus
export function updateStatus (data) {
  return axiosPost(delivery.updateStatus, data)
}
// 交付管理-分页列表
// ams/delivery/getDeliveryPage
export function getDeliveryPage (data) {
  return axiosPost(delivery.getDeliveryPage, data)
}
// 交付管理-列表汇总
// ams/assetChange/getDeliveryPageSum
export function getDeliveryPageSum (data) {
  return axiosPost(delivery.getDeliveryPageSum, data)
}
// 交付管理-导出
// ams/delivery/exportDeliveryList
export function exportDeliveryList (data) {
  return axiosPost(delivery.exportDeliveryList, data)
}
// 交付管理-新增编辑保存
// /ams/delivery/saveOrUpdateDelivery
export function saveOrUpdateDelivery (data) {
  return axiosPost(delivery.saveOrUpdateDelivery, data)
}
// 交付管理-终止交付
// /ams/delivery/stopDelivery
export function stopDelivery (data) {
  return axiosPost(delivery.stopDelivery, data)
}
