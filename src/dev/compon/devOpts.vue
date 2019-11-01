<template>
  <div class="p-devOpts">
    <h3>权限</h3>
    <Item label="开启全部权限">
      <SG-Switch v-model="allPower" />
    </Item>
  </div>
</template>

<script>
// item 组件
const Item = {
  props: {
    // 显示标签
    label: {
      type: String,
      default: ''
    }
  },
  render () {
    return (
      <div class="item">
        <div class="label">{ this.label }</div>
        <div class="tool">{ this.$slots.default }</div>
      </div>
    )
  }
}
/**
 * 初始化设置项
 * @param {String} key 配置项
 */
function initOpts (key) {
  return {
    get () {
      return this.$store.state.dev.devOpts[key]
    },
    set (value) {
      this.$store.commit('dev/updateDevOpts', {
        [key]: value
      })
    }
  }
}
export default {
  components: {
    Item
  },
  data () {
    return {
      // allPower: null
    }
  },
  computed: {
    allPower: initOpts('allPower')
  },
  methods: {
  },
}
</script>