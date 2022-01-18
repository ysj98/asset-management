
import {  axiosPost } from '../utils/axios'
import {approve} from '../config/config.url'


export function getApprByServiceOrderId (data) {
    return axiosPost(approve.getApprByServiceOrderId, data)
}
export function queryApprovalRecordByBus (data) {
    return axiosPost(approve.queryApprovalRecordByBus, data)
}
export function uniformSubmit (data) {
    return axiosPost(approve.uniformSubmit, data,true)
}