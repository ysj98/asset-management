/*
 * @Author: your name
 * @Date: 2019-12-19 14:44:17
 * @LastEditTime: 2020-07-24 17:36:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \asset-management\src\api\index.js
 */
/**
 * 描述：API服务入口
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

import * as auth from './auth'
import * as global from './global'
import * as assets from './assets'
import * as basics from './basics'
import * as building from './building'
import * as ownership from './ownership'
import * as worthRegister from './worthRegister'
import * as inventoryManagementApi from './inventoryManagementApi'
import * as disposalManagement from './disposalManagement'
import * as subsidiary from './subsidiary'
import * as reportManage from './reportManage'
import * as tableManage from './tableManage'
import * as land from './land'
const API = {
  auth,
  global,
  assets,
  ownership,
  basics,
  building,
  worthRegister,
  inventoryManagementApi,
  disposalManagement,
  subsidiary,
  reportManage,
  tableManage,
  land
}
export default {
  install (Vue) {
    Vue.prototype.$api = API
  },
  ...API
}
