import { axiosPost, axiosGet } from '../utils/axios';
import { approve } from '../config/config.url';

export function getApprByServiceOrderId(data) {
  return axiosPost(approve.getApprByServiceOrderId, data);
}
export function queryApprovalRecordByBus(data) {
  return axiosPost(approve.queryApprovalRecordByBus, data);
}
export function uniformSubmit(data) {
  return axiosPost(approve.uniformSubmit, data, true);
}
export function getFile(data) {
  return axiosGet(approve.downloadFile, data, false, {
    responseType: 'arraybuffer',
  });
}
