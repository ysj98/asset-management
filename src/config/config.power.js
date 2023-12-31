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
  DOWNLOADCENTER_DOWNLOAD: 'c_download_file_download_001',
};

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
  // 资产分类-车场tab
  ASSET_CLASS_TAB_PARK: 'asset_class_tab_park',
  // 资产分类-设备设施tab
  ASSET_CLASS_TAB_EQ: 'asset_class_tab_eq',
  // 资产分类-土地tab
  ASSET_CLASS_TAB_LAND: 'asset_class_tab_land',
  // 资产分类-房间tab
  ASSET_CLASS_TAB_HOUSE: 'asset_class_tab_house',
  // 楼盘字典-车场tab
  ASSET_SOURCE_TAB_PARK: 'asset_source_tab_park',
  // 楼盘字典-车位tab
  ASSET_SOURCE_TAB_PARK_ITEM: 'asset_source_tab_park_item',
  // 楼盘字典-房间tab
  ASSET_SOURCE_TAB_HOUSE: 'asset_source_tab_house',
  // 楼盘字典-楼栋tab
  ASSET_SOURCE_TAB_BUILD: 'asset_source_tab_build',
  // 楼盘字典-土地tab
  ASSET_SOURCE_TAB_LAND: 'asset_source_tab_land',
  // 楼盘字典-设备设施tab
  ASSET_SOURCE_TAB_EQ: 'asset_source_tab_eq',
  // 资产分类-设备设施保存
  ASSET_CLASS_SET_EQ: 'asset_class_set_eq',
  // 资产分类-编辑资产分类信息
  ASSET_CLASS_SET_EDIT: 'zcgl_asset_class_set_edit',
  // 资产分类-启用/停用资产分类信息(状态)
  ASSET_CLASS_SET_CHANGE_STATUS: 'zcgl_asset_class_set_change_status',
  // 资产分类-新增土地
  ASSET_CLASS_LAND_CREATE: 'asset_class_land_create',
  // 资产分类-编辑土地
  ASSET_CLASS_LAND_EDIT: 'asset_class_land_edit',
  // 资产分类-状态改变土地
  ASSET_CLASS_LAND_CHANGE: 'asset_class_land_change',
  // 资产分类-状态删除土地
  ASSET_CLASS_LAND_DELETE: 'asset_class_land_delete',
  // 资产分类-新增车场
  ASSET_CLASS_CAR_PARK_CREATE: 'asset_class_car_park_create',
  // 资产分类-编辑车场
  ASSET_CLASS_CAR_PARK_EDIT: 'asset_class_car_park_edit',
  // 资产分类-状态改变车场
  ASSET_CLASS_CAR_PARK_CHANGE: 'asset_class_car_park_change',
  // 资产分类-状态删除车场
  ASSET_CLASS_CAR_PARK_DELETE: 'asset_class_car_park_delete',

  /* 
  楼盘字典
   */
  // 楼盘字典-新增房间
  ASSET_ADD_HOUSE: 'zcgl_add_house',
  // 楼盘字典-编辑房间
  ASSET_EDIT_HOUSE: 'zcgl_edit_house',
  // 楼盘字典-房间资料导入
  ASSET_HOUSEZL_IN: 'zcgl_housezl_in',
  // 楼盘字典-房间资料批量导入
  ASSET_BATCH_HOUSEZL_IN: 'zcgl_batch_housezl_in',
  // 楼盘字典-房间导入批量更新
  ASSET_HOUSE_IN: 'zcgl_house_in',
  // 楼盘字典-房间导出
  ASSET_HOUSE_OUT: 'zcgl_house_out',
  // 楼盘字典-房间状态
  ASSET_HOUSE_STATE: 'zcgl_house_state',
  // 楼盘字典-新建楼栋
  ASSET_BUILD_ADD: 'zcgl_build_add',
  // 楼盘字典-批量导入楼栋
  ASSET_BATCH_BUILD_ADD: 'zcgl_batch_build_add',
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
  // 楼盘字典-创建土地
  ASSET_DICT_LAND_CREATE: 'zcgl_dict_land_create',
  // 楼盘字典-修改土地
  ASSET_DICT_LAND_EDIT: 'zcgl_dict_land_edit',
  // 楼盘字典-删除土地
  ASSET_DICT_LAND_DELETE: 'zcgl_dict_land_delete',
  // 楼盘字典-土地批量导入
  ASSET_DICT_LAND_IMPORT: 'zcgl_dict_land_import',
  // 楼盘字典-创建车场
  ASSET_DICT_PARK_CREATE: 'zcgl_dict_park_create',
  // 楼盘字典-修改车场
  ASSET_DICT_PARK_EDIT: 'zcgl_dict_park_edit',
  // 楼盘字典-删除车场
  ASSET_DICT_PARK_DELETE: 'zcgl_dict_park_delete',
  // 楼盘字典-创建车位
  ASSET_DICT_STALL_CREATE: 'zcgl_dict_stall_create',
  // 楼盘字典-批量导入车位
  ASSET_DICT_STALL_IMPORT: 'zcgl_dict_stall_import',
  // 楼盘字典-修改车位
  ASSET_DICT_STALL_EDIT: 'zcgl_dict_stall_edit',
  // 楼盘字典-删除车位
  ASSET_DICT_STALL_DELETE: 'zcgl_dict_stall_delete',
  // 楼盘字典-创建设备
  ASSET_DICT_EQUIPMENT_CREATE: 'zcgl_dict_equipment_create',
  // 楼盘字典-修改设备
  ASSET_DICT_EQUIPMENT_EDIT: 'zcgl_dict_equipment_edit',
  // 楼盘字典-删除设备
  ASSET_DICT_EQUIPMENT_DELETE: 'zcgl_dict_equipment_delete',

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
  // 资产登记-编辑登记单
  ASSET_REGISTER_EDIT: 'zcgl_asset_register_edit',
  // 资产登记-审核
  ASSET_REGISTER_AUDIT: 'zcgl_asset_register_audit',
  // 资产登记-反审核
  ASSET_REGISTER_REVERSE_AUDIT: 'zcgl_asset_register_reverse_audit',
  // 资产登记-新增登记单
  ASSET_REGISTER_NEW: 'zcgl_asset_register_new',
  // 资产登记-单条资产登记
  ASSET_REGISTER_NEW_ONE: 'zcgl_asset_register_new_one',
  // 资产登记-删除
  ASSET_REGISTER_DELETE: 'zcgl_asset_register_delete',
  // 资产登记-登记基础信息
  ASSET_REGISTER_BASIC: 'zcgl_asset_register_basicInformation',
  // 资产登记-登记附属配套
  ASSET_REGISTER_ACCESSORY: 'zcgl_asset_register_registrationAccessory',
  // 资产登记-登记价值信息
  ASSET_REGISTER_REGISTERED: 'zcgl_asset_register_registeredInformation',
  // 资产登记-登记使用方向
  ASSET_REGISTER_DIRECTION: 'zcgl_asset_register_registerDirections',
  // 资产登记-登记相关费用
  ASSET_REGISTER_FEES: 'zcgl_asset_register_registrationFees',
  // 资产登记-核实
  ASSET_REGISTER_VERIFY: 'zcgl_asset_register_verify',
  // 资产登记-撤销核实
  ASSET_REGISTER_UNDOCHECK: 'zcgl_asset_register_undoCheck',
  // 资产登记-批量导入
  BATCH_INPUT: 'zcgl_asset_batch_input',

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
  // 资产项目管理-导入
  ASSET_APM_INPORT: 'zcgl_apm_import',

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
  // 权属登记-注销
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
  // 权证管理-导出
  ASSET_ACM_EXPORT: 'zcgl_asset_acm_export',
  // 权证管理-导入
  ASSET_ACM_INPORT: 'zcgl_asset_acm_inport',
  // 权证管理-列表字段自定义
  ASSET_ACM_SETTING: 'zcgl_asset_acm_setting',
  // 权证管理-自定义标签
  zcgl_asset_acm_custom_labels: 'zcgl_asset_acm_custom_labels',

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
  // 资产入账-导出
  ASSET_ENTRY_EXPORT: 'zcgl_asset_entry_export',
  // 资产入账-导入
  ASSET_ENTRY_INPORT: 'zcgl_asset_entry_inport',
  // 资产入账-批量提交
  ASSET_ENTRY_BATCH_SUBMISSION: 'zcgl_asset_batch_submission',

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
  // 价值登记导入 v2.06
  ASSET_AWR_IMPORT: 'zcgl_awr_import',

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
  // 盘点执行-登记盘点结果-导出资产清单
  ASSET_EXECUTE_LISTASSETS: 'zcgl_execute_listAssets',
  // 盘点执行-登记盘点结果-导出异常信息
  ASSET_EXECUTE_EXCEPTION: 'zcgl_execute_exception',

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
  // 盘点报告-导出
  ASSET_INVENTORY_REPORT_EXPORT: 'zcgl_inventory_report_export',

  /**
   * 盘点计划
   */
  zcgl_plan_create: 'zcgl_plan_create',
  zcgl_plan_edit: 'zcgl_plan_edit',
  zcgl_plan_delete: 'zcgl_plan_delete',
  zcgl_plan_reverseapply: 'zcgl_plan_reverseapply',

  /*
   * 处置一览表
   */
  czyl_zzjgst_dc: 'czyl_zzjgst_dc', // 组织机构视图导出
  czyl_zcst_dc: 'czyl_zcst_dc', // 资产视图导出
  czyl_zcst_gx: 'czyl_zcst_gx', // 更新办证状态

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
  RM_TASK_NEW: 'asset_rm_task_new',

  /**
   * 附属配套管理
   */
  ASSET_CREATE_SUBSI: 'asset_create_subsi', // 新建附属配套
  ASSET_EDIT_SUBSI: 'asset_edit_subsi', // 编辑附属配套
  ASSET_STATUS_SUBSI: 'asset_status_subsi', // 附属配套状态改变
  ASSET_DELETE_SUBSI: 'asset_delete_subsi', // 删除附属配套
  ASSET_EXPORT_SUBSI: 'asset_export_subsi', // 导出附属配套

  /**
   * 呈报记录一览表
   */
  ASSET_REPORT_OPERATE: 'asset_report_operate', // 呈报记录运营
  ASSET_REPORT_INCOME: 'asset_report_income', // 呈报记录收入
  ASSET_REPORT_DEPRECIA: 'asset_report_deprecia', // 呈报记录折旧
  ASSET_REPORT_COST: 'asset_report_cost', // 呈报记录费用

  // 导出权限
  ASSET_OPERATING_EXPORT: 'asset_operating_export', // 资产运营
  ASSET_INCOME_EXPORT: 'asset_income_export', // 资产收入
  ASSET_COST_EXPORT: 'asset_cost_export', // 资产费用
  ASSET_DEPRECIATION_EXPORT: 'asset_depreciation_export', // 折旧

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

  /**
   * 资产入库
   */
  ASSET_IN_CREATE: 'asset_in_create', // 新建
  ASSET_IN_EDIT: 'asset_in_edit', // 编辑
  ASSET_IN_APPROVE: 'asset_in_approve', // 审批
  ASSET_IN_DELETE: 'asset_in_delete', // 删除
  ASSET_IN_ANTIAUDIT: 'asset_in_antiaudit', // 反审核
  ASSET_IN_EXPORT: 'asset_in_export', // 资产出库一览表导出
  ASSET_IN_SET_TABLE_HEADER: 'asset_in_set_table_header', // 资产出库一览表 列表设置!!!

  /**
   * V2.0.2资产入库一览表
   */
  ASSET_IN_VIEW_EXPORT: 'asset_in_view_export', // 导出
  ASSET_IN_VIEW_TABLE_HEADER: 'asset_in_view_table_header', // 资产入库一览表 列表设置！！！

  /**
   * V2.0.2资产登记一览表
   */
  ASSET_REGISTER_VIEW_EXPORT: 'asset_register_view_export', // 导出
  ASSET_REGISTER_SET_TABLE_HEADER: 'asset_register_set_table_header', // 资产登记一览表 列表设置

  /**
   * V2.0.2报表管理
   */
  TM_AW_EXPORT: 'table_manage_asset_worth_export', // 报表管理-资产价值统计导出
  TM_AW_HEADERS_SETTING: 'table_manage_asset_worth_set_headers', // 报表管理-资产价值统计表头设置
  TM_AP_EXPORT: 'table_manage_asset_project_export', // 报表管理-资产项目数据查询导出
  TM_AP_HEADERS_SETTING: 'table_manage_asset_project_set_headers', // 报表管理-资产项目数据查询表头设置
  TM_HA_EXPORT: 'table_manage_house_asset_export', // 报表管理-有证房屋资产导出
  TM_HA_HEADERS_SETTING: 'tm_ha_headers_setting', // 报表管理-有证房屋资产统计标 表头设置
  TM_OA_EXPORT: 'table_manage_ownership_amount_export', // 报表管理-权证数量统计导出
  TM_OL_EXPORT: 'table_manage_ownership_list_export', // 报表管理-权属证件一览表导出
  TM_OL_TABLE_HEADERS_SETTING: 'table_manage_ownership_set_table_headers', // 报表管理-权属证件一览表列表设置
  TM_AA_EXPORT: 'table_manage_asset_analysis_export', // 报表管理-房屋资产统计分析列表导出

  /**
   * V2.0.2房屋台账
   */
  HOUSE_ACCOUNT_AP_EXPORT: 'house_account_asset_project_export', // 房屋台账-资产项目视图导出
  HOUSE_ACCOUNT_BV_EXPORT: 'house_account_building_view_export', // 房屋台账-楼栋视图导出
  HOUSE_ACCOUNT_AV_EXPORT: 'house_account_asset_view_export', // 房屋台账-资产视图列表导出
  HOUSE_ACCOUNT_AVD_EXPORT: 'house_account_asset_view_detail_export', // 房屋台账-资产视图详情导出
  HOUSE_ACCOUNT_OV_EXPORT: 'house_account_organ_view_export', // 房屋台账-组织机构视图导出
  HOUSE_ACCOUNT_BV_ASSET_LABEL: 'house_account_bv_asset_label', // 房屋台账-楼栋视图资产标签
  HOUSE_ACCOUNT_AV_ASSET_LABEL: 'house_account_av_asset_label', // 房屋台账-房屋资产视图资产标签
  HOUSE_ACCOUNT_AV_ASSET_PLEDGE: 'house_account_av_asset_pledge', // 房屋台账-房屋资产视图质押情况
  HOUSE_ACCOUNT_AV_ASSET_REMARK: 'house_account_av_asset_remark', // 房屋台账-房屋资产视图资产备注

  /**
   * V2.0.2资产入库
   */
  ASSET_IN_LIST_EXPORT: 'asset_in_list_export', // 资产入库列表-导出
  ASSET_IN_LIST_REGISTER: 'asset_in_list_register', // 资产入库列表-入库登记

  /**
   * V2.0.2价值登记
   */
  WORTH_REGISTER_RECORD_EXPORT: 'worth_register_record_export', // 资产估值记录导出
  WORTH_REGISTER_LIST_EXPORT: 'worth_register_list_export', // 价值一览表导出
  WORTH_REGISTER_ASSET_EXPORT: 'worth_register_asset_export', // 资产登记列表导出

  /**
   * V2.0.2权属登记一览表
   */
  ASSET_REGISTERVIEW_EXPORT: 'asset_registerview_export', // 权属登记一览表

  /**
   * V2.0.2资产分类
   */
  ASSET_CLASS_LAND_EXPORT: 'asset_class_land_export ', // 资产分类土地列表导出
  ASSET_CLASS_HOUSE_EXPORT: 'asset_class_house_export ', // 资产分类房屋列表导出

  /**
   * 权属人管理
   **/
  PROPERTY_OWNER_EXPORT: 'property_owner_export', // 权属人管理-导出
  PROPERTY_OWNER_INPORT: 'property_owner_inport', // 权属人管理-导入
  /**
   * 权属概况
   */
  ASSET_PROOWNERSHIP_ORGAN_EXPORT: 'proownership_organ_export', // 权属概况-组织机构权属列表-导出
  ASSET_OWNERSHIP_ITEMS_EXPORT: 'asset_ownership_items_export', // 权属概况-资产项目权属属列表-导出
  ASSET_OWNERSHIP_OPT_EXPORT: 'asset_ownership_opt_export', // 权属概况-资产权属属列表-导出

  /**
   * 资产变更一览表
   */
  ASSET_CHANGE_LIST_EXPORT: 'asset_change_list_export', // 资产变更一览表-导出

  /**
   * V2.0.2土地台账
   */
  LAND_PROJECT_EXPORT: 'land_project_export', // 土地台账资产项目列表导出
  LAND_ORGAN_EXPORT: 'land_organ_export', // 土地台账资产项目列表导出,
  LAND_ASSET_VIEW_EXPORT: 'land_asset_view_export', //土地台账 资产视图列表导出
  LAND_ACCOUNT_AV_ASSET_LABEL: 'land_account_asset_label', // 土地台账-土地资产视图资产标签

  /**
   * 2.0.2
   */
  ASSET_BUILDLAND_EXPORT: 'asset_buildland_export', // 楼盘字典土地导出

  /**
   * 2.0.2 异常管理
   */
  EXCEPTION_MANAGE_EXPORT: 'exception_manage_export', // 异常管理导出

  /**
   * 资产交付管理
   */
  ASSET_DELIVERY_NEW: 'asset_delivery_new', // 资产交付新建
  ASSET_DELIVERY_EDIT: 'asset_delivery_edit', // 资产交付编辑
  ASSET_DELIVERY_EXPORT: 'asset_delivery_export', // 资产交付导出
  ASSET_DELIVERY_AUDIT: 'asset_delivery_audit', // 资产交付审批
  ASSET_DELIVERY_DELETE: 'asset_delivery_delete', // 资产交付删除
  ASSET_DELIVERY_REVERSE_AUDIT: 'asset_delivery_reverse_audit', // 资产交付反审批
  ASSET_DELIVERY_end: 'asset_delivery_end', // 资产交付结束交付

  /**
   * 房屋资产&资源统计表
   */
  ASSET_RESOURCE_STATISTICS_EXPORT: 'asset_resource_statistics_export', // 房屋资产&资源统计表
  ASSET_RESOURCE_DETAIL_EXPORT: 'asset_resource_detail_export', // 房屋资产&资源统计表-资产明细

  /**
   * 资产交付记录
   */
  ASSET_DELIVERY_RECORD: 'asset_delivery_record', // 资产交付记录导出

  /**
   * 2.0.7 资产出租
   */
  ASSET_RENT_REGISTER: 'asset_rent_register', // 出租登记导出
  ASSET_EARNINGS_REGISTER: 'asset_earnings_register', // 出租收益登记导出
  INVEST_EARNINGS_REGISTER: 'invest_earnings_register', // 投资收益登记导出
  RENT_FORM_EDIT: 'rent_form_edit', // 出租单编辑
  RENT_FORM_NEW: 'rent_form_new', // 出租单新建
  RENT_FORM_DELETE: 'rent_form_delete', // 出租单删除
  RENT_FORM_APPROVE: 'rent_form_approve', // 出租单审批
  RENT_FORM_REVERSE_AUDIT: 'rent_form_reverse_audit', // 出租单反审核
  ASSET_RENT_VIEW_EXPORT: 'asset_rent_view_export', // 出租登记一览表导出
  RENT_INCOME_EDIT: 'rent_income_edit', // 出租收益编辑
  RENT_INCOME_NEW: 'rent_income_new', // 出租收益新建
  RENT_INCOME_DELETE: 'rent_income_delete', // 出租收益作废
  INVEST_INCOME_NEW: 'invest_income_new', // 投资收益新建
  INVEST_INCOME_EDIT: 'invest_income_edit', // 投资收益编辑
  INVEST_INCOME_DELETE: 'invest_income_delete', // 投资收益作废
  ASSET_REPAIR_REGISTER: 'asset_repair_register', // 维修登记导出
  REPAIR_FORM_NEW: 'repair_form_new', // 维修单新建
  REPAIR_FORM_DELETE: 'repair_form_delete', // 维修单删除
  REPAIR_FORM_APPROVE: 'repair_form_approve', // 维修单审批
  REPAIR_FORM_REVERSE_AUDIT: 'repair_form_reverse_audit', // 维修单反审核
  REPAIR_FORM_EDIT: 'repair_form_edit', // 维修单编辑

  /**
   * 2.0.7 资产投资
   */
  ASSET_INVEST_VIEW_EXPORT: 'asset_invest_view_export', // 资产投资一览表导出
  INVEST_FORM_NEW: 'invest_form_new', // 投资单新建
  INVEST_FORM_EDIT: 'invest_form_edit', // 投资单编辑
  INVEST_FORM_DELETE: 'invest_form_delete', // 投资单删除
  INVEST_FORM_APPROVE: 'invest_form_approve', // 投资单审批
  // INVEST_FORM_DETAIL: 'invest_form_detail',  // 投资单详情
  INVEST_FORM_REVERSE_AUDIT: 'invest_form_reverse_audit', // 投资单反审核
  ASSET_INVEST_REGISTER: 'asset_invest_register', // 投资登记导出

  /**
   * 2.0.7 资产领用
   */
  APPLY_FORM_NEW: 'apply_form_new', // 领用单新建
  APPLY_FORM_EDIT: 'apply_form_edit', // 领用单编辑
  APPLY_FORM_DELETE: 'apply_form_delete', // 领用单删除
  APPLY_FORM_APPROVE: 'apply_form_approve', // 领用单审批
  ASSET_APPLY_REGISTER: 'asset_apply_register', // 领用登记导出
  RETURN_FORM_NEW: 'return_form_new', // 归还单新建
  RETURN_FORM_EDIT: 'return_form_edit', // 归还单编辑
  RETURN_FORM_DELETE: 'return_form_delete', // 归还单删除
  RETURN_FORM_APPROVE: 'return_form_approve', // 归还单审批
  ASSET_RETURN_REGISTER: 'asset_return_register', // 归还登记导出
  ASSET_APPLY_VIEW_EXPORT: 'asset_apply_view_export', // 资产领用一览表导出
  ASSET_RETURN_VIEW_EXPORT: 'asset_return_view_export', // 资产归还一览表导出

  /**
   * 资产领用
   */
  PATROL_RECORD_NEW: 'patrol_record_new', // 巡查记录单新建
  PATROL_RECORD_EDIT: 'patrol_record_edit', // 巡查记录单编辑
  PATROL_RECORD_DELETE: 'patrol_record_delete', // 巡查记录单删除
  PATROL_RECORD_EXPORT: 'patrol_record_export', // 巡查记录导出

  /**
   * 房屋资产信息详情中的其它信息tab页签权限管理
   */
  power_ownInfo: 'power_ownInfo', // 权属信息页签
  power_receiveInfo: 'power_receiveInfo', // 接管信息页签
  power_changeInfo: 'power_changeInfo', // 权属信息页签
  power_billInfo: 'power_billInfo', // 账面信息页签
  power_patrolRecord: 'power_patrolRecord', // 巡查记录页签
  power_accessoryInfo: 'power_accessoryInfo', // 附属&配套页签
  power_disposeInfo: 'power_disposeInfo', // 资产信息页签
  power_relatedExpenses: 'power_relatedExpenses', // 相关费用页签
  power_archive: 'power_archive', // 档案文件页签
  power_operationInformation: 'power_operationInformation', // 运营信息页签

  /**
   * 土地资产信息详情中的其它信息tab页签权限管理
   */
  power_land_ownInfo: 'power_land_ownInfo', // 权属信息页签
  power_land_receiveInfo: 'power_land_receiveInfo', // 接管信息页签
  power_land_changeInfo: 'power_land_changeInfo', // 权属信息页签
  power_land_billInfo: 'power_land_billInfo', // 账面信息页签
  power_land_patrolRecord: 'power_land_patrolRecord', // 巡查记录页签
  power_land_accessoryInfo: 'power_land_accessoryInfo', // 附属&配套页签
  power_land_disposeInfo: 'power_land_disposeInfo', // 资产信息页签
  power_land_relatedExpenses: 'power_land_relatedExpenses', // 相关费用页签
  power_land_archive: 'power_land_archive', // 档案文件页签
  power_land_operationInformation: 'power_land_operationInformation', // 运营信息页签

  /**
   * 车场资产视图详情中的其它信息tab页签权限管理
   */
  power_car_ownInfo: 'power_car_ownInfo', // 权属信息页签
  power_car_receiveInfo: 'power_car_receiveInfo', // 接管信息页签
  power_car_changeInfo: 'power_car_changeInfo', // 权属信息页签
  power_car_billInfo: 'power_car_billInfo', // 账面信息页签
  power_car_patrolRecord: 'power_car_patrolRecord', // 巡查记录页签
  power_car_accessoryInfo: 'power_car_accessoryInfo', // 附属&配套页签
  power_car_disposeInfo: 'power_car_disposeInfo', // 资产信息页签
  power_car_relatedExpenses: 'power_car_relatedExpenses', // 相关费用页签
  power_car_archive: 'power_car_archive', // 档案文件页签
  power_car_operationInformation: 'power_car_operationInformation', // 运营信息页签

  /**
   * 资产条码 & 条码管理
   */
  BARCODE_SETTING_SAVE: 'barCode_setting_save', // 资产管理————保存
  BARCODE_MANAGEMENT_PRINT: 'barCode_management_print', // 条码管理————条码打印
  BARCODE_MANAGEMENT_EXPORT: 'barCode_management_export', // 条码管理————导出
  BARCODE_MANAGEMENT_UPDATE: 'barCode_management_update', // 条码管理————批量更新
  BARCODE_MANAGEMENT_EDIT: 'barCode_management_edit', // 条码管理————编辑标签

  /*
   * 土地地图绘制
   * */
  DRAW_LAND_MAP_ADD_METHOD: 'draw_land_add_method', // 新增方案
  DRAW_LAND_MAP_UPLOAD_IMAGE: 'draw_land_map_upload_image', // 上传背景图
  DRAW_LAND_MAP_DELETE_POLYGON: 'draw_land_map_delete_polygon', // 删除绘制
  DRAW_LAND_MAP_POPUP_SETTINGS: 'draw_land_map_popup_settings', // 浮层设定
  DRAW_LAND_MAP_SET_CENTER: 'draw_land_map_set_center', // 设置中心点

  /*
   * 资产转运营参数
   * */
  CHANGE_ASSET_OPERATION_ADD: 'change_asset_operation_add', // 新建
  CHANGE_ASSET_OPERATION_TAB_HOUSE: 'change_asset_operation_tab_house',
  CHANGE_ASSET_OPERATION_TAB_LAND: 'change_asset_operation_tab_land',
  CHANGE_ASSET_OPERATION_TAB_YARD: 'change_asset_operation_tab_yard',
  CHANGE_ASSET_OPERATION_TAB_EQUIPMENT: 'change_asset_operation_tab_equipment',

  /*
   * 资产转运营
   * */
  ASSET_OPERATING_ADD: 'asset_operating_add', // 新建转运营单
  ASSET_OPERATING_EXPORT_FILE: 'asset_operating_export_file', // 导出
  ASSET_OPERATING_EDIT: 'asset_operating_edit', // 编辑
  ASSET_OPERATING_DEL: 'asset_operating_del', // 删除
  ASSET_OPERATING_APPROVE: 'asset_operating_approve', // 审批

  /*
   * 资产转运营一览表
   * */
  ASSET_OPERATING_VIEW_EXPORT_FILE: 'asset_operating_view_export_file', // 导出

  /**
   * 基础信息管理 -> 自定义编码设置
   */
  CUSTOM_CODE_LAND_ADD: 'custom_code_land_add', // 新增
  CUSTOM_CODE_LAND_EDIT: 'custom_code_land_edit', // 编辑
  CUSTOM_CODE_LAND_CHANGE: 'custom_code_land_change', // 状态变化

  /**
   * 基础信息管理 -> 资产经营方式
   */
  ASSET_FUNCTION_EDIT: 'asset_function_edit', // 编辑
  ASSET_FUNCTION_CHANGE: 'asset_function_change', // 状态变化

  /**
   * 基础信息管理 -> 资产业务信息
   */
  ASSET_BILL_MANAGEMENT_LAND_EXPORT: 'asset_bill_management_land_export', // 导出
  ASSET_BILL_MANAGEMENT_LAND_LIST_CONFIG: 'asset_bill_management_land_list_config', // 列表设置
  ASSET_BILL_MANAGEMENT_LAND_DOWNLOAD: 'asset_bill_management_land_download', // 下载模板
  ASSET_BILL_MANAGEMENT_LAND_EXPORT_BILL: 'asset_bill_management_land_export_bill', // 导入业务信息
  ASSET_BILL_MANAGEMENT_LAND_EDIT: 'asset_bill_management_land_edit', // 编辑

  /*
   * 资产转让
   * /
  /*
   * 基础信息管理 -> 资产业务信息
   */
  ASSET_TRANSFER_ADD: 'asset_transfer_add', // 新增
  ASSET_TRANSFER_EDIT: 'asset_transfer_edit', // 编辑
  ASSET_TRANSFER_APPROVE: 'asset_transfer_approve', // 审批
  ASSET_TRANSFER_ANTI_APPROVE: 'asset_transfer_anti_approve', // 反审核
  ASSET_TRANSFER_DEL: 'asset_transfer_del', // 删除

  /*
   * 资产转让立项
   */
  ASSET_TRANSFER_ADD_PROJECT: 'asset_transfer_add_project', // 新增
  ASSET_TRANSFER_EDIT_PROJECT: 'asset_transfer_edit_project', // 编辑
  ASSET_TRANSFER_APPROVE_PROJECT: 'asset_transfer_approve_project', // 审批
  ASSET_TRANSFER_ANTI_APPROVE_PROJECT: 'asset_transfer_anti_approve_project', // 反审核
  ASSET_TRANSFER_DEL_PROJECT: 'asset_transfer_del_project', // 删除
  ASSET_TRANSFER_EXPORT_PROJECT: 'asset_transfer_export_project', // 导出

  /*
   * 资产调拨
   */
  asset_allot_add: 'asset_allot_add', // 新增
  asset_allot_edit: 'asset_allot_edit', // 编辑
  asset_allot_approve: 'asset_allot_approve', // 审批
  asset_allot_opposeApprove: 'asset_allot_opposeApprove', // 反审核
  asset_allot_delete: 'asset_allot_delete', // 删除
  asset_allot_export: 'asset_allot_export', // 导出

  /**
   * 车场台账
   */
  //组织机构视图
  CARPARK_ORGAN_VIEW_EXPORT: 'carpark_organ_view_export', // 导出
  // 车场项目视图
  CARPARK_PROJECT_VIEW_EXPORT: 'carpark_project_view_export', // 导出
  // 车场视图
  CARPARK_VIEW_EXPORT: 'carpark_view_export', // 导出
  CARPARK_VIEW_LABEL_SET: 'carpark_view_label_set', // 资产标签
  // 车场资产视图
  CARPARK_ASSET_VIEW_EXPORT: 'carpark_asset_view_export', // 导出
  CARPARK_ASSET_VIEW_HEADER_SET: 'carpark_asset_view_header_set', // 列表表头设置
  CARPARK_ASSET_VIEW_LABEL_SET: 'carpark_asset_view_label_set', // 资产标签

  /*
   * 设备设施台帐
   * */

  // 项目视图
  EQUIPMENTVIEW_PROJECT_VIEW_EXPORT: 'equipmentview_project_view_export', //导出

  // 资产视图
  EQUIPMENTVIEW_ASSET_VIEW_EXPORT: 'equipmentview_asset_view_export', // 导出
  EQUIPMENTVIEW_ASSET_VIEW_HEADERS_SETTING: 'equipmentview_asset_view_headers_setting', // 列表设置
  EQUIPMENTVIEW_ASSET_VIEW_LABELS_SETTING: 'equipmentview_asset_view_labels_setting', // 资产标签设置

  /**
   * 保险管理
   */
  insurance_asset_insurance_policy: 'insurance_asset_insurance_policy', // 资产保险单tab
  insurance_expiring_insurance: 'insurance_expiring_insurance', // 即将到期保险tab
  insurance_asset_insurance_schedule: 'insurance_asset_insurance_schedule', // 资产保险一览表tab
  INSURANCE_INSURANCE_POLICY_CREATE: 'insurance_insurance_policy_create', // 资产保险单新增
  INSURANCE_INSURANCE_POLICY_EXPORT: 'insurance_insurance_policy_export', // 资产一览表导出
  INSURANCE_INSURANCE_POLICY_EDIT: 'insurance_insurance_policy_edit', // 资产保险单编辑
  INSURANCE_INSURANCE_POLICY_DELETE: 'insurance_insurance_policy_delete', // 资产保险单删除

  //权证详情预览和下载权限
  AUTHORITY_MANA_PREVIEW: 'AUTHORITY_MANA_PREVIEW',
  AUTHORITY_MANA_DOWNLOAD: 'AUTHORITY_MANA_DOWNLOAD',
};
