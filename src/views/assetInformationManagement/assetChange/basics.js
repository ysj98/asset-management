export const realEstatecolumns = [{
  title: '查验对象',
  dataIndex: 'inspectionObjectName',
  width: '15%'
}, {
  title: '专业分类',
  dataIndex: 'professionalCategoryName',
  width: '23%'
}, {
  title: '所在位置',
  dataIndex: 'entityPosition',
  width: '10%'
}, {
  title: '实物名称',
  dataIndex: 'inspectionInstName',
  width: '10%'
}, {
  title: '实物状态',
  dataIndex: 'instStatusName',
  width: '10%'
}, {
  title: '项目',
  dataIndex: 'communityName',
  width: '10%'
}, {
  title: '验收状态',
  dataIndex: 'acceptStatusName',
  width: '8%'
},  {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' }
}]
