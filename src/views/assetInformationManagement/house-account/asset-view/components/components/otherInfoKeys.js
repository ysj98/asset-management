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
  },
  // 附属&配套
  accessoryInfo: {
    title: '附属&配套',
    details: {},
    table: {
      rowKey: 'matchingName',
      columns: [
        { title: '名称', dataIndex: 'matchingName' },
        { title: '编号', dataIndex: 'matchingCode' },
        { title: '类型', dataIndex: 'matchingTypeName' },
        { title: '规格型号', dataIndex: 'specificationType' },
        { title: '登记日期', dataIndex: 'createTime' },
        { title: '价值(元)', dataIndex: 'value' },
        { title: '数量', dataIndex: 'number' },
        { title: '计量单位', dataIndex: 'unitOfMeasurementName' },
        { title: '使用情况', dataIndex: 'statusName' },
        { title: '是否接管前配套&配套', dataIndex: 'isBeforeName' },
        { title: '备注', dataIndex: 'remark' }
      ]
    }
  },
  // 资产处置
  disposeInfo: {
    title: '资产处置',
    details: {
      cleaningOrderId: '清理单编号',
      createTime: '清理时间',
      cleanupTypeName: '清理原因'
    },
    table: {
      rowKey: 'disposeRegisterOrderId',
      columns: [
        { title: '处理单编号', dataIndex: 'disposeRegisterOrderId' },
        { title: '处置名称', dataIndex: 'disposeName' },
        { title: '处置类型', dataIndex: 'disposeTypeName' },
        { title: '处置方式', dataIndex: 'disposeModeName' },
        { title: '处置日期', dataIndex: 'disposeDate' },
        { title: '负责人', dataIndex: 'assetReceiver' },
        { title: '相关人(机构)', dataIndex: 'organName' },
        { title: '处置成本(元)', dataIndex: 'disposeCost' },
        { title: '处置收入(元)', dataIndex: 'disposeReceive' },
        { title: '备注', dataIndex: 'remark' }
      ]
    }
  },
  // 相关费用
  relatedExpenses : {
    title: '相关费用',
    details: {
    },
    table: {
      rowKey: 'key',
      pagination: true,
      columns: [
        { title: '类别', dataIndex: 'reportBillIdName' },
        { title: '费用/收入类型', dataIndex: 'incomeType' },
        { title: '费用/收入名称', dataIndex: 'incomeName' },
        { title: '所属月份', dataIndex: 'month' },
        { title: '金额(元)', dataIndex: 'amount' },
        { title: '单价', dataIndex: 'unitPrice' },
        { title: '读数', dataIndex: 'readNumber' },
        { title: '用量', dataIndex: 'useLevel' },
        { title: '是否结清', dataIndex: 'settleUpName' },
        { title: '备注', dataIndex: 'remark' }
      ]
    }
  },
}

export default keys
