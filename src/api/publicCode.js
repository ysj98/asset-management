/*
 * @Author: L
 * @Date: 2020-11-10 17:51:07
 * @LastEditTime: 2020-11-10 18:16:54
 * @Description: 公共接口
 */
import { axiosGet, axiosPost } from '../utils/axios';
import { publicCode } from '../config/config.url';

/* 编码规则-获取生成字段值 */
export function getCodingRulesByCode(data) {
  return axiosGet(publicCode.getCodingRulesByCode, data);
}
// 资项目获取生成字段
export function getProjectCode(data) {
  return axiosGet(publicCode.getProjectCode, data);
}
export function queryAssetLabelConfig(data) {
  return axiosGet(publicCode.queryAssetLabelConfig, data);
}
