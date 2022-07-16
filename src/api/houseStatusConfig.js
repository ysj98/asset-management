/*
 * @Author: LDC
 * @Date: 2022-07-13 11:04:44
 * @LastEditTime: 2022-07-13 11:06:37
 * @Description: 
 * 
 * 
 */
import {axiosGet, axiosPost} from '../utils/axios'
import {houseStatusConfig} from '../config/config.url'


export function insertSetting (data) {
  return axiosPost(houseStatusConfig.insertSetting, data,true)
}
export function updateSetting (data) {
  return axiosPost(houseStatusConfig.updateSetting, data,true)
}
export function querySettingByOrganId (data) {
  return axiosPost(houseStatusConfig.querySettingByOrganId, data,true)
}