import { axiosPost, axiosGet } from '../utils/axios';
import { allot } from '../config/config.url';

// 资产调拨列表
export function queryTransferList(data) {
  return axiosPost(allot.queryTransferList, data, true);
}
// 资产调拨单新增修改删除 status状态 1:有效, 0:删除
export function addOrUpdateTransfer(data) {
  return axiosPost(allot.addOrUpdateTransfer, data, true);
}
// 查询资产详情
export function queryTransferDetail(data) {
  return axiosGet(allot.queryTransferDetail, data, true);
}
// 反审批接口
export function deApproval(data) {
  return axiosGet(allot.deApproval, data, true);
}
