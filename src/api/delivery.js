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
export function updateStatus (data) {
  return axiosPost(delivery.updateStatus, data)
}
// 交付管理-分页列表
export function getDeliveryPage (data) {
  return axiosPost(delivery.getDeliveryPage, data)
}
// 交付管理-列表汇总
export function getDeliveryPageSum (data) {
  return axiosPost(delivery.getDeliveryPageSum, data)
}
// 交付管理-导出
export function exportDeliveryList (data) {
  return axiosPost(delivery.exportDeliveryList, data, false, false, {responseType: 'blob'})
}
// 交付管理-新增编辑保存
export function saveOrUpdateDelivery (data) {
  return axiosPost(delivery.saveOrUpdateDelivery, data)
}
// 交付管理-分页查询交付明细列表
export function getDeliveryDetailListPage (data) {
  return axiosPost(delivery.getDeliveryDetailListPage, data)
}
// 交付管理-查询交付信息
export function getDeliveryById (data) {
  return axiosGet(delivery.getDeliveryById, data)
}
// 交付管理-查询交付明细列表
export function getDeliveryDetailList (data) {
  return axiosGet(delivery.getDeliveryDetailList, data)
}
// 交付管理-查询明细列表汇总
export function getDeliveryDetailListStatistics (data) {
  return axiosGet(delivery.getDeliveryDetailListStatistics, data)
}

// 资产交付记录
// 资产交付记录列表
export function deliveryGetChangeSchedulePage (data) {
  return axiosPost(delivery.deliveryGetChangeSchedulePage, data)
}
// 资产交付记录导出
export function deliveryExportChangeScheduleList (data) {
  return axiosPost(delivery.deliveryExportChangeScheduleList, data)
}