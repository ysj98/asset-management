<!--优化文本过长时影响布局的展示组件，比如 table 首列固定但内容过长会影响tr布局错位-->
<!--!!!不支持传递事件-->
<template>
  <div :style="`width: ${width}px`">
    <a-tooltip v-if="isShowTooltip" overlayClassName="tooltip_self">
      <template slot="title">{{text}}</template>
      <div :style="`cursor: default; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: ${width}px`">
        {{text}}
      </div>
    </a-tooltip>
    <div v-else>{{text}}</div>
  </div>
</template>

<script>
  export default {
    props: {
      // 文本显示的给定宽度，当 文本完全显示时宽度 > width 会出现 ...
      width: {
        type: [Number, String],
        default: () => 150
      },

      // 字体大小，用于计算文本完全显示时宽度，当 完全显示宽度 > width 时鼠标放上显示tooltip
      fontSize: {
        type: [Number, String],
        default: () => 12
      },

      // 要显示的文本内容
      text: {
        type: [Number, String],
        default: () => ''
      }
    },
    name: 'TooltipText',
    data () {
      return {
        // 是否显示tooltip
        isShowTooltip: false
      }
    },

    created () {
      const {text, fontSize, width} = this
      this.isShowTooltip = Number(fontSize) * ((text || '').length) >= width
    }
  }
</script>

<style lang='less'>
  .tooltip_self .ant-tooltip-content {
    .ant-tooltip-inner {
      background-color: rgba(255, 255, 255, 1);
      color: #49505E;
      box-shadow: 0 2px 8px rgba(73, 80, 94, 0.15);
    }
    .ant-tooltip-arrow {
      border-top-color: rgba(255, 255, 255, 0.75);
    }
  }
</style>
