// 使用管理
import { axiosPost, axiosGet  } from '../utils/axios'
import { useManage } from '../config/config.url'

// 资产领用相关
// 资产领用-列表汇总
export function getReceiveSum (data) {
    return axiosPost(useManage.getReceiveSum, data)
  }
// 资产领用-分页列表
export function getReceivePage (data) {
    return axiosPost(useManage.getReceivePage, data)
  }
// 资产领用-删除
export function deleteReceive (data) {
    return axiosPost(useManage.deleteReceive, data)
  }
// 资产领用-导出
export function exportReceive (data) {
    return axiosPost(useManage.exportReceive, data)
  }
// 资产领用-新增编辑保存
export function submitReceive (data) {
    return axiosPost(useManage.submitReceive, data)
  }
// 资产领用-详情
export function getReceiveInfo (data) {
    return axiosGet(useManage.getReceiveInfo, data)
  }
// 资产领用一览表-分页列表
export function getReceiveDetailPage (data) {
    return axiosPost(useManage.getReceiveDetailPage, data)
  }
// 资产领用一览表-列表汇总
export function getReceiveDetailSum (data) {
    return axiosGet(useManage.getReceiveDetailSum, data)
  }
// 资产领用一览表-导出
export function exportReceiveDetail (data) {
    return axiosGet(useManage.exportReceiveDetail, data)
  }
// 资产领用一览表-详情
export function getReceiveDetailInfo (data) {
    return axiosGet(useManage.getReceiveDetailInfo, data)
  }