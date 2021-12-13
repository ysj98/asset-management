/*
 * @Date: 2020-07-16 11:25:27
 * @Description:
 */
// 页面跳转
import moment from "moment";

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
  topOrganId: '', // 所属组织机构
  equipmentInstNameOrCode: '', // 设备实力名称或编码
  pageNo: 1,
  communityId: '', //运营项目
  equipmentId: undefined, // 设备设施分类Id
  pageLength: 10,
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
    title: "编码",
    align: "center",
    dataIndex: "Index",
    width: 120
  },
  {
    align: "center",
    title: "业务属性字段",
    dataIndex: "equipmentInstName",
    width: 500
  },
  {
    align: "center",
    title: "图层颜色",
    dataIndex: "TCYS",
    scopedSlots: { customRender: "TCYS" },
    width: 100
  },
];

// 时间戳转换格式化时间
export function timeStampToFormatDate (date) {
  return moment(date * 1000).format('YYYY-MM-DD')
}