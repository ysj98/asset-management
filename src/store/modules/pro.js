const state = {
  // 生产环境面包屑
  proBreadNav: [],
  // 以路由为key值存储页面需要存储的值 {'/task/mange': {a: 1}}
  routeQueryData: {},
}
const mutations = {
  // 更新面包屑数据
  updateNav (state, parms) {
    state.proBreadNav = [...parms]
  },
  // 设置routeQueryData值
  SET_ROUTE_QUERY (state, payload) {
    // key-->路径path
    // data-->缓存页面数据
    let {key, data} = payload
    if (!key || !data) {
      return
    }
    state.routeQueryData[key] = data
  }
}

export default {
  namespaced: true,
  state,
  mutations
}