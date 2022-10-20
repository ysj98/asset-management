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

export function submitDebt(data) {
    return axiosPost(debt.submitDebt, data, true, false, {});
}
export function getDebtInfo(data) {
    return axiosPost(debt.getDebtInfo, data, true, false, {});
}
export function getDebtInfoDetailLis(data) {
    return axiosPost(debt.getDebtInfoDetailLis, data, true, false, {});
}
export function deleteDebt(data) {
    return axiosPost(debt.deleteDebt, data, true, false, {});
}
export function exportDebt(data) {
    return axiosPost(debt.exportDebt, data, false, false, {responseType: 'blob'});
}