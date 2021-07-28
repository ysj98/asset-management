import { axiosGet } from "../utils/axios";
import { paramsConfig } from "../config/config.url";
/* 参数设置-组织机构系统设置保存 */
export function paramsSave(data) {
  return axiosGet(paramsConfig.paramsSave, data);
}
/* 参数设置-组织机构系统设置查询 */
export function querySysSet(data) {
  return axiosGet(paramsConfig.querySysSet, data);
}
