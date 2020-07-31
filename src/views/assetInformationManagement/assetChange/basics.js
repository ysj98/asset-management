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
  dataIndex: 'assetArea',
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
  title: '资产类型',
  dataIndex: 'assetTypeName',
  width: '10%'
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
  dataIndex: 'assetArea',
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
  title: '资产类型',
  dataIndex: 'assetTypeName',
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
  dataIndex: 'assetArea'
}, {
  title: '运营面积(㎡)',
  dataIndex: 'operationArea',
  align: 'center',
  scopedSlots: { customRender: 'operationArea' },
  width: 120
}, {
  title: '自用面积(㎡)',
  dataIndex: 'selfUserArea',
  align: 'center',
  scopedSlots: { customRender: 'selfUserArea' },
  width: 120
}, {
  title: '闲置面积(㎡)',
  dataIndex: 'idleArea',
  align: 'center',
  scopedSlots: { customRender: 'idleArea' },
  width: 120
}, {
  title: '占用面积(㎡)',
  dataIndex: 'occupationArea',
  align: 'center',
  scopedSlots: { customRender: 'occupationArea' },
  width: 120
}, {
  title: '其他面积(㎡)',
  dataIndex: 'otherArea',
  align: 'center',
  scopedSlots: { customRender: 'otherArea' },
  width: 120
}, {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' },
  width: 120
}]

// 资产项目变动
export const projectChange = [{
  title: '资产名称',
  dataIndex: 'assetName',
}, {
  title: '资产编码',
  dataIndex: 'assetCode',
},{
  title: '资产类型',
  dataIndex: 'assetTypeName',
}, {
  title: '资产分类',
  dataIndex: 'assetCategoryName',
}, {
  title: '所在位置',
  dataIndex: 'address',
}, {
  title: '用途',
  dataIndex: 'assetUse',
}, {
  title: '建筑面积(㎡)',
  dataIndex: 'assetArea',
}, {
  title: '变更前资产项目',
  dataIndex: 'projectName',
}, {
  title: '变更后资产项目',
  dataIndex: 'changeProjectId',
  align: 'center',
  scopedSlots: { customRender: 'changeProjectId' },
  width: 170
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
}, {
  title: '资产类型',
  dataIndex: 'assetTypeName',
}, {
  title: '资产编码',
  dataIndex: 'assetCode',
}, {
  title: '资产分类',
  dataIndex: 'assetCategoryName',
}, {
  title: '资产面积(㎡)',
  dataIndex: 'assetArea',
}, {
  title: '所在位置',
  dataIndex: 'address',
}, {
  title: '变动前原值(元)',
  dataIndex: 'oldOriginalValue',
  width: 150
}, {
  title: '变动后原值(元)',
  dataIndex: 'newOriginalValue',
  align: 'center',
  scopedSlots: { customRender: 'newOriginalValue' },
  width: 150
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
  dataIndex: 'assetArea',
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
// 基础信息变更
export const baseChange = [{
  title: '资产名称',
  dataIndex: 'assetName',
  width: '15%'
}, {
  title: '资产编码',
  dataIndex: 'assetCode',
  width: '10%'
},{
  title: '资产类型',
  dataIndex: 'assetTypeName',
  width: '10%'
}, {
  title: '资产分类',
  dataIndex: 'assetCategoryName',
  width: '10%'
},{
  title: '所在位置',
  dataIndex: 'address',
  width: '10%'
}, {
  title: '变更后资产名称',
  dataIndex: 'newAssetName',
  width: '10%',
  align: 'center',
  scopedSlots: { customRender: 'newAssetName' }
}, {
  title: '变更后资产编码',
  dataIndex: 'newAssetCode',
  width: '10%',
  align: 'center',
  scopedSlots: { customRender: 'newAssetCode' }
}, {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' }
}]
// 基础信息变更222
export const baseChangeTwo = [{
  title: '资产名称',
  dataIndex: 'assetName',
  width: '15%'
}, {
  title: '资产编码',
  dataIndex: 'assetCode',
},{
  title: '资产类型',
  dataIndex: 'assetTypeName',
}, {
  title: '资产分类',
  dataIndex: 'assetCategoryName',
},{
  title: '所在位置',
  dataIndex: 'address',
}, {
  title: '装修',
  dataIndex: 'oldDecorationSituation',
}, {
  title: '变更后资产名称',
  dataIndex: 'newAssetName',
  align: 'center',
  scopedSlots: { customRender: 'newAssetName' },
  width: 120
}, {
  title: '变更后资产编码',
  dataIndex: 'newAssetCode',
  align: 'center',
  scopedSlots: { customRender: 'newAssetCode' },
  width: 120
}, {
  title: '变更后装修情况',
  dataIndex: 'newDecorationSituation',
  align: 'center',
  scopedSlots: { customRender: 'newDecorationSituation' },
  width: 120
}, {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' }
}]
// 债权债务变更
export const debtChange = [{
  title: '资产名称',
  dataIndex: 'assetName',
}, {
  title: '资产编码',
  dataIndex: 'assetCode',
},{
  title: '资产类型',
  dataIndex: 'assetTypeName',
}, {
  title: '资产分类',
  dataIndex: 'assetCategoryName',
}, {
  title: '所在位置',
  dataIndex: 'address',
}, {
  title: '变更前债权金额(元)',
  dataIndex: 'creditorAmount',
  width: 120,
}, {
  title: '变更前债务金额(元)',
  dataIndex: 'debtAmount',
  width: 120,
}, {
  title: '变更后债权金额(元)',
  dataIndex: 'newCreditorAmount',
  scopedSlots: { customRender: 'newCreditorAmount' },
  width: 150,
}, {
  title: '变更后债务金额(元)',
  dataIndex: 'newDebtAmount',
  scopedSlots: { customRender: 'newDebtAmount' },
  width: 150,
}, {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  scopedSlots: { customRender: 'operation' }
}]