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
  popedomCode: '/uhomecp-sso/v3/propertyUser/popedomCode',
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
  // 请求楼栋单元
  getOptions: '/basic-data-api/rest-api/v1/common/getOptions',
  // 请求业态类型
  queryNodesByRootCode: '/basic-data-api/rest-api/v1/professionType/queryNodesByRootCode',
  // 建筑形态
  queryChildNodesById: '/basic-data-api/rest-api/v1/professionType/queryChildNodesById',
}

// 资产管理
export const assets = {
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
    submitChange: '/ams/assetCleanup/submitChange',
    // 资产变动-明细
    getChangeInfo: '/ams/assetCleanup/getChangeInfo',
    // 资产变动-终止交付
    stopDelivery: '/ams/assetChange/stopDelivery',
    // 房屋资产分页查询
    assetHousePage: '/ams/asset-house/page',
    // 资产变动-变动明细分页
    getChangeDetailPage: '/ams/assetCleanup/getChangeDetailPage'
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
  // 修改房屋状态
  updateHouseStatus: '/ams/houseApi/updateHouseStatus',
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
  // 位置分类Position（异步） 位置管理-位置树查询 POST
  positionSelectAsyn: '/basic-data-api/rest-api/v1/positionApi/positionSelectAsyn',
}
