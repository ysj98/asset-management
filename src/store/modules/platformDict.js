// 字典编码
import * as apiAsset from "api/assets";

import {
  SET_DEPRECIATION_METHOD,
  SET_AMS_USE_DIRECTION,
  SET_EQUIPMENT_CODE_SUB,
  SET_PARKING_OBJ_TYPE,
  SET_PARKING_PLACE_RESOURCE_TYPE
} from "../types/platformDictTypes";
const state = {
  // 折旧方法
  DEPRECIATION_METHOD: [],
  // 使用方向
  AMS_USE_DIRECTION: [],
  // 专业设备
  EQUIPMENT_CODE_SUB: [],
  // 车位分类
  PARKING_OBJ_TYPE:[],
  // 车场分类
  PARKING_PLACE_RESOURCE_TYPE: []
};
const mutations = {
  [SET_DEPRECIATION_METHOD](state, payload) {
    state.DEPRECIATION_METHOD = payload;
  },
  [SET_AMS_USE_DIRECTION](state, payload) {
    state.AMS_USE_DIRECTION = payload;
  },
  [SET_EQUIPMENT_CODE_SUB](state, payload) {
    state.EQUIPMENT_CODE_SUB = payload;
  },
  [SET_PARKING_OBJ_TYPE](state,payload){
    state.PARKING_OBJ_TYPE = payload
  },
  [SET_PARKING_PLACE_RESOURCE_TYPE](state,payload){
    state.PARKING_PLACE_RESOURCE_TYPE = payload
  },
};

const actions = {
  getPlatformDict({ commit }, { code, type }) {
    apiAsset.platformDict({ code: code }).then(res => {
      if (res.data.code === "0") {
        let data = res.data.data;
        commit(type, data);
      } else {
        this.$message.error(res.data.message);
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
