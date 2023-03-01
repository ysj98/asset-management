import { axiosGet, axiosPost } from '../utils/axios';
import { assetOperationMode } from '../config/config.url';

/* 查询 */
export function queryAssetAttrConfig(params) {
  return axiosGet(assetOperationMode.queryAssetAttrConfig, params);
}

export function updateAssetAttrConfig(params) {
  return axiosPost(assetOperationMode.updateAssetAttrConfig, params);
}
