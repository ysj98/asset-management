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
  equipmentInstNameOrCode: [], // 设备实力名称或编码
  pageNo: 1,
  communityId: '', //运营项目
  equipmentId: undefined, // 设备设施分类Id
  pageLength: 10,
  isCurrent: 0
};
// 资产状态
export const approvalStatusData = [
  { label: '全部状态', value: ''},
  { label: '待入库', value: '0'},
  { label: '正常', value: '1'},
  { label: '报废', value: '2'},
  { label: '转让', value: '3'},
  { label: '报损', value: '4'},
  { label: '已出库', value: '5'},
  { label: '已取消', value: '6' },
  { label: '入库中', value: '7' }
]

export const columns = [
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