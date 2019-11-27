// 首次登记 变更登记
export const register = [{
  title: '资产名称',
  dataIndex: 'assetName',
  width: '15%'
}, {
  title: '资产编码',
  dataIndex: 'assetCode',
  width: '10%'
}, {
  title: '资产类型',
  dataIndex: 'assetTypeName',
  width: '10%'
}, {
  title: '所在位置',
  dataIndex: 'address',
  width: '10%'
}, {
  title: '分类',
  dataIndex: 'assetCategoryName',
  width: '10%'
}, {
  title: '用途',
  dataIndex: 'assetUse',
  width: '10%'
}, {
  title: '建筑面积(㎡)',
  dataIndex: 'communityName',
  width: '10%'
}, {
  title: '交付物业面积(㎡)',
  dataIndex: 'transferArea',
  align: 'center',
  scopedSlots: { customRender: 'transferArea' }
},  {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' }
}]

// 注销登记
export const cancellation = [{
  title: '资产名称',
  dataIndex: 'assetName',
  width: '15%'
}, {
  title: '资产编码',
  dataIndex: 'assetCode',
  width: '10%'
}, {
  title: '所在位置',
  dataIndex: 'address',
  width: '10%'
}, {
  title: '分类',
  dataIndex: 'assetCategoryName',
  width: '10%'
}, {
  title: '用途',
  dataIndex: 'assetUse',
  width: '10%'
}, {
  title: '建筑面积(㎡)',
  dataIndex: 'communityName',
  width: '10%'
}, {
  title: '交付运营面积(㎡)',
  dataIndex: 'transferOperationArea',
  align: 'center',
  scopedSlots: { customRender: 'transferOperationArea' }
},  {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' }
}]
