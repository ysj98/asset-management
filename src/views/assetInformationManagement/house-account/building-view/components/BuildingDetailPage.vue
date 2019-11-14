<!--楼栋视图业务-楼栋视图详情页面-->
<template>
  <div class="building_detail">
    <!--基本信息-->
    <base-info-part/>
    <!--资产使用方向-->
    <asset-direct-part/>
    <!--其它信息-->
    <other-info-part/>
  </div>
</template>

<script>
  import BaseInfoPart from './components/BaseInfoPart'
  import OtherInfoPart from './components/OtherInfoPart'
  import AssetDirectPart from './components/AssetDirectPart'
  export default {
    name: 'BuildingDetailPage',
    components: { AssetDirectPart, BaseInfoPart, OtherInfoPart },
    data () {
      return {}
    },

    methods: {}
  }
</script>

<style lang='less' scoped>
  .building_detail {
    /*抽离子组件的公共样式*/
    & /deep/ .title_div {
      margin-left: 40px;
    }
  }
</style>
