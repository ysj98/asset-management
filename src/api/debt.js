import { axiosGet, axiosPost } from "utils/axios";
import { debt } from "@/config/config.url";
export function bpmFileUpload(data, { params }) {
  return axiosPost(bpm.bpmFileUpload, data, true, false, {
    params,
  });
}
export function getDebtPage(data) {
  return axiosPost(debt.getDebtPage, data, true, false, {});
}

export function getAuthorizeJwtToken(data) {
  return axiosGet(debt.getAuthorizeJwtToken, data, true, false, {});
}
