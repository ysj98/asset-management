<!--
 * @Date: 2019-11-05 13:36:19
 * @Author: LaoWang
 * @Description: 数字概览组件
 -->
<template>
  <div class="overview_num" v-if="numList.length">
    <div
      class="view_item"
      :key="item.title"
      v-for="item in numList"
      :style="{'background-color': item.bgColor || '', 'width': `${(100 / numList.length).toFixed(3)}%`}"
    >
      <p :style="{'font-size': '12px', 'color': item.fontColor || '#fff'}">{{item.title}}</p>
      <p :style="{'font-size': '16px', color: item.fontColor || '#fff', 'font-weight': 'bold'}">{{item.value}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OverviewNumber',
    props: ['numList']
    // numList: [
    //   {title: '所有资产项目', value: 0}, {title: '待审核', value: 0, bgColor: '#e4393c', fontColor: 'white'}
    // ] // 概览数据,如是格式，title 标题，value 数值，bgColor 背景色，fontColor 字体颜色
  }
</script>

<style lang='less' scoped>
  .overview_num {
    height: 83px;
    margin: 10px 0;
    border: 1px solid #EFF2F7;
    border-right: none;
    .view_item {
      height: 100%;
      padding-top: 14px;
      text-align: center;
      display: inline-block;
      border-right: 1px solid #EFF2F7;
    }
  }
</style>
