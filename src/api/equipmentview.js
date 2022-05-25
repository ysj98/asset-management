import {axiosGet, axiosPost} from '../utils/axios'
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
export function updateLabel (data) {
  return axiosPost(equipmentview.updateLabel, data, true)
}
export function exportExcel (data) {
  return axiosPost(equipmentview.exportExcel, data,false,false,{
    responseType: 'blob'
  })
}


export function viewProject (data) {
  return axiosPost(equipmentview.viewProject, data,false)
}
export function exportExcelProject (data) {
  return axiosPost(equipmentview.exportExcelProject,  data,false,false,{
    responseType: 'blob'
  })
}
export function equipmentStatistics (data) {
  return axiosPost(equipmentview.equipmentStatistics, data, false)
}
export function detailProject (data) {
  return axiosGet(equipmentview.detailProject, data, true)
}