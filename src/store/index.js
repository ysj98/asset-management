/**
 * 描述：全局状态入口
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

import Vue from "vue";
import Vuex from "vuex";
import dev from "./modules/dev";
import auth from "./modules/auth";
import pro from "./modules/pro";
import asset from "./modules/asset";
import * as apiAsset from "@/api/assets";

Vue.use(Vuex);
const SET_ASSET_TYPE_CODE = "set_asset_type_code";
const SET_ASSET_TYPE_OPTIONS = "set_asset_type_options";
export default new Vuex.Store({
  state: {
    ASSET_TYPE_STRING: {
      YARD: "车场",
      LAND: "土地",
      HOUSE: "房屋",
      EQUIPMENT: "设备设施"
    },
    ASSET_TYPE_CODE: {
      YARD: "",
      LAND: "",
      HOUSE: "",
      EQUIPMENT: ""
    },
    ASSET_TYPE_OPTIONS: {}
  },
  mutations: {
    [SET_ASSET_TYPE_CODE](state, payload) {
      state.ASSET_TYPE_CODE = payload;
    },
    [SET_ASSET_TYPE_OPTIONS](state, payload) {
      state.ASSET_TYPE_OPTIONS = payload;
    }
  },
  actions: {
    getAssetType({ commit, state }) {
      apiAsset.platformDict({ code: "asset_type" }).then(res => {
        if (res.data.code === "0") {
          let data = res.data.data;
          commit(SET_ASSET_TYPE_OPTIONS, data);
          const assetTypeCode = {};
          Object.keys(state.ASSET_TYPE_STRING).forEach(ele => {
            const tempRes = data.filter(
              item => item.name === state.ASSET_TYPE_STRING[ele]
            );
            if (!tempRes.length) {
              console.error(
                "资产类型字典值 对应不上，请查看当前环境平台字典编码 asset_type"
              );
              assetTypeCode[ele] = "";
            } else {
              assetTypeCode[ele] = tempRes[0].value;
            }
          });
          commit(SET_ASSET_TYPE_CODE, assetTypeCode);
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
  modules: {
    auth,
    dev,
    pro,
    asset
  }
});
