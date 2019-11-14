/**
 * 描述：开发菜单配置
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */
export default [
  {
    title: '业务菜单',
    children: [
      {
        title: '楼盘字典',
        path: '/buildingDict'
      },
      {
        title: '资产变动',
        path: '/assetChange'
      },
      {
        title: '资产清理',
        path: '/assetClear'
      },
      {
        title: '资产分类设置',
        path: '/assetClassSet'
      },
      {
        title: '资产视图',
        path: '/assetView'
      },
      {
        title: '楼栋视图',
        path: '/buildingView'
      },
      {
        title: '资产项目管理',
        path: '/assetProjectManage'
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
