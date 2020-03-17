/*
 * @Date: 2019-11-06 11:20:55
 * @Author: chen han
 * @Description: 楼盘字典接口
 */

import { axiosPost, axiosGet  } from '../utils/axios'
import { building, inventory} from '../config/config.url'
/**
 * 楼盘字典
 * 
*/
// 房屋列表
export function queryHouseByPage (data) {
  return axiosPost(building.queryHouseByPage, data)
}
// 修改房屋
export function updateHouse (data) {
  return axiosPost(building.updateHouse, data)
}
// 新增房屋
export function addHouse (data) {
  return axiosPost(building.addHouse, data)
}
// 查询房屋详情
export function queryHouseDetailById (data) {
  return axiosPost(building.queryHouseDetailById, data)
}
// 修改房屋状态
export function updateHouseStatus (data) {
  return axiosPost(building.updateHouseStatus, data)
}
// 修改楼栋
export function updateBuild (data) {
  return axiosPost(building.updateBuild, data)
}
// 删除楼栋
export function deleteBuild (data) {
  return axiosPost(building.deleteBuild, data)
}
// 新增楼栋
export function addBuild (data) {
  return axiosPost(building.addBuild, data)
}
// 查询楼栋详情
export function queryBuildDetail (data) {
  return axiosPost(building.queryBuildDetail, data)
}
// 修改楼层
export function updateFloor (data) {
  return axiosPost(building.updateFloor, data)
}
// 删除楼层
export function deleteFloor (data) {
  return axiosPost(building.deleteFloor, data)
}
// 新增楼层
export function addFloor (data) {
  return axiosPost(building.addFloor, data)
}
// 查询楼层详情
export function queryFloorDetail (data) {
  return axiosPost(building.queryFloorDetail, data)
}
// 修改单元
export function updateUnit (data) {
  return axiosPost(building.updateUnit, data)
}
// 删除单元
export function deleteUnit (data) {
  return axiosPost(building.deleteUnit, data)
}
// 新增单元
export function addUnit (data) {
  return axiosPost(building.addUnit, data)
}
// 查询单元详情
export function queryUnitDetail (data) {
  return axiosPost(building.queryUnitDetail, data)
}
// 位置分类Position（异步）
export function positionSelectAsyn (data) {
  return axiosPost(building.positionSelectAsyn, data)
}
// 查询楼栋下可挂位置类型 位置管理-位置树查询 GET
export function queryBellowPositionType (data) {
  return axiosGet(building.queryBellowPositionType, data)
}
// 下载房屋模板
export function downLoadExcel (data) {
  return axiosGet(building.downLoadExcel, {}, false, {
    responseType: 'blob'
  })
}
// 导入房间资料
export function importExcel (organId, data) {
  return axiosPost(building.importExcel + '/' + organId, data)
}
// 房间批量更新
export function acctHouseCodeImport (data) {
  return axiosPost(building.acctHouseCodeImport, data)
}
// 房间导出
export function exportHouse (data) {
  return axiosPost(building.exportHouse, data, false, true, {
    responseType: 'blob'
  })
}
// 盘点计划列表
export function getPlanList (data) {
  return axiosPost(inventory.getPlanList, data)
}
// 新建盘点计划
export function createInventoryPlan (data) {
  return axiosPost(inventory.createInventoryPlan, data)
}
// 编辑盘点计划
export function editInventoryPlan (data) {
  return axiosPost(inventory.editInventoryPlan, data)
}
// 执行记录
export function getImplementRecord (data) {
  return axiosPost(inventory.getImplementRecord, data)
}
// 盘点计划详情
export function inventoryDetail (data) {
  return axiosPost(inventory.inventoryDetail, data)
}
// 盘点计划改变
export function updateCheckPlanStatus (data) {
  return axiosPost(inventory.updateCheckPlanStatus, data)
}
// 下载楼栋模板
export function buildingDownLoadExcel (data) {
  return axiosGet(building.buildingDownLoadExcel, {}, false, {
    responseType: 'blob'
  })
}
// 楼栋批量导入
export function buildImportExcel (organId, data) {
  return axiosPost(building.buildImportExcel + organId, data, false, false, {timeout: 1000 * 60 * 10})
}
