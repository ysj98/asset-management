// 资产列表
export const columnsData = [
  {
    title: '楼栋名称',
    dataIndex: 'buildName',
    width: 150
  },
  {
    title: '房屋名称',
    dataIndex: 'houseName',
    width: 150
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 100
  },
  {
    title: '建筑面积',
    dataIndex: 'area',
    width: 100
  },
  {
    title: '坐落位置',
    dataIndex: 'pasitionString',
    width: 230
  },
  {
    title: '权属情况',
    dataIndex: 'ownershipStatusName',
    width: 100
  },
  {
    title: '权证号',
    dataIndex: 'warrantNbr',
    width: 100
  },
  {
    title: '装修情况',
    dataIndex: 'decorationSituation',
    width: 100
  },
  {
    title: '资产原值',
    dataIndex: 'originalValue',
    width: 100
  },
  {
    title: '市场价值',
    dataIndex: 'marketValue',
    width: 100
  },
  {
    title: '转运营日期',
    dataIndex: 'transferOperationTime',
    width: 100
  },
  {
    title: '转运营面积',
    dataIndex: 'transferOperationArea',
    width: 100
  },
  {
    title: '闲置面积',
    dataIndex: 'idleArea',
    width: 100
  },
  {
    title: '自用面积',
    dataIndex: 'selfUserArea',
    width: 100
  },
  {
    title: '占用面积',
    dataIndex: 'occupationArea',
    width: 100
  },
  {
    title: '其他面积',
    dataIndex: 'otherArea',
    width: 100
  },
  {
    title: '转物业面积',
    dataIndex: 'transferArea',
    width: 100
  },
  {
    title: '转物业日期',
    dataIndex: 'transferTime',
    width: 100
  },
  {
    title: '使用期限(月)',
    dataIndex: 'validPeriod',
    width: 100
  },
  {
    title: '开始使用日期',
    dataIndex: 'startDate',
    width: 100
  },
  {
    title: '已使用期数(月)',
    dataIndex: 'usedDate',
    width: 120
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'operation' }
  }
]


// 资产列表
export const particulars = [
  {
    title: '楼栋名称',
    dataIndex: 'buildName',
    width: 100
  },
  {
    title: '房屋名称',
    dataIndex: 'houseName',
    width: 100
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 100
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 100
  },
  {
    title: '建筑面积',
    dataIndex: 'area',
    width: 100
  },
  {
    title: '坐落位置',
    dataIndex: 'pasitionString',
    width: 100
  },
  {
    title: '权属情况',
    dataIndex: 'ownershipStatusName',
    width: 100
  },
  {
    title: '权证号',
    dataIndex: 'warrantNbr',
    width: 100
  },
  {
    title: '装修情况',
    dataIndex: 'decorationSituation',
    width: 100
  },
  {
    title: '资产原值',
    dataIndex: 'originalValue',
    width: 100
  },
  {
    title: '市场价值',
    dataIndex: 'marketValue',
    width: 100
  },
  {
    title: '转运营日期',
    dataIndex: 'transferOperationTime',
    width: 100
  },
  {
    title: '转运营面积',
    dataIndex: 'transferOperationArea',
    width: 100
  },
  {
    title: '闲置面积',
    dataIndex: 'idleArea',
    width: 100
  },
  {
    title: '自用面积',
    dataIndex: 'selfUserArea',
    width: 100
  },
  {
    title: '占用面积',
    dataIndex: 'occupationArea',
    width: 100
  },
  {
    title: '其他面积',
    dataIndex: 'otherArea',
    width: 100
  },
  {
    title: '转物业面积',
    dataIndex: 'transferArea',
    width: 100
  },
  {
    title: '转物业日期',
    dataIndex: 'transferTime',
    width: 100
  },
  {
    title: '使用期限(月)',
    dataIndex: 'validPeriod',
    width: 100
  },
  {
    title: '开始使用日期',
    dataIndex: 'startDate',
    width: 100
  },
  {
    title: '已使用期数(月)',
    dataIndex: 'usedDate',
    width: 120
  }
]

// 楼栋名称（必填，字符型，取楼栋名称）、
// 房屋名称（非必填，字符型，取房间名称）、
// 资产名称（必填，字符型，当为楼栋时取楼栋名称，当为房屋时取房间名称）、
// 资产编码（非必填，字符型，没有填写则系统自动生成）、
// 建筑面积（必填，数值型，当为楼栋时取楼栋的建筑面积，当为房屋时取房间的建筑面积）、
// 坐落位置（必填，字符型，取值楼栋的省市区+详细位置+房间名称）、
// 权属情况（必填，取值：有证/无证）、
// 权证号（字符型，长度50字符，当权属情况为有证时必填，多个以逗号分隔）、
// 装修情况（非必填，字符型，长度30字符）、
// 资产原值（非必填，数值型）、
// 市场价值（非必填，数值型）、
// 转运营时间（非必填，日期型）、
// 转运营面积（非必填，数值型，单位㎡）、
// 转物业时间（非必填，日期型）、
// 转物业面积（非必填，数值型，单位㎡）、
// 闲置面积（非必填，数值型，单位㎡）、
// 自用面积（非必填，数值型，单位㎡）、
// 占用面积（非必填，数值型，单位㎡）、
// 其他面积（名称支持自定义，非必填，数值型，单位㎡）、
// 使用期限（非必填，数值型，单位月）、
// 开始使用日期（非必填，日期型）、
// 已使用期数（非必填，数值型，单位㎡）

// required: 必填的
export const judgmentData = [
  {
    title: '用途',
    dataIndex: 'useType',
    required: false
  },
  {
    title: '省',
    dataIndex: 'province',
    required: false
  },
  {
    title: '市',
    dataIndex: 'city',
    required: false
  },
  {
    title: '区',
    dataIndex: 'region',
    required: false
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    required: false
  },
  {
    title: '资产分类',
    dataIndex: 'objectType',
    required: false
  },
  {
    title: '类型',
    dataIndex: 'type',
    required: false
  },
  {
    title: '楼栋ID',
    dataIndex: 'buildId',
    required: false
  },
  {
    title: '对象ID',
    dataIndex: 'objectId',
    required: false
  },
  {
    title: '楼栋名称',
    dataIndex: 'buildName',
    required: false
  },
  {
    title: '房屋名称',
    dataIndex: 'houseName',
    required: false
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
    required: true
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    required: false
  },
  {
    title: '建筑面积',
    dataIndex: 'area',
    required: false,
    type: 'float'
  },
  {
    title: '坐落位置',
    dataIndex: 'pasitionString',
    required: false
  },
  {
    title: '权属情况',
    dataIndex: 'ownershipStatusName',
    required: true
  },
  {
    title: '权证号',
    dataIndex: 'warrantNbr',
    required: false,
    fontLength: 50
  },
  {
    title: '装修情况',
    dataIndex: 'decorationSituation',
    required: true,
    fontLength: 30
  },
  {
    title: '资产原值',
    dataIndex: 'originalValue',
    required: true,
    type: 'float'
  },
  {
    title: '市场价值',
    dataIndex: 'marketValue',
    required: false,
    type: 'float'
  },
  {
    title: '转运营日期',
    dataIndex: 'transferOperationTime',
    required: false,
    type: 'number',
    date: true
  },
  {
    title: '转运营面积',
    dataIndex: 'transferOperationArea',
    required: true,
    type: 'float'
  },
  {
    title: '闲置面积',
    dataIndex: 'idleArea',
    required: true,
    type: 'float'
  },
  {
    title: '自用面积',
    dataIndex: 'selfUserArea',
    required: true,
    type: 'float'
  },
  {
    title: '占用面积',
    dataIndex: 'occupationArea',
    required: true,
    type: 'float'
  },
  {
    title: '其他面积',
    dataIndex: 'otherArea',
    required: true,
    type: 'float'
  },
  {
    title: '转物业日期',
    dataIndex: 'transferTime',
    required: false,
    type: 'number',
    date: true
  },
  {
    title: '转物业面积',
    dataIndex: 'transferArea',
    required: false,
    type: 'float'
  },
  {
    title: '使用期限(月)',
    dataIndex: 'validPeriod',
    required: true,
    type: 'number'
  },
  {
    title: '开始使用日期',
    dataIndex: 'startDate',
    required: false,
    type: 'number',
    date: true
  },
  {
    title: '已使用期数(月)',
    dataIndex: 'usedDate',
    required: false,
    type: 'number'
  }
]
