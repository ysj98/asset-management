/*
 * @Date: 2020-07-16 11:25:27
 * @Description:
 */
// 页面跳转
export const operationTypes = {
  create: "/buildingDict/createPark",
  detail: "/buildingDict/detailViewPark",
  edit: '/buildingDict/editPark'
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
  typeId: '', // 类型
  nameOrCode: '', // 土地名称/编码/宗地号
  pageNo: 1,
  pageLength: 10,
  onlyCurrentNode: 0
};
export const communityIdOpt = [
  { label: "全部运营项目", value: "" },
]
export const parkTypeOpt = [
  { label: "全部车场类型", value: "" },
]
export const columns = [
  {
    title: "车场ID",
    dataIndex: "placeId",
    width: 120
  },
  {
    title: "车场名称",
    dataIndex: "placeName",
    width: 120
  },
  {
    title: "车场编码",
    dataIndex: "placeCode",
    width: 120
  },
  {
    title: "车场面积(㎡)",
    dataIndex: "placeArea",
    width: 120
  },
  {
    title: "运营项目",
    dataIndex: "communityName",
    width: 120
  },
  {
    title: "车场类型",
    dataIndex: "typeName",
    width: 100
  },
  {
    title: "车位数",
    dataIndex: "placeNums",
    width: 100
  },
  {
    title: "车场位置",
    dataIndex: "placeAddr",
    width: 120
  },
  // {
  //   title: "交付时间",
  //   dataIndex: "approvalDate",
  //   width: 120
  // },
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
    dataIndex: "areaName",
    maxLength: 64,
    isRequired:true,
    component:'text',
    errMessage: '请输入区域名称',
    placeHolder:'请输入区域名称',
    slots: { title: 'areaNameTitle'},
    scopedSlots: { customRender: "areaName" }
  },
  {
    width: 140,
    align: 'center',
    maxLength: 64,
    dataIndex: "areaCode",
    isRequired:true,
    component:'text',
    errMessage: '请输入区域编码',
    placeHolder:'请输入区域编码',
    slots: { title: 'areaCodeTitle'},
    scopedSlots: { customRender: "areaCode" }
  },
  {
    width: 140,
    align: 'center',
    maxLength: 18,
    title: "区域面积(㎡)",
    dataIndex: "areaZone",
    component:'number',
    errMessage: '请输入区域面积',
    placeHolder:'请输入区域面积',
    rules: [{required: false, pattern: new RegExp(/^\d{1,13}(?:\.\d{1,4})?$/), message: '请输入小于13位整数，小于4位精度的数值'}],
    scopedSlots: { customRender: "areaZone" }
  },
  {
    width: 200,
    align: 'center',
    maxLength: 128,
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
    component:'textarea',
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