/*
 * @fileName: Do not edit
 * @Author: han
 * @createTime: Do not edit
 * @desc: Do not Edit
 */
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
  popedomCode: '/uhomecp-sso/v3/propertyUser/popedomCode'
}

export const Global = {
  // 文件上传
  fileUpload: '/uhomecp-app/common/oneFileUpload.json'
}

// 基础数据接口
export const basics = {
  common: {
    // 图片预览地址
    imgStr: host.hostImg,
  },
  // 查询所有一级物业
  queryAllTopOrganByUser: '/basic-data-api/rest-api/v1/organInfo/queryAllTopOrganByUser',
}

// 资产管理
export const assets = {
  project: {
    // 图片预览地址
    getProject: '/getProject',
  }
}
// 楼盘字典
export const building = {
  // 房屋列表
  queryHouseByPage: '/ams/houseApi/queryHouseByPage',
  // 修改房屋
  updateHouse: '/ams/houseApi/updateHouse',
  // 新增房屋
  addHouse: '/ams/houseApi/addHouse',
  // 查询房屋详情
  getHouseDetail: '/ams/houseApi/getHouseDetail',
  // 修改楼栋
  updateBuild: '/ams/buildApi/updateBuild',
  // 删除楼栋
  deleteBuild: '/ams/buildApi/deleteBuild',
  // 新增楼栋
  addBuild: '/ams/buildApi/addBuild',
  // 查询楼栋详情
  getBuildDetail: '/ams/buildApi/getBuildDetail',
  // 修改楼层
  updateFloor: '/ams/floorApi/updateFloor',
  // 删除楼层
  deleteFloor: '/ams/floorApi/deleteFloor',
  // 新增楼层
  addFloor: '/ams/floorApi/addFloor',
  // 查询楼层详情
  getFloorDetail: '/ams/floorApi/getFloorDetail',
  // 修改单元
  updateUnit: '/ams/unitApi/updateUnit',
  // 删除单元
  deleteUnit: '/ams/unitApi/deleteUnit',
  // 新增单元
  addUnit: '/ams/unitApi/addUnit',
  // 查询单元详情
  getUnitDetail: '/ams/unitApi/getUnitDetail',
  // 位置分类Position（异步）
  positionSelectAsyn: '/basic-data-api/ams/position/positionSelectAsyn'
}
