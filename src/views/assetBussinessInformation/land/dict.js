/*
 * @Date: 2020-07-16 11:25:27
 * @Description:
 */
// 页面跳转
import moment from 'moment';

export const operationTypes = {
  create: '/buildingDict/createEquipment',
  detail: '/buildingDict/detailViewEquipment',
  edit: '/buildingDict/editEquipment',
};
export const allStyle = {
  width: '170px',
  'margin-right': '10px',
  verticalAlign: 'middle',
};
export const allWidth = {
  width: '170px',
  'margin-right': '10px',
  height: '32px',
  verticalAlign: 'middle',
  overflow: 'hidden',
};
export const queryCondition = {
  city: '', // 市
  province: '', // 省
  region: '', // 区
  flag: '', // 类型：0运营；1闲置；2自用；3占用；4其他
  landName: '', // 资产名称/编码模糊查询
  objectTypes: [''], // 资产分类(多选)
  organId: undefined, // 组织机构id
  projectId: [''], //类型：String  必有字段  备注：项目id
  statuss: [''], // 资产状态(多选)
  useTypes: [''], // 用途
  address: '', // 地理位置
  landCategory: '',
  modeOperId: '', // 经营方式
  sourceModes: [''], // 来源方式
};
// 资产状态
export const approvalStatusData = [
  { label: '全部状态', value: '' },
  { label: '待入库', value: '0' },
  { label: '正常', value: '1' },
  { label: '报废', value: '2' },
  { label: '转让', value: '3' },
  { label: '报损', value: '4' },
  { label: '已出库', value: '5' },
  { label: '已取消', value: '6' },
  { label: '入库中', value: '7' },
];
export const editColumns = [
  {
    align: 'center',
    title: '属性名称',
    dataIndex: 'attrName',
    scopedSlots: { customRender: 'attrName' },
    width: 100,
  },
  {
    align: 'center',
    title: '操作',
    dataIndex: 'operate',
    scopedSlots: { customRender: 'operate' },
    width: 300,
  },
];

export const columns = [
  {
    align: 'center',
    title: '操作',
    fixed: 'right',
    dataIndex: 'operate',
    scopedSlots: { customRender: 'operate' },
    width: 100,
  },
];

// 时间戳转换格式化时间
export function timeStampToFormatDate(date) {
  return moment(date * 1000).format('YYYY-MM-DD');
}
