import { axiosGet, axiosPost } from '../utils/axios';
import { attrConfig } from '../config/config.url';

/* 查询 */
export function queryAssetAttrConfig(params) {
  return axiosPost(attrConfig.queryAssetAttrConfig, params);
}

/* 新增 */
export function insertAssetAttrConfig(params) {
  return axiosPost(attrConfig.insertAssetAttrConfig, params);
}

/* 更新 */
export function updateAssetAttrConfig(params) {
  return axiosPost(attrConfig.updateAssetAttrConfig, params);
}
