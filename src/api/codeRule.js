import { axiosGet, axiosPost } from '../utils/axios';
import { codeRule } from '../config/config.url';

// 获取插入参数
export function paramInit(data) {
  return axiosGet(codeRule.paramInit, data);
}
// 获取编码列表
export function init(data) {
  return axiosGet(codeRule.init, data);
}

// 获取编码预览
export function getPreview(data) {
  return axiosPost(codeRule.getPreview, data);
}

// 保存编码
export function save(data) {
  return axiosPost(codeRule.save, data);
}

// 回复编码
export function defaultReq(data) {
  return axiosGet(codeRule.default, data);
}
