const tableColumns = [
  {
    title: '经营单位',
    dataIndex: 'businessUnit',
    key: 'businessUnit',
  },
  {
    title: '资产项目',
    dataIndex: 'projectName',
    key: 'projectName',
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    key: 'assetTypeName',
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    key: 'assetCode',
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
    key: 'assetName',
  },
  {
    title: '资产面积',
    dataIndex: 'assetArea',
    key: 'assetArea',
  },
  {
    title: '权属情况',
    dataIndex: 'ownershipStatus',
    key: 'ownershipStatus',
  },
  {
    title: '权证号',
    dataIndex: 'warrantNbr',
    key: 'warrantNbr',
  },
  {
    title: '权证类型',
    dataIndex: 'kindOfRightName',
    key: 'kindOfRightName',
  },
  {
    title: '权证面积',
    dataIndex: 'shipArea',
    key: 'shipArea',
  },
  {
    title: '面积差异',
    dataIndex: 'diffArea',
    key: 'diffArea',
  },
];
const ownershipStatus = [
  { value: '0', text: '无证' },
  { value: '1', text: '有证' },
  { value: '2', text: '待办' },
];
export default {
  tableColumns,
  ownershipStatus,
};
