/*
 * @Date: 2020-07-16 11:25:27
 * @Description:
 */
// 页面跳转
export const operationTypes = {
  create: "/buildingDict/createLand",
  detail: "/buildingDict/detailLand",
  edit: '/buildingDict/editLand'
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
  landType: '', // 土地类型
  landuse: '', // 土地用途
  status: '', // 土地名称/编码/宗地号
  pageNum: 1,
  pageSize: 10,
  isCurrent: 0
};
export const communityIdOpt = [
  { label: "全部运营项目", value: "" },
]
export const landTypeOpt = [
  { label: "全部土地类型", value: "" },
]
export const landuseOpt = [
  { label: "全部土地用途", value: "" },
]
export const columns = [
  {
    title: "土地ID",
    dataIndex: "blankId",
    width: 120
  },
  {
    title: "土地名称",
    dataIndex: "blankName",
    width: 120
  },
  {
    title: "土地编码",
    dataIndex: "blankCode",
    width: 120
  },
  {
    title: "土地面积(㎡)",
    dataIndex: "buildArea",
    scopedSlots: { customRender: "buildArea" },
    width: 120
  },
  {
    title: "运营项目",
    dataIndex: "communityName",
    width: 120
  },
  {
    title: "宗地号",
    dataIndex: "theNo",
    width: 100
  },
  {
    title: "土地类型",
    dataIndex: "landTypeName",
    width: 100
  },
  {
    title: "土地用途",
    dataIndex: "landuseName",
    width: 100
  },
  {
    title: "土地位置",
    dataIndex: "address",
    width: 120
  },
  {
    title: "批准日期",
    dataIndex: "approvalDate",
    width: 120
  },
  {
    title: "使用年限",
    dataIndex: "serviceLife",
    width: 120
  },
  {
    title: "计容面积(㎡)",
    dataIndex: "acreage",
    width: 120
  },
  {
    title: "容积率",
    dataIndex: "landRate",
    width: 100
  },
  {
    title: "土地上盖建筑物面积(㎡)",
    dataIndex: "structureArea",
    width: 170
  },
  {
    title: "不可开发利用土地面积(㎡)",
    dataIndex: "unavailableArea",
    width: 180
  },
  {
    title: "其他土地面积(㎡)",
    dataIndex: "otherArea",
    width: 120
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 100
  }
];

export const yesOrNoOptions = [
  {
    title:'是',
    value:'1',
    label:'是'
  },
  {
    title:'否',
    value:'0',
    label:'否'
  }
]