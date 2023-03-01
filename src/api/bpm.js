import { axiosGet, axiosPost } from 'utils/axios';
import { bpm } from '@/config/config.url';
export function bpmFileUpload(data, { params }) {
  return axiosPost(bpm.bpmFileUpload, data, true, false, {
    params,
  });
}
export function queryProcByType(data) {
  return axiosGet(bpm.queryProcByType, data, true, false, {});
}

export function getAuthorizeJwtToken(data) {
  return axiosGet(bpm.getAuthorizeJwtToken, data, true, false, {});
}
