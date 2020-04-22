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
      :style="{'background-color': item.bgColor || '', 'width': `${Math.floor(100000 / numList.length) / 1000}%`}"
    >
      <div :style="{'font-size': '14px', 'color': item.fontColor || '#fff', 'margin-bottom': '10px'}">{{item.title}}</div>
      <div :style="{'font-size': '20px', color: item.fontColor || '#324057', 'font-weight': 'bold'}">{{item.value}}</div>
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
    /*height: 82px;*/
    /*margin: 10px 0;*/
    border: 1px solid #EFF2F7;
    border-right: none;
    .view_item {
      height: 100%;
      padding: 18px 0;
      text-align: center;
      display: inline-block;
      border-right: 1px solid #EFF2F7;
    }
  }
</style>
