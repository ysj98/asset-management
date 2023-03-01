import { axiosGet, axiosPost } from '../utils/axios';
import { transfer } from '../config/config.url';
export function getList(data) {
  return axiosPost(transfer.getList, data, false);
}

export function detail(data) {
  return axiosPost(transfer.detail, data, false);
}
export function addOrUpdate(data) {
  return axiosPost(transfer.addOrUpdate, data, true);
}
export function deleteFn(data) {
  return axiosPost(transfer.delete, data, true);
}
export function deApproval(data) {
  return axiosPost(transfer.deApproval, data, true);
}
export function historicLease(data) {
  return axiosGet(transfer.historicLease, data, true);
}
export function feedback(data) {
  return axiosPost(transfer.feedback, data, true);
}
export function assetDetail(data) {
  return axiosPost(transfer.assetDetail, data, true);
}
export function leaseBatchQuery(data) {
  return axiosPost(transfer.leaseBatchQuery, data, true);
}
