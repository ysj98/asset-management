export const columns = [
  {
    title: "资产名称",
    dataIndex: "assetName",
    width: '10%'
  }, {
    title: "资产编码",
    dataIndex: "assetCode",
    width: '10%'
  }, {
    title: "所属机构",
    dataIndex: "organName",
    width: '10%'
  }, {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: '10%'
  }, {
    title: "资产分类",
    dataIndex: "assetCategoryName",
    width: '10%'
  }, {
    title: "资产项目",
    dataIndex: "projectName",
    width: '10%'
  },
  {
    // title: "处置成本(元)",
    slots: {title: 'disposeCost'},
    dataIndex: "disposeCost",
    scopedSlots: { customRender: "disposeCost" },
    width: '10%'
  },
  {
    // title: "处置收入(元)",
    slots: {title: 'disposeReceive'},
    dataIndex: "disposeReceive1",
    scopedSlots: { customRender: "disposeReceive" },
    width: '10%'
  },
  {
    title: "是否需协助办证",
    scopedSlots: { customRender: "isAssistAccreditation" },
    width: '10%',
    align: 'center'
  },
  {
    title: "备注",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
    width: '10%'
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    align: 'center',
    width: '8%'
  }
]

export const transfer = [
  {
    title: "申请单ID",
    dataIndex: "applyId",
    width: '10%'
  },
  {
    title: "所属机构",
    dataIndex: "organName",
    width: '10%'
  },
  {
    title: "申请单名称",
    dataIndex: "name",
    width: '10%'
  },
  {
    title: "资产项目",
    dataIndex: "projectName",
    width: '10%'
  },
  {
    title: "挂牌价格(元)",
    dataIndex: "listingPrice",
    width: '10%'
  },
  {
    title: "提交人",
    dataIndex: "create",
    width: '10%'
  },
  {
    title: "提交时间",
    dataIndex: "createTime",
    width: '10%'
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: 'center',
    scopedSlots: { customRender: "operation" },
    width: '6%'
  }]

export const receivingData = [{
    title: "编号",
    dataIndex: "indexKey",
    width: '6%'
  }, {
    title: "收付款类型",
    dataIndex: "receivecostType",
    scopedSlots: { customRender: "receivecostType" },
    width: '14%'
  }, {
    title: "收款方",
    dataIndex: "payee",
    scopedSlots: { customRender: "payee" },
    width: '10%'
  }, {
    title: "付款方",
    dataIndex: "payer",
    scopedSlots: { customRender: "payer" },
    width: '10%'
  }, {
    title: "费用科目",
    dataIndex: "feeSubject",
    scopedSlots: { customRender: "feeSubject" },
    wwidth: '14%'
  }, {
    title: "金额(元)",
    dataIndex: "amount",
    scopedSlots: { customRender: "amount" },
    width: '10%'
  },
  {
    title: "收付款时间",
    dataIndex: "receivecostDate",
    scopedSlots: { customRender: "receivecostDate" },
    width: '10%'
  },
  {
    title: "跟进人",
    dataIndex: "secondMover",
    scopedSlots: { customRender: "secondMover" },
    width: '10%'
  },
  {
    title: "备注",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
    width: '10%'
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: 'center',
    scopedSlots: { customRender: "operation" },
    width: '6%'
  }]

  export const costSharingModeData = [
  {
    name: '按资产数量平均分摊',
    value: '1'
  },
  {
    name: '按资产面积平均分摊',
    value: '2'
  }
]

export const receiptPayment = [
  {
    label: '收款',
    value: '1'
  },
  {
    label: '付款',
    value: '2'
  }
]

export const conditionalJudgment = [undefined, null, '']
