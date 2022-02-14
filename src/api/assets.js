/*
 * @fileName: Do not edit
 * @Author: han
 * @createTime: Do not edit
 * @desc: Do not Edit
 */
import { axiosPost, axiosGet  } from '../utils/axios'
import { assets, assetIn } from '../config/config.url'
import configs from "@/config/config.base";
// post请求示例
// export function seachInspectionInstByItems (data) {
//   return axiosPost(assets.project.getproject, data)
// }
// get请求示例
// export function inspectionObjectInstDetail (data) {
//   return axiosGet(assets.project.getproject, data)
// }
// 文件下载请求示例
// export function exportInspectionInstByMaterial (data) {
//   return axiosPost(assets.project.getproject, data, false, false, {
//     responseType: 'blob'
//   })
// }

// 组织机构树
export function queryAsynOrganByUserId (data) {
  return axiosPost(assets.project.queryAsynOrganByUserId, data)
}

// 机构字典
export function organDict (data) {
  return axiosGet(assets.project.organDict, data)
}
// 平台字典
export function platformDict (data) {
  return axiosGet(assets.project.platformDict, data)
}
// 查询资产分类列表
export function getList (data) {
  // 如果资产类型为空
  if (!data.assetType) {
    return Promise.reject(new Error('资产类型为空'))
  }
  // 如果是多选 删除"" 去第一项值
  let assetType = data.assetType.split(',')
  assetType = assetType.filter(item => Boolean(item))
  data.assetType = assetType[0]
  return axiosGet(assets.project.getList, data)
}

// 资产变动
// 资产变动-一览表-分页列表
export function getChangeSchedulePage (data) {
  return axiosPost(assets.management.getChangeSchedulePage, data)
}
// 资产变动-详情
export function getChangeDetail (data) {
  return axiosGet(assets.management.getChangeDetail, data)
}
// 资产变动-一览表-导出
export function exportChangeScheduleList (data) {
  return axiosPost(assets.management.exportChangeScheduleList, data, false, false, {responseType: 'blob'})
}
// 资产变动-分页列表
export function getChangePage (data) {
  return axiosPost(assets.management.getChangePage, data)
}

export function getChangePageSum (data) {
  return axiosPost(assets.management.getChangePageSum, data)
}
// 资产变动-删除
export function deleteChange (data) {
  return axiosPost(assets.management.deleteChange, data)
}
// 资产变动-审批
export function approveChange (data) {
  return axiosPost(assets.management.approveChange, data)
}
// 资产变动-导入
export function importChange (data) {
  return axiosPost(assets.management.importChange, data)
}
// 资产变动-导出
export function exportChange (data) {
  return axiosGet(assets.management.exportChange, data)
}
// 资产变动-新增编辑
export function submitChange (data) {
  return axiosPost(assets.management.submitChange, data)
}
// 资产变动-资产项目查楼栋
export function organBuild (data) {
  return axiosGet(assets.management.organBuild, data)
}
// 资产变动-查楼栋下房屋
export function buildPage (data) {
  return axiosGet(assets.management.buildPage, data)
}
// 资产变动-编辑明细
export function getChangeInfo (data) {
  return axiosGet(assets.management.getChangeInfo, data)
}
// 资产变动-终止交付
export function stopDelivery (data) {
  return axiosPost(assets.management.stopDelivery, data)
}
// 房屋资产分页查询
export function assetHousePage (data) {
  return axiosPost(assets.management.assetHousePage, data)
}
// 资产变动-变动明细分页
export function getChangeDetailPage (data) {
  return axiosGet(assets.management.getChangeDetailPage, data)
}
// 资产列表
export function assetListPage (data) {
  return axiosPost(assets.management.assetListPage, data)
}

// 资产登记
// 资产登记-删除
export function deleteByRegisterOrderId (data) {
  return axiosPost(assets.assetRegister.deleteByRegisterOrderId, data)
}
// 资产登记-撤销核实
export function registerOrderReAudit (data) {
  return axiosPost(assets.assetRegister.registerOrderReAudit, data)
}
// 资产登记-核实
export function registerOrderAudit (data) {
  return axiosPost(assets.assetRegister.registerOrderAudit, data)
}
// 资产登记-列表统计
export function pageListStatistics (data) {
  return axiosPost(assets.assetRegister.pageListStatistics, data)
}
// 资产登记一览表-主列表
export function findAssetRegListPage (data) {
  return axiosPost(assets.assetRegister.findAssetRegListPage, data)
}
// 资产登记一览表-主列表导出
export function assetRegListPageExport (data) {
  return axiosPost(assets.assetRegister.assetRegListPageExport, data, false, false, {responseType: 'blob'})
}
// 资产登记一览表-列表统计
export function assetRegSta (data) {
  return axiosPost(assets.assetRegister.assetRegSta, data)
}
// 资产登记-新增保存
export function saveRegisterOrder (data) {
  return axiosPost(assets.assetRegister.saveRegisterOrder, data)
}
// 资产登记-编辑保存
export function updateRegisterOrder (data) {
  return axiosPost(assets.assetRegister.updateRegisterOrder, data)
}
// 资产登记-编辑保存
export function updateAttachment (data) {
  return axiosPost(assets.assetRegister.updateAttachment, data)
}
// 资产登记-编辑回显
export function getRegisterOrderById (data) {
  return axiosGet(assets.assetRegister.getRegisterOrderById, data)
}
// 资产登记明细列表-分页
export function getRegisterOrderDetailsPageById (data) {
  return axiosPost(assets.assetRegister.getRegisterOrderDetailsPageById, data)
}
//资产登记列表-分页查询
export function getRegisterOrderListPage (data) {
  return axiosPost(assets.assetRegister.getRegisterOrderListPage, data)
}
// 资产登记新增-下载导入模板
export function downloadTemplate (data) {
  return axiosPost(assets.assetRegister.downloadTemplate, data, true, false, {responseType: 'blob'})
}
// 资产登记新增（修改的批量导出）-再次下载导入模板
export function downloadTemplateV2 (data) {
  return axiosPost(assets.assetRegister.downloadTemplateV2, data, true, false, {responseType: 'blob'})
}
// 基本信息批量更新（导入）
export function baseImport (data) {
  return axiosPost(assets.assetRegister.baseImport, data)
}
// 资产登记转运营信息-根据资产项目ID
export function getTransferByProjectId (data) {
  return axiosPost(assets.assetRegister.getTransferByProjectId, data)
}
export function getTransferOperationSchedule (data) {
  return axiosPost(assets.assetRegister.getTransferOperationSchedule, data)
}
// 资产登记明细列表-不分页
export function getRegisterOrderDetailsById (data) {
  return axiosPost(assets.assetRegister.getRegisterOrderDetailsById, data)
}
// 资产登记-详情明细统计
export function getRegisterOrderDetailsStatistics (data) {
  return axiosGet(assets.assetRegister.getRegisterOrderDetailsStatistics, data)
}
// 资产登记-读取excel模板文件
export function readExcelModel (data) {
  return axiosPost(assets.assetRegister.readExcelModel, data)
}
// 资产登记-读取excel模板文件
export function readExcelModelV2 (data) {
  return axiosPost(assets.assetRegister.readExcelModelV2, data)
}
// 资产登记-再次导入
export function updateRegisterOrderV2 (data) {
  return axiosPost(assets.assetRegister.updateRegisterOrderV2, data)
}
// 更新办证状态
export function updateCertificateStatus (data) {
  return axiosPost(assets.assetRegister.updateCertificateStatus, data)
}
// 资产登记-导出数据校验
export function checkBuildsObjectType (data) {
  return axiosPost(assets.assetRegister.checkBuildsObjectType, data)
}
// 资产登记-附属配套-分页查询列表
export function getListPageByRegisterOrderId (data) {
  return axiosPost(assets.assetRegister.getListPageByRegisterOrderId, data)
}
// 资产登记一览表-附属配套-分页查询列表
export function getMatchingListByAssetIdPage (data) {
  return axiosPost(assets.assetRegister.getMatchingListByAssetIdPage, data)
}
// 附属配套-新增/修改保存(资产登记版)
export function addModifySaveByRgId (data) {
  return axiosPost(assets.assetRegister.addModifySaveByRgId, data)
}
// 资产登记-查询资产列表-根据资产登记Id
export function findAssetListByRgId (data) {
  return axiosPost(assets.assetRegister.findAssetListByRgId, data)
}
// 资产登记-附属配套-统计
export function getMatchingStatisByRgId (data) {
  return axiosPost(assets.assetRegister.getMatchingStatisByRgId, data)
}
// 资产登记一览表-附属配套-统计
export function getMatchingSta (data) {
  return axiosPost(assets.assetRegister.getMatchingSta, data)
}
// 根据登记单Id资产登记明细列表-分页
export function getRegisterOrderDetailsPageByIdList (data) {
  return axiosPost(assets.assetRegister.getRegisterOrderDetailsPageByIdList, data)
}
// 下载附属配套模板
export function downModle (data) {
  return axiosPost(assets.assetRegister.downModle, data, false, false, {responseType: 'blob'})
}
// 下载附属配套模板，带条件
export function downBatchModle (data) {
  return axiosPost(assets.assetRegister.downBatchModle, data, false, false, {responseType: 'blob'})
}
// 批量导入-导入保存
export function batchImportByRgId (data) {
  return axiosPost(assets.assetRegister.batchImportByRgId, data)
}
// 资产登记-价值信息统计
export function getValueStatistics (data) {
  return axiosPost(assets.assetRegister.getValueStatistics, data)
}
// 资产登记-价值信息批量导出
export function valueExport (data) {
  return axiosPost(assets.assetRegister.valueExport, data, false, false, {responseType: 'blob'})
}
// 资产登记-价值信息批量导入
export function valueImport (data) {
  return axiosPost(assets.assetRegister.valueImport, data)
}
// 资产登记-价值信息分页列表
export function queryValuePageListByRgId (data) {
  return axiosPost(assets.assetRegister.queryValuePageListByRgId, data)
}
// 资产登记-价值信息详情
// export function getValueDetail (data) {
//   return axiosPost(assets.assetRegister.getValueDetail, data)
// }
// 资产登记-编辑价值信息
export function updateAssetValue (data) {
  return axiosPost(assets.assetRegister.updateAssetValue, data)
}
// 使用方向修改
export function useForUpdate (data) {
  return axiosPost(assets.assetRegister.useForUpdate, data)
}
// 使用方向分页列表
export function userForList (data) {
  return axiosPost(assets.assetRegister.userForList, data)
}
// 使用方向详情
export function useForDetail (data) {
  return axiosGet(assets.assetRegister.useForDetail, data)
}
// 使用方向面积统计
export function useForSummary (data) {
  return axiosGet(assets.assetRegister.useForSummary, data)
}
// 批量导出
export function userForExport (data) {
  return axiosGet(assets.assetRegister.userForExport, data, false, {responseType: 'blob'})
}
// 批量更新
export function usrForImport (data) {
  return axiosPost(assets.assetRegister.usrForImport, data)
}
// 相关费用下载导入模板
export function correlationExpenseExport (data) {
  return axiosGet(assets.assetRegister.correlationExpenseExport, data, false, {responseType: 'blob'})
}
// 相关费用导入
export function correlationExpenseImport (data) {
  return axiosPost(assets.assetRegister.correlationExpenseImport, data)
}
// 相关费用分页列表
export function correlationExpenseList (data) {
  return axiosPost(assets.assetRegister.correlationExpenseList, data)
}
// 相关费用删除
export function correlationExpenseDelete (data) {
  return axiosPost(assets.assetRegister.correlationExpenseDelete, data)
}
// 相关费用新增修改
export function correlationExpenseUpdate (data) {
  return axiosPost(assets.assetRegister.correlationExpenseUpdate, data)
}
// 相关费用详情
export function correlationExpenseDetail (data) {
  return axiosGet(assets.assetRegister.correlationExpenseDetail, data)
}
// 相关费用金额统计
export function correlationExpenseTotal (data) {
  return axiosGet(assets.assetRegister.correlationExpenseTotal, data)
}
// 资产登记-删除基础信息
export function deleteBase (data) {
  return axiosPost(assets.assetRegister.deleteBase, data)
}

// 资产出库
// 资产出库-分页列表
export function getCleanupPage (data) {
  return axiosPost(assets.assetClear.getCleanupPage, data, true, false)
}
// 资产出库-删除
export function deleteCleanup (data) {
  return axiosPost(assets.assetClear.deleteCleanup, data, false, false)
}
// 资产出库-审批
export function approvalCleanup (data) {
  return axiosPost(assets.assetClear.approvalCleanup, data, false, false)
}
// 资产出库-审批
export function reverseApproveCleanup (data) {
  return axiosPost(assets.assetClear.reverseApproveCleanup, data, false, false)
}
// 资产出库-新增编辑保存
export function submitCleanup (data) {
  return axiosPost(assets.assetClear.submitCleanup, data, false, false)
}
// 资产出库-编辑查询明细
export function getCleanupInfo (data) {
  return axiosGet(assets.assetClear.getCleanupInfo, data)
}
// 资产出库-详情
export function getCleanupDetail (data) {
  return axiosGet(assets.assetClear.getCleanupDetail, data)
}
// 资产出库-资产明细分页列表
export function getCleanupDetailPage (data) {
  return axiosGet(assets.assetClear.getCleanupDetailPage, data)
}
// 资产出库-统计
export function assetCleanupGetCount (data) {
  return axiosPost(assets.assetClear.assetCleanupGetCount, data, false, false)
}
// 资产出库一览表-统计
export function assetCleanupListTotal (data) {
  return axiosPost(assets.assetClear.assetCleanupListTotal, data, false, false)
}
// 资产出库一览表
export function getGeneralSurvey(data) {
  return axiosPost(assets.assetClear.getGeneralSurvey, data, false, false)
}
//  资产出库一览表导出
export function getGeneralSurveyExportOut(data) {
  return axiosPost(assets.assetClear.getGeneralSurveyExportOut, data, false, false, {responseType: 'blob'})
}

//资产分类设置
// 资产分类设置-资产分类列表
export function getPage (data) {
  return axiosPost(assets.assetClassSet.getPage, data, true, false)
}
// 资产分类设置-导出资产分类列表
export function exportList (data) {
  return axiosPost(assets.assetClassSet.exportList, data, false, false, {responseType: 'blob'})
}
/*
  * 资产分类设置-获取费用科目类列表(根据当前环境判断调用接口路径，招商环境和其他环境)
  * 其他环境  /ams/categoryCfg/getFeeTypeList
  * 招商环境  /charging-api/rest-api/v1/feeItemType/queryFeeItemTypeList
  * */
export function getFeeTypeList (data) {
  return new Promise((resolve, reject) => {
    if(configs.platform === "merchants"){
      axiosPost(assets.assetClassSet.getFeeTypeList2, data).then(value=>{
        let {data:{data=[],code=-1,message='解构失败'},...restArgus} = value
        if (data){
          data = data.map((ele)=>{
            return {
              feeTypeId:ele.feeItemTypeId,
              feeTypeName:ele.feeItemTypeName
            }
          })
        }
        resolve({
          ...restArgus,
          data:{
            code,
            data,
            message
          }
        })
      },error=>{
        reject(error)
      })
    }{
      axiosGet(assets.assetClassSet.getFeeTypeList, data).then(value=>{
        resolve(value)
      },(error)=>{
        reject(error)
      })
    }
  })
}
// 资产分类设置-修改资产分类
export function update (data) {
  return axiosPost(assets.assetClassSet.update, data, false, false)
}
// 资产分类设置-修改资产分类状态
export function updateStatus (data) {
  return axiosPost(assets.assetClassSet.updateStatus, data, false, false)
}
// 3.1.1查询设备分类编码列表
export function getEquipmentCodeList (data) {
  return axiosPost(assets.assetClassSet.getEquipmentCodeList, data, false, false)
}
// 3.1.2根据设备分类ID查询子级设备分类信息
export function getEquipmentListByUpEquipmentId (data) {
  return axiosPost(assets.assetClassSet.getEquipmentListByUpEquipmentId, data, false, false)
}
// 3.1.5根据设备分类ID查询设备分类台账属性(不分页)
export function getInfoAttrListByEquipmentId (data) {
  return axiosPost(assets.assetClassSet.getInfoAttrListByEquipmentId, data, false, false)
}
// 删除设施设备分类
export function updateEquipmentStatus (data) {
  return axiosPost(assets.assetClassSet.updateEquipmentStatus, data, true, false)
}
//  保存/更新设施设备分类
export function updateEquipment (data) {
  return axiosPost(assets.assetClassSet.updateEquipment, data, true, false)
}
// 资产分类设置-获取资产分类详情
export function getDetail (data) {
  return axiosPost(assets.assetClassSet.getDetail, data, false, false)
}
export function batchSaveInfoAttr (data) {
  return axiosPost(assets.assetClassSet.batchSaveInfoAttr, data, false, false)
}
export function deleteInfoAttr (data) {
  return axiosPost(assets.assetClassSet.deleteInfoAttr, data, false, false)
}

// 房屋台账-资产项目视图
// 资产项目视图列表-导出资产项目视图列表
export function exportAssetProjectViewList (data) {
  return axiosPost(assets.assetProjectView.exportAssetProjectViewList, data, false, false, {responseType: 'blob'})
}
// 资产项目视图列表-查询房屋和楼栋信息分页查询
export function viewGetAssetHouseList (data) {
  return axiosPost(assets.assetProjectView.viewGetAssetHouseList, data, true, false)
}
// 资产项目视图列表头-查询房屋和楼栋信息统计
export function viewGetAssetHouseStatistics (data) {
  return axiosPost(assets.assetProjectView.viewGetAssetHouseStatistics, data, false, false)
}
// 资产项目视图详情-资产状况统计列表分页
export function viewDetailsPage (data) {
  return axiosPost(assets.assetProjectView.viewDetailsPage, data, false, false)
}
// 资产项目视图（详情）-资产状况统计
export function viewProjectHouseDetails (data) {
  return axiosPost(assets.assetProjectView.viewProjectHouseDetails, data, false, false)
}
// 房屋台账-楼栋视图
// 查询楼栋视图面积使用统计
export function queryBuildingViewFloorArea (data) {
  return axiosPost(assets.buildingView.queryFloorArea, data, false, false)
}

// 楼栋视图分页查询
export function queryBuildingViewPage (data) {
  return axiosPost(assets.buildingView.queryViewPage, data, false, false)
}
// 导出楼栋视图excel
export function exportBuildingViewExcel (data) {
  return axiosPost(assets.buildingView.exportExcel, data, false, false, {responseType: 'blob'})
}
// 楼层信息查询
export function queryBuildingViewFloorInfo (data) {
  return axiosGet(assets.buildingView.queryFloorInfo, data)
}
// 查询当前组织机构下所有的楼栋
export function queryBuildingByOrganId (data) {
  return axiosGet(assets.buildingView.queryBuildingByOrganId, data)
}

// 查询楼栋下的单元-楼层关系
export function queryBuildingViewUnitByHouseId (data) {
  return axiosGet(assets.buildingView.queryUnitByHouseId, data)
}
// 查询楼栋详情
export function queryBuildingViewBuildInfo (data) {
  return axiosGet(assets.buildingView.queryBuildInfo, data)
}
// 楼层信息查询
export function queryBuildingViewDetailArea (data) {
  return axiosGet(assets.buildingView.queryDetailArea, data)
}
// 查询楼层下房间的面积
export function queryBuildingViewRoomArea (data) {
  return axiosGet(assets.buildingView.queryRoomArea, data)
}

// 房屋台账 - 资产视图
// 房屋台账资产视图汇总
export function assetHousePageTotal (data) {
  return axiosPost(assets.assetView.assetHousePageTotal, data)
}
// 房屋资产基本信息查询
export function queryAssetViewBaseInfo (data) {
  return axiosGet(assets.assetView.queryHouseInfo, data)
}

// 资产使用面积详情
export function queryAssetViewHouseArea (data) {
  return axiosGet(assets.assetView.queryHouseArea, data)
}

// 分页查询房屋资产信息
export function queryAssetViewPage (data) {
  return axiosPost(assets.assetView.queryAssetViewPage, data)
}
// 不分页查询房屋资产信息
export function queryAssetViewPage2 (data) {
  return axiosPost(assets.assetView.queryAssetViewPage2, data)
}
// 不分页查询车场资产信息
export function carPage (data) {
  return axiosPost(assets.assetView.carPage, data)
}
// 资产视图使用面积统计
export function queryAssetViewArea (data) {
  return axiosPost(assets.assetView.queryAssetArea, data)
}

// 导出房屋卡片
export function exportAssetViewHouseExcel (data) {
  return axiosGet(assets.assetView.exportHouseExcel, data, false, {responseType: 'blob'})
}
// 导出资产信息
export function exportAssetViewExcel (data) {
  return axiosPost(assets.assetView.exportAssetExcel, data, false, false, {responseType: 'blob'})
}
// 导出资产视图校验
export function exportAssetViewExcelExam (data) {
  return axiosPost(assets.assetView.exportAssetExcelExam, data,)
}
// 资产编辑保存
export function saveAssetViewHouseInfo (data) {
  return axiosPost(assets.assetView.saveHouseInfo, data)
}
// 资产视图-其他信息Tab-查询权属信息
export function queryAssetViewOwnDetail (data) {
  return axiosGet(assets.assetView.queryOwnDetail, data)
}
// 资产视图-其他信息Tab-查询接管信息
export function queryAssetViewTakeOverDetail (data) {
  return axiosGet(assets.assetView.queryTakeOverDetail, data)
}
// 资产视图-其他信息Tab-查询账面信息
export function queryAssetViewBillDetail (data) {
  return axiosPost(assets.assetView.queryBillDetail, data)
}
// 资产视图-其他信息Tab-查询变动信息
export function queryAssetViewChangeDetail (data) {
  return axiosGet(assets.assetView.queryChangeDetail, data)
}
// 资产视图-其他信息Tab-查询资产处置信息
export function queryAssetViewDisposeDetail (data) {
  return axiosPost(assets.assetView.queryDisposeDetail, data)
}
// 资产视图-其他信息Tab-查询附属&配套信息
export function queryAssetViewAccessoryDetail (data) {
  return axiosPost(assets.assetView.queryAccessoryDetail, data)
}
// 资产视图-其他信息Tab-查询巡查记录
export function queryAssetViewPatrolDetail (data) {
  return axiosPost(assets.assetView.getListPageByAssetId, data)
}
// 资产视图-其他信息Tab-查询档案文件
export function queryAssetViewArchiveDetail (data) {
  return axiosPost(assets.assetView.queryArchiveDetail, data)
}
// 导出房屋卡片
export function exportHouseCard (data) {
  return axiosGet(assets.assetView.exportHouseCard, data, false, {responseType: 'blob'})
}
// 查询组织机构下的员工
export function queryUserListByOrganId (data) {
  return axiosGet(assets.assetView.userList, data)
}
// 房屋台账
// 组织机构视图
// 查询组织机构视图列表
export function queryOrganViewList (data) {
  return axiosPost(assets.organView.queryOrganViewList, data)
}
// 查询组织机构视图面积概览
export function queryOrganArea (data) {
  return axiosPost(assets.organView.queryOrganArea, data)
}
// 查询组织机构视图详情
export function queryOrganViewDetail (data) {
  return axiosPost(assets.organView.queryDetail, data)
}
// 导出组织机构视图
export function exportOrganView(data) {
  return axiosPost(assets.organView.exportOrganView, data, false, false, {responseType: 'blob'})
}
// 组织机构详情
export function viewGetAssetHouseListForOrgan (data) {
  return axiosPost(assets.organView.viewGetAssetHouseListForOrgan, data)
}
// 组织机构视图详情表头统计
export function viewGetAssetHouseStatisticsForOrgan (data) {
  return axiosPost(assets.organView.viewGetAssetHouseStatisticsForOrgan, data)
}
// 资产项目管理
// 分页查询资产项目列表-根据组织ID
export function queryProjectManageListPage (data) {
  return axiosPost(assets.projectManage.queryProjectListPage, data)
}

// 查询资产项目列表-根据组织ID(统计)
export function queryProjectManageProjectStatistics (data) {
  return axiosPost(assets.projectManage.queryProjectStatistics, data)
}

// 资产项目-删除
export function deleteProjectManageById (data) {
  return axiosPost(assets.projectManage.deleteProjectById, data)
}
// 查询资产项目详情-根据资产项目ID
export function queryProjectManageDetailById (data) {
  return axiosPost(assets.projectManage.queryDetailById, data)
}

// 查询资产项目编辑-根据资产项目ID
export function queryProjectManageEditDetailById (data) {
  return axiosPost(assets.projectManage.queryEditDetailById, data)
}

// 根据组织Id查资产项目
export function queryProjectManageProjectByOrganId (data) {
  return axiosGet(assets.assetView.queryProjectByOrganId, data)
}

// 资产项目-反审核
export function doProjectManageReaudit (data) {
  return axiosPost(assets.projectManage.reauditAction, data)
}
// 资产项目-导入保存
export function importProjectManageData (data) {
  return axiosPost(assets.projectManage.importProject, data)
}

// 资产项目-提交审核
export function doProjectManageAudit (data) {
  return axiosPost(assets.projectManage.AuditAction, data)
}

// 资产项目-新增保存
export function saveProjectManageNewProject (data) {
  return axiosPost(assets.projectManage.saveNewProject, data)
}

// 资产项目-编辑保存
export function saveProjectManageEditProject (data) {
  return axiosPost(assets.projectManage.saveEditProject, data)
}

// 资产项目-转运营信息统计
export function queryProjectManageTransferStatistics (data) {
  return axiosPost(assets.projectManage.queryTransferStatistics, data)
}

// 房屋台账-资产项目
// 分页查询资产项目列表-根据组织ID
export function getAssetProjectListPage (data) {
  return axiosPost(assets.assetProject.getProjectListPage, data, true, false)
}
// 查询资产项目列表-根据组织ID(统计)
export function getProjectListStatistics (data) {
  return axiosPost(assets.assetProject.getProjectListStatistics, data, false, false)
}
// 查询资产项目编辑-根据资产项目ID
export function projectDetailsForModifyById (data) {
  return axiosPost(assets.assetProject.projectDetailsForModifyById, data, false, false)
}
// 查询资产项目详情-根据资产项目ID
export function projectDetailsById (data) {
  return axiosPost(assets.assetProject.projectDetailsById, data, false, false)
}
// 资产项目-下拉框查询
export function getObjectKeyValueByOrganId (data) {
  return axiosGet(assets.assetProject.getObjectKeyValueByOrganId, data)
}
// 资产项目-删除
export function shipDrojectById (data) {
  return axiosPost(assets.assetProject.shipDrojectById, data, false, false)
}
// 资产项目-反审核
export function projectReAudit (data) {
  return axiosPost(assets.assetProject.projectReAudit, data, false, false)
}
// 资产项目-导入保存
export function importProject (data) {
  return axiosPost(assets.assetProject.importProject, data, false, false)
}
// 资产项目-提交审核
export function projectAudit (data) {
  return axiosPost(assets.assetProject.projectAudit, data, false, false)
}
// 资产项目-新增保存
export function saveProject (data) {
  return axiosPost(assets.assetProject.saveProject, data, false, false)
}
// 资产项目-编辑保存
export function modifyProject (data) {
  return axiosPost(assets.assetProject.modifyProject, data, false, false)
}
// 资产项目-转运营信息统计
export function getProjectTransferByProjectId (data) {
  return axiosPost(assets.projectManage.queryTransferStatistics, data, false, false)
}

// 资产项目-资产项目详情-资产概况
export function queryProjectManageGeneralInfo (data) {
  return axiosGet(assets.projectManage.queryGeneralInfo, data)
}

// 资产项目-资产项目详情-权属概况
export function queryProjectManageOwnInfo (data) {
  return axiosGet(assets.projectManage.queryOwnInfo, data)
}
// 根据organId查询资产项目视图详情权属信息
export function queryAssetProjectOwnershipInfo (data) {
  return axiosGet(assets.assetProject.queryAssetProjectOwnershipInfo, data)
}

// 权属人管理
// 权属人管理-新建或编辑权属人
export function saveOrUpdateOwner (data) {
  return axiosPost(assets.propertyOwnerManagement.saveOrUpdate, data, false, false)
}
// 权属人管理-权属人下拉列表
export function select (data) {
  return axiosGet(assets.propertyOwnerManagement.select, data)
}
// 权属人管理-权属人列表查询
export function list (data) {
  return axiosPost(assets.propertyOwnerManagement.list, data, true, false)
}
// 权属人管理-权属人删除
export function ownerDelete (data) {
  return axiosGet(assets.propertyOwnerManagement.ownerDelete, data)
}
// 权属人管理-权属人导入
export function ownerExport (data) {
  return axiosPost(assets.propertyOwnerManagement.ownerExport, data, false, false)
}
// 权属人管理-权属人导入模板下载
export function download (data) {
  return axiosGet(assets.propertyOwnerManagement.download, data)
}
// 权属人管理-权属人详情查询
export function detail (data) {
  return axiosGet(assets.propertyOwnerManagement.detail, data)
}

// 资产入账
// 资产入账-新建资产入账
export function insertCard (data) {
  return axiosPost(assets.assetEntry.insertCard, data, false, false)
}
// 资产入账-更新资产入账
export function updateCard (data) {
  return axiosPost(assets.assetEntry.updateCard, data, false, false)
}
// 资产入账-资产入账分页查询
export function queryCardPageList (data) {
  return axiosPost(assets.assetEntry.queryCardPageList, data, true, false)
}
// 资产入账-资产入账状态操作
export function updateCardStatus (data) {
  return axiosPost(assets.assetEntry.updateCardStatus, data, false, false)
}
// 资产入账-资产入账详情
export function queryCardDetail (data) {
  return axiosPost(assets.assetEntry.queryCardDetail, data, false, false)
}
// 资产视图费用相关
export function assetExpenseInfo (data) {
  return axiosPost(assets.assetView.assetExpenseInfo, data)
}
// 资产登记一览表-费用相关-统计
export function assetExpenseTotal (data) {
  return axiosPost(assets.assetView.assetExpenseTotal, data)
}
// 资产视图-运营信息-合同信息（分页）
export function assetOperationContractInfo (data) {
  return axiosPost(assets.assetView.assetOperationContractInfo, data)
}
// 资产视图-运营信息-运营收入（分页）
export function getAcctItemPageList (data) {
  return axiosPost(assets.assetView.getAcctItemPageList, data)
}
// 资产视图-运营信息-运营收入（返回参数）
export function assetOperationExpenseParam (data) {
  return axiosPost(assets.assetView.assetOperationExpenseParam, data)
}
// 资产入账分页查询汇总
export function queryCardPageListSum (data) {
  return axiosPost(assets.assetView.queryCardPageListSum, data)
}


// 资产入库相关
// 入库单统计
export function getAssetStoreCount (data) {
  return axiosPost(assetIn.getAssetStoreCount, data)
}
// 入库登记单导出
export function exportAssetInExcel (data) {
  return axiosPost(assetIn.export, data, false, false, {responseType: 'blob'})
}
// 新增资产入库或修改
export function addOrUpdateAssetStore (data) {
  return axiosPost(assetIn.addOrUpdateAssetStore, data)
}
// 入库单审核
export function auditAssetStore (data) {
  return axiosPost(assetIn.auditAssetStore, data)
}
// 查询入库单详情
export function queryAssetStoreDetail (data) {
  return axiosGet(assetIn.queryAssetStoreDetail, data)
}
// 资产入库列表查询
export function queryAssetStoreList (data) {
  return axiosPost(assetIn.queryAssetStoreList, data)
}
// 资产入库一览表列表查询
export function assetInGetGeneralSurvey (data) {
  return axiosPost(assetIn.getGeneralSurvey, data)
}
// 资产入库一览表列表统计
export function getGeneralSurveyTotal (data) {
  return axiosPost(assetIn.getGeneralSurveyTotal, data)
}
// 资产入库一览表列表导出
export function getGeneralSurveyExport (data) {
  return axiosPost(assetIn.getGeneralSurveyExport, data, false, false, {responseType: 'blob'})
}
