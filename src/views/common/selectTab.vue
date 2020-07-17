<!--
 * @Date: 2020-05-08 10:16:59
 * @Description: 自定义tab组件
 -->
<template>
  <div class="custom-tab-box">
    <span class="custom-tab-item" :class="value===item.value&&activeType" v-for="item in list" :key="item.key" @click="keyChange(item)">
      {{item.label}}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      default: ''
    },
    // 显示列表
    list: {
      type: Array,
      default: () =>[]
    },
    activeType: {
      default: 'active'  // fancyActive
    }
  },
  data () {
    return {
    }
  },
  methods: {
    keyChange (item) {
      console.log(item)
      if (item.value !== this.value) {
        this.$emit('change', item.value)
      }
    }
  }
}
</script>
<style lang="less">
  .custom-tab-box{
    border-bottom:1px solid rgba(237,240,244,1);
    padding-left: 30px;
    background-color: #fcfcfc;
    .custom-tab-item{
      display: inline-block;
      padding: 13px 20px;
      border: 1px solid transparent;
      border-top: 2px solid transparent;
      border-radius:2px 2px 0px 0px;
      font-size: 13px;
      color: #6D7585;
      margin-bottom: -1px;
      cursor: pointer;
      transition: all 0.2s;
      &.active{
        border: 1px solid #DCE1E6;
        border-top:2px solid rgba(0,132,255,1);
        border-bottom: 1px solid #fcfcfc;
        color: #49505E;
        font-weight:bold;
      }
      &.fancyActive{
        font-size: 15px;
        border-bottom:2px solid rgba(0,132,255,1);
        color: #49505E;
        font-weight:bold;
      }
    }
  }
</style>