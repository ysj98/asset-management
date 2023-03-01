/*
 * @Date: 2020-09-09 18:10:53
 * @Description:
 * @Author: chh
 */
export const allStyle = {
  width: '170px',
  'margin-right': '10px',
  // "margin-top": "14px"
};
export const allWidth = {
  width: '170px',
  'margin-right': '10px',
  'margin-top': '14px',
  height: '32px',
  overflow: 'hidden',
};
export const queryCondition = {
  organId: '',
  projectIdList: [''],
  assetTypeList: [''], // 资产类型
  approvalStatusList: [''], // 请选择登记状态
  assetNameCode: '', // 输入资产名称
  registerTypeList: [''], // 请选择登记类型
  objectTypeList: [''], // 请选择资产分类
  registerNameCode: '', // 权属登记单编码
  startDate: '',
  endDate: '',
  pageNum: 1,
  pageSize: 10,
};
export const projectIdListOpt = [{ label: '全部资产项目', value: '' }];
export const assetTypeListOpt = [{ label: '全部资产类型', value: '' }];
export const approvalStatusListOpt = [
  {
    label: '全部状态',
    value: '',
  },
  {
    label: '草稿',
    value: '0',
  },
  {
    label: '待审批',
    value: '2',
  },
  {
    label: '已驳回',
    value: '3',
  },
  {
    label: '已审批',
    value: '1',
  },
  {
    label: '已取消',
    value: '4',
  },
];
export const registerTypeListOpt = [{ label: '全部登记类型', value: '' }];
export const objectTypeListOpt = [{ label: '全部资产分类', value: '' }];
export let columns = [
  {
    title: '登记编号',
    dataIndex: 'registerDetailId',
    width: '150px',
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: '200px',
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: '150px',
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: '150px',
  },
  {
    title: '资产分类',
    dataIndex: 'assetCategoryName',
    width: '150px',
  },
  {
    title: '管理机构',
    dataIndex: 'organName',
    width: '150px',
  },
  {
    title: '资产项目',
    dataIndex: 'projectName',
    width: '150px',
  },
  {
    title: '登记单编号',
    dataIndex: 'registerId',
    width: '150px',
  },
  {
    title: '登记类型',
    dataIndex: 'registerTypeName',
    width: '150px',
  },
  {
    title: '原权证号',
    dataIndex: 'oldWarrantNbr',
    width: '150px',
  },
  {
    title: '新权证号',
    dataIndex: 'warrantNbr',
    width: '150px',
  },
  {
    title: '登记日期',
    dataIndex: 'createTime',
    width: '150px',
  },
  {
    title: '登记人',
    dataIndex: 'createByName',
    width: '150px',
  },
  {
    title: '状态',
    dataIndex: 'approvalStatusName',
    width: '150px',
  },
];
