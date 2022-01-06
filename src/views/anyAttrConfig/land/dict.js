/*
 * @Date: 2020-07-16 11:25:27
 * @Description:
 */
// 页面跳转
import moment from "moment";

export const operationTypes = {
};
export const appendOperation = {
  assetType : "", // 资产类型
  organId: "", // 一级组织机构id
  attrCode: "", // 属性编码
  attrName: "", // 属性名称
  status: 1, // 是否启用（1：是、0：否）
  isDelete: 0, // 是否删除（1：是、0：否）
}
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
  assetType : "", // 资产类型
  organId: "", // 一级组织机构id
  attrName: "", // 属性名称
  status: "", // 是否启用（1：是、0：否）
  pageNum: 1,
  pageSize: 10,
};
// 资产状态
export const statusOptions = [
  { label: '全部状态', value: ''},
  { label: '启用', value: '1'},
  { label: '停用', value: '0'},
]
export const columns = [
  {
    width: 120,
    title: "序号",
    align: "center",
    dataIndex: "index",
    customRender: (text,record,index) => `${index+1}`,
  },
  {
    title: "编码",
    align: "center",
    dataIndex: "attrCode",
    width: 120
  },
  {
    align: "center",
    title: "业务属性字段",
    dataIndex: "attrName",
    width: 500
  },
  {
    title: "启用状态",
    align: "center",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
    width: 120
  },
  {
    align: "center",
    title: "操作",
    dataIndex: "operate",
    scopedSlots: { customRender: "operate" },
    width: 100
  },
];

// 时间戳转换格式化时间
export function timeStampToFormatDate (date) {
  return moment(date * 1000).format('YYYY-MM-DD')
}