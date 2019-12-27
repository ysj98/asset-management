/*
 * @Author: your name
 * @Date: 2019-12-25 15:27:17
 * @LastEditTime : 2019-12-27 11:06:59
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \asset-management\src\views\inventoryManagement\inventoryPerform\basics.js
 */

export const register = [{
  title: '资产编码',
  dataIndex: 'assetCode'
}, {
  title: '资产名称',
  dataIndex: 'assetName'
}, {
  title: '所属机构',
  dataIndex: 'organName'
}, {
  title: '所属资产项目',
  dataIndex: 'projectName',
  width: '10%',
}, {
  title: '资产类型',
  dataIndex: 'assetTypeName'
}, {
  title: '资产分类',
  dataIndex: 'objectTypeName'
}, {
  title: '所在位置',
  dataIndex: 'location'
}, {
  title: '资产状态',
  dataIndex: 'statusName'
}, {
  title: '盘点结果',
  dataIndex: 'checkResultName'
}, {
  title: '盘点人',
  dataIndex: 'userNames'
}, {
  title: '盘点时间',
  dataIndex: 'checkTime'
},  {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  width: '10%',
  scopedSlots: { customRender: 'operation' }
}]

export const exceptionList = [{
  title: '资产编码',
  dataIndex: 'assetCode',
  width: '10%'
}, {
  title: '资产名称',
  dataIndex: 'assetName'
}, {
  title: '所属机构',
  dataIndex: 'organName'
}, {
  title: '所属资产项目',
  dataIndex: 'projectName',
  width: '10%',
}, {
  title: '资产类型',
  dataIndex: 'assetTypeName'
}, {
  title: '资产分类',
  dataIndex: 'objectTypeName'
}, {
  title: '资产位置',
  dataIndex: 'location'
}, {
  title: '资产状态',
  dataIndex: 'statusName'
}, {
  title: '盘点结果',
  dataIndex: 'checkResultName'
}, 
{
  title: '异常说明',
  dataIndex: 'remark'
}, {
  title: '盘点人',
  dataIndex: 'userNames'
}, {
  title: '盘点时间',
  dataIndex: 'checkTime'
},  {
  title: '操作',
  dataIndex: 'operation',
  align: 'center',
  width: '10%',
  scopedSlots: { customRender: 'operation' }
}]

export const checkStatusData = [
  {
    value: '',
    name: '全部盘点状态'
  },
  {
    value: '0',
    name: '未盘点'
  }, {
    value: '1',
    name: '已盘点'
  }
]

export const checkResultsData = [
  {
    value: '0,2,3',
    name: '全部异常类型'
  },
  {
    value: '0',
    name: '盘亏'
  }, {
    value: '2',
    name: '信息有误'
  },
  {
    value: '3',
    name: '盘盈'
  }
]
