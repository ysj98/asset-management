// 资产视图store module
const state = {
  // 楼栋视图
  buildingView: {
    record: {}, // 当前列表行数据
    organId: '', // 当前页面查询条件-组织机构Id
    buildingId: '' // 当前页面查询条件-楼栋Id
  }
}

const mutations = {
  changeBuildingViewInfo (state, data) {
    state.buildingView = {...data}
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
