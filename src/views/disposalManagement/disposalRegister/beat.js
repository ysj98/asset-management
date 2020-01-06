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
    title: "处置成本(元)",
    dataIndex: "disposeCost",
    scopedSlots: { customRender: "disposeCost" },
    width: '10%'
  },
  {
    title: "处置收入(元)",
    dataIndex: "disposeReceive",
    scopedSlots: { customRender: "disposeReceive" },
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
    scopedSlots: { customRender: "operation" },
    align: 'center',
    width: '8%'
  }
]

export const receivingData = [{
    title: "编号",
    dataIndex: "indexKey",
    align: 'center',
    width: '6%'
  }, {
    title: "收付款类型",
    dataIndex: "receivecostType",
    align: 'center',
    scopedSlots: { customRender: "receivecostType" },
    width: '14%'
  }, {
    title: "收款方",
    dataIndex: "payee",
    align: 'center',
    scopedSlots: { customRender: "payee" },
    width: '10%'
  }, {
    title: "付款方",
    dataIndex: "payer",
    align: 'center',
    scopedSlots: { customRender: "payer" },
    width: '10%'
  }, {
    title: "费用科目",
    dataIndex: "feeSubject",
    align: 'center',
    scopedSlots: { customRender: "feeSubject" },
    wwidth: '14%'
  }, {
    title: "金额(元)",
    dataIndex: "amount",
    align: 'center',
    scopedSlots: { customRender: "amount" },
    width: '10%'
  },
  {
    title: "收付款时间",
    dataIndex: "receivecostDate",
    align: 'center',
    scopedSlots: { customRender: "receivecostDate" },
    width: '10%'
  },
  {
    title: "跟进人",
    dataIndex: "secondMover",
    align: 'center',
    scopedSlots: { customRender: "secondMover" },
    width: '10%'
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: 'center',
    scopedSlots: { customRender: "remark" },
    width: '10%'
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    align: 'center',
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
