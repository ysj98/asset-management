// 字典编码
import * as apiAsset from "api/assets";

import {SET_DEPRECIATION_METHOD} from '../types/platformDictTypes'
const state = {
  // 折旧方法
  DEPRECIATION_METHOD: []
};
const mutations = {
  [SET_DEPRECIATION_METHOD](state, payload) {
    state.DEPRECIATION_METHOD = payload;
  }
};

const actions = {
  getPlatformDict({ commit }, {code,type}) {
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
