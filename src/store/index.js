/**
 * 描述：全局状态入口
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

import Vue from 'vue';
import Vuex from 'vuex';
import dev from './modules/dev';
import auth from './modules/auth';
import pro from './modules/pro';
import asset from './modules/asset';
import bpm from './modules/bpm';
import platformDict from './modules/platformDict';
import * as apiAsset from '@/api/assets';

Vue.use(Vuex);
const SET_ASSET_TYPE_CODE = 'set_asset_type_code';
const SET_ASSET_TYPE_OPTIONS = 'set_asset_type_options';
const SET_ASSET_TYPE_STRING = 'set_asset_type_strings';

// 资产类型 相关变量基于此常量，如果 车场、土地、房屋、设备设施 四种类型是硬编码，与所在环境平台字典中的文字必须要一致
const ASSET_TYPE_STRING_ENUM = {
  YARD: '车场',
  LAND: '土地',
  HOUSE: '房屋',
  EQUIPMENT: '设备设施',
  车场: 'YARD',
  土地: 'LAND',
  房屋: 'HOUSE',
  设备设施: 'EQUIPMENT',
};

export default new Vuex.Store({
  state: {
    // 硬编码
    // todo: 待优化: 优化代码执行逻辑，保证所有页面初始化之前 资产分类数据已经加载完毕，而不是像当前采用硬编码的形式
    ASSET_TYPE_STRING: {
      YARD: '车场',
      LAND: '土地',
      HOUSE: '房屋',
      EQUIPMENT: '设备设施',
    },
    ASSET_TYPE_CODE: {
      YARD: '5',
      LAND: '4',
      HOUSE: '1',
      EQUIPMENT: '3',
    },
    ASSET_TYPE_OPTIONS: {},
  },
  mutations: {
    [SET_ASSET_TYPE_STRING](state, payload) {
      state.ASSET_TYPE_STRING = payload;
    },
    [SET_ASSET_TYPE_CODE](state, payload) {
      state.ASSET_TYPE_CODE = payload;
    },
    [SET_ASSET_TYPE_OPTIONS](state, payload) {
      state.ASSET_TYPE_OPTIONS = payload;
    },
  },
  actions: {
    getAssetType({ commit }) {
      apiAsset.platformDict({ code: 'asset_type' }).then(
        (res) => {
          if (res.data.code === '0') {
            let data = res.data.data;
            commit(SET_ASSET_TYPE_OPTIONS, data);
            const assetTypeCode = {};
            const assetTypeString = {};
            data.forEach((ele) => {
              if (ASSET_TYPE_STRING_ENUM[ele.name]) {
                assetTypeString[ASSET_TYPE_STRING_ENUM[ele.name]] = ele.name;
              }
            });
            console.log('assetTypeString', assetTypeString);
            commit(SET_ASSET_TYPE_STRING, assetTypeString);

            Object.keys(assetTypeString).forEach((ele) => {
              const tempRes = data.filter((item) => item.name === assetTypeString[ele]);
              assetTypeCode[ele] = tempRes[0].value;
              // if (!tempRes.length) {
              //   console.error(
              //     "资产类型字典值 对应不上，请查看当前环境平台字典编码 asset_type"
              //   );
              //   assetTypeCode[ele] = "";
              // } else {
              //   assetTypeCode[ele] = tempRes[0].value;
              // }
            });
            console.log('assetTypeCode', assetTypeCode);
            commit(SET_ASSET_TYPE_CODE, assetTypeCode);
          } else {
            this.$message.error(res.data.message);
          }
        },
        (reason) => {
          console.error('初始化资产分类出错，看到此小时请刷新');
          console.error(reason);
        }
      );
    },
  },
  modules: {
    auth,
    dev,
    pro,
    asset,
    platformDict,
    bpm,
  },
});
