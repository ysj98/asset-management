import { axiosGet, axiosPost } from '../utils/axios'
import {assetBussinessInformation} from '../config/config.url'

/* 查询 */
export function assetRolList (params) {
    return axiosPost(assetBussinessInformation.assetRolList, params)
}
/* 新增用户配置 */
export function addCustomShow (params) {
    return axiosPost(assetBussinessInformation.addCustomShow, params)
}