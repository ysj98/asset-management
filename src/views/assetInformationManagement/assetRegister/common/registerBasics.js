/*
 * @Author: LW
 * @Date: 2020-07-10 17:11:45
 * @LastEditTime: 2020-07-20 15:58:57
 * @Description: file content
 */ 

//  -------- 房屋 ----------------------------------
// 房屋列表
export const columnsData = [
  { title: '楼栋名称', dataIndex: 'buildName', width: 150},
  { title: '房间名称', dataIndex: 'houseName', width: 150 },
  { title: '资产名称', dataIndex: 'assetName', width: 150 },
  { title: '资产编码', dataIndex: 'assetCode', width: 100 },
  { title: '建筑面积', dataIndex: 'area', width: 100 },
  { title: '坐落位置', dataIndex: 'pasitionString', width: 230 },
  { title: '权属类型', dataIndex: 'ownershipStatusName', width: 100 },
  { title: '权属情况', dataIndex: 'ownershipStatus', width: 100 },
  { title: '权证号', dataIndex: 'warrantNbr', width: 100 },
  { title: '装修情况', dataIndex: 'decorationSituation', width: 100 },
  { title: '债权金额(元)', dataIndex: 'creditorAmount', width: 100 },
  { title: '债务金额(元)', dataIndex: 'debtAmount', width: 100 },
  { title: '操作', dataIndex: 'operation', align: 'center', fixed: 'right', width: 100, scopedSlots: { customRender: 'operation' }}
]


// 房屋列表
export const particulars = [
  { title: '楼栋名称', dataIndex: 'buildName', width: 100  },
  { title: '房屋名称', dataIndex: 'houseName', width: 100 },
  { title: '资产名称', dataIndex: 'assetName', width: 100 },
  { title: '资产编码', dataIndex: 'assetCode', width: 100 },
  { title: '建筑面积', dataIndex: 'area', width: 100 },
  { title: '坐落位置', dataIndex: 'pasitionString', width: 100 },
  { title: '权属情况', dataIndex: 'ownershipStatusName', width: 100 },
  { title: '权证号', dataIndex: 'warrantNbr', width: 100 },
  { title: '装修情况', dataIndex: 'decorationSituation', width: 100 },
  { title: '资产原值', dataIndex: 'originalValue', width: 100 },
  { title: '市场价值', dataIndex: 'marketValue', width: 100 },
  { title: '转运营日期', dataIndex: 'transferOperationTime', width: 100 },
  { title: '转运营面积', dataIndex: 'transferOperationArea', width: 100 },
  { title: '闲置面积', dataIndex: 'idleArea', width: 100 },
  { title: '自用面积', dataIndex: 'selfUserArea', width: 100 },
  { title: '占用面积', dataIndex: 'occupationArea', width: 100 },
  { title: '其他面积', dataIndex: 'otherArea', width: 100 },
  { title: '转物业面积', dataIndex: 'transferArea', width: 100 },
  { title: '转物业日期', dataIndex: 'transferTime', width: 100 },
  { title: '使用期限(月)', dataIndex: 'validPeriod', width: 100 },
  { title: '开始使用日期', dataIndex: 'startDate', width: 100 },
  { title: '已使用期数(月)', dataIndex: 'usedDate', width: 120 }
]

 // 房屋导入校验规则
export const judgmentData = [
  { title: '用途', dataIndex: 'useType', required: false },
  { title: '省', dataIndex: 'province', required: false },
  { title: '市', dataIndex: 'city', required: false },
  { title: '区', dataIndex: 'region', required: false },
  { title: '详细地址', dataIndex: 'address', required: false },
  { title: '资产分类', dataIndex: 'objectType', required: false },
  { title: '类型', dataIndex: 'type', required: false },
  { title: '楼栋ID', dataIndex: 'buildId', required: false },
  { title: '对象ID', dataIndex: 'objectId', required: false },
  { title: '楼栋名称', dataIndex: 'buildName', required: false },
  { title: '房屋名称', dataIndex: 'houseName', required: false },
  { title: '资产名称', dataIndex: 'assetName', required: true },
  { title: '资产编码', dataIndex: 'assetCode', required: false },
  { title: '建筑面积', dataIndex: 'area', required: false, type: 'float4' },
  { title: '坐落位置', dataIndex: 'pasitionString', required: false },
  { title: '权属情况', dataIndex: 'ownershipStatusName', required: true },
  { title: '权证号', dataIndex: 'warrantNbr', required: false, fontLength: 50 },
  { title: '装修情况', dataIndex: 'decorationSituation', required: true, fontLength: 30 },
  { title: '资产原值', dataIndex: 'originalValue', required: true, type: 'float' },
  { title: '市场价值', dataIndex: 'marketValue', required: false, type: 'float' },
  { title: '转运营日期', dataIndex: 'transferOperationTime', required: false, type: 'number', date: true },
  { title: '转运营面积', dataIndex: 'transferOperationArea', required: true, type: 'float' },
  { title: '闲置面积', dataIndex: 'idleArea', required: true, type: 'float' },
  { title: '自用面积', dataIndex: 'selfUserArea', required: true, type: 'float' },
  { title: '占用面积', dataIndex: 'occupationArea', required: true, type: 'float' },
  { title: '其他面积', dataIndex: 'otherArea', required: true, type: 'float' },
  { title: '转物业日期', dataIndex: 'transferTime', required: false, type: 'number', date: true },
  { title: '转物业面积', dataIndex: 'transferArea', required: false, type: 'float' },
  { title: '使用期限(月)', dataIndex: 'validPeriod', required: true, type: 'number' },
  { title: '开始使用日期', dataIndex: 'startDate', required: false, type: 'number', date: true },
  { title: '已使用期数(月)', dataIndex: 'usedDate', required: false, type: 'number' },
  { title: '累计折旧金额(元)', dataIndex: 'depreciationAmount', required: false, type: 'float' },
  { title: '债权金额(元)', dataIndex: 'creditorAmount', required: false, type: 'float' },
  { title: '债务金额(元)', dataIndex: 'debtAmount', required: false, type: 'float' },
]

//  -------- 土地 ----------------------------------
// 土地列表
export const landData = [
  { title: '土地名称', dataIndex: 'landName', width: 150},
  { title: '土地编码', dataIndex: 'landCode', width: 150 },
  { title: '资产名称', dataIndex: 'assetName', width: 150 },
  { title: '资产编码', dataIndex: 'assetCode', width: 100 },
  { title: '土地面积(㎡)', dataIndex: 'landArea', width: 100 },
  { title: '宗地号', dataIndex: 'theNo', width: 100 },
  { title: '土地类型', dataIndex: 'landType', width: 100 },
  { title: '土地用途', dataIndex: 'landUse', width: 100 },
  { title: '权属类型', dataIndex: 'kindOfRight', width: 100 },
  { title: '权属情况', dataIndex: 'ownershipStatus', width: 100 },
  { title: '权证号', dataIndex: 'warrantNbr', width: 100 },
  { title: '债权金额(元)', dataIndex: 'creditorAmount', width: 100 },
  { title: '债务金额(元)', dataIndex: 'debtAmount', width: 100 },
  { title: '操作', dataIndex: 'operation', align: 'center', fixed: 'right', width: 100, scopedSlots: { customRender: 'operation' }}
]

//  -------- 附属配套 ----------------------------------
export const auxiliary = [
  { title: '附属配套ID', dataIndex: 'subsidiaryMatchingId', width: 100},
  { title: '资产ID', dataIndex: 'assetId', width: 100 },
  { title: '资产名称', dataIndex: 'assetName', width: 150 },
  { title: '资产编码', dataIndex: 'assetCode', width: 100 },
  { title: '资产分类', dataIndex: 'assetTypeName', width: 100 },
  { title: '附属配套名称', dataIndex: 'matchingName', width: 100 },
  { title: '附属配套编码', dataIndex: 'matchingCode', width: 100 },
  { title: '类型', dataIndex: 'matchingTypeName', width: 100 },
  { title: '规格型号', dataIndex: 'specificationType', width: 100 },
  { title: '价值(元)', dataIndex: 'value', width: 100 },
  { title: '数量', dataIndex: 'number', width: 100 },
  { title: '计量单位', dataIndex: 'unitOfMeasurementName', width: 100 },
  { title: '接管前附属配套', dataIndex: 'isBeforeName', width: 100 },
  { title: '备注', dataIndex: 'remark', width: 200 },
  { title: '操作', dataIndex: 'operation', align: 'center', fixed: 'right', width: 150, scopedSlots: { customRender: 'operation' }}
]

//  -------- 价值信息 ----------------------------------

export const valueToRegisterData = [
  { title: '资产ID', dataIndex: 'assetId', width: 100 },
  { title: '资产名称', dataIndex: 'assetName', width: 150 },
  { title: '资产编码', dataIndex: 'assetCode', width: 100 },
  { title: '资产分类', dataIndex: 'assetTypeName', width: 100 },
  { title: '资产位置', dataIndex: 'pasitionString', width: 150 },
  { title: '资产原值(元)', dataIndex: 'originalValue', width: 100 },
  { title: '使用期限(月)', dataIndex: 'validPeriod', width: 100 },
  { title: '开始使用日期', dataIndex: 'startDate', width: 100 },
  { title: '已使用期限', dataIndex: 'usedDate', width: 100 },
  { title: '累计折旧金额(元)', dataIndex: 'depreciationAmount', width: 100 },
  { title: '操作', dataIndex: 'operation', align: 'center', fixed: 'right', width: 100, scopedSlots: { customRender: 'operation' }}
]

//  -------- 使用方向 ----------------------------------
export const directionUseData = [
  { title: '资产ID', dataIndex: 'assetId', width: 100 },
  { title: '资产名称', dataIndex: 'assetName', width: 150 },
  { title: '资产编码', dataIndex: 'assetCode', width: 100 },
  { title: '资产分类', dataIndex: 'objectTypeName', width: 100 },
  { title: '建筑面积(㎡)', dataIndex: 'buildArea', width: 150 },
  { title: '转物业时间', dataIndex: 'transferTime', width: 100 },
  { title: '转物业面积(㎡)', dataIndex: 'transferArea', width: 100 },
  { title: '转运营时间', dataIndex: 'transferOperationTime', width: 100 },
  { title: '运营面积(㎡)', dataIndex: 'transferOperationArea', width: 100 },
  { title: '自用面积(㎡)', dataIndex: 'selfUserArea', width: 100 },
  { title: '闲置面积(㎡)', dataIndex: 'idleArea', width: 100 },
  { title: '占用面积(㎡)', dataIndex: 'occupationArea', width: 100 },
  { title: '其他面积(㎡)', dataIndex: 'otherArea', width: 100 },
  { title: '操作', dataIndex: 'operation', align: 'center', fixed: 'right', width: 100, scopedSlots: { customRender: 'operation' }}
]

//  -------- 相关费用 ----------------------------------
export const costData = [
  { title: '相关费用ID', dataIndex: 'assetId', width: 100 },
  { title: '资产ID', dataIndex: 'assetName', width: 150 },
  { title: '资产名称', dataIndex: 'assetCode', width: 100 },
  { title: '资产编码', dataIndex: 'objectTypeName', width: 100 },
  { title: '资产分类', dataIndex: 'buildArea', width: 150 },
  { title: '类别', dataIndex: 'transferTime', width: 100 },
  { title: '费用/收入类型', dataIndex: 'transferArea', width: 100 },
  { title: '费用/收入名称', dataIndex: 'transferOperationTime', width: 100 },
  { title: '客户名称', dataIndex: 'transferOperationArea', width: 100 },
  { title: '所属月份', dataIndex: 'selfUserArea', width: 100 },
  { title: '金额', dataIndex: 'idleArea', width: 100 },
  { title: '读数', dataIndex: 'occupationArea', width: 100 },
  { title: '备注', dataIndex: 'otherArea', width: 100 },
  { title: '操作', dataIndex: 'operation', align: 'center', fixed: 'right', width: 100, scopedSlots: { customRender: 'operation' }}
]
