
import { axiosPost, axiosGet  } from '../utils/axios'
import { reportManage } from '../config/config.url'

// 呈报管理- 呈报计划
// 计划查询(分页)
export function queryReportPlanPageList (data) {
  return axiosPost(reportManage.queryReportPlanPageList, data)
}
// 呈报计划详情
export function queryReportPlanDetail (data) {
  return axiosPost(reportManage.queryReportPlanDetail, data)
}
// 新建/修改呈报计划
export function saveReportPlan (data) {
  return axiosGet(reportManage.saveReportPlan, data)
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
