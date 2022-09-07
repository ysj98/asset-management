const tableColumns = [
  {
    title: '经营单位',
    dataIndex: 'businessUnit',
    key: 'businessUnit',
    width: '120px',
  },
  {
    title: '资产项目',
    dataIndex: 'projectName',
    key: 'projectName',
    width: '120px',
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    key: 'assetTypeName',
    width: '120px',
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    key: 'assetCode',
    width: '200px',
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
    key: 'assetName',
    width: '200px',
  },
  {
    title: '资产面积',
    dataIndex: 'assetArea',
    key: 'assetArea',
    width: '100px',
  },
  {
    title: '权属情况',
    dataIndex: 'ownershipStatus',
    key: 'ownershipStatus',
    width: '100px',
  },
  {
    title: '权证号',
    dataIndex: 'warrantNbr',
    key: 'warrantNbr',
    width: '200px',
  },
  {
    title: '权证类型',
    dataIndex: 'kindOfRightName',
    key: 'kindOfRightName',
    width: '100px',
  },
  {
    title: '权证面积',
    dataIndex: 'shipArea',
    key: 'shipArea',
    width: '100px',
  },
  {
    title: '面积差异',
    dataIndex: 'diffArea',
    key: 'diffArea',
    width: '100px',
  },
];
const ownershipStatus = {
  0: '无证',
  1: '有证',
  2: '待办',
};
export { tableColumns, ownershipStatus };
