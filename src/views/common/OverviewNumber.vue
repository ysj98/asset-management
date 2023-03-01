<!--
 * @Date: 2019-11-05 13:36:19
 * @Author: LaoWang
 * @Description: 数字概览组件
 -->
<template>
  <div class="overview_num" v-if="numList.length">
    <div
      v-for="(item, i) in numList"
      :key="item.title"
      @[eventName]="handleClick(item, i)"
      :class="['view_item', isEmit && i === current ? 'current_selected' : '']"
      :style="{
        width: itemWidth,
        cursor: isEmit ? 'pointer' : 'default',
        backgroundColor: item.bgColor || '',
      }"
    >
      <div :style="{ 'font-size': '14px', color: item.fontColor || '#fff', 'margin-bottom': '10px' }">{{ item.title }}</div>
      <div :style="{ 'font-size': '20px', color: item.fontColor || '#324057', 'font-weight': 'bold' }">{{ format(item.value) }}</div>
    </div>
  </div>
</template>

<script>
import { getFormat } from 'utils/utils';
export default {
  name: 'OverviewNumber',
  props: {
    numList: {
      type: Array,
      default: () => [],
    },
    // 是否可点击
    isEmit: {
      type: Boolean,
      default: () => false,
    },
  },
  // numList: [
  //   {title: '所有资产项目', value: 0}, {title: '待审核', value: 0, bgColor: '#e4393c', fontColor: 'white'}
  // ] // 概览数据,如是格式，title 标题，value 数值，bgColor 背景色，fontColor 字体颜色
  data() {
    return {
      current: null, // 当前选中的区域下标,
      eventName: this.isEmit ? 'click' : null, // 是否绑定click事件
      itemWidth: `${Math.floor(100000 / this.numList.length) / 1000}%`, // 每个方块的宽度
    };
  },

  methods: {
    // 格式化
    format(val) {
      return getFormat(val);
    },
    // 点击事件
    handleClick(item, index) {
      // item: 当前区域的信息，i：当前区域的位置下标
      let { current } = this;
      let i = current === index ? null : index;
      this.current = i;
      this.isEmit && this.$emit('click', { item: i ? item : {}, i });
    },
  },
};
</script>

<style lang="less" scoped>
.overview_num {
  /*height: 82px;*/
  /*margin: 10px 0;*/
  border: 1px solid #eff2f7;
  border-right: none;
  .view_item {
    height: 100%;
    padding: 18px 0;
    text-align: center;
    display: inline-block;
    border-right: 1px solid #eff2f7;
  }
  .current_selected {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      top: -16px;
      left: -16px;
      border: 15px solid transparent;
      border-top: 15px solid #0084ff;
      transform: rotate(135deg);
    }
  }
}
</style>
