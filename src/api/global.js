/**
 * 描述：全局服务入口
 * 作者：猪不乐意
 * 日期：2019年7月11日
 */

import { axiosPost, axiosGet } from '../utils/axios';
import { Global } from '../config/config.url';

/**
 * 上传文件
 * @param {String} file 文件对象
 */
export function fileUpload(file) {
  let formData = new FormData();
  formData.append('file', file);
  return axiosPost(Global.fileUpload, formData, true, false, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function assetRolListV2(data) {
  return axiosPost(Global.assetRolListV2, data);
}
export function addCustomShowV2(data) {
  return axiosPost(Global.addCustomShowV2, data, true);
}


export function organDict(data) {
  return axiosGet( '/esm/organDict/list', data )
}
export function dictionary(data) {
  return axiosGet( '/esm/dictionary/list', data )
}