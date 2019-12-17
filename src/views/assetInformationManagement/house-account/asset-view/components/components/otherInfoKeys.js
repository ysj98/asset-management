// 资产视图业务-资产视图详情页面-详情信息的字段集合
// detail: 细节信息，必须存在，可以为{}；columns：列表列头
const keys = {
  // 接管信息
  receiveInfo: {
    title: '接管信息',
    details: {
      projectName: '资产项目',
      sourceTypeName: '来源方式',
      sourceChannelType: '来源渠道',
      organName: '管理机构',
      takeOverDate: '接管日期',
      isTransferOperation: '是否转运营',
      // transferOperationTime: '转运营日期',
      isTransfer: '是否转物业'
      // transferTime: '转物业日期',
    },
    table: {
      rowKey: 'changeOrderDetailId',
      columns: [
        { title: '编号', dataIndex: 'changeOrderDetailId' },
        { title: '交付类型', dataIndex: 'changeTypeName' },
        { title: '交付时间', dataIndex: 'changeDate' },
        { title: '交付面积(㎡)', dataIndex: 'deliverArea' },
        { title: '接收单位', dataIndex: 'deliveryCompany' },
        { title: '终止日期', dataIndex: 'expiryDate' }
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
      rowKey: 'oldWarrantNbr',
      columns: [
        { title: '业务类型', dataIndex: 'registerTypeName' },
        { title: '原权证号', dataIndex: 'oldWarrantNbr' },
        { title: '新权证号', dataIndex: 'warrantNbr' },
        { title: '申请人', dataIndex: 'createByName' },
        { title: '申请日期', dataIndex: 'createTime' }
      ]
    }
  },
  // 变动信息
  changeInfo: {
    title: '变动记录',
    details: {},
    table: {
      rowKey: 'changeOrderDetailId',
      columns: [
        { title: '变动编号', dataIndex: 'changeOrderDetailId' },
        { title: '变动类型', dataIndex: 'changeTypeName' },
        { title: '变动前信息', dataIndex: 'oldChangeInfo' },
        { title: '变动后信息', dataIndex: 'changeInfo' },
        { title: '变动时间', dataIndex: 'changeDate' },
        { title: '变动人', dataIndex: 'createByName' }
      ]
    }
  },
  // 账面信息
  billInfo: {
    title: '账面信息',
    details: {
      cardCode: '财务卡片编号',
      originalValue: '划转时原值(元)',
      netValue: '资产净值(元)'
    },
    table: {
      rowKey: 'index',
      columns: [
        { title: '序号', dataIndex: 'index' },
        { title: '评估基准日', dataIndex: 'assessmenBaseDate' },
        { title: '评估机构', dataIndex: 'assessmentOrganName' },
        { title: '评估方法', dataIndex: 'assessmentMethodName' },
        { title: '评估价值', dataIndex: 'assessmentValue' }
      ]
    }
  }
}

export default keys
