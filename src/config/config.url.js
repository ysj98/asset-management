/**
 * 描述：URL 接口地址配置
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */
import host from './config.base.js'

let mock = process.env.NODE_ENV === 'production' ? '' : ''
mock = ''
export const User = {
  // 登录
  login: '/uhomecp-sso/v3/propertyUser/login',
  // 获取用户数据
  getUserData: '/uhomecp-sso/v3/propertyUser/profile',
  // 获取菜单数据
  menus: '/uhomecp-sso//v3/propertyUser/menus',
  // 获取权限数据
  popedomCode: '/uhomecp-sso/v3/propertyUser/popedomCode',
}

export const Global = {
  // 文件上传
  fileUpload: '/uhomecp-app/common/oneFileUpload.json'
}

// 数据中心接口
export const basics = {
  common: {
    // 图片预览地址
    imgStr: host.hostImg,
  }
}
// 资产管理
export const assets = {
  // 项目部分接口
  project: {
    // 图片预览地址
    getProject: '/getProject',
    // 异步组织机构树 组织机构管理 POST
    queryAsynOrganByUserId: '/basic-data-api/rest-api/v1/organApi/queryAsynOrganByUserId'
  },
  // 资产变动
  management: {
    // 资产变动-一览表-分页列表
    getChangeSchedulePage: '/ams/assetCleanup/getChangeSchedulePage',
    // 资产变动-详情
    getChangeDetail: '/ams/assetCleanup/getChangeDetail',
    // 资产变动-一览表-导出
    exportChangeScheduleList: '/ams/assetCleanup/exportChangeScheduleList',
    // 资产变动-分页列表
    getChangePage: '/ams/assetCleanup/getChangePage',
    // 资产变动-删除
    deleteChange: '/ams/assetChange/deleteChange',
    // 资产变动-审批
    approveChange: '/ams/assetChange/approveChange',
    // 资产变动-导入
    importChange: '/ams/assetChange/importChange',
    // 资产变动-导出
    exportChange: '/ams/assetChange/exportChange',
    // 资产变动-新增编辑
    updateInsertChange: '/ams/assetCleanup/updateInsertChange',
    // 资产变动-明细
    getChangeInfo: '/ams/assetCleanup/getChangeInfo',
    // 资产变动-终止交付
    stopDelivery: '/ams/assetChange/stopDelivery'
  },
  // 资产清理
  assetClear: {
    // 资产清理-分页列表
    getCleanupPage: '/ams/assetCleanup/getCleanupPage',
    // 资产清理-删除
    deleteCleanup: '/ams/assetCleanup/deleteCleanup',
    // 资产清理-审批
    approvalCleanup: '/ams/assetCleanup/approvalCleanup',
    // 资产清理-新增编辑保存
    submitCleanup: '/ams/assetCleanup/submitCleanup',
    // 资产清理-编辑查询明细
    getCleanupInfo: '/ams/assetCleanup/getCleanupInfo',
    // 资产清理-详情
    getCleanupDetail: '/ams/assetCleanup/getCleanupDetail'
  },
  // 资产分类设置
  assetClassSet: {
    // 资产分类设置-资产分类列表
    getPage: '/categoryCfg/getPage',
    // 资产分类设置-导出资产分类列表
    exportList: '/categoryCfg/export',
    // 资产分类设置-修改资产分类
    update: '/categoryCfg/update',
    // 资产分类设置-修改资产分类状态
    updateStatus: '/categoryCfg/updateStatus',
    // 资产分类设置-获取资产分类详情
    getDetail: '/categoryCfg/getDetail'
  }
}
