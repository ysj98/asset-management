export const tableHeader = [
  {
    align: 'center',
    width: 110,
    title: '资产类型',
    dataIndex: 'codeTypeName',
    scopedSlots: { customRender: 'codeTypeName' },
  },
  {
    width: '30%',
    align: 'center',
    title: '默认编码规则',
    dataIndex: 'defaultCode',
    scopedSlots: { customRender: 'defaultCode' },
  },
  {
    width: '30%',
    align: 'center',
    title: '自定义编码规则',
    dataIndex: 'customCode',
    scopedSlots: { customRender: 'customCode' },
  },
  {
    width: '30%',
    align: 'center',
    title: '预览',
    dataIndex: 'preview',
    scopedSlots: { customRender: 'preview' },
  },
  {
    width: '170px',
    title: "操作",
    align: 'center',
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  }
]

export const rules = {
  startCodeValidate () {},
  codeLengthValidate (rule, value, callback) {
    if (value === '' || value === 0) {
      callback(new Error('请输入序列长度'));
    } else {
      callback();
    }
  }
}

export const mock = [
  {
    codeTypeName: '资产类型',
    defaultCode: '默认编码规则',
    customCode: '自定义编码规则',
    preview: '预览'
  },
  {
    codeTypeName: '资产类型',
    defaultCode: '默认编码规则',
    customCode: '自定义编码规则',
    preview: '预览'
  },
  {
    codeTypeName: '资产类型',
    defaultCode: '默认编码规则',
    customCode: '自定义编码规则',
    preview: '预览'
  },
]
export const menuList =  [
  {
    "param": [
      {
        "name": "yyyyMMdd",
        "id": 1
      },
      {
        "name": "yyyy.MM.dd",
        "id": 2
      },
      {
        "name": "yyyy-MM-dd",
        "id": 3
      },
      {
        "name": "yyyy年MM月dd日",
        "id": 4
      },
      {
        "name": "yyyy",
        "id": 5
      },
      {
        "name": "MM",
        "id": 6
      },
      {
        "name": "dd",
        "id": 7
      }
    ],
    "name": "日期"
  },
  {
    "param": [
      {
        "name": "HHmm",
        "id": 1
      },
      {
        "name": "HHmmss",
        "id": 2
      }
    ],
    "name": "时间"
  },
  {
    "param": [
      {
        "name": "仅当前公司编码",
        "id": 1
      },
      {
        "name": "前缀上层公司编码",
        "id": 2
      },
      {
        "name": "项目人事组织编码 ",
        "id": 3
      },
      {
        "name": "组织编码",
        "id": 4
      }
    ],
    "name": "公司编码"
  },
  {
    "param": [
      {
        "name": "默认文本格式",
        "id": 1
      },
      {
        "name": "合同录入人工号",
        "id": 2
      },
      {
        "name": "招商经理工号",
        "id": 3
      }
    ],
    "name": "组织机构名称"
  },
  {
    "param": [
      {
        "name": "默认文本格式",
        "id": 1
      },
      {
        "name": "合同录入人工号",
        "id": 2
      },
      {
        "name": "招商经理工号",
        "id": 3
      }
    ],
    "name": "用户名称"
  },
  {
    "param": "1000",
    "name": "序号"
  },
  {
    "param": [
      {
        "name": "资源大类",
        "id": 1
      },
      {
        "name": "资源细分类型",
        "id": 2
      }
    ],
    "name": "资源类型"
  }
]
