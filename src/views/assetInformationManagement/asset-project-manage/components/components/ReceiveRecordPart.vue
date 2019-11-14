<!--资产项目管理业务-资产项目管理详情页面-接收记录组件-->
<template>
  <div class="step_line">
    <!--接收记录-->
    <SG-Title title="接收记录" noMargin/>
    <div class="title_div">
      <div class="step_item" @click="getPosition($event)" v-for="(item, i) in stepList" :key="i">
        <a-icon type="arrow-right" class="step_icon" :style="`background-color: ${item.isCurrent ? '#0084FF' : '#CFD8DC'}`"/>
        <div :style="`display: inline-block; color: ${item.isCurrent ? '#0084FF' : '#CFD8DC'}`">
          <div style="font-size: 14px">第{{i + 1}}步</div>
          <div style="font-size: 12px">{{item.desc}}</div>
        </div>
      </div>
      <!--详情部分-->
      <div class="detail">
        <a-icon type="up" class="icon" :style="{left}"/>
        <a-row class="row">
          <a-col :span="8">任务描述：{{1111}}</a-col>
          <a-col :span="8">负责人：{{1111}}</a-col>
          <a-col :span="8">计划完成日期：{{1111}}</a-col>
        </a-row>
        <a-row class="row">
          <a-col :span="8">实际完成日期：{{1111}}</a-col>
          <a-col :span="8">当前进度反馈：{{1111}}</a-col>
          <a-col :span="8">实际完成情况说明：{{1111}}</a-col>
        </a-row>
        <a-row class="row">
          <a-col :span="1">附件列表:</a-col>
          <a-col :span="22" style="margin: 0">
            <a-row class="attachments">
              <a-col title="点击下载" :span="24">实际完成日期：{{1111}}</a-col>
              <a-col :span="24">当前进度反馈：{{1111}}</a-col>
              <a-col :span="24">实际完成情况说明：{{1111}}</a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StepLine',
    data () {
      return {
        left: '16px', // 接收记录详情指示箭头左偏移量
        stepList: [{desc: '你个达萨比'}, {desc: '你个达萨比', isCurrent: true}, {desc: '你个达萨比'}]
      }
    },
    
    methods: {
      // 获取鼠标点击的位置
      getPosition (e) {
        this.left = `${e.currentTarget.offsetLeft - 12 || 16}px`
      }
    }
  }
</script>

<style lang='less' scoped>
  .step_line {
    position: relative;
    .step_item {
      cursor: pointer;
      margin: 5px 24px;
      display: inline-block;
      .step_icon {
        color: white;
        padding: 5px;
        font-size: 16px;
        margin-right: 10px;
        border-radius: 50%;
        vertical-align: super;
        /*background-color: #0084FF VS #CFD8DC;*/
      }
      &:hover div{
        color: #0084FF;
      }
    }
    .detail {
      padding: 15px 20px;
      min-height: 65px;
      position: relative;
      margin: 15px 0 15px 15px;
      border: 1px solid #F0F0F0;
      box-shadow:0 2px 6px 0 rgba(0,132,255,0.2);
      .icon {
        /*transition: left 0.3s;*/
        top: -14px;
        color: #F0F0F0;
        font-size: 18px;
        position: absolute;
        background-color: white;
      }
      .row {
        & /deep/ div {
          margin: 5px 0;
        }
        .attachments {
          margin: 0;
          color: #0084FF;
          cursor: pointer;
        }
      }
    }
  }
</style>
