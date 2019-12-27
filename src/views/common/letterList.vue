/**
 * 26个字母姓氏组件
 * @filename: letterList.vue
 * @desc: vue components file
 * @author: utaware
 * @createTime: 2019/07/18 16:44:31 星期四
 */

<template>

  <a-select
    class="letter-contain"
    :class="value ? 'isExist' : 'isEmpty'"
    dropdownClassName="select-letter"
    :dropdownStyle="dropdownStyle"
    placeholder="姓氏首字母"
    :value="value"
    :allowClear="!!value"
    :open="open"
    @change="change"
    @dropdownVisibleChange="dropdownVisibleChange"
    style="width: 140px">
    
    <div slot="dropdownRender" slot-scope="menu">

      <v-nodes :vnodes="menu" :clickHandler="clickHandler" :list="letterCodeList"></v-nodes>

    </div>

  </a-select>

</template>

<script>
// components
import { Select } from 'ant-design-vue'

export default {
  name: 'letterList',
  components: {
    ASelect: Select,
    ASelectOption: Select.Option,
    // 渲染函数
    VNodes: {
      functional: true,
      render: (h, ctx) => {
        const { list, clickHandler } = ctx.props
        return h('ul', {
          props: ctx.props.list,
          class: {
            list: true
          },
          style: { margin: '0' }
        }, list.map((v, i) => {
          return h('li', {
            props: v,
            attrs: {
              index: v
            },
            domProps: {
              innerText: v
            },
            on: {
              click: () => {
                clickHandler(v)
              }
            },
            key: v + i,
            text: v,
            class: {
              item: true
            }
          })
        }))
      }
    }
  },
  mixins: [],
  watch: {},
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      open: false,
      dropdownStyle: {
        padding: '10px',
        minWidth: '245px',
        minHeight: '100%'
      }
    }
  },
  computed: {
    // 生成A-Z的26个字母 A: 65 Z:90
    letterCodeList () {
      return Array.from({length: 26}).map((v, i) => {
        v = String.fromCharCode((i + 65).toString())
        return v
      })
    }
  },
  methods: {
    clickHandler (v) {
      this.open = false
      this.$emit('input', v)
    },
    change () {
      this.$emit('input', '')
    },
    dropdownVisibleChange (open) {
      this.open = open
    }
  },
  filters: {},
  created () {},
  mounted () {}
}
</script>

<style lang="scss">
.select-letter {
  .list {
    margin: 0;
    .item {
      display: inline-block;
      width: 32px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      &:hover {
        color: #0084FF;
        background: #F3F9FF;
      }
    }
  }
}

.isEmpty {
  /deep/ .ant-select-selection__placeholder {
    display: block !important;
  }
}
.isExist {
  /deep/ .ant-select-selection__placeholder {
    display: none !important;
  }
}
</style>
