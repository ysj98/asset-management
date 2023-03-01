/*
 * @Description:
 * @Date: 2020-02-24 15:17:22
 * @LastEditTime: 2020-03-17 17:28:01
 */
import { axiosPost, axiosGet } from '../utils/axios';
import { subsidiary } from '../config/config.url';
// 附属配套-列表查询
export function getListPage(data) {
  return axiosPost(subsidiary.getListPage, data);
}
// 附属配套-新增/修改保存
export function modifySave(data) {
  return axiosPost(subsidiary.modifySave, data);
}
// 附属配套-状态操作或删除
export function updateStatusOrDelete(data) {
  return axiosPost(subsidiary.updateStatusOrDelete, data);
}
// 附属配套查询-根据附属配套ID
export function getMatchingById(data) {
  return axiosPost(subsidiary.getMatchingById, data);
}
// 附属配套-根据资产信息ID查询列表
export function getMatchingListByAssetId(data) {
  return axiosPost(subsidiary.getMatchingListByAssetId, data);
}
// 附属配套-下载批量导入模板
export function downBatchModle(data) {
  return axiosGet(subsidiary.downBatchModle, data, false, {
    responseType: 'blob',
  });
}
// 附属配套-列表导出
export function exportData(data) {
  return axiosPost(subsidiary.exportData, data, false, false, {
    responseType: 'blob',
  });
}
// 附属配套-导入
export function batchImport(data) {
  return axiosPost(subsidiary.batchImport, data, false, false, { timeout: 1000 * 60 * 10 });
}
// 根据资产id 查询资产信息
export function getAssetById(data) {
  return axiosPost(subsidiary.getAssetById, data);
}
// 获取附属配套列表
export function getMatchingListByAssetIdPage(data) {
  return axiosPost(subsidiary.getMatchingListByAssetIdPage, data, false, false, { timeout: 1000 * 60 * 10 });
}
// 获取附属配套统计
export function getMatchingSta(data) {
  return axiosPost(subsidiary.getMatchingSta, data, false, false, { timeout: 1000 * 60 * 10 });
}
