/*
 * @Date: 2020-07-16 11:25:27
 * @Description:
 */
// 页面跳转
export const operationTypes = {
  create: "/buildingDict/createStall",
  detail: "/buildingDict/detailViewStall",
  edit: '/buildingDict/editStall'
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
  communityId: '', // 运营项目
  objType: '', // 车场类型
  parkingPlaceStr: '',
  parkingAreaId: '', // 区域
  objStatus: '',
  placeId: '', // 车场Id
  pageNo: 1,
  pageLength: 10,
  isOnlyCurrent: '',
  isRegister: '' // 获取资产登记
};
// 车位用途
export const parkingUsageOption = [
  {
    value: '1',
    label: '运营车位'
  },
  {
    value: '2',
    label: '销售车位'
  }
]
// 车位类型
export const carTypeMenu = {
  PROPERTY_PARKING_OBJ_STATUS: 'PROPERTY_PARKING_OBJ_STATUS', // 产权
  PARKING_OBJ_STATUS: 'PARKING_OBJ_STATUS' // 临时/固定
}
export const carTypeOptions = [
  {label:'全部车位类型',value: ''}
]
export const communityIdOpt = [
  { label: "全部运营项目", value: "" },
]
export const parkTypeOpt = [
  { label: "全部车场", value: "" },
]
export const registerList = [
  { label: "是否登记资产", value: "" },
  { label: "是", value: "1" },
  { label: "否", value: "0" }
];
export const carStatusOpt = [
  { label: "全部状态", value: "" },
]
export const parkAreaOpt = [
  { label: "全部区域", value: "" },
]
export const columns = [
  {
    title: "车位ID",
    dataIndex: "parkingId",
    width: 120
  },
  {
    title: "车场名称",
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
    dataIndex: "floorArea",
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
    title: "是否登记资产",
    dataIndex: "isRegisterName",
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