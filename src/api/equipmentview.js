import {  axiosPost } from '../utils/axios'
import {equipmentview} from '../config/config.url'


export function getDetail (data) {
  return axiosPost(equipmentview.getDetail, data,true)
}
export function getPage (data) {
  return axiosPost(equipmentview.getPage, data)
}
export function getTotal (data) {
  return axiosPost(equipmentview.getTotal, data)
}