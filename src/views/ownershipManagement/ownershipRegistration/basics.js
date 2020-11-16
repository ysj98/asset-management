/*
 * @Author: L
 * @Date: 2019-12-19 14:44:17
 * @LastEditTime: 2020-11-16 17:29:06
 * @Description: file content
 */
// 首次登记 变更登记
export const register = [{
  title: '资产名称',
  dataIndex: 'assetName',
  width: '8%'
}, {
  title: '资产编码',
  dataIndex: 'assetCode',
  width: '8%'
}, {
  title: '资产类型',
  dataIndex: 'assetTypeName',
  width: '8%'
}, {
  title: '资产项目名称',
  dataIndex: 'projectName',
  width: '10%'
}, {
  title: '资产分类',
  dataIndex: 'objectTypeName',
  width: '8%'
}, {
  title: '权属类型',
  dataIndex: 'kindOfRightName',
  width: '8%'
}, {
  title: '所在位置',
  dataIndex: 'address',
  width: '10%'
}, {
  title: '面积',
  dataIndex: 'assetArea',
  width: '5%'
}, {
  title: '原权证号',
  dataIndex: 'oldWarrantNbr',
  align: 'center',
  width: '10%',
  scopedSlots: { customRender: 'oldWarrantNbr' }
}, {
  title: '新权证号',
  dataIndex: 'warrantNbr',
  align: 'center',
  scopedSlots: { customRender: 'warrantNbr' },
  width: '30%'
}, {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  width: '11%',
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
  title: '资产类型',
  dataIndex: 'assetTypeName',
  width: '10%'
}, {
  title: '资产项目名称',
  dataIndex: 'projectName',
  width: '10%'
}, {
  title: '资产分类',
  dataIndex: 'objectTypeName',
  width: '8%'
}, {
  title: '权属类型',
  dataIndex: 'kindOfRightName',
  width: '8%'
}, {
  title: '所在位置',
  dataIndex: 'address',
  width: '20%'
}, {
  title: '面积',
  dataIndex: 'assetArea',
  width: '10%'
}, {
  title: '原权证号',
  dataIndex: 'oldWarrantNbr',
  align: 'center',
  width: '15%',
  scopedSlots: { customRender: 'oldWarrantNbr' }
}, {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  width: '10%',
  scopedSlots: { customRender: 'operation' }
}]