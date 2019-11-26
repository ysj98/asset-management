// 交付物业
export const deliveryProperty = [{
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

// 交付运营
export const deliveryOperation = [{
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

// 使用方向变动
export const changeDirectionUse = [{
  title: '资产名称',
  dataIndex: 'assetName'
}, {
  title: '资产编码',
  dataIndex: 'assetCode'
}, {
  title: '所在位置',
  dataIndex: 'address'
}, {
  title: '分类',
  dataIndex: 'assetCategoryName'
}, {
  title: '用途',
  dataIndex: 'assetUse'
}, {
  title: '建筑面积(㎡)',
  dataIndex: 'communityName'
}, {
  title: '运营面积(㎡)',
  dataIndex: 'operationArea',
  align: 'center',
  scopedSlots: { customRender: 'operationArea' }
}, {
  title: '自用面积(㎡)',
  dataIndex: 'selfUserArea',
  align: 'center',
  scopedSlots: { customRender: 'selfUserArea' }
}, {
  title: '闲置面积(㎡)',
  dataIndex: 'idleArea',
  align: 'center',
  scopedSlots: { customRender: 'idleArea' }
}, {
  title: '占用面积(㎡)',
  dataIndex: 'occupationArea',
  align: 'center',
  scopedSlots: { customRender: 'occupationArea' }
}, {
  title: '其他面积(㎡)',
  dataIndex: 'otherArea',
  align: 'center',
  scopedSlots: { customRender: 'otherArea' }
}, {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' }
}]

// 资产项目变动
export const projectChange = [{
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
  title: '变动后资产项目',
  dataIndex: 'changeProjectId',
  align: 'center',
  scopedSlots: { customRender: 'changeProjectId' }
}, {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' }
}]

// 原值变动
export const variationOriginalValue = [{
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
  title: '变动前原值',
  dataIndex: 'oldOriginalValue',
  width: '10%'
}, {
  title: '变动后原值',
  dataIndex: 'newOriginalValue',
  align: 'center',
  scopedSlots: { customRender: 'newOriginalValue' }
}, {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' }
}]


// 位置变动
export const positionChange = [{
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
  title: '变动后位置',
  dataIndex: 'addressName',
  align: 'center',
  scopedSlots: { customRender: 'addressName' }
},  {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' }
}]