// formType: input: 输入框  inputNumber: 数字输入框  selcet：选择框   date:时间选择
// 权利类型：使用权证列表展示
export const accessCard = [
  {
    label: '房屋所有权人',
    attrCode: 'houseOwner',
    formType: 'input',
    attrValue: '',
    max: 40,
    required: true
  },
  {
    label: '承租人',
    attrCode: 'tenant',
    formType: 'input',
    attrValue: '',
    max: 40,
    required: true
  },
  {
    label: '委托管理单位',
    attrCode: 'entrustOrganization',
    formType: 'input',
    attrValue: '',
    max: 40,
    required: true
  },
  {
    label: '建筑面积(㎡)',
    attrCode: 'buildArea',
    formType: 'inputNumber',
    attrValue: '',
    min: 0,
    max: 9999999.99,
    precision: 2,
    required: true
  },
  {
    label: '专有建筑面积(㎡)',
    attrCode: 'exclusiveBuildArea',
    formType: 'inputNumber',
    attrValue: '',
    min: 0,
    precision: 2,
    max: 9999999.99,
    required: true
  },
  {
    label: '分摊面积(㎡)',
    attrCode: 'apportionArea',
    formType: 'inputNumber',
    attrValue: '',
    min: 0,
    max: 9999999.99,
    precision: 2,
    required: true
  },
  {
    label: '坐落位置',
    attrCode: 'seatingPosition',
    formType: 'input',
    attrValue: '',
    max: 100,
    required: true
  },
  {
    label: '用途',
    attrCode: 'ownershipUse',
    chooseArray: [],
    formType: 'selcet',
    attrValue: '',
    required: true
  },
  {
    label: '结构',
    attrCode: 'structure',
    chooseArray: [],
    formType: 'selcet',
    attrValue: '',
    required: true
  },
  {
    label: '总层数',
    attrCode: 'totalFloor',
    formType: 'input',
    attrValue: '',
    max: 30,
    required: false
  },
  {
    label: '所在层',
    attrCode: 'placefloor',
    formType: 'input',
    max: 30,
    attrValue: '',
    required: false
  },
  {
    label: '房屋号',
    attrCode: 'houseNo',
    formType: 'input',
    attrValue: '',
    max: 30,
    required: false
  },
  {
    label: '租金单价',
    attrCode: 'rentUnitPrice',
    formType: 'input',
    attrValue: '',
    max: 30,
    required: false
  },
  {
    label: '租金总价',
    attrCode: 'rentTotalPrice',
    formType: 'inputNumber',
    attrValue: '',
    min: 0,
    max: 9999999.99,
    precision: 2,
    required: false
  },
  {
    label: '合同期限',
    attrCode: 'contractData',
    formType: 'input',
    attrValue: '',
    max: 30,
    required: false
  },
  {
    label: '议价租金单价',
    attrCode: 'talkUnitPrice',
    formType: 'input',
    attrValue: '',
    max: 30,
    required: false
  },
  {
    label: '议价租金总价',
    attrCode: 'talkTotalPrice',
    formType: 'inputNumber',
    precision: 2,
    attrValue: '',
    min: 0,
    max: 9999999.99,
    required: false
  },
  {
    label: '租金缴纳期限',
    attrCode: 'rentPayDate',
    formType: 'input',
    attrValue: '',
    max: 30,
    required: false
  },
  {
    label: '产别',
    attrCode: 'antenatal',
    formType: 'input',
    attrValue: '',
    max: 30,
    required: false
  },
  {
    label: '登记日期',
    attrCode: 'rigisterDate',
    formType: 'date',
    attrValue: '',
    required: true
  },
  {
    label: '交接日期',
    attrCode: 'handoverDate',
    formType: 'date',
    attrValue: '',
    required: true
  }
]

// 权利类型：产权证列表展示
export const titleDeed = [
  {
    label: '丘地号',
    attrCode: 'lotNo',
    formType: 'input',
    attrValue: '',
    max: 30,
    required: true
  },
  {
    label: '不动产单元号',
    attrCode: 'estateUnitCode',
    formType: 'input',
    attrValue: '',
    max: 30,
    required: true
  },
  {
    label: '坐落位置',
    attrCode: 'seatingPosition',
    formType: 'input',
    attrValue: '',
    max: 100,
    required: true
  },
  {
    label: '土地面积(㎡)',
    attrCode: 'landArea',
    formType: 'inputNumber',
    attrValue: '',
    min: 0,
    max: 9999999.99,
    precision: 2,
    required: false
  },
  {
    label: '权属用途',
    attrCode: 'ownershipUse',
    chooseArray: [],
    formType: 'selcet',
    attrValue: '',
    required: true
  },
  {
    label: '结构',
    attrCode: 'structure',
    chooseArray: [],
    formType: 'selcet',
    attrValue: '',
    required: true
  },
  {
    label: '建筑面积(㎡)',
    attrCode: 'buildArea',
    formType: 'inputNumber',
    attrValue: '',
    min: 0,
    precision: 2,
    max: 9999999.99,
    required: true
  },
  {
    label: '专属建筑面积',
    attrCode: 'exclusiveBuildArea',
    formType: 'inputNumber',
    attrValue: '',
    min: 0,
    precision: 2,
    max: 9999999.99,
    required: true
  },
  {
    label: '分摊面积(㎡)',
    attrCode: 'apportionArea',
    formType: 'inputNumber',
    attrValue: '',
    min: 0,
    max: 9999999.99,
    precision: 2,
    required: true
  },
  {
    label: '总套数',
    attrCode: 'totalSuite',
    formType: 'inputNumber',
    attrValue: '',
    min: 0,
    max: 9999999.99,
    precision: 0,
    required: false
  },
  {
    label: '权利性质',
    attrCode: 'qualityOfRight',
    chooseArray: [],
    formType: 'selcet',
    attrValue: '',
    required: true
  },
  {
    label: '使用期限',
    attrCode: 'useLimitDate',
    formType: 'input',
    attrValue: '',
    max: 50,
    required: false
  },
  {
    label: '登记日期',
    attrCode: 'rigisterDate',
    formType: 'date',
    attrValue: '',
    required: true
  },
  {
    label: '交接日期',
    attrCode: 'handoverDate',
    formType: 'date',
    attrValue: '',
    required: true
  }
]

export const newCardData = {
  warrantId: '',                   // 类型：Number  必有字段  备注：权证id
  warrantNbr: '',                  // 类型：String  必有字段  备注：权证号
  ownerType: undefined,            // 类型：Number  必有字段  备注：权属形式
  kindOfRight: undefined,          // 类型：Number  必有字段  备注：权利类型
  lotNo: '',                       // 类型：String  必有字段  备注：丘地号(产权证所有)
  estateUnitCode: '',              // 类型：String  必有字段  备注：不动产单元号(产权证所有)
  seatingPosition: '',             // 类型：String  必有字段  备注：坐落位置
  landArea: '',                    // 类型：Number  必有字段  备注：土地面积(产权证所有)
  ownershipUse: undefined,         // 类型：String  必有字段  备注：权属用途
  structure: undefined,            // 类型：String  必有字段  备注：结构
  buildArea: '',                   // 类型：Number  必有字段  备注：建筑面积
  exclusiveBuildArea: '',          // 类型：Number  必有字段  备注：专属建筑面积
  apportionArea: '',               // 类型：Number  必有字段  备注：分摊面积
  totalSuite: '',                  // 类型：Number  必有字段  备注：总套数(产权证所有)
  qualityOfRight: undefined,       // 类型：String  必有字段  备注：权利性质(产权证所有)
  useLimitDate: '',                // 类型：String  必有字段  备注：使用期限(产权证所有)
  rigisterDate: {},                // 类型：String  必有字段  备注：登记日期
  organId: '',                     // 类型：String  必有字段  备注：组织机构
  remark: '',                      // 类型：String  必有字段  备注：备注
  handoverDate: '',                // 类型：String  必有字段  备注：交接日期
  houseOwner: '',                  // 类型：String  必有字段  备注：房屋所有权人(使用权证所有)
  tenant: '',                      // 类型：String  必有字段  备注：承租人(使用权证所有)
  entrustOrganization: '',         // 类型：String  必有字段  备注：委托管理单位(使用权证所有)
  totalFloor: '',                  // 类型：String  必有字段  备注：总层数(使用权证所有)
  placefloor: '',                  // 类型：String  必有字段  备注：所在层(使用权证所有)
  houseNo: '',                     // 类型：String  必有字段  备注：房屋号(使用权证所有)
  rentUnitPrice: '',               // 类型：Number  必有字段  备注：租金单价(使用权证所有)
  rentTotalPrice: '',              // 类型：Number  必有字段  备注：租金总价(使用权证所有)
  contractData: '',                // 类型：String  必有字段  备注：合同期限(使用权证所有)
  talkUnitPrice: '',               // 类型：String  必有字段  备注：议价单价(使用权证所有)
  talkTotalPrice: '',              // 类型：String  必有字段  备注：议价租金总价(使用权证所有)
  rentPayDate: '',                 // 类型：String  必有字段  备注：租金缴纳期限(使用权证所有)
  antenatal: '',                   // 类型：String  必有字段  备注：产别(使用权证所有)
  files: []                        // 附件
}

export const columns = [
  {
    title: '姓名',
    dataIndex: 'obligeeId',
    width: 160,
    scopedSlots: { customRender: 'obligeeId' }
  }, {
    title: '证件种类',
    width: 100,
    dataIndex: 'certificateTypeName'
  }, {
    title: '证件号',
    width: 100,
    dataIndex: 'certificateNo'
  }, {
    title: '占用比例',
    width: 100,
    dataIndex: 'percent',
    scopedSlots: { customRender: 'percent' }
  }, {
    title: '操作',
    width: 100,
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]
export const mortgageInformation = [
  {
    title: '抵押金额(元)',
    dataIndex: 'mortgageAmount',
    scopedSlots: { customRender: 'mortgageAmount' }
  }, {
    title: '抵押权人',
    dataIndex: 'pledgee',
    scopedSlots: { customRender: 'pledgee' }
  }, {
    title: '抵押银行',
    dataIndex: 'mortgageBank',
    scopedSlots: { customRender: 'mortgageBank' }
  }, {
    title: '抵押年限',
    dataIndex: 'mortgageYear',
    scopedSlots: { customRender: 'mortgageYear' },
  }, {
    title: '抵押物名称',
    dataIndex: 'mortgageName',
    scopedSlots: { customRender: 'mortgageName' }
  },
  {
    title: '借款合同编号',
    dataIndex: 'loanContractName',
    width: 110,
    scopedSlots: { customRender: 'loanContractName' }
  }, {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'operation' }
  }
]

