// 巡检记录  保养记录
export const Inspection = [
  {
    title: '任务单号',
    dataIndex: 'serviceOrderId',
    key: 'serviceOrderId',
    width: 160,
  },
  {
    title: '任务生成时间',
    dataIndex: 'dealTime',
    key: 'dealTime',
  },
  {
    title: '所属计划名称',
    dataIndex: 'dtPlanName',
    key: 'dtPlanName',
  },
  {
    title: '所属计划ID',
    dataIndex: 'dtPlanId',
    key: 'dtPlanId',
  },
  {
    title: '所属设备分组名称',
    dataIndex: 'dtTemplateName',
    key: 'dtTemplateName',
  },
  {
    title: '所属设备分组ID',
    dataIndex: 'dtTemplateId',
    key: 'dtTemplateId',
  },
  {
    title: '执行人',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '计划开始时间',
    dataIndex: 'planBeginTime',
    key: 'planBeginTime',
  },
  {
    title: '计划结束时间',
    dataIndex: 'planEndTime',
    key: 'planEndTime',
  },
  {
    title: '实际开始时间',
    dataIndex: 'beginTime',
    key: 'beginTime',
  },
  {
    title: '实际结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '触发方式',
    dataIndex: 'triggerMode',
    key: 'triggerMode',
  },
  {
    title: '抽查状态',
    dataIndex: 'snapCheckStatus',
    key: 'snapCheckStatus',
  },
  {
    title: '执行状态',
    dataIndex: 'statusName',
    key: 'statusName',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    fixed: 'right',
    width: 150,
  },
];
// 报障记录
export const guarantee = [
  {
    title: '工单号',
    dataIndex: 'serviceOrderId',
    key: 'serviceOrderId',
    width: '20%',
  },
  {
    title: '工单生成时间',
    dataIndex: 'dtCrtTime',
    key: 'dtCrtTime',
    width: '20%',
  },
  {
    title: '提单人',
    dataIndex: 'userName',
    key: 'userName',
    width: '20%',
  },
  {
    title: '处理人',
    dataIndex: 'oprUserName',
    key: 'oprUserName',
    width: '20%',
  },
  {
    title: '完成时间',
    dataIndex: 'actualTime',
    key: 'actualTime',
    width: '20%',
  },
];

export const checkColumns = [
  {
    title: '检查项名称',
    dataIndex: 'attrName',
    key: 'attrName',
    align: 'center',
  },
  {
    title: '填写值',
    dataIndex: 'attrValueName',
    key: 'attrValueName',
    align: 'center',
    scopedSlots: { customRender: 'attrValueName' },
  },
];
