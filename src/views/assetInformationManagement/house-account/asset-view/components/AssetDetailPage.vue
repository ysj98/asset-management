<!--资产视图业务-资产视图详情页面-->
<template>
  <div class="asset_view">
    <!--基础信息部分-->
    <base-info-part/>
    <!--其它信息部分-->
    <other-info-part/>
  </div>
</template>

<script>
  import OtherInfoPart from "./components/OtherInfoPart";
  import BaseInfoPart from './components/BaseInfoPart'
  export default {
    name: 'AssetViewPage',
    components: {OtherInfoPart, BaseInfoPart},
    data () {
      return {}
    },

    methods: {}
  }
</script>

<style lang='less' scoped>
  .asset_view {
    /*抽离子组件的公共样式*/
    & /deep/ .title_div {
      margin-left: 45px;
      .ant-col-8, .ant-col-24, .ant-col-12{
        margin: 15px 0;
      }
    }
  }
</style>
