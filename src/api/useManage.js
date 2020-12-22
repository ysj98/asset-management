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
    return axiosPost(useManage.exportReceive, data, false, false, {responseType: 'blob'})
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
    return axiosPost(useManage.getReceiveDetailSum, data)
  }
// 资产领用一览表-导出
export function exportReceiveDetail (data) {
    return axiosPost(useManage.exportReceiveDetail, data, false, false, {responseType: 'blob'})
  }
// 资产领用一览表-详情
export function getReceiveDetailInfo (data) {
    return axiosGet(useManage.getReceiveDetailInfo, data)
  }
// 资产领用-详情资产明细分页
export function getReceiveAssetDetailPage (data) {
  return axiosPost(useManage.getReceiveAssetDetailPage, data)
}
// 资产归还-分页列表
export function getReturnPage (data) {
  return axiosPost(useManage.getReturnPage, data)
}
// 资产归还-列表汇总
export function getReturnSum (data) {
  return axiosPost(useManage.getReturnSum, data)
}
// 资产归还-删除
export function deleteReturn (data) {
  return axiosPost(useManage.deleteReturn, data)
}
// 资产归还-导出
export function exportReturn (data) {
  return axiosPost(useManage.exportReturn, data, false, false, {responseType: 'blob'})
}
// 资产归还-新增编辑保存
export function submitReturn (data) {
  return axiosPost(useManage.submitReturn, data)
}
// 资产归还-详情
export function getReturnInfo (data) {
  return axiosGet(useManage.getReturnInfo, data)
}
// 资产归还-详情明细分页
export function getReturnAssetDetailPage (data) {
  return axiosPost(useManage.getReturnAssetDetailPage, data)
}
// 资产归还一览表-分页列表
export function getReturnDetailPage(data) {
  return axiosPost(useManage.getReturnDetailPage, data)
}
// 资产归还一览表-导出
export function exportReturnDetail (data) {
  return axiosPost(useManage.exportReturnDetail, data, false, false, {responseType: 'blob'})
}
// 资产归还一览表-详情
export function getReturnDetailInfo (data) {
  return axiosGet(useManage.getReturnDetailInfo, data)
}