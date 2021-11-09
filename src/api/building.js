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
// 房屋资产&资源统计表 资产明细 房间详情
export function queryHouseByPageV2 (data) {
  return axiosPost(building.queryHouseByPageV2, data)
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
// 土地分页列表
export function blankApiPageList (data) {
  return axiosPost(building.blankApiPageList, data)
}
// 土地修改
export function blankApiUpdate (data) {
  return axiosPost(building.blankApiUpdate, data)
}
// 土地删除
export function blankApiDelete (data) {
  return axiosPost(building.blankApiDelete, data)
}
// 土地导出
export function blankApiExport (data) {
  return axiosPost(building.blankApiExport, data, false, false, {
    responseType: 'blob'
  })
}
// 土地详情
export function blankApiDetail (data) {
  return axiosGet(building.blankApiDetail, data)
}
// 土地新增
export function blankApiInsert (data) {
  return axiosPost(building.blankApiInsert, data)
}

// 车场列表查询
export function parkApiList (data) {
  return axiosPost(building.parkApiPageList, data)
}
// 车场 详情
export function parkApiDetail (data) {
  return axiosPost(building.parkApiDetail, data)
}
// 车场 新增
export function parkApiInsert (data) {
  return axiosPost(building.parkApiInsert, data)
}
// 车场 编辑
export function parkApiEdit (data) {
  return axiosPost(building.parkApiEdit, data)
}
// 车场 删除
export function parkApiDelete (data) {
  return axiosPost(building.parkApiDelete, data)
}
// 车场 ->区域 删除
export function deleteParkingPlaceArea (data) {
  return axiosPost(building.deleteParkingPlaceArea, data)
}
// 车场 ->区域 新增
export function addParkingPlaceArea (data) {
  return axiosPost(building.addParkingPlaceArea, data)
}
// 车场 ->区域 修改
export function editParkingPlaceArea (data) {
  return axiosPost(building.editParkingPlaceArea, data)
}
// 车场 ->区域 列表
export function getParkingPlaceAreasByPlaceId (data) {
  return axiosPost(building.getParkingPlaceAreasByPlaceId, data)
}
// 车位 列表查询
export function stallApiPageList (data) {
  return axiosPost(building.stallApiPageList, data)
}
// 车位 详情
export function stallApiDetail (data) {
  return axiosGet(building.stallApiDetail, {...data})
}
// 车位 新增
export function stallApiInsert (data) {
  return axiosPost(building.stallApiInsert, data)
}
// 车位 编辑
export function stallApiEdit (data) {
  return axiosPost(building.stallApiEdit, data)
}
// 车位 删除
export function stallApiDelete (data) {
  return axiosGet(building.stallApiDelete, data)
}
// 车位 导出
export function stallApiExport (data) {
  return axiosPost(building.stallApiExport, data,false, false, {
    responseType: 'blob'
  })
}
// 设备 列表查询
export function equipmentApiPageList (data) {
  return axiosPost(building.equipmentApiPageList, data)
}
// 设备 详情
export function equipmentApiDetail (data) {
  return axiosPost(building.equipmentApiDetail, data)
}
// 设备 新增
export function equipmentApiInsert (data) {
  return axiosPost(building.equipmentApiInsert, data)
}
// 设备 编辑
export function equipmentApiEdit (data) {
  return axiosPost(building.equipmentApiEdit, data)
}
// 设备 删除
export function equipmentApiDelete (data) {
  return axiosPost(building.equipmentApiDelete, data)
}

// 根据组织机构id查询分类编码表
export function getEquipmentCodeList (data) {
  return axiosPost(building.getEquipmentCodeList, data)
}

// 根据组织机构id查询分类编码id查询子设备信息
export function getEquipmentListByUpEquipmentId (data) {
  return axiosPost(building.getEquipmentListByUpEquipmentId, data)
}

// 根据组织机构id查询供应商
export function getEquipmentSupplierListByOrganId (data) {
  return axiosPost(building.getEquipmentSupplierListByOrganId, data)
}

// 根据组织机构id查询其它
export function getInfoAttrListByEquipmentId (data) {
  return axiosPost(building.getInfoAttrListByEquipmentId, data)
}
// 根据组织机构ID查询设备位置
export function getEquipmentInstListByTopOrganId(data) {
  return axiosGet(building.getEquipmentInstListByTopOrganId,data)
}
// 根据 communityId 查询 所属机构
export function queryOrganIdByCommunityId(data) {
  return axiosGet(building.queryOrganIdByCommunityId,data)
}

// 根据CommunityID查询位置列表
export function positionSelectByCommunityID(data) {
  return axiosPost(building.positionSelectByCommunityID,data)
}
// 根据communitId和positionType查询具体资源
export function positionSelectAsynByOwnership(data) {
  return axiosPost(building.positionSelectAsynByOwnership,data)
}