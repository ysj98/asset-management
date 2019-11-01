<template>
  <div class="step-content">
    <div class="step-mark">{{content.step}}</div>
    <div class="step-item">
      <div class="item-title">{{content.title}}</div>
      <div class="item-content">{{content.content}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 一行数据 { title: '第一步', content: '选择分类', step: '1'}
    content: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
<style lang="less" scoped>
.step-content{
  display: flex;
  color: #0084FF;
  line-height: 16px;
  .step-mark{
    height:26px;
    background:rgba(0,132,255,1);
    border-radius:50%;
    flex: 0 0 26px;
    color: #fff;
    text-align: center;
    margin-right: 10px;
    line-height: 26px;
    margin-top: 3px;
  }
  .step-item{
    .item-title{
      line-height: 16px;
    }
  }
}
</style>
