const state = {
  // 面包屑
  BreadNav: [],
  // 开发菜单打开状态
  openMenuStatus: true,
  // 开发环境配置
  devOpts: {
    allPower: false
  }
}

const mutations = {
  // 更新面包屑数据
  update (state, parms) {
    state.BreadNav = parms
  },
  // 更新菜单状态
  updateMenuStatus (state, parms) {
    state.openMenuStatus = parms
  },
  // 更新开发环境配置
  updateDevOpts (state, parms) {
    state.devOpts = Object.assign(state.devOpts, parms)
    window.sessionStorage.setItem('devOpts', JSON.stringify(state.devOpts))
  }
}

// 初始化开发配置
let devOpts = JSON.parse(window.sessionStorage.getItem('devOpts') || '{}')
mutations.updateDevOpts(state, devOpts)

export default {
  namespaced: true,
  state,
  mutations
}