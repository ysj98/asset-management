import { axiosGet, axiosPost } from '../utils/axios';
import { equipmentview } from '../config/config.url';

export function getDetail(data) {
  return axiosPost(equipmentview.getDetail, data, true);
}
export function getPage(data) {
  return axiosPost(equipmentview.getPage, data);
}
export function getTotal(data) {
  return axiosPost(equipmentview.getTotal, data);
}
export function updateLabel(data) {
  return axiosPost(equipmentview.updateLabel, data, true);
}
export function exportExcel(data) {
  return axiosPost(equipmentview.exportExcel, data, false, false, {
    responseType: 'blob',
  });
}

export function viewProject(data) {
  return axiosPost(equipmentview.viewProject, data, false);
}
export function exportExcelProject(data) {
  return axiosPost(equipmentview.exportExcelProject, data, false, false, {
    responseType: 'blob',
  });
}
export function equipmentStatistics(data) {
  return axiosPost(equipmentview.equipmentStatistics, data, false);
}
export function detailProject(data) {
  return axiosGet(equipmentview.detailProject, data, true);
}

// 查询单个设备的巡检、保养记录
export function getEquipmentRecordTask(data) {
  return axiosPost(equipmentview.getEquipmentRecordTask, data, true);
}

// 查询单个设备某条任务的检查结果详情
export function pageEquipmentDtInstAttr(data) {
  return axiosPost(equipmentview.pageEquipmentDtInstAttr, data, true);
}

// 查询单个设备的报障记录
export function getEquipmentInstRecordOrder(data) {
  return axiosPost(equipmentview.getEquipmentInstRecordOrder, data, true);
}
