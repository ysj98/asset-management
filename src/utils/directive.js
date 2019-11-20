/**
 * 描述：全局指令封装
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */
import { Power } from './power'

export default function (Vue) {
  /**
   * 功能：自定义指令，clickbody
   * 描述：点击当前元素之外的地方触发函数，适用于下拉框等点击外部关闭
   */
  Vue.directive('clickbody', {
    bind(el, binding) {
      function documentHandler(e) {
        if (el.contains(e.target)) {
          return false
        }
        if (binding.expression) {
          binding.value(e)
        }
      }
      el.__vueClickOutside__ = documentHandler
      document.addEventListener('click', documentHandler)
    },
    unbind(el) {
      document.removeEventListener('click', el.__vueClickOutside__)
      delete el.__vueClickOutside__
    }
  })

  /**
   * 功能：权限指令
   * 描述：传入指令编码，不满足权限的元素将被隐藏
   */
  Vue.directive('power', {
    // 第一次挂载报错元素的父节点，并且判断是否移除自身
    inserted (el, { value }) {
      el.next = el.nextSibling
      el.pd = el.parentNode
      if (!Power.has(value)) {
        el.parentNode.removeChild(el)
        el.isDelStatus = true
      }
    },
    // 数据更新的时候重新挂载或移除
    update (el, { value }) {
      if (Power.has(value)) {
        if (el.next) {
          el.pd.insertBefore(el, el.next)
        } else {
          el.pd.appendChild(el)
        }
        el.isDelStatus = false
      } else {
        if (el.isDelStatus) return
        el.pd.removeChild(el)
      }
    }
  })
}

