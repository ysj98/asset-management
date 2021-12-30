import { axiosPost } from "../utils/axios";
import { toOperation } from "../config/config.url";
// 主列表导出
export function exportListPage(data) {
  return axiosPost(toOperation.exportListPage, data, true, false, {
    responseType: "blob",
  });
}
// 主列表查询
export function getTransferOperationPage(data) {
  return axiosPost(toOperation.getTransferOperationPage, data);
}

// 主列表统计
export function getOperationPageStatistics(data) {
  return axiosPost(toOperation.getOperationPageStatistics, data);
}

// 审核
export function updateOperationApprovalStatus(data) {
  return axiosPost(toOperation.updateOperationApprovalStatus, data);
}

// 新增提交
export function submitTransferOperation(data) {
  return axiosPost(toOperation.submitTransferOperation, data);
}

// 添加资产导出
export function exportAsset(data) {
  return axiosPost(toOperation.exportAsset, data, true, false, {
    responseType: "blob",
  });
}

// 详情-基本信息
export function getBasicMessage(data) {
  return axiosPost(toOperation.getBasicMessage, data);
}

// 详情-资产转运营明细列表
export function getOperationDetailListPage(data) {
  return axiosPost(toOperation.getOperationDetailListPage, data);
}

// 批量导入
export function importData(data) {
  return axiosPost(toOperation.importData, data, true);
}
