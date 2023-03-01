/*
 * @Date: 2019-11-01 09:42:51
 * @Description:
 */
import Vue from 'vue';
// import App from './App.vue'
import App from './LocalApp';
import router from './router';
import store from './store';

// 引入UI组件库
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import SG_UI from 'segi-ant';
import 'segi-ant/lib/segi-ant.css';

// 引入样式
import './assets/css/global.css';

// 引入服务
import API from './api';
import Axios from './utils/axios';
import mixins from './mixins';
// 引入开发者服务
import Dev from './dev/index';
// 引入权限控制
import Power from './utils/power';
// 引入全局指令
import Directive from './utils/directive';

import importf from './utils/file';

import UploadFile from './components/UploadFile/index.vue';
Vue.component('UploadFile', UploadFile);

Vue.mixin(mixins);
Vue.use(Antd);
Vue.use(SG_UI);
Vue.use(API);
Vue.use(Axios);
Vue.use(Dev);
Vue.use(Power);
Vue.use(Directive);

Vue.prototype.$importf = importf;

Vue.prototype.$addTitle = function (options) {
  options = options || [];
  options.forEach((ele) => {
    ele.title = ele.title || ele.label;
  });
  return options;
};
Vue.config.productionTip = false;

import { textReplace } from '@/utils/textReplace';
Vue.prototype.$textReplace = textReplace;

const vueInstance = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
// 初始化用户数据
store.dispatch('auth/getUserInfo');
store.dispatch('getAssetType');
export default vueInstance;
