<!--楼栋视图业务-楼栋视图详情页面-->
<template>
  <div class="building_detail">
    <!--<SG-Button icon="rollback" style="position: absolute; top: 10px; right: 30px; z-index: 999" @click="$router.back()">-->
      <!--返回-->
    <!--</SG-Button>-->
    <!--基本信息-->
    <base-info-part v-if="assetHouseId" :houseId="assetHouseId"/>
    <!--资产使用方向-->
    <asset-direct-part v-if="assetHouseId" :houseId="assetHouseId" :organId="organId"/>
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
      return {
        organId: '', // 组织机构id
        assetHouseId: '' // 房间id
      }
    },

    methods: {},

    created () {
      const { organId, assetHouseId } = this.$route.query
      Object.assign(this, {
        organId, assetHouseId
      })
    }
  }
</script>

<style lang='less' scoped>
  .building_detail {
    position: relative;
    /*抽离子组件的公共样式*/
    & /deep/ .title_div {
      margin-left: 40px;
    }
  }
</style>
