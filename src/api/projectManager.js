/*
 * @Author: L
 * @Date: 2022-07-16 16:18:44
 * @LastEditTime: 2022-07-16 18:20:51
 * @Description: file content
 */
import { axiosPost } from "../utils/axios";
import {projectManager} from "../config/config.url";


// 查询资产项目责任人列表
export function getProjectResponsibility(data) {
  return axiosPost(projectManager.getProjectResponsibility, data);
}
// 查询资产项目责任人详情
export function queryProjectResponsibilityDetail(data) {
  return axiosPost(projectManager.queryProjectResponsibilityDetail, data);
}
// 新增项目资产责任人
export function addProjectResponsibility(data) {
  return axiosPost(projectManager.addProjectResponsibility, data,true);
}
// 删除资产项目责任人
export function deleteProjectResponsibility(data) {
  return axiosPost(projectManager.deleteProjectResponsibility, data,true);
}
// 资产项目责任人导入
export function importProjectResponsibility(data, id) {
  return axiosPost(`${projectManager.importProjectResponsibility}?organId=${id}`, data);
}
// 资产项目责任人导出
export function exportProjectResponsibility(data) {
  return  axiosPost(projectManager.exportProjectResponsibility, data, false, false, {responseType: 'blob'})
}
// 资产项目责任人模板导出
export function downExport(data) {
  return  axiosPost(projectManager.downExport, data, false, false, {responseType: 'blob'})
}

