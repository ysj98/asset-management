/**
 * 描述：开发菜单配置
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */
export default [
  {
    title: '报表管理',
    children: [
      { title: '房屋资产统计分析', path: '/houseAssetAnalysis' },
      { title: '资产项目数据查询', path: '/projectData' },
      { title: '有证房屋资产统计表', path: '/houseAssetStatistics' },
      { title: '权证数量统计表', path: '/warrantAmountStatistics' },
      { title: '权属证件一览表', path: '/ownershipCardList' },
      { title: '资产价值统计表', path: '/assetWorthStatistics' },
      { title: '房屋资产&资源统计表', path: '/resourcesReport' },
      { title: '资产使用一览表', path: '/assetUsageList' },
      { title: '有证面积不匹对核查报表', path: '/credentialsCheck' },
    ],
  },
  {
    title: '资产信息管理',
    children: [
      {
        title: '资产变更单',
        path: '/assetChangeRegister',
      },
      {
        title: '资产变动一览表',
        path: '/assetChangeView',
      },
      {
        title: '资产出库',
        path: '/assetClear',
      },
      {
        title: '资产项目管理',
        path: '/assetProjectManage',
      },
      {
        title: '资产登记',
        path: '/assetRegister',
      },
      {
        title: '资产登记一览表',
        path: '/assetCheckInView',
      },
      {
        title: '附属配套管理',
        path: '/subsidiary',
      },
      {
        title: '资产出库一览表',
        path: '/assetTable',
      },
      {
        title: '资产出库一览表详情',
        path: '/assetTable/detail',
      },
      {
        title: '资产转运营',
        path: '/assetOperating',
      },
      {
        title: '资产转运营一览表',
        path: '/listOfTransferCamps',
      },
    ],
  },
  {
    title: '房屋台账',
    children: [
      {
        title: '房屋机构视图',
        path: '/organView',
      },
      {
        title: '房屋项目视图',
        path: '/assetProjectView',
      },
      {
        title: '房屋资产视图',
        path: '/assetView',
      },
      {
        title: '楼栋视图',
        path: '/buildingView',
      },
    ],
  },
  {
    title: '车场台账',
    children: [
      {
        title: '组织机构视图',
        path: '/organCarPrakView',
      },
      {
        title: '车场项目视图',
        path: '/carPrakProjectView',
      },
      {
        title: '车场视图',
        path: '/carPrakView',
      },
      {
        title: '资产视图',
        path: '/assetCarPrakView',
      },
    ],
  },
  {
    title: '设备设施台帐',
    children: [
      {
        title: '设备设施项目视图',
        path: '/equipmentprojectview',
      },
      {
        title: '设备设施资产视图',
        path: '/equipmentview',
      },
    ],
  },
  {
    title: '基础信息管理',
    children: [
      {
        title: '资产使用方向设置',
        path: '/houseStatusConfig',
      },
      {
        title: '楼盘字典',
        path: '/buildingDict',
      },
      {
        title: '资产分类设置',
        path: '/assetClassSet',
      },
      {
        title: '资产参数配置',
        path: '/paramsConfig',
      },
      {
        title: '资产编码规则',
        path: '/assetCodingRule',
      },
      {
        title: '资产转运营参数',
        path: '/assetOperationParameters',
      },
      {
        title: '土地地图绘制',
        path: '/mapDrawLand',
      },
      {
        title: '条码管理',
        path: '/barcodeManagement',
      },
      {
        title: '资产条码',
        path: '/assetBarcode',
      },
      {
        title: '资产经营方式',
        path: '/assetManagementMode',
      },
      {
        title: '资产业务信息',
        path: '/assetBussinessInformation',
      },
      {
        title: '资产业务属性配置',
        path: '/anyAttrConfig',
      },
    ],
  },
  {
    title: '权属管理',
    children: [
      {
        title: '权证变更日志管理',
        path: '/ownershipChangeLog',
      },
      {
        title: '权属人管理',
        path: '/propertyOwnerManagement',
      },
      {
        title: '权属登记',
        path: '/ownershipRegistration',
      },
      {
        title: '权属登记一览表',
        path: '/ownershipRegisterView',
      },
      {
        title: '权证管理',
        path: '/authorityCardManagement',
      },
      {
        title: '权属概况',
        path: '/ownershipSurvey',
      },
    ],
  },
  {
    title: '账务管理',
    children: [
      {
        title: '资产入账',
        path: '/assetEntry',
      },
      {
        title: '资产估值记录',
        path: '/assetAssessRecord',
      },
      {
        title: '价值登记',
        path: '/worthRegister',
      },
      {
        title: '资产价值一览表',
        path: '/assetWorthList',
      },
    ],
  },
  {
    title: '盘点管理',
    children: [
      {
        title: '盘点任务',
        path: '/inventoryManagement/countingTask',
      },
      {
        title: '盘点执行',
        path: '/inventoryManagement/inventoryPerform',
      },
      {
        title: '盘点报告',
        path: '/inventoryManagement/inventoryReport',
      },
      {
        title: '异常管理',
        path: '/inventoryManagement/exceptionManagement',
      },
      {
        title: '盘点计划',
        path: '/inventoryPlan',
      },
    ],
  },
  {
    title: '处置管理',
    children: [
      {
        title: '资产处置一览表',
        path: '/disposalManagement/listDisposal',
      },
      {
        title: '处置登记',
        path: '/disposalRegister',
      },
      {
        title: '资产转让单',
        path: '/transfer',
      },
      {
        title: '资产转让立项',
        path: '/approvalTransferProject',
      },
      {
        title: '资产调拨',
        path: '/allot',
      },
    ],
  },
  {
    title: '呈报管理',
    children: [
      {
        title: '呈报表单',
        path: '/reportingManagement/submitForm',
      },
      {
        title: '呈报计划',
        path: '/reportingManagement/submitPlans',
      },
      {
        title: '资产呈报记录',
        path: '/reportingRecord',
      },
      {
        title: '呈报任务',
        path: '/reportTask',
      },
      {
        title: '任务查询',
        path: '/taskQuery',
      },
      {
        title: '呈报记录一览表',
        path: '/reportingList',
      },
    ],
  },
  {
    title: '土地台账',
    children: [
      {
        title: '土地资产视图',
        path: '/landAssetsView',
      },
      {
        title: '土地机构视图',
        path: '/landOrganView',
      },
      {
        title: '土地项目视图',
        path: '/landProjectView',
      },
      {
        title: '资产地图',
        path: '/assetMap',
      },
      {
        title: '土地地图',
        path: '/landAssetMap',
      },
    ],
  },
  {
    title: '资产入库',
    children: [
      {
        title: '资产入库',
        path: '/assetIn',
      },
      {
        title: '资产入库一览表',
        path: '/assetStorageView',
      },
    ],
  },
  {
    title: '资产出租',
    children: [
      {
        title: '出租登记',
        path: '/rentRegister',
      },
      {
        title: '出租收益登记',
        path: '/rentGainsRegister',
      },
      {
        title: '资产出租一览表',
        path: '/assetRentView',
      },
    ],
  },
  {
    title: '资产投资',
    children: [
      {
        title: '投资登记',
        path: '/investRegister',
      },
      {
        title: '投资收益登记',
        path: '/investGainsRegister',
      },
      {
        title: '资产投资一览表',
        path: '/assetInvestmentView',
      },
    ],
  },
  {
    title: '资产维修',
    children: [
      {
        title: '维修登记',
        path: '/repairRegister',
      },
    ],
  },
  {
    title: '使用规划',
    children: [
      { title: '资产交付管理', path: '/assetDelivery' },
      { title: '资产交付记录', path: '/assetDeliveryRecord' },
      { title: '巡查记录', path: '/patrolRecord' },
      { title: '资产债务登记', path: '/debt' },
    ],
  },
  {
    title: '资产领用',
    children: [
      { title: '领用登记', path: '/applyRegister' },
      { title: '资产领用一览表', path: '/assetApplyView' },
      { title: '归还登记', path: '/returnRegister' },
      { title: '资产归还一览表', path: '/assetReturnView' },
    ],
  },
  {
    title: '保险管理',
    children: [{ title: '保险管理', path: '/insuranceManagement' }],
  },
  {
    title: '资产项目责任人管理',
    children: [{ title: '资产项目责任人管理', path: '/projectManager' }],
  },
  {
    title: '示例：基本',
    children: [
      {
        title: '首页',
        path: '/home',
      },
      {
        title: '登录页面',
        path: '/dev/login',
      },
      {
        title: '按钮权限',
        path: '/dev/power',
      },
      // {
      //   title: '公共方法',
      //   path: '/dev/utils'
      // },
      // {
      //   title: '组织机构树',
      //   path: '/dev/empty'
      // },
      // {
      //   title: '文件 or 图片上传',
      //   path: '/dev/upload'
      // },
      // {
      //   title: '富文本编辑器',
      //   path: '/dev/editer'
      // }
    ],
  },
  // {
  //   title: '示例：表单',
  //   children: [
  //     {
  //       title: '基础表单',
  //       path: '/dev/empty'
  //     },
  //     {
  //       title: '分步表单',
  //       path: '/dev/empty'
  //     },
  //     {
  //       title: '高级表单',
  //       path: '/dev/empty'
  //     }
  //   ]
  // },
  // {
  //   title: '示例：列表',
  //   children: [
  //     {
  //       title: '查询表格',
  //       path: '/dev/empty'
  //     }
  //   ]
  // },
  // {
  //   title: '示例：详情页',
  //   children: [
  //     {
  //       title: '基础详情',
  //       path: '/dev/empty'
  //     },
  //     {
  //       title: '高级详情',
  //       path: '/dev/empty'
  //     },
  //   ]
  // },
  // {
  //   title: '示例：结果页',
  //   children: [
  //     {
  //       title: '成功',
  //       path: '/dev/empty'
  //     },
  //     {
  //       title: '失败',
  //       path: '/dev/empty'
  //     },
  //   ]
  // },
];
