/**
 * 描述：开发菜单配置
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */
export default [
  {
    title: '资产信息管理',
    children: [
      {
        title: '资产变动',
        path: '/assetChange'
      },
      {
        title: '资产清理',
        path: '/assetClear'
      },
      {
        title: '资产项目管理',
        path: '/assetProjectManage'
      },
      {
        title: '资产登记',
        path: '/assetRegister'
      },
      {
        title: '房屋台账',
        path: '/houseStandingBook'
      },
      {
        title: '附属配套管理',
        path: '/subsidiary'
      }
    ]
  },
  {
    title: '基础信息管理',
    children: [
      {
        title: '楼盘字典',
        path: '/buildingDict'
      },
      {
        title: '资产分类设置',
        path: '/assetClassSet'
      },
    ]
  },
  {
    title: '权属管理',
    children: [
      {
        title: '权属人管理',
        path: '/propertyOwnerManagement'
      },
      {
        title: '权属登记',
        path: '/ownershipRegistration'
      },
      {
        title: '权证管理',
        path: '/authorityCardManagement'
      },
      {
        title: '权属概况',
        path: '/ownershipSurvey'
      }
    ]
  },
  {
    title: '账务管理',
    children: [
      {
        title: '资产入账',
        path: '/assetEntry'
      },
      {
        title: '价值登记',
        path: '/worthRegister'
      }
    ]
  },
  {
    title: '盘点管理',
    children: [
      {
        title: '盘点任务',
        path: '/inventoryManagement/countingTask'
      },
      {
        title: '盘点执行',
        path: '/inventoryManagement/inventoryPerform'
      },
      {
        title: '盘点报告',
        path: '/inventoryManagement/inventoryReport'
      },
      {
        title: '异常管理',
        path: '/inventoryManagement/exceptionManagement'
      },
      {
        title: '盘点计划',
        path: '/inventoryPlan',
      },
    ]
  },
  {
    title: '处置管理',
    children: [
      {
        title: '资产处置一览表',
        path: '/disposalManagement/listDisposal'
      },
      {
        title: '处置登记',
        path: '/disposalRegister',
        
      },
    ]
  },
  {
    title: '呈报管理',
    children: [
      {
        title: '呈报表单',
        path: '/reportingManagement/submitForm'
      },
      {
        title: '呈报计划',
        path: '/reportingManagement/submitPlans',
        
      },
      {
        title: '资产呈报记录',
        path: '/reportingRecord'
      }
    ]
  },
  {
    title: '示例：基本',
    children: [
      {
        title: '首页',
        path: '/home'
      },
      {
        title: '登录页面',
        path: '/dev/login'
      },
      {
        title: '按钮权限',
        path: '/dev/power'
      },
      {
        title: '公共方法',
        path: '/dev/utils'
      },
      {
        title: '组织机构树',
        path: '/dev/empty'
      },
      {
        title: '文件 or 图片上传',
        path: '/dev/upload'
      },
      {
        title: '富文本编辑器',
        path: '/dev/editer'
      }
    ]
  },
  {
    title: '示例：表单',
    children: [
      {
        title: '基础表单',
        path: '/dev/empty'
      },
      {
        title: '分步表单',
        path: '/dev/empty'
      },
      {
        title: '高级表单',
        path: '/dev/empty'
      }
    ]
  },
  {
    title: '示例：列表',
    children: [
      {
        title: '查询表格',
        path: '/dev/empty'
      }
    ]
  },
  {
    title: '示例：详情页',
    children: [
      {
        title: '基础详情',
        path: '/dev/empty'
      },
      {
        title: '高级详情',
        path: '/dev/empty'
      },
    ]
  },
  {
    title: '示例：结果页',
    children: [
      {
        title: '成功',
        path: '/dev/empty'
      },
      {
        title: '失败',
        path: '/dev/empty'
      },
    ]
  },
]
