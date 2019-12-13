// 资产视图业务-资产视图详情页面-详情信息的字段集合
// detail: 细节信息；columns：列表列头
const keys = {
  // 接管信息
  receiveInfo: {
    title: '接管信息',
    details: {},
    table: {
      rowKey: 'warrantNbr',
      columns: [
        { title: '权属类型', dataIndex: 'kindOfRightName' },
        { title: '权证号', dataIndex: 'warrantNbr' },
        { title: '权属人', dataIndex: 'obligeeNames' },
        { title: '证件号码', dataIndex: 'certificateNos' },
        { title: '所有权来源', dataIndex: 'wu' },
        { title: '丘地号', dataIndex: 'lotNo' },
        { title: '不动产单元号', dataIndex: 'estateUnitCode' },
        { title: '坐落位置', dataIndex: 'seatingPosition' },
        { title: '用途', dataIndex: 'ownershipUseName' }
      ]
    }
  },
  // 权属信息
  ownInfo: {
    title: '权属信息',
    details: {
      ownerTypeName: '权属形式',
      ownershipStatusName: '权属状态'
    },
    table: {
      tableTitle: '当前权证信息', // 非必须
      rowKey: 'warrantNbr',
      columns: [
        { title: '权属类型', dataIndex: 'kindOfRightName' },
        { title: '权证号', dataIndex: 'warrantNbr' },
        { title: '权属人', dataIndex: 'obligeeNames' },
        { title: '证件号码', dataIndex: 'certificateNos' },
        { title: '丘地号', dataIndex: 'lotNo' },
        { title: '不动产单元号', dataIndex: 'estateUnitCode' },
        { title: '坐落位置', dataIndex: 'seatingPosition' },
        { title: '用途', dataIndex: 'ownershipUseName' }
      ]
    },
    table2: {
      tableTitle: '权属办理记录',
      rowKey: 'warrantNbr',
      columns: [
        { title: '业务类型', dataIndex: 'registerTypeName' },
        { title: '原权证号', dataIndex: 'oldWarrantNbr' },
        { title: '新权证号', dataIndex: 'warrantNbr' },
        { title: '申请人', dataIndex: 'createByName' },
        { title: '申请日期', dataIndex: 'createTime' }
      ]
    }
  }
}

export default keys
