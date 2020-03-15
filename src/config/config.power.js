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
  /**
  * 资产清理
  **/
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
  /**
  * 资产分类
  **/
  // 资产分类-编辑资产分类信息
  ASSET_CLASS_SET_EDIT: 'zcgl_asset_class_set_edit',
  // 资产分类-启用/停用资产分类信息(状态)
  ASSET_CLASS_SET_CHANGE_STATUS: 'zcgl_asset_class_set_change_status',
  // 楼盘字典-新增房间
  ASSET_ADD_HOUSE: 'zcgl_add_house',
  // 楼盘字典-编辑房间
  ASSET_EDIT_HOUSE: 'zcgl_edit_house',
  // 楼盘字典-房间资料导入
  ASSET_HOUSEZL_IN: 'zcgl_housezl_in',
  // 楼盘字典-房间导入批量更新
  ASSET_HOUSE_IN: 'zcgl_house_in',
  // 楼盘字典-房间导出
  ASSET_HOUSE_OUT: 'zcgl_house_out',
  // 楼盘字典-房间状态
  ASSET_HOUSE_STATE: 'zcgl_house_state',
  // 楼盘字典-新建楼栋
  ASSET_BUILD_ADD: 'zcgl_build_add',
  // 楼盘字典-编辑楼栋
  ASSET_BUILD_EDIT: 'zcgl_build_edit',
  // 楼盘字典-删除楼栋
  ASSET_BUILD_DELETE: 'zcgl_build_delete',
  // 楼盘字典-新建楼层
  ASSET_FLOOR_ADD: 'zcgl_floor_add',
  // 楼盘字典-编辑楼层
  ASSET_FLOOR_EDIT: 'zcgl_floor_edit',
  // 楼盘字典-删除楼层
  ASSET_FLOOR_DELETE: 'zcgl_floor_delete',
  // 楼盘字典-新建单元
  ASSET_UNIT_ADD: 'zcgl_unit_add',
  // 楼盘字典-编辑单元
  ASSET_UNIT_EDIT: 'zcgl_unit_edit',
  // 楼盘字典-删除单元
  ASSET_UNIT_DELETE: 'zcgl_unit_delete',
  /**
  * 资产变动
  **/
  // 资产变动-新增变动单
  ASSET_CHANGE_NEW: 'zcgl_asset_change_new',
  // 资产变动-编辑变动单
  ASSET_CHANGE_EDIT: 'zcgl_asset_change_edit',
  // 资产变动-审核
  ASSET_CHANGE_AUDIT: 'zcgl_asset_change_audit',
  // 资产变动-反审核
  ASSET_CHANGE_REVERSE_AUDIT: 'zcgl_asset_change_reverse_audit',
  // 资产变动-删除
  ASSET_CHANGE_DELETE: 'zcgl_asset_change_delete',
  // 资产变动- 结束交付
  ASSET_CHANGE_END_DELIVERY: 'zcgl_asset_change_end_delivery',
  /**
   * 资产登记
   **/
  // 资产登记-新增登记单
  ASSET_REGISTER_NEW: 'zcgl_asset_register_new',
  // 资产登记-编辑登记单
  ASSET_REGISTER_EDIT: 'zcgl_asset_register_edit',
  // 资产登记-审核
  ASSET_REGISTER_AUDIT: 'zcgl_asset_register_audit',
  // 资产登记-反审核
  ASSET_REGISTER_REVERSE_AUDIT: 'zcgl_asset_register_reverse_audit',
  // 资产登记-删除
  ASSET_REGISTER_DELETE: 'zcgl_asset_register_delete',

  /**
  * 资产项目管理APM （asset-project-manage）
  **/
  // 资产项目管理-删除
  ASSET_APM_DELETE: 'zcgl_apm_delete',
  // 资产项目管理-反审核
  ASSET_APM_REAPPROVAL: 'zcgl_apm_reApproval',
  // 资产项目管理-审核
  ASSET_APM_APPROVAL: 'zcgl_apm_approval',
  // 资产项目管理-编辑
  ASSET_APM_EDIT: 'zcgl_apm_edit',
  // 资产项目管理-新建
  ASSET_APM_NEW: 'zcgl_apm_new',

  /**
   * 权属登记
   **/
  // 权属登记-新增权属登记单
  ASSET_OWNERR_NEW: 'zcgl_asset_ownerr_new',
  // 权属登记-编辑权属登记单
  ASSET_OWNERR_EDIT: 'zcgl_asset_ownerr_edit',
  // 权属登记-审核
  ASSET_OWNERR_AUDIT: 'zcgl_asset_ownerr_audit',
  // 权属登记-反审核
  ASSET_OWNERR_REVERSE_AUDIT: 'zcgl_asset_ownerr_reverse_audit',
  // 权属登记-删除
  ASSET_OWNERR_DELETE: 'zcgl_asset_ownerr_delete',

  /**
   * 权证管理
   **/
  // 权证管理-新增权证管理单
  ASSET_ACM_NEW: 'zcgl_asset_acm_new',
  // 权证管理-编辑权证管理单
  ASSET_ACM_EDIT: 'zcgl_asset_acm_edit',
  // 权证管理-注销
  ASSET_ACM_DELETE: 'zcgl_asset_acm_delete',

  /**
  * 权属人管理
  **/
  // 权属人管理-新增
  PROPERTY_OWNER_NEW: 'zcgl_property_owner_new',
  // 权属人管理-编辑
  PROPERTY_OWNER_EDIT: 'zcgl_property_owner_edit',
  // 权属人管理-删除
  PROPERTY_OWNER_DELETE: 'zcgl_property_owner_delete',

  /**
  * 资产入账
  **/
  // 资产入账-新增
  ASSET_ENTRY_NEW: 'zcgl_asset_entry_new',
  // 资产入账-编辑
  ASSET_ENTRY_EDIT: 'zcgl_asset_entry_edit',
  // 资产入账-审核
  ASSET_ENTRY_AUDIT: 'zcgl_asset_entry_audit',
  // 资产入账-反审核
  ASSET_ENTRY_REVERSE_AUDIT: 'zcgl_asset_entry_reverse_audit',
  // 资产入账-删除
  ASSET_ENTRY_DELETE: 'zcgl_asset_entry_delete',
  /**
   * 权属概况
   */
  // 资产项目权属设置
  ASSET_PROOWNERSHIP_SET: 'zcgl_proownership_set',
  // 资产权属详情
  ASSET_OWNERSHIP_SET: 'zcgl_ownership_detail',

  /**
  * 资产价值登记AWR（asset_worth_register）
  **/
  // 资产价值登记-新增
  ASSET_AWR_ADD: 'zcgl_awr_add',
  // 资产价值登记-编辑
  ASSET_AWR_EDIT: 'zcgl_awr_edit',
  // 资产价值登记-审核
  ASSET_AWR_APPROVAL: 'zcgl_awr_approval',
  // 资产价值登记-删除
  ASSET_AWR_DELETE: 'zcgl_awr_delete',

  /**
  * 盘点任务
  **/
  // 盘点任务-生成盘点单
  ASSET_TASK_NEW: 'zcgl_task_new',
  // 盘点任务-盘点任务编辑
  ASSET_TASK_EDIT: 'zcgl_task_edit',
  // 盘点任务-盘点任务取消
  ASSET_TASK_DELETE: 'zcgl_task_delete',

  /**
  * 盘点执行
  **/
  // 盘点执行-登记盘点结果
  ASSET_EXECUTE_NEW: 'zcgl_execute_new',
 /**
  * 盘点报告
  */
  // 盘点报告-新建
  ASSET_INVENTORY_REPORT_NEW: 'zcgl_inventory_report_new',
  // 盘点报告-编辑
  ASSET_INVENTORY_REPORT_EDIT: 'zcgl_inventory_report_edit',
  // 盘点报告-删除
  ASSET_INVENTORY_REPORT_DELETE: 'zcgl_inventory_report_delete',
  // 盘点报告-审核
  ASSET_INVENTORY__REPORT_AUDIT: 'zcgl_inventory_report_audit',
  // 盘点报告-反审核
  ASSET_INVENTORY_REPORT_REVERSE_AUDIT: 'zcgl_inventory_report_reverse_audit',
  /**
   * 盘点计划
  */
  zcgl_plan_create: 'zcgl_plan_create',
  zcgl_plan_edit: 'zcgl_plan_edit',
  zcgl_plan_delete: 'zcgl_plan_delete',
  zcgl_plan_reverseapply: 'zcgl_plan_reverseapply',
  /**
   * 处置登记
   */
 zcgl_dengji_create: 'zcgl_dengji_create',
 zcgl_dengji_edit: 'zcgl_dengji_edit',
 zcgl_dengji_delete: 'zcgl_dengji_delete',
 zcgl_dengji_reverseapply: 'zcgl_dengji_reverseapply',
   /**
    * 呈报任务管理
    */
 // 呈报任务管理-呈报任务-新增
 RM_TASK_NEW: 'rm_task_new',
 /**
  * 附属配套管理
  */
 ASSET_CREATE_SUBSI: 'asset_create_subsi', // 新建附属配套
 ASSET_EDIT_SUBSI: 'asset_edit_subsi', // 编辑附属配套
 ASSET_STATUS_SUBSI: 'asset_status_subsi', // 附属配套状态改变
 ASSET_DELETE_SUBSI: 'asset_delete_subsi', // 删除附属配套
 /**
  * 呈报记录一览表
 */
ASSET_REPORT_OPERATE: 'asset_report_operate', // 呈报记录运营
ASSET_REPORT_INCOME: 'asset_report_income', // 呈报记录收入
ASSET_REPORT_DEPRECIA: 'asset_report_deprecia', // 呈报记录折旧
ASSET_REPORT_COST: 'asset_report_cost', // 呈报记录费用
  /**
 * 呈报计划
 */
  // 呈报计划-新建
  zcgl_submit_plans_new: 'zcgl_submit_plans_new',
  // 呈报计划-编辑
  zcgl_submit_plans_edit: 'zcgl_submit_plans_edit',
  // 呈报计划-删除
  zcgl_submit_plans_delete: 'zcgl_submit_plans_delete',
  // 呈报计划-审核
  zcgl_submit_plans_audit: 'zcgl_submit_plans_audit',
  // 呈报计划-反审核
  zcgl_submit_plans_reverse_audit: 'zcgl_submit_plans_reverse_audit',
}

