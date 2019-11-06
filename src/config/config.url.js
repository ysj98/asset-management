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
  }
}
