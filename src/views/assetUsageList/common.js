/*
 * @Author: L
 * @Date: 2022-07-19 17:28:50
 * @LastEditTime: 2022-07-23 16:06:54
 * @Description: file content
 */
export const typeList = [
  {
    name: '机构维度',
    value: '0'
  },
  {
    name: '项目维度',
    value: '1'
  },
  {
    name: '资产维度',
    value: '2'
  }
]


export const assetTypeList = [
  {
    name: '房屋',
    value: '1'
  },
  {
    name: '土地',
    value: '4'
  },
]

// 查询条件
export const queryCondition =  {
  organId: '',        // 组织机构id
  type: '0',          // 机构味道
  projectId: '',      // 项目id
  assetType: '1',     // 资产类型
  objectType: '',     // 资产分类编码
  assetNameOrCode: '',// 资产名称或编码
  pageNum: 1,         // 当前页
  pageSize: 10        // 每页显示记录数
}
// 展示千分位
export const totalKeyArr = [
  'assetArea',
  'shipArea',
  'managerArea',
  'selfUserArea',
  'occupationArea',
  'area',
  'useArea',
  'useArea',
  'rentNotArea',
  'rentArea',
  'rentAlreadyArea'
]

// 机构维度
export const columnsData = [
  { title: '所属组织机构', dataIndex: 'organName', width: 150 },
  { title: '资产数量', dataIndex: 'assetCount', width: 150 },
  { title: '资产面积(㎡)', dataIndex: 'assetArea', width: 150 },
  { title: '权证面积(㎡)', dataIndex: 'shipArea', width: 150 },
  {
    title: '使用方向',
    children: 
    [
      { title: '经营面积(㎡)', dataIndex: 'managerArea', width: 150, scopedSlots: { customRender: 'managerArea' }},
      { title: '自用面积(㎡)', dataIndex: 'selfUserArea', width: 150, scopedSlots: { customRender: 'selfUserArea' }},
      { title: '占用面积(㎡)', dataIndex: 'occupationArea', width: 150, scopedSlots: { customRender: 'occupationArea' }}
    ]
  },
  {
    title: '经营情况',
    children: 
    [
      { title: '建筑面积(㎡)',dataIndex: 'area', width: 150, scopedSlots: { customRender: 'area' }},
      { title: '使用面积(㎡)',dataIndex: 'useArea', width: 150, scopedSlots: { customRender: 'useArea' }},
      { title: '可租面积(㎡)',dataIndex: 'rentArea', width: 150, scopedSlots: { customRender: 'rentArea' }},
      { title: '已租面积(㎡)',dataIndex: 'rentAlreadyArea', width: 150, scopedSlots: { customRender: 'rentAlreadyArea' }},
      { title: '未租面积(㎡)',dataIndex: 'rentNotArea', width: 150, scopedSlots: { customRender: 'rentNotArea' }}
    ]
  }
]
// 项目维度
export const projectData = [
  { title: '资产项目', dataIndex: 'projectName', width: 150 },
  { title: '资产数量', dataIndex: 'assetCount', width: 150 },
  { title: '资产面积(㎡)', dataIndex: 'assetArea', width: 150 },
  { title: '权证面积(㎡)', dataIndex: 'shipArea', width: 150 },
  {
    title: '使用方向',
    children: 
    [
      { title: '经营面积(㎡)', dataIndex: 'managerArea', width: 150, scopedSlots: { customRender: 'managerArea' }},
      { title: '自用面积(㎡)', dataIndex: 'selfUserArea', width: 150, scopedSlots: { customRender: 'selfUserArea' }},
      { title: '占用面积(㎡)', dataIndex: 'occupationArea', width: 150, scopedSlots: { customRender: 'occupationArea' }}
    ]
  },
  {
    title: '经营情况',
    children: 
    [
      { title: '建筑面积(㎡)',dataIndex: 'area', width: 150, scopedSlots: { customRender: 'area' } },
      { title: '使用面积(㎡)',dataIndex: 'useArea', width: 150, scopedSlots: { customRender: 'useArea' } },
      { title: '可租面积(㎡)',dataIndex: 'rentArea', width: 150, scopedSlots: { customRender: 'rentArea' } },
      { title: '已租面积(㎡)',dataIndex: 'rentAlreadyArea', width: 150, scopedSlots: { customRender: 'rentAlreadyArea' } },
      { title: '未租面积(㎡)',dataIndex: 'rentNotArea', width: 150, scopedSlots: { customRender: 'rentNotArea' } }
    ]
  }
]
const customCell = (record) => {
  const attrs = {}
  let style = {}
  attrs.rowSpan = record.count
  if (record.count === 0) {
    style.display = 'none'
  }
  return {
    attrs,
    style
  }
}
// 资产维度
export const assetsColumns = [
  { title: '资产项目', dataIndex: 'projectName', width: 150, customCell: customCell},
  { title: '资产编码', dataIndex: 'assetCode', width: 150 },
  { title: '资产名称', dataIndex: 'assetName', width: 150 },
  { title: '资产类型', dataIndex: 'typeName', width: 150 },
  { title: '资产分类', dataIndex: 'objectTypeName', width: 150 },
  { title: '权证号', dataIndex: 'warrantNbr', width: 150 },
  { title: '资产面积(㎡)', dataIndex: 'assetArea', width: 150 },
  { title: '权证面积(㎡)', dataIndex: 'shipArea', width: 150 },
  {
    title: '使用方向',
    children: 
    [
      { title: '经营面积(㎡)', dataIndex: 'managerArea', width: 150, scopedSlots: { customRender: 'managerArea' } },
      { title: '自用面积(㎡)', dataIndex: 'selfUserArea', width: 150, scopedSlots: { customRender: 'selfUserArea' }},
      { title: '占用面积(㎡)', dataIndex: 'occupationArea', width: 150, scopedSlots: { customRender: 'occupationArea' }}
    ]
  },
  {
    title: '经营情况',
    children: 
    [
      { title: '建筑面积(㎡)',dataIndex: 'area', width: 150, scopedSlots: { customRender: 'area' }},
      { title: '使用面积(㎡)',dataIndex: 'useArea', width: 150, scopedSlots: { customRender: 'useArea' }},
      { title: '可租面积(㎡)',dataIndex: 'rentArea', width: 150, scopedSlots: { customRender: 'rentArea' }},
      { title: '已租面积(㎡)',dataIndex: 'rentAlreadyArea', width: 150,scopedSlots: { customRender: 'rentAlreadyArea' } },
      { title: '未租面积(㎡)',dataIndex: 'rentNotArea', width: 150, scopedSlots: { customRender: 'rentNotArea' }}
    ]
  }
]


// ------------------------------明细表-----------------------------------------
// const scheduleCell = (record, index, val) => {
//   const attrs = {}
//   let style = {}
//   if (record.key !== 'sg-t') {
//     attrs.rowSpan = record[`${val}Len`]
//     if (!record[`${val}Len`]) {
//       style.display = 'none'
//     }
//   }
//   return {
//     attrs,
//     style
//   }
// }
// customCell: (record, index) => {return scheduleCell(record, index, 'organId')},
export const scheduleOfList = [
  { title: '管理机构', dataIndex: 'organName', width: 150},
  { title: '资产项目', dataIndex: 'projectName', width: 150 },
  { title: '资产名称', dataIndex: 'assetName', width: 150 },
  { title: '资产编码', dataIndex: 'assetCode', width: 150 },
  { title: '资产面积(㎡)', dataIndex: 'assetArea', width: 150 },
  { title: '资产分类', dataIndex: 'objectTypeName', width: 150 },
  { title: '资源名称', dataIndex: 'resName', width: 150 },
  { title: '建筑面积(㎡)', dataIndex: 'area', width: 150 },
  { title: '使用面积(㎡)', dataIndex: 'useArea', width: 150 },
  { title: '可租面积(㎡)', dataIndex: 'rentArea', width: 150 },
  { title: '已租面积(㎡)', dataIndex: 'rentAlreadyArea', width: 150 },
  { title: '未租面积(㎡)', dataIndex: 'rentNotArea', width: 150 }
]
export const scheduleTotalKeyArr = ['assetArea', 'area', 'useArea', 'rentArea', 'rentAlreadyArea', 'rentNotArea']
