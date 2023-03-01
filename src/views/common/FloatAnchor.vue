<!--页面较长时，快捷导航组件，会固定在父组件页面左上角-->
<!--支持双向v-model传递，<float-anchor v-model="someNodeId"/>,值为锚点节点的id值,可根据需要监听-->
<!--
  使用时示例：
  <template>
    <div>                     // template下根节点，FloatAnchor 须放在根节点下
      <float-anchor/>
      <div>                   // FloatAnchor的兄弟节点，只能有一个
        <div id="aaa"></div>  // 锚点元素 1, 可以为组件元素
        <div id="bbb"></div>  // 锚点元素 2, 可以为组件元素
        <div id="ccc"></div>  // 锚点元素 3, 可以为组件元素
        <div id="ddd"></div>  // 锚点元素 4, 可以为组件元素
        ...
      </div>
    </div>
  </template>
 -->
<template>
  <div class="float_anchor" id="float_anchor">
    <div v-for="item in anchorList" :key="item.id" @click="selectItem(item.id)" :class="['anchor_item', { item_active: selectedId === item.id }]">
      {{ item.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatAnchor',
  props: {
    anchorList: {
      type: Array,
      default: () => [
        // 示例 { title: '标题', id: 'DOMNodeID' }
      ],
    },
    value: {
      type: [String, Number],
      default: () => '',
    },
  },
  data() {
    return {
      selectedId: '', // 选中的锚点Id
      timeoutId: 0, // 监听页面滚动的定时器ID
    };
  },

  mounted() {
    const { anchorList, value } = this;
    this.selectedId = value || (anchorList[0] ? anchorList[0].id : '');
    let div = document.getElementById('float_anchor');
    let { offsetWidth, offsetHeight } = div;
    div.style.marginTop = `-${offsetHeight}px`;
    if (div.parentElement) {
      // 设置父元素定位
      div.parentElement.style = 'postion: relative; height: 100%;';
    }
    let sibling = div.nextElementSibling;
    if (sibling) {
      // 设置兄弟元素样式
      sibling.style = `padding-right: 40px; margin-left: ${offsetWidth + 80}px; height: 100%; overflow-y: auto;`;
      // 监听兄弟元素滚动
      sibling.onscroll = this.calcScrollHeight;
    }
  },

  watch: {
    value: function (val) {
      this.selectedId = val;
    },
  },

  methods: {
    // 跳转到指定锚点
    jumpTo(id) {
      let node = id ? document.getElementById(id) : '';
      if (node) {
        let parentNode = node.parentNode;
        parentNode.scrollTop = node.offsetTop - 60;
      }
      // node && node.scrollIntoView();
    },

    // 计算兄弟元素滚动高度
    calcScrollHeight(e) {
      let _this = this;
      let { timeoutId, anchorList } = _this;
      timeoutId && clearTimeout(timeoutId);
      this.timeoutId = setTimeout(() => {
        let {
          target: { scrollTop },
        } = e;
        for (let obj of anchorList) {
          let id = obj.id;
          let node = id ? document.getElementById(id) : '';
          if (node && node.offsetTop + 50 > scrollTop) {
            _this.selectedId = id;
            break;
          }
        }
      }, 500);
    },

    // 选中锚点时
    selectItem(id) {
      this.selectedId = id;
      this.$emit('input', id); // 用于组件v-model
      this.jumpTo(id);
    },
  },
};
</script>

<style lang="less" scoped>
.float_anchor {
  position: sticky;
  margin-left: 50px;
  top: 30px;
  width: 144px;
  z-index: 999;
  color: #6d7585;
  font-size: 15px;
  overflow: hidden;
  border-radius: 8px;
  padding-bottom: 50px;
  background: rgba(242, 242, 242, 1);
  .anchor_item {
    cursor: pointer;
    color: #6d7585;
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
  .item_active,
  .anchor_item:hover {
    color: #0084ff;
    font-weight: bold;
    background: rgba(236, 246, 255, 1);
    &:before {
      border-left-color: #0084ff;
    }
  }
}
</style>
