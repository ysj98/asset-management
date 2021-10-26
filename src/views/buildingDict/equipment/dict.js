/*
 * @Date: 2020-07-16 11:25:27
 * @Description:
 */
// 页面跳转
export const operationTypes = {
  create: "/buildingDict/createEquipment",
  detail: "/buildingDict/detailViewEquipment",
  edit: '/buildingDict/editEquipment'
};
export const allStyle = {
  width: "170px",
  "margin-right": "10px",
  verticalAlign: 'middle',
};
export const allWidth = {
  width: "170px",
  "margin-right": "10px",
  height: '32px',
  verticalAlign: 'middle',
  overflow: 'hidden'
};
export const queryCondition = {
  organId: "", // 机构id
  communityId: [''], // 运营项目
  landType: undefined, // 土地类型
  landuse: '', // 土地用途
  status: '', // 土地名称/编码/宗地号
  pageNum: 1,
  pageSize: 10,
  isCurrent: 0
};
export const communityIdOpt = [
  { label: "全部运营项目", value: "" },
]
export const parkTypeOpt = [
  { label: "全部车场类型", value: "" },
]
export const columns = [
  {
    title: "车位ID",
    dataIndex: "parkingId",
    width: 120
  },
  {
    title: "设备名称",
    dataIndex: "placeName",
    width: 120
  },
  {
    title: "区域名称",
    dataIndex: "parkingAreaName",
    width: 120
  },
  {
    title: "运营项目",
    dataIndex: "communityName",
    width: 120
  },
  {
    title: "车位名称",
    dataIndex: "name",
    width: 120
  },
  {
    title: "车位编码",
    dataIndex: "code",
    width: 100
  },
  {
    title: "车位类型",
    dataIndex: "parkingType",
    width: 100
  },
  {
    title: "车位状态",
    dataIndex: "parkingStatus",
    width: 120
  },
  {
    title: "建筑面积(㎡)",
    dataIndex: "parkingAreaUnits",
    width: 120
  },
  {
    title: "使用面积(㎡)",
    dataIndex: "useArea",
    width: 120
  },
  {
    title: "公摊面积(㎡)",
    dataIndex: "shareArea",
    width: 120
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 100
  }
];

export const areaTitle = [
  {
    width: 140,
    align: 'center',
    title: "区域名称",
    dataIndex: "areaName",
    isRequired:true,
    component:'text',
    errMessage: '请输入区域名称',
    placeHolder:'请输入区域名称',
    scopedSlots: { customRender: "areaName" }
  },
  {
    width: 140,
    align: 'center',
    title: "区域编码",
    dataIndex: "areaCode",
    isRequired:true,
    component:'text',
    errMessage: '请输入区域编码',
    placeHolder:'请输入区域编码',
    scopedSlots: { customRender: "areaCode" }
  },
  {
    width: 140,
    align: 'center',
    title: "区域面积(㎡)",
    dataIndex: "areaZone",
    isRequired:true,
    component:'input',
    errMessage: '请输入区域面积',
    placeHolder:'请输入区域面积',
    scopedSlots: { customRender: "areaZone" }
  },
  {
    width: 200,
    align: 'center',
    title: "区域车位数",
    component:'input',
    dataIndex: "areaPosiNums",
    placeHolder:'请输入区域车位数',
    scopedSlots: { customRender: "areaPosiNums" }
  },
  {
    width: 200,
    title: "描述",
    align: 'center',
    component:'input',
    dataIndex: "areaDescription",
    placeHolder:'请输入描述',
    scopedSlots: { customRender: "areaDescription" }
  },
  {
    width: 200,
    title: "图片",
    align: 'center',
    component:'image',
    dataIndex: "otherImg",
    scopedSlots: { customRender: "otherImg" }
  },
  {
    width: 100,
    align: 'center',
    dataIndex: "operation",
    slots: { title: 'operationTitle'},
    scopedSlots: { customRender: "operation" }
  },

]
export const validateTable = [
  {
    name:'',
    message: '',
  },
]