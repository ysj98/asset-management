
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
// [呈报任务]列表查询
export function taskList (data) {
  return axiosGet(reportManage.taskList, data)
}
// 查询表单字段
// [呈报任务]分页查询(我审核的、我填报的、机构下全部任务)
export function taskPage (data) {
	return axiosPost(reportManage.taskPage, data)
}
// [呈报任务]任务信息
export function getTask (data) {
	return axiosGet(reportManage.getTask, data)
}
// [呈报任务]任务统计
export function getTaskStat (data) {
	return axiosPost(reportManage.getTaskStat, data)
}
