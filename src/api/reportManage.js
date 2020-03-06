/*
 * @Description:
 * @Date: 2020-03-04 18:38:38
 * @LastEditTime: 2020-03-05 14:39:48
 */

import { axiosPost, axiosGet  } from '../utils/axios'
import { reportManage } from '../config/config.url'

// 呈报管理- 呈报计划
// 呈报任务模板查询
export function queryReportTaskTempPageList (data) {
  return axiosPost(reportManage.queryReportTaskTempPageList, data)
}
// 呈报计划报表查询
export function queryReportPlanNum (data) {
  return axiosPost(reportManage.queryReportPlanNum, data)
}
// 计划查询(分页)
export function queryReportPlanPageList (data) {
  return axiosPost(reportManage.queryReportPlanPageList, data)
}
// 呈报计划状态操作
export function updateReportPlanStatus (data) {
  return axiosPost(reportManage.updateReportPlanStatus, data)
}
// 呈报计划详情
export function queryReportPlanDetail (data) {
  return axiosPost(reportManage.queryReportPlanDetail, data)
}
// 新建/修改呈报计划
export function saveReportPlan (data) {
  return axiosPost(reportManage.saveReportPlan, data)
}

// 呈报管理- 表单
// 查询全部呈报表单列表
export function queryAllReportBill (data) {
  return axiosPost(reportManage.queryAllReportBill, data)
}
// 查询表单字段
export function queryReportBillColumn (data) {
	return axiosPost(reportManage.queryReportBillColumn, data)
}

// 呈报管理---- 任务
//  [呈报任务]分页查询(我审核的、我填报的、机构下全部任务)
export function queryTaskPage (data) {
  return axiosPost(reportManage.taskPage, data)
}
//  [呈报任务]列表查询
export function queryTaskList (data) {
  return axiosGet(reportManage.taskList, data)
}
//  [呈报任务]填报数据分页查询
export function queryTaskDetailPage (data) {
  return axiosGet(reportManage.detailPage, data)
}
//  [呈报任务]填报数据列表查询
export function queryTaskDetailList (data) {
  return axiosGet(reportManage.detailList, data)
}
// [呈报任务]任务信息
export function queryTaskInfo (data) {
  return axiosGet(reportManage.getTask, data)
}
// [呈报任务]任务统计
export function queryTaskStatistics (data) {
  return axiosPost(reportManage.getTaskStat, data)
}
// [呈报任务]保存任务信息、填报数据
export function saveTaskOrDetail (data) {
  return axiosPost(reportManage.saveTaskOrDetail, data)
}
// [呈报任务]填报数据批量导入
export function importTaskdetailList (data) {
  return axiosPost(reportManage.detailDataImport, data)
}
// [呈报任务]填报模板导出
export function exportDetailTemplate (data) {
  return axiosGet(reportManage.detailTempExport, data)
}
// [呈报任务]审核任务
export function auditTask (data) {
  return axiosGet(reportManage.auditTask, data)
}

/**
 * 呈报记录
 */
// 呈报记录查询(分页)
export function queryReportRecordPageList (data) {
	return axiosPost(reportManage.queryReportRecordPageList, data)
}
// 呈报记录详情
export function queryReportRecordDetail (data) {
	return axiosPost(reportManage.queryReportRecordDetail, data)
}
// 查询资产折旧(分页)
export function queryAssetDeprecitionPageList (data) {
	return axiosPost(reportManage.queryAssetDeprecitionPageList, data)
}
// 查询资产收入(分页)
export function queryAssetIncomePageList (data) {
	return axiosPost(reportManage.queryAssetIncomePageList, data)
}
// 查询资产费用(分页)
export function queryAssetExpensePageList (data) {
	return axiosPost(reportManage.queryAssetExpensePageList, data)
}
// 查询资产运营(分页)
export function queryAssetOperationPageList (data) {
	return axiosPost(reportManage.queryAssetOperationPageList, data)
}
