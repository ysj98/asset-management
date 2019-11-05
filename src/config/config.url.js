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
  }
}
