/**
 * 描述：权限系统，将权限对象绑定到 Vue 原型上，供在组件中使用 this.$power 调用。
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

import store from './../store';
export const Power = {
  /**
   * 查询是否拥有某权限
   * @param  {...any} codes 权限编码，可以传入一个或者多个权限编码
   */
  has(...codes) {
    // 如果开发环境配置了全部权限，则全部返回为 true
    if (process.env.NODE_ENV === 'development') {
      return true
    }
    // 判断用户权限编码中是否包含权限
    return codes.every(function (el) {
      return store.state.auth.power.includes(`,${el},`);
    });
  },
};

/**
 * 是否拥有开发环境全部权限
 */
function isDevAllPower() {
  return store.state.dev.devOpts.allPower;
}

export default function (Vue) {
  // 绑定至 Vue 原型，组件中使用 this.$power 调用
  Vue.prototype.$power = Power;
}
