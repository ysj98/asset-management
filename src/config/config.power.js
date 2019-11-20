/**
 * 描述：权限常量配置
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

 /**
 * 公共的权限常量
 **/
export const GLOBAL = {
  // 按行政区查找组织机构树的权限
  ADMINISTRATIVE_PERMISSION: 'c-common-administrative',
  // 下载中心刷新
  DOWNLOADCENTER_REFRESH: 'c_download_file_001',
  // 下载中心下载
  DOWNLOADCENTER_DOWNLOAD: 'c_download_file_download_001'
}

 /**
 * 以下是具体业务的权限常量
 **/
 export const ASSET_MANAGEMENT = {
   // 资产清理-新建清理单
   ASSET_CLEAR_NEW: 'zcgl_asset_clear_new',
   // 资产清理-编辑清理单
   ASSET_CLEAR_EDIT: 'zcgl_asset_clear_edit',
   // 资产清理-审核清理单
   ASSET_CLEAR_AUDIT: 'zcgl_asset_clear_audit',
   // 资产清理-反审核清理单
   ASSET_CLEAR_REVERSE_AUDIT: 'zcgl_asset_clear_reverse_audit',
   // 资产清理-删除清理单
   ASSET_CLEAR_DELETE: 'zcgl_asset_clear_delete',
   // 资产分类-编辑资产分类信息
   ASSET_CLASS_SET_EDIT: 'zcgl_asset_class_set_edit',
   // 资产分类-启用/停用资产分类信息(状态)
   ASSET_CLASS_SET_CHANGE_STATUS: 'zcgl_asset_class_set_change_status',
   // 楼盘字典-新增房间
   ZCGL_ADD_HOUSE: 'zcgl_add_house',
   // 楼盘字典-编辑房间
   ZCGL_EDIT_HOUSE: 'zcgl_edit_house',
   // 楼盘字典-房间资料导入
   ZCGL_HOUSEZL_IN: 'zcgl_housezl_in',
   // 楼盘字典-房间导入批量更新
   ZCGL_HOUSE_IN: 'zcgl_house_in',
   // 楼盘字典-房间导出
   ZCGL_HOUSE_OUT: 'zcgl_house_out',
   // 楼盘字典-房间状态
   ZCGL_HOUSE_STATE: 'zcgl_house_state',
   // 楼盘字典-新建楼栋
   ZCGL_BUILD_ADD: 'zcgl_build_add',
   // 楼盘字典-编辑楼栋
   ZCGL_BUILD_EDIT: 'zcgl_build_edit',
   // 楼盘字典-删除楼栋
   ZCGL_BUILD_DELETE: 'zcgl_build_delete',
   // 楼盘字典-新建楼层
   ZCGL_FLOOR_ADD: 'zcgl_floor_add',
   // 楼盘字典-编辑楼层
   ZCGL_FLOOR_EDIT: 'zcgl_floor_edit',
   // 楼盘字典-删除楼层
   ZCGL_FLOOR_DELETE: 'zcgl_floor_delete',
   // 楼盘字典-新建单元
   ZCGL_UNIT_ADD: 'zcgl_unit_add',
   // 楼盘字典-编辑单元
   ZCGL_UNIT_EDIT: 'zcgl_unit_edit',
   // 楼盘字典-删除单元
   ZCGL_UNIT_DELETE: 'zcgl_unit_delete',
 }