import { generateTableAreaByAssetTypeString } from '@/utils/utils';
// 交付物业
export const deliveryProperty = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 150,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 120,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '分类',
    dataIndex: 'assetCategoryName',
    width: 120,
  },
  {
    title: '用途',
    dataIndex: 'assetUse',
    width: 120,
  },
  {
    title: '建筑面积(㎡)',
    dataIndex: 'assetArea',
    width: 120,
  },
  {
    title: '交付物业面积(㎡)',
    dataIndex: 'transferArea',
    align: 'center',
    scopedSlots: { customRender: 'transferArea' },
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];

// 交付运营
export const deliveryOperation = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 150,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 150,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '分类',
    dataIndex: 'assetCategoryName',
    width: 120,
  },
  {
    title: '用途',
    dataIndex: 'assetUse',
    width: 120,
  },
  {
    title: '建筑面积(㎡)',
    dataIndex: 'assetArea',
    width: 120,
  },
  {
    title: '交付运营面积(㎡)',
    dataIndex: 'transferOperationArea',
    align: 'center',
    scopedSlots: { customRender: 'transferOperationArea' },
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];

// 使用方向变动
export const changeDirectionUse = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 150,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 120,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '分类',
    dataIndex: 'assetCategoryName',
    width: 120,
  },
  {
    title: '用途',
    dataIndex: 'assetUse',
    width: 120,
  },
  {
    title: '建筑面积(㎡)',
    dataIndex: 'assetArea',
    scopedSlots: {
      customRender: 'assetArea',
    },
    width: 120,
  },
  {
    title: '运营面积(㎡)',
    dataIndex: 'operationArea',
    align: 'center',
    scopedSlots: { customRender: 'operationArea' },
    width: 120,
  },
  {
    title: '闲置面积(㎡)',
    dataIndex: 'idleArea',
    align: 'center',
    scopedSlots: { customRender: 'idleArea' },
    width: 120,
  },
  {
    title: '自用面积(㎡)',
    dataIndex: 'selfUserArea',
    align: 'center',
    scopedSlots: { customRender: 'selfUserArea' },
    width: 120,
  },

  {
    title: '占用面积(㎡)',
    dataIndex: 'occupationArea',
    align: 'center',
    scopedSlots: { customRender: 'occupationArea' },
    width: 120,
  },
  {
    title: '其他面积(㎡)',
    dataIndex: 'otherArea',
    align: 'center',
    scopedSlots: { customRender: 'otherArea' },
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];

// 使用方向变动-设备
export const changeDirectionUseEq = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 150,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 120,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '分类',
    dataIndex: 'assetCategoryName',
    width: 120,
  },
  {
    title: '用途',
    dataIndex: 'assetUse',
    width: 120,
  },
  {
    title: '变更前使用方向',
    // dataIndex: 'useDirection',
    dataIndex: 'oldUseDirection',
    scopedSlots: {
      customRender: 'oldUseDirection',
    },
    width: 120,
  },
  {
    title: '变更后使用方向',
    dataIndex: 'newUseDirection',
    // dataIndex: 'useDirection',
    scopedSlots: {
      customRender: 'newUseDirection',
    },
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];

// 资产项目变动
export const projectChange = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 150,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 120,
  },
  {
    title: '资产分类',
    dataIndex: 'assetCategoryName',
    width: 120,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '用途',
    dataIndex: 'assetUse',
    width: 120,
  },
  {
    title: '建筑面积(㎡)',
    dataIndex: 'assetArea',
    scopedSlots: {
      customRender: 'assetArea',
    },
    width: 120,
  },
  {
    title: '变更前资产项目',
    dataIndex: 'projectName',
    width: 170,
  },
  {
    title: '变更后资产项目',
    dataIndex: 'changeProjectId',
    align: 'center',
    scopedSlots: { customRender: 'changeProjectId' },
    width: 170,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];

// 原值变动
export const variationOriginalValue = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 120,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 150,
  },
  {
    title: '资产分类',
    dataIndex: 'assetCategoryName',
    width: 120,
  },
  {
    title: '资产面积(㎡)',
    dataIndex: 'assetArea',
    scopedSlots: {
      customRender: 'assetArea',
    },
    width: 120,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '变动前原值(元)',
    dataIndex: 'oldOriginalValue',
    width: 150,
  },
  {
    title: '变动后原值(元)',
    dataIndex: 'newOriginalValue',
    align: 'center',
    scopedSlots: { customRender: 'newOriginalValue' },
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];

// 位置变动
export const positionChange = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 150,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 150,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '分类',
    dataIndex: 'assetCategoryName',
    width: 150,
  },
  {
    title: '用途',
    dataIndex: 'assetUse',
    width: 120,
  },
  {
    title: '建筑面积(㎡)',
    dataIndex: 'assetArea',
    width: 120,
  },
  {
    title: '变动后位置',
    dataIndex: 'addressName',
    align: 'center',
    scopedSlots: { customRender: 'addressName' },
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];
// 基础信息变更
export const baseChange = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    key: 'assetName',
    width: 150,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    key: 'assetCode',
    width: 120,
  },
  {
    title: '来源方式',
    dataIndex: 'oldSourceModeName',
    key: 'oldSourceModeName',
    width: 120,
  },
  {
    title: '资产原始来源方',
    dataIndex: 'oldOriginSource',
    key: 'oldOriginSource',
    width: 120,
  },
  {
    title: '有无经营权',
    dataIndex: 'managementRight',
    key: 'managementRight',
    scopedSlots: { customRender: 'managementRight' },
    width: 120,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    key: 'assetTypeName',
    width: 120,
  },
  {
    title: '资产分类',
    dataIndex: 'assetCategoryName',
    key: 'assetCategoryName',
    width: 120,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    key: 'address',
    width: 120,
  },
  {
    title: '变更后资产名称',
    dataIndex: 'newAssetName',
    key: 'newAssetName',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'newAssetName' },
  },
  {
    title: '变更后资产编码',
    dataIndex: 'newAssetCode',
    key: 'newAssetCode',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'newAssetCode' },
  },
  {
    title: '变更后来源方式',
    dataIndex: 'newSourceModeName',
    key: 'newSourceModeName',
    align: 'center',
    scopedSlots: { customRender: 'newSourceMode' },
    width: 120,
  },
  {
    title: '变更后资产分类',
    dataIndex: 'newAssetCategoryName',
    key: 'newAssetCategoryName',
    align: 'center',
    scopedSlots: { customRender: 'newAssetCategoryCode' },
    width: 120,
  },
  {
    title: '变更后资产原始来源方',
    dataIndex: 'newOriginSource',
    key: 'newOriginSource',
    align: 'center',
    scopedSlots: { customRender: 'newOriginSource' },
    width: 160,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];
// 基础信息变更222
export const baseChangeTwo = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 120,
  },
  {
    title: '资产原始来源方',
    dataIndex: 'oldOriginSource',
    key: 'oldOriginSource',
    width: 120,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 120,
  },
  {
    title: '资产分类',
    dataIndex: 'assetCategoryName',
    width: 120,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '装修',
    dataIndex: 'oldDecorationSituation',
    width: 120,
  },
  {
    title: '来源方式',
    dataIndex: 'oldSourceModeName',
    width: 120,
  },
  {
    title: '有无经营权',
    dataIndex: 'managementRight',
    scopedSlots: { customRender: 'managementRight' },
    width: 120,
  },
  {
    title: '变更后资产名称',
    dataIndex: 'newAssetName',
    align: 'center',
    scopedSlots: { customRender: 'newAssetName' },
    width: 120,
  },
  {
    title: '变更后资产编码',
    dataIndex: 'newAssetCode',
    align: 'center',
    scopedSlots: { customRender: 'newAssetCode' },
    width: 120,
  },
  {
    title: '变更后装修情况',
    dataIndex: 'newDecorationSituation',
    align: 'center',
    scopedSlots: { customRender: 'newDecorationSituation' },
    width: 120,
  },
  {
    title: '变更后来源方式',
    dataIndex: 'newSourceModeName',
    align: 'center',
    scopedSlots: { customRender: 'newSourceMode' },
    width: 120,
  },
  {
    title: '变更后资产分类',
    dataIndex: 'newAssetCategoryName',
    align: 'center',
    scopedSlots: { customRender: 'newAssetCategoryCode' },
    width: 120,
  },
  {
    title: '变更后资产原始来源方',
    dataIndex: 'newOriginSource',
    key: 'newOriginSource',
    align: 'center',
    scopedSlots: { customRender: 'newOriginSource' },
    width: 160,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];
// 债权债务变更
export const debtChange = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 150,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 150,
  },
  {
    title: '资产分类',
    dataIndex: 'assetCategoryName',
    width: 150,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '变更前债权金额(元)',
    dataIndex: 'creditorAmount',
    width: 150,
  },
  {
    title: '变更前债务金额(元)',
    dataIndex: 'debtAmount',
    width: 150,
  },
  {
    title: '变更后债权金额(元)',
    dataIndex: 'newCreditorAmount',
    scopedSlots: { customRender: 'newCreditorAmount' },
    width: 150,
  },
  {
    title: '变更后债务金额(元)',
    dataIndex: 'newDebtAmount',
    scopedSlots: { customRender: 'newDebtAmount' },
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];

// 资产面积
export const assetSize = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 150,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 150,
  },
  {
    title: '资产分类',
    dataIndex: 'assetCategoryName',
    width: 150,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '资产面积(㎡)',
    dataIndex: 'assetArea',
    width: 120,
  },
  {
    title: '变更后资产面积(㎡)',
    dataIndex: 'newAssetArea',
    scopedSlots: { customRender: 'newAssetArea' },
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];

// 实际产权单位
export const propertyColumn = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: 150,
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: 150,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 150,
  },
  {
    title: '资产分类',
    dataIndex: 'assetCategoryName',
    width: 150,
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '资产面积(㎡)',
    dataIndex: 'assetArea',
    width: 150,
  },
  {
    title: '变更前实际产权单位',
    dataIndex: 'oldPropertyRightUnit',
    width: 200,
  },
  {
    title: '变更后实际产权单位',
    dataIndex: 'newPropertyRightUnit',
    scopedSlots: { customRender: 'newPropertyRightUnit' },
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: 120,
  },
];
