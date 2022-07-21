/*
 * @Author: L
 * @Date: 2022-07-19 17:28:50
 * @LastEditTime: 2022-07-21 14:26:12
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
// 机构维度
export const columnsData = [
  { title: '所属组织机构', dataIndex: 'organName' },
  { title: '资产数量', dataIndex: 'assetCount' },
  { title: '资产面积(㎡)', dataIndex: 'assetArea' },
  { title: '权证面积(㎡)', dataIndex: 'shipArea' },
  {
    title: '使用方向',
    children: 
    [
      { title: '经营面积(㎡)', dataIndex: 'managerArea' },
      { title: '自用面积(㎡)', dataIndex: 'selfUserArea' },
      { title: '占用面积(㎡)', dataIndex: 'occupationArea'}
    ]
  },
  {
    title: '经营情况',
    children: 
    [
      { title: '建筑面积(㎡)',dataIndex: 'area' },
      { title: '使用面积(㎡)',dataIndex: 'useArea' },
      { title: '可租面积(㎡)',dataIndex: 'rentArea' },
      { title: '已租面积(㎡)',dataIndex: 'rentAlreadyArea' },
      { title: '未租面积(㎡)',dataIndex: 'rentNotArea'  }
    ]
  }
]
// 项目维度
export const projectData = [
  { title: '资产项目', dataIndex: 'projectName' },
  { title: '资产数量', dataIndex: 'assetCount' },
  { title: '资产面积(㎡)', dataIndex: 'assetArea' },
  { title: '权证面积(㎡)', dataIndex: 'shipArea' },
  {
    title: '使用方向',
    children: 
    [
      { title: '经营面积(㎡)', dataIndex: 'managerArea' },
      { title: '自用面积(㎡)', dataIndex: 'selfUserArea' },
      { title: '占用面积(㎡)', dataIndex: 'occupationArea'}
    ]
  },
  {
    title: '经营情况',
    children: 
    [
      { title: '建筑面积(㎡)',dataIndex: 'area' },
      { title: '使用面积(㎡)',dataIndex: 'useArea' },
      { title: '可租面积(㎡)',dataIndex: 'rentArea' },
      { title: '已租面积(㎡)',dataIndex: 'rentAlreadyArea' },
      { title: '未租面积(㎡)',dataIndex: 'rentNotArea'  }
    ]
  }
]
// 资产维度
export const assetsColumns = [
  { title: '资产项目', dataIndex: 'projectName' },
  { title: '资产编码', dataIndex: 'assetCode' },
  { title: '资产名称', dataIndex: 'assetName' },
  { title: '资产类型', dataIndex: 'typeName' },
  { title: '资产分类', dataIndex: 'objectTypeName' },
  { title: '权证号', dataIndex: 'warrantNbr' },
  { title: '资产面积(㎡)', dataIndex: 'assetArea' },
  { title: '权证面积(㎡)', dataIndex: 'shipArea' },
  {
    title: '使用方向',
    children: 
    [
      { title: '经营面积(㎡)', dataIndex: 'managerArea' },
      { title: '自用面积(㎡)', dataIndex: 'selfUserArea' },
      { title: '占用面积(㎡)', dataIndex: 'occupationArea'}
    ]
  },
  {
    title: '经营情况',
    children: 
    [
      { title: '建筑面积(㎡)',dataIndex: 'area' },
      { title: '使用面积(㎡)',dataIndex: 'useArea' },
      { title: '可租面积(㎡)',dataIndex: 'rentArea' },
      { title: '已租面积(㎡)',dataIndex: 'rentAlreadyArea' },
      { title: '未租面积(㎡)',dataIndex: 'rentNotArea'  }
    ]
  }
]