// 导入组件
import com from './src'

// 为组件提供 install 安装方法，供按需引入
com.install = function (Vue) {
  Vue.component(com.name, com)
}

// 默认导出组件
export default com