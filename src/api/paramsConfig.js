import {axiosGet, axiosPost} from "../utils/axios";
import { paramsConfig } from "../config/config.url";
/* 参数设置-组织机构系统设置保存 */
export function paramsSave(data) {
  return axiosPost(paramsConfig.paramsSave, data);
}
/* 参数设置-组织机构系统设置查询 */
export function querySysSet(data) {
  return axiosGet(paramsConfig.querySysSet, data);
}
/* 组织机构系统设置统一查询接口 */
export function queryParamsConfigDetail(data) {
  return axiosPost(paramsConfig.queryParamsConfigDetail, data, true);
}

export function getDataFromBpmWorkFlow(data) {
  return axiosPost(paramsConfig.getDataFromBpmWorkFlow, data);
}
