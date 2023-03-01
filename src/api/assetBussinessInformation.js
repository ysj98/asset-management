import { axiosGet, axiosPost } from '../utils/axios';
import { assetBussinessInformation } from '../config/config.url';

/* 查询 */
export function assetRolList(params) {
  return axiosPost(assetBussinessInformation.assetRolList, params);
}
/* 新增用户配置 */
export function addCustomShow(params) {
  return axiosPost(assetBussinessInformation.addCustomShow, params);
}
/* 查询土地列表 */
export function queryAssetAttr(params) {
  return axiosPost(assetBussinessInformation.queryAssetAttr, params);
}
/* 更新资产信息 */
export function updateAssetAttr(params) {
  return axiosPost(assetBussinessInformation.updateAssetAttr, params);
}
/* 导出资产信息 */
export function exportTransferOperation(params) {
  return axiosPost(assetBussinessInformation.exportTransferOperation, params, false, false, { responseType: 'blob' });
}
/* 导入资产信息 */
export function readExcelModel(params) {
  return axiosPost(assetBussinessInformation.readExcelModel, params);
}
/* 查询资产信息视图 */
export function queryAssetAttrViewTotal(params) {
  return axiosPost(assetBussinessInformation.queryAssetAttrViewTotal, params);
}

/* 土地导出查询 */
export function queryAssetToExport(params) {
  return axiosPost(assetBussinessInformation.queryAssetToExport, params);
}

/* 土地导出查询 */
export function exportOperationAttr(params) {
  return axiosPost(assetBussinessInformation.exportOperationAttr, params, false, false, { responseType: 'blob' });
}
