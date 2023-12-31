/*
 * @Author: your name
 * @Date: 2019-12-19 14:44:17
 * @LastEditTime: 2022-07-20 15:06:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \asset-management\src\api\index.js
 */
/**
 * 描述：API服务入口
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

import * as auth from './auth';
import * as global from './global';
import * as assets from './assets';
import * as basics from './basics';
import * as building from './building';
import * as ownership from './ownership';
import * as worthRegister from './worthRegister';
import * as inventoryManagementApi from './inventoryManagementApi';
import * as disposalManagement from './disposalManagement';
import * as subsidiary from './subsidiary';
import * as reportManage from './reportManage';
import * as tableManage from './tableManage';
import * as land from './land';
import * as delivery from './delivery';
import * as publicCode from './publicCode';
import * as useManage from './useManage';
import * as assetRent from './assetRent';
import * as assetInvest from './assetInvest';
import * as paramsConfig from './paramsConfig';
import * as dataCenter from './dataCenter';
import * as codeRule from './codeRule';
import * as attrConfig from './attrConfig';
import * as barCode from './barCode';
import * as assetOperationMode from './assetOperationMode';
import * as assetBussinessInformation from './assetBussinessInformation';
import * as drawMap from './drawMap';
import * as operationParams from './operationParams';
import * as toOperation from './toOperation';
import * as approve from './approve';
import * as transfer from './transfer';
import * as bpm from './bpm';
import * as equipmentview from './equipmentview';
import * as carPark from './carPark';
import * as assetInsurance from './assetInsurance';
import * as houseStatusConfig from './houseStatusConfig';
import * as projectManager from './projectManager';
import * as assetUsageList from './assetUsageList';
import * as debt from './debt';
import * as allot from './allot';
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
  land,
  delivery,
  publicCode,
  useManage,
  assetRent,
  assetInvest,
  paramsConfig,
  dataCenter,
  codeRule,
  barCode,
  assetOperationMode,
  assetBussinessInformation,
  attrConfig,
  drawMap,
  operationParams,
  toOperation,
  approve,
  transfer,
  bpm,
  equipmentview,
  carPark,
  assetInsurance,
  houseStatusConfig,
  projectManager,
  assetUsageList,
  debt,
  allot,
};
export default {
  install(Vue) {
    Vue.prototype.$api = API;
  },
  ...API,
};
