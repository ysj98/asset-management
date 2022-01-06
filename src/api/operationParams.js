import { axiosPost } from "../utils/axios";
import {operationParams, toOperation} from "../config/config.url";
// 分页查询转运营参数列表
export function getPage(data) {
  return axiosPost(operationParams.getPage, data);
}
// 修改资产转运营参数状态
export function updateStatus(data) {
  return axiosPost(operationParams.updateStatus, data);
}
// 资产转运营参数-新增保存
export function saveTransferOperationParam(data) {
  return axiosPost(operationParams.saveTransferOperationParam, data,true);
}
// 资产转运营参数-编辑提交
export function editTransferOperationParam(data) {
  return axiosPost(operationParams.editTransferOperationParam, data,true);
}
// 资产转运营参数-详情
export function getDeatil(data) {
  return axiosPost(operationParams.getDeatil, data);
}

export function adjustParamPosition(data) {
  return axiosPost(toOperation.adjustParamPosition, data);
}