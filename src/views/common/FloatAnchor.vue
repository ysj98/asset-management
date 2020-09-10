<!--页面较长时，快捷导航组件，会固定在父组件页面左上角-->
<!--通过绝对定位固定页面左侧，父页面要设置 ** position: relative **-->
<!--待完善，不可用-->
<template>
  <div class="left_anchor" id="left_anchor">
    <div
      v-for="item in anchorList"
      :key="item.id"
      @click="selectItem(item.id)"
      :class="['anchor_item', { 'item_active': selectedId === item.id }]"
    >
      {{item.title}}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LeftAnchor',
    props: {
      anchorList: {
        type: Array,
        default: () => [
          // 示例 { title: '标题', id: 'DOMNodeID' }
        ]
      },
      value: {
        type: [String, Number],
        default: () => ''
      }
    },
    data () {
      return {
        selectedId: '', // 选中的锚点Id
      }
    },

    mounted () {
      const {anchorList, value} = this
      this.selectedId = value || (anchorList[0] ? anchorList[0].id : '')
      let div = document.getElementById('left_anchor')
      let {offsetWidth, offsetHeight} = div
      div.style.marginTop = `-${offsetHeight}px`
      if (div.parentElement) {
        // div.parentElement.style = 'postion: relative'
      }
      if (div.nextElementSibling) {
        // div.nextElementSibling.style.marginLeft = `${offsetWidth + 48}px; height: 100%; overflow-y: auto`
        // div.nextElementSibling.onscroll = this.calcScrollHeight
      }
    },

    watch: {
      value: function (val) {
        this.selectedId = val
      }
    },

    methods: {
      // 计算父元素滚动高度
      calcScrollHeight (e) {
        debugger
        let _this = this
        let {timeoutId, anchorList} = _this
        timeoutId && clearTimeout(timeoutId)
        this.timeoutId = setTimeout(() => {
          let {target: {scrollTop}} = e
          for (let obj of anchorList) {
            if (obj.offset + 50 > scrollTop) {
              _this.anchorId = obj.id
              break
            }
          }
        }, 500)
      },

      // 选中锚点时
      selectItem (id) {
        this.selectedId = id
        this.$emit('input', id) // 用于组件v-model
        this.$emit('jumpTo', id) // 用于传递动作
      }
    }
  }
</script>

<style lang='less' scoped>
  .left_anchor {
    position: sticky;
    left: 0;
    top: 70px;
    width: 144px;
    color: #6D7585;
    font-size: 15px;
    border-radius: 8px;
    overflow: hidden;
    padding-bottom: 50px;
    background: rgba(242, 242, 242, 1);
    .anchor_item {
      cursor: pointer;
      color: #6D7585;
      padding: 18px 0 17px;
      &:before {
        content: '';
        height: 14px;
        border-left: 4px transparent solid;
        border-radius: 2px;
        display: inline-block;
        margin-right: 16px;
      }
    }
    .item_active, .anchor_item:hover {
      color: #0084FF;
      font-weight: bold;
      background: rgba(236,246,255,1);
      &:before {
        border-left-color: #0084FF;
      }
    }
  }
</style>
