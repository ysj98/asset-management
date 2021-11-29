/*
 * @Date: 2020-07-13 10:54:47
 * @Description: 
 */ 
//资产类型：1 房屋，2构筑物，3设备，4土地，5车场
export const pageTypeMap = {
  'house': '1',
  'land': '4',
  'carPark': '5'
}
// 启用状态
export const statusOptions = [
  {label: '全部状态', value: ''},
  {label: '启用', value: '1'},
  {label: '停用', value: '0'}
]
// 标题字典
export const titleMap = {
  'house': '房屋分类',
  'land': '土地分类'
}
// 分类自定
export const typeMap = {
  'house': '房屋',
  'land': '土地',
  'carPark': '车场'
}
// 标题字典
export const actionMap = {
  'create': '新建',
  'edit': '编辑',
  'detail': '详情'
}