/*
 * @Date: 2019-11-01 09:42:51
 * @Description:
 */
import Vue from 'vue'
// import App from './App.vue'
import App from './LocalApp'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'

// 引入UI组件库
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import SG_UI from 'segi-ant'
import 'segi-ant/lib/segi-ant.css'

// 引入样式
import './assets/css/global.css'

// 引入服务
import API from './api'
import Axios from './utils/axios'
import mixins from './mixins'
// 引入开发者服务
import Dev from './dev/index'
// 引入权限控制
import Power from './utils/power'
// 引入全局指令
import Directive from './utils/directive'

import importf from './utils/file'

import UploadFile from './components/UploadFile/index.vue'
Vue.component('UploadFile', UploadFile)

Vue.mixin(mixins)
Vue.use(Antd)
Vue.use(SG_UI)
Vue.use(API)
Vue.use(Axios)
Vue.use(Dev)
Vue.use(Power)
Vue.use(Directive)
Vue.use(VueI18n)

Vue.prototype.$importf = importf

Vue.prototype.$addTitle = function (options){
  options = options || []
  options.forEach(ele=>{
    ele.title = ele.title || ele.label
  })
  return options
}
Vue.config.productionTip = false

// 定义挂载文件
const i18n = new VueI18n({
  // locale: "zh", // 语言标识 //this.$i18n.locale // 通过切换locale的值来实现语言切换
  locale: localStorage.getItem('lang') || 'zh',
  messages: {
    zh: require("./vueI18n/language-zh"), 
    hk: require("./vueI18n/language-hk"),
  },
});


const vueInstance = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
// 初始化用户数据
store.dispatch('auth/getUserInfo')
store.dispatch('getAssetType')
export default vueInstance
